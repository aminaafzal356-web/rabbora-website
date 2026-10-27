// Rabbora Living — start-up warnings for password reset email settings.
// No database, no network, no real SMTP. Environment variables are set
// only inside this test process and restored afterwards.

const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const emailService = require("../services/emailService");

const KEYS = ["SITE_URL", "NODE_ENV", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "EMAIL_FROM", "SMTP_SECURE"];
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

const FULL_SMTP = {
  SMTP_HOST: "smtp.hostinger.com",
  SMTP_PORT: "465",
  SMTP_USER: "uf@info.rabbora.co.uk",
  SMTP_PASSWORD: "super-secret-smtp-password-123",
  EMAIL_FROM: "Rabbora Living <info@rabbora.co.uk>",
};

test("no warnings when SMTP and SITE_URL are fully set on production", () => {
  setEnv({ ...FULL_SMTP, NODE_ENV: "production", SITE_URL: "https://rabbora.co.uk" });
  assert.deepEqual(emailService.configWarnings(), []);
});

test("production without SITE_URL warns that reset emails will not be sent", () => {
  setEnv({ ...FULL_SMTP, NODE_ENV: "production" });
  const w = emailService.configWarnings();
  assert.equal(w.length, 1);
  assert.match(w[0], /SITE_URL is not set/);
  assert.match(w[0], /NOT be sent/);
});

test("development without SITE_URL warns that links point to localhost", () => {
  setEnv({ ...FULL_SMTP, NODE_ENV: "development" });
  const w = emailService.configWarnings();
  assert.equal(w.length, 1);
  assert.match(w[0], /localhost:5500/);
});

test("production with a localhost SITE_URL warns", () => {
  setEnv({ ...FULL_SMTP, NODE_ENV: "production", SITE_URL: "http://localhost:5500" });
  const w = emailService.configWarnings();
  assert.equal(w.length, 1);
  assert.match(w[0], /points to localhost/);
});

test("missing SMTP_HOST or EMAIL_FROM warns that emails will not be sent", () => {
  setEnv({ ...FULL_SMTP, SMTP_HOST: "", NODE_ENV: "production", SITE_URL: "https://rabbora.co.uk" });
  const w = emailService.configWarnings();
  assert.ok(w.some((m) => /SMTP_HOST or EMAIL_FROM is missing/.test(m)));
});

test("SMTP user without password warns", () => {
  setEnv({ ...FULL_SMTP, SMTP_PASSWORD: "", NODE_ENV: "production", SITE_URL: "https://rabbora.co.uk" });
  const w = emailService.configWarnings();
  assert.ok(w.some((m) => /SMTP_PASSWORD is empty/.test(m)));
});

test("warnings never contain the SMTP password or the SMTP user name", () => {
  setEnv({ ...FULL_SMTP, NODE_ENV: "production" });
  const text = emailService.configWarnings().join("\n");
  assert.ok(!text.includes(FULL_SMTP.SMTP_PASSWORD));
  assert.ok(!text.includes(FULL_SMTP.SMTP_USER));
});

test("warnings with an empty SMTP password still do not reveal the user name", () => {
  setEnv({ ...FULL_SMTP, SMTP_PASSWORD: "", NODE_ENV: "production", SITE_URL: "https://rabbora.co.uk" });
  const text = emailService.configWarnings().join("\n");
  assert.ok(!text.includes(FULL_SMTP.SMTP_USER));
});

test("forget-password.js no longer contains the obsolete stub or its duplicate submit handler", () => {
  const file = path.join(__dirname, "..", "..", "forget-password.js");
  const source = fs.readFileSync(file, "utf8");
  assert.ok(!source.includes("function requestPasswordReset("), "stub function removed");
  assert.ok(!source.includes("isn't available yet"), "stub error text removed");
  assert.ok(!source.includes("function initForm("), "duplicate submit handler removed");
  assert.ok(!source.includes('addEventListener("submit"'), "no submit listener left in forget-password.js");
});