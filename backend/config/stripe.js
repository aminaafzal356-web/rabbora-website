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

// Live keys are refused unless STRIPE_ALLOW_LIVE=true is set on purpose.
// Until that switch is set, a live key switches online payment OFF, so a
// live key can never take money by accident during testing.
const LIVE_ALLOWED = env("STRIPE_ALLOW_LIVE").toLowerCase() === "true";

// "test" | "live" | null — from the secret key prefix (sk_ or restricted rk_).
// A TEST key in a production configuration is refused: the live site must
// never take orders on test keys. Online payment is then off until the
// production keys are set.
const IS_PRODUCTION = env("NODE_ENV") === "production";

function mode() {
  const key = env("STRIPE_SECRET_KEY");
  if (/^(sk|rk)_test_/.test(key)) return IS_PRODUCTION ? null : "test";
  if (/^(sk|rk)_live_/.test(key)) return LIVE_ALLOWED ? "live" : null;
  return null;
}

// True when a live key is present but refused (no STRIPE_ALLOW_LIVE=true).
function testInProduction() {
  return /^(sk|rk)_test_/.test(env("STRIPE_SECRET_KEY")) && IS_PRODUCTION;
}

function liveRefused() {
  return /^(sk|rk)_live_/.test(env("STRIPE_SECRET_KEY")) && !LIVE_ALLOWED;
}

// Online payment is ON only when the secret key AND the matching publishable
// key are both present for the same mode. A mismatch switches it OFF, so an
// order is never saved as "awaiting payment" when the page cannot take a card.
function isConfigured() {
  return mode() !== null && publishableKey() !== null;
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
  if (!m && testInProduction()) {
    return {
      line: "Stripe payments: OFF — a TEST secret key is set in a PRODUCTION configuration (NODE_ENV=production). Set the live keys in the hosting panel, or remove the test keys.",
      warnings: [],
    };
  }
  if (!m && liveRefused()) {
    return {
      line: "Stripe payments: OFF — a LIVE secret key is set but STRIPE_ALLOW_LIVE is not true. Live payments are refused until you set STRIPE_ALLOW_LIVE=true on purpose.",
      warnings: [],
    };
  }
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
  if (!publishableKey()) {
    return {
      line: `Stripe payments: OFF — STRIPE_PUBLISHABLE_KEY must be a pk_${m}_… key that matches STRIPE_SECRET_KEY (${m} mode).`,
      warnings,
    };
  }
  if (!webhookSecret()) warnings.push("STRIPE_WEBHOOK_SECRET is missing or not a whsec_… value — Stripe webhooks will be refused, so orders only become paid when the customer returns to the shop.");
  return { line: `Stripe payments: ON — ${m.toUpperCase()} mode`, warnings };
}

module.exports = { getStripe, isConfigured, mode, webhookSecret, publishableKey, describe, liveRefused, testInProduction };