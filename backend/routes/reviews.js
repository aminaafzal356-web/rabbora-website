// Rabbora Living — reviews API
//   GET    /api/reviews?productId=… | ?product=<slug>   published reviews of a product
//   POST   /api/reviews                 logged in: write a review (one per product, published at once)
//   PATCH  /api/reviews/:id             logged in: edit own review (visibility unchanged)
//   DELETE /api/reviews/:id             logged in: delete own review (admins: any)
//   GET    /api/reviews/pending         admin: hidden reviews (not shown in the shop)
//   PATCH  /api/reviews/:id/approval    admin: show or hide a review

const express = require("express");
const c = require("../controllers/reviewController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/pending", requireAdmin, c.pending);
router.get("/", c.list);
router.post("/", requireAuth, c.create);
router.patch("/:id/approval", requireAdmin, c.approve);
router.patch("/:id", requireAuth, c.update);
router.delete("/:id", requireAuth, c.remove);

module.exports = router;