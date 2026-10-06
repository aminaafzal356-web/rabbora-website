// Rabbora Living — wishlist of a logged-in customer.
// UNIQUE (user_id, product_id) in the database means a product can never
// be saved twice; adding it again simply keeps the existing row.

const db = require("../config/db");
const { notFound } = require("../utils/AppError");
const { buildPricing } = require("../utils/pricing");

async function listWishlist(userId) {
  const r = await db.query(
    `SELECT w.id, w.product_id, w.created_at, p.name, p.slug, p.price, p.main_image, p.is_active
       FROM wishlist_items w
       JOIN products p ON p.id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC, w.id DESC`,
    [userId]
  );
  return r.rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    name: row.name,
    slug: row.slug,
    mainImage: row.main_image,
    available: row.is_active,
    pricing: buildPricing(row.price, null),
    addedAt: row.created_at,
  }));
}

// productId or productSlug -> an active product id.
async function resolveProduct({ productId, productSlug }) {
  const r = productId
    ? await db.query("SELECT id FROM products WHERE id = $1 AND is_active = TRUE", [productId])
    : await db.query("SELECT id FROM products WHERE slug = $1 AND is_active = TRUE", [productSlug]);
  if (!r.rows[0]) throw notFound("Product not found.");
  return r.rows[0].id;
}

async function addToWishlist(userId, ref) {
  const productId = await resolveProduct(ref);
  const r = await db.query(
    `INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING id`,
    [userId, productId]
  );
  return { productId, added: r.rowCount === 1 };
}

async function removeFromWishlist(userId, productId) {
  const r = await db.query("DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2 RETURNING id", [userId, productId]);
  if (!r.rows[0]) throw notFound("This product is not in your wishlist.");
}

async function clearWishlist(userId) {
  const r = await db.query("DELETE FROM wishlist_items WHERE user_id = $1", [userId]);
  return r.rowCount;
}

module.exports = { listWishlist, addToWishlist, removeFromWishlist, clearWishlist, resolveProduct };