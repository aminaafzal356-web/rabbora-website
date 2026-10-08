// Rabbora Living — Fabric Sample Requests + Contact Messages (database work)
// Tables: fabric_sample_requests, contact_messages (database/enquiries.sql).
// Parameterised SQL only. Rows never contain passwords, hashes or tokens:
// both tables are separate from the users table.

const db = require("../config/db");
const { notFound } = require("../utils/AppError");

const STATUSES = ["new", "read", "in_progress", "completed", "cancelled"];

// Same customer pressing "Send" twice (or the network repeating the
// request): an identical submission within this window is not saved
// again — the first one is returned instead.
const DUPLICATE_WINDOW_SECONDS = 120;

function toSample(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    postcode: row.postcode,
    address: row.address,
    selectedFabrics: row.selected_fabrics,
    fabrics: String(row.selected_fabrics || "").split(",").map((s) => s.trim()).filter(Boolean),
    notes: row.notes,
    marketingConsent: row.marketing_consent === true,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toMessage(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------
// Website (public) — create
// ---------------------------------------------------------------

async function createFabricSampleRequest(v) {
  const recent = await db.query(
    `SELECT * FROM fabric_sample_requests
      WHERE lower(email) = lower($1) AND selected_fabrics = $2 AND address = $3 AND postcode = $4
        AND created_at > NOW() - make_interval(secs => $5)
      ORDER BY id DESC LIMIT 1`,
    [v.email, v.selectedFabrics, v.address, v.postcode, DUPLICATE_WINDOW_SECONDS]
  );
  if (recent.rows[0]) return { request: toSample(recent.rows[0]), duplicate: true };

  const result = await db.query(
    `INSERT INTO fabric_sample_requests
       (name, email, phone, postcode, address, selected_fabrics, notes, marketing_consent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [v.name, v.email, v.phone, v.postcode, v.address, v.selectedFabrics, v.notes, v.marketingConsent]
  );
  return { request: toSample(result.rows[0]), duplicate: false };
}

async function createContactMessage(v) {
  const recent = await db.query(
    `SELECT * FROM contact_messages
      WHERE lower(email) = lower($1) AND subject = $2 AND message = $3
        AND created_at > NOW() - make_interval(secs => $4)
      ORDER BY id DESC LIMIT 1`,
    [v.email, v.subject, v.message, DUPLICATE_WINDOW_SECONDS]
  );
  if (recent.rows[0]) return { contactMessage: toMessage(recent.rows[0]), duplicate: true };

  const result = await db.query(
    `INSERT INTO contact_messages (name, email, phone, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [v.name, v.email, v.phone, v.subject, v.message]
  );
  return { contactMessage: toMessage(result.rows[0]), duplicate: false };
}

// ---------------------------------------------------------------
// Admin — list / one / change status
// ---------------------------------------------------------------

// Counts per status, for the summary cards (always every status).
async function statusSummary(table) {
  const result = await db.query(`SELECT status, COUNT(*)::int AS n FROM ${table} GROUP BY status`);
  const summary = { total: 0 };
  STATUSES.forEach((s) => { summary[s] = 0; });
  result.rows.forEach((r) => {
    summary[r.status] = (summary[r.status] || 0) + r.n;
    summary.total += r.n;
  });
  return summary;
}

// table and searchable columns are fixed strings from this file, never input.
async function listRows(table, searchColumns, { search, status, limit, offset }) {
  const where = [];
  const params = [];
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search.replace(/[\\%_]/g, (c) => "\\" + c)}%`);
    const n = params.length;
    const ors = searchColumns.map((col) => `${col} ILIKE $${n}`);
    if (/^\d{1,18}$/.test(search)) {
      params.push(search);
      ors.push(`id = $${params.length}::bigint`);
    }
    where.push(`(${ors.join(" OR ")})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const count = await db.query(`SELECT COUNT(*)::int AS n FROM ${table} ${whereSql}`, params);
  params.push(limit, offset);
  const rows = await db.query(
    `SELECT * FROM ${table} ${whereSql}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { total: count.rows[0].n, rows: rows.rows };
}

async function listFabricSampleRequests(filters) {
  const { total, rows } = await listRows(
    "fabric_sample_requests",
    ["name", "email", "phone", "postcode", "address", "selected_fabrics"],
    filters
  );
  return { total, requests: rows.map(toSample), summary: await statusSummary("fabric_sample_requests") };
}

async function getFabricSampleRequest(id) {
  const result = await db.query("SELECT * FROM fabric_sample_requests WHERE id = $1", [id]);
  if (!result.rows[0]) throw notFound("Fabric sample request not found.");
  return toSample(result.rows[0]);
}

async function updateFabricSampleRequestStatus(id, status) {
  const result = await db.query(
    "UPDATE fabric_sample_requests SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  if (!result.rows[0]) throw notFound("Fabric sample request not found.");
  return toSample(result.rows[0]);
}

async function listContactMessages(filters) {
  const { total, rows } = await listRows(
    "contact_messages",
    ["name", "email", "phone", "subject", "message"],
    filters
  );
  return { total, messages: rows.map(toMessage), summary: await statusSummary("contact_messages") };
}

async function getContactMessage(id) {
  const result = await db.query("SELECT * FROM contact_messages WHERE id = $1", [id]);
  if (!result.rows[0]) throw notFound("Contact message not found.");
  return toMessage(result.rows[0]);
}

async function updateContactMessageStatus(id, status) {
  const result = await db.query(
    "UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  if (!result.rows[0]) throw notFound("Contact message not found.");
  return toMessage(result.rows[0]);
}

module.exports = {
  STATUSES,
  createFabricSampleRequest,
  createContactMessage,
  listFabricSampleRequests,
  getFabricSampleRequest,
  updateFabricSampleRequestStatus,
  listContactMessages,
  getContactMessage,
  updateContactMessageStatus,
};