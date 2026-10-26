// Rabbora Living — review requests.

const reviewService = require("../services/reviewService");
const wishlistService = require("../services/wishlistService");
const { check, parseId, pagination, SLUG_PATTERN } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

const SORTS = ["newest", "oldest", "highest", "lowest"];

const readReview = (body, required) => check(body)
  .int("rating", { required, min: 1, max: 5 })
  .text("title", { max: 150 })
  .text("body", { required, min: 10, max: 2000 })
  .done();

// Optional query value. Absent (undefined / empty) means "no filter".
// Present but invalid is a 400 VALIDATION_ERROR, so the caller learns why.
const isAbsent = (v) => v === undefined || v === "";
const SAFE_INT = /^[0-9]{1,15}$/;

function readOptionalInt(value, field, min, max, errors) {
  if (isAbsent(value)) return null;
  const text = String(value);
  const n = SAFE_INT.test(text) ? Number(text) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) {
    errors.push({ field, message: `${field} must be a whole number from ${min} to ${max}.` });
    return null;
  }
  return n;
}

module.exports = {
  // GET /api/reviews/all?page=&limit=&rating=&productId=&sort=&category=
  // Public Reviews page: approved reviews of active products.
  listAll: async (req, res) => {
    const q = req.query;
    const errors = [];
    const rating = readOptionalInt(q.rating, "rating", 1, 5, errors);
    const productId = readOptionalInt(q.productId, "productId", 1, 2147483647, errors);

    let category = null;
    if (!isAbsent(q.category)) {
      if (typeof q.category === "string" && SLUG_PATTERN.test(q.category)) category = q.category;
      else errors.push({ field: "category", message: "category must be a lowercase slug, e.g. sofas." });
    }

    let sort = "newest";
    if (!isAbsent(q.sort)) {
      if (typeof q.sort === "string" && SORTS.includes(q.sort)) sort = q.sort;
      else errors.push({ field: "sort", message: `sort must be one of: ${SORTS.join(", ")}.` });
    }

    if (errors.length) throw validationError(errors);

    const { limit, offset, page } = pagination(q, 12, 50);
    const data = await reviewService.listAllApproved({ limit, offset, rating, productId, categorySlug: category, sort });
    res.status(200).json({ success: true, page, limit, sort, ...data });
  },

  // GET /api/reviews?productId=12  or  ?product=<slug>   (product page widget)
  list: async (req, res) => {
    const q = req.query;
    const productId = parseId(String(q.productId || ""));
    const slug = typeof q.product === "string" && SLUG_PATTERN.test(q.product) ? q.product : null;
    if (!productId && !slug) throw validationError([{ field: "productId", message: "productId or product (slug) is required." }]);
    const id = await wishlistService.resolveProduct({ productId, productSlug: slug });
    const { limit, offset, page } = pagination(q, 10, 50);
    res.status(200).json({ success: true, productId: id, page, limit, ...(await reviewService.listApproved(id, { limit, offset })) });
  },

  // POST /api/reviews   { productId | productSlug, rating, title, body }
  create: async (req, res) => {
    const ref = check(req.body).id("productId").slug("productSlug").done();
    if (!ref.productId && !ref.productSlug) throw validationError([{ field: "productId", message: "productId or productSlug is required." }]);
    const productId = await wishlistService.resolveProduct(ref);
    const review = await reviewService.createReview(req.user.id, productId, readReview(req.body, true));
    res.status(201).json({ success: true, review, message: "Thank you! Your review will appear on the site once our team has approved it." });
  },

  // PATCH /api/reviews/:id   (own review)
  update: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Review not found.");
    res.status(200).json({ success: true, review: await reviewService.updateReview(req.user, id, readReview(req.body, false)) });
  },

  // DELETE /api/reviews/:id  (own review, or admin)
  remove: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Review not found.");
    await reviewService.deleteReview(req.user, id);
    res.status(200).json({ success: true, message: "Review deleted." });
  },

  // GET /api/reviews/pending  (admin)
  pending: async (req, res) => {
    const { limit, offset, page } = pagination(req.query);
    res.status(200).json({ success: true, page, limit, ...(await reviewService.listPending({ limit, offset })) });
  },

  // PATCH /api/reviews/:id/approval  { approved: true|false }  (admin)
  approve: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Review not found.");
    const d = check(req.body).bool("approved", { required: true }).done();
    res.status(200).json({ success: true, review: await reviewService.setApproval(id, d.approved) });
  },
};