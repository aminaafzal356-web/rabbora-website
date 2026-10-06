// Rabbora Living — product reviews.
// One review per customer per product (UNIQUE in the database).
// A new review is published straight away (is_approved = TRUE) — no
// admin approval is needed. An admin can still hide a review
// (is_approved = FALSE) from admin/reviews.html; hidden reviews are not
// shown in the shop and are not counted in the product's rating.

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

async function createReview(userId, productId, d) {
  try {
    const r = await db.query(
      `INSERT INTO reviews (user_id, product_id, rating, title, body, is_approved)
       VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING *`,
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

// Editing keeps the review's visibility: a published review stays
// published, and a review an admin has hidden stays hidden.
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
    `UPDATE reviews SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length} RETURNING *`,
    params
  );
  return format(r.rows[0], { withUser: true });
}

async function deleteReview(user, id) {
  await getOwned(user, id);
  await db.query("DELETE FROM reviews WHERE id = $1", [id]);
}

async function setApproval(id, approved) {
  const r = await db.query(
    "UPDATE reviews SET is_approved = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [approved, id]
  );
  if (!r.rows[0]) throw notFound("Review not found.");
  return format(r.rows[0], { withUser: true });
}

module.exports = { listApproved, listPending, createReview, updateReview, deleteReview, setApproval };