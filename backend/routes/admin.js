// Rabbora Living — admin panel API (admins only)
//   GET /api/admin/stats             dashboard figures (counts from the database)
//   GET /api/admin/products          all products incl. inactive (?search=&categoryId=
//                                    &status=active|inactive|all&featured=true
//                                    &bestSeller=true&page=&limit=)
//   GET /api/admin/products/:id      one product incl. inactive, with every size
//                                    and its fabric / storage links
//   GET /api/admin/categories        all categories incl. inactive + product counts (?search=)
//   GET /api/admin/fabrics           all fabrics incl. inactive + product counts (?search=&status=)
//   GET /api/admin/fabrics/:id/products          products that offer this fabric
//   GET /api/admin/storage-options               all storage options + product counts
//   GET /api/admin/storage-options/:id/products  products that offer this option
//   GET /api/admin/inventory         stock records + not-tracked products
//                                    (?search=&filter=all|low|out|tracked|untracked&page=&limit=)
//   GET /api/admin/orders            orders + status counts (?search=&status=&paymentStatus=&page=)
//   GET /api/admin/customers         accounts + order count / total spent (?search=&role=&status=&page=)
//   GET /api/admin/customers/:id     one account: addresses, orders, wishlist / review counts
//   GET /api/admin/reviews           every review + counts (?search=&status=pending|approved&page=)
//   GET /api/admin/reviews/:id       one review
//   GET   /api/admin/fabric-sample-requests       Fabric Samples form requests + status counts
//                                                (?search=&status=new|read|in_progress|completed|cancelled&page=&limit=)
//   GET   /api/admin/fabric-sample-requests/:id   one request
//   PATCH /api/admin/fabric-sample-requests/:id   { status }
//   GET   /api/admin/contact-messages             Contact form messages + status counts (same filters)
//   GET   /api/admin/contact-messages/:id         one message
//   PATCH /api/admin/contact-messages/:id         { status }
//
// Changes use the existing admin endpoints:
//   POST  /api/products, PATCH /api/products/:id,
//   POST  /api/products/:id/variants, PATCH /api/products/:id/variants/:variantId
//   POST  /api/categories, PATCH /api/categories/:id
//   POST  /api/fabrics, PATCH /api/fabrics/:id
//   POST  /api/storage-options, PATCH /api/storage-options/:id
//   PUT   /api/products/:id/fabrics, PUT /api/products/:id/storage-options
//   POST/PATCH/DELETE /api/products/:id/images[/:imageId], PUT /api/products/:id/images/order
//   POST  /api/inventory, PATCH /api/inventory/:id
//   GET   /api/orders/:id (order detail), PATCH /api/orders/:id { status }
//   PATCH /api/users/:id { isActive }
//   PATCH /api/reviews/:id/approval { approved }
//
// router.use(requireAdmin): logged out -> 401, customer -> 403.

const express = require("express");
const c = require("../controllers/adminController");
const enquiries = require("../controllers/enquiryController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdmin);

router.get("/stats", c.stats);
router.get("/products", c.listProducts);
router.get("/products/:id", c.getProduct);
router.get("/categories", c.listCategories);
router.get("/fabrics", c.listFabrics);
router.get("/fabrics/:id/products", c.fabricProducts);
router.get("/storage-options", c.listStorageOptions);
router.get("/storage-options/:id/products", c.storageProducts);
router.get("/inventory", c.listInventory);
router.get("/orders", c.listOrders);
router.get("/customers", c.listCustomers);
router.get("/customers/:id", c.getCustomer);
router.get("/reviews", c.listReviews);
router.get("/reviews/:id", c.getReview);

// Website forms (database/enquiries.sql)
router.get("/fabric-sample-requests", enquiries.adminListFabricSampleRequests);
router.get("/fabric-sample-requests/:id", enquiries.adminGetFabricSampleRequest);
router.patch("/fabric-sample-requests/:id", enquiries.adminUpdateFabricSampleRequest);
router.get("/contact-messages", enquiries.adminListContactMessages);
router.get("/contact-messages/:id", enquiries.adminGetContactMessage);
router.patch("/contact-messages/:id", enquiries.adminUpdateContactMessage);

module.exports = router;