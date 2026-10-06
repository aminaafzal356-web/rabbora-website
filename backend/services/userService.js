// Rabbora Living — customer profile, saved addresses, and admin user list.
// Passwords and password hashes are never selected here.

const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");
const { notFound, badRequest } = require("../utils/AppError");

function formatUser(r) {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    name: `${r.first_name} ${r.last_name}`,
    email: r.email,
    phone: r.phone,
    role: r.role,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const USER_COLUMNS = "id, first_name, last_name, email, phone, role, is_active, created_at, updated_at";

async function getUser(id) {
  const r = await db.query(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id]);
  if (!r.rows[0]) throw notFound("User not found.");
  return formatUser(r.rows[0]);
}

async function updateProfile(id, d) {
  const map = { firstName: "first_name", lastName: "last_name", phone: "phone" };
  const sets = [];
  const params = [];
  for (const [key, column] of Object.entries(map)) {
    if (d[key] !== undefined && d[key] !== null) {
      params.push(d[key]);
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (!sets.length) throw badRequest("Nothing to update.");
  params.push(id);
  const r = await db.query(
    `UPDATE users SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length} RETURNING ${USER_COLUMNS}`,
    params
  );
  return formatUser(r.rows[0]);
}

// Admin: list accounts (newest first), optional ?search= on name/email.
async function listUsers({ limit, offset, search }) {
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search.replace(/[\\%_]/g, (m) => "\\" + m)}%`);
    where = `WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1`;
  }
  params.push(limit, offset);
  const r = await db.query(
    `SELECT ${USER_COLUMNS}, COUNT(*) OVER () AS total
       FROM users ${where}
      ORDER BY id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { total: r.rows[0] ? Number(r.rows[0].total) : 0, users: r.rows.map(formatUser) };
}

// Admin: change role / active status. An admin cannot lock themselves out.
async function adminUpdateUser(adminId, id, d) {
  if (id === adminId && (d.isActive === false || (d.role && d.role !== "admin"))) {
    throw badRequest("You cannot remove your own admin access.");
  }
  const sets = [];
  const params = [];
  if (d.role !== undefined) { params.push(d.role); sets.push(`role = $${params.length}`); }
  if (d.isActive !== undefined) { params.push(d.isActive); sets.push(`is_active = $${params.length}`); }
  if (!sets.length) throw badRequest("Nothing to update.");
  params.push(id);
  const r = await db.query(
    `UPDATE users SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length} RETURNING ${USER_COLUMNS}`,
    params
  );
  if (!r.rows[0]) throw notFound("User not found.");
  return formatUser(r.rows[0]);
}

// ---------- addresses ----------

function formatAddress(r) {
  return {
    id: r.id,
    fullName: r.full_name,
    phone: r.phone,
    addressLine1: r.address_line1,
    addressLine2: r.address_line2,
    city: r.city,
    county: r.county,
    postcode: r.postcode,
    country: r.country,
    isDefault: r.is_default,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function listAddresses(userId) {
  const r = await db.query(
    "SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id",
    [userId]
  );
  return r.rows.map(formatAddress);
}

async function getAddress(userId, id, client = db) {
  const r = await client.query("SELECT * FROM addresses WHERE id = $1 AND user_id = $2", [id, userId]);
  if (!r.rows[0]) throw notFound("Address not found.");
  return formatAddress(r.rows[0]);
}

async function createAddress(userId, d) {
  return withTransaction(async (client) => {
    const count = await client.query("SELECT COUNT(*)::int AS n FROM addresses WHERE user_id = $1", [userId]);
    if (count.rows[0].n >= 20) throw badRequest("You can save up to 20 addresses.");
    // The first address is the default automatically.
    const makeDefault = d.isDefault === true || count.rows[0].n === 0;
    if (makeDefault) await client.query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default", [userId]);
    const r = await client.query(
      `INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, county, postcode, country, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [userId, d.fullName, d.phone, d.addressLine1, d.addressLine2 || null, d.city, d.county || null,
       d.postcode, d.country || "United Kingdom", makeDefault]
    );
    return formatAddress(r.rows[0]);
  });
}

async function updateAddress(userId, id, d) {
  return withTransaction(async (client) => {
    await getAddress(userId, id, client);
    if (d.isDefault === true) {
      await client.query("UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default AND id <> $2", [userId, id]);
    }
    const map = { fullName: "full_name", phone: "phone", addressLine1: "address_line1", addressLine2: "address_line2",
      city: "city", county: "county", postcode: "postcode", country: "country", isDefault: "is_default" };
    const sets = [];
    const params = [];
    for (const [key, column] of Object.entries(map)) {
      if (d[key] !== undefined) { params.push(d[key]); sets.push(`${column} = $${params.length}`); }
    }
    if (!sets.length) throw badRequest("Nothing to update.");
    params.push(id, userId);
    const r = await client.query(
      `UPDATE addresses SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${params.length - 1} AND user_id = $${params.length} RETURNING *`,
      params
    );
    return formatAddress(r.rows[0]);
  });
}

async function deleteAddress(userId, id) {
  const r = await db.query("DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
  if (!r.rows[0]) throw notFound("Address not found.");
}

module.exports = { getUser, updateProfile, listUsers, adminUpdateUser, listAddresses, getAddress, createAddress, updateAddress, deleteAddress, formatAddress };