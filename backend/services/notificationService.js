// Rabbora Living — admin notifications (database work only).
// Table names: notifications, notification_reads, notification_preferences
// (database/notifications.sql). Parameterised SQL only.
//
// Writing: notifyEvent() is called by the business code AFTER the database
// operation has succeeded. It never throws, so a notification problem can't
// undo or break the order, message, review or sign-up that triggered it.
//
// Reading: every function takes the admin's user id. Read status is per admin.

const db = require("../config/db");

const EVENT_TYPES = [
  "new_order",
  "new_contact_message",
  "new_fabric_sample_request",
  "new_newsletter_subscriber",
  "new_customer_registration",
  "new_product_review",
];

const EVENT_TITLES = {
  new_order: "New order",
  new_contact_message: "New contact message",
  new_fabric_sample_request: "New fabric sample request",
  new_newsletter_subscriber: "New newsletter subscriber",
  new_customer_registration: "New customer registration",
  new_product_review: "New product review",
};

// Admin page for each event (relative to /admin/, same as the sidebar links).
const EVENT_PAGES = {
  new_order: "orders.html",
  new_contact_message: "contact-messages.html",
  new_fabric_sample_request: "fabric-sample-requests.html",
  new_newsletter_subscriber: "newsletter-subscribers.html",
  new_customer_registration: "customers.html",
  new_product_review: "reviews.html",
};

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

function shortText(value, max) {
  return String(value == null ? "" : value).replace(/\s+/g, " ").trim().slice(0, max);
}

function toItem(row) {
  return {
    id: Number(row.id),
    eventType: row.event_type,
    title: row.title,
    message: row.message,
    recordId: row.record_id == null ? null : Number(row.record_id),
    destinationUrl: row.destination_url,
    createdAt: row.created_at,
    read: row.is_read === true,
  };
}

// ---------------------------------------------------------------
// Writing
// ---------------------------------------------------------------

// Stores one event. Returns the new id, or null when the same event was
// already stored (dedupe_key is unique).
async function createNotification({ eventType, message, recordId, dedupeKey }) {
  if (!EVENT_TYPES.includes(eventType)) throw new Error("Unknown notification type: " + eventType);
  const page = EVENT_PAGES[eventType];
  const destination = recordId ? `${page}?open=${encodeURIComponent(recordId)}` : page;
  const result = await db.query(
    `INSERT INTO notifications (event_type, title, message, record_id, destination_url, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (dedupe_key) DO NOTHING
     RETURNING id`,
    [eventType, EVENT_TITLES[eventType], shortText(message, 500), recordId || null, destination.slice(0, 300), String(dedupeKey).slice(0, 120)]
  );
  return result.rows[0] ? Number(result.rows[0].id) : null;
}

// Safe wrapper for the business code: records the event, logs a problem,
// and returns null. It never throws.
async function notifyEvent(args) {
  try {
    return await createNotification(args);
  } catch (err) {
    // Log the type and database code only (never customer details).
    // err.message is not logged: database messages can include customer values.
    console.error("[notifications] could not record", args && args.eventType, err.code || "unknown-error");
    return null;
  }
}

// ---------------------------------------------------------------
// Reading (admin only; the route checks requireAdmin first)
// ---------------------------------------------------------------

// Newest first. Pass beforeId to load older items (cursor pagination).
async function listForAdmin(userId, { limit, beforeId }) {
  const size = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const params = [userId, size + 1];
  let where = "";
  if (beforeId) {
    params.push(beforeId);
    where = `WHERE n.id < $${params.length}`;
  }
  const rows = await db.query(
    `SELECT n.id, n.event_type, n.title, n.message, n.record_id, n.destination_url, n.created_at,
            (r.user_id IS NOT NULL) AS is_read
       FROM notifications n
       LEFT JOIN notification_reads r ON r.notification_id = n.id AND r.user_id = $1
       ${where}
      ORDER BY n.id DESC
      LIMIT $2`,
    params
  );
  const hasMore = rows.rows.length > size;
  const items = rows.rows.slice(0, size).map(toItem);
  return {
    items,
    hasMore,
    nextBeforeId: hasMore && items.length ? items[items.length - 1].id : null,
    unreadCount: await unreadCount(userId),
  };
}

async function unreadCount(userId) {
  const result = await db.query(
    `SELECT COUNT(*)::int AS n
       FROM notifications n
      WHERE NOT EXISTS (
        SELECT 1 FROM notification_reads r
         WHERE r.notification_id = n.id AND r.user_id = $1
      )`,
    [userId]
  );
  return result.rows[0].n;
}

// Items newer than afterId (oldest first), so the browser can announce them
// in order. latestId is the newest id that exists, for the browser's cursor.
async function poll(userId, afterId) {
  const rows = await db.query(
    `SELECT n.id, n.event_type, n.title, n.message, n.record_id, n.destination_url, n.created_at,
            (r.user_id IS NOT NULL) AS is_read
       FROM notifications n
       LEFT JOIN notification_reads r ON r.notification_id = n.id AND r.user_id = $1
      WHERE n.id > $2
      ORDER BY n.id ASC
      LIMIT $3`,
    [userId, afterId, MAX_LIMIT]
  );
  const latest = await db.query("SELECT COALESCE(MAX(id), 0)::bigint AS latest FROM notifications");
  return {
    items: rows.rows.map(toItem),
    latestId: Number(latest.rows[0].latest),
    unreadCount: await unreadCount(userId),
  };
}

// Marks one notification read for this admin. found=false when it doesn't exist.
async function markRead(userId, notificationId) {
  const exists = await db.query("SELECT 1 FROM notifications WHERE id = $1", [notificationId]);
  if (!exists.rows[0]) return { found: false };
  await db.query(
    `INSERT INTO notification_reads (notification_id, user_id) VALUES ($1, $2)
     ON CONFLICT (notification_id, user_id) DO NOTHING`,
    [notificationId, userId]
  );
  return { found: true, unreadCount: await unreadCount(userId) };
}

// Marks every notification read for this admin. Returns how many changed.
async function markAllRead(userId) {
  const result = await db.query(
    `INSERT INTO notification_reads (notification_id, user_id)
     SELECT n.id, $1 FROM notifications n
      WHERE NOT EXISTS (
        SELECT 1 FROM notification_reads r
         WHERE r.notification_id = n.id AND r.user_id = $1
      )
     ON CONFLICT (notification_id, user_id) DO NOTHING`,
    [userId]
  );
  return { marked: result.rowCount, unreadCount: await unreadCount(userId) };
}

// ---------------------------------------------------------------
// Preferences (per admin)
// ---------------------------------------------------------------

const DEFAULT_PREFERENCES = { soundEnabled: true, desktopEnabled: false };

async function getPreferences(userId) {
  const result = await db.query(
    "SELECT sound_enabled, desktop_enabled FROM notification_preferences WHERE user_id = $1",
    [userId]
  );
  const row = result.rows[0];
  if (!row) return { ...DEFAULT_PREFERENCES };
  return { soundEnabled: row.sound_enabled === true, desktopEnabled: row.desktop_enabled === true };
}

async function setPreferences(userId, { soundEnabled, desktopEnabled }) {
  const result = await db.query(
    `INSERT INTO notification_preferences (user_id, sound_enabled, desktop_enabled, updated_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id) DO UPDATE
       SET sound_enabled = EXCLUDED.sound_enabled,
           desktop_enabled = EXCLUDED.desktop_enabled,
           updated_at = CURRENT_TIMESTAMP
     RETURNING sound_enabled, desktop_enabled`,
    [userId, soundEnabled, desktopEnabled]
  );
  return { soundEnabled: result.rows[0].sound_enabled, desktopEnabled: result.rows[0].desktop_enabled };
}

module.exports = {
  EVENT_TYPES,
  EVENT_TITLES,
  EVENT_PAGES,
  DEFAULT_PREFERENCES,
  MAX_LIMIT,
  createNotification,
  notifyEvent,
  listForAdmin,
  unreadCount,
  poll,
  markRead,
  markAllRead,
  getPreferences,
  setPreferences,
};