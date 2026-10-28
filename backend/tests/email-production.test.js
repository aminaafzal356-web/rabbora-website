// Rabbora Living — production SMTP safety (services/emailService.js).
// No network and no real mail server: the production check runs BEFORE any
// connection, so refused settings never open a socket in these tests.

const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");

const emailService = require("../services/emailService");

const KEYS = ["NODE_ENV", "SMTP_HOST", "SMTP_PORT", "SMTP_SECURE", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_FROM"];
const saved = {};
for (const k of KEYS) saved[k] = process.env[k];

function setEnv(values) {
  for (const k of KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(values)) process.env[k] = v;
}

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

const HOSTINGER = {
  NODE_ENV: "production",
  SMTP_HOST: "smtp.hostinger.com",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_USER: "mailbox@example.test",
  SMTP_PASSWORD: "not-a-real-password-for-tests",
  EMAIL_FROM: "Rabbora Living <mailbox@example.test>",
};

const MAIL = { to: "customer@example.test", subject: "t", text: "t", html: "<p>t</p>" };

test("production with the Hostinger settings is accepted", () => {
  setEnv(HOSTINGER);
  assert.equal(emailService.productionProblem(), "");
});

for (const host of ["localhost", "LOCALHOST", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]) {
  test(`production refuses a loopback SMTP host (${host})`, () => {
    setEnv({ ...HOSTINGER, SMTP_HOST: host, SMTP_PORT: "1025", SMTP_SECURE: "false" });
    const problem = emailService.productionProblem();
    assert.match(problem, /points to this server/);
  });
}

test("production sendEmail refuses localhost:1025 with SMTP_CONFIG and sends nothing", async () => {
  setEnv({ ...HOSTINGER, SMTP_HOST: "localhost", SMTP_PORT: "1025", SMTP_SECURE: "false" });
  await assert.rejects(emailService.sendEmail(MAIL), (err) => {
    assert.equal(err.code, "SMTP_CONFIG");
    assert.ok(!err.message.includes("not-a-real-password-for-tests"));
    return true;
  });
});

test("production refuses a port that is not a number", () => {
  setEnv({ ...HOSTINGER, SMTP_PORT: "abc" });
  assert.match(emailService.productionProblem(), /SMTP_PORT is not a valid port/);
});

test("production refuses a port out of range", () => {
  setEnv({ ...HOSTINGER, SMTP_PORT: "70000" });
  assert.match(emailService.productionProblem(), /SMTP_PORT is not a valid port/);
});

test("production refuses a missing SMTP password", () => {
  setEnv({ ...HOSTINGER, SMTP_PASSWORD: "" });
  assert.match(emailService.productionProblem(), /SMTP_USER or SMTP_PASSWORD is missing/);
});

test("production refuses missing host or sender with SMTP_CONFIG", async () => {
  setEnv({ ...HOSTINGER, SMTP_HOST: "" });
  assert.match(emailService.productionProblem(), /SMTP_HOST or EMAIL_FROM is missing/);
  await assert.rejects(emailService.sendEmail(MAIL), { code: "SMTP_CONFIG" });
});

test("outside production a localhost SMTP host is allowed (local mail catcher)", () => {
  setEnv({ ...HOSTINGER, NODE_ENV: "development", SMTP_HOST: "localhost", SMTP_PORT: "1025", SMTP_SECURE: "false" });
  assert.equal(emailService.productionProblem(), "");
});

test("outside production, missing SMTP settings still return false (not sent, no throw)", async () => {
  setEnv({ NODE_ENV: "development" });
  assert.equal(await emailService.sendEmail(MAIL), false);
});

test("describe() never says ON for production settings that are refused", () => {
  setEnv({ ...HOSTINGER, SMTP_HOST: "localhost", SMTP_PORT: "1025", SMTP_SECURE: "false" });
  const line = emailService.describe();
  assert.match(line, /NOT USABLE/);
  assert.ok(!/Email: ON/.test(line));
  assert.ok(!line.includes("not-a-real-password-for-tests"));
});

test("startup warnings flag the loopback host in production", () => {
  setEnv({ ...HOSTINGER, SITE_URL: "https://rabbora.co.uk", SMTP_HOST: "localhost", SMTP_PORT: "1025", SMTP_SECURE: "false" });
  const text = emailService.configWarnings().join("\n");
  assert.match(text, /Production email settings are unusable/);
  assert.ok(!text.includes("not-a-real-password-for-tests"));
});