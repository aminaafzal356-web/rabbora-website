-- Rabbora Living — password reset tokens ("Forgot password?")
-- ---------------------------------------------------------------
-- Run this file ONCE (pgAdmin Query Tool or psql) before using the
-- Forgot Password / Reset Password pages. It only ADDS one new table:
--   - no existing table is changed or dropped,
--   - no existing data is touched,
--   - safe to run more than once (IF NOT EXISTS).
--
-- One row = one reset link that was emailed to a customer.
-- Security:
--   - The link's secret token is NEVER stored. Only its SHA-256 hash
--     (64 hex characters) is saved, so even someone who could read
--     this table could not use the links.
--   - Every link expires (expires_at) and works only once (used_at is
--     set the moment the password is changed).
--   - When a customer's account is deleted, their tokens go with it.

BEGIN;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- SHA-256 of the token in the emailed link (lower-case hex).
    token_hash  CHAR(64) NOT NULL
                CHECK (token_hash ~ '^[0-9a-f]{64}$'),

    expires_at  TIMESTAMPTZ NOT NULL,
    -- NULL = not used yet. Set when the password is changed, or when a
    -- newer link replaces this one.
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT password_reset_tokens_hash_unique UNIQUE (token_hash),
    CONSTRAINT password_reset_tokens_expiry_after_create CHECK (expires_at > created_at)
);

-- Finds a customer's open links quickly (to cancel them when a new
-- link is requested or the password is changed).
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user
    ON password_reset_tokens (user_id)
    WHERE used_at IS NULL;

COMMIT;

-- Optional housekeeping (run whenever you like; never needed for the
-- feature to work): removes links that are used or expired for 7+ days.
--   DELETE FROM password_reset_tokens
--    WHERE COALESCE(used_at, expires_at) < NOW() - INTERVAL '7 days';