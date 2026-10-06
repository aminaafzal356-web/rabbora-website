/*!
 * Rabbora Living — shared cart store
 * ---------------------------------------------------------------
 * Single source of truth for cart state, used by every product
 * page's Add to Cart button, script.js (header count), and
 * cart.html/cart.js. Persists to localStorage so the cart survives
 * refreshes and stays in sync across every page and open tab.
 * Do not duplicate this logic elsewhere — extend it here instead.
 *
 * Backend cart (logged-in customers only)
 * ---------------------------------------------------------------
 * The pages keep reading the cart from localStorage exactly as
 * before (instant, works offline). When the customer is logged in,
 * every change is ALSO sent to the backend cart API, and the
 * backend's answer (its lines, quantities and checked prices) is
 * written back into localStorage, so the backend is the authority
 * for every line it holds:
 *   GET    /api/cart              on page load / after login
 *   POST   /api/cart/items        a new line
 *   PATCH  /api/cart/items/:id    a new quantity
 *   DELETE /api/cart/items/:id    a removed line
 *   DELETE /api/cart              cart emptied
 * Calls go through api-config.js (window.RabboraApi), which must load
 * before this file; without it the cart simply stays local.
 *
 * The backend cart needs a login (it answers 401 otherwise), so for
 * guests nothing is sent: their cart stays in this browser and is
 * added to their account cart when they log in (account.js calls
 * RabboraCart.markLoggedIn()). account.js also calls markLoggedOut()
 * on logout, which empties this browser's copy.
 *
 * Each line still has the same fields as before; lines saved on the
 * backend also carry "serverItemId" (the backend cart line id).
 * Lines the backend cannot take (product not in the database yet,
 * e.g. Blanket Boxes; or a price the backend does not confirm) stay
 * in this browser only, are never thrown away, and a clear console
 * warning says why.
 */
(function (window) {
  "use strict";

  var STORAGE_KEY = "rabboraCart";
  var EVENT_NAME = "rabbora:cart:change";

  // Only "1" is stored: whether this browser has a logged-in session.
  // No name, email or id. Set/cleared by account.js.
  var SESSION_FLAG_KEY = "rabboraLoggedIn";
  // Lines (by lineId) the backend could not take during this browser
  // session, so they are not retried on every page view.
  var LOCAL_ONLY_KEY = "rabboraCartLocalOnly";

  function readAll() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Defensive: filter out any line that's missing the fields the
      // rest of the app relies on, rather than letting one malformed
      // entry break the whole cart page.
      return parsed.filter(function (item) {
        return (
          item &&
          typeof item === "object" &&
          typeof item.lineId === "string" &&
          item.lineId &&
          typeof item.name === "string" &&
          item.name &&
          typeof item.price === "number" &&
          isFinite(item.price) &&
          item.price >= 0 &&
          typeof item.quantity === "number" &&
          isFinite(item.quantity) &&
          item.quantity > 0
        );
      });
    } catch (err) {
      return [];
    }
  }

  function writeAllOnce(serialized) {
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (err) {
      return false;
    }
  }

  function writeAll(items) {
    var serialized = JSON.stringify(items);

    writeAllOnce(serialized);
    var readBack = null;
    try {
      readBack = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      readBack = null;
    }
    if (readBack === serialized) return true;

    // Retry once before giving up, in case of a transient failure.
    writeAllOnce(serialized);
    try {
      readBack = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      readBack = null;
    }
    if (readBack === serialized) return true;

    console.error(
      "[Rabbora Cart] localStorage write did not persist. " +
      "This usually means storage is full, disabled (private browsing), " +
      "or another script is clearing the \"" + STORAGE_KEY + "\" key."
    );
    return false;
  }

  function notify() {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { items: readAll() } }));
    } catch (err) {
      // Older browsers without CustomEvent support: callers that rely
      // solely on the event will miss live updates, but getAll()/
      // count() still work on demand.
    }
  }

  function getAll() {
    return readAll();
  }

  /**
   * Builds a stable, deterministic line-item ID from a product ID
   * plus its variant selections, so the exact same product with the
   * exact same variant always resolves to the same cart line — and a
   * different variant of the same product always resolves to a
   * different line. `variant` is a plain object of variant-name ->
   * value pairs (e.g. { size: "King", colour: "Blue" }); only
   * variant keys that are actually present are included, so products
   * with no variants at all still get a valid, stable line ID.
   */
  function buildLineId(productId, variant) {
    var base = String(productId);
    if (!variant) return base;

    var keys = Object.keys(variant).filter(function (key) {
      var value = variant[key];
      return value !== null && value !== undefined && value !== "";
    });
    if (keys.length === 0) return base;

    keys.sort();
    var parts = keys.map(function (key) {
      return key + ":" + String(variant[key]);
    });
    return base + "::" + parts.join("|");
  }

  function has(lineId) {
    if (!lineId) return false;
    return readAll().some(function (item) {
      return item.lineId === lineId;
    });
  }

  function count() {
    return readAll().reduce(function (total, item) {
      return total + item.quantity;
    }, 0);
  }

  function subtotal() {
    return readAll().reduce(function (total, item) {
      return total + item.price * item.quantity;
    }, 0);
  }

  function sanitizeQuantity(value) {
    var n = Math.floor(Number(value));
    if (!isFinite(n) || n < 1) return 1;
    return n;
  }

  function sanitizePrice(value) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 0;
    return n;
  }

  /**
   * Adds a product to the cart, or — if a line with the exact same
   * product ID + variant selections already exists — increases that
   * existing line's quantity instead of creating a duplicate.
   *
   * `product` should contain, at minimum: id, name, price, url. All
   * other fields (image, alt, slug, variant, category) are optional
   * and stored exactly as given — this function never invents or
   * substitutes product data.
   */
  function add(product, quantityToAdd) {
    if (!product || (product.id === undefined || product.id === null) || !product.name) {
      return getAll();
    }

    var qty = sanitizeQuantity(quantityToAdd === undefined ? 1 : quantityToAdd);
    var price = sanitizePrice(product.price);
    var lineId = buildLineId(product.id, product.variant);

    var items = readAll();
    var existing = items.find(function (item) {
      return item.lineId === lineId;
    });

    if (existing) {
      existing.quantity = sanitizeQuantity(existing.quantity + qty);
    } else {
      items.push({
        lineId: lineId,
        id: product.id,
        slug: product.slug || null,
        name: product.name,
        url: product.url || "index.html",
        image: product.image || "",
        alt: product.alt || product.name,
        price: price,
        variant: product.variant || null,
        // Optional: a small swatch image for the selected variant (e.g.
        // a fabric colour), separate from the main product image, so
        // Cart/Checkout can show a colour dot beside "Fabric: Plush
        // Grey" without guessing a path from the variant name.
        fabricImage: product.fabricImage || "",
        category: product.category || "",
        quantity: qty,
        addedAt: Date.now()
      });
    }

    var ok = writeAll(items);
    notify();
    serverSaveLine(lineId);
    return ok ? items : getAll();
  }

  function remove(lineId) {
    if (!lineId) return getAll();
    var removed = readAll().find(function (item) {
      return item.lineId === lineId;
    });
    var items = readAll().filter(function (item) {
      return item.lineId !== lineId;
    });
    writeAll(items);
    notify();
    if (removed) serverRemoveLine(removed);
    return items;
  }

  /**
   * Sets a line's quantity directly (not additive). Quantities are
   * always clamped to a positive integer — passing 0 or a negative
   * number removes the line entirely instead, since a cart line can
   * never legitimately hold zero or fewer units.
   */
  function updateQuantity(lineId, quantity) {
    if (!lineId) return getAll();

    var qty = Math.floor(Number(quantity));
    if (!isFinite(qty) || qty < 1) {
      return remove(lineId);
    }

    var items = readAll();
    var line = items.find(function (item) {
      return item.lineId === lineId;
    });
    if (!line) return items;

    line.quantity = sanitizeQuantity(qty);
    writeAll(items);
    notify();
    serverSaveLine(lineId);
    return items;
  }

  function clear() {
    writeAll([]);
    notify();
    serverClear();
  }

  // =============================================================
  // Backend cart sync
  // =============================================================

  var api = window.RabboraApi && typeof window.RabboraApi.request === "function" ? window.RabboraApi : null;
  if (!api) {
    console.warn(
      "[Rabbora Cart] api-config.js is not loaded on this page, so the cart stays in this browser only. " +
      "Add <script src=\"api-config.js\"></script> before cart-data.js."
    );
  }

  // "user" = logged in (backend cart in use), "guest", or "unknown".
  var serverState = "unknown";
  // Backend calls run one after another, in the order they were made.
  var queue = Promise.resolve();
  // Product name (lower case) -> Promise of { id, variants } or null.
  var productLookups = {};

  function enqueue(task) {
    queue = queue.then(task).catch(function (err) {
      console.error("[Rabbora Cart] Backend cart sync failed:", err && err.message ? err.message : err);
    });
    return queue;
  }

  function readFlag(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeFlag(key, value) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (err) {
      // Storage disabled: the cart simply stays local.
    }
  }

  function isLoggedInHere() {
    return readFlag(SESSION_FLAG_KEY) === "1";
  }

  function localOnlySet() {
    try {
      var raw = window.sessionStorage.getItem(LOCAL_ONLY_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function markLocalOnly(lineId, reason) {
    var list = localOnlySet();
    if (list.indexOf(lineId) === -1) list.push(lineId);
    try {
      window.sessionStorage.setItem(LOCAL_ONLY_KEY, JSON.stringify(list));
    } catch (err) {
      // Not critical: the line may just be retried on the next page.
    }
    console.warn("[Rabbora Cart] Kept in this browser only (not saved to your account cart): \"" + lineId + "\" — " + reason);
  }

  function isLocalOnly(lineId) {
    return localOnlySet().indexOf(lineId) !== -1;
  }

  // The backend's cart -> the same line shape the pages already use.
  // Lines only this browser has (not on the backend) are kept after them.
  function applyServerCart(cart) {
    if (!cart || !Array.isArray(cart.items)) return;
    var serverLines = cart.items.map(function (item) {
      var line = item.frontend_item || {};
      line.serverItemId = item.id;
      return line;
    });
    var serverKeys = {};
    serverLines.forEach(function (line) { serverKeys[line.lineId] = true; });
    var localOnly = readAll().filter(function (line) {
      return !line.serverItemId && !serverKeys[line.lineId];
    });
    writeAll(serverLines.concat(localOnly));
    notify();
  }

  function handleUnauthorised() {
    // The session ended (logged out elsewhere / expired). Lines that
    // belong to the account cart stay safe on the backend; this
    // browser's copy of them is dropped so they are not shown to the
    // next visitor or uploaded twice later.
    serverState = "guest";
    writeFlag(SESSION_FLAG_KEY, null);
    var items = readAll();
    var kept = items.filter(function (line) { return !line.serverItemId; });
    if (kept.length !== items.length) {
      writeAll(kept);
      notify();
    }
  }

  function describeFailure(result) {
    var message = result && result.data && result.data.message ? result.data.message : "";
    if (result && result.status === 0) return "backend not reachable";
    return "HTTP " + (result ? result.status : "?") + (message ? " — " + message : "");
  }

  // Finds the backend product (id + sizes) for a cart line by its exact
  // product name, using the existing product API:
  //   GET /api/products?search=<name>  ->  GET /api/products/<id>
  function lookupProduct(line) {
    var key = String(line.name || "").trim().toLowerCase();
    if (!key) return Promise.resolve(null);
    if (productLookups[key]) return productLookups[key];

    productLookups[key] = api.request("/products?search=" + encodeURIComponent(line.name.trim()) + "&limit=50")
      .then(function (result) {
        if (!result.ok || !result.data || !Array.isArray(result.data.products)) {
          delete productLookups[key];
          throw new Error("product search failed (" + describeFailure(result) + ")");
        }
        var match = result.data.products.filter(function (p) {
          return String(p.name || "").trim().toLowerCase() === key;
        })[0];
        if (!match) return null;
        return api.request("/products/" + match.id).then(function (detail) {
          if (!detail.ok || !detail.data || !detail.data.product) {
            delete productLookups[key];
            throw new Error("product details failed (" + describeFailure(detail) + ")");
          }
          return { id: detail.data.product.id, variants: detail.data.product.variants || [] };
        });
      });
    return productLookups[key];
  }

  // The request body POST /api/cart/items expects, from a cart line.
  function buildServerBody(line, product) {
    var options = line.variant && typeof line.variant === "object" ? line.variant : {};
    var sizeKey = options.size !== undefined && options.size !== null && options.size !== "" ? "size"
      : (options.width !== undefined && options.width !== null && options.width !== "" ? "width" : null);
    var variantId = null;
    if (sizeKey) {
      var variant = product.variants.filter(function (v) {
        return v.option_type === sizeKey && v.option_value === String(options[sizeKey]);
      })[0];
      if (!variant) return { error: "the backend has no \"" + options[sizeKey] + "\" " + sizeKey + " for this product" };
      variantId = variant.id;
    }
    var body = {
      product_id: product.id,
      product_variant_id: variantId,
      frontend_product_id: String(line.id),
      line_key: line.lineId,
      options: options,
      unit_price: line.price,
      quantity: line.quantity,
      name: line.name,
      url: line.url || "index.html",
      image: line.image || null,
      alt: line.alt || null,
      category: line.category || null,
      fabric_image: line.fabricImage || null
    };
    return { body: body };
  }

  // Sends one line (new or changed quantity) to the backend.
  function pushLine(line) {
    if (line.serverItemId) {
      return api.request("/cart/items/" + line.serverItemId, { method: "PATCH", body: { quantity: line.quantity } })
        .then(function (result) {
          if (result.ok && result.data && result.data.cart) return applyServerCart(result.data.cart);
          if (result.status === 401) return handleUnauthorised();
          if (result.status === 404) return refreshFromServer(); // line was removed elsewhere
          console.error("[Rabbora Cart] Could not update the quantity on the backend: " + describeFailure(result));
          return refreshFromServer();
        });
    }
    if (isLocalOnly(line.lineId)) return Promise.resolve();
    return lookupProduct(line).then(function (product) {
      if (!product) return markLocalOnly(line.lineId, "this product is not in the backend product list yet");
      var built = buildServerBody(line, product);
      if (built.error) return markLocalOnly(line.lineId, built.error);
      return api.request("/cart/items", { method: "POST", body: built.body }).then(function (result) {
        if (result.ok && result.data && result.data.cart) return applyServerCart(result.data.cart);
        if (result.status === 401) return handleUnauthorised();
        if (result.status === 400 || result.status === 404 || result.status === 409) {
          return markLocalOnly(line.lineId, "backend answered " + describeFailure(result));
        }
        console.error("[Rabbora Cart] Could not save this line to the backend cart: " + describeFailure(result));
      });
    });
  }

  function refreshFromServer() {
    return api.request("/cart").then(function (result) {
      if (result.ok && result.data && result.data.cart) {
        serverState = "user";
        return result.data.cart;
      }
      if (result.status === 401) {
        handleUnauthorised();
        return null;
      }
      console.warn("[Rabbora Cart] Backend cart not available right now (" + describeFailure(result) + "); showing this browser's copy.");
      return null;
    }).then(function (cart) {
      if (cart) applyServerCart(cart);
      return cart;
    });
  }

  /**
   * Loads the backend cart and merges it with this browser's copy:
   * lines added here as a guest (or while the backend was down) are
   * sent to the backend; lines removed on the backend elsewhere are
   * dropped here; then the backend's lines replace the local ones.
   */
  function syncWithServer() {
    if (!api || !isLoggedInHere()) return Promise.resolve();
    return enqueue(function () {
      return api.request("/cart").then(function (result) {
        if (result.status === 401) return handleUnauthorised();
        if (!result.ok || !result.data || !result.data.cart) {
          console.warn("[Rabbora Cart] Backend cart not available right now (" + describeFailure(result) + "); showing this browser's copy.");
          return;
        }
        serverState = "user";
        var cart = result.data.cart;
        var serverIds = {};
        var serverKeys = {};
        cart.items.forEach(function (item) {
          serverIds[item.id] = true;
          serverKeys[item.line_key] = true;
        });
        // Lines this browser had from the backend that the backend no
        // longer has were removed elsewhere: drop them here too.
        var items = readAll();
        var kept = items.filter(function (line) {
          return !line.serverItemId || serverIds[line.serverItemId];
        });
        if (kept.length !== items.length) writeAll(kept);

        var toSend = kept.filter(function (line) {
          return !line.serverItemId && !serverKeys[line.lineId] && !isLocalOnly(line.lineId);
        });
        var chain = Promise.resolve();
        toSend.forEach(function (line) {
          chain = chain.then(function () { return pushLine(line); });
        });
        return chain.then(function () {
          return toSend.length ? refreshFromServer() : applyServerCart(cart);
        });
      });
    });
  }

  function serverSaveLine(lineId) {
    if (!api || !isLoggedInHere()) return;
    enqueue(function () {
      if (serverState !== "user") return;
      var line = readAll().find(function (item) { return item.lineId === lineId; });
      if (line) return pushLine(line);
    });
  }

  function serverRemoveLine(line) {
    if (!api || !isLoggedInHere() || !line.serverItemId) return;
    enqueue(function () {
      if (serverState !== "user") return;
      return api.request("/cart/items/" + line.serverItemId, { method: "DELETE" }).then(function (result) {
        if (result.ok && result.data && result.data.cart) return applyServerCart(result.data.cart);
        if (result.status === 401) return handleUnauthorised();
        if (result.status === 404) return refreshFromServer();
        console.error("[Rabbora Cart] Could not remove this line from the backend cart: " + describeFailure(result));
        return refreshFromServer();
      });
    });
  }

  function serverClear() {
    if (!api || !isLoggedInHere()) return;
    enqueue(function () {
      if (serverState !== "user") return;
      return api.request("/cart", { method: "DELETE" }).then(function (result) {
        if (result.status === 401) return handleUnauthorised();
        if (!result.ok) console.error("[Rabbora Cart] Could not empty the backend cart: " + describeFailure(result));
      });
    });
  }

  // account.js: after a successful login (or when GET /api/auth/me says
  // the visitor is logged in). Sends this browser's lines to the account
  // cart and loads it.
  function markLoggedIn() {
    if (!isLoggedInHere()) writeFlag(SESSION_FLAG_KEY, "1");
    return syncWithServer();
  }

  // account.js: after a successful logout. The account cart stays on the
  // backend; this browser's copy is emptied (shared computers).
  function markLoggedOut() {
    serverState = "guest";
    writeFlag(SESSION_FLAG_KEY, null);
    try {
      window.sessionStorage.removeItem(LOCAL_ONLY_KEY);
    } catch (err) {
      // ignore
    }
    writeAll([]);
    notify();
  }

  // Keep every open tab/page in sync when localStorage changes elsewhere.
  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) notify();
  });

  window.RabboraCart = {
    STORAGE_KEY: STORAGE_KEY,
    EVENT_NAME: EVENT_NAME,
    getAll: getAll,
    has: has,
    count: count,
    subtotal: subtotal,
    add: add,
    remove: remove,
    updateQuantity: updateQuantity,
    clear: clear,
    buildLineId: buildLineId,
    syncWithServer: syncWithServer,
    markLoggedIn: markLoggedIn,
    markLoggedOut: markLoggedOut
  };

  // Load the account cart on every page view when this browser is
  // logged in (guests: nothing is requested).
  syncWithServer();
})(window);