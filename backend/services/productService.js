// Rabbora Living — products: reading for the shop, managing for admins.
//
// The response of GET /api/products/:slug keeps EVERY field the product
// pages already read (id, name, slug, description, price, category_id,
// main_image, stock_quantity, images[], variants[] with price and
// compare_at_price). New fields are only ADDED next to them, so the
// frontend keeps working exactly as before.

const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");
const { buildPricing, toPence, fromPence } = require("../utils/pricing");
const { notFound, badRequest } = require("../utils/AppError");

// ---------- small helpers ----------

const toPrice = (value) => (value === null || value === undefined ? null : Number(value));

const PRODUCT_COLUMNS = `p.id, p.name, p.slug, p.description, p.price, p.category_id, p.main_image,
  p.stock_quantity, p.sku, p.is_active, p.is_featured, p.is_best_seller, p.created_at, p.updated_at`;

// Fields of the existing list/detail shape (unchanged) + new ones.
function formatProductBase(row) {
  return {
    // --- existing fields (used by the frontend today) ---
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: toPrice(row.price),
    category_id: row.category_id,
    main_image: row.main_image,
    stock_quantity: row.stock_quantity,
    // --- new fields ---
    sku: row.sku,
    featured: row.is_featured,
    bestSeller: row.is_best_seller,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatImage(row) {
  return {
    id: row.id,
    image_url: row.image_url,
    alt_text: row.alt_text,
    sort_order: row.sort_order,
    is_primary: row.is_primary,
  };
}

// Existing variant shape (unchanged) + sku/currency.
function formatVariant(row) {
  return {
    id: row.id,
    option_type: row.option_type,
    option_value: row.option_value,
    option_label: row.option_label,
    price: toPrice(row.price),
    compare_at_price: toPrice(row.compare_at_price),
    stock_quantity: row.stock_quantity,
    width_cm: row.width_cm,
    length_cm: row.length_cm,
    sort_order: row.sort_order,
    sku: row.sku,
    currency: row.currency,
  };
}

function formatSize(row) {
  return {
    variantId: row.id,
    type: row.option_type, // "size" or "width"
    code: row.option_value, // e.g. "Double" — what the cart saves
    label: row.option_label, // e.g. 'Double 4ft 6"' — the button text
    widthCm: row.width_cm,
    lengthCm: row.length_cm,
    sortOrder: row.sort_order,
  };
}

// One pricing row per size: sale, original, discount %, savings, monthly.
function formatPricingRow(row) {
  return {
    variantId: row.id,
    size: row.option_value,
    sizeLabel: row.option_label,
    ...buildPricing(row.price, row.compare_at_price),
  };
}

// "From" price (no size chosen), with the same rule the product pages use
// when they read the API (rbApiSizeData): the sale price is the product
// price (its lowest size price); the old price is the compare-at price of
// the first size that has exactly that price, or else the compare-at
// price of the first size. buildPricing only uses it when it is higher.
// The list query gets the same two compare-at prices straight from SQL
// (from_base_compare_at / from_first_compare_at).
function fromPricingFor(productPrice, variants) {
  const sorted = variants || [];
  const price = toPrice(productPrice);
  const base = sorted.find((v) => toPrice(v.price) === price);
  const baseOld = base ? toPrice(base.compare_at_price) : null;
  const firstOld = sorted.length ? toPrice(sorted[0].compare_at_price) : null;
  const old = baseOld !== null && baseOld > price ? baseOld : firstOld;
  return buildPricing(productPrice, old);
}

function fromPricingForListRow(row) {
  const price = toPrice(row.price);
  const baseOld = toPrice(row.from_base_compare_at);
  const old = baseOld !== null && baseOld > price ? baseOld : toPrice(row.from_first_compare_at);
  return buildPricing(row.price, old);
}

// ---------- reading (shop) ----------

// GET /api/products — same list as before; optional filters.
async function listProducts(filters = {}) {
  const where = ["p.is_active = TRUE"];
  const params = [];

  if (filters.category) {
    params.push(filters.category);
    where.push(`c.slug = $${params.length}`);
  }
  if (filters.featured === true) where.push("p.is_featured = TRUE");
  if (filters.bestSeller === true) where.push("p.is_best_seller = TRUE");
  if (filters.search) {
    params.push(`%${filters.search.replace(/[\\%_]/g, (m) => "\\" + m)}%`);
    where.push(`p.name ILIKE $${params.length}`);
  }

  let limitSql = "";
  if (filters.limit) {
    params.push(filters.limit, filters.offset || 0);
    limitSql = `LIMIT $${params.length - 1} OFFSET $${params.length}`;
  }

  const result = await db.query(
    `SELECT ${PRODUCT_COLUMNS}, c.slug AS category_slug, c.name AS category_name,
            (SELECT v.compare_at_price FROM product_variants v
              WHERE v.product_id = p.id AND v.is_active = TRUE AND v.price = p.price
              ORDER BY v.sort_order, v.id LIMIT 1) AS from_base_compare_at,
            (SELECT v.compare_at_price FROM product_variants v
              WHERE v.product_id = p.id AND v.is_active = TRUE
              ORDER BY v.sort_order, v.id LIMIT 1) AS from_first_compare_at
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(" AND ")}
      ORDER BY p.id
      ${limitSql}`,
    params
  );

  return result.rows.map((row) => ({
    ...formatProductBase(row),
    category: row.category_id ? { id: row.category_id, slug: row.category_slug, name: row.category_name } : null,
    pricing: fromPricingForListRow(row),
  }));
}

// Everything one product page needs. `where` is "p.slug = $1" or "p.id = $1".
async function loadFullProduct(where, value, { includeInactive = false } = {}) {
  const productResult = await db.query(
    `SELECT ${PRODUCT_COLUMNS}, c.slug AS category_slug, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where} ${includeInactive ? "" : "AND p.is_active = TRUE"}`,
    [value]
  );
  const row = productResult.rows[0];
  if (!row) throw notFound("Product not found.");

  const id = row.id;
  const [images, variants, fabrics, storage, inventory, rating] = await Promise.all([
    db.query(
      // The primary image (if one is set) comes first: the product pages
      // show the first image as the main picture. Without a primary the
      // order is exactly sort_order, id as before.
      `SELECT id, image_url, alt_text, sort_order, is_primary
         FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order, id`,
      [id]
    ),
    db.query(
      `SELECT id, option_type, option_value, option_label, price, compare_at_price,
              stock_quantity, width_cm, length_cm, sort_order, sku, currency
         FROM product_variants
        WHERE product_id = $1 AND is_active = TRUE
        ORDER BY sort_order, id`,
      [id]
    ),
    db.query(
      `SELECT f.id, f.slug, f.name, f.collection, f.image_url, pf.price_adjustment
         FROM product_fabrics pf
         JOIN fabrics f ON f.id = pf.fabric_id
        WHERE pf.product_id = $1 AND pf.is_active = TRUE AND f.is_active = TRUE
        ORDER BY pf.sort_order, f.sort_order, f.name`,
      [id]
    ),
    db.query(
      `SELECT s.id, s.code, s.name, s.description, ps.price_adjustment, ps.is_default
         FROM product_storage_options ps
         JOIN storage_options s ON s.id = ps.storage_option_id
        WHERE ps.product_id = $1 AND ps.is_active = TRUE AND s.is_active = TRUE
        ORDER BY ps.sort_order, s.sort_order, s.name`,
      [id]
    ),
    db.query(
      `SELECT product_variant_id, stock_quantity, low_stock_threshold
         FROM inventory_items
        WHERE product_id = $1 AND is_active = TRUE`,
      [id]
    ),
    db.query(
      `SELECT COUNT(*)::int AS count, ROUND(AVG(rating)::numeric, 1) AS average
         FROM reviews WHERE product_id = $1 AND is_approved = TRUE`,
      [id]
    ),
  ]);

  // Stock: only tracked items have a limit. Exact numbers stay admin-only.
  const tracked = inventory.rows.map((inv) => ({
    variantId: inv.product_variant_id,
    inStock: inv.stock_quantity > 0,
    lowStock: inv.stock_quantity > 0 && inv.stock_quantity <= inv.low_stock_threshold,
  }));

  return {
    ...formatProductBase(row),
    category: row.category_id ? { id: row.category_id, slug: row.category_slug, name: row.category_name } : null,
    images: images.rows.map(formatImage),
    variants: variants.rows.map(formatVariant),
    sizes: variants.rows.map(formatSize),
    // "From" price (no size chosen) and one entry per size.
    fromPricing: fromPricingFor(row.price, variants.rows),
    pricing: variants.rows.map(formatPricingRow),
    fabrics: fabrics.rows.map((f) => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      collection: f.collection,
      imageUrl: f.image_url,
      priceAdjustment: toPrice(f.price_adjustment),
    })),
    storageOptions: storage.rows.map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      description: s.description,
      priceAdjustment: toPrice(s.price_adjustment),
      isDefault: s.is_default,
    })),
    inventory: { tracked: tracked.length > 0, items: tracked },
    rating: { average: rating.rows[0].average === null ? null : Number(rating.rows[0].average), count: rating.rows[0].count },
  };
}

const getProductBySlug = (slug) => loadFullProduct("p.slug = $1", slug);
const getProductById = (id, opts) => loadFullProduct("p.id = $1", id, opts);

// GET /api/products/:id/pricing (shop: active products only).
// The admin size endpoints pass { includeInactive: true }, so a size can
// also be added to / changed on a product that is switched off.
async function getPricing(productId, { includeInactive = false } = {}) {
  const product = await db.query(
    `SELECT id, price FROM products WHERE id = $1 ${includeInactive ? "" : "AND is_active = TRUE"}`,
    [productId]
  );
  if (!product.rows[0]) throw notFound("Product not found.");
  const variants = await db.query(
    `SELECT id, option_value, option_label, price, compare_at_price
       FROM product_variants WHERE product_id = $1 AND is_active = TRUE ORDER BY sort_order, id`,
    [productId]
  );
  return {
    productId,
    fromPricing: fromPricingFor(product.rows[0].price, variants.rows),
    pricing: variants.rows.map(formatPricingRow),
  };
}

// ---------- managing (admin) ----------

async function assertCategory(client, categoryId) {
  if (categoryId === null || categoryId === undefined) return;
  const r = await client.query("SELECT 1 FROM categories WHERE id = $1", [categoryId]);
  if (!r.rows[0]) throw notFound("Category not found.");
}

// The original price must be higher than the sale price (same rule as
// the product_variants table).
function assertPriceOrder(price, compareAtPrice) {
  if (compareAtPrice !== null && compareAtPrice !== undefined && toPence(compareAtPrice) <= toPence(price)) {
    throw badRequest("compareAtPrice (original price) must be higher than price (sale price).");
  }
}

async function insertVariant(client, productId, v) {
  assertPriceOrder(v.price, v.compareAtPrice);
  const r = await client.query(
    `INSERT INTO product_variants
            (product_id, option_type, option_value, option_label, price, compare_at_price,
             width_cm, length_cm, sort_order, sku, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      productId,
      v.optionType || "size",
      v.optionValue,
      v.optionLabel,
      v.price,
      v.compareAtPrice === undefined ? null : v.compareAtPrice,
      v.widthCm === undefined ? null : v.widthCm,
      v.lengthCm === undefined ? null : v.lengthCm,
      v.sortOrder || 0,
      v.sku || null,
      v.isActive === undefined ? true : v.isActive,
    ]
  );
  return r.rows[0].id;
}

// After sizes change, products.price stays the lowest active size price
// (the "from" price), the same rule migrate_products.sql used.
async function syncFromPrice(client, productId) {
  await client.query(
    `UPDATE products p
        SET price = sub.min_price, updated_at = CURRENT_TIMESTAMP
       FROM (SELECT MIN(price) AS min_price FROM product_variants
              WHERE product_id = $1 AND is_active = TRUE) sub
      WHERE p.id = $1 AND sub.min_price IS NOT NULL AND p.price <> sub.min_price`,
    [productId]
  );
}

async function createProduct(data) {
  const productId = await withTransaction(async (client) => {
    await assertCategory(client, data.categoryId);
    const r = await client.query(
      `INSERT INTO products (name, slug, description, price, category_id, main_image, sku,
                             is_active, is_featured, is_best_seller)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        data.name,
        data.slug,
        data.description || null,
        data.price,
        data.categoryId || null,
        data.mainImage || null,
        data.sku || null,
        data.isActive === undefined ? true : data.isActive,
        data.isFeatured || false,
        data.isBestSeller || false,
      ]
    );
    const id = r.rows[0].id;

    for (const [i, img] of (data.images || []).entries()) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, img.url, img.altText || null, img.sortOrder === undefined ? i : img.sortOrder, img.isPrimary === true]
      );
    }
    for (const v of data.variants || []) await insertVariant(client, id, v);
    if ((data.variants || []).length) await syncFromPrice(client, id);
    return id;
  });
  return getProductById(productId, { includeInactive: true });
}

// Only the fields that were sent are changed.
async function updateProduct(productId, data) {
  await withTransaction(async (client) => {
    const exists = await client.query("SELECT id FROM products WHERE id = $1 FOR UPDATE", [productId]);
    if (!exists.rows[0]) throw notFound("Product not found.");
    if (data.categoryId !== undefined) await assertCategory(client, data.categoryId);

    const map = {
      name: "name",
      slug: "slug",
      description: "description",
      price: "price",
      categoryId: "category_id",
      mainImage: "main_image",
      sku: "sku",
      isActive: "is_active",
      isFeatured: "is_featured",
      isBestSeller: "is_best_seller",
    };
    const sets = [];
    const params = [];
    for (const [key, column] of Object.entries(map)) {
      if (data[key] !== undefined) {
        params.push(data[key]);
        sets.push(`${column} = $${params.length}`);
      }
    }
    if (!sets.length) throw badRequest("Nothing to update.");
    params.push(productId);
    await client.query(
      `UPDATE products SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length}`,
      params
    );
  });
  return getProductById(productId, { includeInactive: true });
}

async function addVariant(productId, v) {
  await withTransaction(async (client) => {
    const exists = await client.query("SELECT id FROM products WHERE id = $1 FOR UPDATE", [productId]);
    if (!exists.rows[0]) throw notFound("Product not found.");
    await insertVariant(client, productId, v);
    await syncFromPrice(client, productId);
  });
  return getPricing(productId, { includeInactive: true });
}

// Changes one size's sale price / original price / label / status.
async function updateVariant(productId, variantId, data) {
  await withTransaction(async (client) => {
    const r = await client.query(
      `SELECT id, price, compare_at_price FROM product_variants
        WHERE id = $1 AND product_id = $2 FOR UPDATE`,
      [variantId, productId]
    );
    const current = r.rows[0];
    if (!current) throw notFound("This size does not exist for this product.");

    const price = data.price !== undefined ? data.price : Number(current.price);
    const compare = data.compareAtPrice !== undefined ? data.compareAtPrice : toPrice(current.compare_at_price);
    assertPriceOrder(price, compare);

    const map = {
      price: "price",
      compareAtPrice: "compare_at_price",
      optionLabel: "option_label",
      sortOrder: "sort_order",
      widthCm: "width_cm",
      lengthCm: "length_cm",
      sku: "sku",
      isActive: "is_active",
    };
    const sets = [];
    const params = [];
    for (const [key, column] of Object.entries(map)) {
      if (data[key] !== undefined) {
        params.push(data[key]);
        sets.push(`${column} = $${params.length}`);
      }
    }
    if (!sets.length) throw badRequest("Nothing to update.");
    params.push(variantId);
    await client.query(
      `UPDATE product_variants SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length}`,
      params
    );
    await syncFromPrice(client, productId);
  });
  return getPricing(productId, { includeInactive: true });
}

// Every id in the list must be an existing record (clear message instead
// of a database error). Records are only read, never created.
async function assertAllExist(client, table, ids, label) {
  if (!ids.length) return;
  const r = await client.query(`SELECT id FROM ${table} WHERE id = ANY($1::int[])`, [ids]);
  const found = new Set(r.rows.map((row) => row.id));
  const missing = ids.filter((id) => !found.has(id));
  if (missing.length) throw notFound(`${label} not found: ${missing.join(", ")}.`);
}

// Replaces the list of fabrics a product offers. A link sent with
// isActive: false keeps its switched-off state (default: on).
async function setProductFabrics(productId, items) {
  await withTransaction(async (client) => {
    const exists = await client.query("SELECT id FROM products WHERE id = $1 FOR UPDATE", [productId]);
    if (!exists.rows[0]) throw notFound("Product not found.");
    await assertAllExist(client, "fabrics", items.map((i) => i.fabricId), "Fabric");
    await client.query("DELETE FROM product_fabrics WHERE product_id = $1", [productId]);
    for (const [i, item] of items.entries()) {
      await client.query(
        `INSERT INTO product_fabrics (product_id, fabric_id, price_adjustment, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, item.fabricId, item.priceAdjustment || 0, i, item.isActive !== false]
      );
    }
  });
  return getProductById(productId, { includeInactive: true });
}

// Replaces the list of storage options a product offers. A link sent
// with isActive: false keeps its switched-off state (default: on).
async function setProductStorageOptions(productId, items) {
  if (items.filter((i) => i.isDefault).length > 1) throw badRequest("Only one storage option can be the default.");
  await withTransaction(async (client) => {
    const exists = await client.query("SELECT id FROM products WHERE id = $1 FOR UPDATE", [productId]);
    if (!exists.rows[0]) throw notFound("Product not found.");
    await assertAllExist(client, "storage_options", items.map((i) => i.storageOptionId), "Storage option");
    await client.query("DELETE FROM product_storage_options WHERE product_id = $1", [productId]);
    for (const [i, item] of items.entries()) {
      await client.query(
        `INSERT INTO product_storage_options (product_id, storage_option_id, price_adjustment, is_default, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [productId, item.storageOptionId, item.priceAdjustment || 0, item.isDefault === true, i, item.isActive !== false]
      );
    }
  });
  return getProductById(productId, { includeInactive: true });
}

// ---------- product images (admin) ----------
// Path-based: image_url is a path inside the website folder (e.g.
// "slatted/img-1.jfif") — no files are uploaded or deleted here.
// products.main_image (used for list thumbnails) follows the primary image.

async function lockProduct(client, productId) {
  const r = await client.query("SELECT id, main_image FROM products WHERE id = $1 FOR UPDATE", [productId]);
  if (!r.rows[0]) throw notFound("Product not found.");
  return r.rows[0];
}

async function getOwnedImage(client, productId, imageId) {
  const r = await client.query(
    "SELECT id, image_url, is_primary FROM product_images WHERE id = $1 AND product_id = $2 FOR UPDATE",
    [imageId, productId]
  );
  if (!r.rows[0]) throw notFound("This image does not belong to this product.");
  return r.rows[0];
}

async function listImages(client, productId) {
  const r = await client.query(
    `SELECT id, image_url, alt_text, sort_order, is_primary
       FROM product_images WHERE product_id = $1 ORDER BY sort_order, id`,
    [productId]
  );
  return r.rows.map(formatImage);
}

async function setPrimary(client, productId, imageId, url) {
  await client.query("UPDATE product_images SET is_primary = FALSE WHERE product_id = $1 AND is_primary AND id <> $2", [productId, imageId]);
  await client.query("UPDATE product_images SET is_primary = TRUE WHERE id = $1", [imageId]);
  await client.query("UPDATE products SET main_image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [url, productId]);
}

// POST /api/products/:id/images  { url, altText?, isPrimary? } -> added last
async function addImage(productId, data) {
  return withTransaction(async (client) => {
    await lockProduct(client, productId);
    const next = await client.query("SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM product_images WHERE product_id = $1", [productId]);
    const r = await client.query(
      `INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary)
       VALUES ($1, $2, $3, $4, FALSE) RETURNING id`,
      [productId, data.url, data.altText || null, next.rows[0].n]
    );
    if (data.isPrimary === true) await setPrimary(client, productId, r.rows[0].id, data.url);
    return listImages(client, productId);
  });
}

// PATCH /api/products/:id/images/:imageId  { url?, altText?, isPrimary: true? }
async function updateImage(productId, imageId, data) {
  return withTransaction(async (client) => {
    const product = await lockProduct(client, productId);
    const image = await getOwnedImage(client, productId, imageId);
    const url = data.url !== undefined ? data.url : image.image_url;
    if (data.url !== undefined || data.altText !== undefined) {
      const sets = [];
      const params = [];
      if (data.url !== undefined) { params.push(data.url); sets.push(`image_url = $${params.length}`); }
      if (data.altText !== undefined) { params.push(data.altText); sets.push(`alt_text = $${params.length}`); }
      params.push(imageId);
      await client.query(`UPDATE product_images SET ${sets.join(", ")} WHERE id = $${params.length}`, params);
      // The list thumbnail pointed at the old path: follow the new one.
      if (data.url !== undefined && product.main_image === image.image_url) {
        await client.query("UPDATE products SET main_image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [url, productId]);
      }
    }
    if (data.isPrimary === true) await setPrimary(client, productId, imageId, url);
    return listImages(client, productId);
  });
}

// DELETE /api/products/:id/images/:imageId — removes the link to the
// image from this product (the file itself is not touched). The last
// image cannot be removed: the product pages need at least one.
async function removeImage(productId, imageId) {
  return withTransaction(async (client) => {
    const product = await lockProduct(client, productId);
    const image = await getOwnedImage(client, productId, imageId);
    const count = await client.query("SELECT COUNT(*)::int AS n FROM product_images WHERE product_id = $1", [productId]);
    if (count.rows[0].n <= 1) throw badRequest("A product needs at least one image, so the last image can't be removed.");
    await client.query("DELETE FROM product_images WHERE id = $1", [imageId]);
    if (product.main_image === image.image_url) {
      const first = await client.query(
        "SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order, id LIMIT 1",
        [productId]
      );
      await client.query("UPDATE products SET main_image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [first.rows[0].image_url, productId]);
    }
    return listImages(client, productId);
  });
}

// PUT /api/products/:id/images/order  { imageIds: [all image ids, new order] }
async function reorderImages(productId, imageIds) {
  return withTransaction(async (client) => {
    await lockProduct(client, productId);
    const current = await client.query("SELECT id FROM product_images WHERE product_id = $1", [productId]);
    const have = current.rows.map((r) => r.id).sort((a, b) => a - b);
    const sent = imageIds.slice().sort((a, b) => a - b);
    if (have.length !== sent.length || have.some((id, i) => id !== sent[i])) {
      throw badRequest("The image list has changed. Reload the page and try again.");
    }
    for (const [i, id] of imageIds.entries()) {
      await client.query("UPDATE product_images SET sort_order = $1 WHERE id = $2", [i, id]);
    }
    return listImages(client, productId);
  });
}

module.exports = {
  listProducts,
  getProductBySlug,
  getProductById,
  getPricing,
  createProduct,
  updateProduct,
  addVariant,
  updateVariant,
  setProductFabrics,
  setProductStorageOptions,
  addImage,
  updateImage,
  removeImage,
  reorderImages,
  // shared with other services
  formatPricingRow,
  fromPricingForListRow,
  fromPence,
};