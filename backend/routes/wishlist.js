
// Rabbora Living — wishlist API (logged-in customers only)
//   GET    /api/wishlist               my saved products
//   POST   /api/wishlist               save a product { productId } or { productSlug }
//                                     (saving it again does not create a duplicate)
//   DELETE /api/wishlist/:productId    remove one product
//   DELETE /api/wishlist               remove everything

const express = require("express");
const c = require("../controllers/wishlistController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", c.list);
router.post("/", c.add);
router.delete("/:productId", c.remove);
router.delete("/", c.clear);

module.exports = router;