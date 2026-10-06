// Rabbora Living — login checks for routes.
// Uses the SAME session login as routes/auth.js and routes/cart.js
// (cookie "rabbora.sid", sessions stored in PostgreSQL). Nothing new is
// stored in the browser.
//
// requireAuth  — the request must come from a logged-in, active user.
//                Sets req.user = { id, firstName, lastName, email, phone, role }.
// requireAdmin — the same, and the user's role must be "admin".
// optionalAuth — sets req.user when logged in, otherwise continues.

const db = require("../config/db");
const { getSessionUserId, destroySession, clearSessionCookie } = require("../config/session");
const { unauthorized, forbidden } = require("../utils/AppError");

const MSG_NOT_LOGGED_IN = "Please log in to continue.";

async function endSession(req, res) {
  try {
    await destroySession(req);
  } catch (err) {
    console.error("[auth] Could not remove session:", err.code || "", err.message);
  }
  clearSessionCookie(res);
}

// Reads the user fresh from the database on every request, so a
// deactivated account is locked out straight away.
async function loadUser(userId) {
  const result = await db.query(
    `SELECT id, first_name, last_name, email, phone, role
       FROM users
      WHERE id = $1 AND is_active = TRUE`,
    [userId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
  };
}

async function requireAuth(req, res, next) {
  // Account data must never be cached by the browser or a proxy.
  res.set("Cache-Control", "no-store");

  const userId = getSessionUserId(req);
  if (!userId) {
    // An expired session is removed (same as GET /api/me).
    if (req.session && req.session.userId) await endSession(req, res);
    return next(unauthorized(MSG_NOT_LOGGED_IN));
  }

  const user = await loadUser(userId);
  if (!user) {
    await endSession(req, res);
    return next(unauthorized(MSG_NOT_LOGGED_IN));
  }

  req.user = user;
  return next();
}

async function requireAdmin(req, res, next) {
  await requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== "admin") return next(forbidden("Admin access only."));
    return next();
  });
}

async function optionalAuth(req, res, next) {
  const userId = getSessionUserId(req);
  if (userId) {
    const user = await loadUser(userId);
    if (user) req.user = user;
  }
  return next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth };