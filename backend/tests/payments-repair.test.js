// Rabbora Living — tests for the paid + pending repair (services/paymentService.js).
//
// These tests do NOT need a database or a Stripe account. The database and the
// Stripe client are replaced, only inside this file, with a small in-memory
// fake. Nothing is connected, nothing is written anywhere real, and no keys
// are read. Run them with:  npm test   (in backend/)

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// The payment service loads the session settings, which refuse to start
// without SESSION_SECRET. This placeholder exists only in this test process.
if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const db = require("../config/db");
const stripeConfig = require("../config/stripe");
const paymentService = require("../services/paymentService");

// ---------- in-memory fake of the orders table ----------

const USER = { id: 3, role: "customer" };

function makeOrder(over = {}) {
  return {
    id: 7,
    order_number: "RB-T-0001",
    user_id: USER.id,
    status: "pending",
    payment_status: "unpaid",
    total: 45.5, // 4550 pence
    stripe_checkout_session_id: "cs_test_0001",
    stripe_payment_intent_id: null,
    updated_at: null,
    ...over,
  };
}

// A Stripe Checkout Session that matches makeOrder() exactly.
function makeSession(over = {}) {
  return {
    id: "cs_test_0001",
    object: "checkout.session",
    mode: "payment",
    payment_status: "paid",
    payment_intent: "pi_test_0001",
    client_reference_id: "RB-T-0001",
    currency: "gbp",
    amount_total: 4550,
    metadata: { order_id: "7", order_number: "RB-T-0001" },
    ...over,
  };
}

function makeFakeDb(initialOrders) {
  const orders = new Map(initialOrders.map((o) => [o.id, { ...o }]));
  const writes = [];
  const copy = (row) => (row ? { ...row } : undefined);

  async function query(sql, params = []) {
    const s = String(sql).replace(/\s+/g, " ").trim();
    if (/^(BEGIN|COMMIT|ROLLBACK)$/.test(s)) return { rows: [] };
    if (s.includes("to_regclass('orders')")) {
      return {
        rows: [{
          table_name: "orders", database_name: "test", database_user: "test",
          first_schema: "public", stripe_columns: 2,
        }],
      };
    }
    if (s.startsWith("SELECT * FROM orders WHERE id = $1 AND user_id")) {
      const row = [...orders.values()].find((o) => o.id === params[0] && o.user_id === params[1]);
      return { rows: row ? [copy(row)] : [] };
    }
    if (s.startsWith("SELECT * FROM orders WHERE id = $1")) {
      const id = params[0];
      return { rows: orders.has(id) ? [copy(orders.get(id))] : [] };
    }
    if (s.startsWith("SELECT * FROM order_items")) return { rows: [] };

    // Stripe PaymentIntent recording (only ever fills an empty value).
    if (s.startsWith("UPDATE orders SET stripe_payment_intent_id")) {
      writes.push({ kind: "payment_intent" });
      return { rows: [] };
    }
    // The repair: paid + pending -> confirmed, nothing else.
    if (s.includes("SET status = 'confirmed', updated_at")) {
      const id = params[0];
      const row = orders.get(id);
      if (row && row.payment_status === "paid" && row.status === "pending") {
        row.status = "confirmed";
        row.updated_at = "now";
        writes.push({ kind: "repair", id });
        return { rows: [{ id }] };
      }
      return { rows: [] };
    }
    // Marking an unpaid order paid.
    if (s.includes("SET payment_status = 'paid',")) {
      const [sessionId, pi, id] = params;
      const row = orders.get(id);
      if (row && row.payment_status === "unpaid") {
        row.payment_status = "paid";
        if (row.status === "pending") row.status = "confirmed";
        row.stripe_checkout_session_id = sessionId;
        row.stripe_payment_intent_id = pi;
        row.updated_at = "now";
        writes.push({ kind: "mark_paid", id });
        return { rows: [{ id, status: row.status }] };
      }
      return { rows: [] };
    }
    throw new Error("Unexpected SQL in the repair test: " + s);
  }

  return { orders, writes, query };
}

// Lets the service's own db.query / client.query calls reach the fake.
function bindQuery(fake) {
  return (sql, params) => fake.query(sql, params);
}

// ---------- test wiring ----------

const originals = {};
let fake;
let stripeStub;

function install(orders, stripe = null) {
  fake = makeFakeDb(orders);
  originals.query = db.query;
  originals.connect = db.pool.connect;
  originals.getStripe = stripeConfig.getStripe;
  db.query = bindQuery(fake);
  db.pool.connect = async () => ({ query: bindQuery(fake), release() {} });
  stripeStub = stripe;
  stripeConfig.getStripe = () => stripeStub;
  return fake;
}

afterEach(() => {
  if (originals.query) db.query = originals.query;
  if (originals.connect) db.pool.connect = originals.connect;
  if (originals.getStripe) stripeConfig.getStripe = originals.getStripe;
});

// Quiet the service's [payments] log lines during the tests.
let savedLog;
beforeEach(() => {
  savedLog = console.log;
  console.log = () => {};
});
afterEach(() => {
  console.log = savedLog;
});

// Calls applyPaidLocked on a copy of the order, through the fake client, and
// returns the result plus the fake database state afterwards.
async function applyDirect(orderRow, session) {
  const f = makeFakeDb([orderRow]);
  const client = { query: bindQuery(f) };
  const row = { ...f.orders.get(orderRow.id) };
  const result = await paymentService.applyPaidLocked(client, row, session, "test");
  return { result, state: f.orders.get(orderRow.id), writes: f.writes };
}

// ---------- 1. paid + pending, verified session -> confirmed ----------

test("paid + pending with a verified matching session becomes confirmed", async () => {
  const { result, state, writes } = await applyDirect(
    makeOrder({ payment_status: "paid", status: "pending", stripe_payment_intent_id: "pi_test_0001" }),
    makeSession()
  );
  assert.equal(result.result, "repaired");
  assert.equal(state.status, "confirmed");
  assert.equal(state.payment_status, "paid", "payment status must stay paid");
  assert.deepEqual(writes, [{ kind: "repair", id: 7 }]);
});

// ---------- 2. already confirmed stays confirmed ----------

test("paid + confirmed stays confirmed and is not rewritten", async () => {
  const { result, state, writes } = await applyDirect(
    makeOrder({ payment_status: "paid", status: "confirmed", stripe_payment_intent_id: "pi_test_0001" }),
    makeSession()
  );
  assert.equal(result.result, "already_paid");
  assert.equal(state.status, "confirmed");
  assert.equal(writes.length, 0, "no status write for an order that is already confirmed");
});

// ---------- 3. cancelled / refunded are never changed ----------

test("paid + cancelled stays cancelled", async () => {
  const { result, state, writes } = await applyDirect(
    makeOrder({ payment_status: "paid", status: "cancelled", stripe_payment_intent_id: "pi_test_0001" }),
    makeSession()
  );
  assert.equal(result.result, "already_paid");
  assert.equal(state.status, "cancelled");
  assert.equal(writes.length, 0);
});

test("paid + refunded stays refunded", async () => {
  const { result, state, writes } = await applyDirect(
    makeOrder({ payment_status: "paid", status: "refunded", stripe_payment_intent_id: "pi_test_0001" }),
    makeSession()
  );
  assert.equal(result.result, "already_paid");
  assert.equal(state.status, "refunded");
  assert.equal(writes.length, 0);
});

test("unpaid + cancelled is never marked paid", async () => {
  const { result, state, writes } = await applyDirect(
    makeOrder({ payment_status: "unpaid", status: "cancelled" }),
    makeSession()
  );
  assert.equal(result.result, "order_closed");
  assert.equal(state.payment_status, "unpaid");
  assert.equal(state.status, "cancelled");
  assert.equal(writes.length, 0);
});

test("paid + shipped and paid + processing keep their status", async () => {
  for (const status of ["processing", "shipped", "delivered"]) {
    const { result, state } = await applyDirect(
      makeOrder({ payment_status: "paid", status, stripe_payment_intent_id: "pi_test_0001" }),
      makeSession()
    );
    assert.equal(result.result, "already_paid", status);
    assert.equal(state.status, status, status);
  }
});

// ---------- 4. mismatched session cannot trigger a repair ----------

const MISMATCHES = {
  "other order_number in metadata": { metadata: { order_id: "7", order_number: "RB-OTHER" } },
  "other order id in metadata": { metadata: { order_id: "99", order_number: "RB-T-0001" } },
  "other client_reference_id": { client_reference_id: "RB-OTHER" },
  "different amount": { amount_total: 4551 },
  "different currency": { currency: "usd" },
  "not a payment-mode session": { mode: "subscription" },
  "not a checkout session object": { object: "payment_intent" },
};

for (const [name, change] of Object.entries(MISMATCHES)) {
  test(`mismatch (${name}) on paid + pending does not change the order`, async () => {
    const { result, state, writes } = await applyDirect(
      makeOrder({ payment_status: "paid", status: "pending", stripe_payment_intent_id: "pi_test_0001" }),
      makeSession(change)
    );
    assert.equal(result.result, "mismatch");
    assert.equal(state.status, "pending");
    assert.equal(writes.length, 0);
  });

  test(`mismatch (${name}) on unpaid does not mark the order paid`, async () => {
    const { result, state, writes } = await applyDirect(makeOrder(), makeSession(change));
    assert.equal(result.result, "mismatch");
    assert.equal(state.payment_status, "unpaid");
    assert.equal(state.status, "pending");
    assert.equal(writes.length, 0);
  });
}

// ---------- 5. unpaid goes through the verified flow to paid + confirmed ----------

test("unpaid with a verified matching session becomes paid and confirmed", async () => {
  const { result, state } = await applyDirect(makeOrder(), makeSession());
  assert.equal(result.result, "paid");
  assert.equal(state.payment_status, "paid");
  assert.equal(state.status, "confirmed");
  assert.equal(state.stripe_payment_intent_id, "pi_test_0001");
});

test("markPaidFromSession ignores a session that Stripe has not marked paid", async () => {
  install([makeOrder()]);
  const outcome = await paymentService.markPaidFromSession(makeSession({ payment_status: "unpaid" }), "test");
  assert.equal(outcome.result, "not_paid");
  assert.equal(fake.orders.get(7).payment_status, "unpaid");
});

// ---------- 6. repeated events are idempotent ----------

test("the same paid event twice on an unpaid order: paid once, then already_paid", async () => {
  install([makeOrder()]);
  const first = await paymentService.markPaidFromSession(makeSession(), "webhook:test:evt_1");
  const second = await paymentService.markPaidFromSession(makeSession(), "webhook:test:evt_1");
  assert.equal(first.result, "paid");
  assert.equal(second.result, "already_paid");
  assert.equal(fake.orders.get(7).status, "confirmed");
  assert.equal(fake.writes.filter((w) => w.kind === "mark_paid").length, 1);
});

test("the same event twice on paid + pending: repaired once, then already_paid", async () => {
  install([makeOrder({ payment_status: "paid", status: "pending", stripe_payment_intent_id: "pi_test_0001" })]);
  const first = await paymentService.markPaidFromSession(makeSession(), "webhook:test:evt_2");
  const second = await paymentService.markPaidFromSession(makeSession(), "webhook:test:evt_2");
  assert.equal(first.result, "repaired");
  assert.equal(second.result, "already_paid");
  assert.equal(fake.orders.get(7).status, "confirmed");
  assert.equal(fake.writes.filter((w) => w.kind === "repair").length, 1);
});

// ---------- 7. browser return cannot mark an order paid ----------

// A fake Stripe client that always returns `session` and remembers which
// session id was asked for.
function stripeReturning(session) {
  const calls = [];
  return {
    calls,
    checkout: {
      sessions: {
        retrieve: async (id) => {
          calls.push(id);
          return session;
        },
      },
    },
  };
}

test("browser return: Stripe says unpaid -> order stays unpaid, not verified", async () => {
  install([makeOrder()], stripeReturning(makeSession({ payment_status: "unpaid" })));
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, false);
  assert.equal(out.paid, false);
  assert.equal(fake.orders.get(7).payment_status, "unpaid");
  assert.equal(fake.orders.get(7).status, "pending");
  assert.equal(fake.writes.length, 0);
});

test("browser return: Stripe check fails -> order stays unpaid, not verified", async () => {
  const failing = {
    checkout: { sessions: { retrieve: async () => { throw new Error("network down"); } } },
  };
  install([makeOrder()], failing);
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, false);
  assert.equal(out.paid, false);
  assert.equal(fake.orders.get(7).payment_status, "unpaid");
});

test("browser return: no Stripe configured -> nothing is marked paid", async () => {
  install([makeOrder()], null);
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, false);
  assert.equal(out.paid, false);
  assert.equal(fake.orders.get(7).payment_status, "unpaid");
});

test("browser return: Stripe says paid -> order is marked paid and confirmed", async () => {
  install([makeOrder()], stripeReturning(makeSession()));
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, true);
  assert.equal(out.paid, true);
  assert.equal(fake.orders.get(7).status, "confirmed");
});

test("browser return: paid + pending is repaired only after Stripe confirms it", async () => {
  install(
    [makeOrder({ payment_status: "paid", status: "pending", stripe_payment_intent_id: "pi_test_0001" })],
    stripeReturning(makeSession())
  );
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, true);
  assert.equal(out.order.status, "confirmed");
  assert.equal(out.order.paymentStatus, "paid");
});

test("browser return: paid + pending with Stripe unpaid is NOT repaired", async () => {
  install(
    [makeOrder({ payment_status: "paid", status: "pending", stripe_payment_intent_id: "pi_test_0001" })],
    stripeReturning(makeSession({ payment_status: "unpaid" }))
  );
  const out = await paymentService.paymentStatus(USER, 7);
  assert.equal(out.verified, false);
  assert.equal(fake.orders.get(7).status, "pending");
});

test("browser return: the Stripe check uses the order's own saved session id", async () => {
  const stripe = stripeReturning(makeSession());
  install([makeOrder({ stripe_checkout_session_id: "cs_test_0001" })], stripe);
  await paymentService.paymentStatus(USER, 7);
  assert.deepEqual(stripe.calls, ["cs_test_0001"]);
});