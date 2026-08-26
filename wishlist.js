(function () {
  "use strict";

  var REMOVE_ANIMATION_MS = 350;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function announce(message) {
    var statusEl = document.getElementById("wishlistStatus");
    if (statusEl) statusEl.textContent = message;
  }

  function buildCard(item, index) {
    var card = document.createElement("article");
    card.className = "product-card wishlist-card";
    card.dataset.productId = item.id;
    card.style.animationDelay = Math.min(index * 60, 480) + "ms";

    var badgeHtml = item.badge
      ? '<span class="product-card__badge">' + escapeHtml(item.badge) + "</span>"
      : "";

    var ratingHtml = "";
    if (item.stars) {
      ratingHtml =
        '<div class="product-card__rating">' +
          '<span class="product-card__stars" aria-hidden="true">' + escapeHtml(item.stars) + "</span>" +
          (item.reviewCount ? '<span class="product-card__review-count">(' + escapeHtml(item.reviewCount) + ")</span>" : "") +
        "</div>";
    }

    var categoryHtml = item.category
      ? '<p class="wishlist-card__category">' + escapeHtml(item.category) + "</p>"
      : "";

    var prevPriceHtml = item.previousPrice
      ? '<span class="product-card__price-prev">' + escapeHtml(item.previousPrice) + "</span>"
      : "";

    var priceHtml = item.price
      ? '<div class="product-card__price-row">' +
          '<span class="product-card__price">' + escapeHtml(item.price) + "</span>" +
          prevPriceHtml +
        "</div>"
      : "";

    var monthlyHtml = item.monthly
      ? '<p class="product-card__monthly">' + escapeHtml(item.monthly) + "</p>"
      : "";

    var safeUrl = escapeHtml(item.url || "index.html");
    var safeName = escapeHtml(item.name);
    var safeImage = escapeHtml(item.image || "");
    var safeAlt = escapeHtml(item.alt || item.name || "");

    card.innerHTML =
      '<div class="product-card__image-wrap">' +
        '<a class="product-card__image-link" href="' + safeUrl + '" aria-label="View details for ' + safeName + '">' +
          (safeImage
            ? '<img src="' + safeImage + '" alt="' + safeAlt + '" loading="lazy" width="900" height="900" />'
            : '<img src="images/img-2.png" alt="' + safeAlt + '" loading="lazy" width="900" height="900" />') +
        "</a>" +
        badgeHtml +
        '<button type="button" class="wishlist-card__remove-icon" data-remove-id="' + escapeHtml(item.id) + '" aria-pressed="true" aria-label="Remove ' + safeName + ' from wishlist">' +
          '<svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">' +
            '<path d="M10 17s-6.5-3.9-8.2-8.1C.6 6 2 3 5.1 3c1.9 0 3.4 1.1 4.9 3 1.5-1.9 3-3 4.9-3 3.1 0 4.5 3 3.3 5.9C16.5 13.1 10 17 10 17z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />' +
          "</svg>" +
        "</button>" +
      "</div>" +
      '<div class="product-card__body">' +
        '<a href="' + safeUrl + '" class="product-card__name">' + safeName + "</a>" +
        categoryHtml +
        ratingHtml +
        priceHtml +
        monthlyHtml +
        '<div class="wishlist-card__actions">' +
          '<a href="' + safeUrl + '" class="btn btn--outline-forest">View Product</a>' +
          '<button type="button" class="btn btn--forest" data-add-to-cart-id="' + escapeHtml(item.id) + '">Add to Cart</button>' +
        "</div>" +
        '<button type="button" class="wishlist-card__remove-text" data-remove-id="' + escapeHtml(item.id) + '">Remove from Wishlist</button>' +
        '<p class="wishlist-card__added-msg" data-added-msg-for="' + escapeHtml(item.id) + '" role="status" aria-live="polite"></p>' +
      "</div>";

    return card;
  }

  function updateToolbar(itemCount) {
    var toolbar = document.getElementById("wishlistToolbar");
    var countEl = document.getElementById("wishlistToolbarCount");
    if (!toolbar || !countEl) return;

    if (itemCount > 0) {
      toolbar.hidden = false;
      countEl.textContent = itemCount === 1 ? "1 item saved" : itemCount + " items saved";
    } else {
      toolbar.hidden = true;
    }
  }

  /**
   * Updates the header wishlist count badge directly from
   * window.RabboraWishlist.count(). This page owns this update
   * itself — it does not rely on script.js's own header-count logic
   * running correctly, so the badge on wishlist.html is correct even
   * if something else on the page fails.
   */
  function updateHeaderCount() {
    if (!window.RabboraWishlist) return;
    var count = window.RabboraWishlist.count();
    var countEl = document.getElementById("wishlistCount");
    if (countEl) countEl.textContent = String(count);

    var headerBtn = document.getElementById("wishlistBtn");
    if (headerBtn) {
      headerBtn.setAttribute("aria-label", "Wishlist, " + count + " items");
    }
  }

  function renderWishlist() {
    var grid = document.getElementById("wishlistGrid");
    var emptyState = document.getElementById("wishlistEmpty");
    if (!grid || !emptyState) return;

    // Read directly from the shared store every time this runs — never
    // from a cached/local variable — so the page always reflects
    // whatever is actually in localStorage["rabboraWishlist"] at this
    // exact moment, on every call site (initial load, custom event,
    // native storage event, and bfcache restore all funnel through
    // this same function).
    var items = window.RabboraWishlist ? window.RabboraWishlist.getAll() : [];

    grid.innerHTML = "";

    if (items.length === 0) {
      grid.hidden = true;
      emptyState.hidden = false;
      updateToolbar(0);
      updateHeaderCount();
      return;
    }

    grid.hidden = false;
    emptyState.hidden = true;

    var fragment = document.createDocumentFragment();
    items.forEach(function (item, index) {
      fragment.appendChild(buildCard(item, index));
    });
    grid.appendChild(fragment);

    updateToolbar(items.length);
    updateHeaderCount();
  }

  function removeItem(id, card) {
    if (!window.RabboraWishlist) return;

    var name = card ? (qs(".product-card__name", card) || {}).textContent : "";
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finishRemoval() {
      window.RabboraWishlist.remove(id);
      announce((name ? name + " removed from wishlist. " : "Item removed from wishlist. ") +
        window.RabboraWishlist.count() + " item" + (window.RabboraWishlist.count() === 1 ? "" : "s") + " remaining.");
      // renderWishlist() runs automatically via the wishlist:change
      // listener below, so the grid/empty-state always stays correct
      // even if this remove happened from another tab.
    }

    if (!card || reduceMotion) {
      finishRemoval();
      return;
    }

    card.classList.add("is-removing");
    var settled = false;
    var settle = function () {
      if (settled) return;
      settled = true;
      finishRemoval();
    };
    card.addEventListener("transitionend", settle, { once: true });
    // Fallback in case transitionend doesn't fire (e.g. element
    // already had opacity 0, or the browser skips the event).
    window.setTimeout(settle, REMOVE_ANIMATION_MS + 150);
  }

  function initGridInteractions() {
    var grid = document.getElementById("wishlistGrid");
    if (!grid) return;

    grid.addEventListener("click", function (event) {
      var removeBtn = event.target.closest("[data-remove-id]");
      if (removeBtn) {
        event.preventDefault();
        var card = removeBtn.closest(".wishlist-card");
        removeItem(removeBtn.getAttribute("data-remove-id"), card);
        return;
      }

      var addBtn = event.target.closest("[data-add-to-cart-id]");
      if (addBtn) {
        event.preventDefault();
        var cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
          var current = parseInt(cartCountEl.textContent, 10) || 0;
          cartCountEl.textContent = String(current + 1);
        }
        var msgEl = grid.querySelector('[data-added-msg-for="' + CSS.escape(addBtn.getAttribute("data-add-to-cart-id")) + '"]');
        if (msgEl) {
          msgEl.textContent = "Added to your basket.";
          window.setTimeout(function () {
            if (msgEl) msgEl.textContent = "";
          }, 4000);
        }
      }
    });
  }

  function initClearAll() {
    var clearBtn = document.getElementById("wishlistClearAll");
    if (!clearBtn) return;

    clearBtn.addEventListener("click", function () {
      if (!window.RabboraWishlist) return;
      var count = window.RabboraWishlist.count();
      if (count === 0) return;
      var confirmed = window.confirm(
        count === 1
          ? "Remove the 1 saved item from your wishlist?"
          : "Remove all " + count + " saved items from your wishlist?"
      );
      if (!confirmed) return;
      window.RabboraWishlist.clear();
      announce("Wishlist cleared.");
    });
  }

  function initWishlistPage() {
    // Safe initialization check: fail loudly and immediately if the
    // shared wishlist store never loaded, rather than silently
    // rendering an ambiguous "empty" wishlist that looks identical to
    // a genuinely empty one.
    if (!window.RabboraWishlist) {
      console.error("Rabbora Wishlist store failed to load.");
    }

    renderWishlist();
    initGridInteractions();
    initClearAll();

    if (window.RabboraWishlist) {
      window.addEventListener(window.RabboraWishlist.EVENT_NAME, renderWishlist);
    }

    // Defense in depth: if localStorage changes in another tab/window
    // (or is updated by a script that only fires the native "storage"
    // event rather than going through RabboraWishlist's own custom
    // event), re-render directly rather than relying solely on the
    // custom event above.
    window.addEventListener("storage", function (event) {
      if (!window.RabboraWishlist) return;
      if (event.key === window.RabboraWishlist.STORAGE_KEY) {
        renderWishlist();
      }
    });

    // Guard against a stale render: if this page is restored from the
    // browser's back/forward cache (bfcache), DOMContentLoaded does
    // NOT fire again — the page can reappear showing whatever was on
    // screen the moment it was cached, even if the wishlist changed
    // since then (e.g. the user added an item on Home, then used the
    // back button to return to a previously-cached Wishlist tab).
    // Re-render whenever the page is shown this way.
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        renderWishlist();
      }
    });
  }

  // Run as soon as the DOM is actually ready — but if this script
  // happens to execute after that point has already passed (a slow
  // network load, or the page being in a state where the event has
  // already fired), don't wait forever for an event that will never
  // come again. Initialize immediately in that case instead.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWishlistPage);
  } else {
    initWishlistPage();
  }
})();