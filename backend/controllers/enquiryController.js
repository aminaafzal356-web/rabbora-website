// Rabbora Living — Fabric Sample Requests + Contact Messages (requests)
//   Website:  POST /api/fabric-samples, POST /api/contact
//   Admin:    GET/PATCH /api/admin/fabric-sample-requests[/:id]
//             GET/PATCH /api/admin/contact-messages[/:id]
// Every field is checked here before anything reaches the database.
// The website only shows "thank you" after the row is saved (201/200).

const enquiryService = require("../services/enquiryService");
const { parseId, pagination, isPlainObject, EMAIL_PATTERN } = require("../utils/validate");
const { validationError, notFound } = require("../utils/AppError");

const PHONE_ALLOWED = /^\+?[0-9 ()-]+$/;
const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
const MAX_FABRICS = 4;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Collapses runs of spaces/tabs in single-line fields; keeps line breaks
// in long text (notes, message) but drops control characters.
function oneLine(value) {
  return text(value).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ");
}
function multiLine(value) {
  return text(value).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "");
}

function checkName(errors, value) {
  const name = oneLine(value);
  if (!name) errors.push({ field: "name", message: "Please enter your full name." });
  else if (name.length > 100) errors.push({ field: "name", message: "Name must be 100 characters or fewer." });
  return name;
}

function checkEmail(errors, value) {
  const email = text(value).toLowerCase();
  if (!email) errors.push({ field: "email", message: "Please enter your email address." });
  else if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.push({ field: "email", message: "Please enter a valid email address." });
  return email;
}

function checkPhone(errors, value, required) {
  const phone = oneLine(value);
  if (!phone) {
    if (required) errors.push({ field: "phone", message: "Please enter your phone number." });
    return null;
  }
  const digits = phone.replace(/[^0-9]/g, "").length;
  if (phone.length > 20 || !PHONE_ALLOWED.test(phone) || digits < 10 || digits > 15) {
    errors.push({ field: "phone", message: "Please enter a valid phone number." });
  }
  return phone;
}

// Fabrics arrive as an array ["Naples Silver", ...] or a comma-separated
// string. 1 to 4 different names, each at most 80 characters.
function checkFabrics(errors, value) {
  let list = [];
  if (Array.isArray(value)) list = value;
  else if (typeof value === "string") list = value.split(",");
  list = list.map((f) => (typeof f === "string" ? oneLine(f) : "")).filter(Boolean);
  const unique = [];
  list.forEach((f) => {
    if (!unique.some((u) => u.toLowerCase() === f.toLowerCase())) unique.push(f);
  });

  if (unique.length === 0) errors.push({ field: "selectedFabrics", message: "Please select at least one fabric sample." });
  else if (unique.length > MAX_FABRICS) errors.push({ field: "selectedFabrics", message: `You can choose up to ${MAX_FABRICS} fabric samples.` });
  else if (unique.some((f) => f.length > 80 || f.includes(","))) errors.push({ field: "selectedFabrics", message: "One of the selected fabrics is not valid." });
  return unique.join(", ");
}

function body(req) {
  return isPlainObject(req.body) ? req.body : {};
}

// ---------------------------------------------------------------
// Website
// ---------------------------------------------------------------

// POST /api/fabric-samples
async function createFabricSampleRequest(req, res) {
  const b = body(req);
  const errors = [];

  const name = checkName(errors, b.name);
  const email = checkEmail(errors, b.email);
  const phone = checkPhone(errors, b.phone, true);

  const postcode = oneLine(b.postcode).toUpperCase();
  if (!postcode) errors.push({ field: "postcode", message: "Please enter your postcode." });
  else if (postcode.length > 10 || !UK_POSTCODE.test(postcode)) errors.push({ field: "postcode", message: "Please enter a valid UK postcode." });

  const address = oneLine(b.address);
  if (!address) errors.push({ field: "address", message: "Please enter your address." });
  else if (address.length > 500) errors.push({ field: "address", message: "Address must be 500 characters or fewer." });

  const selectedFabrics = checkFabrics(errors, b.selectedFabrics !== undefined ? b.selectedFabrics : b.samples);

  const notes = multiLine(b.notes);
  if (notes.length > 2000) errors.push({ field: "notes", message: "Notes must be 2000 characters or fewer." });

  const consentRaw = b.marketingConsent;
  if (consentRaw !== undefined && typeof consentRaw !== "boolean") {
    errors.push({ field: "marketingConsent", message: "Marketing consent must be true or false." });
  }

  if (errors.length) throw validationError(errors);

  const { request, duplicate } = await enquiryService.createFabricSampleRequest({
    name, email, phone, postcode, address, selectedFabrics,
    notes: notes || null,
    marketingConsent: consentRaw === true,
  });

  // Only the reference number goes back — not the stored details.
  res.status(duplicate ? 200 : 201).json({
    success: true,
    message: "Thank you — your free sample request has been received.",
    requestId: request.id,
  });
}

// POST /api/contact
async function createContactMessage(req, res) {
  const b = body(req);
  const errors = [];

  const name = checkName(errors, b.name);
  const email = checkEmail(errors, b.email);
  const phone = checkPhone(errors, b.phone, false);

  const subject = oneLine(b.subject);
  if (!subject) errors.push({ field: "subject", message: "Please enter a subject." });
  else if (subject.length > 200) errors.push({ field: "subject", message: "Subject must be 200 characters or fewer." });

  const message = multiLine(b.message);
  if (!message) errors.push({ field: "message", message: "Please enter your message." });
  else if (message.length > 5000) errors.push({ field: "message", message: "Message must be 5000 characters or fewer." });

  if (errors.length) throw validationError(errors);

  const { contactMessage, duplicate } = await enquiryService.createContactMessage({ name, email, phone, subject, message });

  res.status(duplicate ? 200 : 201).json({
    success: true,
    message: "Thank you — your message has been sent. We'll get back to you soon.",
    messageId: contactMessage.id,
  });
}

// ---------------------------------------------------------------
// Admin (router.use(requireAdmin) in routes/admin.js)
// ---------------------------------------------------------------

function listFilters(query) {
  const { limit, offset, page } = pagination(query, 25, 100);
  const status = enquiryService.STATUSES.includes(query.status) ? query.status : null;
  const search = typeof query.search === "string" && query.search.trim() ? query.search.trim().slice(0, 100) : null;
  return { limit, offset, page, status, search };
}

function statusFromBody(req) {
  const status = body(req).status;
  if (!enquiryService.STATUSES.includes(status)) {
    throw validationError([{ field: "status", message: `Status must be one of: ${enquiryService.STATUSES.join(", ")}.` }]);
  }
  return status;
}

// GET /api/admin/fabric-sample-requests?search=&status=&page=&limit=
async function adminListFabricSampleRequests(req, res) {
  const f = listFilters(req.query);
  const result = await enquiryService.listFabricSampleRequests(f);
  res.status(200).json({ success: true, page: f.page, limit: f.limit, ...result });
}

// GET /api/admin/fabric-sample-requests/:id
async function adminGetFabricSampleRequest(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Fabric sample request not found.");
  res.status(200).json({ success: true, request: await enquiryService.getFabricSampleRequest(id) });
}

// PATCH /api/admin/fabric-sample-requests/:id { status }
async function adminUpdateFabricSampleRequest(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Fabric sample request not found.");
  const request = await enquiryService.updateFabricSampleRequestStatus(id, statusFromBody(req));
  res.status(200).json({ success: true, message: "Status updated.", request });
}

// GET /api/admin/contact-messages?search=&status=&page=&limit=
async function adminListContactMessages(req, res) {
  const f = listFilters(req.query);
  const result = await enquiryService.listContactMessages(f);
  res.status(200).json({ success: true, page: f.page, limit: f.limit, ...result });
}

// GET /api/admin/contact-messages/:id
async function adminGetContactMessage(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Contact message not found.");
  res.status(200).json({ success: true, contactMessage: await enquiryService.getContactMessage(id) });
}

// PATCH /api/admin/contact-messages/:id { status }
async function adminUpdateContactMessage(req, res) {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Contact message not found.");
  const contactMessage = await enquiryService.updateContactMessageStatus(id, statusFromBody(req));
  res.status(200).json({ success: true, message: "Status updated.", contactMessage });
}

module.exports = {
  createFabricSampleRequest,
  createContactMessage,
  adminListFabricSampleRequests,
  adminGetFabricSampleRequest,
  adminUpdateFabricSampleRequest,
  adminListContactMessages,
  adminGetContactMessage,
  adminUpdateContactMessage,
};