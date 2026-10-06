// Rabbora Living — Stripe client (server side only, official "stripe" SDK).
//
// All credentials come ONLY from environment variables (backend/.env):
//   STRIPE_SECRET_KEY        sk_test_… (test mode) or sk_live_… (live mode)
//   STRIPE_PUBLISHABLE_KEY   pk_test_… / pk_live_… — the only value that may
//                            reach the browser (GET /api/payments/stripe/config)
//   STRIPE_WEBHOOK_SECRET    whsec_… of the webhook endpoint
//                            (Stripe Dashboard → Developers → Webhooks, or `stripe listen`)
// Test -> live is ONLY a change of these values and a restart — no code change.
// The secret key and the webhook secret are never sent to the browser and
// never written to a log (only "set / not set" and test/live are logged).

let client = null;

const env = (name) => (process.env[name] || "").trim();

// "test" | "live" | null — from the secret key prefix (sk_ or restricted rk_).
function mode() {
  const key = env("STRIPE_SECRET_KEY");
  if (/^(sk|rk)_test_/.test(key)) return "test";
  if (/^(sk|rk)_live_/.test(key)) return "live";
  return null;
}

function isConfigured() {
  return mode() !== null;
}

function webhookSecret() {
  const secret = env("STRIPE_WEBHOOK_SECRET");
  return /^whsec_/.test(secret) ? secret : "";
}

// Safe for the browser. Only returned when it belongs to the same mode
// as the secret key (pk_test_ with sk_test_, pk_live_ with sk_live_).
function publishableKey() {
  const key = env("STRIPE_PUBLISHABLE_KEY");
  const m = mode();
  return m && key.startsWith(`pk_${m}_`) ? key : null;
}

function getStripe() {
  if (!isConfigured()) return null;
  if (!client) {
    // Required here (not at the top) so the backend still starts without
    // the package or the keys; online payment is then simply off.
    const Stripe = require("stripe");
    client = new Stripe(env("STRIPE_SECRET_KEY"), {
      maxNetworkRetries: 2, // safe: the SDK sends an idempotency key with retries
      timeout: 20000,
      appInfo: { name: "Rabbora Living" },
    });
  }
  return client;
}

// One startup line + warnings. Never prints a key.
function describe() {
  const m = mode();
  if (!m) {
    return {
      line: env("STRIPE_SECRET_KEY")
        ? "Stripe payments: OFF — STRIPE_SECRET_KEY does not look like a Stripe secret key (sk_test_… / sk_live_…)."
        : "Stripe payments: OFF (no STRIPE_SECRET_KEY in backend/.env) — orders are placed without online payment.",
      warnings: [],
    };
  }
  const warnings = [];
  const pk = env("STRIPE_PUBLISHABLE_KEY");
  if (pk && !pk.startsWith(`pk_${m}_`)) warnings.push(`STRIPE_PUBLISHABLE_KEY is not a ${m} key (pk_${m}_…) — it is not sent to the browser.`);
  if (!webhookSecret()) warnings.push("STRIPE_WEBHOOK_SECRET is missing or not a whsec_… value — Stripe webhooks will be refused, so orders only become paid when the customer returns to the shop.");
  return { line: `Stripe payments: ON — ${m.toUpperCase()} mode`, warnings };
}

module.exports = { getStripe, isConfigured, mode, webhookSecret, publishableKey, describe };