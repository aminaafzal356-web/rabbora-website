// Rabbora Living — inventory API (admin only)
//   GET   /api/inventory             stock records (?lowStock=true&productId=…)
//   GET   /api/inventory/:id         one record
//   POST  /api/inventory             start tracking stock for a product or one size
//   PATCH /api/inventory/:id         set stock, adjust stock (+/-), threshold, SKU, active

const express = require("express");
const c = require("../controllers/inventoryController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdmin);

router.get("/", c.list);
router.get("/:id", c.get);
router.post("/", c.create);
router.patch("/:id", c.update);

module.exports = router;