-- =====================================================================
-- Rabbora Living — Blanket Box products (categories, products, product_variants)
-- File: backend/database/migrate_blanket_boxes.sql
-- ---------------------------------------------------------------------
-- Adds the seven Blanket Box products shown on blanket-boxes.html, each with
-- its five width sizes (3ft Wide to 6ft Wide): 7 products, 35 width rows.
-- Names, slugs, descriptions, first photo and prices are copied from
-- blanket-boxes.js (BB_PRODUCTS and BB_WIDTH_PRICES). Nothing is invented.
--
-- Same pattern as migrate_products.sql:
--   * products.price = the lowest width price.
--   * Width text is stored exactly as the page sends it, e.g. "3ft Wide".
--   * Fabric is NOT a database row. The cart keeps the chosen fabric in the
--     line options, as it does for every other product.
--   * stock_quantity = 0 (same as every other product; no stock tracking).
--
-- Safety:
--   * One transaction. Any failed check raises an error and nothing is saved.
--   * Insert-only. Existing rows are never changed or deleted.
--   * Safe to run again: existing slugs, and existing width rows for the same
--     product, are left as they are; the final check then confirms them.
--   * Stops if a Blanket Box name already exists under a different slug.
--   * Does not touch users, orders, carts, Stripe, or any other product.
--
-- Run ONCE in the Supabase SQL editor, only after review and approval.
-- =====================================================================

BEGIN;

-- 0. Pre-check: stop if a Blanket Box name already exists under another slug.
DO $$
DECLARE
  clash INTEGER;
BEGIN
  SELECT count(*) INTO clash
    FROM products
   WHERE name IN ('Manhattan Style Blanket Box', 'Chesterfield Blanket Box', 'Luxury Storage Blanket Box', 'Ottoman Style Blanket Box', 'Premium Fabric Blanket Box', 'Classic Blanket Box', 'Plush Storage Blanket Box')
     AND slug NOT IN ('manhattan-style-blanket-box', 'chesterfield-blanket-box', 'luxury-storage-blanket-box', 'ottoman-style-blanket-box', 'premium-fabric-blanket-box', 'classic-blanket-box', 'plush-storage-blanket-box');
  IF clash > 0 THEN
    RAISE EXCEPTION 'Stopped, nothing saved: % existing product(s) use a Blanket Box name under a different slug.', clash;
  END IF;
END $$;

-- 1. Category (found again by slug; an existing row is left as it is).
INSERT INTO categories (name, slug) VALUES
  ('Blanket Boxes', 'blanket-boxes')
ON CONFLICT (slug) DO NOTHING;

-- 2. Products (found again by slug; an existing row is left as it is).
INSERT INTO products (name, slug, description, price, category_id, main_image, stock_quantity, is_active)
SELECT v.name::varchar, v.slug::varchar, v.description::text, v.price::numeric(10,2), c.id, v.main_image::text, 0, TRUE
FROM (VALUES
  ('Manhattan Style Blanket Box', 'manhattan-style-blanket-box', 'The Manhattan Style Blanket Box brings a clean, contemporary look to any bedroom. Its tailored fabric finish and understated silhouette make it equally at home in a minimal city flat or a spacious main suite, while the deep interior keeps spare bedding, cushions and throws neatly out of sight.', 200.00, 'blanket/img-90.png'),
  ('Chesterfield Blanket Box', 'chesterfield-blanket-box', 'The Chesterfield Blanket Box pairs traditional deep-button detailing with practical everyday storage. It brings warmth and character to a bedroom while offering a sturdy, padded seat and generous space for bedding underneath.', 329.00, 'blanket/img-89.png'),
  ('Luxury Storage Blanket Box', 'luxury-storage-blanket-box', 'The Luxury Storage Blanket Box is designed to be the statement piece in your bedroom. Its rich, plush upholstery and extra-deep interior give you generous space for bulkier bedding, while the reinforced frame is built for daily use.', 200.00, 'blanket/img-88.png'),
  ('Ottoman Style Blanket Box', 'ottoman-style-blanket-box', 'The Ottoman Style Blanket Box brings a soft, textured finish to everyday storage. Its neutral tones and compact footprint make it a versatile addition to bedrooms of any size, with a practical lift-up lid for easy access.', 200.00, 'blanket/img-86.png'),
  ('Premium Fabric Blanket Box', 'premium-fabric-blanket-box', 'The Premium Fabric Blanket Box is finished in a soft, plush upholstery that feels as good as it looks. It offers a roomy interior for duvets and pillows, with tailored seams and a considered profile that suits a range of bedroom styles.', 200.00, 'blanket/img-85.png'),
  ('Classic Blanket Box', 'classic-blanket-box', 'The Classic Blanket Box keeps things simple with a timeless woven finish and a versatile silhouette that suits both modern and traditional bedrooms. It''s a practical, accessible way to add extra storage without compromising on style.', 200.00, 'blanket/img-84.png'),
  ('Plush Storage Blanket Box', 'plush-storage-blanket-box', 'The Plush Storage Blanket Box combines a warm, soft-touch finish with generous everyday storage. Its sturdy frame and padded lid make it a comfortable, practical addition to the end of the bed.', 200.00, 'blanket/img-87.png')
) AS v(name, slug, description, price, main_image)
JOIN categories c ON c.slug = 'blanket-boxes'
ON CONFLICT (slug) DO NOTHING;

-- 3. Width variants (one per product and width; existing rows are left as they are).
INSERT INTO product_variants (product_id, option_type, option_value, option_label, price, stock_quantity, width_cm, length_cm, sort_order, is_active)
SELECT p.id, 'width', v.width_value::varchar, v.width_value::varchar, v.price::numeric(10,2), 0, NULL, NULL, v.sort_order::smallint, TRUE
FROM (VALUES
  ('manhattan-style-blanket-box', '3ft Wide', 200.00, 0),
  ('manhattan-style-blanket-box', '4ft Wide', 240.00, 1),
  ('manhattan-style-blanket-box', '4.6ft Wide', 280.00, 2),
  ('manhattan-style-blanket-box', '5ft Wide', 290.00, 3),
  ('manhattan-style-blanket-box', '6ft Wide', 300.00, 4),
  ('chesterfield-blanket-box', '3ft Wide', 329.00, 0),
  ('chesterfield-blanket-box', '4ft Wide', 360.00, 1),
  ('chesterfield-blanket-box', '4.6ft Wide', 380.00, 2),
  ('chesterfield-blanket-box', '5ft Wide', 400.00, 3),
  ('chesterfield-blanket-box', '6ft Wide', 420.00, 4),
  ('luxury-storage-blanket-box', '3ft Wide', 200.00, 0),
  ('luxury-storage-blanket-box', '4ft Wide', 240.00, 1),
  ('luxury-storage-blanket-box', '4.6ft Wide', 280.00, 2),
  ('luxury-storage-blanket-box', '5ft Wide', 290.00, 3),
  ('luxury-storage-blanket-box', '6ft Wide', 300.00, 4),
  ('ottoman-style-blanket-box', '3ft Wide', 200.00, 0),
  ('ottoman-style-blanket-box', '4ft Wide', 240.00, 1),
  ('ottoman-style-blanket-box', '4.6ft Wide', 280.00, 2),
  ('ottoman-style-blanket-box', '5ft Wide', 290.00, 3),
  ('ottoman-style-blanket-box', '6ft Wide', 300.00, 4),
  ('premium-fabric-blanket-box', '3ft Wide', 200.00, 0),
  ('premium-fabric-blanket-box', '4ft Wide', 240.00, 1),
  ('premium-fabric-blanket-box', '4.6ft Wide', 280.00, 2),
  ('premium-fabric-blanket-box', '5ft Wide', 290.00, 3),
  ('premium-fabric-blanket-box', '6ft Wide', 300.00, 4),
  ('classic-blanket-box', '3ft Wide', 200.00, 0),
  ('classic-blanket-box', '4ft Wide', 200.00, 1),
  ('classic-blanket-box', '4.6ft Wide', 200.00, 2),
  ('classic-blanket-box', '5ft Wide', 200.00, 3),
  ('classic-blanket-box', '6ft Wide', 200.00, 4),
  ('plush-storage-blanket-box', '3ft Wide', 200.00, 0),
  ('plush-storage-blanket-box', '4ft Wide', 200.00, 1),
  ('plush-storage-blanket-box', '4.6ft Wide', 200.00, 2),
  ('plush-storage-blanket-box', '5ft Wide', 200.00, 3),
  ('plush-storage-blanket-box', '6ft Wide', 200.00, 4)
) AS v(product_slug, width_value, price, sort_order)
JOIN products p ON p.slug = v.product_slug
ON CONFLICT (product_id, option_value) DO NOTHING;

-- 4. Final check: any mismatch raises an error and rolls EVERYTHING back.
DO $$
DECLARE
  problems INTEGER;
  extra    INTEGER;
BEGIN
  -- Every expected product and width exists, is active, and has the exact price.
  SELECT count(*) INTO problems
    FROM (VALUES
  ('manhattan-style-blanket-box', 'Manhattan Style Blanket Box', '3ft Wide', 200.00),
  ('manhattan-style-blanket-box', 'Manhattan Style Blanket Box', '4ft Wide', 240.00),
  ('manhattan-style-blanket-box', 'Manhattan Style Blanket Box', '4.6ft Wide', 280.00),
  ('manhattan-style-blanket-box', 'Manhattan Style Blanket Box', '5ft Wide', 290.00),
  ('manhattan-style-blanket-box', 'Manhattan Style Blanket Box', '6ft Wide', 300.00),
  ('chesterfield-blanket-box', 'Chesterfield Blanket Box', '3ft Wide', 329.00),
  ('chesterfield-blanket-box', 'Chesterfield Blanket Box', '4ft Wide', 360.00),
  ('chesterfield-blanket-box', 'Chesterfield Blanket Box', '4.6ft Wide', 380.00),
  ('chesterfield-blanket-box', 'Chesterfield Blanket Box', '5ft Wide', 400.00),
  ('chesterfield-blanket-box', 'Chesterfield Blanket Box', '6ft Wide', 420.00),
  ('luxury-storage-blanket-box', 'Luxury Storage Blanket Box', '3ft Wide', 200.00),
  ('luxury-storage-blanket-box', 'Luxury Storage Blanket Box', '4ft Wide', 240.00),
  ('luxury-storage-blanket-box', 'Luxury Storage Blanket Box', '4.6ft Wide', 280.00),
  ('luxury-storage-blanket-box', 'Luxury Storage Blanket Box', '5ft Wide', 290.00),
  ('luxury-storage-blanket-box', 'Luxury Storage Blanket Box', '6ft Wide', 300.00),
  ('ottoman-style-blanket-box', 'Ottoman Style Blanket Box', '3ft Wide', 200.00),
  ('ottoman-style-blanket-box', 'Ottoman Style Blanket Box', '4ft Wide', 240.00),
  ('ottoman-style-blanket-box', 'Ottoman Style Blanket Box', '4.6ft Wide', 280.00),
  ('ottoman-style-blanket-box', 'Ottoman Style Blanket Box', '5ft Wide', 290.00),
  ('ottoman-style-blanket-box', 'Ottoman Style Blanket Box', '6ft Wide', 300.00),
  ('premium-fabric-blanket-box', 'Premium Fabric Blanket Box', '3ft Wide', 200.00),
  ('premium-fabric-blanket-box', 'Premium Fabric Blanket Box', '4ft Wide', 240.00),
  ('premium-fabric-blanket-box', 'Premium Fabric Blanket Box', '4.6ft Wide', 280.00),
  ('premium-fabric-blanket-box', 'Premium Fabric Blanket Box', '5ft Wide', 290.00),
  ('premium-fabric-blanket-box', 'Premium Fabric Blanket Box', '6ft Wide', 300.00),
  ('classic-blanket-box', 'Classic Blanket Box', '3ft Wide', 200.00),
  ('classic-blanket-box', 'Classic Blanket Box', '4ft Wide', 200.00),
  ('classic-blanket-box', 'Classic Blanket Box', '4.6ft Wide', 200.00),
  ('classic-blanket-box', 'Classic Blanket Box', '5ft Wide', 200.00),
  ('classic-blanket-box', 'Classic Blanket Box', '6ft Wide', 200.00),
  ('plush-storage-blanket-box', 'Plush Storage Blanket Box', '3ft Wide', 200.00),
  ('plush-storage-blanket-box', 'Plush Storage Blanket Box', '4ft Wide', 200.00),
  ('plush-storage-blanket-box', 'Plush Storage Blanket Box', '4.6ft Wide', 200.00),
  ('plush-storage-blanket-box', 'Plush Storage Blanket Box', '5ft Wide', 200.00),
  ('plush-storage-blanket-box', 'Plush Storage Blanket Box', '6ft Wide', 200.00)
    ) AS e(product_slug, product_name, width_value, price)
    LEFT JOIN products p ON p.slug = e.product_slug
    LEFT JOIN product_variants v
           ON v.product_id = p.id AND v.option_type = 'width' AND v.option_value = e.width_value
   WHERE p.id IS NULL
      OR p.name <> e.product_name
      OR v.id IS NULL
      OR v.is_active IS NOT TRUE
      OR v.price <> e.price::numeric(10,2);

  -- No extra width rows on these products.
  -- (Each product's name was already checked above, per slug.)
  SELECT count(*) INTO extra
    FROM product_variants v
    JOIN products p ON p.id = v.product_id
   WHERE p.slug IN ('manhattan-style-blanket-box', 'chesterfield-blanket-box', 'luxury-storage-blanket-box', 'ottoman-style-blanket-box', 'premium-fabric-blanket-box', 'classic-blanket-box', 'plush-storage-blanket-box')
     AND v.option_type = 'width'
     AND v.option_value NOT IN ('3ft Wide', '4ft Wide', '4.6ft Wide', '5ft Wide', '6ft Wide');

  -- Products are active and in the Blanket Boxes category.
  problems := problems + (
    SELECT count(*) FROM products p
     WHERE p.slug IN ('manhattan-style-blanket-box', 'chesterfield-blanket-box', 'luxury-storage-blanket-box', 'ottoman-style-blanket-box', 'premium-fabric-blanket-box', 'classic-blanket-box', 'plush-storage-blanket-box')
       AND (p.is_active IS NOT TRUE
            OR p.category_id IS DISTINCT FROM (SELECT id FROM categories WHERE slug = 'blanket-boxes')));

  IF problems + extra > 0 THEN
    RAISE EXCEPTION 'Blanket Box check failed (% problem(s), % extra width row(s)). Nothing was saved.', problems, extra;
  END IF;
  RAISE NOTICE 'Blanket Box check passed: 7 products, 35 width variants.';
END $$;

COMMIT;

-- ---------------------------------------------------------------------
-- Read-only checks to run after COMMIT (they change nothing):
--
--   SELECT p.name, p.slug, p.price, p.is_active, c.slug AS category
--     FROM products p LEFT JOIN categories c ON c.id = p.category_id
--    WHERE p.slug LIKE '%blanket-box%' ORDER BY p.slug;
--
--   SELECT p.slug, v.option_value, v.price, v.is_active
--     FROM product_variants v JOIN products p ON p.id = v.product_id
--    WHERE p.slug LIKE '%blanket-box%' AND v.option_type = 'width'
--    ORDER BY p.slug, v.sort_order;
-- ---------------------------------------------------------------------