// Rabbora Living — sending emails (SMTP, via the "nodemailer" package)
// ---------------------------------------------------------------
// Works with any normal email provider that offers SMTP: your domain's
// own mailbox (e.g. info@rabbora.co.uk from your host / cPanel),
// Microsoft 365, Google Workspace, Brevo, Mailgun, SendGrid, Amazon SES …
//
// All settings come from backend/.env (never from the code, never from
// Git):
//   SMTP_HOST       e.g. smtp.office365.com  /  smtp-relay.brevo.com
//   SMTP_PORT       587 (STARTTLS, most providers) or 465 (SSL)
//   SMTP_SECURE     true for port 465, false for 587
//   SMTP_USER       the SMTP login (often the full email address)
//   SMTP_PASSWORD   the SMTP password / app password / API key
//   EMAIL_FROM      the sender shown to customers,
//                   e.g. Rabbora Living <info@rabbora.co.uk>
//
// Nothing secret is ever logged: no password, no email body, no links.
// When SMTP is not set up, emails are simply not sent and a short
// warning is logged (the website keeps working).

const nodemailer = require("nodemailer");

const SEND_TIMEOUT_MS = 20000;

let transporter = null;
let transporterKey = "";

function readSettings() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secureRaw = String(process.env.SMTP_SECURE || "").trim().toLowerCase();
  return {
    host: String(process.env.SMTP_HOST || "").trim(),
    port,
    // Default: SSL on 465, STARTTLS on anything else.
    secure: secureRaw ? secureRaw === "true" : port === 465,
    user: String(process.env.SMTP_USER || "").trim(),
    pass: process.env.SMTP_PASSWORD || "",
    from: String(process.env.EMAIL_FROM || "").trim(),
  };
}

// True when the minimum settings are present.
function isConfigured() {
  const s = readSettings();
  return Boolean(s.host && s.from);
}

function getTransporter() {
  const s = readSettings();
  const key = [s.host, s.port, s.secure, s.user].join("|");
  if (transporter && transporterKey === key) return transporter;

  transporter = nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.secure,
    // Login only when a user name is set (some relays use IP allow-lists).
    auth: s.user ? { user: s.user, pass: s.pass } : undefined,
    // Refuse to send over an unencrypted connection on the live site.
    requireTLS: !s.secure && process.env.NODE_ENV === "production",
    connectionTimeout: SEND_TIMEOUT_MS,
    greetingTimeout: SEND_TIMEOUT_MS,
    socketTimeout: SEND_TIMEOUT_MS,
  });
  transporterKey = key;
  return transporter;
}

// Sends one email. Resolves with true when the provider accepted it,
// false when SMTP is not configured. Throws on a sending error (the
// caller decides what to log — never the content).
async function sendEmail({ to, subject, text, html }) {
  if (!isConfigured()) {
    console.warn("[email] SMTP is not configured (SMTP_HOST / EMAIL_FROM in backend/.env) — email not sent.");
    return false;
  }
  const s = readSettings();
  await getTransporter().sendMail({ from: s.from, to, subject, text, html });
  return true;
}

// One-line status for the start-up log (never shows the password).
function describe() {
  const s = readSettings();
  if (!s.host || !s.from) {
    return "Email: OFF — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and EMAIL_FROM in backend/.env to send password reset emails.";
  }
  return `Email: ON — SMTP ${s.host}:${s.port} (${s.secure ? "SSL" : "STARTTLS"})${s.user ? ", login set" : ""}.`;
}

module.exports = { sendEmail, isConfigured, describe };