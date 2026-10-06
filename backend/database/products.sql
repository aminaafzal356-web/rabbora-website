-- Rabbora Living — products table
-- Creates the products table only. No data is inserted.
-- Requires the categories table to exist first (category_id references it).
-- Safe to run more than once: IF NOT EXISTS leaves an existing table untouched.

CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL,
    category_id     INTEGER REFERENCES categories(id),
    main_image      TEXT,
    stock_quantity  INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);