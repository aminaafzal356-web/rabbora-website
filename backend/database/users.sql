-- Rabbora Living — users table
-- Creates the users table only. No data is inserted.
-- One row = one customer or admin account (login = email + password).
-- Matches the Create Account form: First Name, Last Name, Email Address,
-- Phone Number, Password (Confirm Password is only checked in the browser).
-- The password itself is NEVER stored — only a one-way hash made by the
-- backend (bcrypt/argon2). Safe to run more than once (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS users (
    id             SERIAL PRIMARY KEY,

    -- Same 100-character limit as the form; no blank or padded names.
    first_name     VARCHAR(100) NOT NULL
                   CHECK (first_name = trim(first_name) AND first_name <> ''),
    last_name      VARCHAR(100) NOT NULL
                   CHECK (last_name = trim(last_name) AND last_name <> ''),

    -- Login email, saved trimmed and lower-case, so "Amina@Mail.com"
    -- and "amina@mail.com" can never be two accounts.
    email          VARCHAR(254) NOT NULL
                   CHECK (email = lower(trim(email)))
                   CHECK (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),

    -- Text, not a number: keeps +, spaces, brackets and dashes exactly
    -- as typed. Same rule as the form: 10 to 15 digits. Not unique.
    phone          VARCHAR(20) NOT NULL
                   CHECK (phone = trim(phone))
                   CHECK (phone ~ '^\+?[0-9 ()-]+$')
                   CHECK (length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 10 AND 15),

    -- bcrypt / argon2 hash of the password (never the password itself).
    password_hash  VARCHAR(255) NOT NULL
                   CHECK (length(password_hash) >= 50),

    -- Every sign-up is a customer; admins are set by hand.
    role           VARCHAR(20) NOT NULL DEFAULT 'customer'
                   CHECK (role IN ('customer', 'admin')),

    -- FALSE = account disabled (cannot log in) without deleting it,
    -- so its past orders stay linked.
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,

    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_email_unique UNIQUE (email)
);