// Rabbora Living — Forgot Password / Reset Password (database work)
// ---------------------------------------------------------------
// Flow:
//   1. requestPasswordReset(email)
//        - finds an ACTIVE account with that email (users table)
//        - makes a random one-time token (32 random bytes)
//        - stores ONLY its SHA-256 hash + an expiry time in
//          password_reset_tokens (database/password_resets.sql)
//        - cancels any older unused link for the same account
//        - emails the link  SITE_URL/reset-password.html#token=…
//   2. checkResetToken(token)       -> is this link still usable?
//   3. resetPassword(token, password)
//        - in ONE transaction: locks the token row, checks it is
//          unused + not expired, saves the new bcrypt hash in
//          users.password_hash, marks the token used, cancels every
//          other open link and logs the account out everywhere
//          (deletes its rows in user_sessions).
//
// Security notes:
//   - The plain token exists only in the email; the database has the hash.
//   - Tokens expire (PASSWORD_RESET_EXPIRY_MINUTES, default 30) and
//     work once.
//   - The caller never learns whether an email is registered.
//   - Nothing secret is logged (no token, link, password or email
//     address — only the account id).
//   - Passwords use the same bcrypt settings as registration
//     (routes/auth.js: 12 rounds, 8 characters minimum, 72 bytes max).

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");
const { sendEmail } = require("./emailService");

// Same values as routes/auth.js (registration + login).
const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN = 8;
const PASSWORD_MAX_BYTES = 72;
const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOKEN_BYTES = 32; // 256 bits of randomness
// The token travels as base64url text: 32 bytes -> 43 characters.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

const DEFAULT_EXPIRY_MINUTES = 30;
const MIN_EXPIRY_MINUTES = 10;
const MAX_EXPIRY_MINUTES = 120;

function expiryMinutes() {
  const value = Number(process.env.PASSWORD_RESET_EXPIRY_MINUTES);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_EXPIRY_MINUTES;
  return Math.min(MAX_EXPIRY_MINUTES, Math.max(MIN_EXPIRY_MINUTES, Math.round(value)));
}

// The website address the email link points to. Never taken from the
// request (a forged Host header could otherwise send customers to
// another site). Local development falls back to Live Server.
function siteUrl() {
  const fromEnv = String(process.env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  return "http://localhost:5500";
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

function cleanEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email) {
  return Boolean(email) && email.length <= EMAIL_MAX && EMAIL_PATTERN.test(email);
}

function isWellFormedToken(token) {
  return typeof token === "string" && TOKEN_PATTERN.test(token);
}

// Returns an error message for the new password, or "" when it is fine.
function passwordProblem(password) {
  if (typeof password !== "string" || password === "") return "Please enter a new password.";
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) return "Password is too long.";
  return "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(firstName, link, minutes) {
  const name = firstName ? ` ${firstName}` : "";
  const text =
    `Hello${name},\n\n` +
    "We received a request to reset the password for your Rabbora Living account.\n\n" +
    `Choose a new password here (this link works once and expires in ${minutes} minutes):\n` +
    `${link}\n\n` +
    "If you didn't ask for this, you can ignore this email — your password will not change.\n\n" +
    "Rabbora Living";

  const safeName = escapeHtml(name);
  const safeLink = escapeHtml(link);
  const html = `<!doctype html>
<html lang="en-GB"><body style="margin:0;padding:0;background:#f1ebde;font-family:Arial,Helvetica,sans-serif;color:#12281f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1ebde;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;padding:32px 28px;">
        <tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#12281f;padding-bottom:16px;">Rabbora Living</td></tr>
        <tr><td style="font-size:15px;line-height:1.6;padding-bottom:12px;">Hello${safeName},</td></tr>
        <tr><td style="font-size:15px;line-height:1.6;padding-bottom:24px;">We received a request to reset the password for your Rabbora Living account. Tap the button below to choose a new password.</td></tr>
        <tr><td align="center" style="padding-bottom:24px;">
          <a href="${safeLink}" style="display:inline-block;background:#1f3d30;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:999px;">Reset my password</a>
        </td></tr>
        <tr><td style="font-size:13px;line-height:1.6;color:#4a4a44;padding-bottom:12px;">This link works once and expires in ${minutes} minutes. If the button doesn't work, copy this address into your browser:</td></tr>
        <tr><td style="font-size:12px;line-height:1.5;word-break:break-all;color:#4a4a44;padding-bottom:20px;">${safeLink}</td></tr>
        <tr><td style="font-size:13px;line-height:1.6;color:#4a4a44;">If you didn't ask for this, you can ignore this email — your password will not change.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject: "Reset your Rabbora Living password", text, html };
}

// Step 1. Never throws for "no such account"; the caller always answers
// the visitor with the same message.
async function requestPasswordReset(rawEmail) {
  const email = cleanEmail(rawEmail);
  if (!isValidEmail(email)) return;

  const result = await db.query(
    "SELECT id, first_name FROM users WHERE email = $1 AND is_active = TRUE",
    [email]
  );
  const user = result.rows[0];
  if (!user) return; // unknown or disabled account: nothing is sent

  const base = siteUrl();
  if (!base) {
    console.error("[password-reset] SITE_URL is not set in backend/.env — reset email not sent.");
    return;
  }

  const minutes = expiryMinutes();
  const token = crypto.randomBytes(TOKEN_BYTES).toString("base64url");

  await withTransaction(async (client) => {
    // Only the newest link works: older unused links are cancelled.
    await client.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL",
      [user.id]
    );
    await client.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
      [user.id, hashToken(token), minutes]
    );
  });

  // The token goes after "#", so it is never sent to the web server
  // (not in server logs or Referer headers). reset-password.js reads it.
  const link = `${base}/reset-password.html#token=${token}`;
  const message = buildEmail(user.first_name, link, minutes);

  try {
    const sent = await sendEmail({ to: email, ...message });
    if (sent) console.log(`[password-reset] Reset email sent (user id ${user.id}).`);
  } catch (err) {
    // Provider error: log the reason only (never the link or address).
    console.error(`[password-reset] Could not send reset email (user id ${user.id}):`, err.code || "", err.responseCode || "", err.message);
  }
}

// Step 2. True when the link exists, is unused, not expired and its
// account is still active.
async function checkResetToken(token) {
  if (!isWellFormedToken(token)) return false;
  const result = await db.query(
    `SELECT 1
       FROM password_reset_tokens t
       JOIN users u ON u.id = t.user_id
      WHERE t.token_hash = $1
        AND t.used_at IS NULL
        AND t.expires_at > NOW()
        AND u.is_active = TRUE`,
    [hashToken(token)]
  );
  return result.rowCount === 1;
}

// Step 3. Returns { ok: true } or { ok: false, reason: "INVALID_TOKEN" }.
// The password must already have passed passwordProblem().
async function resetPassword(token, newPassword) {
  if (!isWellFormedToken(token)) return { ok: false, reason: "INVALID_TOKEN" };

  // Hash before opening the transaction (bcrypt is slow on purpose).
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  return withTransaction(async (client) => {
    // FOR UPDATE: if the same link is submitted twice at the same
    // moment, the second request waits and then sees used_at set.
    const found = await client.query(
      `SELECT t.id, t.user_id
         FROM password_reset_tokens t
         JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = $1
          AND t.used_at IS NULL
          AND t.expires_at > NOW()
          AND u.is_active = TRUE
        FOR UPDATE OF t`,
      [hashToken(token)]
    );
    const row = found.rows[0];
    if (!row) return { ok: false, reason: "INVALID_TOKEN" };

    await client.query(
      "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [passwordHash, row.user_id]
    );
    // This link + any other open link for the account: unusable now.
    await client.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL",
      [row.user_id]
    );
    // Log the account out on every device (the old password may have
    // been known to someone else).
    await client.query(
      "DELETE FROM user_sessions WHERE (sess::jsonb ->> 'userId') = $1",
      [String(row.user_id)]
    );

    console.log(`[password-reset] Password changed (user id ${row.user_id}).`);
    return { ok: true };
  });
}

module.exports = {
  requestPasswordReset,
  checkResetToken,
  resetPassword,
  passwordProblem,
  isValidEmail,
  cleanEmail,
  // exported for the automated tests
  hashToken,
  expiryMinutes,
};