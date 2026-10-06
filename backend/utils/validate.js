// Rabbora Living — small request validators (no extra npm package).
// Each check adds { field, message } to an errors list; the caller
// throws validationError(errors) when the list is not empty. Values are
// returned cleaned (trimmed text, numbers as numbers).

const { MAX_PENCE, toPence } = require("./pricing");
const { validationError } = require("./AppError");

const MAX_INT = 2147483647; // PostgreSQL INTEGER
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PHONE_ALLOWED = /^\+?[0-9 ()-]+$/;
// Loose UK postcode check (e.g. "SW1A 1AA", "M1 1AE").
const UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

class Checker {
  constructor(body) {
    this.body = isPlainObject(body) ? body : {};
    this.errors = [];
    this.out = {};
  }

  has(field) {
    return this.body[field] !== undefined;
  }

  fail(field, message) {
    this.errors.push({ field, message });
    return this;
  }

  // Text. opts: { required, min, max, pattern, patternMessage, lower, upper }
  text(field, opts = {}) {
    const raw = this.body[field];
    if (raw === undefined || raw === null || (typeof raw === "string" && raw.trim() === "")) {
      if (opts.required) this.fail(field, `${field} is required.`);
      else if (raw === null || (typeof raw === "string" && raw.trim() === "")) this.out[field] = null;
      return this;
    }
    if (typeof raw !== "string") return this.fail(field, `${field} must be text.`);
    let value = raw.trim();
    if (opts.lower) value = value.toLowerCase();
    if (opts.upper) value = value.toUpperCase();
    if (opts.min && value.length < opts.min) return this.fail(field, `${field} must be at least ${opts.min} characters.`);
    if (opts.max && value.length > opts.max) return this.fail(field, `${field} must be at most ${opts.max} characters.`);
    if (opts.pattern && !opts.pattern.test(value)) return this.fail(field, opts.patternMessage || `${field} is not valid.`);
    this.out[field] = value;
    return this;
  }

  slug(field, opts = {}) {
    return this.text(field, { ...opts, lower: true, max: opts.max || 255, pattern: SLUG_PATTERN,
      patternMessage: `${field} may only contain lowercase letters, numbers and single hyphens.` });
  }

  email(field, opts = {}) {
    return this.text(field, { ...opts, lower: true, max: 254, pattern: EMAIL_PATTERN,
      patternMessage: "Please enter a valid email address." });
  }

  // Same phone rules as the users table / registration.
  phone(field, opts = {}) {
    this.text(field, { ...opts, max: 20, pattern: PHONE_ALLOWED, patternMessage: "Please enter a valid phone number." });
    const value = this.out[field];
    if (typeof value === "string") {
      const digits = value.replace(/[^0-9]/g, "").length;
      if (digits < 10 || digits > 15) this.fail(field, "Phone number must have 10 to 15 digits.");
    }
    return this;
  }

  postcode(field, opts = {}) {
    this.text(field, { ...opts, upper: true, max: 10, pattern: UK_POSTCODE, patternMessage: "Please enter a valid UK postcode." });
    return this;
  }

  // Integer. opts: { required, min, max }
  int(field, opts = {}) {
    const raw = this.body[field];
    if (raw === undefined || raw === null || raw === "") {
      if (opts.required) this.fail(field, `${field} is required.`);
      else if (raw === null) this.out[field] = null;
      return this;
    }
    const n = typeof raw === "string" && /^-?\d+$/.test(raw.trim()) ? Number(raw) : raw;
    const min = opts.min === undefined ? 0 : opts.min;
    const max = opts.max === undefined ? MAX_INT : opts.max;
    if (!Number.isInteger(n) || n < min || n > max) return this.fail(field, `${field} must be a whole number from ${min} to ${max}.`);
    this.out[field] = n;
    return this;
  }

  id(field, opts = {}) {
    return this.int(field, { ...opts, min: 1 });
  }

  bool(field, opts = {}) {
    const raw = this.body[field];
    if (raw === undefined || raw === null) {
      if (opts.required) this.fail(field, `${field} is required.`);
      return this;
    }
    if (typeof raw !== "boolean") return this.fail(field, `${field} must be true or false.`);
    this.out[field] = raw;
    return this;
  }

  // GBP amount with at most 2 decimals. opts: { required, allowZero, nullable }
  money(field, opts = {}) {
    const raw = this.body[field];
    if (raw === undefined || raw === "" || (raw === null && !opts.nullable)) {
      if (opts.required) this.fail(field, `${field} is required.`);
      return this;
    }
    if (raw === null) {
      this.out[field] = null;
      return this;
    }
    const n = typeof raw === "string" ? Number(raw.trim()) : raw;
    const pence = toPence(n);
    if (typeof n !== "number" || !Number.isFinite(n) || pence === null || Math.abs(n * 100 - pence) > 1e-6) {
      return this.fail(field, `${field} must be an amount in pounds with at most 2 decimals.`);
    }
    if (pence < 0 || (!opts.allowZero && pence === 0)) return this.fail(field, `${field} must be more than £0.`);
    if (pence > MAX_PENCE) return this.fail(field, `${field} is too large.`);
    this.out[field] = pence / 100;
    return this;
  }

  oneOf(field, allowed, opts = {}) {
    const raw = this.body[field];
    if (raw === undefined || raw === null || raw === "") {
      if (opts.required) this.fail(field, `${field} is required.`);
      return this;
    }
    if (!allowed.includes(raw)) return this.fail(field, `${field} must be one of: ${allowed.join(", ")}.`);
    this.out[field] = raw;
    return this;
  }

  // Throws a 400 VALIDATION_ERROR when anything failed; returns cleaned values.
  done() {
    if (this.errors.length) throw validationError(this.errors);
    return this.out;
  }
}

function check(body) {
  return new Checker(body);
}

// ":id" in a URL -> positive integer, or null when it is not one.
function parseId(value) {
  if (typeof value !== "string" || !/^\d{1,10}$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= MAX_INT ? n : null;
}

// ?page=2&limit=20 -> { limit, offset, page } with safe bounds.
function pagination(query, defaultLimit = 20, maxLimit = 100) {
  const page = Math.max(1, Math.min(10000, parseInt(query.page, 10) || 1));
  const limit = Math.max(1, Math.min(maxLimit, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, offset: (page - 1) * limit };
}

module.exports = { check, parseId, pagination, isPlainObject, SLUG_PATTERN, EMAIL_PATTERN, MAX_INT };