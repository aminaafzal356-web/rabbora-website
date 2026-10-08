// Rabbora Living — website forms (no login needed)
//   POST /api/fabric-samples   Fabric Samples form (fabric-samples.html)
//        { name, email, phone, postcode, address, selectedFabrics: [..1-4], notes?, marketingConsent? }
//   POST /api/contact          Contact form (contact.html)
//        { name, email, phone?, subject, message }
// 201 = saved (200 = the same submission was already saved a moment ago).
// 400 VALIDATION_ERROR with errors: [{ field, message }].
// Rate limit: 10 submissions per form per 15 minutes from one visitor IP.
// Admins read them through /api/admin/... (routes/admin.js).

const express = require("express");
const c = require("../controllers/enquiryController");
const { RateLimiter, limitByIp } = require("../middleware/rateLimit");

const router = express.Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const limiters = {
  fabricSamples: new RateLimiter({ limit: 10, windowMs: FIFTEEN_MINUTES }),
  contact: new RateLimiter({ limit: 10, windowMs: FIFTEEN_MINUTES }),
};
const TOO_MANY = "Too many submissions. Please wait a few minutes and try again.";

router.post("/fabric-samples", limitByIp(limiters.fabricSamples, TOO_MANY), c.createFabricSampleRequest);
router.post("/contact", limitByIp(limiters.contact, TOO_MANY), c.createContactMessage);

router.limiters = limiters; // used by the automated tests only

module.exports = router;