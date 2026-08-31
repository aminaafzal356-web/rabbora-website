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

  function formatMoney(amount) {
    var n = Number(amount);
    if (!isFinite(n) || n < 0) n = 0;
    return "\u00A3" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function hasCartStore() {
    return !!(window.RabboraCart && typeof window.RabboraCart.getAll === "function");
  }

  function announce(message) {
    var statusEl = document.getElementById("cartStatusText");
    if (statusEl) statusEl.textContent = message;
  }

  /**
   * ===========================================================
   * FUTURE BACKEND INTEGRATION POINT — delivery
   * ===========================================================
   * There is no delivery-rules backend yet, so this is kept
   * deliberately simple and clearly separated from product-price
   * calculation. Replace the body of this function with a real
   * call to a delivery/shipping API once one exists — it should
   * take the current cart contents (and eventually an address)
   * and return a delivery cost, without this file needing to
   * change how it uses the result.
   */
  function calculateDelivery(items) {
    if (!items || items.length === 0) return 0;
    // Placeholder rule only, matching the site's existing "Free UK
    // delivery on all bed frames" announcement — real rules (by
    // product category, weight, postcode, etc.) belong in a real
    // backend, not invented here.
    return 0;
  }

  function buildVariantHtml(variant) {
    if (!variant) return "";
    var labels = { size: "Size", colour: "Colour", color: "Colour", fabric: "Fabric", diamantes: "Diamantes", buttons: "Buttons" };
    var parts = [];
    Object.keys(variant).forEach(function (key) {
      var value = variant[key];
      if (value === null || value === undefined || value === "") return;
      var label = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
      parts.push('<span>' + escapeHtml(label) + ': <strong>' + escapeHtml(value) + '</strong></span>');
    });
    if (parts.length === 0) return "";
    return '<div class="cart-item__variant">' + parts.join("") + '</div>';
  }

  function buildItemHtml(item) {
    var safeUrl = escapeHtml(item.url || "index.html");
    var safeName = escapeHtml(item.name);
    var safeImage = escapeHtml(item.image || "");
    var safeAlt = escapeHtml(item.alt || item.name || "");
    var lineTotal = item.price * item.quantity;

    return (
      '<article class="cart-item" data-line-id="' + escapeHtml(item.lineId) + '">' +
        '<a class="cart-item__image-link" href="' + safeUrl + '" aria-label="View ' + safeName + '">' +
          (safeImage
            ? '<img src="' + safeImage + '" alt="' + safeAlt + '" loading="lazy" width="220" height="220" />'
            : '<img src="images/img-2.png" alt="' + safeAlt + '" loading="lazy" width="220" height="220" />') +
        '</a>' +
        '<div class="cart-item__body">' +
          '<div class="cart-item__top">' +
            '<a href="' + safeUrl + '" class="cart-item__name">' + safeName + '</a>' +
            '<button type="button" class="cart-item__remove" data-remove-id="' + escapeHtml(item.lineId) + '" aria-label="Remove ' + safeName + ' from cart">' +
              '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">' +
                '<path d="M4 5h12M8 5V3.5A1.5 1.5 0 0 1 9.5 2h1A1.5 1.5 0 0 1 12 3.5V5M5.5 5l.6 11a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4l.6-11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />' +
              '</svg>' +
            '</button>' +
          '</div>' +
          buildVariantHtml(item.variant) +
          '<div class="cart-item__bottom">' +
            '<div>' +
              '<span class="cart-item__price">' + formatMoney(lineTotal) + '</span>' +
              '<span class="cart-item__price-each">(' + formatMoney(item.price) + ' each)</span>' +
            '</div>' +
            '<div class="cart-qty" role="group" aria-label="Quantity for ' + safeName + '">' +
              '<button type="button" class="cart-qty__btn" data-qty-decrease="' + escapeHtml(item.lineId) + '" aria-label="Decrease quantity">' + '\u2212' + '</button>' +
              '<span class="cart-qty__value" data-qty-value="' + escapeHtml(item.lineId) + '">' + item.quantity + '</span>' +
              '<button type="button" class="cart-qty__btn" data-qty-increase="' + escapeHtml(item.lineId) + '" aria-label="Increase quantity">+</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCart() {
    var itemsEl = document.getElementById("cartItems");
    var summaryEl = document.getElementById("cartSummary");
    var emptyEl = document.getElementById("cartEmpty");
    if (!itemsEl || !summaryEl || !emptyEl) return;

    var items = hasCartStore() ? window.RabboraCart.getAll() : [];

    if (items.length === 0) {
      itemsEl.hidden = true;
      itemsEl.innerHTML = "";
      summaryEl.hidden = true;
      emptyEl.hidden = false;
      announce("Your cart is empty.");
      return;
    }

    itemsEl.hidden = false;
    emptyEl.hidden = true;
    summaryEl.hidden = false;

    itemsEl.innerHTML = items.map(buildItemHtml).join("");

    var subtotal = hasCartStore() ? window.RabboraCart.subtotal() : 0;
    var delivery = calculateDelivery(items);
    var total = subtotal + delivery;

    var subtotalEl = document.getElementById("cartSubtotalValue");
    var deliveryEl = document.getElementById("cartDeliveryValue");
    var totalEl = document.getElementById("cartTotalValue");
    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? "Free (Mainland UK)" : formatMoney(delivery);
    if (totalEl) totalEl.textContent = formatMoney(total);

    var totalQty = hasCartStore() ? window.RabboraCart.count() : 0;
    announce(
      totalQty + " item" + (totalQty === 1 ? "" : "s") + " in your cart, subtotal " + formatMoney(subtotal) + "."
    );
  }

  function removeLine(lineId, cardEl) {
    if (!hasCartStore()) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finish() {
      window.RabboraCart.remove(lineId);
      // renderCart() runs automatically via the cart:change listener
      // below, so the list/summary/empty-state always stays correct
      // even if this removal happened from another tab.
    }

    if (!cardEl || reduceMotion) {
      finish();
      return;
    }

    cardEl.classList.add("is-removing");
    var settled = false;
    var settle = function () {
      if (settled) return;
      settled = true;
      finish();
    };
    cardEl.addEventListener("transitionend", settle, { once: true });
    window.setTimeout(settle, REMOVE_ANIMATION_MS + 150);
  }

  function initItemInteractions() {
    var itemsEl = document.getElementById("cartItems");
    if (!itemsEl) return;

    itemsEl.addEventListener("click", function (event) {
      var decreaseBtn = event.target.closest("[data-qty-decrease]");
      var increaseBtn = event.target.closest("[data-qty-increase]");
      var removeBtn = event.target.closest("[data-remove-id]");

      if (decreaseBtn || increaseBtn) {
        if (!hasCartStore()) return;
        var lineId = decreaseBtn ? decreaseBtn.getAttribute("data-qty-decrease") : increaseBtn.getAttribute("data-qty-increase");
        var current = window.RabboraCart.getAll().find(function (item) {
          return item.lineId === lineId;
        });
        if (!current) return;

        var nextQty = current.quantity + (increaseBtn ? 1 : -1);
        // A decrease that would take quantity to 0 removes the line
        // entirely — updateQuantity() already does this safely, never
        // allowing a zero or negative quantity to be stored.
        window.RabboraCart.updateQuantity(lineId, nextQty);
        return;
      }

      if (removeBtn) {
        event.preventDefault();
        var card = removeBtn.closest(".cart-item");
        removeLine(removeBtn.getAttribute("data-remove-id"), card);
      }
    });
  }

  function initCheckout() {
    var checkoutBtn = document.getElementById("cartCheckoutBtn");
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", function () {
      if (!hasCartStore() || window.RabboraCart.getAll().length === 0) return;
      // No checkout page/backend exists yet — do not fake an order or
      // claim payment success. This is ready to navigate to a real
      // checkout flow once one exists.
      window.location.href = "checkout.html";
    });
  }

  /**
   * ===========================================================
   * AMBIENT BACKGROUND — 'Luxury Silk / Flowing Fabric + Aurora
   * Light', identical visual family and mechanism to the Login/
   * Register/Forgot Password pages, fully isolated with
   * cart-scoped selectors.
   * ===========================================================
   */

  function initCartParticles() {
    var particlesContainer = document.getElementById("cartParticles");
    if (!particlesContainer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var particleCount = 13;
    var positions = [
      { top: "6%", left: "10%" },
      { top: "14%", left: "92%" },
      { top: "24%", left: "4%" },
      { top: "34%", left: "96%" },
      { top: "46%", left: "6%" },
      { top: "58%", left: "94%" },
      { top: "68%", left: "8%" },
      { top: "78%", left: "90%" },
      { top: "88%", left: "18%" },
      { top: "92%", left: "62%" },
      { top: "4%", left: "48%" },
      { top: "96%", left: "40%" },
      { top: "50%", left: "95%" }
    ];

    var fragment = document.createDocumentFragment();
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "cart-particle";
      var pos = positions[p % positions.length];
      particle.style.top = pos.top;
      particle.style.left = pos.left;
      particle.style.setProperty("--particle-size", (3 + (p % 3)) + "px");
      particle.style.setProperty("--particle-duration", (10 + p * 0.77) + "s");
      particle.style.setProperty("--particle-delay", (p * -1.6) + "s");
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
  }

  function initCartParallax() {
    var backLayer = document.getElementById("cartParallaxBack");
    var midLayer = document.getElementById("cartParallaxMid");
    var frontLayer = document.getElementById("cartParallaxFront");
    if (!backLayer && !midLayer && !frontLayer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var isDesktopPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktopPointer) return;

    var LAYERS = [
      { el: backLayer, maxPx: 5 },
      { el: midLayer, maxPx: 9 },
      { el: frontLayer, maxPx: 14 }
    ].filter(function (layer) {
      return !!layer.el;
    });

    var ticking = false;
    var latestEvent = null;

    function applyParallax() {
      ticking = false;
      if (!latestEvent) return;
      var xRatio = (latestEvent.clientX / window.innerWidth) - 0.5;
      var yRatio = (latestEvent.clientY / window.innerHeight) - 0.5;
      LAYERS.forEach(function (layer) {
        var offsetX = xRatio * -2 * layer.maxPx;
        var offsetY = yRatio * -2 * layer.maxPx;
        layer.el.style.transform = "translate3d(" + offsetX.toFixed(1) + "px, " + offsetY.toFixed(1) + "px, 0)";
      });
    }

    window.addEventListener("mousemove", function (event) {
      latestEvent = event;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyParallax);
      }
    });

    window.addEventListener("mouseleave", function () {
      latestEvent = null;
      LAYERS.forEach(function (layer) {
        layer.el.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  function initCartBackground() {
    initCartParticles();
    initCartParallax();
  }

  function initCartPage() {
    if (!hasCartStore()) {
      console.error(
        "[Rabbora Cart] window.RabboraCart is not available on this page. " +
        "The cart cannot be displayed. Check that cart-data.js is loaded before cart.js."
      );
    }

    initCartBackground();
    renderCart();
    initItemInteractions();
    initCheckout();

    if (hasCartStore()) {
      window.addEventListener(window.RabboraCart.EVENT_NAME, renderCart);
    }

    // Defense in depth: if localStorage changes in another tab/window,
    // re-render directly rather than relying solely on the custom
    // event above.
    window.addEventListener("storage", function (event) {
      if (hasCartStore() && event.key === window.RabboraCart.STORAGE_KEY) {
        renderCart();
      }
    });

    // Guard against a stale render if this page is restored from
    // bfcache — DOMContentLoaded does not fire again in that case.
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) renderCart();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartPage);
  } else {
    initCartPage();
  }
})();