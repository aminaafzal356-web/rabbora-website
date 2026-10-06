-- Rabbora Living — product_variants table
-- Creates the product_variants table only. No data is inserted.
-- Requires the products table to exist first (product_id references it).
--
-- In the finalized frontend the only choice that changes WHICH item is
-- bought and HOW MUCH it costs is the size (beds, mattresses, sofas) or
-- the width (blanket boxes). One row here = one size/width of one product.
--
-- NOT variants (they are choices saved on each cart/order line):
-- fabric colour, firmness, ottoman storage, footstool/blanket box,
-- headboard height, detailing buttons, custom request, assembly (+£59),
-- delivery date.
--
-- Safe to run more than once (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS product_variants (
    id                SERIAL PRIMARY KEY,

    -- Deleting a product deletes its sizes too.
    product_id        INTEGER NOT NULL
                      REFERENCES products(id) ON DELETE CASCADE,

    -- Which key the frontend cart uses for this choice:
    -- 'size' for beds/mattresses/sofas, 'width' for blanket boxes.
    option_type       VARCHAR(10) NOT NULL DEFAULT 'size'
                      CHECK (option_type IN ('size', 'width')),

    -- Exact value the frontend saves in the cart variant, e.g.
    -- 'Double', 'King Size', '3+2 Seater', '4.6ft Wide'.
    option_value      VARCHAR(50) NOT NULL
                      CHECK (length(trim(option_value)) > 0),

    -- Exact text on the size/width button, e.g. 'King 5ft',
    -- 'Double 4ft 6"', 'Double 4''6ft', 'Left Corner Sofa'.
    option_label      VARCHAR(50) NOT NULL
                      CHECK (length(trim(option_label)) > 0),

    -- Final price of this size/width before any add-ons.
    price             NUMERIC(10,2) NOT NULL CHECK (price > 0),

    -- Crossed-out original price shown for this size (optional).
    compare_at_price  NUMERIC(10,2)
                      CHECK (compare_at_price IS NULL OR compare_at_price > price),

    stock_quantity    INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),

    -- Frame/mattress size in cm, only where the frontend gives it.
    -- Both are filled in together or both left empty.
    width_cm          INTEGER CHECK (width_cm > 0),
    length_cm         INTEGER CHECK (length_cm > 0),
    CHECK ((width_cm IS NULL) = (length_cm IS NULL)),

    -- Order of the buttons on the page (smallest size first).
    sort_order        SMALLINT NOT NULL DEFAULT 0 CHECK (sort_order >= 0),

    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- The same size/width cannot be added twice to the same product.
    -- (Its index also serves "get all sizes for this product".)
    CONSTRAINT product_variants_product_option_unique
        UNIQUE (product_id, option_value),

    -- Lets future cart/order tables reference (variant id, product id)
    -- together, so a line can never pair a size with the wrong product.
    CONSTRAINT product_variants_id_product_unique
        UNIQUE (id, product_id)
);