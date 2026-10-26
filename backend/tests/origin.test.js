// Rabbora Living — tests for which websites may call the API
// (middleware/originCheck.js). No database is needed.

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const { buildAllowedOrigins, createOriginGuard, normalizeOrigin } = require("../middleware/originCheck");

test("development allows the Live Server frontend and this server on localhost and 127.0.0.1 port 5000", () => {
  const { origins, ignored } = buildAllowedOrigins({ port: 5000, isProduction: false });
  assert.ok(origins.includes("http://localhost:5500"));
  assert.ok(origins.includes("http://127.0.0.1:5500"));
  assert.ok(origins.includes("http://localhost:5000"));
  assert.ok(origins.includes("http://127.0.0.1:5000"));
  assert.deepEqual(ignored, []);
});

test("development uses the PORT the server really runs on", () => {
  const { origins } = buildAllowedOrigins({ port: 5055, isProduction: false });
  assert.ok(origins.includes("http://localhost:5055"));
  assert.ok(!origins.includes("http://localhost:5000"));
});

test("production does NOT allow the local port 5000 addresses", () => {
  const { origins } = buildAllowedOrigins({ port: 5000, isProduction: true, frontendOrigin: "https://rabbora.co.uk" });
  assert.ok(!origins.includes("http://localhost:5000"));
  assert.ok(!origins.includes("http://127.0.0.1:5000"));
  assert.ok(origins.includes("https://rabbora.co.uk"));
});

test("production keeps the Live Server addresses exactly as before", () => {
  const { origins } = buildAllowedOrigins({ port: 5000, isProduction: true });
  assert.ok(origins.includes("http://localhost:5500"));
  assert.ok(origins.includes("http://127.0.0.1:5500"));
});

test("FRONTEND_ORIGIN: trailing slash and path are dropped; several values; invalid values ignored", () => {
  const { origins, ignored } = buildAllowedOrigins({
    isProduction: true,
    frontendOrigin: "https://rabbora.co.uk/, https://www.rabbora.co.uk/shop,*,null,javascript:alert(1), ftp://x.example",
  });
  assert.ok(origins.includes("https://rabbora.co.uk"));
  assert.ok(origins.includes("https://www.rabbora.co.uk"));
  assert.ok(!origins.includes("*"));
  assert.ok(!origins.includes("null"));
  assert.ok(!origins.some((o) => o.startsWith("javascript")));
  assert.ok(!origins.some((o) => o.startsWith("ftp")));
  assert.deepEqual(ignored, ["*", "null", "javascript:alert(1)", "ftp://x.example"]);
});

test("normalizeOrigin keeps scheme, host and port only", () => {
  assert.equal(normalizeOrigin("https://rabbora.co.uk/"), "https://rabbora.co.uk");
  assert.equal(normalizeOrigin("http://localhost:5000/account.html?x=1"), "http://localhost:5000");
  assert.equal(normalizeOrigin("*"), null);
  assert.equal(normalizeOrigin(""), null);
});

// ---------- real HTTP requests through the guard ----------

let server;
let base;
let productionServer;
let productionBase;

function startApp(allowed) {
  const app = express();
  app.use(express.json());
  app.use(...createOriginGuard(allowed));
  app.post("/api/auth/login", (req, res) => res.json({ success: true, reached: true }));
  app.get("/api/health", (req, res) => res.json({ success: true }));
  return new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
}

async function call(root, method, path, origin) {
  const headers = { "content-type": "application/json" };
  if (origin) headers.origin = origin;
  const res = await fetch(root + path, {
    method,
    headers,
    body: method === "POST" ? JSON.stringify({ email: "a@b.co", password: "x" }) : undefined,
    redirect: "manual",
  });
  let body = null;
  try { body = await res.json(); } catch (err) { body = null; }
  return { status: res.status, body, allowOrigin: res.headers.get("access-control-allow-origin") };
}

before(async () => {
  const dev = buildAllowedOrigins({ port: 5000, isProduction: false, frontendOrigin: "https://rabbora.co.uk" });
  server = await startApp(dev.origins);
  base = `http://127.0.0.1:${server.address().port}`;
  const prod = buildAllowedOrigins({ port: 5000, isProduction: true, frontendOrigin: "https://rabbora.co.uk,https://www.rabbora.co.uk" });
  productionServer = await startApp(prod.origins);
  productionBase = `http://127.0.0.1:${productionServer.address().port}`;
});

after(async () => {
  await new Promise((r) => server.close(r));
  await new Promise((r) => productionServer.close(r));
});

test("login from http://localhost:5000 is allowed (the reported 403 case)", async () => {
  const r = await call(base, "POST", "/api/auth/login", "http://localhost:5000");
  assert.equal(r.status, 200);
  assert.equal(r.body.reached, true);
  assert.equal(r.allowOrigin, "http://localhost:5000");
});

test("login from http://127.0.0.1:5000 is allowed", async () => {
  const r = await call(base, "POST", "/api/auth/login", "http://127.0.0.1:5000");
  assert.equal(r.status, 200);
  assert.equal(r.allowOrigin, "http://127.0.0.1:5000");
});

test("the Live Server origins still work in development", async () => {
  assert.equal((await call(base, "POST", "/api/auth/login", "http://localhost:5500")).status, 200);
  assert.equal((await call(base, "POST", "/api/auth/login", "http://127.0.0.1:5500")).status, 200);
});

test("the live site in FRONTEND_ORIGIN is allowed", async () => {
  const r = await call(base, "POST", "/api/auth/login", "https://rabbora.co.uk");
  assert.equal(r.status, 200);
  assert.equal(r.allowOrigin, "https://rabbora.co.uk");
});

test("an unknown website is refused for a data change (403, same message as before)", async () => {
  const r = await call(base, "POST", "/api/auth/login", "https://evil.example");
  assert.equal(r.status, 403);
  assert.deepEqual(r.body, { success: false, message: "Request not allowed from this website." });
  assert.equal(r.allowOrigin, null, "no CORS permission for an unknown website");
});

test("an unknown website can still read GET responses, but gets no CORS permission", async () => {
  const r = await call(base, "GET", "/api/health", "https://evil.example");
  assert.equal(r.status, 200);
  assert.equal(r.allowOrigin, null);
});

test("requests without an Origin header (curl, webhooks) are not refused by this check", async () => {
  assert.equal((await call(base, "POST", "/api/auth/login", null)).status, 200);
});

test("a preflight from an allowed origin is answered with 204", async () => {
  const res = await fetch(base + "/api/auth/login", {
    method: "OPTIONS",
    headers: { origin: "http://localhost:5000", "access-control-request-method": "POST" },
  });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-credentials"), "true");
});

test("production refuses localhost:5000 for a data change", async () => {
  const r = await call(productionBase, "POST", "/api/auth/login", "http://localhost:5000");
  assert.equal(r.status, 403);
});

test("production allows the configured live site", async () => {
  assert.equal((await call(productionBase, "POST", "/api/auth/login", "https://www.rabbora.co.uk")).status, 200);
});