-- =====================================================================
-- Rabbora Living — Stripe payment IDs on orders   database/stripe_payments.sql
-- ---------------------------------------------------------------------
-- Forward-only migration for the Stripe Checkout integration
-- (services/paymentService.js). It ADDS two empty (NULL) columns to the
-- existing public.orders table:
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
-- The schema is named explicitly everywhere: public.orders. Nothing here
-- depends on the connection's search_path or on current_schema().
--
-- Safety:
--   * Additive only. Nothing is dropped, truncated, deleted, renamed or
--     updated. Existing orders simply get NULL in the two new columns.
--   * payment_status keeps its existing values ('unpaid', 'paid',
--     'refunded') — no new status is added.
--   * Safe to run more than once (ADD COLUMN IF NOT EXISTS /
--     CREATE UNIQUE INDEX IF NOT EXISTS). One transaction: if public.orders
--     is missing, or the result is not exactly as expected, everything is
--     rolled back and nothing is saved.
--
-- Run AFTER ecommerce_core.sql. In Supabase: SQL Editor on the production
-- project, paste this whole file, Run once. Locally (pgAdmin, Query Tool on
-- the rabbora database) or:  psql -U postgres -d rabbora -f database/stripe_payments.sql
-- =====================================================================

BEGIN;

-- 0. Stop before changing anything if the table is not where we expect.
DO $$
BEGIN
    IF to_regclass('public.orders') IS NULL THEN
        RAISE EXCEPTION 'Stopped, nothing saved: table public.orders was not found.';
    END IF;
END $$;

-- 1. The two columns (nullable, no default, so existing rows are not rewritten).
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_checkout_session_id VARCHAR(255);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id   VARCHAR(255);

-- 2. Unique indexes, only for rows that have a value.
--    (An index is always created in the schema of its table, so the index
--    name itself is not schema-qualified.)
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_checkout_session_unique
    ON public.orders (stripe_checkout_session_id) WHERE stripe_checkout_session_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_payment_intent_unique
    ON public.orders (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- 3. Verify, explicitly in public. Reads the catalog directly for the
--    columns (not filtered by privileges) and pg_indexes for the indexes.
DO $$
DECLARE
    cols INTEGER;
    idx  INTEGER;
BEGIN
    SELECT count(*) INTO cols
      FROM pg_attribute a
     WHERE a.attrelid = 'public.orders'::regclass
       AND a.attnum > 0
       AND NOT a.attisdropped
       AND a.attnotnull = FALSE
       AND a.attname IN ('stripe_checkout_session_id', 'stripe_payment_intent_id');

    SELECT count(*) INTO idx
      FROM pg_indexes
     WHERE schemaname = 'public'
       AND tablename = 'orders'
       AND indexname IN ('orders_stripe_checkout_session_unique', 'orders_stripe_payment_intent_unique');

    IF cols <> 2 OR idx <> 2 THEN
        RAISE EXCEPTION 'Stopped, nothing saved: expected 2 nullable Stripe columns and 2 indexes on public.orders, found % and %', cols, idx;
    END IF;
END $$;

COMMIT;

-- ---------------------------------------------------------------------
-- Read-only checks (safe to run any time, change nothing):
--
--   SELECT column_name, data_type, is_nullable
--     FROM information_schema.columns
--    WHERE table_schema = 'public' AND table_name = 'orders'
--      AND column_name LIKE 'stripe%';
--
--   SELECT indexname FROM pg_indexes
--    WHERE schemaname = 'public' AND tablename = 'orders'
--      AND indexname LIKE 'orders_stripe%';
--
--   SELECT count(*) AS orders,
--          count(stripe_checkout_session_id) AS with_session,
--          count(stripe_payment_intent_id)   AS with_payment
--     FROM public.orders;
-- ---------------------------------------------------------------------