// Rabbora Living — PostgreSQL connection (Step 2: connection only)
// Creates one shared connection pool from environment variables.
// No tables, no queries against business data — just the connection.

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "rabbora",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  // Give up quickly if PostgreSQL is not reachable, so an API request
  // returns an error instead of hanging.
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// An idle client losing its connection (e.g. PostgreSQL restarted)
// emits an error on the pool. Without this listener Node would crash
// the whole server; with it, the error is logged and the pool
// reconnects on the next request.
pool.on("error", (err) => {
  console.error("[db] Unexpected PostgreSQL pool error:", err.message);
});

// Runs a trivial query to confirm the database is reachable and the
// credentials are correct. Throws if the connection fails.
async function testConnection() {
  const result = await pool.query("SELECT NOW() AS server_time, current_database() AS database");
  return result.rows[0];
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
};
