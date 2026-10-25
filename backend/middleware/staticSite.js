// Rabbora Living — serves the existing frontend (the HTML, CSS, JavaScript
// and image files in the repository root) from the same Express server
// that runs the API. Only frontend file types are served. The backend's
// own source, .env files, node_modules, database scripts, tests and git
// data are never served, whatever URL is requested.
//
// The frontend folder is the repository root (one level above backend/).
// It can be overridden with FRONTEND_DIR in backend/.env if the host
// deploys the backend folder on its own.

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

function defaultFrontendDir() {
  return path.resolve(__dirname, "..", "..");
}

// Returns the folder to serve, or null when it does not contain the homepage.
function resolveFrontendDir(env = process.env) {
  const dir = env.FRONTEND_DIR ? path.resolve(env.FRONTEND_DIR) : defaultFrontendDir();
  return fs.existsSync(path.join(dir, "index.html")) ? dir : null;
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

module.exports = { createSiteMiddleware, resolveFrontendDir, BLOCKED_FIRST_SEGMENTS, ALLOWED_EXTENSIONS };