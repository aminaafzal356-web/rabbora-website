// Rabbora Living — welcome email for a new customer account.
// ---------------------------------------------------------------
// Sent once, right after a successful registration (routes/auth.js).
// The customer already chose their password at sign-up, so the email
// contains NO password, NO reset token and NO permanent link: only the
// account page address. It is sent through the same Nodemailer service and
// production SMTP settings as password reset (services/emailService.js).
//
// Sending never affects registration: the account is created first, the
// email is sent afterwards, and any failure is logged without the address,
// the name or the content.
//
// Every image and link is an absolute HTTPS address built from SITE_URL,
// so the logo and buttons work in Gmail, Outlook and phone mail apps.

const { sendEmail } = require("./emailService");

// Brand colours (match style.css :root).
const C = {
  forest: "#1b3a2f",
  forestDark: "#12281f",
  ivory: "#f1ebde",
  ivorySoft: "#f8f4eb",
  brass: "#a47b4c",
  ink: "#232320",
  muted: "#6b6b61",
  line: "#e6dfcf",
};

const SUPPORT_EMAIL = "info@rabbora.co.uk";
const SUPPORT_PHONE_DISPLAY = "+44 7853 444640";
const SUPPORT_PHONE_LINK = "+447853444640";

// The site address comes from SITE_URL (never from the request), like the
// password-reset link. Local development falls back to Live Server.
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

// The account page (login and My Account). Same page the site already uses.
function accountUrlFor(base) {
  return `${base}/account.html`;
}

function buildWelcomeEmail(firstName, base, email = "") {
  const accountUrl = accountUrlFor(base);
  const logoUrl = `${base}/images/email-logo.png`;
  const websiteText = base.replace(/^https?:\/\//, "");
  const name = String(firstName || "").trim();
  const greeting = name ? `Hello ${name},` : "Hello,";
  const registeredEmail = String(email || "").trim();

  const safeGreeting = escapeHtml(greeting);
  const safeAccount = escapeHtml(accountUrl);
  const safeLogo = escapeHtml(logoUrl);
  const safeBase = escapeHtml(base);
  const safeWebsite = escapeHtml(websiteText);
  const safeEmail = escapeHtml(registeredEmail);

  const accountLine = registeredEmail
    ? `Your account has been created. You can sign in with the email address <strong style="color:${C.ink};">${safeEmail}</strong> and the password you chose when you signed up.`
    : "Your account has been created. You can sign in with the email address you registered and the password you chose when you signed up.";

  const text =
    "Welcome to Rabbora Living!\n\n" +
    `${greeting}\n\n` +
    "Your account has been created" +
    (registeredEmail ? ` and is registered to ${registeredEmail}` : "") +
    ". You can sign in with that email address and the password you chose when you signed up.\n\n" +
    "VISIT MY ACCOUNT:\n" +
    `${accountUrl}\n\n` +
    "From your account you can view your orders, saved addresses and wishlist.\n\n" +
    "Thank you for choosing Rabbora Living. We are glad to have you with us.\n\n" +
    "For your security we never email passwords. If you forget yours, use the 'Forgot password?' link on the login page.\n\n" +
    `Visit our website: ${base}\n\n` +
    "Need help? Contact us:\n" +
    `Email: ${SUPPORT_EMAIL}\n` +
    `Phone: ${SUPPORT_PHONE_DISPLAY}\n\n` +
    "Rabbora Living · Handmade in Britain, with a 24-month warranty.";

  const html = `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>Welcome to Rabbora Living</title>
</head>
<body style="margin:0;padding:0;background:${C.ivory};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your Rabbora Living account has been created. Visit your account to get started.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ivory}" style="background:${C.ivory};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">

          <tr>
            <td align="center" bgcolor="${C.ivorySoft}" style="background:${C.ivorySoft};padding:28px 24px 20px;border-bottom:1px solid ${C.line};">
              <a href="${safeBase}" style="text-decoration:none;">
                <img src="${safeLogo}" width="160" alt="Rabbora Living" style="display:block;width:160px;max-width:60%;height:auto;border:0;outline:none;text-decoration:none;" />
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" bgcolor="${C.forest}" style="background:${C.forest};padding:34px 24px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.25;color:${C.ivory};">Welcome to Rabbora Living!</h1>
              <p style="margin:12px 0 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${C.brass};">Handmade in Britain</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 28px 8px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${C.ink};">${safeGreeting}</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.ink};">${accountLine}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${C.ink};">From your account you can view your orders, saved addresses and wishlist.</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:0 28px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${C.forest}" style="background:${C.forest};border-radius:999px;">
                    <a href="${safeAccount}" style="display:inline-block;padding:15px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;letter-spacing:0.06em;color:#ffffff;text-decoration:none;border-radius:999px;">VISIT MY ACCOUNT</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 24px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${C.ink};">Thank you for choosing Rabbora Living. We are glad to have you with us.</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};">For your security we never email passwords. If you forget yours, use the &lsquo;Forgot password?&rsquo; link on the login page.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ivorySoft}" style="background:${C.ivorySoft};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;font-size:14px;line-height:1.7;color:${C.ink};">
                    <strong style="color:${C.forestDark};">Need help?</strong><br />
                    Email: <a href="mailto:${SUPPORT_EMAIL}" style="color:${C.forest};">${SUPPORT_EMAIL}</a><br />
                    Phone: <a href="tel:${SUPPORT_PHONE_LINK}" style="color:${C.forest};">${SUPPORT_PHONE_DISPLAY}</a><br />
                    Website: <a href="${safeBase}" style="color:${C.forest};">${safeWebsite}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:18px 24px 24px;border-top:1px solid ${C.line};font-size:12px;line-height:1.6;color:${C.muted};">
              Rabbora Living &middot; Handmade in Britain, with a 24-month warranty<br />
              <a href="${safeBase}" style="color:${C.muted};">${safeWebsite}</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: "Welcome to Rabbora Living", text, html };
}

// Sends the welcome email for one new account. Never throws: returns
// { sent: true } or { sent: false, reason } and logs a safe diagnostic.
async function sendWelcomeEmail(user) {
  if (!user || !user.email) return { sent: false, reason: "no-recipient" };
  const base = siteUrl();
  if (!base) {
    console.error("[welcome-email] SITE_URL is not set in the hosting environment — welcome email not sent.");
    return { sent: false, reason: "no-site-url" };
  }
  const message = buildWelcomeEmail(user.firstName, base, user.email);
  try {
    const accepted = await sendEmail({ to: user.email, ...message });
    if (accepted) {
      console.log(`[welcome-email] Welcome email accepted by the mail server (user id ${user.id}).`);
      return { sent: true };
    }
    console.error(`[welcome-email] Welcome email NOT sent: SMTP is not configured (user id ${user.id}).`);
    return { sent: false, reason: "not-configured" };
  } catch (err) {
    // Provider or configuration error: code and status only (never the address or content).
    console.error(`[welcome-email] Could not send welcome email (user id ${user.id}):`, err.code || "", err.responseCode || "", err.message);
    return { sent: false, reason: err.code || "send-error" };
  }
}

module.exports = { sendWelcomeEmail, buildWelcomeEmail, accountUrlFor };