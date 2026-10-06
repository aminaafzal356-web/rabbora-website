-- =====================================================================
-- Rabbora Living — core e-commerce tables (additive migration)
-- ---------------------------------------------------------------------
-- Run ONCE in pgAdmin (Query Tool) on the rabbora database, AFTER
-- categories.sql, users.sql, user_sessions.sql and carts.sql.
--
-- SAFE BY DESIGN:
-- - Nothing is dropped, truncated, renamed or deleted.
-- - No existing row is changed. Existing prices are NOT touched.
-- - Existing tables only get NEW columns (ADD COLUMN IF NOT EXISTS),
--   each with a default, so every existing row stays valid.
-- - New tables use CREATE TABLE IF NOT EXISTS, so running the file a
--   second time does nothing harmful.
-- - Everything runs in one transaction: if any line fails, nothing at
--   all is changed (ROLLBACK).
--
-- Money is NUMERIC(10,2) everywhere (never float). Currency is GBP.
--
-- Existing tables reused (not recreated):
--   categories, products, product_images, product_variants,
--   users, user_sessions, carts, cart_items
--
-- How the requested models map to tables:
--   Category              -> categories (existing, + new columns)
--   Product               -> products (existing, + new columns)
--   ProductImage          -> product_images (existing, + is_primary)
--   ProductVariant /
--   ProductSize /
--   ProductPricing        -> product_variants (existing): one row per
--                            product + size/width, holding the sale
--                            price (price) and the original price
--                            (compare_at_price). The view
--                            product_pricing adds discount %, savings
--                            and the monthly amount, calculated — not
--                            stored twice.
--   ProductFabric         -> fabrics + product_fabrics
--   ProductStorageOption  -> storage_options + product_storage_options
--   User                  -> users (existing)
--   Address               -> addresses
--   Cart / CartItem       -> carts / cart_items (existing)
--   Wishlist              -> wishlist_items
--   Order / OrderItem     -> orders / order_items
--   Review                -> reviews
--   Inventory / Stock     -> inventory_items
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1. categories (existing) — extra, optional columns
-- ---------------------------------------------------------------------
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active   BOOLEAN   NOT NULL DEFAULT TRUE;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order  INTEGER   NOT NULL DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ---------------------------------------------------------------------
-- 2. products (existing) — SKU, featured, best seller
-- ---------------------------------------------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku            VARCHAR(64);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured    BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT FALSE;

-- A SKU is optional, but two products can never share one.
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique
  ON products (sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products (is_active, id);

-- ---------------------------------------------------------------------
-- 3. product_images (existing) — primary image flag
-- ---------------------------------------------------------------------
ALTER TABLE product_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT FALSE;

-- At most ONE primary image per product.
CREATE UNIQUE INDEX IF NOT EXISTS product_images_one_primary
  ON product_images (product_id) WHERE is_primary;

-- ---------------------------------------------------------------------
-- 4. product_variants (existing) — size + its pricing
--    price            = sale / current price (unchanged)
--    compare_at_price = original / old price (unchanged, may be NULL)
-- ---------------------------------------------------------------------
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku      VARCHAR(64);
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'GBP'
  CHECK (currency = 'GBP');

CREATE UNIQUE INDEX IF NOT EXISTS product_variants_sku_unique
  ON product_variants (sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_variants_product_active
  ON product_variants (product_id, is_active, sort_order);

-- Pricing per product + size, ready for the frontend. Same rules as
-- the product pages:
--   discount %  = ROUND((original - sale) / original * 100)
--   savings     = original - sale
--   monthly     = CEIL(sale / 12)   (whole pounds, "or from £X/month")
-- Only when a real original price exists (and is higher) are discount
-- and savings filled in.
CREATE OR REPLACE VIEW product_pricing AS
SELECT
  v.id                AS product_variant_id,
  v.product_id,
  v.option_type,
  v.option_value      AS size_code,
  v.option_label      AS size_label,
  v.price             AS sale_price,
  CASE WHEN v.compare_at_price > v.price THEN v.compare_at_price END AS original_price,
  CASE WHEN v.compare_at_price > v.price
       THEN ROUND((v.compare_at_price - v.price) / v.compare_at_price * 100)::INTEGER
  END                 AS discount_percentage,
  CASE WHEN v.compare_at_price > v.price
       THEN v.compare_at_price - v.price
  END                 AS savings,
  CEIL(v.price / 12)::INTEGER AS monthly_from,
  v.currency,
  v.sort_order,
  v.is_active,
  v.created_at,
  v.updated_at
FROM product_variants v;

-- ---------------------------------------------------------------------
-- 5. Fabrics — one shared catalogue + which products offer which
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fabrics (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE
              CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0),
  collection  VARCHAR(100),            -- e.g. "Plush", "Naples"
  image_url   TEXT,                    -- path/URL only, never the image itself
  sort_order  INTEGER   NOT NULL DEFAULT 0,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_fabrics (
  product_id       INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  fabric_id        INTEGER NOT NULL REFERENCES fabrics(id)  ON DELETE CASCADE,
  -- Extra charge for this fabric on this product (0 = no extra charge).
  price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price_adjustment >= 0),
  sort_order       INTEGER   NOT NULL DEFAULT 0,
  is_active        BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id, fabric_id)
);
CREATE INDEX IF NOT EXISTS idx_product_fabrics_fabric_id ON product_fabrics (fabric_id);

-- ---------------------------------------------------------------------
-- 6. Storage options — shared list + which products offer which
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS storage_options (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(50)  NOT NULL UNIQUE
              CHECK (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- e.g. "ottoman"
  name        VARCHAR(100) NOT NULL CHECK (length(trim(name)) > 0),
  description TEXT,
  sort_order  INTEGER   NOT NULL DEFAULT 0,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_storage_options (
  product_id        INTEGER NOT NULL REFERENCES products(id)        ON DELETE CASCADE,
  storage_option_id INTEGER NOT NULL REFERENCES storage_options(id) ON DELETE CASCADE,
  price_adjustment  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price_adjustment >= 0),
  is_default        BOOLEAN   NOT NULL DEFAULT FALSE,
  sort_order        INTEGER   NOT NULL DEFAULT 0,
  is_active         BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id, storage_option_id)
);
CREATE INDEX IF NOT EXISTS idx_product_storage_options_option
  ON product_storage_options (storage_option_id);
-- At most one default storage option per product.
CREATE UNIQUE INDEX IF NOT EXISTS product_storage_options_one_default
  ON product_storage_options (product_id) WHERE is_default;

-- ---------------------------------------------------------------------
-- 7. Addresses — saved addresses of a customer
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name     VARCHAR(200) NOT NULL CHECK (length(trim(full_name)) > 0),
  phone         VARCHAR(20)  NOT NULL,
  address_line1 VARCHAR(200) NOT NULL CHECK (length(trim(address_line1)) > 0),
  address_line2 VARCHAR(200),
  city          VARCHAR(100) NOT NULL CHECK (length(trim(city)) > 0),
  county        VARCHAR(100),
  postcode      VARCHAR(10)  NOT NULL CHECK (length(trim(postcode)) > 0),
  country       VARCHAR(100) NOT NULL DEFAULT 'United Kingdom',
  is_default    BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses (user_id);
-- At most one default address per customer.
CREATE UNIQUE INDEX IF NOT EXISTS addresses_one_default
  ON addresses (user_id) WHERE is_default;

-- ---------------------------------------------------------------------
-- 8. Wishlist — one row per customer + product (no duplicates)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist_items (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT wishlist_items_user_product_unique UNIQUE (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items (product_id);

-- ---------------------------------------------------------------------
-- 9. Inventory — stock that is actually tracked.
--     A product (or one size of it) is stock-checked only when it has
--     an active row here. Products without a row are not limited, so
--     nothing that works today stops working.
--     Size-specific: product_variant_id. Fabric/storage-specific stock
--     can be added later with extra nullable columns.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_items (
  id                  SERIAL PRIMARY KEY,
  product_id          INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_variant_id  INTEGER,
  sku                 VARCHAR(64) NOT NULL UNIQUE,
  stock_quantity      INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  is_active           BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- The size must belong to the same product.
  CONSTRAINT inventory_items_variant_same_product
    FOREIGN KEY (product_variant_id, product_id)
    REFERENCES product_variants (id, product_id) ON DELETE CASCADE
);
-- One product-level row, and one row per size, at most.
CREATE UNIQUE INDEX IF NOT EXISTS inventory_items_product_level_unique
  ON inventory_items (product_id) WHERE product_variant_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS inventory_items_variant_unique
  ON inventory_items (product_variant_id) WHERE product_variant_id IS NOT NULL;

-- ---------------------------------------------------------------------
-- 10. Orders — every price and address is a SNAPSHOT taken when the
--    order is placed, so later price changes never change an order.
-- ---------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  order_number     VARCHAR(30) NOT NULL UNIQUE,
  -- SET NULL: an order is kept even if the account is deleted later.
  user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped',
                                     'delivered', 'cancelled', 'refunded')),
  payment_status   VARCHAR(20) NOT NULL DEFAULT 'unpaid'
                   CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  currency         CHAR(3)     NOT NULL DEFAULT 'GBP' CHECK (currency = 'GBP'),
  subtotal         NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
  discount         NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  -- Customer details at the time of the order.
  customer_email   VARCHAR(254) NOT NULL,
  customer_name    VARCHAR(200) NOT NULL,
  customer_phone   VARCHAR(20),
  shipping_address JSONB NOT NULL CHECK (jsonb_typeof(shipping_address) = 'object'),
  billing_address  JSONB NOT NULL CHECK (jsonb_typeof(billing_address) = 'object'),
  notes            TEXT CHECK (notes IS NULL OR length(notes) <= 1000),
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT orders_total_matches CHECK (total = subtotal + shipping - discount)
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders (status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id                  SERIAL PRIMARY KEY,
  order_id            INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- Links kept for reports; SET NULL so an order survives a deleted product.
  product_id          INTEGER REFERENCES products(id)         ON DELETE SET NULL,
  product_variant_id  INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
  -- Snapshots (never change after the order is placed).
  frontend_product_id TEXT,
  product_name        TEXT NOT NULL CHECK (length(product_name) > 0),
  product_slug        VARCHAR(255),
  selected_size       VARCHAR(100),
  selected_fabric     VARCHAR(150),
  selected_storage    VARCHAR(150),
  options             JSONB NOT NULL DEFAULT '{}'::jsonb
                      CHECK (jsonb_typeof(options) = 'object'),
  image               TEXT,
  -- The stock record this line took stock from (NULL = stock not tracked).
  -- Used to put the stock back if the order is cancelled.
  inventory_item_id   INTEGER REFERENCES inventory_items(id) ON DELETE SET NULL,
  quantity            INTEGER NOT NULL CHECK (quantity > 0),
  unit_price          NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price         NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT order_items_total_matches CHECK (total_price = unit_price * quantity)
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);

-- ---------------------------------------------------------------------
-- 11. Reviews — one review per customer per product
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(150),
  body        TEXT NOT NULL CHECK (length(trim(body)) BETWEEN 10 AND 2000),
  -- New reviews wait for an admin before they are shown.
  is_approved BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reviews_user_product_unique UNIQUE (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved
  ON reviews (product_id, is_approved, created_at DESC);

COMMIT;