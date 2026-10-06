// Rabbora Living — products API
// Shop (public):
//   GET   /api/products                    all active products (optional filters)
//   GET   /api/products/slug/:slug         one product (full details)
//   GET   /api/products/:id/pricing        sale/original price, % off, savings, monthly per size
//   GET   /api/products/:idOrSlug          one product by id (number) or slug — the
//                                          product pages already call /api/products/<slug>
// Admin only:
//   POST  /api/products                    create a product (with images and sizes)
//   PATCH /api/products/:id                change product fields
//   POST  /api/products/:id/variants       add a size/width with its prices
//   PATCH /api/products/:id/variants/:variantId   change a size's prices/label/status
//   PUT   /api/products/:id/fabrics        set which fabrics the product offers
//   PUT   /api/products/:id/storage-options  set which storage options it offers
//   POST  /api/products/:id/images       add an image path (added last)
//   PATCH /api/products/:id/images/:imageId   change path / alt text, or make it primary
//   DELETE /api/products/:id/images/:imageId  remove the image from this product
//                                          (the file is not touched; never the last image)
//   PUT   /api/products/:id/images/order  new order { imageIds: [...] }
//
// Every query uses $1 parameters. The existing response fields stay the
// same, so the product pages keep working; new fields are only added.

const express = require("express");
const controller = require("../controllers/productController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", controller.list);
router.get("/slug/:slug", controller.getBySlug);
router.get("/:id/pricing", controller.getPricing);
router.get("/:idOrSlug", controller.getByIdOrSlug);

router.post("/", requireAdmin, controller.create);
router.patch("/:id", requireAdmin, controller.update);
router.post("/:id/variants", requireAdmin, controller.addVariant);
router.patch("/:id/variants/:variantId", requireAdmin, controller.updateVariant);
router.put("/:id/fabrics", requireAdmin, controller.setFabrics);
router.put("/:id/storage-options", requireAdmin, controller.setStorageOptions);
router.post("/:id/images", requireAdmin, controller.addImage);
router.put("/:id/images/order", requireAdmin, controller.reorderImages);
router.patch("/:id/images/:imageId", requireAdmin, controller.updateImage);
router.delete("/:id/images/:imageId", requireAdmin, controller.removeImage);

module.exports = router;