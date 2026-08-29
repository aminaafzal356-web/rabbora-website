/*!
 * Rabbora Living — shared cart store
 * ---------------------------------------------------------------
 * Single source of truth for cart state, used by every product
 * page's Add to Cart button, script.js (header count), and
 * cart.html/cart.js. Persists to localStorage so the cart survives
 * refreshes and stays in sync across every page and open tab.
 * Do not duplicate this logic elsewhere — extend it here instead.
 */
(function (window) {
  "use strict";

  var STORAGE_KEY = "rabboraCart";
  var EVENT_NAME = "rabbora:cart:change";

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
        category: product.category || "",
        quantity: qty,
        addedAt: Date.now()
      });
    }

    var ok = writeAll(items);
    notify();
    return ok ? items : getAll();
  }

  function remove(lineId) {
    if (!lineId) return getAll();
    var items = readAll().filter(function (item) {
      return item.lineId !== lineId;
    });
    writeAll(items);
    notify();
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
    return items;
  }

  function clear() {
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
    buildLineId: buildLineId
  };
})(window);
