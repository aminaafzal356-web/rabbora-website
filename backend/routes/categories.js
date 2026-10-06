// Rabbora Living — categories API
//   GET   /api/categories          active categories (with product counts)
//   GET   /api/categories/:slug    one category + its active products
//   GET   /api/categories/:id      the same, by numeric id (e.g. /api/categories/1)
//   POST  /api/categories          admin: create
//   PATCH /api/categories/:id      admin: change name/slug/description/status/order

const express = require("express");
const controller = require("../controllers/categoryController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", controller.list);
router.get("/:slug", controller.getBySlug);
router.post("/", requireAdmin, controller.create);
router.patch("/:id", requireAdmin, controller.update);

module.exports = router;