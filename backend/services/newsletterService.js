// Rabbora Living — newsletter subscribers (database work)
// Table: newsletter_subscribers (database/newsletter.sql).
// Parameterised SQL only. Tokens: the confirmation token is stored only as a
// SHA-256 hash; the unsubscribe token is random and used in links only.

const crypto = require("crypto");
const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");

const STATUSES = ["pending", "active", "unsubscribed"];
const CONFIRM_DAYS = 7;
const EXPORT_LIMIT = 50000;

function randomToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

function toSubscriber(row) {
  return {
    id: Number(row.id),
    email: row.email,
    status: row.status,
    source: row.source,
    consentAt: row.consent_at,
    confirmedAt: row.confirmed_at,
    unsubscribedAt: row.unsubscribed_at,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------
// Website: subscribe, confirm, unsubscribe
// ---------------------------------------------------------------

// Saves a sign-up. Returns one of:
//   { state: "pending", email, confirmToken, unsubscribeToken }  -> send the confirmation email
//   { state: "already-active" }                                   -> nothing to send
// A new address, or one that was pending or unsubscribed, gets a fresh
// confirmation link. The database unique index on lower(email) makes two
// simultaneous sign-ups for the same address save only one row.
async function subscribe(rawEmail) {
  // Normalised here too, so the database rule (email = lower(email)) holds
  // no matter which caller reaches this function.
  const email = String(rawEmail || "").trim().toLowerCase();
  const confirmToken = randomToken();
  const unsubscribeToken = randomToken();

  return withTransaction(async (client) => {
    const inserted = await client.query(
      `INSERT INTO newsletter_subscribers
         (email, status, confirm_token_hash, confirm_expires_at, unsubscribe_token)
       VALUES ($1, 'pending', $2, NOW() + make_interval(days => $3), $4)
       ON CONFLICT (lower(email)) DO NOTHING
       RETURNING id, unsubscribe_token`,
      [email, hashToken(confirmToken), CONFIRM_DAYS, unsubscribeToken]
    );
    if (inserted.rows[0]) {
      return { state: "pending", email, confirmToken, unsubscribeToken: inserted.rows[0].unsubscribe_token };
    }

    const found = await client.query(
      "SELECT id, status, unsubscribe_token FROM newsletter_subscribers WHERE lower(email) = $1 FOR UPDATE",
      [email]
    );
    const row = found.rows[0];
    if (!row) throw new Error("newsletter subscriber row not found after conflict");
    if (row.status === "active") return { state: "already-active" };

    await client.query(
      `UPDATE newsletter_subscribers
          SET status = 'pending',
              confirm_token_hash = $2,
              confirm_expires_at = NOW() + make_interval(days => $3),
              consent_at = NOW(),
              unsubscribed_at = NULL,
              updated_at = NOW()
        WHERE id = $1`,
      [row.id, hashToken(confirmToken), CONFIRM_DAYS]
    );
    return { state: "pending", email, confirmToken, unsubscribeToken: row.unsubscribe_token };
  });
}

// Confirms a sign-up from the emailed link. Returns { ok: true } only when
// the link matches a pending, unexpired confirmation. The link works once.
async function confirm(token) {
  const result = await db.query(
    `UPDATE newsletter_subscribers
        SET status = 'active',
            confirmed_at = NOW(),
            confirm_token_hash = NULL,
            confirm_expires_at = NULL,
            updated_at = NOW()
      WHERE confirm_token_hash = $1
        AND confirm_expires_at > NOW()
        AND status = 'pending'
      RETURNING id`,
    [hashToken(token)]
  );
  return { ok: result.rowCount > 0 };
}

// Unsubscribes using the token from a marketing email. Idempotent: an
// address that is already unsubscribed is reported as success.
async function unsubscribeByToken(token) {
  const found = await db.query(
    "SELECT id, status FROM newsletter_subscribers WHERE unsubscribe_token = $1",
    [token]
  );
  const row = found.rows[0];
  if (!row) return { ok: false };
  if (row.status === "unsubscribed") return { ok: true, alreadyUnsubscribed: true };

  await db.query(
    `UPDATE newsletter_subscribers
        SET status = 'unsubscribed',
            unsubscribed_at = NOW(),
            confirm_token_hash = NULL,
            confirm_expires_at = NULL,
            updated_at = NOW()
      WHERE id = $1`,
    [row.id]
  );
  return { ok: true, alreadyUnsubscribed: false };
}

// ---------------------------------------------------------------
// Admin: list, search, counts, unsubscribe, CSV rows
// ---------------------------------------------------------------

function filtersSql(f) {
  const params = [];
  const where = [];
  if (f.status !== "all") {
    params.push(f.status);
    where.push(`status = $${params.length}`);
  }
  if (f.search) {
    // strpos() searches the text as typed: no wildcard characters to escape.
    params.push(f.search.toLowerCase());
    where.push(`strpos(lower(email), $${params.length}) > 0`);
  }
  return { clause: where.length ? "WHERE " + where.join(" AND ") : "", params };
}

async function listSubscribers(f) {
  const { clause, params } = filtersSql(f);
  const counts = await db.query(
    "SELECT status, COUNT(*)::int AS n FROM newsletter_subscribers GROUP BY status"
  );
  const byStatus = { pending: 0, active: 0, unsubscribed: 0 };
  counts.rows.forEach((r) => { byStatus[r.status] = r.n; });
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  const countResult = await db.query(`SELECT COUNT(*)::int AS n FROM newsletter_subscribers ${clause}`, params);
  const rows = await db.query(
    `SELECT * FROM newsletter_subscribers ${clause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, f.limit, (f.page - 1) * f.limit]
  );
  return {
    subscribers: rows.rows.map(toSubscriber),
    total: countResult.rows[0].n,
    summary: { total, ...byStatus },
  };
}

async function getSubscriber(id) {
  const result = await db.query("SELECT * FROM newsletter_subscribers WHERE id = $1", [id]);
  return result.rows[0] ? toSubscriber(result.rows[0]) : null;
}

// Admin manual unsubscribe. Reactivating is NOT offered: only the customer
// can subscribe again, through their own confirmation email.
async function adminUnsubscribe(id) {
  const result = await db.query(
    `UPDATE newsletter_subscribers
        SET status = 'unsubscribed',
            unsubscribed_at = COALESCE(unsubscribed_at, NOW()),
            confirm_token_hash = NULL,
            confirm_expires_at = NULL,
            updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
    [id]
  );
  return result.rows[0] ? toSubscriber(result.rows[0]) : null;
}

async function exportRows(f) {
  const { clause, params } = filtersSql(f);
  const rows = await db.query(
    `SELECT * FROM newsletter_subscribers ${clause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length + 1}`,
    [...params, EXPORT_LIMIT]
  );
  return rows.rows.map(toSubscriber);
}

module.exports = {
  STATUSES,
  EXPORT_LIMIT,
  subscribe,
  confirm,
  unsubscribeByToken,
  listSubscribers,
  getSubscriber,
  adminUnsubscribe,
  exportRows,
  hashToken,
};