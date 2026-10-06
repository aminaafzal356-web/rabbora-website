/*!
 * Rabbora Living — shared wishlist store
 * ---------------------------------------------------------------
 * Single source of truth for wishlist state, used by script.js,
 * ottoman-beds.js and wishlist.js. Persists to localStorage so the
 * wishlist survives refreshes and stays in sync across every page
 * and open tab. Do not duplicate this logic elsewhere — extend it
 * here instead.
 *
 * Backend sync (logged-in customers):
 *   Needs api-config.js loaded BEFORE this file (window.RabboraApi).
 *   When the visitor is logged in (account.js sets the
 *   "rabboraLoggedIn" flag), the account wishlist on the backend is
 *   the real wishlist:
 *     GET    /api/wishlist             loaded on every page view
 *     POST   /api/wishlist {productId} when a heart is switched on
 *     DELETE /api/wishlist/:productId  when a heart is switched off
 *     DELETE /api/wishlist             "clear all" on wishlist.html
 *   The backend product id is found by the product's exact name
 *   through the existing product API (GET /api/products?search=...),
 *   never hardcoded. Products the backend does not have stay saved in
 *   this browser only, exactly as before. Guests (not logged in) keep
 *   the old localStorage-only wishlist; their items are added to the
 *   account wishlist when they log in. Pages keep calling the same
 *   functions as before — nothing changes for them.
 */
(function (window) {
  "use strict";

  var STORAGE_KEY = "rabboraWishlist";
  var EVENT_NAME = "rabbora:wishlist:change";
  // Set to "1" by account.js (via the cart/wishlist stores) while logged in.
  var SESSION_FLAG_KEY = "rabboraLoggedIn";
  // sessionStorage: ids of items the backend cannot take (not in its catalogue).
  var LOCAL_ONLY_KEY = "rabboraWishlistLocalOnly";
  // localStorage: backend product ids removed here while the backend was
  // unreachable — the removal is retried on the next page view.
  var PENDING_REMOVE_KEY = "rabboraWishlistPendingRemove";

  function readAll() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
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

    if (readBack === serialized) {
      return true;
    }

    // The write did not verifiably land — retry exactly once before
    // giving up, in case this was a transient failure (e.g. a
    // momentary quota condition, or another script racing to write
    // the same key at the same instant).
    writeAllOnce(serialized);
    try {
      readBack = window.localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      readBack = null;
    }

    if (readBack === serialized) {
      return true;
    }

    // Still doesn't match after a retry: the write is not actually
    // persisting, even though no exception was thrown. Report this
    // loudly rather than letting the UI show a saved state that
    // localStorage doesn't actually contain.
    console.error(
      "[Rabbora Wishlist] localStorage write did not persist. " +
      "Intended value: " + serialized + " | " +
      "Actual value after write: " + readBack + " | " +
      "This usually means another script is clearing/overwriting the " +
      "\"" + STORAGE_KEY + "\" key, storage is full, or this page is " +
      "running an older/cached copy of wishlist-data.js that doesn't " +
      "match what was just deployed."
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

  function has(id) {
    if (!id) return false;
    return readAll().some(function (item) {
      return item.id === id;
    });
  }

  function count() {
    return readAll().length;
  }

  function mergeDefaults(product) {
    return {
      id: product.id,
      slug: product.slug || null,
      name: product.name || "Rabbora Product",
      url: product.url || "index.html",
      image: product.image || "",
      alt: product.alt || product.name || "Rabbora product",
      category: product.category || "",
      price: product.price || "",
      previousPrice: product.previousPrice || "",
      monthly: product.monthly || "",
      badge: product.badge || "",
      stars: product.stars || "",
      reviewCount: product.reviewCount || "",
      addedAt: Date.now()
    };
  }

  function add(product) {
    if (!product || !product.id) return getAll();
    var items = readAll();
    var exists = items.some(function (item) {
      return item.id === product.id;
    });
    if (!exists) {
      var entry = mergeDefaults(product);
      // Saved while logged in: belongs to that account, so it is never
      // left behind for the next visitor after logout.
      if (isLoggedInHere()) entry.account = true;
      items.push(entry);
      writeAll(items);
      notify();
      serverAdd(product.id);
    }
    return items;
  }

  function remove(id) {
    if (!id) return getAll();
    var all = readAll();
    var removed = all.filter(function (item) {
      return item.id === id;
    })[0] || null;
    var serverProductId = removed ? (removed.serverProductId || linkedIds[id] || null) : null;
    // The same backend product saved from two pages (e.g. a collection
    // page and its own category page) is ONE account wishlist entry, so
    // both local copies go together.
    var items = all.filter(function (item) {
      return item.id !== id && !(serverProductId && item.serverProductId === serverProductId);
    });
    writeAll(items);
    notify();
    if (removed) serverRemove(id, serverProductId);
    return items;
  }

  function toggle(product) {
    if (!product || !product.id) return { added: false, items: getAll(), persisted: true };
    var wasSaved = has(product.id);
    if (wasSaved) {
      remove(product.id);
    } else {
      add(product);
    }

    // Re-check the REAL, freshly-read persisted state — never assume
    // the write succeeded just because we took the "add" branch. This
    // is what a caller like script.js's click handler relies on to
    // decide whether to show the heart as saved and increment the
    // header count, so it must reflect what's actually in
    // localStorage, not what we intended to write.
    var isSavedNow = has(product.id);
    var persisted = wasSaved ? !isSavedNow : isSavedNow;

    if (!persisted) {
      console.error(
        "[Rabbora Wishlist] toggle() did not persist as expected for id \"" + product.id + "\". " +
        "Intended: " + (wasSaved ? "remove" : "add") + " | " +
        "Actual localStorage state now: " + (window.localStorage ? window.localStorage.getItem(STORAGE_KEY) : "(localStorage unavailable)")
      );
    }

    return { added: isSavedNow, items: getAll(), persisted: persisted };
  }

  function clear() {
    var serverProductIds = readAll()
      .map(function (item) { return item.serverProductId; })
      .filter(function (pid) { return !!pid; });
    writeAll([]);
    notify();
    serverClear(serverProductIds);
  }

  /**
   * Builds a wishlist-ready product snapshot straight from a
   * .product-card element already on the page, so we never invent
   * product data — only ever capture what's genuinely rendered.
   */
  function fromCard(card, idOverride) {
    if (!card) return null;
    var id = idOverride || card.dataset.productId || card.dataset.slug || null;
    if (!id) return null;

    var imageEl = card.querySelector(".product-card__image-wrap img");
    var nameEl = card.querySelector(".product-card__name");
    var linkEl = card.querySelector(".product-card__image-link") || nameEl;
    var priceEl = card.querySelector(".product-card__price");
    var prevPriceEl = card.querySelector(".product-card__price-prev");
    var monthlyEl = card.querySelector(".product-card__monthly");
    var badgeEl = card.querySelector(".product-card__badge");
    var starsEl = card.querySelector(".product-card__stars");
    var reviewEl = card.querySelector(".product-card__review-count");
    var categoryAttr = document.body ? document.body.getAttribute("data-wishlist-category") : null;

    return {
      id: id,
      slug: card.dataset.slug || null,
      name: nameEl ? nameEl.textContent.trim() : "Rabbora Product",
      url: (function () {
        var hrefAttr = linkEl ? linkEl.getAttribute("href") : null;
        if (hrefAttr) return hrefAttr;
        // Some product-card triggers are JS-driven buttons with no real
        // href (e.g. the blanket-boxes/sofas modal pattern) rather than
        // a real link. Fall back to this page's own URL plus a hash for
        // the product's slug, which those pages already know how to
        // open back into on load — better than silently pointing every
        // saved item at the homepage.
        var pageFile = window.location.pathname.split("/").pop() || "index.html";
        var slugForUrl = card.dataset.slug || "";
        return slugForUrl ? pageFile + "#" + slugForUrl : pageFile;
      })(),
      image: imageEl ? imageEl.getAttribute("src") || "" : "",
      alt: imageEl ? imageEl.getAttribute("alt") || "" : "",
      price: priceEl ? priceEl.textContent.trim() : "",
      previousPrice: prevPriceEl ? prevPriceEl.textContent.trim() : "",
      monthly: monthlyEl ? monthlyEl.textContent.trim() : "",
      badge: badgeEl ? badgeEl.textContent.trim() : "",
      stars: starsEl ? starsEl.textContent.trim() : "",
      reviewCount: reviewEl ? reviewEl.textContent.trim() : "",
      category: categoryAttr || ""
    };
  }

  /**
   * Reflects saved wishlist state onto every .product-card__wishlist
   * heart within `scope` (defaults to the whole document).
   */
  function syncButtons(scope) {
    var root = scope || document;
    var buttons = root.querySelectorAll(".product-card__wishlist");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var card = btn.closest(".product-card");
      if (!card) continue;
      var id = card.dataset.productId || card.dataset.slug;
      if (!id) continue;
      var isSaved = has(id);
      btn.setAttribute("aria-pressed", String(isSaved));
      btn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }
  }

  // =============================================================
  // Backend sync (logged-in customers only)
  // =============================================================

  var api = window.RabboraApi && typeof window.RabboraApi.request === "function" ? window.RabboraApi : null;
  if (!api) {
    console.warn(
      "[Rabbora Wishlist] api-config.js is not loaded on this page, so the wishlist stays in this browser only. " +
      "Add <script src=\"api-config.js\"></script> before wishlist-data.js."
    );
  }

  // Category slug on the backend -> the existing page that shows its
  // products (each page opens a product with "#/<slug>"). Only used to
  // build the link for an item that exists in the account wishlist but
  // not yet in this browser (e.g. saved on another device).
  var CATEGORY_PAGES = {
    "slatted-ottoman-beds": "ottoman-beds.html",
    "solid-base-ottomans": "solid-base-ottomans.html",
    "storage-drawers": "storage-drawers.html",
    "high-headboard-beds": "high-headboard-beds.html",
    "tv-beds": "tv-beds.html",
    "kids-beds": "kids-beds.html",
    "mattresses": "mattresses.html",
    "sofas": "sofas.html"
  };

  // "user" = logged in and the account wishlist was loaded, "guest", or "unknown".
  var serverState = "unknown";
  // Backend calls run one after another, in the order they were made.
  var queue = Promise.resolve();
  // Product name (lower case) -> Promise of the backend product id (or null).
  var productLookups = {};
  // Local item id -> backend product id, for items linked on this page.
  var linkedIds = {};

  function enqueue(task) {
    queue = queue.then(task).catch(function (err) {
      console.warn(
        "[Rabbora Wishlist] Backend wishlist sync failed (" + (err && err.message ? err.message : err) + "). " +
        "Your wishlist is kept in this browser and will be synced on the next page load."
      );
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
      // Storage disabled: the wishlist simply stays local.
    }
  }

  function isLoggedInHere() {
    return readFlag(SESSION_FLAG_KEY) === "1";
  }

  function readList(storage, key) {
    try {
      var raw = storage.getItem(key);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function writeList(storage, key, list) {
    try {
      if (list.length) storage.setItem(key, JSON.stringify(list));
      else storage.removeItem(key);
    } catch (err) {
      // Not critical.
    }
  }

  function markLocalOnly(id, reason) {
    var list = readList(window.sessionStorage, LOCAL_ONLY_KEY);
    if (list.indexOf(id) === -1) {
      list.push(id);
      writeList(window.sessionStorage, LOCAL_ONLY_KEY, list);
      console.info("[Rabbora Wishlist] Kept in this browser only (not saved to your account wishlist): \"" + id + "\" — " + reason);
    }
  }

  function isLocalOnly(id) {
    return readList(window.sessionStorage, LOCAL_ONLY_KEY).indexOf(id) !== -1;
  }

  function pendingRemovals() {
    return readList(window.localStorage, PENDING_REMOVE_KEY);
  }

  function addPendingRemoval(serverProductId) {
    var list = pendingRemovals();
    if (list.indexOf(serverProductId) === -1) {
      list.push(serverProductId);
      writeList(window.localStorage, PENDING_REMOVE_KEY, list);
    }
  }

  function dropPendingRemoval(serverProductId) {
    writeList(window.localStorage, PENDING_REMOVE_KEY, pendingRemovals().filter(function (pid) {
      return pid !== serverProductId;
    }));
  }

  function describeFailure(result) {
    var message = result && result.data && result.data.message ? result.data.message : "";
    if (result && result.status === 0) return "backend not reachable";
    return "HTTP " + (result ? result.status : "?") + (message ? " — " + message : "");
  }

  function sameName(a, b) {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase() && String(a || "").trim() !== "";
  }

  // Items that belong to a logged-in account (saved to / loaded from it).
  function isAccountItem(item) {
    return !!(item && (item.serverProductId || item.account));
  }

  // The session ended (logged out elsewhere / expired) or this browser is
  // not logged in: the account's items stay safe on the backend, and this
  // browser's copy of them is dropped so the next visitor never sees them.
  // Guest items (saved while logged out) are kept.
  function dropAccountItems() {
    var items = readAll();
    var kept = items.filter(function (item) { return !isAccountItem(item); });
    if (kept.length !== items.length) {
      writeAll(kept);
      notify();
    }
  }

  function handleUnauthorised() {
    serverState = "guest";
    linkedIds = {};
    writeFlag(SESSION_FLAG_KEY, null);
    writeList(window.localStorage, PENDING_REMOVE_KEY, []);
    dropAccountItems();
  }

  // Finds the backend product id for a wishlist item by its exact product
  // name, using the existing product API: GET /api/products?search=<name>
  function lookupProductId(item) {
    if (item.serverProductId) return Promise.resolve(item.serverProductId);
    var key = String(item.name || "").trim().toLowerCase();
    if (!key) return Promise.resolve(null);
    if (productLookups[key]) return productLookups[key];

    productLookups[key] = api.request("/products?search=" + encodeURIComponent(String(item.name).trim()) + "&limit=50")
      .then(function (result) {
        if (!result.ok || !result.data || !Array.isArray(result.data.products)) {
          delete productLookups[key];
          throw new Error("product search failed (" + describeFailure(result) + ")");
        }
        var match = result.data.products.filter(function (p) {
          return sameName(p.name, item.name);
        })[0];
        return match ? match.id : null;
      });
    return productLookups[key];
  }

  // Remembers the backend product id on the local item. If the same
  // product was also saved from another page, only this (newest) copy is
  // kept, so the wishlist matches the account wishlist (one per product).
  function linkItem(id, serverProductId) {
    linkedIds[id] = serverProductId;
    var items = readAll();
    var found = false;
    var before = items.length;
    items = items.filter(function (item) {
      if (item.id === id) {
        item.serverProductId = serverProductId;
        found = true;
        return true;
      }
      return item.serverProductId !== serverProductId;
    });
    if (!found) {
      // Removed here while the POST was on its way: remove it on the backend too.
      return deleteOnServer(serverProductId);
    }
    writeAll(items);
    if (items.length !== before) notify();
  }

  // Sends one local item to the account wishlist.
  function pushItem(item) {
    if (item.serverProductId || isLocalOnly(item.id)) return Promise.resolve();
    return lookupProductId(item).then(function (serverProductId) {
      if (!serverProductId) {
        return markLocalOnly(item.id, "this product is not in the backend product list yet");
      }
      return api.request("/wishlist", { method: "POST", body: { productId: serverProductId } }).then(function (result) {
        if (result.ok) return linkItem(item.id, (result.data && result.data.productId) || serverProductId);
        if (result.status === 401) return handleUnauthorised();
        if (result.status === 400 || result.status === 404) {
          return markLocalOnly(item.id, "backend answered " + describeFailure(result));
        }
        throw new Error("could not save \"" + item.name + "\" (" + describeFailure(result) + ")");
      });
    });
  }

  function deleteOnServer(serverProductId) {
    addPendingRemoval(serverProductId);
    return api.request("/wishlist/" + encodeURIComponent(serverProductId), { method: "DELETE" }).then(function (result) {
      // 404 = it is already not in the account wishlist: nothing left to do.
      if (result.ok || result.status === 404) {
        dropPendingRemoval(serverProductId);
        Object.keys(linkedIds).forEach(function (id) {
          if (linkedIds[id] === serverProductId) delete linkedIds[id];
        });
        return;
      }
      if (result.status === 401) return handleUnauthorised();
      // Stays removed here; the removal is retried on the next page view
      // (before the account wishlist is loaded), so it never comes back.
      console.warn(
        "[Rabbora Wishlist] Could not remove product " + serverProductId + " from your account wishlist (" +
        describeFailure(result) + "). It stays removed here and will be removed on the backend on the next page load."
      );
    });
  }

  function retryPendingRemovals() {
    var chain = Promise.resolve();
    pendingRemovals().forEach(function (serverProductId) {
      chain = chain.then(function () {
        if (isLoggedInHere()) return deleteOnServer(serverProductId);
      });
    });
    return chain;
  }

  function money(value) {
    var n = Number(value);
    return isFinite(n) && value !== null && value !== "" ? "£" + n.toFixed(2) : "";
  }

  // A wishlist item for a product that is in the account wishlist but not
  // in this browser, built only from real backend data.
  function buildItemFromServer(entry) {
    return api.request("/products/" + encodeURIComponent(entry.productId)).then(function (detail) {
      var product = detail.ok && detail.data && detail.data.product ? detail.data.product : null;
      var pricing = (product && product.fromPricing) || entry.pricing || {};
      var category = product && product.category ? product.category : null;
      var page = category && CATEGORY_PAGES[category.slug] ? CATEGORY_PAGES[category.slug] : null;
      var addedAt = Date.parse(entry.addedAt);
      return {
        id: entry.slug || String(entry.productId),
        slug: entry.slug || null,
        name: entry.name || "Rabbora Product",
        url: page && entry.slug ? page + "#/" + entry.slug : "index.html",
        image: entry.mainImage || "",
        alt: entry.name || "Rabbora product",
        category: category ? category.name : "",
        price: money(pricing.salePrice),
        previousPrice: pricing.originalPrice ? money(pricing.originalPrice) : "",
        monthly: pricing.monthly ? "or from £" + pricing.monthly + "/mo" : "",
        badge: "",
        stars: "",
        reviewCount: "",
        addedAt: isFinite(addedAt) ? addedAt : Date.now(),
        serverProductId: entry.productId
      };
    });
  }

  // Merges the account wishlist (from GET /api/wishlist) into this browser:
  //  - items removed from the account elsewhere are dropped here;
  //  - this browser's items that match an account item are linked to it;
  //  - this browser's other items (saved as a guest, or while the backend
  //    was down) are added to the account wishlist;
  //  - account items this browser does not have yet are added here.
  function mergeServerList(serverItems) {
    var pending = pendingRemovals();
    serverItems = serverItems.filter(function (entry) {
      return pending.indexOf(entry.productId) === -1;
    });

    function matches(entry, item) {
      return item.serverProductId === entry.productId ||
        (!item.serverProductId && (sameName(entry.name, item.name) ||
          (entry.slug && (entry.slug === item.id || entry.slug === item.slug))));
    }

    // Account items this browser has no copy of yet: load their details first.
    var current = readAll();
    var missing = serverItems.filter(function (entry) {
      return !current.some(function (item) { return matches(entry, item); });
    });

    return Promise.all(missing.map(buildItemFromServer)).then(function (built) {
      var serverById = {};
      serverItems.forEach(function (entry) { serverById[entry.productId] = entry; });

      // Fresh read, in case a heart was clicked while the details loaded.
      var items = readAll().filter(function (item) {
        return !item.serverProductId || serverById[item.serverProductId];
      });
      items.forEach(function (item) {
        if (item.serverProductId) return;
        var match = serverItems.filter(function (entry) { return matches(entry, item); })[0];
        if (match) item.serverProductId = match.productId;
      });

      // One local item per account product (the newest copy wins).
      var newestFor = {};
      items.forEach(function (item) {
        if (!item.serverProductId) return;
        var kept = newestFor[item.serverProductId];
        if (!kept || (item.addedAt || 0) >= (kept.addedAt || 0)) newestFor[item.serverProductId] = item;
      });
      items = items.filter(function (item) {
        return !item.serverProductId || newestFor[item.serverProductId] === item;
      });

      built.sort(function (a, b) { return a.addedAt - b.addedAt; });
      built.forEach(function (item) {
        if (newestFor[item.serverProductId]) return;
        if (items.some(function (existing) { return existing.id === item.id; })) return;
        newestFor[item.serverProductId] = item;
        items.push(item);
      });

      writeAll(items);
      notify();
      return items.filter(function (item) { return !item.serverProductId && !isLocalOnly(item.id); });
    });
  }

  /**
   * Loads the account wishlist and merges it with this browser's copy.
   * Called on every page view while logged in, and by account.js right
   * after login. Guests: nothing is requested.
   */
  function syncWithServer() {
    if (!api || !isLoggedInHere()) return Promise.resolve();
    return enqueue(function () {
      return retryPendingRemovals().then(function () {
        if (!isLoggedInHere()) return;
        return api.request("/wishlist").then(function (result) {
          if (result.status === 401) return handleUnauthorised();
          if (!result.ok || !result.data || !Array.isArray(result.data.items)) {
            console.warn("[Rabbora Wishlist] Account wishlist not available right now (" + describeFailure(result) + "); showing this browser's copy.");
            return;
          }
          serverState = "user";
          return mergeServerList(result.data.items).then(function (toSend) {
            var chain = Promise.resolve();
            toSend.forEach(function (item) {
              chain = chain.then(function () {
                if (isLoggedInHere()) return pushItem(item);
              });
            });
            return chain;
          });
        });
      });
    });
  }

  function serverAdd(id) {
    if (!api || !isLoggedInHere()) return;
    enqueue(function () {
      if (!isLoggedInHere()) return;
      var item = readAll().filter(function (entry) { return entry.id === id; })[0];
      if (item) return pushItem(item);
    });
  }

  function serverRemove(id, serverProductId) {
    if (!api || !isLoggedInHere()) return;
    enqueue(function () {
      if (!isLoggedInHere()) return;
      // Not linked yet when removed: it may have been linked by a POST
      // that finished in the meantime (linkItem handles the rest).
      var pid = serverProductId || linkedIds[id];
      if (pid) return deleteOnServer(pid);
    });
  }

  function serverClear(serverProductIds) {
    if (!api || !isLoggedInHere()) return;
    serverProductIds.forEach(addPendingRemoval);
    enqueue(function () {
      if (!isLoggedInHere()) return;
      return api.request("/wishlist", { method: "DELETE" }).then(function (result) {
        if (result.ok) {
          serverProductIds.forEach(dropPendingRemoval);
          linkedIds = {};
          return;
        }
        if (result.status === 401) return handleUnauthorised();
        console.warn(
          "[Rabbora Wishlist] Could not empty your account wishlist (" + describeFailure(result) + "). " +
          "It stays empty here and the backend will be emptied on the next page load."
        );
      });
    });
  }

  // account.js: after a successful login (or when GET /api/auth/me says
  // the visitor is logged in). Adds this browser's items to the account
  // wishlist and loads it.
  function markLoggedIn() {
    if (!isLoggedInHere()) writeFlag(SESSION_FLAG_KEY, "1");
    if (serverState === "user") return Promise.resolve();
    return syncWithServer();
  }

  // account.js: after a successful logout. The account wishlist stays on
  // the backend; this browser's copy is emptied (shared computers).
  function markLoggedOut() {
    serverState = "guest";
    linkedIds = {};
    writeFlag(SESSION_FLAG_KEY, null);
    writeList(window.localStorage, PENDING_REMOVE_KEY, []);
    writeList(window.sessionStorage, LOCAL_ONLY_KEY, []);
    writeAll([]);
    notify();
  }

  // Keep every open tab/page in sync when localStorage changes elsewhere.
  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) notify();
  });

  window.RabboraWishlist = {
    STORAGE_KEY: STORAGE_KEY,
    EVENT_NAME: EVENT_NAME,
    getAll: getAll,
    has: has,
    count: count,
    add: add,
    remove: remove,
    toggle: toggle,
    clear: clear,
    fromCard: fromCard,
    syncButtons: syncButtons,
    syncWithServer: syncWithServer,
    markLoggedIn: markLoggedIn,
    markLoggedOut: markLoggedOut
  };

  // Not logged in here (logged out, possibly on a page without this
  // file): never show the previous account's items. Logged in: load the
  // account wishlist on every page view.
  if (isLoggedInHere()) {
    syncWithServer();
  } else {
    dropAccountItems();
  }
})(window);