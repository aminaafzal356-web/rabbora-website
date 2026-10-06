// Rabbora Living — product requests: read the input, validate it, call
// the service, send JSON. All errors go to middleware/errorHandler.js.

const productService = require("../services/productService");
const { check, parseId, pagination, SLUG_PATTERN, isPlainObject } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

const MSG_NOT_FOUND = "Product not found.";

function cleanSlug(value) {
  const slug = typeof value === "string" ? value.trim().toLowerCase() : "";
  return slug && slug.length <= 255 && SLUG_PATTERN.test(slug) ? slug : null;
}

// GET /api/products  (?category=slug&featured=true&bestSeller=true&search=text&page=1&limit=20)
async function list(req, res) {
  const q = req.query;
  const filters = {
    category: typeof q.category === "string" ? cleanSlug(q.category) : null,
    featured: q.featured === "true",
    bestSeller: q.bestSeller === "true",
    search: typeof q.search === "string" && q.search.trim() ? q.search.trim().slice(0, 100) : null,
  };
  if (typeof q.category === "string" && !filters.category) {
    return res.status(200).json({ success: true, count: 0, products: [] });
  }
  if (q.page !== undefined || q.limit !== undefined) Object.assign(filters, pagination(q));

  const products = await productService.listProducts(filters);
  res.status(200).json({ success: true, count: products.length, products });
}

// GET /api/products/slug/:slug
async function getBySlug(req, res) {
  const slug = cleanSlug(req.params.slug);
  if (!slug) throw notFound(MSG_NOT_FOUND);
  const product = await productService.getProductBySlug(slug);
  res.status(200).json({ success: true, product });
}

// GET /api/products/:idOrSlug — a number is an id, anything else a slug
// (the product pages already call /api/products/<slug>).
async function getByIdOrSlug(req, res) {
  const id = parseId(req.params.idOrSlug);
  if (id) {
    const product = await productService.getProductById(id);
    return res.status(200).json({ success: true, product });
  }
  const slug = cleanSlug(req.params.idOrSlug);
  if (!slug) throw notFound(MSG_NOT_FOUND);
  const product = await productService.getProductBySlug(slug);
  return res.status(200).json({ success: true, product });
}

// GET /api/products/:id/pricing
async function getPricing(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  res.status(200).json({ success: true, ...(await productService.getPricing(id)) });
}

// ----- admin -----

function readVariant(body, required) {
  return check(body)
    .oneOf("optionType", ["size", "width"])
    .text("optionValue", { required, max: 50 })
    .text("optionLabel", { required, max: 50 })
    .money("price", { required })
    .money("compareAtPrice", { nullable: true })
    .int("widthCm", { min: 1, max: 1000 })
    .int("lengthCm", { min: 1, max: 1000 })
    .int("sortOrder", { min: 0, max: 32767 })
    .text("sku", { max: 64 })
    .bool("isActive")
    .done();
}

function readProduct(body, required) {
  const data = check(body)
    .text("name", { required, max: 255 })
    .slug("slug", { required })
    .text("description", { max: 10000 })
    .money("price", { required })
    .id("categoryId")
    .text("mainImage", { max: 1000 })
    .text("sku", { max: 64 })
    .bool("isActive")
    .bool("isFeatured")
    .bool("isBestSeller")
    .done();

  if (required) {
    const b = isPlainObject(body) ? body : {};
    if (b.images !== undefined) {
      if (!Array.isArray(b.images) || b.images.length > 50) throw validationError([{ field: "images", message: "images must be a list (max 50)." }]);
      data.images = b.images.map((img) =>
        check(img).text("url", { required: true, max: 1000 }).text("altText", { max: 255 })
          .int("sortOrder", { min: 0 }).bool("isPrimary").done()
      );
      if (data.images.filter((i) => i.isPrimary).length > 1) {
        throw validationError([{ field: "images", message: "Only one image can be the primary image." }]);
      }
    }
    if (b.variants !== undefined) {
      if (!Array.isArray(b.variants) || b.variants.length > 50) throw validationError([{ field: "variants", message: "variants must be a list (max 50)." }]);
      data.variants = b.variants.map((v) => readVariant(v, true));
    }
  }
  return data;
}

// POST /api/products
async function create(req, res) {
  const product = await productService.createProduct(readProduct(req.body, true));
  res.status(201).json({ success: true, product });
}

// A field that must always have a value (name, slug, a size label) can
// be left out of a PATCH, but it cannot be sent empty.
function rejectEmpty(data, fields) {
  const errors = fields
    .filter((field) => data[field] === null)
    .map((field) => ({ field, message: `${field} cannot be empty.` }));
  if (errors.length) throw validationError(errors);
}

// PATCH /api/products/:id
async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  const data = readProduct(req.body, false);
  rejectEmpty(data, ["name", "slug"]);
  const product = await productService.updateProduct(id, data);
  res.status(200).json({ success: true, product });
}

// POST /api/products/:id/variants
async function addVariant(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  res.status(201).json({ success: true, ...(await productService.addVariant(id, readVariant(req.body, true))) });
}

// PATCH /api/products/:id/variants/:variantId
async function updateVariant(req, res) {
  const id = parseId(req.params.id);
  const variantId = parseId(req.params.variantId);
  if (!id || !variantId) throw notFound("This size does not exist for this product.");
  const data = readVariant(req.body, false);
  rejectEmpty(data, ["optionLabel"]);
  delete data.optionValue; // the size code is what carts store — not changed here
  delete data.optionType;
  res.status(200).json({ success: true, ...(await productService.updateVariant(id, variantId, data)) });
}

function readIdList(body, listField, idField) {
  const b = isPlainObject(body) ? body : {};
  if (!Array.isArray(b[listField]) || b[listField].length > 200) {
    throw validationError([{ field: listField, message: `${listField} must be a list.` }]);
  }
  const items = b[listField].map((item) =>
    check(item).id(idField, { required: true }).money("priceAdjustment", { allowZero: true })
      .bool("isDefault").bool("isActive").done()
  );
  if (new Set(items.map((i) => i[idField])).size !== items.length) {
    throw validationError([{ field: listField, message: "The same item is listed twice." }]);
  }
  return items;
}

// PUT /api/products/:id/fabrics   { fabrics: [{ fabricId, priceAdjustment }] }
async function setFabrics(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  const product = await productService.setProductFabrics(id, readIdList(req.body, "fabrics", "fabricId"));
  res.status(200).json({ success: true, product });
}

// PUT /api/products/:id/storage-options   { storageOptions: [{ storageOptionId, priceAdjustment, isDefault }] }
async function setStorageOptions(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  const product = await productService.setProductStorageOptions(id, readIdList(req.body, "storageOptions", "storageOptionId"));
  res.status(200).json({ success: true, product });
}

// ----- product images (path-based, admin) -----

// A path inside the website folder ("slatted/img-1.jfif", "images/beds/x.jpg")
// or a full http(s) address. No "..", no quotes / angle brackets.
const IMAGE_PATH = /^(?:https?:\/\/[^\s"'<>\\]+|(?!\/\/)(?!.*\.\.)[A-Za-z0-9._\-\/ ()%]+\.(?:jpe?g|jfif|png|webp|gif|avif|svg))$/i;
const IMAGE_PATH_MESSAGE = "Enter an image path such as images/beds/example.jpg (jpg, jpeg, jfif, png, webp, gif, avif or svg).";

function readImage(body, required) {
  return check(body)
    .text("url", { required, max: 1000, pattern: IMAGE_PATH, patternMessage: IMAGE_PATH_MESSAGE })
    .text("altText", { max: 255 })
    .bool("isPrimary")
    .done();
}

function imageIds(req) {
  const id = parseId(req.params.id);
  if (!id) throw notFound(MSG_NOT_FOUND);
  return id;
}

// POST /api/products/:id/images   { url, altText?, isPrimary? }
async function addImage(req, res) {
  const id = imageIds(req);
  const data = readImage(req.body, true);
  res.status(201).json({ success: true, images: await productService.addImage(id, data) });
}

// PATCH /api/products/:id/images/:imageId   { url?, altText?, isPrimary: true? }
async function updateImage(req, res) {
  const id = imageIds(req);
  const imageId = parseId(req.params.imageId);
  if (!imageId) throw notFound("This image does not belong to this product.");
  const data = readImage(req.body, false);
  rejectEmpty(data, ["url"]);
  if (data.isPrimary === false) {
    throw validationError([{ field: "isPrimary", message: "Choose another image as primary instead." }]);
  }
  if (data.url === undefined && data.altText === undefined && data.isPrimary === undefined) {
    throw validationError([{ field: "url", message: "Nothing to update." }]);
  }
  res.status(200).json({ success: true, images: await productService.updateImage(id, imageId, data) });
}

// DELETE /api/products/:id/images/:imageId  (only the link; the file stays)
async function removeImage(req, res) {
  const id = imageIds(req);
  const imageId = parseId(req.params.imageId);
  if (!imageId) throw notFound("This image does not belong to this product.");
  res.status(200).json({ success: true, images: await productService.removeImage(id, imageId) });
}

// PUT /api/products/:id/images/order   { imageIds: [3, 1, 2] }
async function reorderImages(req, res) {
  const id = imageIds(req);
  const b = isPlainObject(req.body) ? req.body : {};
  const list = b.imageIds;
  if (!Array.isArray(list) || !list.length || list.length > 100 || !list.every((x) => Number.isInteger(x) && x > 0)) {
    throw validationError([{ field: "imageIds", message: "imageIds must be the list of this product's image ids." }]);
  }
  if (new Set(list).size !== list.length) throw validationError([{ field: "imageIds", message: "The same image is listed twice." }]);
  res.status(200).json({ success: true, images: await productService.reorderImages(id, list) });
}

module.exports = {
  list, getBySlug, getByIdOrSlug, getPricing, create, update, addVariant, updateVariant, setFabrics, setStorageOptions,
  addImage, updateImage, removeImage, reorderImages,
};