-- Rabbora Living — Fabric Sample Requests + Contact Messages
-- ---------------------------------------------------------------
-- Run this file ONCE (pgAdmin Query Tool or psql). It only ADDS:
--   - table fabric_sample_requests   (website: fabric-samples.html)
--   - table contact_messages         (website: contact.html)
--   - indexes for the admin lists (newest first, filter by status)
-- Nothing is dropped, reset or deleted. If a table already exists it is
-- left exactly as it is, with all its rows (IF NOT EXISTS), so it is
-- safe to run more than once.
--
-- Status values used by the admin panel:
--   new, read, in_progress, completed, cancelled

BEGIN;

CREATE TABLE IF NOT EXISTS fabric_sample_requests (
    id                 BIGSERIAL PRIMARY KEY,
    name               TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
    email              TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
    phone              TEXT NOT NULL CHECK (length(phone) BETWEEN 1 AND 20),
    postcode           TEXT NOT NULL CHECK (length(postcode) BETWEEN 1 AND 10),
    address            TEXT NOT NULL CHECK (length(address) BETWEEN 1 AND 500),
    -- The chosen fabric names, comma separated (1 to 4 fabrics).
    selected_fabrics   TEXT NOT NULL CHECK (length(selected_fabrics) BETWEEN 1 AND 500),
    notes              TEXT CHECK (notes IS NULL OR length(notes) <= 2000),
    marketing_consent  BOOLEAN NOT NULL DEFAULT FALSE,
    status             TEXT NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'cancelled')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fabric_sample_requests_created
    ON fabric_sample_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fabric_sample_requests_status
    ON fabric_sample_requests (status);

CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
    email       TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
    phone       TEXT CHECK (phone IS NULL OR length(phone) <= 20),
    subject     TEXT NOT NULL CHECK (length(subject) BETWEEN 1 AND 200),
    message     TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 5000),
    status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'read', 'in_progress', 'completed', 'cancelled')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created
    ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status
    ON contact_messages (status);

COMMIT;