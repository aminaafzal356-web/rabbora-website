// Rabbora Living — central error handling.
// Every error leaves the API in the same shape:
//   { success: false, code: "...", message: "...", errors?: [{ field, message }] }
// Database details (table names, constraint names, SQL) are logged on
// the server only and never sent to the customer.

const { AppError } = require("../utils/AppError");

// JSON 404 for unknown /api routes (same message as before).
function apiNotFound(req, res) {
  res.status(404).json({ success: false, code: "NOT_FOUND", message: "API route not found" });
}

// PostgreSQL error codes -> safe customer messages.
function fromDatabaseError(err) {
  switch (err.code) {
    case "23505": // unique_violation
      return new AppError(409, "DUPLICATE", "This already exists.");
    case "23503": // foreign_key_violation
      return new AppError(400, "INVALID_REFERENCE", "A linked item does not exist.");
    case "23514": // check_violation
    case "23502": // not_null_violation
    case "22P02": // invalid_text_representation
    case "22003": // numeric_value_out_of_range
    case "22001": // string_data_right_truncation
      return new AppError(400, "INVALID_REQUEST", "Some of the data sent is not valid.");
    default:
      return null;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Malformed JSON in a request body.
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, code: "INVALID_JSON", message: "Invalid JSON in request body" });
  }
  // Body larger than the express.json() limit.
  if (err && err.type === "entity.too.large") {
    return res.status(413).json({ success: false, code: "PAYLOAD_TOO_LARGE", message: "Request body is too large." });
  }

  let appErr = err instanceof AppError ? err : null;
  if (!appErr && err && typeof err.code === "string" && /^[0-9A-Z]{5}$/.test(err.code)) {
    appErr = fromDatabaseError(err);
    // Logged for the developer; the customer only sees the safe message.
    console.error("[db]", err.code, err.message);
  }

  if (appErr) {
    const body = { success: false, code: appErr.code, message: appErr.message };
    if (appErr.errors) body.errors = appErr.errors;
    return res.status(appErr.status).json(body);
  }

  // Anything unexpected: log code + message only (never request bodies
  // or session contents) and answer with a generic 500.
  console.error("[server] Unhandled error:", (err && err.code) || "", err && err.message);
  return res.status(500).json({ success: false, code: "SERVER_ERROR", message: "Internal server error" });
}

module.exports = { apiNotFound, errorHandler };