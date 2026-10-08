// Rabbora Living — simple in-memory rate limiting (no extra package).
// ---------------------------------------------------------------
// Counts requests per key (for example the visitor's IP address, or an
// email address) inside a time window. Used by the Forgot Password /
// Reset Password routes so nobody can spam reset emails or guess
// reset links.
//
// The counts live in this server's memory: they reset when the server
// restarts, and are per server process. That is fine for one Node
// process (how the Rabbora backend runs today). If the site is later
// run on several servers at once, move this to a shared store (Redis /
// PostgreSQL).
//
// Nothing personal is logged: keys are never printed.

class RateLimiter {
  // limit: how many hits are allowed per window; windowMs: window length.
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.hits = new Map(); // key -> { count, resetAt }

    // Forget finished windows every minute so memory can't grow forever.
    const timer = setInterval(() => this.sweep(), 60 * 1000);
    if (typeof timer.unref === "function") timer.unref();
  }

  // Records one hit for the key. Returns { allowed, retryAfterSeconds }.
  hit(key) {
    const now = Date.now();
    let entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + this.windowMs };
      this.hits.set(key, entry);
    }
    entry.count += 1;
    return {
      allowed: entry.count <= this.limit,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  sweep() {
    const now = Date.now();
    for (const [key, entry] of this.hits) {
      if (entry.resetAt <= now) this.hits.delete(key);
    }
  }

  // Used by the automated tests only.
  reset() {
    this.hits.clear();
  }
}

// The visitor's IP address. Behind the live HTTPS proxy, server.js sets
// "trust proxy", so req.ip is the real visitor address there.
function clientIp(req) {
  return req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
}

// Express middleware: answers 429 when one IP sends too many requests.
function limitByIp(limiter, message) {
  return (req, res, next) => {
    const result = limiter.hit(clientIp(req));
    if (result.allowed) return next();
    res.set("Retry-After", String(result.retryAfterSeconds));
    return res.status(429).json({
      success: false,
      code: "TOO_MANY_REQUESTS",
      message: message || "Too many requests. Please wait a few minutes and try again.",
    });
  };
}

module.exports = { RateLimiter, limitByIp, clientIp };