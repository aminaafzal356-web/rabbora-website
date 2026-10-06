-- =====================================================================
-- Rabbora Living — verify the cart tables (READ-ONLY: SELECT only)
-- Run AFTER carts.sql, in pgAdmin > Query Tool on the "rabbora" database.
-- Nothing here changes any data.
-- =====================================================================

-- 1. Both tables exist (expect 2 rows: cart_items, carts)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('carts', 'cart_items')
ORDER BY table_name;

-- 2. cart_items columns (expect 17 rows)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'cart_items'
ORDER BY ordinal_position;

-- 3. All constraints on carts and cart_items (expect 15 rows)
SELECT conrelid::regclass AS table_name, conname AS constraint_name,
       pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid IN ('carts'::regclass, 'cart_items'::regclass)
ORDER BY 1, 2;

-- 4. All indexes on carts and cart_items (expect 7 rows)
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename IN ('carts', 'cart_items')
ORDER BY tablename, indexname;

-- 5. One-row summary: compare each number with its 'expect' note
SELECT
  (SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('carts','cart_items'))                    AS tables_found,      -- expect 2
  (SELECT count(*) FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cart_items')                              AS cart_item_columns, -- expect 17
  (SELECT count(*) FROM pg_constraint WHERE conrelid = 'cart_items'::regclass
    AND conname IN ('cart_items_cart_line_unique','cart_items_variant_same_product',
                    'cart_items_quantity_positive','cart_items_unit_price_not_negative',
                    'cart_items_name_not_empty','cart_items_frontend_product_id_valid',
                    'cart_items_options_is_object','cart_items_line_key_matches_product',
                    'cart_items_line_key_max_size'))                                           AS key_constraints,   -- expect 9
  (SELECT count(*) FROM pg_constraint WHERE conrelid = 'carts'::regclass
    AND conname = 'carts_user_id_unique')                                                      AS one_cart_per_user, -- expect 1
  (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public'
    AND indexname IN ('idx_cart_items_cart_id','idx_cart_items_product_id',
                      'idx_cart_items_product_variant_id'))                                    AS indexes_found,     -- expect 3
  (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public'
    AND indexname IN ('cart_items_unique_product_variant',
                      'cart_items_unique_product_no_variant'))                                 AS old_wrong_indexes, -- expect 0
  (SELECT count(*) FROM carts)                                                                 AS carts_rows,        -- expect 0
  (SELECT count(*) FROM cart_items)                                                            AS cart_item_rows,    -- expect 0
  (SELECT count(*) FROM products)                                                              AS products_rows;     -- expect 158