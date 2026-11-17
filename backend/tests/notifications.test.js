// Rabbora Living — admin notification tests.
// Pure tests (no PostgreSQL): event list, SQL/code agreement, input checks,
// error safety, route protection, and event hook placement.
// Database tests run only when NOTIFICATIONS_TEST_DB names a database that
// already has database/notifications.sql, database/newsletter.sql and
// database/enquiries.sql applied. Otherwise they are skipped.

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const REAL_DB = process.env.NOTIFICATIONS_TEST_DB || "";
if (REAL_DB) process.env.DB_NAME = REAL_DB;

const ROOT = path.join(__dirname, "..", "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const db = require("../config/db");
const notificationService = require("../services/notificationService");
const notificationController = require("../controllers/notificationController");
const { requireAdmin } = require("../middleware/auth");
const adminRouter = require("../routes/admin");

const realTest = (name, fn) => {
  if (REAL_DB) return test(name, fn);
  return test(name, { skip: "set NOTIFICATIONS_TEST_DB to run database tests" }, fn);
};

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    set(k, v) { this.headers[k] = v; return this; },
  };
}

// ---------------------------------------------------------------
// Pure tests
// ---------------------------------------------------------------

const SIX = [
  "new_order",
  "new_contact_message",
  "new_fabric_sample_request",
  "new_newsletter_subscriber",
  "new_customer_registration",
  "new_product_review",
];

test("exactly the six required event types are defined", () => {
  assert.deepEqual([...notificationService.EVENT_TYPES].sort(), [...SIX].sort());
});

test("every event type has a title and an admin page that exists", () => {
  for (const type of SIX) {
    assert.ok(notificationService.EVENT_TITLES[type], `title for ${type}`);
    const page = notificationService.EVENT_PAGES[type];
    assert.ok(page, `page for ${type}`);
    assert.ok(fs.existsSync(path.join(ROOT, "admin", page)), `admin/${page} exists`);
  }
});

test("the alert sound is the supplied file and the static site serves .wav", () => {
  const soundPath = path.join(ROOT, "admin", "assets", "sounds", "rabbora-professional-ding.wav");
  assert.ok(fs.existsSync(soundPath), "admin/assets/sounds/rabbora-professional-ding.wav exists");
  const header = fs.readFileSync(soundPath).subarray(0, 12).toString("latin1");
  assert.equal(header.slice(0, 4), "RIFF");
  assert.equal(header.slice(8, 12), "WAVE");
  const { ALLOWED_EXTENSIONS } = require("../middleware/staticSite");
  assert.ok(ALLOWED_EXTENSIONS.has(".wav"), ".wav is served by the static site");
  const admin = read("admin/js/notifications.js");
  assert.ok(admin.includes("assets/sounds/rabbora-professional-ding.wav"), "bell script points at the sound file");
});

test("the SQL CHECK list matches the JavaScript event list", () => {
  const sql = read("backend/database/notifications.sql");
  const block = sql.match(/CHECK \(event_type IN \(([\s\S]*?)\)\)/);
  assert.ok(block, "event_type CHECK found");
  const inSql = [...block[1].matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
  assert.deepEqual(inSql, [...notificationService.EVENT_TYPES].sort());
});

test("createNotification rejects an unknown event type without touching the database", async () => {
  const original = db.query;
  let queried = false;
  db.query = async () => { queried = true; return { rows: [] }; };
  try {
    await assert.rejects(
      notificationService.createNotification({ eventType: "made_up", message: "x", recordId: 1, dedupeKey: "k" }),
      /Unknown notification type/
    );
    assert.equal(queried, false);
  } finally {
    db.query = original;
  }
});

test("notifyEvent never throws when the database fails, and logs only the type and code", async () => {
  const originalQuery = db.query;
  const originalError = console.error;
  const logged = [];
  db.query = async () => { throw Object.assign(new Error("connection lost to customer@example.com"), { code: "08006" }); };
  console.error = (...args) => logged.push(args.join(" "));
  try {
    const id = await notificationService.notifyEvent({
      eventType: "new_order",
      message: "Order ORD-1 placed.",
      recordId: 1,
      dedupeKey: "order:1",
    });
    assert.equal(id, null);
    assert.equal(logged.length, 1);
    assert.match(logged[0], /new_order/);
    assert.match(logged[0], /08006/);
    assert.doesNotMatch(logged[0], /customer@example\.com/, "no customer details in logs");
  } finally {
    db.query = originalQuery;
    console.error = originalError;
  }
});

test("the destination link points to the admin page with the record id", async () => {
  const originalQuery = db.query;
  let params = null;
  db.query = async (text, p) => { params = p; return { rows: [{ id: "7" }] }; };
  try {
    const id = await notificationService.createNotification({
      eventType: "new_fabric_sample_request",
      message: "Sam asked for fabric samples.",
      recordId: 42,
      dedupeKey: "fabric-sample:42",
    });
    assert.equal(id, 7);
    assert.equal(params[4], "fabric-sample-requests.html?open=42");
    assert.equal(params[1], "New fabric sample request");
  } finally {
    db.query = originalQuery;
  }
});

test("the admin notification routes sit behind requireAdmin (first layer of the router)", () => {
  assert.equal(adminRouter.stack[0].handle, requireAdmin, "router.use(requireAdmin) is the first layer");
  const paths = adminRouter.stack.map((layer) => layer.route && layer.route.path).filter(Boolean);
  for (const p of ["/notifications", "/notifications/poll", "/notifications/read-all", "/notifications/:id/read", "/notification-preferences"]) {
    assert.ok(paths.includes(p), `route ${p} is registered`);
  }
});

test("list and poll reject a malformed cursor with 400 before any database work", async () => {
  await assert.rejects(notificationController.list({ query: { limit: "abc" }, user: { id: 1 } }, fakeRes()), { status: 400 });
  await assert.rejects(notificationController.list({ query: { before: "-1" }, user: { id: 1 } }, fakeRes()), { status: 400 });
  await assert.rejects(notificationController.poll({ query: { after: "1.5" }, user: { id: 1 } }, fakeRes()), { status: 400 });
});

test("markRead with a non-numeric id is 404, not a database error", async () => {
  await assert.rejects(
    notificationController.markRead({ params: { id: "abc" }, user: { id: 1 } }, fakeRes()),
    { status: 404 }
  );
});

test("preferences require real booleans", async () => {
  await assert.rejects(
    notificationController.updatePreferences({ body: { soundEnabled: "yes", desktopEnabled: true }, user: { id: 1 } }, fakeRes()),
    { status: 400 }
  );
  await assert.rejects(
    notificationController.updatePreferences({ body: { soundEnabled: true }, user: { id: 1 } }, fakeRes()),
    { status: 400 }
  );
});

test("each business event is recorded after its database write, with a dedupe key", () => {
  const hooks = [
    { file: "backend/services/enquiryService.js", type: "new_contact_message", after: "INSERT INTO contact_messages" },
    { file: "backend/services/enquiryService.js", type: "new_fabric_sample_request", after: "INSERT INTO fabric_sample_requests" },
    { file: "backend/services/newsletterService.js", type: "new_newsletter_subscriber", after: "SET status = 'active'" },
    { file: "backend/services/reviewService.js", type: "new_product_review", after: "INSERT INTO reviews" },
    { file: "backend/services/orderService.js", type: "new_order", after: "withTransaction" },
    { file: "backend/routes/auth.js", type: "new_customer_registration", after: "INSERT INTO users" },
  ];
  for (const h of hooks) {
    const src = read(h.file);
    const at = src.indexOf(`eventType: "${h.type}"`);
    assert.ok(at > 0, `${h.type} hook in ${h.file}`);
    assert.ok(src.indexOf(h.after) > -1, `${h.after} in ${h.file}`);
    assert.ok(src.indexOf(h.after) < at, `${h.type} hook comes after the database write in ${h.file}`);
    assert.match(src.slice(at, at + 400), /dedupeKey/, `${h.type} has a dedupe key`);
  }
});

// ---------------------------------------------------------------
// Database tests (run when NOTIFICATIONS_TEST_DB is set)
// ---------------------------------------------------------------

const enquiryService = require("../services/enquiryService");
const newsletterService = require("../services/newsletterService");

const RUN = `notify-test-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const created = { userIds: [], emails: [], notificationBaseline: 0 };
let emailSeq = 0;

function uniqueEmail() {
  emailSeq += 1;
  return `${RUN}-${emailSeq}@example.test`;
}

async function makeAdmin(label) {
  const email = uniqueEmail();
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
     VALUES ('Test', $1, $2, '+447700900123', $3, 'admin') RETURNING id`,
    [label, email, "x".repeat(60)]
  );
  const id = Number(result.rows[0].id);
  created.userIds.push(id);
  return id;
}

async function makeCustomer() {
  const email = uniqueEmail();
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
     VALUES ('Test', 'Customer', $1, '+447700900124', $2, 'customer') RETURNING id`,
    [email, "x".repeat(60)]
  );
  const id = Number(result.rows[0].id);
  created.userIds.push(id);
  return id;
}

// Exact match: a LIKE prefix would make "newsletter:1" also match "newsletter:12".
async function countByDedupeKey(key) {
  const r = await db.query("SELECT COUNT(*)::int AS n FROM notifications WHERE dedupe_key = $1", [key]);
  return r.rows[0].n;
}

async function notificationFor(dedupeKey) {
  const r = await db.query("SELECT * FROM notifications WHERE dedupe_key = $1", [dedupeKey]);
  return r.rows[0] || null;
}

function contactInput(extra = {}) {
  return {
    name: "Sam Tester",
    email: uniqueEmail(),
    phone: "+447700900999",
    subject: `Subject ${RUN}`,
    message: `Hello from ${RUN}`,
    ...extra,
  };
}

before(async () => {
  if (!REAL_DB) return;
  const r = await db.query("SELECT COALESCE(MAX(id), 0)::bigint AS m FROM notifications");
  created.notificationBaseline = Number(r.rows[0].m);
});

after(async () => {
  if (REAL_DB) {
    try {
      await db.query("DELETE FROM notifications WHERE id > $1", [created.notificationBaseline]);
      await db.query("DELETE FROM contact_messages WHERE email LIKE $1", [`${RUN}%`]);
      await db.query("DELETE FROM fabric_sample_requests WHERE email LIKE $1", [`${RUN}%`]);
      await db.query("DELETE FROM newsletter_subscribers WHERE email LIKE $1", [`${RUN}%`]);
      if (created.userIds.length) {
        await db.query("DELETE FROM users WHERE id = ANY($1::int[])", [created.userIds]);
      }
    } catch (err) {
      console.error("notification test cleanup:", err.message);
    }
    await db.pool.end();
  }
});

realTest("a new contact message adds one notification, and a duplicate submit adds none", async () => {
  const input = contactInput();
  const first = await enquiryService.createContactMessage(input);
  assert.equal(first.duplicate, false);
  const note = await notificationFor(`contact:${first.contactMessage.id}`);
  assert.ok(note, "notification stored");
  assert.equal(note.event_type, "new_contact_message");
  assert.equal(note.destination_url, `contact-messages.html?open=${first.contactMessage.id}`);
  assert.doesNotMatch(note.message, /@/, "message has no email address");
  assert.ok(!note.message.includes(input.name), "message has no customer name");

  const again = await enquiryService.createContactMessage(input);
  assert.equal(again.duplicate, true);
  assert.equal(await countByDedupeKey(`contact:${first.contactMessage.id}`), 1);
});

realTest("a new fabric sample request adds one notification, and a duplicate submit adds none", async () => {
  const input = {
    name: "Sam Tester",
    email: uniqueEmail(),
    phone: "+447700900998",
    postcode: "SW1A 1AA",
    address: "1 Test Street",
    selectedFabrics: `Linen ${RUN}`,
    notes: null,
    marketingConsent: false,
  };
  const first = await enquiryService.createFabricSampleRequest(input);
  assert.equal(first.duplicate, false);
  const note = await notificationFor(`fabric-sample:${first.request.id}`);
  assert.ok(note, "notification stored");
  assert.equal(note.event_type, "new_fabric_sample_request");
  assert.doesNotMatch(note.message, /@|1 Test Street|SW1A/, "no address or email in message");

  const again = await enquiryService.createFabricSampleRequest(input);
  assert.equal(again.duplicate, true);
  assert.equal(await countByDedupeKey(`fabric-sample:${first.request.id}`), 1);
});

realTest("a newsletter sign-up that is never confirmed adds no notification", async () => {
  const email = uniqueEmail();
  const signup = await newsletterService.subscribe(email);
  assert.equal(signup.state, "pending");
  const row = await db.query("SELECT id FROM newsletter_subscribers WHERE lower(email) = $1", [email]);
  assert.equal(await countByDedupeKey(`newsletter:${row.rows[0].id}`), 0);
});

realTest("a confirmed newsletter subscriber adds one notification, and a second use of the link adds none", async () => {
  const email = uniqueEmail();
  const signup = await newsletterService.subscribe(email);
  const row = await db.query("SELECT id FROM newsletter_subscribers WHERE lower(email) = $1", [email]);
  const id = Number(row.rows[0].id);

  const ok = await newsletterService.confirm(signup.confirmToken);
  assert.equal(ok.ok, true);
  const note = await notificationFor(`newsletter:${id}`);
  assert.ok(note, "notification stored after confirmation");
  assert.equal(note.event_type, "new_newsletter_subscriber");
  assert.doesNotMatch(note.message, /@/, "message has no email address");

  const again = await newsletterService.confirm(signup.confirmToken);
  assert.equal(again.ok, false, "a confirmation link works once");
  assert.equal(await countByDedupeKey(`newsletter:${id}`), 1);
});

realTest("duplicate prevention: the same dedupe key is stored once", async () => {
  const key = `${RUN}-dup`;
  const a = await notificationService.createNotification({ eventType: "new_order", message: "Order A", recordId: 1, dedupeKey: key });
  const b = await notificationService.createNotification({ eventType: "new_order", message: "Order A", recordId: 1, dedupeKey: key });
  assert.ok(a, "first insert returns an id");
  assert.equal(b, null, "second insert is ignored");
  assert.equal(await countByDedupeKey(key), 1);
});

realTest("multiple admins: read state is per admin, and mark all read affects only the caller", async () => {
  const adminA = await makeAdmin("A");
  const adminB = await makeAdmin("B");
  const beforeA = (await notificationService.listForAdmin(adminA, {})).unreadCount;
  const beforeB = (await notificationService.listForAdmin(adminB, {})).unreadCount;

  const one = await notificationService.createNotification({ eventType: "new_product_review", message: "Review 1", recordId: 1, dedupeKey: `${RUN}-m1` });
  const two = await notificationService.createNotification({ eventType: "new_product_review", message: "Review 2", recordId: 2, dedupeKey: `${RUN}-m2` });

  assert.equal((await notificationService.listForAdmin(adminA, {})).unreadCount, beforeA + 2);
  assert.equal((await notificationService.listForAdmin(adminB, {})).unreadCount, beforeB + 2);

  const marked = await notificationService.markRead(adminA, one);
  assert.equal(marked.found, true);
  assert.equal(marked.unreadCount, beforeA + 1);
  assert.equal((await notificationService.listForAdmin(adminB, {})).unreadCount, beforeB + 2, "admin B still unread");

  const listA = await notificationService.listForAdmin(adminA, {});
  const itemOne = listA.items.find((i) => i.id === one);
  assert.equal(itemOne.read, true);
  const listB = await notificationService.listForAdmin(adminB, {});
  assert.equal(listB.items.find((i) => i.id === one).read, false);

  const all = await notificationService.markAllRead(adminA);
  assert.ok(all.marked >= 1);
  assert.equal(all.unreadCount, 0);
  assert.ok((await notificationService.listForAdmin(adminB, {})).unreadCount >= 2, "admin B unaffected");
  assert.ok(two);
});

realTest("marking a missing notification as read reports not found", async () => {
  const adminId = await makeAdmin("Missing");
  const result = await notificationService.markRead(adminId, 9999999999);
  assert.equal(result.found, false);
});

realTest("cursor pagination returns older items once each, newest first", async () => {
  const adminId = await makeAdmin("Pages");
  for (let i = 0; i < 3; i += 1) {
    await notificationService.createNotification({ eventType: "new_contact_message", message: `Page ${i}`, recordId: i + 1, dedupeKey: `${RUN}-page-${i}` });
  }
  const first = await notificationService.listForAdmin(adminId, { limit: 2 });
  assert.equal(first.items.length, 2);
  assert.equal(first.hasMore, true);
  assert.ok(first.items[0].id > first.items[1].id, "newest first");

  const second = await notificationService.listForAdmin(adminId, { limit: 2, beforeId: first.nextBeforeId });
  assert.ok(second.items.length >= 1);
  const firstIds = new Set(first.items.map((i) => i.id));
  for (const item of second.items) {
    assert.ok(item.id < first.nextBeforeId, "older than the cursor");
    assert.equal(firstIds.has(item.id), false, "no repeats across pages");
  }
});

realTest("poll returns only newer items, oldest first, with the latest id", async () => {
  const adminId = await makeAdmin("Poll");
  const a = await notificationService.createNotification({ eventType: "new_order", message: "Poll A", recordId: 5, dedupeKey: `${RUN}-poll-a` });
  const b = await notificationService.createNotification({ eventType: "new_order", message: "Poll B", recordId: 6, dedupeKey: `${RUN}-poll-b` });
  const polled = await notificationService.poll(adminId, a - 1);
  const ids = polled.items.map((i) => i.id);
  assert.ok(ids.includes(a) && ids.includes(b));
  assert.deepEqual(ids, [...ids].sort((x, y) => x - y), "oldest first");
  assert.ok(polled.latestId >= b);
  const after = await notificationService.poll(adminId, polled.latestId);
  assert.equal(after.items.length, 0, "nothing new after the cursor");
});

realTest("preferences: defaults, then saved per admin", async () => {
  const adminA = await makeAdmin("PrefA");
  const adminB = await makeAdmin("PrefB");
  assert.deepEqual(await notificationService.getPreferences(adminA), { soundEnabled: true, desktopEnabled: false });

  const saved = await notificationService.setPreferences(adminA, { soundEnabled: false, desktopEnabled: true });
  assert.deepEqual(saved, { soundEnabled: false, desktopEnabled: true });
  assert.deepEqual(await notificationService.getPreferences(adminA), { soundEnabled: false, desktopEnabled: true });
  assert.deepEqual(await notificationService.getPreferences(adminB), { soundEnabled: true, desktopEnabled: false }, "other admin unchanged");
});

realTest("a new customer registration adds one unread item for the admin", async () => {
  const customerId = await makeCustomer();
  const adminId = await makeAdmin("Count");
  const before = (await notificationService.listForAdmin(adminId, {})).unreadCount;
  await notificationService.createNotification({ eventType: "new_customer_registration", message: "Registered", recordId: customerId, dedupeKey: `${RUN}-cust` });
  assert.equal((await notificationService.listForAdmin(adminId, {})).unreadCount, before + 1);
});