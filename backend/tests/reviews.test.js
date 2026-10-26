// Rabbora Living — tests for product reviews (services/reviewService.js,
// controllers/reviewController.js, routes/reviews.js, middleware/auth.js).
// No database is needed: db.query is replaced in this file with a stub that
// records the SQL and parameters, so the tests check what would be sent.

const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

if (!process.env.SESSION_SECRET) process.env.SESSION_SECRET = "test-only-placeholder-not-a-real-secret-0000000000";

const db = require("../config/db");
const reviewService = require("../services/reviewService");
const reviewController = require("../controllers/reviewController");
const reviewRoutes = require("../routes/reviews");
const { requireAdmin } = require("../middleware/auth");

let calls;
let respond;
const originalQuery = db.query;
let savedLog;

beforeEach(() => {
  calls = [];
  respond = () => ({ rows: [] });
  db.query = async (sql, params) => {
    calls.push({ sql: String(sql).replace(/\s+/g, " ").trim(), params: params || [] });
    return respond(String(sql), params || []);
  };
  savedLog = console.log;
  console.log = () => {};
});

afterEach(() => {
  db.query = originalQuery;
  console.log = savedLog;
});

const reviewRow = (over = {}) => ({
  id: 1, user_id: 3, product_id: 7, rating: 5, title: "Lovely", body: "Very comfortable and well made.",
  is_approved: false, created_at: "2026-10-25T10:00:00Z", updated_at: "2026-10-25T10:00:00Z",
  first_name: "Sara", last_name: "Khan", ...over,
});

// ---------- writing a review: saved as pending ----------

test("a new review is saved as NOT approved (pending), with parameterised values", async () => {
  respond = (sql) => (sql.includes("INSERT INTO reviews") ? { rows: [reviewRow()] } : { rows: [] });
  const out = await reviewService.createReview(3, 7, { rating: 5, title: "Lovely", body: "Very comfortable and well made." });
  const insert = calls.find((c) => c.sql.includes("INSERT INTO reviews"));
  assert.ok(insert.sql.includes("FALSE"), "insert must set is_approved to FALSE");
  assert.ok(!insert.sql.includes("TRUE)"), "insert must not publish the review");
  assert.deepEqual(insert.params, [3, 7, 5, "Lovely", "Very comfortable and well made."]);
  assert.equal(out.isApproved, false);
});

test("a duplicate review for the same product returns 409 DUPLICATE_REVIEW", async () => {
  respond = () => { const e = new Error("duplicate"); e.code = "23505"; throw e; };
  await assert.rejects(
    () => reviewService.createReview(3, 7, { rating: 4, body: "Good enough for the price." }),
    (err) => err.status === 409 && err.code === "DUPLICATE_REVIEW"
  );
});

test("controller.create responds that the review awaits approval (not 'published')", async () => {
  respond = (sql) => {
    if (sql.includes("SELECT id FROM products")) return { rows: [{ id: 7 }] };
    if (sql.includes("INSERT INTO reviews")) return { rows: [reviewRow()] };
    return { rows: [] };
  };
  const req = { user: { id: 3, role: "customer" }, body: { productId: 7, rating: 5, title: "Lovely", body: "Very comfortable and well made." } };
  let sent;
  const res = { status(code) { this.code = code; return this; }, json(body) { sent = { code: this.code, body }; } };
  await reviewController.create(req, res);
  assert.equal(sent.code, 201);
  assert.match(sent.body.message, /approved/);
  assert.doesNotMatch(sent.body.message, /published/);
});

// ---------- public reading: approved only ----------

test("approved reviews of one product: only approved rows, with the product's average", async () => {
  respond = (sql) => {
    if (sql.includes("FROM reviews rv JOIN users u")) return { rows: [{ ...reviewRow({ is_approved: true }), total: "1" }] };
    if (sql.includes("COUNT(*)::int AS count")) return { rows: [{ count: 1, average: "5.0" }] };
    return { rows: [] };
  };
  const out = await reviewService.listApproved(7, { limit: 10, offset: 0 });
  const list = calls.find((c) => c.sql.includes("FROM reviews rv JOIN users u"));
  assert.ok(list.sql.includes("rv.is_approved = TRUE"));
  assert.deepEqual(list.params, [7, 10, 0]);
  assert.equal(out.total, 1);
  assert.equal(out.average, 5);
  assert.equal(out.reviews[0].author, "Sara K.");
});

test("the all-reviews list never includes pending or inactive-product reviews", async () => {
  respond = (sql) => (sql.includes("COUNT(*) OVER") ? { rows: [] } : { rows: [{ count: 0, average: null, r5: 0, r4: 0, r3: 0, r2: 0, r1: 0 }] });
  await reviewService.listAllApproved({ limit: 12, offset: 0 });
  const list = calls.find((c) => c.sql.includes("FROM reviews rv"));
  assert.ok(list.sql.includes("rv.is_approved = TRUE"));
  assert.ok(list.sql.includes("p.is_active = TRUE"));
});

test("all-reviews filters are bound as parameters, in order, with limit and offset last", async () => {
  await reviewService.listAllApproved({ limit: 12, offset: 24, rating: 4, productId: 7, categorySlug: "sofas", sort: "highest" });
  const list = calls.find((c) => c.sql.includes("FROM reviews rv"));
  assert.deepEqual(list.params, [4, 7, "sofas", 12, 24]);
  assert.ok(list.sql.includes("ORDER BY rv.rating DESC"));
  assert.ok(list.sql.includes("c.slug = $3"));
  assert.ok(list.sql.includes("LIMIT $4 OFFSET $5"));
});

test("an unknown sort value falls back to newest and is never put into the SQL", async () => {
  await reviewService.listAllApproved({ limit: 12, offset: 0, sort: "newest; DROP TABLE reviews" });
  const list = calls.find((c) => c.sql.includes("FROM reviews rv"));
  assert.ok(list.sql.includes("ORDER BY rv.created_at DESC"));
  assert.ok(!list.sql.includes("DROP"));
});

test("the overall rating breakdown is returned per star", async () => {
  respond = (sql) => (sql.includes("COUNT(*) OVER") ? { rows: [] } : {
    rows: [{ count: 4, average: "4.0", r5: 2, r4: 1, r3: 0, r2: 0, r1: 1 }],
  });
  const out = await reviewService.listAllApproved({ limit: 12, offset: 0 });
  assert.deepEqual(out.overall.distribution, { 5: 2, 4: 1, 3: 0, 2: 0, 1: 1 });
  assert.equal(out.overall.count, 4);
  assert.equal(out.overall.average, 4);
});

// ---------- input validation (controller) ----------

async function expectValidation(query) {
  const res = { status() { return this; }, json() {} };
  await assert.rejects(
    () => reviewController.listAll({ query }, res),
    (err) => err.status === 400 && err.code === "VALIDATION_ERROR"
  );
}

test("invalid ratings, product ids and category slugs are rejected before any query", async () => {
  await expectValidation({ rating: "6" });
  await expectValidation({ rating: "abc" });
  await expectValidation({ productId: "12abc" });
  await expectValidation({ category: "Sofas; DROP TABLE" });
  assert.equal(calls.length, 0, "no database query for invalid input");
});

test("a valid all-reviews request returns success with the page data", async () => {
  respond = (sql) => (sql.includes("FROM reviews rv") && sql.includes("COUNT(*) OVER")
    ? { rows: [{ ...reviewRow({ is_approved: true, product_name: "Oslo Bed", product_slug: "oslo", category_slug: "sofas" }), total: "1" }] }
    : { rows: [{ count: 1, average: "5.0", r5: 1, r4: 0, r3: 0, r2: 0, r1: 0 }] });
  let sent;
  const res = { status(code) { this.code = code; return this; }, json(body) { sent = { code: this.code, body }; } };
  await reviewController.listAll({ query: { page: "1", limit: "12", category: "sofas", rating: "5" } }, res);
  assert.equal(sent.code, 200);
  assert.equal(sent.body.success, true);
  assert.equal(sent.body.reviews[0].productSlug, "oslo");
  assert.equal(sent.body.reviews[0].categorySlug, "sofas");
});

// ---------- admin-only operations ----------

test("admin approval and the pending list are wired to requireAdmin in the routes", () => {
  const handlesFor = (path, method) => {
    const layer = reviewRoutes.stack.find((l) => l.route && l.route.path === path && l.route.methods[method]);
    assert.ok(layer, `${method.toUpperCase()} ${path} exists`);
    return layer.route.stack.map((h) => h.handle);
  };
  assert.ok(handlesFor("/pending", "get").includes(requireAdmin));
  assert.ok(handlesFor("/:id/approval", "patch").includes(requireAdmin));
});

test("requireAdmin rejects a logged-out visitor with 401", async () => {
  let err;
  await requireAdmin({ session: undefined, headers: {} }, { set() {} }, (e) => { err = e; });
  assert.equal(err.status, 401);
});

test("requireAdmin rejects a logged-in customer with 403", async () => {
  respond = () => ({ rows: [{ id: 5, first_name: "A", last_name: "B", email: "a@b.co", phone: null, role: "customer" }] });
  const req = { session: { userId: 5, loginAt: Date.now() }, headers: {} };
  let err;
  await requireAdmin(req, { set() {} }, (e) => { err = e; });
  assert.equal(err.status, 403);
});

test("the public all-reviews route does not require login", () => {
  const layer = reviewRoutes.stack.find((l) => l.route && l.route.path === "/all" && l.route.methods.get);
  assert.ok(layer, "GET /all exists");
  const handles = layer.route.stack.map((h) => h.handle);
  assert.ok(!handles.includes(requireAdmin));
});