// Rabbora Living — reviews API
//   GET    /api/reviews/all             public: approved reviews of active products (Reviews page)
//   GET    /api/reviews?productId=… | ?product=<slug>   approved reviews of a product
//   POST   /api/reviews                 logged in: write a review (goes to admin approval)
//   PATCH  /api/reviews/:id             logged in: edit own review (goes back for approval)
//   DELETE /api/reviews/:id             logged in: delete own review (admins: any)
//   GET    /api/reviews/pending         admin: reviews waiting for approval
//   PATCH  /api/reviews/:id/approval    admin: approve or hide a review

const express = require("express");
const c = require("../controllers/reviewController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/all", c.listAll);
router.get("/pending", requireAdmin, c.pending);
router.get("/", c.list);
router.post("/", requireAuth, c.create);
router.patch("/:id/approval", requireAdmin, c.approve);
router.patch("/:id", requireAuth, c.update);
router.delete("/:id", requireAuth, c.remove);

module.exports = router;
