(function () {
  "use strict";

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

  /**
   * ===========================================================
   * FUTURE BACKEND INTEGRATION POINT — delivery
   * ===========================================================
   * Same placeholder rule as cart.js, kept identical so the
   * delivery figure shown here always matches Cart. Replace with
   * a real delivery/shipping API call once one exists.
   */
  function calculateDelivery(items) {
    if (!items || items.length === 0) return 0;
    return 0;
  }

  function buildVariantText(variant) {
    if (!variant) return "";
    var labels = { size: "Size", colour: "Colour", color: "Colour", fabric: "Fabric", diamantes: "Diamantes", buttons: "Buttons" };
    var parts = [];
    Object.keys(variant).forEach(function (key) {
      var value = variant[key];
      if (value === null || value === undefined || value === "") return;
      var label = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
      parts.push(label + ": " + value);
    });
    return parts.join(" \u00b7 ");
  }

  function buildSummaryItemHtml(item) {
    var safeUrl = escapeHtml(item.url || "index.html");
    var safeName = escapeHtml(item.name);
    var safeImage = escapeHtml(item.image || "");
    var safeAlt = escapeHtml(item.alt || item.name || "");
    var lineTotal = item.price * item.quantity;
    var variantText = buildVariantText(item.variant);

    return (
      '<div class="checkout-summary-item">' +
        '<a class="checkout-summary-item__image-link" href="' + safeUrl + '" aria-label="View ' + safeName + '">' +
          (safeImage
            ? '<img src="' + safeImage + '" alt="' + safeAlt + '" loading="lazy" width="120" height="120" onerror="this.src=&#39;images/img-2.png&#39;;" />'
            : '<img src="images/img-2.png" alt="' + safeAlt + '" loading="lazy" width="120" height="120" />') +
        '</a>' +
        '<div class="checkout-summary-item__body">' +
          '<a href="' + safeUrl + '" class="checkout-summary-item__name">' + safeName + '</a>' +
          (variantText ? '<p class="checkout-summary-item__variant">' + escapeHtml(variantText) + '</p>' : '') +
          '<p class="checkout-summary-item__qty">Qty: ' + item.quantity + '</p>' +
        '</div>' +
        '<span class="checkout-summary-item__price">' + formatMoney(lineTotal) + '</span>' +
      '</div>'
    );
  }

  function renderOrderSummary() {
    var emptyEl = document.getElementById("checkoutEmpty");
    var layoutEl = document.getElementById("checkoutLayout");
    var itemsEl = document.getElementById("checkoutSummaryItems");
    if (!emptyEl || !layoutEl || !itemsEl) return;

    var items = hasCartStore() ? window.RabboraCart.getAll() : [];

    if (items.length === 0) {
      emptyEl.hidden = false;
      layoutEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    layoutEl.hidden = false;

    itemsEl.innerHTML = items.map(buildSummaryItemHtml).join("");

    var subtotal = hasCartStore() ? window.RabboraCart.subtotal() : 0;
    var delivery = calculateDelivery(items);
    var total = subtotal + delivery;

    var subtotalEl = document.getElementById("checkoutSubtotalValue");
    var deliveryEl = document.getElementById("checkoutDeliveryValue");
    var totalEl = document.getElementById("checkoutTotalValue");
    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? "Free" : formatMoney(delivery);
    if (totalEl) totalEl.textContent = formatMoney(total);
  }

  /* =========================================================
     FORM VALIDATION
     Same pattern as contact.js's initContactForm — per-field
     validate-on-blur, re-validate-on-input once touched, focus
     the first invalid field on submit attempt.
     ========================================================= */
  function initCheckoutForm() {
    var form = document.getElementById("checkoutForm");
    var messageEl = document.getElementById("checkoutFormMessage");
    if (!form || !messageEl) return;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Reasonable UK phone check: allows +44/0 prefixes, spaces, and 9-11 digits.
    var phonePattern = /^(\+44\s?|0)(\d[\d\s]{8,12})$/;
    // Reasonable UK postcode check (does not exhaustively validate every real postcode).
    var postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

    var fields = {
      firstName: { input: document.getElementById("co-first-name"), error: document.getElementById("co-first-name-error") },
      lastName: { input: document.getElementById("co-last-name"), error: document.getElementById("co-last-name-error") },
      email: { input: document.getElementById("co-email"), error: document.getElementById("co-email-error") },
      phone: { input: document.getElementById("co-phone"), error: document.getElementById("co-phone-error") },
      address1: { input: document.getElementById("co-address1"), error: document.getElementById("co-address1-error") },
      city: { input: document.getElementById("co-city"), error: document.getElementById("co-city-error") },
      postcode: { input: document.getElementById("co-postcode"), error: document.getElementById("co-postcode-error") },
      country: { input: document.getElementById("co-country"), error: document.getElementById("co-country-error") }
    };

    function validateField(key) {
      var f = fields[key];
      if (!f || !f.input) return true;
      var value = f.input.value.trim();
      var valid = value !== "";
      var message = "This field is required.";

      if (valid && key === "email") {
        valid = emailPattern.test(value);
        message = "Please enter a valid email address.";
      }
      if (valid && key === "phone") {
        valid = phonePattern.test(value);
        message = "Please enter a valid UK phone number.";
      }
      if (valid && key === "postcode") {
        valid = postcodePattern.test(value);
        message = "Please enter a valid UK postcode.";
      }

      f.input.setAttribute("aria-invalid", valid ? "false" : "true");
      if (f.error) f.error.textContent = valid ? "" : message;
      return valid;
    }

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      if (!f.input) return;
      f.input.addEventListener("blur", function () { validateField(key); });
      f.input.addEventListener("input", function () {
        if (f.input.getAttribute("aria-invalid") === "true") validateField(key);
      });
      f.input.addEventListener("change", function () {
        if (f.input.getAttribute("aria-invalid") === "true") validateField(key);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      messageEl.hidden = true;
      messageEl.classList.remove("is-error", "is-dev");

      if (!hasCartStore() || window.RabboraCart.getAll().length === 0) {
        messageEl.hidden = false;
        messageEl.classList.add("is-error");
        messageEl.textContent = "Your cart is empty.";
        return;
      }

      var allValid = true;
      var firstInvalidInput = null;
      Object.keys(fields).forEach(function (key) {
        var ok = validateField(key);
        if (!ok && !firstInvalidInput && fields[key].input) {
          firstInvalidInput = fields[key].input;
        }
        allValid = allValid && ok;
      });

      if (!allValid) {
        messageEl.hidden = false;
        messageEl.classList.add("is-error");
        messageEl.textContent = "Please fix the highlighted fields above.";
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      /**
       * ===========================================================
       * FUTURE BACKEND INTEGRATION POINT — order submission
       * ===========================================================
       * No backend/payment provider exists yet. Once one does,
       * this handler should collect the data below and POST it to
       * the real order endpoint, e.g.:
       *
       *   var orderPayload = {
       *     customer: { firstName, lastName, email, phone },
       *     address: { address1, address2, city, county, postcode, country },
       *     items: window.RabboraCart.getAll(),
       *     subtotal: window.RabboraCart.subtotal(),
       *     delivery: calculateDelivery(window.RabboraCart.getAll())
       *   };
       *   fetch("/api/orders", { method: "POST", body: JSON.stringify(orderPayload) })
       *     .then(...)  // handle Stripe/payment confirmation, then clear cart
       *
       * The frontend total above is for display only — the backend
       * must always recalculate and verify the total before taking
       * payment. Do not treat it as trusted.
       *
       * For now, simply show a clear development-state message and
       * do NOT claim the order was placed or payment succeeded.
       */
      messageEl.hidden = false;
      messageEl.classList.add("is-dev");
      messageEl.textContent = "Checkout is not yet connected to payment processing. Your order has not been placed.";
    });
  }

  /* =========================================================
     AMBIENT BACKGROUND — identical mechanism to cart.js's aurora/
     silk/particle system, isolated with checkout-scoped selectors.
     ========================================================= */
  function initCheckoutParticles() {
    var particlesContainer = document.getElementById("checkoutParticles");
    if (!particlesContainer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var particleCount = 10;
    var positions = [
      { top: "8%", left: "12%" }, { top: "18%", left: "90%" }, { top: "30%", left: "6%" },
      { top: "42%", left: "94%" }, { top: "54%", left: "8%" }, { top: "66%", left: "92%" },
      { top: "78%", left: "16%" }, { top: "88%", left: "60%" }, { top: "6%", left: "50%" },
      { top: "94%", left: "40%" }
    ];

    var fragment = document.createDocumentFragment();
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "checkout-particle";
      var pos = positions[p % positions.length];
      particle.style.top = pos.top;
      particle.style.left = pos.left;
      particle.style.setProperty("--particle-size", (3 + (p % 3)) + "px");
      particle.style.setProperty("--particle-duration", (11 + p * 0.8) + "s");
      particle.style.setProperty("--particle-delay", (p * -1.5) + "s");
      fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
  }

  function initCheckoutParallax() {
    var backLayer = document.getElementById("checkoutParallaxBack");
    var midLayer = document.getElementById("checkoutParallaxMid");
    if (!backLayer && !midLayer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var isDesktopPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktopPointer) return;

    var LAYERS = [
      { el: backLayer, maxPx: 4 },
      { el: midLayer, maxPx: 7 }
    ].filter(function (layer) { return !!layer.el; });

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
      LAYERS.forEach(function (layer) { layer.el.style.transform = "translate3d(0, 0, 0)"; });
    });
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll(".checkout-reveal");
    if (targets.length === 0) return;

    targets.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay + "s");
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  function initCheckoutPage() {
    if (!hasCartStore()) {
      console.error(
        "[Rabbora Cart] window.RabboraCart is not available on this page. " +
        "Checkout cannot load cart contents. Check that cart-data.js is loaded before checkout.js."
      );
    }

    initCheckoutParticles();
    initCheckoutParallax();
    renderOrderSummary();
    initCheckoutForm();
    initScrollReveal();

    if (hasCartStore()) {
      window.addEventListener(window.RabboraCart.EVENT_NAME, renderOrderSummary);
    }

    window.addEventListener("storage", function (event) {
      if (hasCartStore() && event.key === window.RabboraCart.STORAGE_KEY) {
        renderOrderSummary();
      }
    });

    window.addEventListener("pageshow", function (event) {
      if (event.persisted) renderOrderSummary();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCheckoutPage);
  } else {
    initCheckoutPage();
  }
})();