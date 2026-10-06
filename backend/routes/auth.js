// Rabbora Living — authentication routes
// POST /api/register  — creates a customer account in the users table.
// POST /api/login     — checks an email + password and starts a session.
// POST /api/logout    — ends the current session.
// GET  /api/me        — returns the logged-in user (401 when not logged in).
//
// Security rules followed here:
// - The plain password is never stored, logged or returned. Only a
//   bcrypt hash goes into users.password_hash.
// - Every query uses $1, $2 ... parameters (no SQL built from input).
// - PostgreSQL error details are logged on the server only; the
//   customer always gets a short, safe message.
// - Login answers wrong email, wrong password and inactive account with
//   the same 401 message, so nobody can tell which emails are registered.
// - Sessions live in PostgreSQL (config/session.js). The browser only
//   gets a random ID in an HttpOnly cookie; the session itself only
//   holds the user id — never a password or hash.

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const {
  startUserSession,
  destroySession,
  clearSessionCookie,
  getSessionUserId,
} = require("../config/session");

const router = express.Router();

// Same rules as the Create Account form (frontend register.js) and the
// users table (backend/database/users.sql).
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_MAX = 20;
const PHONE_ALLOWED = /^\+?[0-9 ()-]+$/;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15;
const PASSWORD_MIN = 8;
// bcrypt only uses the first 72 bytes of a password; anything longer
// would be silently cut, so it is rejected instead.
const PASSWORD_MAX_BYTES = 72;
const BCRYPT_ROUNDS = 12;

// Returns the trimmed string, or "" when the value is missing or not text.
function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Checks the request body. Returns { values, errors } where errors is an
// object of field -> message (empty when everything is valid).
function validateRegistration(body) {
  const errors = {};

  const firstName = cleanText(body.firstName);
  const lastName = cleanText(body.lastName);
  const email = cleanText(body.email).toLowerCase();
  const phone = cleanText(body.phone);
  // The password is NOT trimmed: spaces are allowed as part of it.
  const password = typeof body.password === "string" ? body.password : "";

  if (!firstName) errors.firstName = "First name is required.";
  else if (firstName.length > NAME_MAX) errors.firstName = `First name must be ${NAME_MAX} characters or fewer.`;

  if (!lastName) errors.lastName = "Last name is required.";
  else if (lastName.length > NAME_MAX) errors.lastName = `Last name must be ${NAME_MAX} characters or fewer.`;

  if (!email) errors.email = "Email address is required.";
  else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else {
    const digits = phone.replace(/\D/g, "").length;
    if (phone.length > PHONE_MAX || !PHONE_ALLOWED.test(phone) || digits < PHONE_MIN_DIGITS || digits > PHONE_MAX_DIGITS) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  if (!password) errors.password = "Password is required.";
  else if (password.length < PASSWORD_MIN) errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
  else if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) errors.password = "Password is too long.";

  return { values: { firstName, lastName, email, phone, password }, errors };
}

// POST /api/register
router.post("/register", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { values, errors } = validateRegistration(body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please check the highlighted fields.",
      errors,
    });
  }

  let client;
  try {
    client = await db.pool.connect();

    // 1. Is this email already registered?
    const existing = await client.query("SELECT 1 FROM users WHERE email = $1", [values.email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // 2. Hash the password (the plain password never leaves this function).
    const passwordHash = await bcrypt.hash(values.password, BCRYPT_ROUNDS);

    // 3. Create the user. role and is_active use the table defaults
    //    ('customer' and TRUE). Only safe columns are returned.
    const result = await client.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, phone`,
      [values.firstName, values.lastName, values.email, values.phone, passwordHash]
    );

    const user = result.rows[0];
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    // Two sign-ups with the same email at the same moment: the UNIQUE
    // constraint catches the second one.
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Log only safe details (never the request body, the password or
    // err.detail, which can contain the row's values).
    console.error("[register] Could not create account:", err.code || "", err.constraint || "", err.message);

    // A value the database rejected (CHECK / NOT NULL / too long).
    if (err.code === "23514" || err.code === "23502" || err.code === "22001") {
      return res.status(400).json({
        success: false,
        message: "Some of the details could not be accepted. Please check them and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "We couldn't create your account right now. Please try again later.",
    });
  } finally {
    if (client) client.release();
  }
});

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------

const INVALID_LOGIN_MESSAGE = "Invalid email or password.";

// When no user matches the email, the password is still compared against
// this throwaway hash, so a wrong email takes about as long as a wrong
// password (the response time does not reveal whether the email exists).
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("rabbora-no-such-user", BCRYPT_ROUNDS);

// Checks the login body. Only "is it there / is it an email" is checked
// here; the password rules are not repeated, so the error never hints at
// what a valid password looks like.
function validateLogin(body) {
  const errors = {};

  const email = cleanText(body.email).toLowerCase();
  // The password is NOT trimmed, exactly like registration.
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) errors.email = "Email address is required.";
  else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!password) errors.password = "Password is required.";

  // "Remember me" — only an explicit true keeps the user logged in
  // for 30 days; anything else means a 1-day browser session.
  const remember = body.remember === true;

  return { values: { email, password, remember }, errors };
}

// POST /api/login
router.post("/login", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const { values, errors } = validateLogin(body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please check the highlighted fields.",
      errors,
    });
  }

  try {
    // 1. Find the account by its (lowercase) email.
    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone, role, password_hash, is_active
         FROM users
        WHERE email = $1`,
      [values.email]
    );
    const user = result.rows[0];

    // 2. Always run one bcrypt comparison (real hash, or the dummy one).
    //    Passwords longer than 72 bytes can never belong to an account
    //    (registration rejects them) and bcrypt would cut them, so they
    //    are treated as wrong.
    const passwordTooLong = Buffer.byteLength(values.password, "utf8") > PASSWORD_MAX_BYTES;
    const hashToCheck = user ? user.password_hash : DUMMY_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(values.password, hashToCheck);

    // 3. Unknown email, wrong password or inactive account -> same answer.
    if (!user || !passwordMatches || passwordTooLong || user.is_active !== true) {
      return res.status(401).json({
        success: false,
        message: INVALID_LOGIN_MESSAGE,
      });
    }

    // 4. Start a brand-new session for this user (the old session ID,
    //    if any, is thrown away — protects against session fixation).
    //    The session cookie is added to this response.
    await startUserSession(req, user.id, values.remember);

    // 5. Success: only safe fields (never password_hash).
    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    // Safe details only (never the body, the password or the hash).
    console.error("[login] Could not check login:", err.code || "", err.message);
    return res.status(500).json({
      success: false,
      message: "We couldn't log you in right now. Please try again later.",
    });
  }
});

// ---------------------------------------------------------------------------
// LOGOUT
// ---------------------------------------------------------------------------

// POST /api/logout
// Deletes the session row and tells the browser to drop the cookie.
// Works (200) even when nobody is logged in.
router.post("/logout", async (req, res) => {
  try {
    await destroySession(req);
    clearSessionCookie(res);
    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      message: "You have been logged out.",
    });
  } catch (err) {
    // The cookie is still removed from this browser.
    clearSessionCookie(res);
    console.error("[logout] Could not end session:", err.code || "", err.message);
    return res.status(500).json({
      success: false,
      message: "We couldn't log you out right now. Please try again.",
    });
  }
});

// ---------------------------------------------------------------------------
// CURRENT USER
// ---------------------------------------------------------------------------

const NOT_LOGGED_IN_MESSAGE = "Not logged in.";

// GET /api/me
// Returns the logged-in user's safe details, read fresh from the users
// table, so a deactivated account is logged out straight away.
router.get("/me", async (req, res) => {
  res.set("Cache-Control", "no-store");

  const userId = getSessionUserId(req);

  if (!userId) {
    // An expired (over the 1-day / 30-day limit) session is removed.
    if (req.session && req.session.userId) {
      try {
        await destroySession(req);
      } catch (err) {
        console.error("[me] Could not remove expired session:", err.code || "", err.message);
      }
      clearSessionCookie(res);
    }
    return res.status(401).json({ success: false, message: NOT_LOGGED_IN_MESSAGE });
  }

  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone, role
         FROM users
        WHERE id = $1 AND is_active = TRUE`,
      [userId]
    );
    const user = result.rows[0];

    // Account deleted or deactivated since login: end the session.
    if (!user) {
      await destroySession(req);
      clearSessionCookie(res);
      return res.status(401).json({ success: false, message: NOT_LOGGED_IN_MESSAGE });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[me] Could not load current user:", err.code || "", err.message);
    return res.status(500).json({
      success: false,
      message: "We couldn't load your account right now. Please try again later.",
    });
  }
});

module.exports = router;