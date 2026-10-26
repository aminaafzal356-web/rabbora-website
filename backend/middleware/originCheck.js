// Rabbora Living — which websites may call the API.
//
// Two protections use the same list of allowed websites:
//   1. CORS: the browser is only given permission to read a response (with the
//      login cookie) when the page's address is in the list.
//   2. Cross-site request protection: requests that change data (log in,
//      register, cart, orders ...) are refused when the browser says they come
//      from a website that is not in the list. Requests with no Origin header
//      (curl, Postman, Stripe webhooks) are not refused here.
//
// The list is never "all websites". It contains:
//   - the VS Code Live Server frontend (localhost:5500 and 127.0.0.1:5500);
//   - in development only (NODE_ENV is not "production"): this server itself,
//     http://localhost:PORT and http://127.0.0.1:PORT (PORT is 5000 by default);
//   - the live site(s) listed in FRONTEND_ORIGIN, e.g.
//     FRONTEND_ORIGIN=https://rabbora.co.uk,https://www.rabbora.co.uk
// FRONTEND_ORIGIN entries are reduced to scheme + host + port, so a trailing
// slash or path does not stop a match. Anything that is not an http or https
// address (for example "*" or "null") is ignored.

const LOCAL_FRONTEND_ORIGINS = ["http://localhost:5500", "http://127.0.0.1:5500"];

// "https://rabbora.co.uk/shop" -> "https://rabbora.co.uk". null when not a web address.
function normalizeOrigin(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  let url;
  try {
    url = new URL(text);
  } catch (err) {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.origin;
}

function buildAllowedOrigins({ port = 5000, isProduction = false, frontendOrigin = "" } = {}) {
  const list = [...LOCAL_FRONTEND_ORIGINS];
  if (!isProduction) {
    list.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
  }
  const ignored = [];
  String(frontendOrigin || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const origin = normalizeOrigin(entry);
      if (origin) list.push(origin);
      else ignored.push(entry);
    });
  return { origins: [...new Set(list)], ignored };
}

// Returns [corsMiddleware, crossSiteRequestMiddleware] for app.use(...).
function createOriginGuard(allowedOrigins) {
  const allowed = new Set(allowedOrigins);

  const cors = (req, res, next) => {
    const origin = req.headers.origin;

    // Tells caches the answer depends on the Origin header.
    res.setHeader("Vary", "Origin");

    if (origin && allowed.has(origin)) {
      // An exact origin (never "*") — required when cookies are sent.
      res.setHeader("Access-Control-Allow-Origin", origin);
      // Lets the browser send and receive the session cookie with
      // fetch(..., { credentials: "include" }).
      res.setHeader("Access-Control-Allow-Credentials", "true");
      // PATCH/DELETE: cart, addresses, wishlist ...; PUT: admin option lists.
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
      // Browsers ask again at most every 10 minutes.
      res.setHeader("Access-Control-Max-Age", "600");

      // Browser preflight ("may I send this POST?") — answer it here.
      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }
    }

    next();
  };

  const crossSiteRequests = (req, res, next) => {
    const changesData = !["GET", "HEAD", "OPTIONS"].includes(req.method);
    const origin = req.headers.origin;

    if (changesData && origin && !allowed.has(origin)) {
      return res.status(403).json({
        success: false,
        message: "Request not allowed from this website.",
      });
    }

    next();
  };

  return [cors, crossSiteRequests];
}

module.exports = { buildAllowedOrigins, createOriginGuard, normalizeOrigin, LOCAL_FRONTEND_ORIGINS };