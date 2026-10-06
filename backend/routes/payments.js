// Rabbora Living — payments API (Stripe Checkout, server side)
//   GET  /api/payments/stripe/config               is online payment on? (+ test/live, publishable key)
//   POST /api/payments/stripe/checkout-session     logged in: pay one of MY unpaid orders
//                                                  { orderId, returnPath? } -> { url } (redirect to Stripe)
//   GET  /api/payments/stripe/orders/:id/status    logged in: my order + payment status
//                                                  (the backend checks the order's own saved session with Stripe)
//   POST /api/payments/stripe/webhook              Stripe only — mounted in server.js BEFORE express.json(),
//                                                  because the signature check needs the raw body.
// The amount is always taken from the order in PostgreSQL. Orders become
// "paid" only from Stripe data (signed webhook, or session fetched by the
// backend). There is no way to mark an order paid from the browser.

const express = require("express");
const c = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/stripe/config", c.config);
router.post("/stripe/checkout-session", requireAuth, c.createSession);
router.get("/stripe/orders/:id/status", requireAuth, c.status);

module.exports = { router, webhook: c.webhook };