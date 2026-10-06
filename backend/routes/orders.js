// Rabbora Living — orders API (logged in). No payment yet.
//   POST  /api/orders              place an order from my basket (cart is emptied)
//   GET   /api/orders              my orders (admins: ?all=true&status=…)
//   GET   /api/orders/:id          one order with its lines (own, or admin)
//   POST  /api/orders/:id/cancel   cancel my order while it is pending and unpaid
//   PATCH /api/orders/:id          admin: change status / payment status

const express = require("express");
const c = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, c.create);
router.get("/", requireAuth, c.list);
router.get("/:id", requireAuth, c.get);
router.post("/:id/cancel", requireAuth, c.cancel);
router.patch("/:id", requireAdmin, c.adminUpdate);

module.exports = router;