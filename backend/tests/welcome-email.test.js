// Rabbora Living — welcome email tests (services/welcomeEmailService.js and
// the POST /api/auth/register hook in routes/auth.js).
// No database, no SMTP server, no real email. The database pool and the mail
// sender are replaced only inside this file, and console output is captured
// so secrets and addresses can be checked to be absent from logs.

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const db = require("../config/db");
const emailService = require("../services/emailService");

// Stub the mail sender BEFORE the welcome service is loaded (it copies the function at load time).
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

const welcome = require("../services/welcomeEmailService");
const authRouter = require("../routes/auth");

const SITE = "https://rabbora.co.uk";
const NEW_EMAIL = "new.customer@example.test";
const SECRET_PASSWORD_TEXT = "Super-Secret-Password-42";

const originals = {};
let logged;
let state;

beforeEach(() => {
  mail.calls = [];
  mail.behaviour = "ok";
  logged = [];
  state = { existing: false, uniqueViolation: false, inserts: 0, queries: [] };
  originals.connect = db.pool.connect;
  originals.log = console.log;
  originals.error = console.error;
  originals.warn = console.warn;
  db.pool.connect = async () => ({
    query: async (sql, params = []) => {
      state.queries.push(sql);
      if (sql.includes("SELECT 1 FROM users WHERE email")) {
        return { rows: state.existing ? [{ "?column?": 1 }] : [], rowCount: state.existing ? 1 : 0 };
      }
      if (sql.includes("INSERT INTO users")) {
        if (state.uniqueViolation) {
          const err = new Error("duplicate key value violates unique constraint");
          err.code = "23505";
          err.constraint = "users_email_key";
          throw err;
        }
        state.inserts++;
        return {
          rows: [{ id: 42, first_name: params[0], last_name: params[1], email: params[2], phone: params[3] }],
          rowCount: 1,
        };
      }
      return { rows: [], rowCount: 0 };
    },
    release() {},
  });
  const capture = (...args) => logged.push(args.map(String).join(" "));
  console.log = capture;
  console.error = capture;
  console.warn = capture;
  process.env.SITE_URL = SITE;
});

afterEach(() => {
  db.pool.connect = originals.connect;
  console.log = originals.log;
  console.error = originals.error;
  console.warn = originals.warn;
  delete process.env.SITE_URL;
  delete process.env.NODE_ENV;
});

// ---------- email content ----------

test("account link points to account.html on the live site", () => {
  assert.equal(welcome.accountUrlFor(SITE), "https://rabbora.co.uk/account.html");
  const email = welcome.buildWelcomeEmail("Amina", SITE);
  assert.ok(email.text.includes("https://rabbora.co.uk/account.html"), "plain text has the account link");
  assert.ok(email.html.includes('href="https://rabbora.co.uk/account.html"'), "HTML button links to the account page");
  assert.ok(!/localhost|127\.0\.0\.1/.test(email.html + email.text), "no local address in a live email");
});

test("the welcome email has no password, no reset token and no reset link", () => {
  const email = welcome.buildWelcomeEmail("Amina", SITE);
  const all = email.subject + "\n" + email.text + "\n" + email.html;
  assert.ok(!all.includes(SECRET_PASSWORD_TEXT));
  assert.ok(!/reset-password\.html/.test(all), "no permanent password-reset link");
  assert.ok(!/#token=/.test(all), "no token in any link");
  assert.ok(!/password\s*[:=]/i.test(all), "no password value is written out");
  assert.match(all, /Forgot password\?/, "points to the forgot-password help instead");
});

test("the first name is greeted and HTML characters in it are escaped", () => {
  const email = welcome.buildWelcomeEmail('<img src=x onerror="alert(1)">', SITE);
  assert.ok(email.text.includes("\nHello <img"), "plain text keeps the name as typed");
  assert.ok(!email.html.includes("<img src=x"), "HTML escapes the name");
  assert.ok(email.html.includes("Hello &lt;img src=x onerror=&quot;alert(1)&quot;&gt;"));
});

test("with no first name the greeting is a plain Hello", () => {
  const email = welcome.buildWelcomeEmail("   ", SITE);
  assert.ok(email.text.includes("\nHello,\n"));
  assert.ok(email.html.includes(">Hello,</p>"));
});

test("the email is branded: forest and ivory colours, and the viewport meta for phones", () => {
  const { html } = welcome.buildWelcomeEmail("Amina", SITE);
  assert.ok(html.includes("#1b3a2f") && html.includes("#f1ebde"));
  assert.ok(html.includes('name="viewport"'));
  assert.ok(html.includes("max-width:600px"), "single column, fits phone width");
});

test("the logo and every image use absolute HTTPS addresses on the live site", () => {
  const { html } = welcome.buildWelcomeEmail("Amina", SITE);
  assert.ok(html.includes('src="https://rabbora.co.uk/images/email-logo.png"'), "logo is an absolute HTTPS URL");
  const srcs = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  for (const src of srcs) assert.ok(src.startsWith("https://"), "image is HTTPS: " + src);
  assert.ok(html.includes('alt="Rabbora Living"'), "logo has alt text");
});

test("the email has the welcome banner heading, the account button and the account confirmation", () => {
  const email = welcome.buildWelcomeEmail("Amina", SITE, NEW_EMAIL);
  assert.ok(email.html.includes("Welcome to Rabbora Living!"), "banner heading");
  assert.ok(email.html.includes(">VISIT MY ACCOUNT</a>"), "prominent account button");
  assert.ok(email.html.includes('href="https://rabbora.co.uk/account.html"'));
  assert.ok(email.html.includes("Your account has been created"), "confirms the account was created");
  assert.ok(email.html.includes(NEW_EMAIL), "shows the registered email address");
  assert.ok(email.text.includes("VISIT MY ACCOUNT:"), "plain-text version has the account link too");
});

test("the email gives the website link and the customer support details from the site footer", () => {
  const email = welcome.buildWelcomeEmail("Amina", SITE, NEW_EMAIL);
  for (const part of ["https://rabbora.co.uk", "info@rabbora.co.uk", "+44 7853 444640", "tel:+447853444640"]) {
    assert.ok(email.html.includes(part), "HTML has " + part);
  }
  assert.ok(email.text.includes("info@rabbora.co.uk") && email.text.includes("+44 7853 444640"));
});

test("the email escapes the registered address in HTML", () => {
  const email = welcome.buildWelcomeEmail("Amina", SITE, '"><script>x</script>@example.test');
  assert.ok(!email.html.includes("<script>x</script>"));
});

// ---------- sending: success and failure never break the caller ----------

test("success: one email to the new customer, with the account link, and the outcome is reported as sent", async () => {
  const result = await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: NEW_EMAIL });
  assert.deepEqual(result, { sent: true });
  assert.equal(mail.calls.length, 1);
  assert.equal(mail.calls[0].to, NEW_EMAIL);
  assert.equal(mail.calls[0].subject, "Welcome to Rabbora Living");
  assert.ok(mail.calls[0].html.includes("https://rabbora.co.uk/account.html"));
  assert.ok(logged.some((l) => l.includes("accepted by the mail server (user id 42)")));
  assert.ok(!logged.join("\n").includes(NEW_EMAIL), "the address is not logged");
});

test("email failure: the send is caught, resolves sent:false, and logs the code only", async () => {
  mail.behaviour = "fail";
  let result;
  await assert.doesNotReject(async () => {
    result = await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: NEW_EMAIL });
  });
  assert.deepEqual(result, { sent: false, reason: "EAUTH" });
  const text = logged.join("\n");
  assert.ok(text.includes("Could not send welcome email"));
  assert.ok(text.includes("EAUTH") && text.includes("535"));
  assert.ok(!text.includes(NEW_EMAIL), "address not logged");
  assert.ok(!logged.some((l) => l.includes("accepted by the mail server")), "a failure is never reported as accepted");
});

test("SMTP not configured: resolves sent:false and says so", async () => {
  mail.behaviour = "not-configured";
  const result = await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: NEW_EMAIL });
  assert.deepEqual(result, { sent: false, reason: "not-configured" });
  assert.ok(logged.some((l) => l.includes("NOT sent: SMTP is not configured")));
});

test("production with no SITE_URL: nothing is sent and the link is never guessed", async () => {
  delete process.env.SITE_URL;
  process.env.NODE_ENV = "production";
  const result = await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: NEW_EMAIL });
  assert.deepEqual(result, { sent: false, reason: "no-site-url" });
  assert.equal(mail.calls.length, 0);
});

test("development with no SITE_URL falls back to the local Live Server address", async () => {
  delete process.env.SITE_URL;
  await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: NEW_EMAIL });
  assert.ok(mail.calls[0].html.includes("http://localhost:5500/account.html"));
});

test("no recipient: nothing is sent", async () => {
  const result = await welcome.sendWelcomeEmail({ id: 42, firstName: "Amina", email: "" });
  assert.deepEqual(result, { sent: false, reason: "no-recipient" });
  assert.equal(mail.calls.length, 0);
});

// ---------- registration route: one email per new account, never a second account ----------

async function withServer(fn) {
  const express = require("express");
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRouter);
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

function register(base, body) {
  return fetch(base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID = {
  firstName: "Amina",
  lastName: "Afzal",
  email: NEW_EMAIL,
  phone: "+44 7700 900123",
  password: SECRET_PASSWORD_TEXT,
};

// The welcome email is sent after the answer, so wait a moment for it.
async function waitForMail(count, timeoutMs = 2000) {
  const start = Date.now();
  while (mail.calls.length < count && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 10));
  }
  await new Promise((r) => setTimeout(r, 30));
}

test("registration success: 201, the account is created, and exactly one welcome email is sent", async () => {
  await withServer(async (base) => {
    const res = await register(base, VALID);
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.firstName, "Amina");
    assert.ok(!("password" in data.user) && !("password_hash" in data.user));
    await waitForMail(1);
    assert.equal(state.inserts, 1, "one account row");
    assert.equal(mail.calls.length, 1, "exactly one welcome email");
    assert.equal(mail.calls[0].to, NEW_EMAIL);
    assert.ok(mail.calls[0].html.includes("https://rabbora.co.uk/account.html"), "email links to account.html");
    assert.ok(!mail.calls[0].html.includes(SECRET_PASSWORD_TEXT) && !mail.calls[0].text.includes(SECRET_PASSWORD_TEXT));
  });
});

test("email failure does not change registration: still 201, the account exists, and the failure is logged safely", async () => {
  mail.behaviour = "fail";
  await withServer(async (base) => {
    const res = await register(base, VALID);
    assert.equal(res.status, 201, "registration still succeeds");
    const data = await res.json();
    assert.equal(data.success, true);
    await waitForMail(1);
    assert.equal(state.inserts, 1, "account created once");
    assert.equal(mail.calls.length, 1, "one attempt, no retry");
    const text = logged.join("\n");
    assert.ok(text.includes("Could not send welcome email"));
    assert.ok(!text.includes(NEW_EMAIL), "address not logged");
    assert.ok(!text.includes(SECRET_PASSWORD_TEXT), "password not logged");
  });
});

test("duplicate protection: an email that already exists gets 409, no account row and no email", async () => {
  state.existing = true;
  await withServer(async (base) => {
    const res = await register(base, VALID);
    assert.equal(res.status, 409);
    await waitForMail(0);
    assert.equal(state.inserts, 0);
    assert.equal(mail.calls.length, 0, "no welcome email for a rejected sign-up");
  });
});

test("duplicate protection: two sign-ups racing past the check — the database refuses the second, no email for it", async () => {
  state.uniqueViolation = true;
  await withServer(async (base) => {
    const res = await register(base, VALID);
    assert.equal(res.status, 409);
    await waitForMail(0);
    assert.equal(mail.calls.length, 0, "no welcome email when the insert is refused");
  });
});

test("invalid details: 400, no database write and no email", async () => {
  await withServer(async (base) => {
    const res = await register(base, { ...VALID, email: "not-an-email" });
    assert.equal(res.status, 400);
    await waitForMail(0);
    assert.equal(state.queries.length, 0, "database not touched");
    assert.equal(mail.calls.length, 0);
  });
});

test("a failed insert (server error) sends no email", async () => {
  db.pool.connect = async () => ({
    query: async () => {
      throw new Error("connection lost");
    },
    release() {},
  });
  await withServer(async (base) => {
    const res = await register(base, VALID);
    assert.equal(res.status, 500);
    await waitForMail(0);
    assert.equal(mail.calls.length, 0);
  });
});

test("the registration route keeps the welcome send after the response (not before)", () => {
  const fs = require("fs");
  const path = require("path");
  const src = fs.readFileSync(path.join(__dirname, "..", "routes", "auth.js"), "utf8");
  const sendAt = src.indexOf("res.status(201).json");
  const emailAt = src.indexOf("sendWelcomeEmail({");
  assert.ok(sendAt > 0 && emailAt > sendAt, "the 201 answer is sent before the welcome email is started");
  assert.ok(src.includes("setImmediate"), "email is started after the answer");
  assert.ok(src.includes(".catch(() => {})"), "a rejected send can never become an unhandled error");
});