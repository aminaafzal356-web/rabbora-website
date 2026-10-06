// Rabbora Living — users API
// Logged-in customer:
//   GET    /api/users/me                    my profile (never the password hash)
//   PATCH  /api/users/me                    change first name / last name / phone
//   GET    /api/users/me/addresses          my saved addresses
//   POST   /api/users/me/addresses          add an address
//   PATCH  /api/users/me/addresses/:id      change an address (or make it default)
//   DELETE /api/users/me/addresses/:id      delete an address
// Admin only:
//   GET    /api/users                       list accounts (?page=&limit=&search=)
//   GET    /api/users/:id                   one account
//   PATCH  /api/users/:id                   change role (customer/admin) or active status

const express = require("express");
const c = require("../controllers/userController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, c.me);
router.patch("/me", requireAuth, c.updateMe);
router.get("/me/addresses", requireAuth, c.listAddresses);
router.post("/me/addresses", requireAuth, c.createAddress);
router.patch("/me/addresses/:id", requireAuth, c.updateAddress);
router.delete("/me/addresses/:id", requireAuth, c.deleteAddress);

router.get("/", requireAdmin, c.list);
router.get("/:id", requireAdmin, c.get);
router.patch("/:id", requireAdmin, c.adminUpdate);

module.exports = router;