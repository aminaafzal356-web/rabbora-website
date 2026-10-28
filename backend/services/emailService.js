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

// Hosts that mean "this server itself". Never valid for the live site:
// a leftover development value (e.g. localhost:1025 from a local mail
// catcher) must not be used in production.
const LOOPBACK_HOST = /^(localhost|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|::1|\[::1\]|0\.0\.0\.0)$/i;

function readSettings() {
  const rawPort = String(process.env.SMTP_PORT || "").trim();
  const port = rawPort ? Number(rawPort) : 587;
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

// In production, returns a secret-free reason why SMTP must not be used,
// or "" when the settings are usable. Outside production returns "".
function productionProblem(s = readSettings()) {
  if (process.env.NODE_ENV !== "production") return "";
  if (!s.host || !s.from) return "SMTP_HOST or EMAIL_FROM is missing.";
  if (LOOPBACK_HOST.test(s.host)) {
    return "SMTP_HOST points to this server (localhost). Set it to the mail provider's host (for Hostinger: smtp.hostinger.com) in the hosting environment.";
  }
  if (!Number.isInteger(s.port) || s.port < 1 || s.port > 65535) return "SMTP_PORT is not a valid port number.";
  if (!s.user || !s.pass) return "SMTP_USER or SMTP_PASSWORD is missing.";
  return "";
}

// Sends one email. Resolves with true when the provider accepted it.
// Resolves with false when SMTP is not configured outside production.
// Throws when the settings are unusable in production (code SMTP_CONFIG,
// nothing is sent) or when the provider refuses the message. The caller
// decides what to log — never the content or the password.
async function sendEmail({ to, subject, text, html }) {
  const problem = productionProblem();
  if (problem) {
    const err = new Error(problem);
    err.code = "SMTP_CONFIG";
    throw err;
  }
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
  if (productionProblem(s)) {
    // Never say "ON" for settings that the production check refuses.
    return "Email: NOT USABLE in production — see the password reset warning below.";
  }
  return `Email: ON — SMTP ${s.host}:${s.port} (${s.secure ? "SSL" : "STARTTLS"})${s.user ? ", login set" : ""}.`;
}

// Start-up warnings for password reset emails. Only fixed text is returned
// (variable names, never values): no password, address or link is printed.
function configWarnings() {
  const s = readSettings();
  const warnings = [];
  const siteUrl = String(process.env.SITE_URL || "").trim();
  const production = process.env.NODE_ENV === "production";

  if (!s.host || !s.from) {
    warnings.push("SMTP_HOST or EMAIL_FROM is missing in backend/.env: password reset emails will NOT be sent.");
  } else if (s.user && !s.pass) {
    warnings.push("SMTP_USER is set but SMTP_PASSWORD is empty: the mail server will probably refuse the login.");
  }
  const smtpProblem = productionProblem(s);
  if (smtpProblem) warnings.push("Production email settings are unusable, so password reset emails will NOT be sent: " + smtpProblem);

  if (!siteUrl) {
    if (production) {
      warnings.push("SITE_URL is not set: password reset emails will NOT be sent. Set it to the live website address (https://rabbora.co.uk).");
    } else {
      warnings.push("SITE_URL is not set: password reset links will point to http://localhost:5500.");
    }
  } else if (production && /localhost|127\.0\.0\.1/i.test(siteUrl)) {
    warnings.push("SITE_URL points to localhost on a production server: password reset links will not work for customers.");
  }
  return warnings;
}

module.exports = { sendEmail, isConfigured, describe, configWarnings, productionProblem };