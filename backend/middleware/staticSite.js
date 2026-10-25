// Rabbora Living — serves the existing frontend (the HTML, CSS, JavaScript
// and image files in the repository root) from the same Express server
// that runs the API. Only frontend file types are served. The backend's
// own source, .env files, node_modules, database scripts, tests and git
// data are never served, whatever URL is requested.
//
// The frontend folder is the repository root (the folder that contains
// backend/). The website files must be inside the deployed folder: on a
// host that deploys only backend/, they are not present and nothing is served.

const fs = require("fs");
const path = require("path");
const express = require("express");

// Top-level folders/files that must never be served.
const BLOCKED_FIRST_SEGMENTS = new Set([
  "backend",
  "node_modules",
  "database",
  "tests",
  ".git",
]);

// File types the website actually uses. Anything else (.js of the backend
// is blocked above; .json, .sql, .md, .lock, .env, .log ...) is not served.
const ALLOWED_EXTENSIONS = new Set([
  ".html", ".css", ".js",
  ".png", ".jpg", ".jpeg", ".jfif", ".webp", ".gif", ".svg", ".ico",
  ".woff", ".woff2", ".ttf", ".otf",
  ".mp4", ".webm",
]);

// The folder that contains backend/ (the repository root when the whole
// repository is deployed).
function defaultBackendDir() {
  return path.resolve(__dirname, "..");
}

// Every folder that may hold the website, in the order they are tried.
// FRONTEND_DIR (relative to backend/, or absolute) comes first when set.
// Then the repository root, then the working directory and its parent,
// because hosts start the app from different folders.
function frontendCandidates({
  env = process.env,
  backendDir = defaultBackendDir(),
  cwd = process.cwd(),
} = {}) {
  const list = [];
  if (env.FRONTEND_DIR) list.push(path.resolve(backendDir, env.FRONTEND_DIR));
  list.push(path.resolve(backendDir, ".."));
  list.push(cwd);
  list.push(path.resolve(cwd, ".."));
  return [...new Set(list)];
}

// Returns the first candidate folder that contains index.html, or null.
function resolveFrontendDir(options = {}) {
  return frontendCandidates(options).find((dir) => fs.existsSync(path.join(dir, "index.html"))) || null;
}

// Decodes the URL path safely. Returns null for a malformed URL.
function decodedSegments(urlPath) {
  try {
    return decodeURIComponent(urlPath).split("/").filter(Boolean);
  } catch (err) {
    return null;
  }
}

// Express middleware list: a guard that refuses blocked paths and file
// types, then express.static for the allowed files. Anything not served
// falls through to the normal 404 handling.
function createSiteMiddleware(frontendDir) {
  const staticFiles = express.static(frontendDir, {
    index: ["index.html"],
    dotfiles: "ignore",
    redirect: false,
  });

  const guard = (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    const segments = decodedSegments(req.path);
    if (!segments) return next();

    // Refuse blocked folders, dot-files and dot-folders anywhere in the path.
    if (BLOCKED_FIRST_SEGMENTS.has(segments[0]) || segments.some((s) => s.startsWith("."))) {
      return next();
    }

    // Refuse any file type that is not part of the website.
    const last = segments[segments.length - 1] || "";
    const ext = path.extname(last).toLowerCase();
    if (ext && !ALLOWED_EXTENSIONS.has(ext)) return next();

    return staticFiles(req, res, next);
  };

  return [guard];
}

module.exports = {
  createSiteMiddleware,
  resolveFrontendDir,
  frontendCandidates,
  BLOCKED_FIRST_SEGMENTS,
  ALLOWED_EXTENSIONS,
};