-- Rabbora Living — admin notifications (bell in the Admin Panel header)
-- ---------------------------------------------------------------
-- Run this file ONCE (pgAdmin Query Tool or psql). It only ADDS:
--   - table notifications            one row per business event
--   - table notification_reads       which admin has read which notification
--   - table notification_preferences each admin's sound / desktop settings
-- It changes or deletes nothing that already exists. It is also safe to run
-- again: every statement uses IF NOT EXISTS.
--
-- Read status is per admin, so two admins each see their own unread count.
-- dedupe_key is unique, so the same event (for example order 12) is stored
-- once even if the application code runs twice for it.

CREATE TABLE IF NOT EXISTS notifications (
  id              BIGSERIAL PRIMARY KEY,
  event_type      VARCHAR(40) NOT NULL
                  CHECK (event_type IN (
                    'new_order',
                    'new_contact_message',
                    'new_fabric_sample_request',
                    'new_newsletter_subscriber',
                    'new_customer_registration',
                    'new_product_review'
                  )),
  title           VARCHAR(160) NOT NULL,
  message         VARCHAR(500) NOT NULL,
  record_id       BIGINT,
  destination_url VARCHAR(300) NOT NULL,
  dedupe_key      VARCHAR(120) NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS notifications_created_idx
  ON notifications (created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS notification_reads (
  notification_id BIGINT NOT NULL REFERENCES notifications (id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  read_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS notification_reads_user_idx
  ON notification_reads (user_id, notification_id);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id         INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  sound_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  desktop_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);