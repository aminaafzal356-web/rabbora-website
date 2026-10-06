-- Rabbora Living — product_images table
-- Creates the product_images table only. No data is inserted.
-- Requires the products table to exist first (product_id references it).
-- One product can have many images; sort_order controls their order
-- in the gallery. Safe to run more than once (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS product_images (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url   TEXT NOT NULL,
    alt_text    VARCHAR(255),
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, image_url)
);

-- Speeds up "get all images for this product" (used on every product page).
CREATE INDEX IF NOT EXISTS idx_product_images_product_id
    ON product_images (product_id);