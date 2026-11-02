-- =====================================================================
-- Rabbora Living — online payment: basket kept until payment is confirmed
-- database/online_payment_cart.sql
-- ---------------------------------------------------------------------
-- Adds ONE column to the existing orders table:
--   awaiting_payment  TRUE while an order placed with online payment is
--                     waiting for the card payment. Its basket lines are
--                     kept until the payment is confirmed, and a customer
--                     can have only one such order waiting at a time.
-- Safe to run more than once. Forward-only; no data is changed.
-- Run in pgAdmin (rabbora database, Query Tool) before using Pay now.
-- =====================================================================

BEGIN;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS awaiting_payment BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_orders_awaiting_payment
  ON orders (user_id) WHERE awaiting_payment;

COMMIT;