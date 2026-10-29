// Rabbora Living — regression tests for the Forgot Password / Reset Password flow.
// No database, no SMTP server, no real email. The database and the mail
// sender are replaced only inside this file (they are stubs), and console
// output is captured so secrets can be checked to be absent from logs.

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const db = require("../config/db");
const emailService = require("../services/emailService");

// Stub the mail sender BEFORE the reset service is loaded (it copies the function at load time).
const mail = { calls: [], behaviour: "ok" };
emailService.sendEmail = async (message) => {
  mail.calls.push(message);
  if (mail.behaviour === "fail") {
    const err = new Error("Invalid login: 535 Authentication failed");
    err.code = "EAUTH";
    err.responseCode = 535;
    throw err;
  }
  if (mail.behaviour === "not-configured") return false;
  return true;
};
const resetService = require("../services/passwordResetService");
const passwordResetRouter = require("../routes/passwordReset");

const KNOWN_EMAIL = "known.customer@example.test";
const SECRET_PASSWORD_TEXT = "Super-Secret-Password-42";
const originals = {};
let logged;
let queries;
let tokenInserts;
let userRows;

beforeEach(() => {
  mail.calls = [];
  mail.behaviour = "ok";
  logged = [];
  queries = [];
  tokenInserts = 0;
  userRows = [{ id: 2, first_name: "Test" }];
  originals.query = db.query;
  originals.connect = db.pool.connect;
  originals.log = console.log;
  originals.error = console.error;
  originals.warn = console.warn;
  db.query = async (sql, params = []) => {
    queries.push(sql);
    if (sql.includes("FROM users WHERE email")) return { rows: params[0] === KNOWN_EMAIL ? userRows : [], rowCount: params[0] === KNOWN_EMAIL ? userRows.length : 0 };
    if (sql.includes("FROM password_reset_tokens t")) return { rows: [], rowCount: 0 };
    return { rows: [], rowCount: 0 };
  };
  db.pool.connect = async () => ({
    query: async (sql) => {
      if (sql.includes("INSERT INTO password_reset_tokens")) tokenInserts++;
      return { rows: [], rowCount: 0 };
    },
    release() {},
  });
  const capture = (...args) => logged.push(args.map(String).join(" "));
  console.log = capture;
  console.error = capture;
  console.warn = capture;
  process.env.SITE_URL = "https://rabbora.co.uk";
});

afterEach(() => {
  db.query = originals.query;
  db.pool.connect = originals.connect;
  console.log = originals.log;
  console.error = originals.error;
  console.warn = originals.warn;
  delete process.env.SITE_URL;
});

// ---------- service: outcomes ----------

test("known account: a token is stored (hash only) and the email goes to the live site link", async () => {
  await resetService.requestPasswordReset(KNOWN_EMAIL);
  assert.equal(tokenInserts, 1, "one token row inserted");
  assert.equal(mail.calls.length, 1, "one email handed to the sender");
  const link = mail.calls[0].text.match(/https:\/\/\S+/)[0];
  assert.ok(link.startsWith("https://rabbora.co.uk/reset-password.html#token="), "link uses the live site and the reset page");
  assert.ok(!link.includes("localhost"));
  assert.ok(logged.some((l) => l.includes("accepted by the mail server")), "success is logged as accepted, not as delivered");
});

test("unknown account: no token, no email, a log line without the address", async () => {
  await resetService.requestPasswordReset("nobody@example.test");
  assert.equal(tokenInserts, 0);
  assert.equal(mail.calls.length, 0);
  assert.ok(logged.some((l) => l.includes("No active account matches")));
  assert.ok(!logged.join("\n").includes("nobody@example.test"));
});

test("SMTP refusal is caught, logged with the error code only, and not reported as sent", async () => {
  mail.behaviour = "fail";
  await assert.doesNotReject(resetService.requestPasswordReset(KNOWN_EMAIL));
  const text = logged.join("\n");
  assert.ok(text.includes("Could not send reset email"));
  assert.ok(text.includes("EAUTH"));
  assert.ok(!logged.some((l) => l.includes("accepted by the mail server")));
  assert.ok(!text.includes(KNOWN_EMAIL), "address not logged");
});

test("SMTP not configured outside production: logged as NOT sent", async () => {
  mail.behaviour = "not-configured";
  await resetService.requestPasswordReset(KNOWN_EMAIL);
  assert.ok(logged.some((l) => l.includes("NOT sent: SMTP is not configured")));
});

test("missing SITE_URL in production: nothing is stored or sent", async () => {
  delete process.env.SITE_URL;
  process.env.NODE_ENV = "production";
  try {
    await resetService.requestPasswordReset(KNOWN_EMAIL);
  } finally {
    delete process.env.NODE_ENV;
  }
  assert.equal(tokenInserts, 0);
  assert.equal(mail.calls.length, 0);
  assert.ok(logged.some((l) => l.includes("SITE_URL is not set")));
});

test("checkResetToken: a malformed token is refused without touching the database", async () => {
  assert.equal(await resetService.checkResetToken("short"), false);
  assert.equal(queries.length, 0);
});

test("checkResetToken: a well-formed but unknown, expired or used token is refused", async () => {
  const token = "A".repeat(43);
  assert.equal(await resetService.checkResetToken(token), false);
  assert.ok(queries.some((q) => q.includes("used_at IS NULL") && q.includes("expires_at > NOW()")));
});

test("resetPassword: unknown token returns INVALID_TOKEN and changes nothing", async () => {
  const token = "B".repeat(43);
  const result = await resetService.resetPassword(token, SECRET_PASSWORD_TEXT);
  assert.deepEqual(result, { ok: false, reason: "INVALID_TOKEN" });
  assert.ok(!queries.some((q) => q.includes("UPDATE users SET password_hash")));
});

test("resetPassword: never logs the new password", async () => {
  await resetService.resetPassword("C".repeat(43), SECRET_PASSWORD_TEXT);
  assert.ok(!logged.join("\n").includes(SECRET_PASSWORD_TEXT));
});

// ---------- route: generic answers and validation ----------

async function withServer(fn) {
  const express = require("express");
  const app = express();
  app.use(express.json());
  app.use("/api/auth", passwordResetRouter);
  const server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    return await fn(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function post(base, route, body) {
  return fetch(base + route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("route: invalid email format gets 400 VALIDATION_ERROR", async () => {
  await withServer(async (base) => {
    const res = await post(base, "/api/auth/forgot-password", { email: "not-an-email" });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.code, "VALIDATION_ERROR");
  });
});

test("route: an unknown but valid email gets the same 200 answer as a known one", async () => {
  await withServer(async (base) => {
    const known = await post(base, "/api/auth/forgot-password", { email: KNOWN_EMAIL });
    const unknown = await post(base, "/api/auth/forgot-password", { email: "nobody@example.test" });
    const a = await known.json();
    const b = await unknown.json();
    assert.equal(known.status, 200);
    assert.equal(unknown.status, 200);
    assert.deepEqual(a, b, "answers are identical, so account existence is not revealed");
    assert.match(a.message, /If an account exists with this email/);
  });
});

test("route: the answer does not claim an email was sent", async () => {
  await withServer(async (base) => {
    const res = await post(base, "/api/auth/forgot-password", { email: KNOWN_EMAIL });
    const data = await res.json();
    assert.ok(!/has been sent|we sent|email sent/i.test(data.message));
  });
});

// ---------- frontend: the form talks to the right endpoint and element IDs exist ----------

const ROOT = path.join(__dirname, "..", "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("frontend: password-reset.js posts to /auth/forgot-password through the shared API config", () => {
  const js = read("password-reset.js");
  assert.match(js, /postJson\("\/auth\/forgot-password"/);
  assert.match(js, /window\.RabboraApi\.API_URL/);
  assert.match(js, /form\.addEventListener\("submit"/);
});

test("frontend: every forgot-page ID that password-reset.js uses exists in forget-password.html", () => {
  const js = read("password-reset.js");
  const html = read("forget-password.html");
  const usedIds = new Set([...js.matchAll(/"(forgot[A-Za-z]+)"/g)].map((m) => m[1]));
  assert.ok(usedIds.size >= 5, "the form IDs were found in password-reset.js");
  for (const id of usedIds) {
    assert.ok(html.includes(`id="${id}"`), `forget-password.html has id="${id}"`);
  }
});

test("frontend: forget-password.js only looks up IDs that exist (decorative layers are optional)", () => {
  const js = read("forget-password.js");
  const html = read("forget-password.html");
  // Particle and parallax layers are decorative: the script returns early when they are absent.
  const optional = new Set(["forgotParticles", "forgotParallaxBack", "forgotParallaxMid", "forgotParallaxFront"]);
  const ids = [...js.matchAll(/getElementById\("([^"]+)"\)/g)].map((m) => m[1]);
  for (const id of ids.filter((i) => !optional.has(i))) {
    assert.ok(html.includes(`id="${id}"`), `forget-password.html has id="${id}"`);
  }
  assert.ok(!js.includes("forgotRequestState") && !js.includes("forgotFormStatus"), "no stale status IDs left");
});

test("frontend: faqs.js links to the real forget-password.html page", () => {
  const faqs = read("faqs.js");
  assert.ok(!faqs.includes('"forgot-password.html"'), "no link to the missing forgot-password.html");
  assert.ok(faqs.includes('href: "forget-password.html"'));
  assert.ok(fs.existsSync(path.join(ROOT, "forget-password.html")));
});

test("frontend: the reset page used by the email link exists and loads password-reset.js", () => {
  const html = read("reset-password.html");
  assert.ok(html.includes('src="password-reset.js?v=1"'));
  assert.ok(html.includes('src="api-config.js"'));
});