-- Rabbora Living — login sessions table
-- ---------------------------------------------------------------
-- Stores one row per logged-in browser session, for the
-- express-session + connect-pg-simple session store
-- (backend/config/session.js).
--
-- What is stored:
--   sid     the random session ID. The browser only holds this ID,
--           in a signed HttpOnly cookie ("rabbora.sid").
--   sess    the session data as JSON. Rabbora only puts the user's
--           id, the "remember me" choice and the login time in it,
--           plus the cookie settings express-session adds itself.
--           NEVER a password, password hash, email or name.
--   expire  when the session stops being valid. Expired rows are
--           deleted automatically by the session store every
--           15 minutes.
--
-- The column names sid / sess / expire are required by
-- connect-pg-simple and must not be renamed.
--
-- No foreign key to users: the user id lives inside the JSON. The
-- API re-checks the users table (and is_active) on every /api/me.
--
-- Nothing is stored in the users table. Safe to run more than once.
-- Run this in pgAdmin (Query Tool) on the "rabbora" database.
-- ---------------------------------------------------------------

BEGIN;

CREATE TABLE IF NOT EXISTS user_sessions (
  sid     VARCHAR      NOT NULL COLLATE "default",
  sess    JSON         NOT NULL,
  expire  TIMESTAMP(6) NOT NULL,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (sid)
);

-- Makes "find / delete expired sessions" fast.
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions (expire);

COMMIT;