// Rabbora Living — Stripe payments (Checkout Sessions, official stripe SDK).
//
// How it fits the existing order flow (orderService.placeOrder):
//   1. "Place order" creates the order as pending / unpaid, takes tracked
//      stock and empties the basket (unchanged).
//   2. createCheckoutSession() opens a Stripe Checkout Session for THAT
//      order. The amount comes from the order saved in PostgreSQL (lines,
//      shipping, total in GBP) and is converted to pence only here. The
//      session id is saved on the order (orders.stripe_checkout_session_id);
//      while that session is still open, "Pay now" re-uses it.
//   3. The order becomes "paid" ONLY from a Checkout Session that came
//      from Stripe itself — the signed webhook (authoritative), or the
//      backend fetching the order's OWN saved session with the secret key
//      when the customer returns. The browser can never mark it paid.
//      The PaymentIntent id is saved (orders.stripe_payment_intent_id).
//   4. Idempotent: the order row is locked and only an UNPAID order is
//      changed. Repeated / late webhooks, returns and refreshes change
//      nothing the second time. Payment never touches stock (stock was
//      taken when the order was placed), so it can't be taken twice.
//   5. Cancelled / failed payment: the order stays unpaid and can be paid
//      again with "Pay now" (same order, no new order, no stock change).
//   6. Refunds are made in the Stripe Dashboard; the charge.refunded
//      webhook marks a FULLY refunded order as payment_status "refunded".
//
// Needs database/stripe_payments.sql (the two Stripe id columns).

const crypto = require("crypto");
const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");
const { toPence } = require("../utils/pricing");
const { AppError, notFound } = require("../utils/AppError");
const stripeConfig = require("../config/stripe");
const orderService = require("./orderService");

const STRIPE_CURRENCY = "gbp";
const MIN_PENCE = 30; // Stripe's minimum charge in GBP (£0.30)

function paymentsOff() {
  return new AppError(503, "PAYMENTS_UNAVAILABLE", "Online payment is not available at the moment. Your order is saved — please contact us to pay.");
}

function log(message, details) {
  // Order numbers and Stripe object ids only — never keys, secrets or card data.
  console.log(`[payments] ${message}`, details ? JSON.stringify(details) : "");
}

// ---------- database check (migration applied?) ----------

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  const r = await db.query(
    `SELECT count(*)::int AS n FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = 'orders'
        AND column_name IN ('stripe_checkout_session_id', 'stripe_payment_intent_id')`
  );
  if (r.rows[0].n !== 2) {
    console.error("[payments] The orders table has no Stripe columns yet. Run backend/database/stripe_payments.sql (no restart needed).");
    throw paymentsOff();
  }
  schemaReady = true;
}

function intentId(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id || null;
}

// ---------- building the Stripe session ----------

function lineName(item) {
  const extras = [item.selected_size, item.selected_fabric].filter(Boolean).join(", ");
  return (item.product_name + (extras ? ` (${extras})` : "")).slice(0, 250);
}

// Stripe line items from the saved order. Every amount is whole pence
// taken from NUMERIC columns, and the sum must equal the order total.
function lineItemsFor(order, items) {
  const totalPence = toPence(order.total);
  const shippingPence = toPence(order.shipping);
  const discountPence = toPence(order.discount);
  let lines;
  if (discountPence === 0) {
    lines = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: STRIPE_CURRENCY,
        unit_amount: toPence(item.unit_price),
        product_data: { name: lineName(item) },
      },
    }));
    if (shippingPence > 0) {
      lines.push({ quantity: 1, price_data: { currency: STRIPE_CURRENCY, unit_amount: shippingPence, product_data: { name: "Delivery" } } });
    }
  } else {
    // A discount can't be shown per line safely, so charge the order total as one line.
    lines = [{ quantity: 1, price_data: { currency: STRIPE_CURRENCY, unit_amount: totalPence, product_data: { name: `Rabbora order ${order.order_number}` } } }];
  }
  const sum = lines.reduce((s, l) => s + l.price_data.unit_amount * l.quantity, 0);
  if (sum !== totalPence) {
    log("line items do not add up to the order total — refused", { order: order.order_number, sum, totalPence });
    throw new AppError(500, "PAYMENT_AMOUNT_MISMATCH", "This order can't be paid online. Please contact us.");
  }
  return { lines, totalPence };
}

// Is this Stripe session exactly for this order and amount?
function sessionMatches(session, order) {
  return !!session &&
    session.object === "checkout.session" &&
    session.mode === "payment" &&
    session.metadata && Number(session.metadata.order_id) === order.id &&
    session.metadata.order_number === order.order_number &&
    session.client_reference_id === order.order_number &&
    String(session.currency || "").toLowerCase() === STRIPE_CURRENCY &&
    session.amount_total === toPence(order.total);
}

// ---------- marking paid (only with a session that came from Stripe) ----------

// order: a row locked FOR UPDATE inside `client`'s transaction.
async function applyPaidLocked(client, order, session, source) {
  if (!sessionMatches(session, order)) {
    log("paid session does not match the order — NOT marked paid, check it in Stripe", {
      session: session && session.id, order: order.order_number, amount: session && session.amount_total,
      expected: toPence(order.total), currency: session && session.currency, source,
    });
    return { result: "mismatch", orderId: order.id };
  }
  const pi = intentId(session.payment_intent);
  if (order.payment_status === "paid") {
    if (!order.stripe_payment_intent_id && pi) {
      await client.query("UPDATE orders SET stripe_payment_intent_id = $1 WHERE id = $2 AND stripe_payment_intent_id IS NULL", [pi, order.id]);
    } else if (pi && order.stripe_payment_intent_id && pi !== order.stripe_payment_intent_id) {
      log("SECOND payment received for an order that was already paid — refund one of them in Stripe", {
        order: order.order_number, kept: order.stripe_payment_intent_id, extra: pi, session: session.id, source,
      });
    }
    return { result: "already_paid", orderId: order.id };
  }
  if (order.payment_status !== "unpaid" || ["cancelled", "refunded"].includes(order.status)) {
    log("payment received for an order that is cancelled/refunded — NOT marked paid, refund it in Stripe", {
      order: order.order_number, status: order.status, paymentStatus: order.payment_status, session: session.id, paymentIntent: pi, source,
    });
    return { result: "order_closed", orderId: order.id };
  }
  const u = await client.query(
    `UPDATE orders
        SET payment_status = 'paid', stripe_checkout_session_id = $1, stripe_payment_intent_id = $2,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND payment_status = 'unpaid'
      RETURNING id`,
    [session.id, pi, order.id]
  );
  if (!u.rows[0]) return { result: "already_paid", orderId: order.id };
  log("order marked paid", { order: order.order_number, session: session.id, paymentIntent: pi, source });
  return { result: "paid", orderId: order.id };
}

async function markPaidFromSession(session, source) {
  if (!session || session.object !== "checkout.session" || session.mode !== "payment") return { result: "ignored" };
  if (session.payment_status !== "paid") return { result: "not_paid" };
  const orderId = Number(session.metadata && session.metadata.order_id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    log("paid session without a Rabbora order reference — ignored", { session: session.id, source });
    return { result: "no_order" };
  }
  await ensureSchema();
  return withTransaction(async (client) => {
    const r = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [orderId]);
    if (!r.rows[0]) {
      log("paid session for an unknown order", { session: session.id, orderId, source });
      return { result: "no_order" };
    }
    return applyPaidLocked(client, r.rows[0], session, source);
  });
}

// ---------- creating / re-using the Checkout Session ----------

// POST /api/payments/stripe/checkout-session
// The order is looked up together with the logged-in user's id, so
// another customer's order looks exactly like a missing one.
async function createCheckoutSession(user, orderId, returnBase) {
  const stripe = stripeConfig.getStripe();
  if (!stripe) throw paymentsOff();
  await ensureSchema();

  const outcome = await withTransaction(async (client) => {
    // Locked: a double click waits here and then re-uses the first session.
    const r = await client.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE", [orderId, user.id]);
    const order = r.rows[0];
    if (!order) throw notFound("Order not found.");
    if (order.payment_status === "paid") return { alreadyPaid: true };
    if (order.payment_status !== "unpaid" || ["cancelled", "refunded"].includes(order.status)) {
      throw new AppError(409, "ORDER_NOT_PAYABLE", "This order can no longer be paid online. Please contact us.");
    }
    if (order.currency !== "GBP") throw new AppError(409, "ORDER_NOT_PAYABLE", "This order can't be paid online. Please contact us.");

    const itemsResult = await client.query("SELECT * FROM order_items WHERE order_id = $1 ORDER BY id", [order.id]);
    const { lines, totalPence } = lineItemsFor(order, itemsResult.rows);
    if (totalPence < MIN_PENCE) throw new AppError(409, "ORDER_NOT_PAYABLE", "This order total is too small to pay online.");

    // 1. The order's saved session: re-use it while it is open and correct.
    const previous = order.stripe_checkout_session_id;
    if (previous) {
      let existing = null;
      try {
        existing = await stripe.checkout.sessions.retrieve(previous);
      } catch (err) {
        // e.g. a test-mode session after switching to live keys: make a new one.
        log("saved session could not be read — a new one is made", { order: order.order_number, session: previous, error: err.type || err.code || "error" });
      }
      if (existing && existing.payment_status === "paid") {
        // Paid, but the webhook has not arrived yet.
        const paid = await applyPaidLocked(client, order, existing, "pay-now");
        if (paid.result === "paid" || paid.result === "already_paid") return { alreadyPaid: true };
      }
      if (existing && existing.status === "open") {
        if (sessionMatches(existing, order) && existing.url) {
          return { url: existing.url, sessionId: existing.id, totalPence, reused: true };
        }
        // Open but not right for this order any more: close it so it can't be paid.
        try { await stripe.checkout.sessions.expire(existing.id); } catch (err) { log("could not expire an old session", { session: existing.id, error: err.type || err.code || "error" }); }
      }
    }

    // 2. A new session. The amount is the database total in pence.
    const ref = String(order.id);
    const params = {
      mode: "payment",
      line_items: lines,
      client_reference_id: order.order_number,
      customer_email: order.customer_email,
      metadata: { order_id: ref, order_number: order.order_number },
      payment_intent_data: { metadata: { order_id: ref, order_number: order.order_number } },
      success_url: `${returnBase}?payment=success&order=${encodeURIComponent(ref)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnBase}?payment=cancelled&order=${encodeURIComponent(ref)}`,
    };
    // Stripe idempotency key: a retried request (network error, timeout)
    // can never open a second session. It includes the previous session,
    // so a new session is made after the old one expired.
    const fingerprint = crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex").slice(0, 24);
    const session = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `rabbora-order-${order.id}-${previous || "first"}-${fingerprint}`,
    });
    await client.query(
      "UPDATE orders SET stripe_checkout_session_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [session.id, order.id]
    );
    log("checkout session created", { order: order.order_number, session: session.id, amount: totalPence, mode: stripeConfig.mode() });
    return { url: session.url, sessionId: session.id, totalPence, reused: false };
  });

  if (outcome.alreadyPaid) throw new AppError(409, "ALREADY_PAID", "This order has already been paid.");
  return { url: outcome.url, sessionId: outcome.sessionId, reused: outcome.reused, amount: outcome.totalPence / 100, currency: "GBP" };
}

// After an order is cancelled: close its open Stripe session so the
// customer can't pay a cancelled order. Best effort — the webhook still
// refuses to mark a cancelled order paid.
async function expireOpenSession(orderId) {
  const stripe = stripeConfig.getStripe();
  if (!stripe) return;
  try {
    await ensureSchema();
    const r = await db.query("SELECT order_number, stripe_checkout_session_id FROM orders WHERE id = $1", [orderId]);
    const row = r.rows[0];
    if (!row || !row.stripe_checkout_session_id) return;
    const session = await stripe.checkout.sessions.retrieve(row.stripe_checkout_session_id);
    if (session.status === "open") {
      await stripe.checkout.sessions.expire(session.id);
      log("open session closed because the order was cancelled", { order: row.order_number, session: session.id });
    }
  } catch (err) {
    log("could not close the session of a cancelled order", { orderId, error: err.type || err.code || err.message });
  }
}

// ---------- refunds (made in the Stripe Dashboard) ----------

async function handleRefund(charge, source) {
  if (!charge || charge.object !== "charge") return { result: "ignored" };
  const pi = intentId(charge.payment_intent);
  if (!pi) return { result: "ignored" };
  await ensureSchema();
  return withTransaction(async (client) => {
    const r = await client.query("SELECT * FROM orders WHERE stripe_payment_intent_id = $1 FOR UPDATE", [pi]);
    const order = r.rows[0];
    if (!order) {
      log("refund for a payment that is not linked to an order", { paymentIntent: pi, source });
      return { result: "no_order" };
    }
    if (String(charge.currency || "").toLowerCase() !== STRIPE_CURRENCY) {
      log("refund in an unexpected currency — order not changed", { order: order.order_number, currency: charge.currency, source });
      return { result: "mismatch", orderId: order.id };
    }
    const full = charge.refunded === true && Number(charge.amount_refunded) >= Number(charge.amount);
    if (!full) {
      // The schema has no "partially refunded" state: the order stays paid.
      log("partial refund — order stays paid", { order: order.order_number, refunded: charge.amount_refunded, amount: charge.amount, source });
      return { result: "partial_refund", orderId: order.id };
    }
    if (order.payment_status === "refunded") return { result: "already_refunded", orderId: order.id };
    if (order.payment_status !== "paid") {
      log("refund for an order that is not marked paid — check it", { order: order.order_number, paymentStatus: order.payment_status, source });
      return { result: "not_paid", orderId: order.id };
    }
    await client.query(
      "UPDATE orders SET payment_status = 'refunded', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND payment_status = 'paid'",
      [order.id]
    );
    // Stock and order status are not changed automatically.
    log("order marked refunded", { order: order.order_number, paymentIntent: pi, source });
    return { result: "refunded", orderId: order.id };
  });
}

// ---------- webhook ----------

// rawBody: the exact bytes Stripe sent (Buffer). Throws a 400 AppError
// when the signature is missing, wrong, too old, or the body was changed.
function verifyWebhook(rawBody, signature) {
  const stripe = stripeConfig.getStripe();
  const secret = stripeConfig.webhookSecret();
  if (!stripe || !secret) {
    console.error("[payments] Webhook received but STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET is not set in backend/.env.");
    throw paymentsOff();
  }
  if (!signature || !Buffer.isBuffer(rawBody)) throw new AppError(400, "INVALID_SIGNATURE", "Invalid Stripe signature.");
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    throw new AppError(400, "INVALID_SIGNATURE", "Invalid Stripe signature.");
  }
}

// Events to enable for the endpoint in the Stripe Dashboard:
//   checkout.session.completed, checkout.session.async_payment_succeeded,
//   checkout.session.async_payment_failed, checkout.session.expired,
//   charge.refunded
async function handleEvent(event) {
  const obj = event.data && event.data.object;
  const src = `webhook:${event.type}:${event.id}`;
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      return markPaidFromSession(obj, src);
    case "checkout.session.async_payment_failed":
      log("payment failed — order stays unpaid", { session: obj && obj.id, order: obj && obj.metadata && obj.metadata.order_number, event: event.id });
      return { result: "failed_unpaid" };
    case "checkout.session.expired":
      log("checkout session expired — order stays unpaid", { session: obj && obj.id, order: obj && obj.metadata && obj.metadata.order_number, event: event.id });
      return { result: "expired_unpaid" };
    case "charge.refunded":
      return handleRefund(obj, src);
    default:
      return { result: "ignored" };
  }
}

// ---------- customer returning from Stripe ----------

// GET /api/payments/stripe/orders/:id/status
// Own order only. While it is unpaid, the backend asks Stripe about the
// order's OWN saved session (never a session id from the browser). The
// webhook stays the main way an order becomes paid; this only covers a
// webhook that is late.
async function paymentStatus(user, orderId) {
  const stripe = stripeConfig.getStripe();
  if (stripe) await ensureSchema();
  const r = await db.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, user.id]);
  const row = r.rows[0];
  if (!row) throw notFound("Order not found.");
  let verified = false;
  if (stripe && row.payment_status === "unpaid" && row.stripe_checkout_session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(row.stripe_checkout_session_id);
      if (session.payment_status === "paid") {
        const outcome = await markPaidFromSession(session, "return");
        verified = outcome.result === "paid" || outcome.result === "already_paid";
      }
    } catch (err) {
      log("could not check the session on return", { order: row.order_number, error: err.type || err.code || "error" });
    }
  }
  const order = await orderService.getOrder(user, row.id);
  return { order, paid: order.paymentStatus === "paid", verified };
}

module.exports = {
  createCheckoutSession,
  markPaidFromSession,
  expireOpenSession,
  verifyWebhook,
  handleEvent,
  paymentStatus,
  lineItemsFor,
};