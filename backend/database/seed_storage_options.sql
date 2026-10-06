-- =====================================================================
-- Rabbora Living — storage options seed     database/seed_storage_options.sql
-- ---------------------------------------------------------------------
-- Fills the "storage_options" table (created by ecommerce_core.sql) with
-- the storage choice the website already offers. Nothing is invented:
-- codes and texts are copied from the frontend.
--
-- What the frontend has: ONE storage option, the gas lift-up ottoman
-- storage base, offered as a Yes / No question on 7 pages:
--   Slatted Ottoman Beds, Solid Base Ottomans, Storage Beds With Drawers,
--   High Headboard Beds, Bed Frames, Best Sellers, Rapid Delivery Beds.
--   Question: "Add Gas Lift-Up Ottoman Storage to Your Bed?"
--     (ottoman-beds.html words it "Add Gas-Lift Ottoman Storage to Your Bed")
--   Buttons:  data-value="yes"  "Yes Please, I want a storage base"
--             data-value="no"   "No thanks, I want a normal bed"
-- Not offered on: TV Beds, Kids' Beds, Mattresses, Sofas, Blanket Boxes.
-- Price: none. The storage choice never changes the price on any page
-- (only Assembly +£59 and, on Slatted Ottoman Beds, Detailing Buttons
-- +£15 do), so no price is stored anywhere.
--
-- The two rows below are the two choices, with code = the exact value the
-- pages save in the basket (options.ottomanStorage = "yes" / "no"), so a
-- cart or order line maps straight to its storage option.
--
-- product_storage_options (which product offers it) is NOT filled: the
-- frontend shows the question per PAGE, and the Bed Frames / Best Sellers
-- / Rapid pages also show it for beds whose own page (e.g. TV Beds) does
-- not, so there is no exact product-by-product list to copy.
--
-- Safety: only INSERTs into storage_options; nothing deleted or updated;
-- no product, price, user or cart row touched. Safe to run more than
-- once (ON CONFLICT (code) DO NOTHING, plus a name check), one
-- transaction, final check rolls back if a row is missing.
-- Run AFTER ecommerce_core.sql, in pgAdmin (rabbora database, Query Tool).
-- =====================================================================

BEGIN;

CREATE TEMP TABLE seed_storage_rows (
    code        VARCHAR(50) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    sort_order  INTEGER NOT NULL
) ON COMMIT DROP;

INSERT INTO seed_storage_rows (code, name, description, sort_order) VALUES
    ('yes', 'Yes Please, I want a storage base', 'Add Gas Lift-Up Ottoman Storage to Your Bed?', 1),
    ('no',  'No thanks, I want a normal bed',    'Add Gas Lift-Up Ottoman Storage to Your Bed?', 2);

INSERT INTO storage_options (code, name, description, sort_order, is_active)
SELECT s.code, s.name, s.description, s.sort_order, TRUE
  FROM seed_storage_rows s
 WHERE NOT EXISTS (SELECT 1 FROM storage_options o WHERE lower(o.name) = lower(s.name))
 ORDER BY s.sort_order
ON CONFLICT (code) DO NOTHING;

DO $$
DECLARE
    missing INTEGER;
BEGIN
    SELECT count(*) INTO missing
      FROM seed_storage_rows s
     WHERE NOT EXISTS (SELECT 1 FROM storage_options o WHERE o.code = s.code OR lower(o.name) = lower(s.name));
    IF missing > 0 THEN
        RAISE EXCEPTION 'Stopped, nothing saved: % storage options are missing after the seed', missing;
    END IF;
END $$;

COMMIT;

-- Check (read-only): expected 2 rows, codes "yes" and "no".
-- SELECT code, name, description, sort_order, is_active FROM storage_options ORDER BY sort_order;