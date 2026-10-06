-- =====================================================================
-- Rabbora Living — Stripe payment IDs on orders   database/stripe_payments.sql
-- ---------------------------------------------------------------------
-- Forward-only migration for the Stripe Checkout integration
-- (services/paymentService.js). It ADDS two empty (NULL) columns to the
-- existing "orders" table:
--
--   stripe_checkout_session_id  the Stripe Checkout Session (cs_test_… /
--                               cs_live_…) last opened for this order —
--                               "Pay now" re-uses it while it is still open
--   stripe_payment_intent_id    the Stripe PaymentIntent (pi_…) that paid
--                               the order — used to match refunds and to
--                               find the payment in the Stripe dashboard
--
-- plus a UNIQUE index on each (only for rows that have a value), so one
-- Stripe session / payment can never be linked to two orders.
--
-- Safety:
--   * Nothing is dropped, truncated, deleted or renamed. No existing row
--     is updated: existing orders simply get NULL in the new columns.
--   * payment_status keeps its existing values ('unpaid', 'paid',
--     'refunded') — no new status is added.
--   * Safe to run more than once (ADD COLUMN IF NOT EXISTS /
--     CREATE UNIQUE INDEX IF NOT EXISTS). One transaction; the check at
--     the end rolls everything back if a column or index is missing.
--
-- Run AFTER ecommerce_core.sql, in pgAdmin (rabbora database, Query Tool),
-- or:  psql -U postgres -d rabbora -f database/stripe_payments.sql
-- =====================================================================

BEGIN;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_checkout_session_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id   VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_checkout_session_unique
    ON orders (stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_payment_intent_unique
    ON orders (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

DO $$
DECLARE
    cols INTEGER;
    idx  INTEGER;
BEGIN
    SELECT count(*) INTO cols
      FROM information_schema.columns
     WHERE table_schema = current_schema() AND table_name = 'orders'
       AND column_name IN ('stripe_checkout_session_id', 'stripe_payment_intent_id')
       AND is_nullable = 'YES';
    SELECT count(*) INTO idx
      FROM pg_indexes
     WHERE schemaname = current_schema() AND tablename = 'orders'
       AND indexname IN ('orders_stripe_checkout_session_unique', 'orders_stripe_payment_intent_unique');
    IF cols <> 2 OR idx <> 2 THEN
        RAISE EXCEPTION 'Stopped, nothing saved: expected 2 Stripe columns and 2 indexes on orders, found % and %', cols, idx;
    END IF;
END $$;

COMMIT;

-- Checks (read-only):
--   SELECT column_name, data_type, is_nullable FROM information_schema.columns
--    WHERE table_name = 'orders' AND column_name LIKE 'stripe_%';
--   SELECT count(*) AS orders, count(stripe_checkout_session_id) AS with_session,
--          count(stripe_payment_intent_id) AS with_payment FROM orders;