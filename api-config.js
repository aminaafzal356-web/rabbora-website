/*!
 * Rabbora Living — central API configuration
 * ---------------------------------------------------------------
 * ONE place for the backend address, so pages never need their own
 * hardcoded "http://localhost:5000" again.
 *
 * Load it BEFORE any script that talks to the backend, e.g.:
 *   <script src="api-config.js"></script>
 *   <script src="cart-data.js"></script>
 *
 * Which backend address is used (first match wins):
 *   1. window.RABBORA_API_BASE_URL, if a page sets it before this file
 *      (useful for testing another server).
 *   2. <meta name="rabbora-api-base" content="https://api.example.co.uk">
 *      in the page <head>, if present.
 *   3. Local development (page opened on localhost / 127.0.0.1 / as a
 *      file): http://localhost:5000 — the Rabbora backend.
 *   4. Anywhere else (the live site): the site's own address, so the
 *      live frontend never calls localhost. Change this later with
 *      option 1 or 2 if the live API runs on another address.
 *
 * Nothing here changes any page, price, cart or design. It only adds
 * window.RabboraApi:
 *   RabboraApi.BASE_URL          "http://localhost:5000"
 *   RabboraApi.API_URL           "http://localhost:5000/api"
 *   RabboraApi.url("/products")  "http://localhost:5000/api/products"
 *   RabboraApi.request("/me", { method: "GET" })
 *       -> Promise resolving to { ok, status, data } (never rejects),
 *          with the login cookie sent (credentials: "include"), the
 *          same behaviour as apiRequest() in account.js.
 */
(function (window) {
  "use strict";

  var DEV_BASE_URL = "http://localhost:5000";
  var REQUEST_TIMEOUT_MS = 15000;

  function trimTrailingSlash(value) {
    return String(value).replace(/\/+$/, "");
  }

  function readMetaBaseUrl() {
    try {
      var meta = window.document && window.document.querySelector('meta[name="rabbora-api-base"]');
      var content = meta ? (meta.getAttribute("content") || "").trim() : "";
      return content || null;
    } catch (err) {
      return null;
    }
  }

  function isLocalPage() {
    var location = window.location || {};
    var host = location.hostname || "";
    return location.protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "";
  }

  function resolveBaseUrl() {
    if (typeof window.RABBORA_API_BASE_URL === "string" && window.RABBORA_API_BASE_URL.trim()) {
      return trimTrailingSlash(window.RABBORA_API_BASE_URL.trim());
    }
    var fromMeta = readMetaBaseUrl();
    if (fromMeta) return trimTrailingSlash(fromMeta);
    if (isLocalPage()) return DEV_BASE_URL;
    return trimTrailingSlash(window.location.origin);
  }

  var BASE_URL = resolveBaseUrl();
  var API_URL = BASE_URL + "/api";

  // "/products/5", "products/5" or "/api/products/5" -> full API URL.
  function url(path) {
    var p = String(path || "");
    if (/^https?:\/\//i.test(p)) return p;
    if (p.indexOf("/api/") === 0 || p === "/api") return BASE_URL + p;
    if (p.charAt(0) !== "/") p = "/" + p;
    return API_URL + p;
  }

  /**
   * Calls the backend and always resolves with { ok, status, data }:
   *   ok     — true for HTTP 2xx
   *   status — HTTP status code (0 = no response: server not running,
   *            network/CORS error, or timeout)
   *   data   — parsed JSON body, or null
   * options: { method, body (object -> JSON), headers, timeoutMs }
   */
  function request(path, options) {
    var opts = options || {};
    var headers = { Accept: "application/json" };
    Object.keys(opts.headers || {}).forEach(function (key) {
      headers[key] = opts.headers[key];
    });

    var init = {
      method: opts.method || "GET",
      headers: headers,
      credentials: "include"
    };
    if (opts.body !== undefined) {
      init.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
      if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
    }

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeoutId = controller
      ? window.setTimeout(function () { controller.abort(); }, opts.timeoutMs || REQUEST_TIMEOUT_MS)
      : null;
    if (controller) init.signal = controller.signal;

    return window.fetch(url(path), init)
      .then(function (response) {
        return response
          .json()
          .catch(function () { return null; })
          .then(function (data) {
            return { ok: response.ok, status: response.status, data: data };
          });
      })
      .catch(function () {
        return { ok: false, status: 0, data: null };
      })
      .finally(function () {
        if (timeoutId) window.clearTimeout(timeoutId);
      });
  }

  window.RabboraApi = {
    BASE_URL: BASE_URL,
    API_URL: API_URL,
    url: url,
    request: request
  };
})(window);