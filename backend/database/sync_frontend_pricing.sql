-- =====================================================================
-- Rabbora Living — sync per-size OLD (crossed-out) prices with the
-- finalized frontend.                       database/sync_frontend_pricing.sql
-- ---------------------------------------------------------------------
-- WHAT THIS CHANGES
--   Only product_variants.compare_at_price (the old / original price of
--   one size of one product). Nothing else.
--
-- WHAT THIS NEVER CHANGES
--   * Sale prices (product_variants.price, products.price) — untouched.
--     Every row below also states the size's CURRENT sale price; a row is
--     only updated when the database sale price is exactly that value.
--   * No table is dropped, no product/size/price is deleted, no schema
--     change on existing tables.
--
-- WHERE THE VALUES COME FROM (nothing invented)
--   The per-size old-price tables in the finalized frontend files:
--     ottoman-beds.js        SLATTED_OTTOMAN_SIZE_OLD_PRICES
--     solid-base-ottomans.js SO_SIZE_OLD_PRICES
--     storage-drawers.js     SD_SIZE_OLD_PRICES
--     tv-beds.js             TV_BED_SIZE_OLD_PRICES
--     kids-beds.js           KIDS_BED_SIZE_OLD_PRICES
--     high-headboard-beds.js HH_BED_SIZE_OLD_PRICES
--     sofas.js               SF_SIZE_OLD_PRICES   (only Sofa #1 and #4, 50%)
--     bed-frames.js / best-sellers.js / rapid-delivery-beds.js — their
--       tables were checked too: every Bed Frame / Best Seller / Rapid bed
--       that is in the database has exactly the same per-size prices as
--       its own category page, so no separate rows are needed.
--   Ottoman rule used by the frontend (values copied as the frontend has
--   them, already rounded to pence):
--     Single 3ft keeps its existing old price
--     Small Double old = sale / 0.79   (21% off)
--     Double       old = sale / 0.72   (28% off)
--     King         old = sale / 0.71   (29% off)
--     Super King   old = sale / 0.71   (29% off)
--   Sofa #1 and #4: old = sale / 0.50 (50% off). Other sofas: no old price.
--
-- Discount %, savings and the monthly amount are NOT stored: the existing
-- product_pricing view (ecommerce_core.sql) and utils/pricing.js calculate
-- them from sale + old price with the frontend's own rules.
--
-- SAFETY
--   * One transaction. If any check fails, NOTHING is saved.
--   * Each row is found by product slug + size (no hard-coded IDs).
--   * Stops if a product/size is missing, or its sale price is different.
--   * Stops if any sale price changed, or any product/size disappeared.
--   * Every old price that is replaced is kept in pricing_sync_backup
--     (variant, previous value, new value, time), so it can be put back.
--   * Safe to run again: the second run changes nothing.
--
-- HOW TO RUN: pgAdmin -> "rabbora" database -> Query Tool -> open this
-- file -> Execute. Run it AFTER ecommerce_core.sql.
-- =====================================================================

BEGIN;

-- Backup of every old price this script replaces (new table, additive).
CREATE TABLE IF NOT EXISTS pricing_sync_backup (
    id                      SERIAL PRIMARY KEY,
    product_variant_id      INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    previous_compare_at     NUMERIC(10,2),
    new_compare_at          NUMERIC(10,2),
    source                  VARCHAR(100) NOT NULL,
    changed_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Snapshot of every sale price before the change (dropped at COMMIT).
CREATE TEMP TABLE pricing_before ON COMMIT DROP AS
SELECT v.id, v.price AS variant_price, p.price AS product_price
  FROM product_variants v JOIN products p ON p.id = v.product_id;

-- Frontend values: product slug, size (option_value), current sale
-- price of that size, old price shown by the frontend for that size.
CREATE TEMP TABLE frontend_old_prices (
    slug         VARCHAR(255) NOT NULL,
    size         VARCHAR(50)  NOT NULL,
    sale_price   NUMERIC(10,2) NOT NULL,
    old_price    NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (slug, size)
) ON COMMIT DROP;

INSERT INTO frontend_old_prices (slug, size, sale_price, old_price) VALUES
    -- slatted-ottoman-beds
    ('chelsea-slatted-ottoman-bed', 'Single', 249.00, 429.00),
    ('chelsea-slatted-ottoman-bed', 'Small Double', 388.00, 491.14),
    ('chelsea-slatted-ottoman-bed', 'Double', 429.00, 595.83),
    ('chelsea-slatted-ottoman-bed', 'King', 459.00, 646.48),
    ('chelsea-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('hampton-slatted-ottoman-bed', 'Single', 259.00, 420.00),
    ('hampton-slatted-ottoman-bed', 'Small Double', 359.00, 454.43),
    ('hampton-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('hampton-slatted-ottoman-bed', 'King', 439.00, 618.31),
    ('hampton-slatted-ottoman-bed', 'Super King', 469.00, 660.56),
    ('monaco-ottoman-bed', 'Single', 289.00, 400.00),
    ('monaco-ottoman-bed', 'Small Double', 367.50, 465.19),
    ('monaco-ottoman-bed', 'Double', 399.00, 554.17),
    ('monaco-ottoman-bed', 'King', 439.00, 618.31),
    ('monaco-ottoman-bed', 'Super King', 469.00, 660.56),
    ('windsor-slatted-ottoman-bed', 'Single', 289.00, 420.00),
    ('windsor-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('windsor-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('windsor-slatted-ottoman-bed', 'King', 458.99, 646.46),
    ('windsor-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('kensington-slatted-ottoman-bed', 'Single', 252.00, 420.00),
    ('kensington-slatted-ottoman-bed', 'Small Double', 383.99, 486.06),
    ('kensington-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('kensington-slatted-ottoman-bed', 'King', 489.00, 688.73),
    ('kensington-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('mayfair-ottoman-bed', 'Single', 306.59, 420.00),
    ('mayfair-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('mayfair-ottoman-bed', 'Double', 449.00, 623.61),
    ('mayfair-ottoman-bed', 'King', 489.00, 688.73),
    ('mayfair-ottoman-bed', 'Super King', 539.00, 759.15),
    ('richmond-slatted-ottoman-bed', 'Single', 299.00, 444.00),
    ('richmond-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('richmond-slatted-ottoman-bed', 'Double', 439.00, 609.72),
    ('richmond-slatted-ottoman-bed', 'King', 459.00, 646.48),
    ('richmond-slatted-ottoman-bed', 'Super King', 509.00, 716.90),
    ('cambridge-slatted-ottoman-bed', 'Single', 306.59, 420.00),
    ('cambridge-slatted-ottoman-bed', 'Small Double', 439.00, 555.70),
    ('cambridge-slatted-ottoman-bed', 'Double', 489.00, 679.17),
    ('cambridge-slatted-ottoman-bed', 'King', 509.00, 716.90),
    ('cambridge-slatted-ottoman-bed', 'Super King', 559.00, 787.32),
    ('victoria-ottoman-bed', 'Single', 449.00, 600.00),
    ('victoria-ottoman-bed', 'Small Double', 589.00, 745.57),
    ('victoria-ottoman-bed', 'Double', 599.00, 831.94),
    ('victoria-ottoman-bed', 'King', 649.00, 914.08),
    ('victoria-ottoman-bed', 'Super King', 699.00, 984.51),
    ('oxford-slatted-ottoman-bed', 'Single', 299.00, 420.00),
    ('oxford-slatted-ottoman-bed', 'Small Double', 369.00, 467.09),
    ('oxford-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('oxford-slatted-ottoman-bed', 'King', 419.00, 590.14),
    ('oxford-slatted-ottoman-bed', 'Super King', 479.00, 674.65),
    ('chester-slatted-ottoman-bed', 'Single', 349.00, 599.00),
    ('chester-slatted-ottoman-bed', 'Small Double', 449.00, 568.35),
    ('chester-slatted-ottoman-bed', 'Double', 459.00, 637.50),
    ('chester-slatted-ottoman-bed', 'King', 519.00, 730.99),
    ('chester-slatted-ottoman-bed', 'Super King', 569.00, 801.41),
    ('kingston-ottoman-bed', 'Single', 299.00, 420.00),
    ('kingston-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('kingston-ottoman-bed', 'Double', 429.00, 595.83),
    ('kingston-ottoman-bed', 'King', 459.00, 646.48),
    ('kingston-ottoman-bed', 'Super King', 499.00, 702.82),
    ('manhattan-slatted-ottoman-bed', 'Single', 239.00, 420.00),
    ('manhattan-slatted-ottoman-bed', 'Small Double', 379.00, 479.75),
    ('manhattan-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('manhattan-slatted-ottoman-bed', 'King', 449.00, 632.39),
    ('manhattan-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('brighton-slatted-ottoman-bed', 'Single', 389.00, 499.00),
    ('brighton-slatted-ottoman-bed', 'Small Double', 439.00, 555.70),
    ('brighton-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('brighton-slatted-ottoman-bed', 'King', 499.00, 702.82),
    ('brighton-slatted-ottoman-bed', 'Super King', 549.00, 773.24),
    ('lancaster-ottoman-bed', 'Single', 289.00, 420.00),
    ('lancaster-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('lancaster-ottoman-bed', 'Double', 425.00, 590.28),
    ('lancaster-ottoman-bed', 'King', 459.00, 646.48),
    ('lancaster-ottoman-bed', 'Super King', 485.00, 683.10),
    ('bristol-slatted-ottoman-bed', 'Single', 275.00, 360.00),
    ('bristol-slatted-ottoman-bed', 'Small Double', 339.00, 429.11),
    ('bristol-slatted-ottoman-bed', 'Double', 349.00, 484.72),
    ('bristol-slatted-ottoman-bed', 'King', 399.00, 561.97),
    ('bristol-slatted-ottoman-bed', 'Super King', 419.00, 590.14),
    ('soho-slatted-ottoman-bed', 'Single', 349.00, 420.00),
    ('soho-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('soho-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('soho-slatted-ottoman-bed', 'King', 489.00, 688.73),
    ('soho-slatted-ottoman-bed', 'Super King', 539.00, 759.15),
    ('belgravia-ottoman-bed', 'Single', 349.00, 420.00),
    ('belgravia-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('belgravia-ottoman-bed', 'Double', 449.00, 623.61),
    ('belgravia-ottoman-bed', 'King', 489.00, 688.73),
    ('belgravia-ottoman-bed', 'Super King', 549.00, 773.24),
    ('fulham-slatted-ottoman-bed', 'Single', 389.00, 478.80),
    ('fulham-slatted-ottoman-bed', 'Small Double', 449.00, 568.35),
    ('fulham-slatted-ottoman-bed', 'Double', 489.00, 679.17),
    ('fulham-slatted-ottoman-bed', 'King', 549.00, 773.24),
    ('fulham-slatted-ottoman-bed', 'Super King', 609.00, 857.75),
    ('chiswick-slatted-ottoman-bed', 'Single', 299.00, 420.00),
    ('chiswick-slatted-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('chiswick-slatted-ottoman-bed', 'Double', 419.00, 581.94),
    ('chiswick-slatted-ottoman-bed', 'King', 449.00, 632.39),
    ('chiswick-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('greenwich-ottoman-bed', 'Single', 349.00, 420.00),
    ('greenwich-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('greenwich-ottoman-bed', 'Double', 439.00, 609.72),
    ('greenwich-ottoman-bed', 'King', 479.00, 674.65),
    ('greenwich-ottoman-bed', 'Super King', 529.00, 745.07),
    ('camden-slatted-ottoman-bed', 'Single', 399.00, 478.80),
    ('camden-slatted-ottoman-bed', 'Small Double', 479.00, 606.33),
    ('camden-slatted-ottoman-bed', 'Double', 499.00, 693.06),
    ('camden-slatted-ottoman-bed', 'King', 579.00, 815.49),
    ('camden-slatted-ottoman-bed', 'Super King', 609.00, 857.75),
    ('notting-hill-slatted-ottoman-bed', 'Double', 799.00, 1109.72),
    ('notting-hill-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('notting-hill-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('marylebone-ottoman-bed', 'Single', 349.00, 549.00),
    ('marylebone-ottoman-bed', 'Small Double', 489.00, 618.99),
    ('marylebone-ottoman-bed', 'Double', 499.00, 693.06),
    ('marylebone-ottoman-bed', 'King', 549.00, 773.24),
    ('marylebone-ottoman-bed', 'Super King', 589.00, 829.58),
    ('highgate-slatted-ottoman-bed', 'Single', 349.00, 420.00),
    ('highgate-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('highgate-slatted-ottoman-bed', 'Double', 439.00, 609.72),
    ('highgate-slatted-ottoman-bed', 'King', 479.00, 674.65),
    ('highgate-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('hampstead-slatted-ottoman-bed', 'Single', 299.00, 414.00),
    ('hampstead-slatted-ottoman-bed', 'Small Double', 349.00, 441.77),
    ('hampstead-slatted-ottoman-bed', 'Double', 389.00, 540.28),
    ('hampstead-slatted-ottoman-bed', 'King', 419.00, 590.14),
    ('hampstead-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('clapham-ottoman-bed', 'Single', 389.00, 499.00),
    ('clapham-ottoman-bed', 'Small Double', 439.00, 555.70),
    ('clapham-ottoman-bed', 'Double', 449.00, 623.61),
    ('clapham-ottoman-bed', 'King', 499.00, 702.82),
    ('clapham-ottoman-bed', 'Super King', 549.00, 773.24),
    ('islington-slatted-ottoman-bed', 'Single', 249.00, 420.00),
    ('islington-slatted-ottoman-bed', 'Small Double', 339.00, 429.11),
    ('islington-slatted-ottoman-bed', 'Double', 389.00, 540.28),
    ('islington-slatted-ottoman-bed', 'King', 429.00, 604.23),
    ('islington-slatted-ottoman-bed', 'Super King', 449.00, 632.39),
    ('shoreditch-slatted-ottoman-bed', 'Single', 299.00, 360.00),
    ('shoreditch-slatted-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('shoreditch-slatted-ottoman-bed', 'Double', 409.00, 568.06),
    ('shoreditch-slatted-ottoman-bed', 'King', 449.00, 632.39),
    ('shoreditch-slatted-ottoman-bed', 'Super King', 469.00, 660.56),
    ('southbank-ottoman-bed', 'Single', 319.00, 420.00),
    ('southbank-ottoman-bed', 'Small Double', 379.00, 479.75),
    ('southbank-ottoman-bed', 'Double', 409.00, 568.06),
    ('southbank-ottoman-bed', 'King', 449.00, 632.39),
    ('southbank-ottoman-bed', 'Super King', 499.00, 702.82),
    ('kew-slatted-ottoman-bed', 'Double', 789.00, 1095.83),
    ('kew-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('kew-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('putney-slatted-ottoman-bed', 'Small Double', 749.00, 948.10),
    ('putney-slatted-ottoman-bed', 'Double', 799.00, 1109.72),
    ('putney-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('putney-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('wimbledon-ottoman-bed', 'Single', 349.00, 420.00),
    ('wimbledon-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('wimbledon-ottoman-bed', 'Double', 439.00, 609.72),
    ('wimbledon-ottoman-bed', 'King', 479.00, 674.65),
    ('wimbledon-ottoman-bed', 'Super King', 529.00, 745.07),
    ('dulwich-slatted-ottoman-bed', 'Single', 299.00, 420.00),
    ('dulwich-slatted-ottoman-bed', 'Small Double', 439.00, 555.70),
    ('dulwich-slatted-ottoman-bed', 'Double', 465.00, 645.83),
    ('dulwich-slatted-ottoman-bed', 'King', 499.00, 702.82),
    ('dulwich-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('ealing-slatted-ottoman-bed', 'Single', 290.00, 396.00),
    ('ealing-slatted-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('ealing-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('ealing-slatted-ottoman-bed', 'King', 449.00, 632.39),
    ('ealing-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('harrow-ottoman-bed', 'Single', 349.00, 456.00),
    ('harrow-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('harrow-ottoman-bed', 'Double', 429.00, 595.83),
    ('harrow-ottoman-bed', 'King', 499.00, 702.82),
    ('harrow-ottoman-bed', 'Super King', 549.00, 773.24),
    ('barnet-slatted-ottoman-bed', 'Single', 299.00, 399.00),
    ('barnet-slatted-ottoman-bed', 'Small Double', 349.00, 441.77),
    ('barnet-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('barnet-slatted-ottoman-bed', 'King', 499.00, 702.82),
    ('barnet-slatted-ottoman-bed', 'Super King', 589.00, 829.58),
    ('farringdon-slatted-ottoman-bed', 'Double', 599.00, 831.94),
    ('farringdon-slatted-ottoman-bed', 'King', 699.00, 984.51),
    ('farringdon-slatted-ottoman-bed', 'Super King', 719.00, 1012.68),
    ('barbican-slatted-ottoman-bed', 'Single', 319.00, 372.00),
    ('barbican-slatted-ottoman-bed', 'Small Double', 314.99, 398.72),
    ('barbican-slatted-ottoman-bed', 'Double', 399.00, 554.17),
    ('barbican-slatted-ottoman-bed', 'King', 429.00, 604.23),
    ('barbican-slatted-ottoman-bed', 'Super King', 469.00, 660.56),
    ('angel-ottoman-bed', 'Small Double', 749.00, 948.10),
    ('angel-ottoman-bed', 'Double', 799.00, 1109.72),
    ('angel-ottoman-bed', 'King', 849.00, 1195.77),
    ('angel-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('finsbury-slatted-ottoman-bed', 'Single', 299.00, 420.00),
    ('finsbury-slatted-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('finsbury-slatted-ottoman-bed', 'Double', 409.00, 568.06),
    ('finsbury-slatted-ottoman-bed', 'King', 449.00, 632.39),
    ('finsbury-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('whitechapel-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('whitechapel-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('whitechapel-slatted-ottoman-bed', 'King', 458.99, 646.46),
    ('whitechapel-slatted-ottoman-bed', 'Super King', 499.00, 702.82),
    ('aldgate-ottoman-bed', 'Single', 389.00, 499.00),
    ('aldgate-ottoman-bed', 'Small Double', 439.00, 555.70),
    ('aldgate-ottoman-bed', 'Double', 449.00, 623.61),
    ('aldgate-ottoman-bed', 'King', 499.00, 702.82),
    ('aldgate-ottoman-bed', 'Super King', 549.00, 773.24),
    ('stratford-slatted-ottoman-bed', 'Single', 295.00, 456.00),
    ('stratford-slatted-ottoman-bed', 'Small Double', 399.00, 505.06),
    ('stratford-slatted-ottoman-bed', 'Double', 429.00, 595.83),
    ('stratford-slatted-ottoman-bed', 'King', 489.00, 688.73),
    ('stratford-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('hackney-wick-slatted-ottoman-bed', 'Single', 294.00, 420.00),
    ('hackney-wick-slatted-ottoman-bed', 'Small Double', 409.00, 517.72),
    ('hackney-wick-slatted-ottoman-bed', 'Double', 439.00, 609.72),
    ('hackney-wick-slatted-ottoman-bed', 'King', 479.00, 674.65),
    ('hackney-wick-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('bow-ottoman-bed', 'Small Double', 749.00, 948.10),
    ('bow-ottoman-bed', 'Double', 779.00, 1081.94),
    ('bow-ottoman-bed', 'King', 819.00, 1153.52),
    ('bow-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('poplar-slatted-ottoman-bed', 'Single', 599.00, 800.00),
    ('poplar-slatted-ottoman-bed', 'Small Double', 699.00, 884.81),
    ('poplar-slatted-ottoman-bed', 'Double', 749.00, 1040.28),
    ('poplar-slatted-ottoman-bed', 'King', 799.00, 1125.35),
    ('poplar-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('limehouse-slatted-ottoman-bed', 'Single', 299.00, 599.00),
    ('limehouse-slatted-ottoman-bed', 'Small Double', 429.00, 543.04),
    ('limehouse-slatted-ottoman-bed', 'Double', 459.00, 637.50),
    ('limehouse-slatted-ottoman-bed', 'King', 499.00, 702.82),
    ('limehouse-slatted-ottoman-bed', 'Super King', 529.00, 745.07),
    ('rotherhithe-ottoman-bed', 'Single', 449.00, 520.00),
    ('rotherhithe-ottoman-bed', 'Small Double', 519.00, 656.96),
    ('rotherhithe-ottoman-bed', 'Double', 539.00, 748.61),
    ('rotherhithe-ottoman-bed', 'King', 599.00, 843.66),
    ('rotherhithe-ottoman-bed', 'Super King', 649.00, 914.08),
    ('deptford-slatted-ottoman-bed', 'Single', 539.00, 649.00),
    ('deptford-slatted-ottoman-bed', 'Small Double', 649.00, 821.52),
    ('deptford-slatted-ottoman-bed', 'Double', 699.00, 970.83),
    ('deptford-slatted-ottoman-bed', 'King', 799.00, 1125.35),
    ('deptford-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('new-cross-slatted-ottoman-bed', 'Double', 749.00, 1040.28),
    ('new-cross-slatted-ottoman-bed', 'King', 799.00, 1125.35),
    ('new-cross-slatted-ottoman-bed', 'Super King', 849.00, 1195.77),
    ('catford-ottoman-bed', 'Small Double', 549.00, 694.94),
    ('catford-ottoman-bed', 'Double', 599.00, 831.94),
    ('catford-ottoman-bed', 'King', 659.00, 928.17),
    ('catford-ottoman-bed', 'Super King', 699.00, 984.51),
    ('sydenham-slatted-ottoman-bed', 'Double', 799.00, 1109.72),
    ('sydenham-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('sydenham-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('crystal-palace-slatted-ottoman-bed', 'Double', 1199.00, 1665.28),
    ('crystal-palace-slatted-ottoman-bed', 'King', 1349.00, 1900.00),
    ('crystal-palace-slatted-ottoman-bed', 'Super King', 1699.00, 2392.96),
    ('norwood-ottoman-bed', 'Small Double', 549.00, 694.94),
    ('norwood-ottoman-bed', 'Double', 599.00, 831.94),
    ('norwood-ottoman-bed', 'King', 659.00, 928.17),
    ('norwood-ottoman-bed', 'Super King', 699.00, 984.51),
    ('streatham-slatted-ottoman-bed', 'Double', 799.00, 1109.72),
    ('streatham-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('streatham-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('balham-slatted-ottoman-bed', 'Double', 799.00, 1109.72),
    ('balham-slatted-ottoman-bed', 'King', 849.00, 1195.77),
    ('balham-slatted-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('tooting-ottoman-bed', 'Double', 799.00, 1109.72),
    ('tooting-ottoman-bed', 'King', 849.00, 1195.77),
    ('tooting-ottoman-bed', 'Super King', 899.00, 1266.20),
    ('earlsfield-slatted-ottoman-bed', 'Double', 849.00, 1179.17),
    ('earlsfield-slatted-ottoman-bed', 'King', 899.00, 1266.20),
    ('earlsfield-slatted-ottoman-bed', 'Super King', 949.00, 1336.62),
    ('raynes-park-slatted-ottoman-bed', 'Single', 299.00, 599.00),
    ('raynes-park-slatted-ottoman-bed', 'Small Double', 419.00, 530.38),
    ('raynes-park-slatted-ottoman-bed', 'Double', 449.00, 623.61),
    ('raynes-park-slatted-ottoman-bed', 'King', 499.00, 702.82),
    ('raynes-park-slatted-ottoman-bed', 'Super King', 509.00, 716.90),
    -- solid-base-ottomans
    ('solid-ottoman-bed-1', 'Small Double', 388.00, 491.14),
    ('solid-ottoman-bed-1', 'Double', 429.00, 595.83),
    ('solid-ottoman-bed-1', 'King', 459.00, 646.48),
    ('solid-ottoman-bed-1', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-2', 'Small Double', 359.00, 454.43),
    ('solid-ottoman-bed-2', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-2', 'King', 439.00, 618.31),
    ('solid-ottoman-bed-2', 'Super King', 469.00, 660.56),
    ('solid-ottoman-bed-3', 'Small Double', 367.50, 465.19),
    ('solid-ottoman-bed-3', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-3', 'King', 439.00, 618.31),
    ('solid-ottoman-bed-3', 'Super King', 469.00, 660.56),
    ('solid-ottoman-bed-4', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-4', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-4', 'King', 458.99, 646.46),
    ('solid-ottoman-bed-4', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-5', 'Small Double', 383.99, 486.06),
    ('solid-ottoman-bed-5', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-5', 'King', 489.00, 688.73),
    ('solid-ottoman-bed-5', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-6', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-6', 'Double', 439.00, 609.72),
    ('solid-ottoman-bed-6', 'King', 459.00, 646.48),
    ('solid-ottoman-bed-6', 'Super King', 509.00, 716.90),
    ('solid-ottoman-bed-7', 'Small Double', 369.00, 467.09),
    ('solid-ottoman-bed-7', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-7', 'King', 419.00, 590.14),
    ('solid-ottoman-bed-7', 'Super King', 479.00, 674.65),
    ('solid-ottoman-bed-8', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-8', 'Double', 429.00, 595.83),
    ('solid-ottoman-bed-8', 'King', 459.00, 646.48),
    ('solid-ottoman-bed-8', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-9', 'Small Double', 439.00, 555.70),
    ('solid-ottoman-bed-9', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-9', 'King', 499.00, 702.82),
    ('solid-ottoman-bed-9', 'Super King', 549.00, 773.24),
    ('solid-ottoman-bed-10', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-10', 'Double', 425.00, 590.28),
    ('solid-ottoman-bed-10', 'King', 459.00, 646.48),
    ('solid-ottoman-bed-10', 'Super King', 485.00, 683.10),
    ('solid-ottoman-bed-11', 'Small Double', 339.00, 429.11),
    ('solid-ottoman-bed-11', 'Double', 349.00, 484.72),
    ('solid-ottoman-bed-11', 'King', 399.00, 561.97),
    ('solid-ottoman-bed-11', 'Super King', 419.00, 590.14),
    ('solid-ottoman-bed-12', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-12', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-12', 'King', 489.00, 688.73),
    ('solid-ottoman-bed-12', 'Super King', 549.00, 773.24),
    ('solid-ottoman-bed-13', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-13', 'Double', 419.00, 581.94),
    ('solid-ottoman-bed-13', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-13', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-14', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-14', 'Double', 439.00, 609.72),
    ('solid-ottoman-bed-14', 'King', 479.00, 674.65),
    ('solid-ottoman-bed-14', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-15', 'Small Double', 479.00, 606.33),
    ('solid-ottoman-bed-15', 'Double', 499.00, 693.06),
    ('solid-ottoman-bed-15', 'King', 579.00, 815.49),
    ('solid-ottoman-bed-15', 'Super King', 609.00, 857.75),
    ('solid-ottoman-bed-16', 'Small Double', 489.00, 618.99),
    ('solid-ottoman-bed-16', 'Double', 499.00, 693.06),
    ('solid-ottoman-bed-16', 'King', 549.00, 773.24),
    ('solid-ottoman-bed-16', 'Super King', 589.00, 829.58),
    ('solid-ottoman-bed-17', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-17', 'Double', 439.00, 609.72),
    ('solid-ottoman-bed-17', 'King', 479.00, 674.65),
    ('solid-ottoman-bed-17', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-18', 'Small Double', 349.00, 441.77),
    ('solid-ottoman-bed-18', 'Double', 389.00, 540.28),
    ('solid-ottoman-bed-18', 'King', 419.00, 590.14),
    ('solid-ottoman-bed-18', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-19', 'Small Double', 439.00, 555.70),
    ('solid-ottoman-bed-19', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-19', 'King', 499.00, 702.82),
    ('solid-ottoman-bed-19', 'Super King', 549.00, 773.24),
    ('solid-ottoman-bed-20', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-20', 'Double', 409.00, 568.06),
    ('solid-ottoman-bed-20', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-20', 'Super King', 469.00, 660.56),
    ('solid-ottoman-bed-21', 'Small Double', 379.00, 479.75),
    ('solid-ottoman-bed-21', 'Double', 409.00, 568.06),
    ('solid-ottoman-bed-21', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-21', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-22', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-22', 'Double', 439.00, 609.72),
    ('solid-ottoman-bed-22', 'King', 479.00, 674.65),
    ('solid-ottoman-bed-22', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-23', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-23', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-23', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-23', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-24', 'Small Double', 439.00, 555.70),
    ('solid-ottoman-bed-24', 'Double', 465.00, 645.83),
    ('solid-ottoman-bed-24', 'King', 499.00, 702.82),
    ('solid-ottoman-bed-24', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-25', 'Small Double', 469.00, 593.67),
    ('solid-ottoman-bed-25', 'Double', 489.00, 679.17),
    ('solid-ottoman-bed-25', 'King', 549.00, 773.24),
    ('solid-ottoman-bed-25', 'Super King', 599.00, 843.66),
    ('solid-ottoman-bed-26', 'Small Double', 499.00, 631.65),
    ('solid-ottoman-bed-26', 'Double', 529.00, 734.72),
    ('solid-ottoman-bed-26', 'King', 549.00, 773.24),
    ('solid-ottoman-bed-26', 'Super King', 599.00, 843.66),
    ('solid-ottoman-bed-27', 'Small Double', 375.00, 474.68),
    ('solid-ottoman-bed-27', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-27', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-27', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-28', 'Small Double', 599.00, 758.23),
    ('solid-ottoman-bed-28', 'Double', 649.00, 901.39),
    ('solid-ottoman-bed-28', 'King', 749.00, 1054.93),
    ('solid-ottoman-bed-28', 'Super King', 849.00, 1195.77),
    ('solid-ottoman-bed-29', 'Small Double', 479.00, 606.33),
    ('solid-ottoman-bed-29', 'Double', 499.00, 693.06),
    ('solid-ottoman-bed-29', 'King', 539.00, 759.15),
    ('solid-ottoman-bed-29', 'Super King', 599.00, 843.66),
    ('solid-ottoman-bed-30', 'Small Double', 449.00, 568.35),
    ('solid-ottoman-bed-30', 'Double', 479.00, 665.28),
    ('solid-ottoman-bed-30', 'King', 489.00, 688.73),
    ('solid-ottoman-bed-30', 'Super King', 539.00, 759.15),
    ('solid-ottoman-bed-31', 'Small Double', 449.00, 568.35),
    ('solid-ottoman-bed-31', 'Double', 489.00, 679.17),
    ('solid-ottoman-bed-31', 'King', 529.00, 745.07),
    ('solid-ottoman-bed-31', 'Super King', 549.00, 773.24),
    ('solid-ottoman-bed-32', 'Small Double', 449.00, 568.35),
    ('solid-ottoman-bed-32', 'Double', 459.00, 637.50),
    ('solid-ottoman-bed-32', 'King', 474.00, 667.61),
    ('solid-ottoman-bed-32', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-33', 'Small Double', 389.00, 492.41),
    ('solid-ottoman-bed-33', 'Double', 399.00, 554.17),
    ('solid-ottoman-bed-33', 'King', 439.00, 618.31),
    ('solid-ottoman-bed-33', 'Super King', 489.00, 688.73),
    ('solid-ottoman-bed-34', 'Small Double', 549.00, 694.94),
    ('solid-ottoman-bed-34', 'Double', 549.00, 762.50),
    ('solid-ottoman-bed-34', 'King', 749.00, 1054.93),
    ('solid-ottoman-bed-34', 'Super King', 649.00, 914.08),
    ('solid-ottoman-bed-35', 'Small Double', 599.00, 758.23),
    ('solid-ottoman-bed-35', 'Double', 649.00, 901.39),
    ('solid-ottoman-bed-35', 'King', 699.00, 984.51),
    ('solid-ottoman-bed-35', 'Super King', 749.00, 1054.93),
    ('solid-ottoman-bed-36', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-36', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-36', 'King', 489.00, 688.73),
    ('solid-ottoman-bed-36', 'Super King', 539.00, 759.15),
    ('solid-ottoman-bed-37', 'Small Double', 389.00, 492.41),
    ('solid-ottoman-bed-37', 'Double', 419.00, 581.94),
    ('solid-ottoman-bed-37', 'King', 439.00, 618.31),
    ('solid-ottoman-bed-37', 'Super King', 489.00, 688.73),
    ('solid-ottoman-bed-38', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-38', 'Double', 429.00, 595.83),
    ('solid-ottoman-bed-38', 'King', 459.00, 646.48),
    ('solid-ottoman-bed-38', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-39', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-39', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-39', 'King', 458.99, 646.46),
    ('solid-ottoman-bed-39', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-40', 'Small Double', 399.00, 505.06),
    ('solid-ottoman-bed-40', 'Double', 409.00, 568.06),
    ('solid-ottoman-bed-40', 'King', 449.00, 632.39),
    ('solid-ottoman-bed-40', 'Super King', 499.00, 702.82),
    ('solid-ottoman-bed-41', 'Small Double', 439.00, 555.70),
    ('solid-ottoman-bed-41', 'Double', 449.00, 623.61),
    ('solid-ottoman-bed-41', 'King', 499.00, 702.82),
    ('solid-ottoman-bed-41', 'Super King', 549.00, 773.24),
    ('solid-ottoman-bed-42', 'Small Double', 409.00, 517.72),
    ('solid-ottoman-bed-42', 'Double', 439.00, 609.72),
    ('solid-ottoman-bed-42', 'King', 479.00, 674.65),
    ('solid-ottoman-bed-42', 'Super King', 529.00, 745.07),
    ('solid-ottoman-bed-43', 'Small Double', 649.00, 821.52),
    ('solid-ottoman-bed-43', 'Double', 699.00, 970.83),
    ('solid-ottoman-bed-43', 'King', 799.00, 1125.35),
    ('solid-ottoman-bed-43', 'Super King', 899.00, 1266.20),
    ('solid-ottoman-bed-44', 'Small Double', 549.00, 694.94),
    ('solid-ottoman-bed-44', 'Double', 599.00, 831.94),
    ('solid-ottoman-bed-44', 'King', 659.00, 928.17),
    ('solid-ottoman-bed-44', 'Super King', 699.00, 984.51),
    ('solid-ottoman-bed-45', 'Small Double', 549.00, 694.94),
    ('solid-ottoman-bed-45', 'Double', 599.00, 831.94),
    ('solid-ottoman-bed-45', 'King', 659.00, 928.17),
    ('solid-ottoman-bed-45', 'Super King', 699.00, 984.51),
    -- storage-drawers
    ('storage-drawer-1', 'Small Double', 384.00, 486.08),
    ('storage-drawer-1', 'Double', 394.00, 547.22),
    ('storage-drawer-1', 'King', 444.00, 625.35),
    ('storage-drawer-1', 'Super King', 480.00, 676.06),
    ('storage-drawer-2', 'Small Double', 384.00, 486.08),
    ('storage-drawer-2', 'Double', 394.00, 547.22),
    ('storage-drawer-2', 'King', 444.00, 625.35),
    ('storage-drawer-2', 'Super King', 480.00, 676.06),
    ('storage-drawer-3', 'Small Double', 384.00, 486.08),
    ('storage-drawer-3', 'Double', 394.00, 547.22),
    ('storage-drawer-3', 'King', 444.00, 625.35),
    ('storage-drawer-3', 'Super King', 480.00, 676.06),
    ('storage-drawer-4', 'Small Double', 444.00, 562.03),
    ('storage-drawer-4', 'Double', 414.00, 575.00),
    ('storage-drawer-4', 'King', 524.00, 738.03),
    ('storage-drawer-4', 'Super King', 564.00, 794.37),
    ('storage-drawer-5', 'Small Double', 384.00, 486.08),
    ('storage-drawer-5', 'Double', 394.00, 547.22),
    ('storage-drawer-5', 'King', 444.00, 625.35),
    ('storage-drawer-5', 'Super King', 484.00, 681.69),
    ('storage-drawer-6', 'Small Double', 394.00, 498.73),
    ('storage-drawer-6', 'Double', 404.00, 561.11),
    ('storage-drawer-6', 'King', 454.00, 639.44),
    ('storage-drawer-6', 'Super King', 490.00, 690.14),
    ('storage-drawer-7', 'Small Double', 394.00, 498.73),
    ('storage-drawer-7', 'Double', 404.00, 561.11),
    ('storage-drawer-7', 'King', 454.00, 639.44),
    ('storage-drawer-7', 'Super King', 490.00, 690.14),
    ('storage-drawer-8', 'Small Double', 455.00, 575.95),
    ('storage-drawer-8', 'Double', 455.00, 631.94),
    ('storage-drawer-8', 'King', 475.00, 669.01),
    ('storage-drawer-8', 'Super King', 525.00, 739.44),
    ('storage-drawer-9', 'Small Double', 384.00, 486.08),
    ('storage-drawer-9', 'Double', 394.00, 547.22),
    ('storage-drawer-9', 'King', 434.00, 611.27),
    ('storage-drawer-9', 'Super King', 454.00, 639.44),
    ('storage-drawer-10', 'Small Double', 299.00, 378.48),
    ('storage-drawer-10', 'Double', 299.00, 415.28),
    ('storage-drawer-10', 'King', 299.00, 421.13),
    ('storage-drawer-10', 'Super King', 299.00, 421.13),
    -- tv-beds
    ('tv-bed-1', 'Double', 999.00, 1387.50),
    ('tv-bed-1', 'King', 1099.00, 1547.89),
    ('tv-bed-1', 'Super King', 1199.00, 1688.73),
    ('tv-bed-2', 'Double', 990.00, 1375.00),
    ('tv-bed-2', 'King', 1094.00, 1540.85),
    ('tv-bed-2', 'Super King', 1190.00, 1676.06),
    ('tv-bed-3', 'Double', 1099.00, 1526.39),
    ('tv-bed-3', 'King', 1299.00, 1829.58),
    ('tv-bed-3', 'Super King', 1399.00, 1970.42),
    ('tv-bed-4', 'Double', 999.00, 1387.50),
    ('tv-bed-4', 'King', 1099.00, 1547.89),
    ('tv-bed-4', 'Super King', 1199.00, 1688.73),
    -- kids-beds
    ('kids-bed-1', 'Small Double', 489.00, 618.99),
    ('kids-bed-2', 'Small Double', 489.00, 618.99),
    ('kids-bed-3', 'Small Double', 489.00, 618.99),
    ('kids-bed-4', 'Small Double', 489.00, 618.99),
    ('kids-bed-5', 'Small Double', 549.00, 694.94),
    -- high-headboard-beds
    ('high-headboard-bed-1', 'Double', 799.00, 1109.72),
    ('high-headboard-bed-1', 'King', 849.00, 1195.77),
    ('high-headboard-bed-1', 'Super King', 899.00, 1266.20),
    ('high-headboard-bed-2', 'Small Double', 749.00, 948.10),
    ('high-headboard-bed-2', 'Double', 799.00, 1109.72),
    ('high-headboard-bed-2', 'King', 849.00, 1195.77),
    ('high-headboard-bed-2', 'Super King', 899.00, 1266.20),
    ('high-headboard-bed-3', 'Small Double', 699.00, 884.81),
    ('high-headboard-bed-3', 'Double', 749.00, 1040.28),
    ('high-headboard-bed-3', 'King', 799.00, 1125.35),
    ('high-headboard-bed-3', 'Super King', 849.00, 1195.77),
    ('high-headboard-bed-4', 'Small Double', 449.00, 568.35),
    ('high-headboard-bed-4', 'Double', 489.00, 679.17),
    ('high-headboard-bed-4', 'King', 529.00, 745.07),
    ('high-headboard-bed-4', 'Super King', 549.00, 773.24),
    ('high-headboard-bed-5', 'Small Double', 649.00, 821.52),
    ('high-headboard-bed-5', 'Double', 699.00, 970.83),
    ('high-headboard-bed-5', 'King', 799.00, 1125.35),
    ('high-headboard-bed-5', 'Super King', 849.00, 1195.77),
    ('high-headboard-bed-6', 'Small Double', 599.00, 758.23),
    ('high-headboard-bed-6', 'Double', 649.00, 901.39),
    ('high-headboard-bed-6', 'King', 699.00, 984.51),
    ('high-headboard-bed-6', 'Super King', 749.00, 1054.93),
    ('high-headboard-bed-7', 'Double', 749.00, 1040.28),
    ('high-headboard-bed-7', 'King', 799.00, 1125.35),
    ('high-headboard-bed-7', 'Super King', 829.00, 1167.61),
    ('high-headboard-bed-8', 'Small Double', 749.00, 948.10),
    ('high-headboard-bed-8', 'Double', 799.00, 1109.72),
    ('high-headboard-bed-8', 'King', 849.00, 1195.77),
    ('high-headboard-bed-8', 'Super King', 899.00, 1266.20),
    ('high-headboard-bed-9', 'Double', 749.00, 1040.28),
    ('high-headboard-bed-9', 'King', 799.00, 1125.35),
    ('high-headboard-bed-9', 'Super King', 849.00, 1195.77),
    ('high-headboard-bed-10', 'Small Double', 549.00, 694.94),
    ('high-headboard-bed-10', 'Double', 599.00, 831.94),
    ('high-headboard-bed-10', 'King', 659.00, 928.17),
    ('high-headboard-bed-10', 'Super King', 699.00, 984.51),
    ('high-headboard-bed-11', 'Double', 799.00, 1109.72),
    ('high-headboard-bed-11', 'King', 849.00, 1195.77),
    ('high-headboard-bed-11', 'Super King', 899.00, 1266.20),
    ('high-headboard-bed-12', 'Double', 1199.00, 1665.28),
    ('high-headboard-bed-12', 'King', 1349.00, 1900.00),
    ('high-headboard-bed-12', 'Super King', 1699.00, 2392.96),
    ('high-headboard-bed-13', 'Small Double', 549.00, 694.94),
    ('high-headboard-bed-13', 'Double', 599.00, 831.94),
    ('high-headboard-bed-13', 'King', 659.00, 928.17),
    ('high-headboard-bed-13', 'Super King', 699.00, 984.51),
    ('high-headboard-bed-14', 'Double', 799.00, 1109.72),
    ('high-headboard-bed-14', 'King', 849.00, 1195.77),
    ('high-headboard-bed-14', 'Super King', 899.00, 1266.20),
    -- sofas
    ('chesterfield-3-seater-sofa', '2 Seater Sofa', 999.00, 1998.00),
    ('chesterfield-3-seater-sofa', '3 Seater Sofa', 1199.00, 2398.00),
    ('harlow-modular-sofa', '2 Seater Sofa', 999.00, 1998.00),
    ('harlow-modular-sofa', '3 Seater Sofa', 1199.00, 2398.00);

DO $$
DECLARE
    expected  INTEGER := 565;
    loaded    INTEGER;
    matched   INTEGER;
    problem   TEXT;
BEGIN
    SELECT count(*) INTO loaded FROM frontend_old_prices;
    IF loaded <> expected THEN
        RAISE EXCEPTION 'Expected % frontend rows, found %', expected, loaded;
    END IF;

    -- Every row must match exactly one size of one product, with the same sale price.
    SELECT string_agg(f.slug || ' / ' || f.size ||
             CASE WHEN v.id IS NULL THEN ' (product or size not found)'
                  ELSE ' (sale price in database ' || v.price || ', frontend ' || f.sale_price || ')' END, '; ')
      INTO problem
      FROM frontend_old_prices f
      LEFT JOIN products p ON p.slug = f.slug
      LEFT JOIN product_variants v ON v.product_id = p.id AND v.option_value = f.size
     WHERE v.id IS NULL OR v.price <> f.sale_price;
    IF problem IS NOT NULL THEN
        RAISE EXCEPTION 'Stopped, nothing changed. Not matching: %', problem;
    END IF;

    SELECT count(*) INTO matched
      FROM frontend_old_prices f
      JOIN products p ON p.slug = f.slug
      JOIN product_variants v ON v.product_id = p.id AND v.option_value = f.size AND v.price = f.sale_price;
    IF matched <> expected THEN
        RAISE EXCEPTION 'Expected % matching sizes, found %', expected, matched;
    END IF;

    -- Every old price must be higher than its sale price (the table check also enforces this).
    IF EXISTS (SELECT 1 FROM frontend_old_prices WHERE old_price <= sale_price) THEN
        RAISE EXCEPTION 'An old price is not higher than its sale price';
    END IF;
END $$;

-- Keep the values that are about to be replaced.
INSERT INTO pricing_sync_backup (product_variant_id, previous_compare_at, new_compare_at, source)
SELECT v.id, v.compare_at_price, f.old_price, 'sync_frontend_pricing.sql'
  FROM frontend_old_prices f
  JOIN products p ON p.slug = f.slug
  JOIN product_variants v ON v.product_id = p.id AND v.option_value = f.size AND v.price = f.sale_price
 WHERE v.compare_at_price IS DISTINCT FROM f.old_price;

-- The only change: the old price of each listed size.
UPDATE product_variants v
   SET compare_at_price = f.old_price,
       updated_at = CURRENT_TIMESTAMP
  FROM frontend_old_prices f, products p
 WHERE p.slug = f.slug
   AND v.product_id = p.id
   AND v.option_value = f.size
   AND v.price = f.sale_price
   AND v.compare_at_price IS DISTINCT FROM f.old_price;

-- Final checks: no sale price changed, nothing disappeared, every size now has its frontend old price.
DO $$
DECLARE
    bad INTEGER;
BEGIN
    SELECT count(*) INTO bad
      FROM pricing_before b
      LEFT JOIN product_variants v ON v.id = b.id
      LEFT JOIN products p ON p.id = v.product_id
     WHERE v.id IS NULL OR v.price <> b.variant_price OR p.price <> b.product_price;
    IF bad > 0 THEN
        RAISE EXCEPTION 'Stopped, nothing changed: % sale prices/sizes would have changed', bad;
    END IF;

    SELECT count(*) INTO bad
      FROM frontend_old_prices f
      JOIN products p ON p.slug = f.slug
      JOIN product_variants v ON v.product_id = p.id AND v.option_value = f.size
     WHERE v.compare_at_price IS DISTINCT FROM f.old_price;
    IF bad > 0 THEN
        RAISE EXCEPTION 'Stopped, nothing changed: % sizes did not get their old price', bad;
    END IF;
END $$;

COMMIT;

-- Optional look at the result (read-only):
-- SELECT p.slug, pp.size_label, pp.sale_price, pp.original_price,
--        pp.discount_percentage, pp.savings, pp.monthly_from
--   FROM product_pricing pp JOIN products p ON p.id = pp.product_id
--  ORDER BY p.id, pp.size_label;