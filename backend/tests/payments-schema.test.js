// Rabbora Living — tests for the Stripe column check (services/paymentService.js).
// These tests use a real PostgreSQL database, so they only run when you
// set RUN_DB_TESTS=1 (the same DB_* values as backend/.env are used).
// They never change your data: every test creates a temporary schema,
// works only inside it, and drops it again at the end.
//
//   Windows (PowerShell, in backend/):  $env:RUN_DB_TESTS="1"; npm test

const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const { Client } = require("pg");

// Read backend/.env the same way server.js does, so the same DB_* values are used.
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") process.loadEnvFile(envPath);

// Loading the payment service also loads the session settings, which refuse
// to start without SESSION_SECRET. The test only needs the module, so a
// placeholder is used when none is set. It exists only in this process.
if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const RUN = process.env.RUN_DB_TESTS === "1";
const skip = RUN ? false : "set RUN_DB_TESTS=1 to run database tests";

function newClient() {
  return new Client({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "rabbora",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    connectionTimeoutMillis: 5000,
  });
}

const { stripeColumnsReport } = require("../services/paymentService");

test("the real orders table has both Stripe columns", { skip }, async () => {
  const client = newClient();
  await client.connect();
  try {
    const report = await stripeColumnsReport(client);
    assert.equal(report.ok, true, `expected both Stripe columns; found ${report.stripeColumns}`);
    assert.equal(report.stripeColumns, 2);
  } finally {
    await client.end();
  }
});

test("columns are found even when the first schema on search_path has no orders table", { skip }, async () => {
  const client = newClient();
  await client.connect();
  const empty = "rb_probe_empty_" + crypto.randomBytes(4).toString("hex");
  try {
    await client.query(`CREATE SCHEMA ${empty}`);
    await client.query(`SET search_path = ${empty}, public`);
    const report = await stripeColumnsReport(client);
    assert.equal(report.firstSchema, empty, "test setup: the empty schema should be first");
    assert.equal(report.ok, true, "orders is still found through search_path, so the check must pass");
  } finally {
    await client.query("RESET search_path").catch(() => {});
    await client.query(`DROP SCHEMA IF EXISTS ${empty}`).catch(() => {});
    await client.end();
  }
});

test("a schema with an orders table that lacks the Stripe columns is reported as not ready", { skip }, async () => {
  const client = newClient();
  await client.connect();
  const schema = "rb_probe_old_" + crypto.randomBytes(4).toString("hex");
  try {
    await client.query(`CREATE SCHEMA ${schema}`);
    await client.query(`CREATE TABLE ${schema}.orders (id integer)`);
    await client.query(`SET search_path = ${schema}`);
    const report = await stripeColumnsReport(client);
    assert.equal(report.ok, false);
    assert.equal(report.stripeColumns, 0);
  } finally {
    await client.query("RESET search_path").catch(() => {});
    await client.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`).catch(() => {});
    await client.end();
  }
});