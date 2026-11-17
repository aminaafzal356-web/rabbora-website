// Rabbora Living — admin notification API (mounted under /api/admin by routes/admin.js,
// which already runs requireAdmin for every route in that file).
//
//   GET  /api/admin/notifications                 recent items + unread count (?limit=&before=)
//   GET  /api/admin/notifications/poll            items newer than ?after= + unread count
//   POST /api/admin/notifications/read-all        mark every item read for this admin
//   POST /api/admin/notifications/:id/read        mark one item read for this admin
//   GET  /api/admin/notification-preferences      { soundEnabled, desktopEnabled }
//   PUT  /api/admin/notification-preferences      { soundEnabled, desktopEnabled }

const notificationService = require("../services/notificationService");
const { parseId } = require("../utils/validate");
const { badRequest, notFound } = require("../utils/AppError");

// Non-negative integer from a query string; anything else is a 400.
function cursorParam(value, name) {
  if (value === undefined || value === "") return 0;
  if (typeof value !== "string" || !/^\d{1,15}$/.test(value)) {
    throw badRequest(`${name} must be a whole number.`);
  }
  return Number(value);
}

async function list(req, res) {
  const limit = req.query.limit === undefined ? undefined : cursorParam(req.query.limit, "limit");
  const beforeId = cursorParam(req.query.before, "before");
  const result = await notificationService.listForAdmin(req.user.id, { limit, beforeId });
  res.set("Cache-Control", "no-store");
  res.json({ success: true, ...result });
}

async function poll(req, res) {
  const afterId = cursorParam(req.query.after, "after");
  const result = await notificationService.poll(req.user.id, afterId);
  res.set("Cache-Control", "no-store");
  res.json({ success: true, ...result });
}

async function markRead(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Notification not found.");
  const result = await notificationService.markRead(req.user.id, id);
  if (!result.found) throw notFound("Notification not found.");
  res.json({ success: true, unreadCount: result.unreadCount });
}

async function markAllRead(req, res) {
  const result = await notificationService.markAllRead(req.user.id);
  res.json({ success: true, marked: result.marked, unreadCount: result.unreadCount });
}

async function getPreferences(req, res) {
  const preferences = await notificationService.getPreferences(req.user.id);
  res.set("Cache-Control", "no-store");
  res.json({ success: true, preferences });
}

async function updatePreferences(req, res) {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (typeof body.soundEnabled !== "boolean" || typeof body.desktopEnabled !== "boolean") {
    throw badRequest("soundEnabled and desktopEnabled must be true or false.");
  }
  const preferences = await notificationService.setPreferences(req.user.id, {
    soundEnabled: body.soundEnabled,
    desktopEnabled: body.desktopEnabled,
  });
  res.json({ success: true, preferences });
}

module.exports = { list, poll, markRead, markAllRead, getPreferences, updatePreferences };