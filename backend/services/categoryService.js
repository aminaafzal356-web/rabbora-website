// Rabbora Living — categories (the existing categories table is reused).

const db = require("../config/db");
const { notFound, badRequest } = require("../utils/AppError");

function format(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    productCount: row.product_count === undefined ? undefined : Number(row.product_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const COLUMNS = "c.id, c.name, c.slug, c.description, c.is_active, c.sort_order, c.created_at, c.updated_at";

async function listCategories({ includeInactive = false } = {}) {
  const r = await db.query(
    `SELECT ${COLUMNS},
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) AS product_count
       FROM categories c
      ${includeInactive ? "" : "WHERE c.is_active = TRUE"}
      ORDER BY c.sort_order, c.name`
  );
  return r.rows.map(format);
}

async function getCategoryBySlug(slug) {
  const r = await db.query(
    `SELECT ${COLUMNS},
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) AS product_count
       FROM categories c WHERE c.slug = $1 AND c.is_active = TRUE`,
    [slug]
  );
  if (!r.rows[0]) throw notFound("Category not found.");
  return format(r.rows[0]);
}

// Same as getCategoryBySlug, found by the numeric id instead.
async function getCategoryById(id) {
  const r = await db.query(
    `SELECT ${COLUMNS},
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) AS product_count
       FROM categories c WHERE c.id = $1 AND c.is_active = TRUE`,
    [id]
  );
  if (!r.rows[0]) throw notFound("Category not found.");
  return format(r.rows[0]);
}

async function createCategory(data) {
  const r = await db.query(
    `INSERT INTO categories (name, slug, description, is_active, sort_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, slug, description, is_active, sort_order, created_at, updated_at`,
    [data.name, data.slug, data.description || null, data.isActive === undefined ? true : data.isActive, data.sortOrder || 0]
  );
  return format(r.rows[0]);
}

async function updateCategory(id, data) {
  const map = { name: "name", slug: "slug", description: "description", isActive: "is_active", sortOrder: "sort_order" };
  const sets = [];
  const params = [];
  for (const [key, column] of Object.entries(map)) {
    if (data[key] !== undefined) {
      params.push(data[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (!sets.length) throw badRequest("Nothing to update.");
  params.push(id);
  const r = await db.query(
    `UPDATE categories SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length}
      RETURNING id, name, slug, description, is_active, sort_order, created_at, updated_at`,
    params
  );
  if (!r.rows[0]) throw notFound("Category not found.");
  return format(r.rows[0]);
}

module.exports = { listCategories, getCategoryBySlug, getCategoryById, createCategory, updateCategory };