// Rabbora Living — newsletter confirmation email (double opt-in).
// ---------------------------------------------------------------
// Sent to the address that asked to subscribe. The customer is not
// subscribed until they click the confirmation link. The email also gives
// the unsubscribe link, which every later marketing email must include.
// Sent through the same SMTP service as password reset and welcome email
// (services/emailService.js). Tokens travel after "#", so they are not sent
// to the web server (not in server logs).
//
// Never throws: returns { sent, reason } and logs without the address.

const { sendEmail } = require("./emailService");

const C = {
  forest: "#1b3a2f",
  ivory: "#f1ebde",
  ivorySoft: "#f8f4eb",
  ink: "#232320",
  muted: "#6b6b61",
  line: "#e6dfcf",
};

function siteUrl() {
  const fromEnv = String(process.env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  return "http://localhost:5500";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function confirmUrlFor(base, token) {
  return `${base}/newsletter.html#confirm=${token}`;
}

function unsubscribeUrlFor(base, token) {
  return `${base}/newsletter.html#unsubscribe=${token}`;
}

function buildConfirmationEmail(base, confirmToken, unsubscribeToken) {
  const confirmUrl = confirmUrlFor(base, confirmToken);
  const unsubscribeUrl = unsubscribeUrlFor(base, unsubscribeToken);
  const safeConfirm = escapeHtml(confirmUrl);
  const safeUnsubscribe = escapeHtml(unsubscribeUrl);
  const safeBase = escapeHtml(base);

  const text =
    "Please confirm your subscription to Rabbora Living\n\n" +
    "Thank you for signing up for new collections, bedroom inspiration and special offers.\n\n" +
    "Confirm your subscription here (the link works once and expires in 7 days):\n" +
    `${confirmUrl}\n\n` +
    "If you did not ask to subscribe, you can ignore this email and you will not receive anything else from us.\n\n" +
    "You can unsubscribe at any time:\n" +
    `${unsubscribeUrl}\n\n` +
    `Rabbora Living · ${base}`;

  const html = `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:${C.ivory};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ivory}" style="background:${C.ivory};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="${C.forest}" style="background:${C.forest};padding:28px 24px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.25;color:${C.ivory};">Confirm your subscription</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 28px 8px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Thank you for signing up for new collections, bedroom inspiration and special offers from Rabbora Living.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Please confirm your subscription. This link works once and expires in 7 days.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${C.forest}" style="background:${C.forest};border-radius:999px;">
                    <a href="${safeConfirm}" style="display:inline-block;padding:15px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;letter-spacing:0.06em;color:#ffffff;text-decoration:none;border-radius:999px;">CONFIRM SUBSCRIPTION</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:${C.muted};">If you did not ask to subscribe, you can ignore this email. You will not receive anything else from us.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 24px 24px;border-top:1px solid ${C.line};font-size:12px;line-height:1.6;color:${C.muted};">
              Rabbora Living · <a href="${safeBase}" style="color:${C.muted};">${escapeHtml(base.replace(/^https?:\/\//, ""))}</a><br />
              <a href="${safeUnsubscribe}" style="color:${C.muted};">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: "Confirm your Rabbora Living subscription", text, html };
}

// Sends the confirmation email. Never throws.
// Returns { sent: true } or { sent: false, reason }.
async function sendConfirmationEmail({ email, confirmToken, unsubscribeToken }) {
  const base = siteUrl();
  if (!base) {
    console.error("[newsletter] SITE_URL is not set in the hosting environment — confirmation email not sent.");
    return { sent: false, reason: "no-site-url" };
  }
  const message = buildConfirmationEmail(base, confirmToken, unsubscribeToken);
  try {
    const accepted = await sendEmail({ to: email, ...message });
    if (accepted) {
      console.log("[newsletter] Confirmation email accepted by the mail server.");
      return { sent: true };
    }
    console.error("[newsletter] Confirmation email NOT sent: SMTP is not configured.");
    return { sent: false, reason: "not-configured" };
  } catch (err) {
    console.error("[newsletter] Could not send confirmation email:", err.code || "", err.responseCode || "", err.message);
    return { sent: false, reason: err.code || "send-error" };
  }
}

module.exports = { sendConfirmationEmail, buildConfirmationEmail, confirmUrlFor, unsubscribeUrlFor };