-- =====================================================================
-- Rabbora Living — backend cart tables: carts, cart_items  (FINAL)
-- ---------------------------------------------------------------------
-- Run this file ONCE in pgAdmin (Query Tool) on the "rabbora" database.
-- Creates the two tables only. It inserts no data and does not change
-- users, products, product_variants or any other table.
--
--   users (1) ── (1) carts (1) ── (many) cart_items ── products
--                                            └───────── product_variants
--
-- Safe to run again:
--   * Every CREATE uses IF NOT EXISTS, so a second run changes nothing.
--   * Everything is inside one transaction (BEGIN ... COMMIT). If any
--     statement fails, NOTHING is saved.
--   * If an OLDER cart_items table exists (from the first carts.sql,
--     without line_key), this file stops with a clear message instead
--     of silently keeping the old, wrong uniqueness rule.
--
-- Which products can go in cart_items:
--   Only products that exist in the products table (product_id is
--   NOT NULL). TV Beds 5-12, the 7 Blanket Boxes, rapid-14 and
--   rapid-24 are not in the database and stay in the browser
--   (localStorage) cart for now.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 0. Safety checks (read-only). Any failure here stops the whole file.
-- ---------------------------------------------------------------------
DO $$
DECLARE
    missing_columns TEXT;
BEGIN
    -- The tables this file depends on must already exist.
    IF to_regclass('public.users') IS NULL
       OR to_regclass('public.products') IS NULL
       OR to_regclass('public.product_variants') IS NULL THEN
        RAISE EXCEPTION 'Stopped: users, products and product_variants must exist before carts.sql is run. Nothing was changed.';
    END IF;

    -- The composite foreign key below needs UNIQUE (id, product_id)
    -- on product_variants (created by product_variants.sql).
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        WHERE c.conrelid = 'public.product_variants'::regclass
          AND c.contype IN ('u', 'p')
          AND (SELECT array_agg(a.attname::text ORDER BY a.attname)
               FROM unnest(c.conkey) AS k(attnum)
               JOIN pg_attribute a
                 ON a.attrelid = c.conrelid AND a.attnum = k.attnum)
              = ARRAY['id', 'product_id']
    ) THEN
        RAISE EXCEPTION 'Stopped: product_variants has no UNIQUE (id, product_id) constraint. Nothing was changed.';
    END IF;

    -- An older cart_items table (from the first carts.sql) must not be
    -- kept by accident: it merges different fabrics/options.
    IF to_regclass('public.cart_items') IS NOT NULL THEN
        SELECT string_agg(req.col, ', ')
        INTO missing_columns
        FROM unnest(ARRAY['frontend_product_id', 'line_key', 'options',
                          'unit_price', 'name']) AS req(col)
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'cart_items'
              AND column_name = req.col
        );

        IF missing_columns IS NOT NULL THEN
            RAISE EXCEPTION 'Stopped: an OLD cart_items table already exists (missing columns: %). Nothing was changed. Ask before removing it.', missing_columns;
        END IF;
    END IF;
END
$$;

-- ---------------------------------------------------------------------
-- 1. carts — one cart per user
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
    id          SERIAL PRIMARY KEY,

    -- Deleting a user deletes their cart (and, below, its items).
    user_id     INTEGER NOT NULL
                REFERENCES users(id) ON DELETE CASCADE,

    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- One cart per user. This constraint also creates the index used to
    -- find a user's cart, so no separate user_id index is needed.
    CONSTRAINT carts_user_id_unique UNIQUE (user_id)
);

-- ---------------------------------------------------------------------
-- 2. cart_items — one row = one line of the frontend cart
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_items (
    id                   SERIAL PRIMARY KEY,

    -- Deleting a cart deletes its lines.
    cart_id              INTEGER NOT NULL
                         REFERENCES carts(id) ON DELETE CASCADE,

    -- The real database product. A product that is in someone's cart
    -- cannot be deleted (default NO ACTION); set is_active = FALSE instead.
    product_id           INTEGER NOT NULL
                         REFERENCES products(id),

    -- The chosen size/width (NULL when the line has none, e.g. a line
    -- added from the wishlist). See the composite foreign key below.
    product_variant_id   INTEGER NULL,

    -- The "id" the page sends to the frontend cart, exactly as sent,
    -- e.g. 'tv-bed-tv-bed-1', 'ottoman-bed-chelsea-slatted-ottoman-bed',
    -- 'rapid-delivery-bed-rapid-9', 'art-deco-bed-style'.
    frontend_product_id  TEXT NOT NULL,

    -- The line identity. Same value as the frontend lineId
    -- (RabboraCart.buildLineId in cart-data.js):
    --   frontend_product_id
    --   + '::' + every option whose value is not null/undefined/''
    --     written as key:value, keys sorted A-Z, joined with '|'
    --   (no options at all -> just frontend_product_id)
    -- Values are kept exactly as the page sends them: nothing is trimmed
    -- or changed, so 'lower legs' and 'lower legs ' are different lines.
    -- Example:
    --   tv-bed-tv-bed-1::assembly:yes|assemblyPrice:59|deliveryDelay:no|
    --   fabric:Plush Grey|footstoolBlanketBox:no|headboardHeight:normal|
    --   size:Double
    line_key             TEXT NOT NULL,

    -- The complete frontend "variant" object, exactly as sent (size,
    -- width, fabric, fabricSlug, fabricImage, diamantes, buttons,
    -- ottomanStorage, footstoolBlanketBox, footstoolBlanketBoxType,
    -- headboardHeight, customRequest, assembly, assemblyPrice,
    -- deliveryDelay, deliveryDate / requiredDeliveryDate, firmness,
    -- dimensions). '{}' when the line has no options.
    options              JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Price of ONE item, add-ons included (size price + assembly, etc.).
    -- Set when the line is first created and NOT changed when the same
    -- line is added again (same behaviour as the frontend cart).
    unit_price           NUMERIC(10,2) NOT NULL,

    -- Display copy of the line, as the frontend cart stores it.
    fabric_image         TEXT NULL,   -- swatch image (sofas, blanket boxes)
    name                 TEXT NOT NULL,
    url                  TEXT NULL,
    image                TEXT NULL,
    alt                  TEXT NULL,
    category             TEXT NULL,

    quantity             INTEGER NOT NULL DEFAULT 1,

    -- created_at = frontend "addedAt" (also gives the line order).
    -- updated_at is set by the cart API whenever the line changes.
    created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- ---------------- checks ----------------
    CONSTRAINT cart_items_quantity_positive
        CHECK (quantity > 0),

    CONSTRAINT cart_items_unit_price_not_negative
        CHECK (unit_price >= 0),

    CONSTRAINT cart_items_name_not_empty
        CHECK (length(name) > 0),

    CONSTRAINT cart_items_frontend_product_id_valid
        CHECK (length(frontend_product_id) BETWEEN 1 AND 255),

    -- options must be a JSON object: {...}, never a list, text or number.
    CONSTRAINT cart_items_options_is_object
        CHECK (jsonb_typeof(options) = 'object'),

    -- line_key must be built from this line's own frontend_product_id:
    -- either exactly the id (no options) or the id followed by '::'.
    CONSTRAINT cart_items_line_key_matches_product
        CHECK (
            line_key = frontend_product_id
            OR left(line_key, length(frontend_product_id) + 2)
               = frontend_product_id || '::'
        ),

    -- Keeps line_key small enough for the unique index below
    -- (PostgreSQL cannot index much more than ~2,700 bytes). A normal
    -- line, even with a 500-character custom request, is far below this.
    CONSTRAINT cart_items_line_key_max_size
        CHECK (octet_length(line_key) <= 2500),

    -- ---------------- size must belong to the same product -------------
    -- (product_variant_id, product_id) must be an existing
    -- (id, product_id) pair in product_variants, so a line can never pair
    -- a size of one product with another product. When
    -- product_variant_id is NULL this check is skipped.
    -- A size that is in someone's cart cannot be deleted (NO ACTION).
    CONSTRAINT cart_items_variant_same_product
        FOREIGN KEY (product_variant_id, product_id)
        REFERENCES product_variants (id, product_id),

    -- ---------------- THE uniqueness rule ----------------
    -- One row per frontend cart line: the same line_key can appear only
    -- once in a cart. Adding the exact same line again must INCREASE
    -- quantity on the existing row (the cart API does this).
    --
    -- Deliberately NOT unique on (cart_id, product_id, product_variant_id):
    -- that would merge lines that differ only in fabric, assembly,
    -- custom request, delivery date, storage, footstool, headboard,
    -- firmness or page id. Those are different lines in the frontend
    -- cart, so they must stay different rows here.
    --
    -- This constraint's index (cart_id first) also serves
    -- "all lines of a cart" lookups.
    CONSTRAINT cart_items_cart_line_unique
        UNIQUE (cart_id, line_key)
);

-- ---------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------
-- All lines of one cart, in the order they were added.
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id
    ON cart_items (cart_id, created_at, id);

-- Every cart line of one product (also speeds up the products FK check).
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id
    ON cart_items (product_id);

-- Every cart line of one size (speeds up the product_variants FK check).
CREATE INDEX IF NOT EXISTS idx_cart_items_product_variant_id
    ON cart_items (product_variant_id)
    WHERE product_variant_id IS NOT NULL;

COMMIT;