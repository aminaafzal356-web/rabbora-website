-- Rabbora Living — newsletter subscribers (homepage "Stay Inspired" form)
-- ---------------------------------------------------------------
-- Run this file ONCE (pgAdmin Query Tool or psql). It only ADDS:
--   - table newsletter_subscribers
--   - a unique index so the same email address cannot be stored twice
--     (case-insensitive), and indexes for the admin lists
-- Nothing is dropped, reset or changed. If the table already exists it is
-- left exactly as it is, with all its rows (IF NOT EXISTS), so it is
-- safe to run more than once.
--
-- Status values:
--   pending      the customer asked to subscribe; the confirmation link has not been clicked yet
--   active       the customer clicked the confirmation link (double opt-in)
--   unsubscribed the customer unsubscribed, or an admin removed them from the list
--
-- Security and privacy:
--   - The confirmation token is NEVER stored: only its SHA-256 hash.
--     It expires (confirm_expires_at) and is cleared once used.
--   - The unsubscribe token is stored as-is: it only lets someone stop
--     emails to this address, it cannot read or change anything else.
--     Every marketing email must link to it.
--   - No IP address or browser details are stored.

BEGIN;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id                    BIGSERIAL PRIMARY KEY,
    email                 TEXT NOT NULL
                          CHECK (length(email) BETWEEN 3 AND 254 AND email = lower(email)),
    status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'active', 'unsubscribed')),
    -- Where the sign-up came from (website form). Short text only.
    source                TEXT NOT NULL DEFAULT 'homepage'
                          CHECK (length(source) BETWEEN 1 AND 50),

    -- SHA-256 of the confirmation link's token (64 lower-case hex). NULL once confirmed.
    confirm_token_hash    CHAR(64) CHECK (confirm_token_hash IS NULL OR confirm_token_hash ~ '^[0-9a-f]{64}$'),
    confirm_expires_at    TIMESTAMPTZ,

    -- Random token used in the unsubscribe link of every marketing email.
    unsubscribe_token     TEXT NOT NULL
                          CHECK (length(unsubscribe_token) BETWEEN 32 AND 100),

    -- When the customer last asked to subscribe (the moment of consent).
    consent_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at          TIMESTAMPTZ,
    unsubscribed_at       TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT newsletter_subscribers_unsubscribe_token_unique UNIQUE (unsubscribe_token),
    CONSTRAINT newsletter_subscribers_active_is_confirmed
        CHECK (status <> 'active' OR confirmed_at IS NOT NULL),
    CONSTRAINT newsletter_subscribers_unsubscribed_has_date
        CHECK (status <> 'unsubscribed' OR unsubscribed_at IS NOT NULL)
);

-- One row per email address, ignoring upper/lower case.
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lower_unique
    ON newsletter_subscribers (lower(email));

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created
    ON newsletter_subscribers (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status
    ON newsletter_subscribers (status);

COMMIT;