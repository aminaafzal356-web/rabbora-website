// Rabbora Living — login sessions (server-side, stored in PostgreSQL)
//
// How it works:
// - After a correct login the server creates a session row in the
//   user_sessions table (backend/database/user_sessions.sql).
// - The browser only receives a random session ID in a signed,
//   HttpOnly cookie called "rabbora.sid". JavaScript cannot read it,
//   and it contains no user details and no password.
// - On every request the browser sends the cookie back; the server
//   looks the ID up in PostgreSQL to find which user is logged in.
//
// What is kept in a session: userId, remember (true/false) and
// loginAt (time of login). Never a password, hash, email or name.
//
// Lifetimes ("Remember me"):
// - unchecked: a browser-session cookie (removed when the browser is
//   closed) AND a hard limit of 1 day on the server.
// - checked:   a cookie that lasts 30 days, with a hard 30-day limit
//   on the server.

const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const db = require("./db");

const PgSessionStore = connectPgSimple(session);

const SESSION_COOKIE_NAME = "rabbora.sid";
const SESSION_TABLE = "user_sessions";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const SHORT_SESSION_MS = ONE_DAY_MS; // "Remember me" unchecked
const REMEMBER_SESSION_MS = 30 * ONE_DAY_MS; // "Remember me" checked

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ---------- Secret ----------

// Signs the cookie so a session ID cannot be forged or altered.
// It must come from backend/.env and must be long and random; the
// server refuses to start without it (no weak built-in default).
const SESSION_SECRET = process.env.SESSION_SECRET || "";
if (SESSION_SECRET.length < 32) {
  console.error(
    "SESSION_SECRET is missing or too short in backend/.env (it needs at least 32 characters).\n" +
    "Generate one with:\n" +
    "  node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\"\n" +
    "and add it to backend/.env as SESSION_SECRET=<the generated value>."
  );
  process.exit(1);
}

// ---------- Cookie settings ----------

// Shared by the session cookie and by clearCookie() on logout, so
// the browser really removes it (the options must match).
const COOKIE_OPTIONS = {
  httpOnly: true, // not readable by JavaScript
  sameSite: "lax", // not sent with cross-site POSTs (CSRF protection)
  // HTTPS-only on the live site. Local development runs on plain
  // http://localhost, where a Secure cookie would never be sent.
  secure: IS_PRODUCTION,
  path: "/",
};

// ---------- Store + middleware ----------

const store = new PgSessionStore({
  pool: db.pool, // reuse the existing PostgreSQL pool
  tableName: SESSION_TABLE,
  createTableIfMissing: false, // the table is created by user_sessions.sql
  // Server-side lifetime (seconds) for sessions whose cookie has no
  // expiry date ("Remember me" unchecked).
  ttl: SHORT_SESSION_MS / 1000,
  pruneSessionInterval: 15 * 60, // delete expired rows every 15 minutes
  // Log only the error code and message (never session contents).
  errorLog: (...args) => {
    const err = args.find((a) => a instanceof Error);
    console.error("[session-store]", err ? `${err.code || ""} ${err.message}` : String(args[0]));
  },
});

const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  secret: SESSION_SECRET,
  store,
  resave: false, // don't rewrite unchanged sessions
  saveUninitialized: false, // no session / cookie until someone logs in
  rolling: false, // the expiry is fixed at login time
  // (Behind the live site's HTTPS proxy, server.js sets
  // app.set("trust proxy", 1) so Secure cookies still work.)
  cookie: {
    ...COOKIE_OPTIONS,
    maxAge: null, // set per login in startUserSession()
  },
});

// ---------- Helpers used by routes/auth.js ----------

// Starts a fresh session for a user who has just proved their password.
// regenerate() throws away any old session ID first, so an ID that
// existed before login can never become a logged-in session
// (protection against session fixation).
function startUserSession(req, userId, remember) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((regenerateErr) => {
      if (regenerateErr) return reject(regenerateErr);

      req.session.userId = userId;
      req.session.remember = remember === true;
      req.session.loginAt = Date.now();

      // null = browser-session cookie (ends when the browser closes).
      req.session.cookie.maxAge = remember === true ? REMEMBER_SESSION_MS : null;

      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
}

// Removes the session row from PostgreSQL. Safe to call when nobody
// is logged in.
function destroySession(req) {
  return new Promise((resolve, reject) => {
    if (!req.session) return resolve();
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });
}

// Tells the browser to delete the session cookie.
function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, COOKIE_OPTIONS);
}

// Returns the logged-in user's id, or null when there is no valid
// session. Also enforces the hard 1-day / 30-day limit, even if a
// browser keeps a "session" cookie alive by restoring tabs.
function getSessionUserId(req) {
  const s = req.session;
  if (!s || !Number.isInteger(s.userId) || typeof s.loginAt !== "number") return null;

  const limit = s.remember === true ? REMEMBER_SESSION_MS : SHORT_SESSION_MS;
  if (Date.now() - s.loginAt > limit) return null;

  return s.userId;
}

module.exports = {
  sessionMiddleware,
  startUserSession,
  destroySession,
  clearSessionCookie,
  getSessionUserId,
  IS_PRODUCTION,
};