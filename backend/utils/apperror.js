// Rabbora Living — one error type for every expected API error.
// Controllers/services throw an AppError; middleware/errorHandler.js
// turns it into the same JSON shape every time:
//   { success: false, code: "NOT_FOUND", message: "...", errors?: [...] }

class AppError extends Error {
  constructor(status, code, message, errors) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    if (errors && errors.length) this.errors = errors;
  }
}

// Short helpers so the code reads clearly, e.g. throw notFound("Product not found.")
const badRequest = (message, errors) => new AppError(400, "INVALID_REQUEST", message || "Invalid request.", errors);
const validationError = (errors) =>
  new AppError(400, "VALIDATION_ERROR", "Please check the highlighted fields.", errors);
const unauthorized = (message) => new AppError(401, "UNAUTHORIZED", message || "Please log in.");
const forbidden = (message) => new AppError(403, "FORBIDDEN", message || "You do not have permission to do this.");
const notFound = (message) => new AppError(404, "NOT_FOUND", message || "Not found.");
const conflict = (code, message) => new AppError(409, code, message);

module.exports = { AppError, badRequest, validationError, unauthorized, forbidden, notFound, conflict };