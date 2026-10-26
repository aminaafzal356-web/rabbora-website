// Rabbora Living — backend (Step 7: core e-commerce API)
// Express server with: health/test routes, customer accounts and
// PostgreSQL-backed login sessions (routes/auth.js, config/session.js),
// categories, products with size pricing, fabrics and storage options,
// the logged-in customer's cart, profile + saved addresses, wishlist,
// orders, reviews, admin inventory and the admin panel reads
// (routes/admin.js). Structure:
//   routes/      URL -> controller (+ login/admin checks)
//   controllers/ read + validate the request, send the JSON answer
//   services/    database work (parameterised SQL only)
//   middleware/  requireAuth / requireAdmin, central error handler
//   utils/       pricing rules, validation, errors, transactions
// Payments: Stripe Checkout (routes/payments.js); keys only in backend/.env.

const fs = require("fs");
const path = require("path");
const express = require("express");

// Load backend/.env if it exists (built into Node 20.12+ / 21.7+,
// so no extra package is needed). Without a .env file the defaults
// below are used.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envPath);
}

// Required after .env is loaded so the pool and the session settings
// see the DB_* and SESSION_SECRET variables.
const db = require("./config/db");
const { sessionMiddleware, IS_PRODUCTION } = require("./config/session");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const enquiryRoutes = require("./routes/enquiries");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const categoryRoutes = require("./routes/categories");
const { fabricsRouter, storageRouter } = require("./routes/options");
const userRoutes = require("./routes/users");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const inventoryRoutes = require("./routes/inventory");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payments");
const { apiNotFound, errorHandler } = require("./middleware/errorHandler");
const { createSiteMiddleware, resolveFrontendDir, frontendCandidates } = require("./middleware/staticSite");
const { buildAllowedOrigins, createOriginGuard } = require("./middleware/originCheck");

const PORT = Number(process.env.PORT) || 5000;

const app = express();

// The website addresses below are also used to build the Stripe return
// address (controllers/paymentController.js).

// On the live site the API runs behind an HTTPS proxy; trusting the
// first proxy lets Express see the request as HTTPS so the Secure
// session cookie is sent. Not needed on localhost.
if (IS_PRODUCTION) {
  app.set("trust proxy", 1);
}

// ---------- Websites allowed to call the API (CORS + cross-site protection) ----------

// The allowed list is in middleware/originCheck.js. In development it includes
// the Live Server frontend (localhost:5500) and this server itself
// (localhost:PORT and 127.0.0.1:PORT). In production (NODE_ENV=production) it
// contains only the addresses in FRONTEND_ORIGIN.
const originConfig = buildAllowedOrigins({
  port: PORT,
  isProduction: IS_PRODUCTION,
  frontendOrigin: process.env.FRONTEND_ORIGIN,
});
const ALLOWED_ORIGINS = originConfig.origins;
if (originConfig.ignored.length) {
  console.warn("FRONTEND_ORIGIN entries ignored (not http or https addresses): " + originConfig.ignored.join(", "));
}

app.set("allowedOrigins", ALLOWED_ORIGINS);

// CORS answers and refusal of cross-site data changes (see the module).
app.use(...createOriginGuard(ALLOWED_ORIGINS));

// Stripe webhook: needs the RAW body for the signature check, so it is
// registered BEFORE express.json(). Stripe sends no Origin header and no
// cookie; it is trusted only when the Stripe-Signature header is valid.
app.post("/api/payments/stripe/webhook", express.raw({ type: "application/json", limit: "1mb" }), paymentRoutes.webhook);

// Parse JSON request bodies (limit protects against huge bodies).
app.use(express.json({ limit: "200kb" }));

// The website itself (HTML, CSS, JS, images) from the repository root.
// Mounted BEFORE the session middleware so page and image requests do not
// look up a login session in the database. The /api routes below are
// never handled here (the guard only serves website file types).
const frontendDir = resolveFrontendDir();
if (frontendDir) {
  app.use(...createSiteMiddleware(frontendDir));
  console.log(`Website files served from: ${frontendDir}`);
} else {
  console.warn(
    "Website files NOT served: no index.html found. Looked in: " +
    frontendCandidates().join(", ") + ". " +
    "Deploy the whole repository (the folder that contains index.html and backend/), " +
    "or set FRONTEND_DIR in the host's environment variables."
  );
}

// Login sessions (stored in PostgreSQL, cookie "rabbora.sid").
app.use(sessionMiddleware);

// ---------- Routes ----------

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Rabbora backend is working",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Rabbora API is healthy",
  });
});

// TEMPORARY — checks that the backend can reach PostgreSQL.
// Remove once real database-backed routes exist.
app.get("/api/db-test", async (req, res) => {
  try {
    await db.testConnection();
    res.json({
      success: true,
      message: "PostgreSQL database connected successfully",
    });
  } catch (err) {
    // Log the full reason on the server; send a clear, safe message
    // (no password or connection details) to the client.
    console.error("[db-test] PostgreSQL connection failed:", err.code || "", err.message);
    res.status(503).json({
      success: false,
      message: "PostgreSQL database connection failed",
      error: err.code || "DB_CONNECTION_ERROR",
    });
  }
});

// Accounts: POST /api/auth/register, POST /api/auth/login,
// POST /api/auth/logout, GET /api/auth/me.
// The old addresses (/api/register, /api/login, /api/logout, /api/me)
// keep working, because the register/login pages already use them.
app.use("/api/auth", authRoutes);
app.use("/api", authRoutes);

// Forgot / reset password: POST /api/auth/forgot-password,
// POST /api/auth/reset-password/validate, POST /api/auth/reset-password
// (routes/passwordReset.js; needs database/password_resets.sql).
app.use("/api/auth", passwordResetRoutes);
app.use("/api", passwordResetRoutes);

// Website forms: POST /api/fabric-samples, POST /api/contact
// (routes/enquiries.js; needs database/enquiries.sql). Admins read them
// at /api/admin/fabric-sample-requests and /api/admin/contact-messages.
app.use("/api", enquiryRoutes);

// Categories, products (with size pricing), fabric/storage catalogues
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/fabrics", fabricsRouter);
app.use("/api/storage-options", storageRouter);

// Cart (logged-in customers only): GET /api/cart, POST /api/cart/items,
// PATCH /api/cart/items/:id, DELETE /api/cart/items/:id, DELETE /api/cart
app.use("/api/cart", cartRoutes);

// Profile + addresses, wishlist, orders, reviews, inventory
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);

// Payments (Stripe Checkout): config, checkout session, payment status
app.use("/api/payments", paymentRoutes.router);

// Admin panel reads (admins only): GET /api/admin/stats,
// GET /api/admin/products, GET /api/admin/products/:id
app.use("/api/admin", adminRoutes);

// ---------- Unknown API routes ----------

app.use("/api", apiNotFound);

// ---------- Error handling ----------
// One place turns every error into the same safe JSON answer
// (middleware/errorHandler.js). Database details are only logged.
app.use(errorHandler);

// ---------- Start ----------

// Express 5 calls this callback for BOTH success and failure: if the
// port cannot be opened it passes the error in. Without checking it,
// the "running" message was printed even when the server failed to
// start, and Node then exited silently.
app.listen(PORT, (err) => {
  if (err) {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use — another program (often an earlier ` +
        `"npm start" / "node server.js" still running in another terminal) is using it.\n` +
        `Stop that program, or set a different PORT in backend/.env, then start again.`
      );
    } else {
      console.error("Could not start the Rabbora backend:", err.code || "", err.message);
    }
    process.exit(1);
  }
  console.log(`Rabbora backend running on http://localhost:${PORT}`);
  // Test / live / off — never prints a key.
  const stripeState = require("./config/stripe").describe();
  console.log(stripeState.line);
  stripeState.warnings.forEach((w) => console.warn("Stripe warning: " + w));
  // Password reset emails: on / off — never prints the SMTP password.
  console.log(require("./services/emailService").describe());
});