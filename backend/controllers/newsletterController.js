// Rabbora Living — newsletter subscription (requests)
//   Website:  POST /api/newsletter/subscribe    { email }
//             POST /api/newsletter/confirm      { token }
//             POST /api/newsletter/unsubscribe  { token }
//   Admin:    GET   /api/admin/newsletter-subscribers              list, search, counts
//             GET   /api/admin/newsletter-subscribers/export.csv   CSV download
//             GET   /api/admin/newsletter-subscribers/:id          one subscriber
//             PATCH /api/admin/newsletter-subscribers/:id          { status: "unsubscribed" }
// Every field is checked here before anything reaches the database.

const newsletterService = require("../services/newsletterService");
const { sendConfirmationEmail } = require("../services/newsletterEmail");
const { parseId, pagination, isPlainObject, EMAIL_PATTERN } = require("../utils/validate");
const { validationError, notFound } = require("../utils/AppError");

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,100}$/;

function body(req) {
  return isPlainObject(req.body) ? req.body : {};
}

function invalidToken(res, message) {
  return res.status(400).json({ success: false, code: "INVALID_TOKEN", message });
}

// ---------------------------------------------------------------
// Website
// ---------------------------------------------------------------

// POST /api/newsletter/subscribe
//   201  saved, confirmation email sent — "check your inbox"
//   202  saved, but the confirmation email could not be sent (SMTP not set up
//        or unavailable) — the customer is told the truth, nothing is faked
//   200  already subscribed — nothing to do
//   400  VALIDATION_ERROR with errors: [{ field, message }]
async function subscribe(req, res) {
  const raw = body(req).email;
  const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  const errors = [];
  if (!email) errors.push({ field: "email", message: "Please enter your email address." });
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.push({ field: "email", message: "Please enter a valid email address." });
  if (errors.length) throw validationError(errors);

  const result = await newsletterService.subscribe(email);

  if (result.state === "already-active") {
    return res.status(200).json({
      success: true,
      status: "already-active",
      confirmationEmailSent: false,
      message: "You are already subscribed to Rabbora Living news.",
    });
  }

  const sent = await sendConfirmationEmail({
    email: result.email,
    confirmToken: result.confirmToken,
    unsubscribeToken: result.unsubscribeToken,
  });

  if (sent.sent) {
    return res.status(201).json({
      success: true,
      status: "pending",
      confirmationEmailSent: true,
      message: "Thank you. Please check your inbox and click the link to confirm your subscription.",
    });
  }
  return res.status(202).json({
    success: true,
    status: "pending",
    confirmationEmailSent: false,
    message: "Thank you. We have saved your email, but we could not send the confirmation email just now. Please try again in a few minutes.",
  });
}

// POST /api/newsletter/confirm { token }
async function confirm(req, res) {
  const token = body(req).token;
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token)) {
    return invalidToken(res, "This confirmation link is not valid. Please subscribe again from the homepage.");
  }
  const result = await newsletterService.confirm(token);
  if (!result.ok) {
    return invalidToken(res, "This confirmation link is invalid or has expired. Please subscribe again from the homepage.");
  }
  return res.status(200).json({ success: true, status: "active", message: "Thank you. Your subscription is confirmed." });
}

// POST /api/newsletter/unsubscribe { token }
async function unsubscribe(req, res) {
  const token = body(req).token;
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token)) {
    return invalidToken(res, "This unsubscribe link is not valid.");
  }
  const result = await newsletterService.unsubscribeByToken(token);
  if (!result.ok) return invalidToken(res, "This unsubscribe link is not valid.");
  return res.status(200).json({
    success: true,
    status: "unsubscribed",
    message: result.alreadyUnsubscribed
      ? "You have already been unsubscribed from Rabbora Living emails."
      : "You have been unsubscribed from Rabbora Living emails.",
  });
}

// ---------------------------------------------------------------
// Admin
// ---------------------------------------------------------------

const STATUS_FILTERS = ["all", ...newsletterService.STATUSES];

function listFilters(query) {
  const { limit, page } = pagination(query, 25, 100);
  const status = STATUS_FILTERS.includes(query.status) ? query.status : "all";
  const search = typeof query.search === "string" && query.search.trim() ? query.search.trim().slice(0, 100) : null;
  return { limit, page, status, search: search ? search.toLowerCase() : null };
}

// GET /api/admin/newsletter-subscribers?status=&search=&page=&limit=
async function adminList(req, res) {
  const f = listFilters(req.query);
  const result = await newsletterService.listSubscribers(f);
  res.status(200).json({ success: true, page: f.page, limit: f.limit, ...result });
}

// GET /api/admin/newsletter-subscribers/:id
async function adminGet(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Subscriber not found.");
  const subscriber = await newsletterService.getSubscriber(id);
  if (!subscriber) throw notFound("Subscriber not found.");
  res.status(200).json({ success: true, subscriber });
}

// PATCH /api/admin/newsletter-subscribers/:id { status: "unsubscribed" }
async function adminUpdate(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Subscriber not found.");
  const status = body(req).status;
  if (status !== "unsubscribed") {
    throw validationError([{
      field: "status",
      message: "Admins can only unsubscribe a subscriber. A customer subscribes again only by confirming their own email.",
    }]);
  }
  const subscriber = await newsletterService.adminUnsubscribe(id);
  if (!subscriber) throw notFound("Subscriber not found.");
  res.status(200).json({ success: true, message: "Subscriber unsubscribed.", subscriber });
}

// Spreadsheet programs run text starting with = + - @ as a formula.
// Such cells are prefixed with an apostrophe so they stay plain text.
function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  if (/[",\r\n]/.test(text)) text = '"' + text.replace(/"/g, '""') + '"';
  return text;
}

function isoOrEmpty(value) {
  return value ? new Date(value).toISOString() : "";
}

// GET /api/admin/newsletter-subscribers/export.csv?status=&search=
// Same filters as the list. Tokens are never exported.
async function adminExportCsv(req, res) {
  const f = listFilters(req.query);
  const rows = await newsletterService.exportRows(f);
  const header = ["email", "status", "source", "subscribed_at", "confirmed_at", "unsubscribed_at"];
  const lines = [header.join(",")];
  rows.forEach((r) => {
    lines.push([
      csvCell(r.email),
      csvCell(r.status),
      csvCell(r.source),
      csvCell(isoOrEmpty(r.consentAt)),
      csvCell(isoOrEmpty(r.confirmedAt)),
      csvCell(isoOrEmpty(r.unsubscribedAt)),
    ].join(","));
  });
  const stamp = new Date().toISOString().slice(0, 10);
  res.set("Content-Type", "text/csv; charset=utf-8");
  res.set("Content-Disposition", `attachment; filename="rabbora-newsletter-subscribers-${stamp}.csv"`);
  res.set("Cache-Control", "no-store");
  res.status(200).send("﻿" + lines.join("\r\n") + "\r\n");
}

module.exports = {
  subscribe,
  confirm,
  unsubscribe,
  adminList,
  adminGet,
  adminUpdate,
  adminExportCsv,
};