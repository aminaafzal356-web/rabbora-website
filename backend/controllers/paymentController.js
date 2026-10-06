// Rabbora Living — payment requests (Stripe Checkout).

const paymentService = require("../services/paymentService");
const stripeConfig = require("../config/stripe");
const { check, parseId } = require("../utils/validate");
const { AppError, notFound, validationError } = require("../utils/AppError");

// Where Stripe sends the customer back: OUR site only. The origin must be
// one of the allowed website addresses (same list as CORS); the path must
// be a checkout.html page (e.g. "/checkout.html" or "/shop/checkout.html").
const RETURN_PATH = /^\/(?:[A-Za-z0-9._~-]+\/)*checkout\.html$/;

function returnBase(req, returnPath) {
  const allowed = req.app.get("allowedOrigins") || [];
  // No Origin header (e.g. a tool): the first FRONTEND_ORIGIN, else http://localhost:5500.
  const origin = req.headers.origin && allowed.includes(req.headers.origin) ? req.headers.origin : allowed[2] || allowed[0];
  if (!origin) throw new AppError(400, "INVALID_RETURN", "The shop address is not configured.");
  const path = returnPath || "/checkout.html";
  if (!RETURN_PATH.test(path) || path.includes("..")) {
    throw validationError([{ field: "returnPath", message: "returnPath must be the path of checkout.html on this site." }]);
  }
  return origin + path;
}

module.exports = {
  // GET /api/payments/stripe/config — is online payment switched on?
  // Only safe values: never the secret key or the webhook secret.
  config: (req, res) => {
    res.status(200).json({
      success: true,
      enabled: stripeConfig.isConfigured(),
      mode: stripeConfig.mode(), // "test" | "live" | null
      publishableKey: stripeConfig.publishableKey(), // pk_… only, or null
    });
  },

  // POST /api/payments/stripe/checkout-session  { orderId, returnPath? }
  createSession: async (req, res) => {
    const d = check(req.body).id("orderId", { required: true }).text("returnPath", { max: 300 }).done();
    const result = await paymentService.createCheckoutSession(req.user, d.orderId, returnBase(req, d.returnPath));
    res.status(201).json({ success: true, ...result });
  },

  // GET /api/payments/stripe/orders/:id/status
  // (a session_id in the address is ignored: the backend only checks the
  // session it saved on the order itself)
  status: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Order not found.");
    res.status(200).json({ success: true, ...(await paymentService.paymentStatus(req.user, id)) });
  },

  // POST /api/payments/stripe/webhook  (raw body, Stripe-Signature header)
  webhook: async (req, res) => {
    const event = paymentService.verifyWebhook(req.body, req.headers["stripe-signature"]);
    // A database error is thrown on -> 500, so Stripe tries again later.
    const outcome = await paymentService.handleEvent(event);
    res.status(200).json({ received: true, result: outcome.result });
  },
};