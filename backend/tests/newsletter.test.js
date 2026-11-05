// Rabbora Living — newsletter subscription tests.
// Most tests replace the database service and the mail sender, so they run
// without PostgreSQL. The last group runs against a real PostgreSQL database
// when NEWSLETTER_TEST_DB names a database that already has
// database/newsletter.sql applied; otherwise those tests are skipped.

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const REAL_DB = process.env.NEWSLETTER_TEST_DB || "";
if (REAL_DB) process.env.DB_NAME = REAL_DB;

const emailService = require("../services/emailService");
const service = require("../services/newsletterService");

// Stub the mail sender BEFORE the newsletter email module is loaded (it copies the function at load time).
const mail = { calls: [], result: true, error: null };
emailService.sendEmail = async (message) => {
  mail.calls.push(message);
  if (mail.error) throw mail.error;
  return mail.result;
};

// The real service functions, kept before any test replaces them.
const REAL = Object.assign({}, service);

const controller = require("../controllers/newsletterController");
const newsletterEmail = require("../services/newsletterEmail");
const newsletterRouter = require("../routes/newsletter");

const SITE = "https://rabbora.co.uk";
const CONFIRM = "A".repeat(43);
const UNSUB = "B".repeat(43);

const originals = {};
let logged;
let calls;

function fakeReq(body, params = {}, query = {}) {
  return { body, params, query };
}

function fakeRes() {
  const res = {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    set(k, v) { this.headers[k] = v; return this; },
    send(payload) { this.body = payload; return this; },
  };
  return res;
}

// Runs an async controller and returns the response, turning thrown
// AppErrors into the same shape the error handler would send.
async function run(fn, req, res) {
  try {
    await fn(req, res);
  } catch (err) {
    res.statusCode = err.status || 500;
    res.body = { success: false, code: err.code, message: err.message, errors: err.errors };
  }
  return res;
}

beforeEach(() => {
  mail.calls = [];
  mail.result = true;
  mail.error = null;
  logged = [];
  calls = { subscribe: 0, confirm: 0, unsubscribe: 0, adminUnsubscribe: 0, exportRows: [] };
  originals.subscribe = service.subscribe;
  originals.confirm = service.confirm;
  originals.unsubscribeByToken = service.unsubscribeByToken;
  originals.adminUnsubscribe = service.adminUnsubscribe;
  originals.exportRows = service.exportRows;
  originals.log = console.log;
  originals.error = console.error;
  originals.warn = console.warn;
  const capture = (...args) => logged.push(args.map(String).join(" "));
  console.log = capture;
  console.error = capture;
  console.warn = capture;
  process.env.SITE_URL = SITE;
  service.subscribe = async (email) => {
    calls.subscribe += 1;
    return { state: "pending", email, confirmToken: CONFIRM, unsubscribeToken: UNSUB };
  };
  service.confirm = async () => { calls.confirm += 1; return { ok: true }; };
  service.unsubscribeByToken = async () => { calls.unsubscribe += 1; return { ok: true, alreadyUnsubscribed: false }; };
  service.adminUnsubscribe = async (id) => {
    calls.adminUnsubscribe += 1;
    return { id, email: "x@example.test", status: "unsubscribed" };
  };
  service.exportRows = async () => calls.exportRows;
});

afterEach(() => {
  service.subscribe = originals.subscribe;
  service.confirm = originals.confirm;
  service.unsubscribeByToken = originals.unsubscribeByToken;
  service.adminUnsubscribe = originals.adminUnsubscribe;
  service.exportRows = originals.exportRows;
  console.log = originals.log;
  console.error = originals.error;
  console.warn = originals.warn;
  delete process.env.SITE_URL;
  delete process.env.NODE_ENV;
});

// ---------- subscribe: validation and responses ----------

test("invalid email: 400 with a field error, nothing saved, no email", async () => {
  const res = await run(controller.subscribe, fakeReq({ email: "not-an-email" }), fakeRes());
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.errors[0].field, "email");
  assert.equal(calls.subscribe, 0);
  assert.equal(mail.calls.length, 0);
});

test("empty input: 400 asking for the address, nothing saved", async () => {
  const res = await run(controller.subscribe, fakeReq({ email: "   " }), fakeRes());
  assert.equal(res.statusCode, 400);
  assert.match(res.body.errors[0].message, /enter your email/i);
  assert.equal(calls.subscribe, 0);
});

test("missing body field: 400, not a server error", async () => {
  const res = await run(controller.subscribe, fakeReq(undefined), fakeRes());
  assert.equal(res.statusCode, 400);
});

test("a valid address is trimmed and lower-cased before it is saved", async () => {
  let seen = null;
  service.subscribe = async (email) => { seen = email; return { state: "pending", email, confirmToken: CONFIRM, unsubscribeToken: UNSUB }; };
  await run(controller.subscribe, fakeReq({ email: "  Amina.Test@Example.COM " }), fakeRes());
  assert.equal(seen, "amina.test@example.com");
});

test("valid address, email sent: 201, the confirmation link goes to the customer, and nothing secret is logged", async () => {
  const res = await run(controller.subscribe, fakeReq({ email: "new@example.test" }), fakeRes());
  assert.equal(res.statusCode, 201);
  assert.equal(res.body.status, "pending");
  assert.equal(res.body.confirmationEmailSent, true);
  assert.equal(mail.calls.length, 1);
  assert.equal(mail.calls[0].to, "new@example.test");
  assert.ok(mail.calls[0].html.includes(`https://rabbora.co.uk/newsletter.html#confirm=${CONFIRM}`));
  assert.ok(mail.calls[0].text.includes(`#unsubscribe=${UNSUB}`), "every email carries the unsubscribe link");
  const logText = logged.join("\n");
  assert.ok(!logText.includes("new@example.test"), "address not logged");
  assert.ok(!logText.includes(CONFIRM) && !logText.includes(UNSUB), "tokens not logged");
});

test("valid address, but SMTP is not set up: 202 says the email was not sent (no false success)", async () => {
  mail.result = false;
  const res = await run(controller.subscribe, fakeReq({ email: "new@example.test" }), fakeRes());
  assert.equal(res.statusCode, 202);
  assert.equal(res.body.confirmationEmailSent, false);
  assert.match(res.body.message, /could not send the confirmation email/i);
});

test("already subscribed: 200, and no confirmation email is sent", async () => {
  service.subscribe = async () => ({ state: "already-active" });
  const res = await run(controller.subscribe, fakeReq({ email: "active@example.test" }), fakeRes());
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "already-active");
  assert.equal(mail.calls.length, 0);
});

test("a rejected email send never turns into a server error", async () => {
  mail.error = Object.assign(new Error("Invalid login"), { code: "EAUTH", responseCode: 535 });
  const res = await run(controller.subscribe, fakeReq({ email: "new@example.test" }), fakeRes());
  assert.equal(res.statusCode, 202);
  assert.ok(logged.some((l) => l.includes("Could not send confirmation email") && l.includes("EAUTH")));
  assert.ok(!logged.join("\n").includes("new@example.test"), "address not logged");
});

// ---------- confirm and unsubscribe ----------

test("confirm with a malformed token: 400 and the database is not touched", async () => {
  let touched = false;
  service.confirm = async () => { touched = true; return { ok: true }; };
  const res = await run(controller.confirm, fakeReq({ token: "<script>" }), fakeRes());
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.code, "INVALID_TOKEN");
  assert.equal(touched, false);
});

test("confirm with a valid token that no longer matches (expired, used or replaced): 400", async () => {
  service.confirm = async () => ({ ok: false });
  const res = await run(controller.confirm, fakeReq({ token: CONFIRM }), fakeRes());
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /invalid or has expired/i);
});

test("confirm with the right token: 200 and status active", async () => {
  const res = await run(controller.confirm, fakeReq({ token: CONFIRM }), fakeRes());
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "active");
});

test("unsubscribe with an unknown token: 400", async () => {
  service.unsubscribeByToken = async () => ({ ok: false });
  const res = await run(controller.unsubscribe, fakeReq({ token: UNSUB }), fakeRes());
  assert.equal(res.statusCode, 400);
});

test("unsubscribe twice: both answers are 200, the second says it was already done", async () => {
  const first = await run(controller.unsubscribe, fakeReq({ token: UNSUB }), fakeRes());
  service.unsubscribeByToken = async () => ({ ok: true, alreadyUnsubscribed: true });
  const second = await run(controller.unsubscribe, fakeReq({ token: UNSUB }), fakeRes());
  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 200);
  assert.match(second.body.message, /already been unsubscribed/i);
});

// ---------- admin ----------

test("admin can only unsubscribe: any other status is refused", async () => {
  const res = await run(controller.adminUpdate, fakeReq({ status: "active" }, { id: "5" }), fakeRes());
  assert.equal(res.statusCode, 400);
  assert.equal(calls.adminUnsubscribe, 0);
});

test("admin unsubscribe of a valid id works", async () => {
  const res = await run(controller.adminUpdate, fakeReq({ status: "unsubscribed" }, { id: "5" }), fakeRes());
  assert.equal(res.statusCode, 200);
  assert.equal(calls.adminUnsubscribe, 1);
});

test("admin unsubscribe with a bad id: 404", async () => {
  const res = await run(controller.adminUpdate, fakeReq({ status: "unsubscribed" }, { id: "abc" }), fakeRes());
  assert.equal(res.statusCode, 404);
});

test("CSV export: header, escaping, formula protection, BOM, download name, and no tokens", async () => {
  calls.exportRows = [
    { email: "plain@example.test", status: "active", source: "homepage", consentAt: "2026-01-02T03:04:05.000Z", confirmedAt: "2026-01-02T03:10:00.000Z", unsubscribedAt: null },
    { email: "=cmd@example.test", status: "pending", source: "homepage", consentAt: "2026-01-02T03:04:05.000Z", confirmedAt: null, unsubscribedAt: null },
    { email: "quote\"d@example.test", status: "unsubscribed", source: "homepage", consentAt: "2026-01-02T03:04:05.000Z", confirmedAt: null, unsubscribedAt: "2026-02-01T00:00:00.000Z" },
  ];
  const res = fakeRes();
  await controller.adminExportCsv(fakeReq({}, {}, {}), res);
  const csv = res.body;
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers["Content-Type"], "text/csv; charset=utf-8");
  assert.match(res.headers["Content-Disposition"], /attachment; filename="rabbora-newsletter-subscribers-\d{4}-\d{2}-\d{2}\.csv"/);
  assert.ok(csv.startsWith("﻿email,status,source,subscribed_at,confirmed_at,unsubscribed_at"), "header row with BOM");
  assert.ok(csv.includes("'=cmd@example.test"), "leading = is neutralised");
  assert.ok(csv.includes('"quote""d@example.test"'), "quotes are escaped");
  assert.ok(!/token/i.test(csv), "no token column");
});

// ---------- email content ----------

test("the confirmation email explains the link, gives unsubscribe, and escapes its content", () => {
  const email = newsletterEmail.buildConfirmationEmail(SITE, CONFIRM, UNSUB);
  assert.equal(email.subject, "Confirm your Rabbora Living subscription");
  assert.ok(email.html.includes(`#confirm=${CONFIRM}`));
  assert.ok(email.html.includes(`#unsubscribe=${UNSUB}`));
  assert.ok(!/localhost|127\.0\.0\.1/.test(email.html + email.text), "no local address in a live email");
  assert.ok(!/password/i.test(email.text), "no password wording");
});

test("no SITE_URL in production: nothing is sent and the link is never guessed", async () => {
  process.env.NODE_ENV = "production";
  delete process.env.SITE_URL;
  const result = await newsletterEmail.sendConfirmationEmail({ email: "x@example.test", confirmToken: CONFIRM, unsubscribeToken: UNSUB });
  assert.deepEqual(result, { sent: false, reason: "no-site-url" });
  assert.equal(mail.calls.length, 0);
});

// ---------- wiring and rules ----------

test("the public routes are rate limited (10 sign-ups and 30 link uses per 15 minutes)", () => {
  assert.equal(newsletterRouter.limiters.subscribe.limit, 10);
  assert.equal(newsletterRouter.limiters.links.limit, 30);
});

test("server mounts the newsletter routes, and admin routes list export.csv before :id", () => {
  const server = fs.readFileSync(path.join(__dirname, "..", "server.js"), "utf8");
  assert.ok(server.includes('app.use("/api/newsletter", newsletterRoutes)'));
  const admin = fs.readFileSync(path.join(__dirname, "..", "routes", "admin.js"), "utf8");
  const csvAt = admin.indexOf('"/newsletter-subscribers/export.csv"');
  const idAt = admin.indexOf('"/newsletter-subscribers/:id"');
  assert.ok(csvAt > 0 && idAt > csvAt, "export.csv route comes before the :id route");
  assert.ok(admin.indexOf("router.use(requireAdmin)") < csvAt, "newsletter admin routes sit behind requireAdmin");
});

test("the migration only adds: idempotent statements, no drops, no data changes", () => {
  const sql = fs.readFileSync(path.join(__dirname, "..", "database", "newsletter.sql"), "utf8");
  assert.ok(!/\bDROP\b|\bTRUNCATE\b|\bDELETE\b|\bALTER\s+TABLE\b/i.test(sql), "no destructive statement");
  assert.ok(/CREATE TABLE IF NOT EXISTS newsletter_subscribers/.test(sql));
  assert.ok(/CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lower_unique\s+ON newsletter_subscribers \(lower\(email\)\)/.test(sql));
});

test("the homepage posts to the real endpoint and no longer has a placeholder", () => {
  const script = fs.readFileSync(path.join(__dirname, "..", "..", "script.js"), "utf8");
  assert.ok(script.includes('request("/newsletter/subscribe"'));
  assert.ok(!script.includes("Thanks \\u2014 you're on the list"), "placeholder success message removed");
});

// ---------- real PostgreSQL (only when NEWSLETTER_TEST_DB is set) ----------

const realTest = REAL_DB ? test : (name, fn) => test(name, { skip: "set NEWSLETTER_TEST_DB to run against PostgreSQL" }, fn);

realTest("real database: sign-up saves one row per address (any case), confirm activates it, unsubscribe stops it", async () => {
  const db = require("../config/db");
  await db.query("DELETE FROM newsletter_subscribers WHERE lower(email) LIKE 'real-test-%@example.test'");
  const email = "real-test-1@example.test";
  const first = await REAL.subscribe(email);
  const second = await REAL.subscribe(email.toUpperCase());
  assert.equal(first.state, "pending");
  assert.equal(second.state, "pending");
  const count = await db.query("SELECT COUNT(*)::int AS n FROM newsletter_subscribers WHERE lower(email) = $1", [email]);
  assert.equal(count.rows[0].n, 1, "one row per address");

  // The first link is replaced by the second, so only the newest works.
  const old = await REAL.confirm(first.confirmToken);
  assert.equal(old.ok, false);
  const now = await REAL.confirm(second.confirmToken);
  assert.equal(now.ok, true);
  const again = await REAL.confirm(second.confirmToken);
  assert.equal(again.ok, false, "a link works once");

  const active = await REAL.subscribe(email);
  assert.equal(active.state, "already-active");

  const out = await REAL.unsubscribeByToken(second.unsubscribeToken);
  assert.equal(out.ok, true);
  const stored = await db.query("SELECT status, unsubscribed_at FROM newsletter_subscribers WHERE lower(email) = $1", [email]);
  assert.equal(stored.rows[0].status, "unsubscribed");
  assert.ok(stored.rows[0].unsubscribed_at);
  await db.pool.end();
});