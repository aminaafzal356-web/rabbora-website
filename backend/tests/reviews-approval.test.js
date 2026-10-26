// Rabbora Living — tests for review approval and the public Reviews list.
//
// No database, no network, no real secrets. db.query is replaced, only inside
// this file, with a small fake that records the SQL it receives and returns
// rows from an in-memory list. Run with:  npm test   (from the project root)

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const db = require("../config/db");
const reviewService = require("../services/reviewService");
const reviewController = require("../controllers/reviewController");
const reviewRoutes = require("../routes/reviews");

const realQuery = db.query;
let calls;
let handler;

// Default: empty list, but the summary query always gets one row.
const defaultHandler = (sql) => (sql.includes("AS count")
  ? { rows: [{ count: 0, average: null, r5: 0, r4: 0, r3: 0, r2: 0, r1: 0 }] }
  : { rows: [] });

beforeEach(() => {
  calls = [];
  handler = defaultHandler;
  db.query = async (sql, params = []) => {
    calls.push({ sql, params });
    return handler(sql, params);
  };
});

afterEach(() => {
  db.query = realQuery;
});

const reviewRow = (over = {}) => ({
  id: 5,
  user_id: 3,
  product_id: 9,
  rating: 5,
  title: "Lovely",
  body: "Really comfortable and well made, delivery was fast.",
  is_approved: false,
  first_name: "Sara",
  last_name: "Khan",
  created_at: "2026-10-25T00:00:00Z",
  updated_at: "2026-10-25T00:00:00Z",
  ...over,
});

// ---------- new reviews are pending ----------

test("createReview saves the review as pending (is_approved = FALSE)", async () => {
  handler = () => ({ rows: [reviewRow()] });
  const review = await reviewService.createReview(3, 9, { rating: 5, title: "Lovely", body: "Really comfortable and well made, delivery was fast." });
  const insert = calls[0];
  assert.match(insert.sql, /is_approved\)\s*VALUES \(\$1, \$2, \$3, \$4, \$5, FALSE\)/);
  assert.equal(review.isApproved, false);
});

// ---------- admin approval updates the database ----------

test("setApproval(id, true) runs an UPDATE with the review id and returns the approved review", async () => {
  handler = () => ({ rows: [reviewRow({ is_approved: true })] });
  const review = await reviewService.setApproval(5, true);
  assert.match(calls[0].sql, /UPDATE reviews SET is_approved = \$1/);
  assert.deepEqual(calls[0].params, [true, 5]);
  assert.equal(review.isApproved, true);
  assert.equal(review.id, 5);
});

test("setApproval throws 'Review not found.' when no row matches, so no false success", async () => {
  handler = defaultHandler;
  await assert.rejects(reviewService.setApproval(999, true), { message: "Review not found." });
});

test("approve controller returns the updated review on success", async () => {
  handler = () => ({ rows: [reviewRow({ is_approved: true })] });
  let body;
  let status;
  const res = { status(s) { status = s; return this; }, json(b) { body = b; return this; } };
  await reviewController.approve({ params: { id: "5" }, body: { approved: true } }, res);
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.review.isApproved, true);
});

test("approve controller rejects a missing or non-boolean 'approved' value", async () => {
  await assert.rejects(
    reviewController.approve({ params: { id: "5" }, body: { approved: "yes" } }, { status() { return this; }, json() {} }),
    (err) => err && err.name !== undefined
  );
  assert.equal(calls.length, 0, "no database write when the request is invalid");
});

test("approve controller rejects an invalid review id without touching the database", async () => {
  await assert.rejects(
    reviewController.approve({ params: { id: "abc" }, body: { approved: true } }, { status() { return this; }, json() {} }),
    { message: "Review not found." }
  );
  assert.equal(calls.length, 0);
});

// ---------- public list ----------

test("listAllApproved only returns approved reviews of active products", async () => {
  handler = (sql) => (sql.includes("COUNT(*)::int AS count")
    ? { rows: [{ count: 1, average: "5.0", r5: 1, r4: 0, r3: 0, r2: 0, r1: 0 }] }
    : { rows: [{ ...reviewRow({ is_approved: true }), product_name: "Pascal Bed", product_slug: "pascal", category_slug: "beds", total: 1 }] });
  const data = await reviewService.listAllApproved({ limit: 12, offset: 0 });
  const listSql = calls[0].sql;
  assert.match(listSql, /rv\.is_approved = TRUE/);
  assert.match(listSql, /p\.is_active = TRUE/);
  assert.equal(data.total, 1);
  assert.equal(data.reviews[0].productName, "Pascal Bed");
  assert.equal(data.reviews[0].author, "Sara K.");
  assert.deepEqual(data.overall.distribution, { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 });
  assert.equal(data.overall.count, 1);
});

test("a newly approved review is included in the public list on the next request", async () => {
  // Simulate the database: the review starts pending, admin approves, list reads again.
  const store = [reviewRow({ id: 7, product_id: 9, is_approved: false })];
  const activeProducts = new Set([9]);
  handler = (sql, params) => {
    if (sql.startsWith("UPDATE reviews SET is_approved")) {
      const row = store.find((r) => r.id === params[1]);
      if (!row) return { rows: [] };
      row.is_approved = params[0];
      return { rows: [{ ...row }] };
    }
    if (sql.includes("COUNT(*)::int AS count")) {
      const live = store.filter((r) => r.is_approved && activeProducts.has(r.product_id));
      return { rows: [{ count: live.length, average: "5.0", r5: live.length, r4: 0, r3: 0, r2: 0, r1: 0 }] };
    }
    const live = store.filter((r) => r.is_approved && activeProducts.has(r.product_id));
    return { rows: live.map((r) => ({ ...r, product_name: "Pascal Bed", product_slug: "pascal", category_slug: "beds", total: live.length })) };
  };

  const before = await reviewService.listAllApproved({ limit: 12, offset: 0 });
  assert.equal(before.total, 0, "pending review is hidden from the public");

  await reviewService.setApproval(7, true);
  const after = await reviewService.listAllApproved({ limit: 12, offset: 0 });
  assert.equal(after.total, 1, "approved review appears publicly");
  assert.equal(after.reviews[0].id, 7);
});

test("an approved review for an inactive product stays hidden", async () => {
  handler = defaultHandler;
  const data = await reviewService.listAllApproved({ limit: 12, offset: 0 });
  assert.equal(data.total, 0);
  assert.match(calls[0].sql, /p\.is_active = TRUE/);
});

test("listAllApproved applies rating and product filters with bound parameters", async () => {
  handler = defaultHandler;
  await reviewService.listAllApproved({ limit: 12, offset: 0, rating: 4, productId: 9, sort: "highest" });
  const listCall = calls[0];
  assert.match(listCall.sql, /rv\.rating = \$1/);
  assert.match(listCall.sql, /rv\.product_id = \$2/);
  assert.match(listCall.sql, /ORDER BY rv\.rating DESC/);
  assert.deepEqual(listCall.params, [4, 9, 12, 0]);
});

test("listAllApproved binds the category slug as a parameter", async () => {
  handler = defaultHandler;
  await reviewService.listAllApproved({ limit: 12, offset: 24, rating: 4, productId: 7, categorySlug: "sofas", sort: "highest" });
  const listCall = calls.find((c) => c.sql.includes("FROM reviews rv"));
  assert.deepEqual(listCall.params, [4, 7, "sofas", 12, 24]);
  assert.match(listCall.sql, /c\.slug = \$3/);
  assert.match(listCall.sql, /LIMIT \$4 OFFSET \$5/);
});

test("listAll controller rejects invalid rating, productId, category and sort with 400 and never queries", async () => {
  const bad = [
    { rating: "6" },
    { rating: "abc" },
    { productId: "12abc" },
    { category: "Sofas; DROP TABLE" },
    { sort: "newest; DROP TABLE reviews" },
  ];
  for (const query of bad) {
    const res = { status() { return this; }, json() {} };
    await assert.rejects(
      () => reviewController.listAll({ query }, res),
      (err) => err.status === 400 && err.code === "VALIDATION_ERROR"
    );
  }
  assert.equal(calls.length, 0, "no database query for invalid input");
});

test("listAll controller passes a valid category slug through to the service", async () => {
  handler = defaultHandler;
  const res = { status() { return this; }, json() {} };
  await reviewController.listAll({ query: { category: "sofas", rating: "5" } }, res);
  const listCall = calls.find((c) => c.sql.includes("FROM reviews rv"));
  assert.match(listCall.sql, /c\.slug = \$2/);
  assert.deepEqual(listCall.params, [5, "sofas", 12, 0]);
});

test("GET /all is registered before the catch-all GET / route", () => {
  const paths = reviewRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  assert.ok(paths.indexOf("/all") !== -1, "/all route exists");
  assert.ok(paths.indexOf("/all") < paths.indexOf("/"), "/all comes before /");
});

test("pending admin route is guarded by requireAdmin", () => {
  const layer = reviewRoutes.stack.find((l) => l.route && l.route.path === "/:id/approval" && l.route.methods.patch);
  assert.ok(layer, "approval route exists");
  assert.equal(layer.route.stack.length, 2, "requireAdmin + approve");
});