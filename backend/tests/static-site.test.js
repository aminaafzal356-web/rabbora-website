// Rabbora Living — tests for serving the website files (middleware/staticSite.js).
// Uses a temporary folder with fake website and backend files, so the real
// project is never read or changed. No database and no keys are needed.

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const { createSiteMiddleware, resolveFrontendDir, frontendCandidates } = require("../middleware/staticSite");

let root;
let server;
let base;

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "rabbora-site-"));
  // Website files
  write("index.html", "<!doctype html><title>home</title>HOME");
  write("sofas.html", "SOFAS");
  write("style.css", "body{}");
  write("script.js", "console.log(1)");
  write("images/logo.png", "PNGDATA");
  write("images/img-1.jfif", "JFIFDATA");
  write("admin/index.html", "ADMIN PAGE");
  // Things that must NEVER be served
  write("backend/server.js", "SECRET SERVER SOURCE");
  write("backend/.env", "DB_PASSWORD=shh");
  write("backend/config/db.js", "SECRET DB CODE");
  write("backend/node_modules/x/index.js", "dep");
  write(".env", "TOP_SECRET=1");
  write("package.json", "{}");
  write("package-lock.json", "{}");
  write("database/schema.sql", "CREATE TABLE x;");
  write("tests/a.test.js", "test code");
  write("notes.md", "notes");
  write(".git/config", "git");

  const app = express();
  app.use(...createSiteMiddleware(root));
  app.get("/api/health", (req, res) => res.json({ success: true, message: "Rabbora API is healthy" }));
  app.use((req, res) => res.status(404).send("NOT FOUND"));
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  fs.rmSync(root, { recursive: true, force: true });
});

async function get(urlPath, method = "GET") {
  const res = await fetch(base + urlPath, { method, redirect: "manual" });
  return { status: res.status, body: await res.text(), type: res.headers.get("content-type") || "" };
}

test("/ serves the homepage (index.html)", async () => {
  const r = await get("/");
  assert.equal(r.status, 200);
  assert.match(r.body, /HOME/);
  assert.match(r.type, /text\/html/);
});

test("pages, CSS, JavaScript and images are served", async () => {
  assert.equal((await get("/sofas.html")).status, 200);
  const css = await get("/style.css");
  assert.equal(css.status, 200);
  assert.match(css.type, /text\/css/);
  assert.equal((await get("/script.js")).status, 200);
  const img = await get("/images/logo.png");
  assert.equal(img.status, 200);
  assert.equal(img.body, "PNGDATA");
  const jfif = await get("/images/img-1.jfif");
  assert.equal(jfif.status, 200);
  assert.equal(jfif.body, "JFIFDATA");
  assert.equal((await get("/admin/index.html")).status, 200);
});

test("the backend source is never served", async () => {
  for (const p of ["/backend/server.js", "/backend/config/db.js", "/backend/node_modules/x/index.js", "/backend/.env"]) {
    const r = await get(p);
    assert.equal(r.status, 404, p);
    assert.doesNotMatch(r.body, /SECRET|DB_PASSWORD|dep/, p);
  }
});

test("environment, package, database, test and git files are never served", async () => {
  for (const p of ["/.env", "/package.json", "/package-lock.json", "/database/schema.sql", "/tests/a.test.js", "/.git/config", "/notes.md"]) {
    const r = await get(p);
    assert.equal(r.status, 404, p);
    assert.doesNotMatch(r.body, /TOP_SECRET|CREATE TABLE|test code|git|notes/, p);
  }
});

test("dot-files and encoded traversal attempts are refused", async () => {
  for (const p of ["/%2e%2e/backend/.env", "/%2e%2e/%2e%2e/etc/passwd", "/images/.hidden.png", "/%E0%A4%A"]) {
    const r = await get(p);
    assert.equal(r.status, 404, p);
    assert.doesNotMatch(r.body, /DB_PASSWORD|TOP_SECRET|root:/, p);
  }
});

test("API routes are still handled by the API, not the static files", async () => {
  const r = await get("/api/health");
  assert.equal(r.status, 200);
  assert.match(r.body, /Rabbora API is healthy/);
});

test("write requests are not answered by the static files", async () => {
  const r = await get("/", "POST");
  assert.equal(r.status, 404);
});

test("frontend is found when the whole repository is deployed (index.html beside backend/)", () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "rabbora-repo-"));
  try {
    fs.writeFileSync(path.join(repo, "index.html"), "HOME");
    fs.mkdirSync(path.join(repo, "backend"));
    const backendDir = path.join(repo, "backend");
    assert.equal(resolveFrontendDir({ env: {}, backendDir, cwd: backendDir }), repo);
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});

test("frontend is found from the working directory when the host starts the app in the repository root", () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "rabbora-cwd-"));
  try {
    fs.writeFileSync(path.join(repo, "index.html"), "HOME");
    const backendDir = path.join(repo, "elsewhere", "backend");
    assert.equal(resolveFrontendDir({ env: {}, backendDir, cwd: repo }), repo);
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
});

test("FRONTEND_DIR is resolved relative to backend/ and wins over the defaults", () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "rabbora-fd-"));
  try {
    fs.writeFileSync(path.join(base, "index.html"), "ROOT");
    fs.mkdirSync(path.join(base, "site"));
    fs.writeFileSync(path.join(base, "site", "index.html"), "SITE");
    fs.mkdirSync(path.join(base, "backend"));
    const backendDir = path.join(base, "backend");
    assert.equal(
      resolveFrontendDir({ env: { FRONTEND_DIR: "../site" }, backendDir, cwd: backendDir }),
      path.join(base, "site")
    );
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("backend-only deployment: no index.html anywhere -> null, and every checked folder is listed", () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "rabbora-only-"));
  try {
    const backendDir = path.join(base, "backend");
    fs.mkdirSync(backendDir);
    assert.equal(resolveFrontendDir({ env: {}, backendDir, cwd: backendDir }), null);
    const checked = frontendCandidates({ env: {}, backendDir, cwd: backendDir });
    assert.ok(checked.includes(base));
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});