// Rabbora Living — product reviews.
// One review per customer per product (UNIQUE in the database). New and
// edited reviews wait for an admin (is_approved = FALSE) before they are
// shown publicly. An admin approves with setApproval(id, true).

const db = require("../config/db");
const { notFound, forbidden, conflict, badRequest } = require("../utils/AppError");

function format(r, { withUser = false } = {}) {
  const out = {
    id: r.id,
    productId: r.product_id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isApproved: r.is_approved,
    // Only the first name and last initial are shown publicly.
    author: r.first_name ? `${r.first_name} ${(r.last_name || "").charAt(0)}.`.trim() : null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
  if (withUser) out.userId = r.user_id;
  return out;
}

// Approved reviews of one product (product page widget).
async function listApproved(productId, { limit, offset }) {
  const r = await db.query(
    `SELECT rv.*, u.first_name, u.last_name, COUNT(*) OVER () AS total
       FROM reviews rv JOIN users u ON u.id = rv.user_id
      WHERE rv.product_id = $1 AND rv.is_approved = TRUE
      ORDER BY rv.created_at DESC, rv.id DESC
      LIMIT $2 OFFSET $3`,
    [productId, limit, offset]
  );
  const summary = await db.query(
    `SELECT COUNT(*)::int AS count, ROUND(AVG(rating)::numeric, 1) AS average
       FROM reviews WHERE product_id = $1 AND is_approved = TRUE`,
    [productId]
  );
  return {
    total: r.rows[0] ? Number(r.rows[0].total) : 0,
    average: summary.rows[0].average === null ? null : Number(summary.rows[0].average),
    reviews: r.rows.map((row) => format(row)),
  };
}

// Public Reviews page: approved reviews of ACTIVE products only.
// Filters are optional; sort is whitelisted (never interpolated from input).
const SORT_SQL = {
  newest: "rv.created_at DESC, rv.id DESC",
  oldest: "rv.created_at ASC, rv.id ASC",
  highest: "rv.rating DESC, rv.created_at DESC",
  lowest: "rv.rating ASC, rv.created_at DESC",
};

async function listAllApproved({ limit, offset, rating = null, productId = null, categorySlug = null, sort = "newest" }) {
  const where = ["rv.is_approved = TRUE", "p.is_active = TRUE"];
  const params = [];
  if (rating) { params.push(rating); where.push(`rv.rating = $${params.length}`); }
  if (productId) { params.push(productId); where.push(`rv.product_id = $${params.length}`); }
  if (categorySlug) { params.push(categorySlug); where.push(`c.slug = $${params.length}`); }
  const whereSql = where.join(" AND ");
  const from = `FROM reviews rv
                JOIN products p ON p.id = rv.product_id
                JOIN users u ON u.id = rv.user_id
                LEFT JOIN categories c ON c.id = p.category_id`;

  const page = await db.query(
    `SELECT rv.*, u.first_name, u.last_name, p.name AS product_name, p.slug AS product_slug,
            c.slug AS category_slug, COUNT(*) OVER () AS total
       ${from}
      WHERE ${whereSql}
      ORDER BY ${SORT_SQL[sort] || SORT_SQL.newest}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );

  // Overall summary for the whole shop (approved, active products), ignoring
  // the filters so the breakdown stays useful. Aggregate queries always return
  // one row in PostgreSQL; the fallback only protects against an empty result.
  const summary = await db.query(
    `SELECT COUNT(*)::int AS count,
            ROUND(AVG(rv.rating)::numeric, 1) AS average,
            COUNT(*) FILTER (WHERE rv.rating = 5)::int AS r5,
            COUNT(*) FILTER (WHERE rv.rating = 4)::int AS r4,
            COUNT(*) FILTER (WHERE rv.rating = 3)::int AS r3,
            COUNT(*) FILTER (WHERE rv.rating = 2)::int AS r2,
            COUNT(*) FILTER (WHERE rv.rating = 1)::int AS r1
       FROM reviews rv JOIN products p ON p.id = rv.product_id
      WHERE rv.is_approved = TRUE AND p.is_active = TRUE`
  );
  const s = summary.rows[0] || {};

  return {
    total: page.rows[0] ? Number(page.rows[0].total) : 0,
    overall: {
      count: Number(s.count || 0),
      average: s.average === null || s.average === undefined ? null : Number(s.average),
      distribution: { 5: Number(s.r5 || 0), 4: Number(s.r4 || 0), 3: Number(s.r3 || 0), 2: Number(s.r2 || 0), 1: Number(s.r1 || 0) },
    },
    reviews: page.rows.map((row) => ({
      ...format(row),
      productId: row.product_id,
      productName: row.product_name,
      productSlug: row.product_slug,
      categorySlug: row.category_slug,
    })),
  };
}

// Admin queue: reviews waiting for approval.
async function listPending({ limit, offset }) {
  const r = await db.query(
    `SELECT rv.*, u.first_name, u.last_name, p.name AS product_name, COUNT(*) OVER () AS total
       FROM reviews rv JOIN users u ON u.id = rv.user_id JOIN products p ON p.id = rv.product_id
      WHERE rv.is_approved = FALSE
      ORDER BY rv.created_at, rv.id
      LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return {
    total: r.rows[0] ? Number(r.rows[0].total) : 0,
    reviews: r.rows.map((row) => ({ ...format(row, { withUser: true }), productName: row.product_name })),
  };
}

// New reviews are saved as pending (is_approved = FALSE).
async function createReview(userId, productId, d) {
  try {
    const r = await db.query(
      `INSERT INTO reviews (user_id, product_id, rating, title, body, is_approved)
       VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *`,
      [userId, productId, d.rating, d.title || null, d.body]
    );
    return format(r.rows[0], { withUser: true });
  } catch (err) {
    if (err.code === "23505") throw conflict("DUPLICATE_REVIEW", "You have already reviewed this product. You can edit your review instead.");
    throw err;
  }
}

async function getOwned(user, id) {
  const r = await db.query("SELECT * FROM reviews WHERE id = $1", [id]);
  const row = r.rows[0];
  if (!row) throw notFound("Review not found.");
  if (row.user_id !== user.id && user.role !== "admin") throw forbidden("You can only change your own review.");
  return row;
}

// Editing sends the review back for approval.
async function updateReview(user, id, d) {
  await getOwned(user, id);
  const sets = [];
  const params = [];
  for (const [key, column] of Object.entries({ rating: "rating", title: "title", body: "body" })) {
    if (d[key] !== undefined) { params.push(d[key]); sets.push(`${column} = $${params.length}`); }
  }
  if (!sets.length) throw badRequest("Nothing to update.");
  params.push(id);
  const r = await db.query(
    `UPDATE reviews SET ${sets.join(", ")}, is_approved = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length} RETURNING *`,
    params
  );
  return format(r.rows[0], { withUser: true });
}

async function deleteReview(user, id) {
  await getOwned(user, id);
  await db.query("DELETE FROM reviews WHERE id = $1", [id]);
}

// Approve or hide a review. Throws 404 when no row changed, so the admin
// never sees a success for a review that does not exist.
async function setApproval(id, approved) {
  const r = await db.query(
    "UPDATE reviews SET is_approved = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [approved, id]
  );
  if (!r.rows[0]) throw notFound("Review not found.");
  return format(r.rows[0], { withUser: true });
}

module.exports = {
  listApproved,
  listAllApproved,
  listPending,
  createReview,
  updateReview,
  deleteReview,
  setApproval,
  SORT_SQL,
};