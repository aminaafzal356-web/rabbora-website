// Rabbora Living — newsletter subscription (homepage form and email links)
//   POST /api/newsletter/subscribe    { email }
//   POST /api/newsletter/confirm      { token }      (confirmation link)
//   POST /api/newsletter/unsubscribe  { token }      (unsubscribe link)
// Rate limits per visitor IP: 10 sign-ups per 15 minutes; 30 link uses per 15 minutes.
// Admins manage subscribers at /api/admin/newsletter-subscribers (routes/admin.js).

const express = require("express");
const c = require("../controllers/newsletterController");
const { RateLimiter, limitByIp } = require("../middleware/rateLimit");

const router = express.Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const limiters = {
  subscribe: new RateLimiter({ limit: 10, windowMs: FIFTEEN_MINUTES }),
  links: new RateLimiter({ limit: 30, windowMs: FIFTEEN_MINUTES }),
};
const TOO_MANY = "Too many requests. Please wait a few minutes and try again.";

router.post("/subscribe", limitByIp(limiters.subscribe, TOO_MANY), c.subscribe);
router.post("/confirm", limitByIp(limiters.links, TOO_MANY), c.confirm);
router.post("/unsubscribe", limitByIp(limiters.links, TOO_MANY), c.unsubscribe);

router.limiters = limiters; // used by the automated tests only

module.exports = router;