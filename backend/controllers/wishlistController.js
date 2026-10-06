// Rabbora Living — wishlist requests.

const wishlistService = require("../services/wishlistService");
const { check, parseId } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

module.exports = {
  // GET /api/wishlist
  list: async (req, res) => {
    const items = await wishlistService.listWishlist(req.user.id);
    res.status(200).json({ success: true, count: items.length, items });
  },
  // POST /api/wishlist   { productId } or { productSlug }
  add: async (req, res) => {
    const d = check(req.body).id("productId").slug("productSlug").done();
    if (!d.productId && !d.productSlug) throw validationError([{ field: "productId", message: "productId or productSlug is required." }]);
    const result = await wishlistService.addToWishlist(req.user.id, d);
    res.status(result.added ? 201 : 200).json({
      success: true,
      productId: result.productId,
      added: result.added,
      message: result.added ? "Added to your wishlist." : "Already in your wishlist.",
    });
  },
  // DELETE /api/wishlist/:productId
  remove: async (req, res) => {
    const productId = parseId(req.params.productId);
    if (!productId) throw notFound("This product is not in your wishlist.");
    await wishlistService.removeFromWishlist(req.user.id, productId);
    res.status(200).json({ success: true, message: "Removed from your wishlist." });
  },
  // DELETE /api/wishlist
  clear: async (req, res) => {
    const removed = await wishlistService.clearWishlist(req.user.id);
    res.status(200).json({ success: true, removed });
  },
};