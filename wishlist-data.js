/*!
 * Rabbora Living — shared wishlist store
 * ---------------------------------------------------------------
 * Single source of truth for wishlist state, used by script.js,
 * ottoman-beds.js and wishlist.js. Persists to localStorage so the
 * wishlist survives refreshes and stays in sync across every page
 * and open tab. Do not duplicate this logic elsewhere — extend it
 * here instead.
 */
(function (window) {
  "use strict";

  var STORAGE_KEY = "rabboraWishlist";
  var EVENT_NAME = "rabbora:wishlist:change";

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

  function writeAll(items) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (err) {
      // Private browsing / storage disabled / quota exceeded — the
      // wishlist simply won't persist this change, but the page
      // should keep working rather than throw.
      return false;
    }
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
      items.push(mergeDefaults(product));
      writeAll(items);
      notify();
    }
    return items;
  }

  function remove(id) {
    if (!id) return getAll();
    var items = readAll().filter(function (item) {
      return item.id !== id;
    });
    writeAll(items);
    notify();
    return items;
  }

  function toggle(product) {
    if (!product || !product.id) return { added: false, items: getAll() };
    if (has(product.id)) {
      remove(product.id);
      return { added: false, items: getAll() };
    }
    add(product);
    return { added: true, items: getAll() };
  }

  function clear() {
    writeAll([]);
    notify();
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
    syncButtons: syncButtons
  };
})(window);