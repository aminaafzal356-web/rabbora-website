-- Rabbora Living — categories table
-- Creates the categories table only. No data is inserted.
-- Safe to run more than once: IF NOT EXISTS leaves an existing
-- table (and its rows) untouched instead of failing or replacing it.

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);