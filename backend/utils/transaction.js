// Rabbora Living — run several queries as ONE database transaction.
// If anything inside throws, everything is rolled back.
//   const order = await withTransaction(async (client) => { ... });

const db = require("../config/db");

async function withTransaction(work) {
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("[db] Rollback failed:", rollbackErr.message);
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { withTransaction };