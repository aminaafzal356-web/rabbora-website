// Rabbora Living — basic stock tracking (admin).
// A product, or one size of it, is only stock-limited when it has an
// ACTIVE inventory row. Products without a row are not limited, so
// nothing that sells today stops selling. Orders take stock off inside
// the same transaction as the order (services/orderService.js).

const db = require("../config/db");
const { notFound, badRequest, conflict } = require("../utils/AppError");

function format(r) {
  return {
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    productVariantId: r.product_variant_id,
    sizeLabel: r.option_label || null,
    sku: r.sku,
    stockQuantity: r.stock_quantity,
    lowStockThreshold: r.low_stock_threshold,
    lowStock: r.stock_quantity <= r.low_stock_threshold,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const SELECT = `SELECT i.*, p.name AS product_name, v.option_label
                  FROM inventory_items i
                  JOIN products p ON p.id = i.product_id
                  LEFT JOIN product_variants v ON v.id = i.product_variant_id`;

async function listInventory({ lowStock, productId, limit, offset }) {
  const where = [];
  const params = [];
  if (lowStock) where.push("i.is_active = TRUE AND i.stock_quantity <= i.low_stock_threshold");
  if (productId) { params.push(productId); where.push(`i.product_id = $${params.length}`); }
  params.push(limit, offset);
  const r = await db.query(
    `${SELECT} ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY i.product_id, i.product_variant_id NULLS FIRST
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return r.rows.map(format);
}

async function getInventory(id) {
  const r = await db.query(`${SELECT} WHERE i.id = $1`, [id]);
  if (!r.rows[0]) throw notFound("Inventory item not found.");
  return format(r.rows[0]);
}

async function createInventory(d) {
  const p = await db.query("SELECT id FROM products WHERE id = $1", [d.productId]);
  if (!p.rows[0]) throw notFound("Product not found.");
  if (d.productVariantId) {
    const v = await db.query("SELECT id FROM product_variants WHERE id = $1 AND product_id = $2", [d.productVariantId, d.productId]);
    if (!v.rows[0]) throw badRequest("This size does not belong to this product.");
  }
  try {
    const r = await db.query(
      `INSERT INTO inventory_items (product_id, product_variant_id, sku, stock_quantity, low_stock_threshold, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [d.productId, d.productVariantId || null, d.sku, d.stockQuantity || 0,
       d.lowStockThreshold === undefined ? 5 : d.lowStockThreshold, d.isActive === undefined ? true : d.isActive]
    );
    return getInventory(r.rows[0].id);
  } catch (err) {
    if (err.code === "23505") throw conflict("DUPLICATE", "This SKU, product or size already has an inventory record.");
    throw err;
  }
}

// stockQuantity sets an exact number; adjustBy adds/removes (e.g. -2).
async function updateInventory(id, d) {
  const sets = [];
  const params = [];
  if (d.stockQuantity !== undefined && d.adjustBy !== undefined) throw badRequest("Send stockQuantity or adjustBy, not both.");
  if (d.stockQuantity !== undefined) { params.push(d.stockQuantity); sets.push(`stock_quantity = $${params.length}`); }
  if (d.adjustBy !== undefined) { params.push(d.adjustBy); sets.push(`stock_quantity = stock_quantity + $${params.length}`); }
  if (d.lowStockThreshold !== undefined) { params.push(d.lowStockThreshold); sets.push(`low_stock_threshold = $${params.length}`); }
  if (d.sku !== undefined) { params.push(d.sku); sets.push(`sku = $${params.length}`); }
  if (d.isActive !== undefined) { params.push(d.isActive); sets.push(`is_active = $${params.length}`); }
  if (!sets.length) throw badRequest("Nothing to update.");
  params.push(id);
  try {
    const r = await db.query(
      `UPDATE inventory_items SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING id`,
      params
    );
    if (!r.rows[0]) throw notFound("Inventory item not found.");
  } catch (err) {
    if (err.code === "23514") throw badRequest("Stock cannot go below 0.");
    if (err.code === "23505") throw conflict("DUPLICATE", "This SKU is already used.");
    throw err;
  }
  return getInventory(id);
}

module.exports = { listInventory, getInventory, createInventory, updateInventory };