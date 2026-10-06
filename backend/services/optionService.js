// Rabbora Living — shared option catalogues: fabrics and storage options.
// Which product offers which is set with PUT /api/products/:id/fabrics
// and PUT /api/products/:id/storage-options.

const db = require("../config/db");
const { notFound, badRequest } = require("../utils/AppError");

function formatFabric(r) {
  return { id: r.id, slug: r.slug, name: r.name, collection: r.collection, imageUrl: r.image_url,
    sortOrder: r.sort_order, isActive: r.is_active, createdAt: r.created_at, updatedAt: r.updated_at };
}
function formatStorage(r) {
  return { id: r.id, code: r.code, name: r.name, description: r.description,
    sortOrder: r.sort_order, isActive: r.is_active, createdAt: r.created_at, updatedAt: r.updated_at };
}

async function listFabrics() {
  const r = await db.query(
    `SELECT * FROM fabrics WHERE is_active = TRUE ORDER BY collection NULLS LAST, sort_order, name`
  );
  return r.rows.map(formatFabric);
}

async function createFabric(d) {
  const r = await db.query(
    `INSERT INTO fabrics (slug, name, collection, image_url, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [d.slug, d.name, d.collection || null, d.imageUrl || null, d.sortOrder || 0, d.isActive === undefined ? true : d.isActive]
  );
  return formatFabric(r.rows[0]);
}

async function listStorageOptions() {
  const r = await db.query(`SELECT * FROM storage_options WHERE is_active = TRUE ORDER BY sort_order, name`);
  return r.rows.map(formatStorage);
}

async function createStorageOption(d) {
  const r = await db.query(
    `INSERT INTO storage_options (code, name, description, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [d.code, d.name, d.description || null, d.sortOrder || 0, d.isActive === undefined ? true : d.isActive]
  );
  return formatStorage(r.rows[0]);
}

async function updateRow(table, id, data, map, format) {
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
    `UPDATE ${table} SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (!r.rows[0]) throw notFound("Not found.");
  return format(r.rows[0]);
}

const updateFabric = (id, d) => updateRow("fabrics", id, d,
  { slug: "slug", name: "name", collection: "collection", imageUrl: "image_url", sortOrder: "sort_order", isActive: "is_active" }, formatFabric);
const updateStorageOption = (id, d) => updateRow("storage_options", id, d,
  { code: "code", name: "name", description: "description", sortOrder: "sort_order", isActive: "is_active" }, formatStorage);

module.exports = { listFabrics, createFabric, updateFabric, listStorageOptions, createStorageOption, updateStorageOption };