// Rabbora Living — category requests.

const categoryService = require("../services/categoryService");
const productService = require("../services/productService");
const { check, parseId, SLUG_PATTERN } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

// GET /api/categories
async function list(req, res) {
  const categories = await categoryService.listCategories();
  res.status(200).json({ success: true, count: categories.length, categories });
}

// GET /api/categories/:slug  — the category and its active products
// GET /api/categories/:id    — the same, when the value is a whole number
// (no category slug is only digits, so the two never clash — the same
// rule as GET /api/products/:idOrSlug).
async function getBySlug(req, res) {
  const id = parseId(req.params.slug);
  if (id) {
    const category = await categoryService.getCategoryById(id);
    const products = await productService.listProducts({ category: category.slug });
    return res.status(200).json({ success: true, category, products });
  }
  const slug = typeof req.params.slug === "string" ? req.params.slug.trim().toLowerCase() : "";
  if (!SLUG_PATTERN.test(slug) || slug.length > 100) throw notFound("Category not found.");
  const category = await categoryService.getCategoryBySlug(slug);
  const products = await productService.listProducts({ category: slug });
  res.status(200).json({ success: true, category, products });
}

function read(body, required) {
  return check(body)
    .text("name", { required, max: 100 })
    .slug("slug", { required, max: 100 })
    .text("description", { max: 5000 })
    .bool("isActive")
    .int("sortOrder", { min: 0, max: 100000 })
    .done();
}

// POST /api/categories (admin)
async function create(req, res) {
  res.status(201).json({ success: true, category: await categoryService.createCategory(read(req.body, true)) });
}

// PATCH /api/categories/:id (admin)
async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Category not found.");
  const data = read(req.body, false);
  // name and slug can be left out of a PATCH, but not sent empty.
  const empty = ["name", "slug"].filter((f) => data[f] === null).map((field) => ({ field, message: `${field} cannot be empty.` }));
  if (empty.length) throw validationError(empty);
  res.status(200).json({ success: true, category: await categoryService.updateCategory(id, data) });
}

module.exports = { list, getBySlug, create, update };