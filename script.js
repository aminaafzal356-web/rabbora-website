/* =========================================================
   RABBORA LIVING — HOME PAGE SCRIPT
   Vanilla JavaScript only. No frameworks, no dependencies.
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     DEMO PRODUCT DATA
     ---------------------------------------------------------
     Placeholder products for layout/design purposes only.
     Replace this object with real catalogue data from a
     backend/database before launch. Structure kept simple
     and flat so a future fetch() call can populate it.
     ========================================================= */
  var PRODUCTS = {
    popular: [
      {
        id: "demo-p1",
        slug: "ottoman-bed",
        name: "2026 Empire Bed Frame with Optional Ottoman Storage",
        image: "images/img-18.jfif",
        alt: "Demo product: Harrow ottoman bed frame in sage fabric",
        rating: 5,
        reviewCount: 128,
        price: 290.00,
        previousPrice: 421.00,
        monthlyPrice: 25,
        badge: "Best Seller"
      },
      {
        id: "demo-p2",
        slug: "2026 Manhattan Bed Frame with Lines ®",
        name: "2026 Manhattan Bed Frame with Lines ®",
        image: "images/img-20.jfif",
        alt: "Demo product: Kensworth drawer bed in ivory boucle",
        rating: 5,
        reviewCount: 94,
        price: 249.00,
        previousPrice: 429.00,
        monthlyPrice: 21,
        badge: null
      },
      {
        id: "demo-p3",
        slug: "2026 Orlando Bed frame (Optional Ottoman Storage)",
        name: "2026 Orlando Bed frame (Optional Ottoman Storage)",
        image: "images/img-4.jfif",
        alt: "Demo product: Aldermoor high headboard bed in forest velvet",
        rating: 5,
        reviewCount: 201,
        price: 729,
        previousPrice: 899,
        monthlyPrice: 30,
        badge: "New"
      },
      {
        id: "demo-p4",
        slug: "wren-tv-bed",
        name: "Wren TV Bed Frame",
        image: "images/img-29.jfif",
        alt: "Demo product: Wren TV bed frame with lift mechanism",
        rating: 4,
        reviewCount: 67,
        price: 1399.00,
        previousPrice: 999.00,
        monthlyPrice: 84,
        badge: null
      }
    ],
    bestSellers: [
      {
        id: "demo-b1",
        slug: "The 2026 Art Deco Bed Style",
        name: "The 2026 Art Deco Bed Style",
        image: "images/img-1.jfif",
        alt: "Demo product: Art Deco Bed Style",
        rating: 5,
        reviewCount: 156,
        price: 253.00,
        previousPrice: 430.00,
        monthlyPrice: 21,
        badge: "Best Seller"
      },
      {
        id: "demo-b2",
        slug: "2026 Kendal Butterfly Wingback Bed",
        name: "2026 Kendal Butterfly Wingback Bed",
        image: "images/img-31.png",
        alt: "Demo product:  Kendal Butterfly Wingback Bed",
        rating: 5,
        reviewCount: 88,
        price: 299.00,
        previousPrice: 444.00,
        monthlyPrice: 25,
        badge: null
      },
      {
        id: "demo-b3",
        slug: " Frame with Optional Ottoman Storage",
        name: "2026 Empire Bed Frame with Optional Ottoman Storage",
        image: "images/img-8.jfif",
        alt: "Demo product: Brindley solid base ottoman bed",
        rating: 5,
        reviewCount: 172,
        price: 290.00,
        previousPrice: 420.00,
        monthlyPrice: 26,
        badge: null
      },
      {
        id: "demo-b4",
        slug: " Bed frame (Optional Ottoman Storage)",
        name: "2026 Orlando Bed frame (Optional Ottoman Storage)",
        image: "images/img-3.jfif",
        alt: "Demo product: 2026 Orlando Bed frame (Optional Ottoman Storage)",
        rating: 5,
        reviewCount: 307.59,
        price: 329,
        previousPrice: 421.00,
        monthlyPrice: 26,
        badge: "New"
      }
    ]
  };

  /* =========================================================
     STATE (in-memory only — replace with real persistence
     / backend calls when connecting a database)
     ========================================================= */
  var state = {
    wishlist: new Set(),
    cartCount: 0
  };

  /* =========================================================
     UTILITIES
     ========================================================= */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function buildStars(rating) {
    var full = "\u2605".repeat(rating);
    var empty = "\u2606".repeat(5 - rating);
    return full + empty;
  }

  /* =========================================================
     PRODUCT CARD RENDERING
     ========================================================= */
  function createProductCard(product) {
    var card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;

    var badgeHtml = product.badge
      ? '<span class="product-card__badge">' + product.badge + "</span>"
      : "";

    var prevPriceHtml = product.previousPrice
      ? '<span class="product-card__price-prev">\u00A3' + product.previousPrice + "</span>"
      : "";

    var monthlyHtml = product.monthlyPrice
      ? '<p class="product-card__monthly">or from \u00A3' + product.monthlyPrice + "/mo</p>"
      : "";

    card.innerHTML =
      '<div class="product-card__image-wrap">' +
        '<a class="product-card__image-link" href="product.html?slug=' + product.slug + '">' +
          '<img src="' + product.image + '" alt="' + product.alt + '" loading="lazy" width="900" height="900" />' +
        "</a>" +
        badgeHtml +
        '<button type="button" class="product-card__wishlist" aria-label="Add to wishlist" aria-pressed="false">' +
          '<svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">' +
            '<path d="M10 17s-6.5-3.9-8.2-8.1C.6 6 2 3 5.1 3c1.9 0 3.4 1.1 4.9 3 1.5-1.9 3-3 4.9-3 3.1 0 4.5 3 3.3 5.9C16.5 13.1 10 17 10 17z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />' +
          "</svg>" +
        "</button>" +
      "</div>" +
      '<div class="product-card__body">' +
        '<a href="product.html?slug=' + product.slug + '" class="product-card__name">' + product.name + "</a>" +
        '<div class="product-card__rating">' +
          '<span class="product-card__stars" aria-hidden="true">' + buildStars(product.rating) + "</span>" +
          '<span class="product-card__review-count">(' + product.reviewCount + ")</span>" +
        "</div>" +
        '<div class="product-card__price-row">' +
          '<span class="product-card__price">\u00A3' + product.price + "</span>" +
          prevPriceHtml +
        "</div>" +
        monthlyHtml +
        '<span class="product-card__demo-tag">Demo product</span>' +
      "</div>";

    return card;
  }

  function renderProductGrid(gridId, products) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var fragment = document.createDocumentFragment();
    products.forEach(function (product) {
      fragment.appendChild(createProductCard(product));
    });
    grid.appendChild(fragment);
  }

  function initProductGrids() {
    renderProductGrid("popularProductsGrid", PRODUCTS.popular);
    renderProductGrid("bestSellerProductsGrid", PRODUCTS.bestSellers);
  }

  /* =========================================================
     WISHLIST (product cards + header icon)
     ---------------------------------------------------------
     Delegated click handler covers cards rendered dynamically.
     ========================================================= */
  function updateWishlistCount() {
    var countEl = document.getElementById("wishlistCount");
    if (countEl) countEl.textContent = String(state.wishlist.size);

    var headerBtn = document.getElementById("wishlistBtn");
    if (headerBtn) {
      headerBtn.setAttribute("aria-label", "Wishlist, " + state.wishlist.size + " items");
    }
  }

  function initWishlist() {
    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".product-card__wishlist");
      if (!btn) return;

      var card = btn.closest(".product-card");
      var productId = card ? card.dataset.productId : null;
      var isPressed = btn.getAttribute("aria-pressed") === "true";

      btn.setAttribute("aria-pressed", String(!isPressed));
      btn.setAttribute("aria-label", isPressed ? "Add to wishlist" : "Remove from wishlist");

      if (productId) {
        if (isPressed) {
          state.wishlist.delete(productId);
        } else {
          state.wishlist.add(productId);
        }
      }

      updateWishlistCount();
    });

    var headerWishlistBtn = document.getElementById("wishlistBtn");
    if (headerWishlistBtn) {
      headerWishlistBtn.addEventListener("click", function () {
        // Placeholder: future behaviour could open a wishlist drawer/page.
        window.location.href = "wishlist.html";
      });
    }
  }

  /* =========================================================
     CART COUNTER (placeholder — increments only, no real
     cart logic until a backend/database is connected)
     ========================================================= */
  function initCart() {
    var cartBtn = document.getElementById("cartBtn");
    var cartCountEl = document.getElementById("cartCount");
    if (!cartBtn || !cartCountEl) return;

    cartBtn.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

  /* =========================================================
     DESKTOP "BED FRAMES" DROPDOWN
     ---------------------------------------------------------
     Hover (with a short close delay) + click + keyboard support.
     ========================================================= */
  function initDesktopDropdown() {
    var toggle = document.getElementById("bedFramesToggle");
    var dropdownWrap = toggle ? toggle.closest(".has-dropdown") : null;
    if (!toggle || !dropdownWrap) return;

    var closeTimer = null;

    function openDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      dropdownWrap.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeDropdownNow() {
      dropdownWrap.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function closeDropdownSoon() {
      closeTimer = setTimeout(closeDropdownNow, 150);
    }

    dropdownWrap.addEventListener("mouseenter", openDropdown);
    dropdownWrap.addEventListener("mouseleave", closeDropdownSoon);

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      var isOpen = dropdownWrap.classList.contains("is-open");
      if (isOpen) {
        closeDropdownNow();
      } else {
        openDropdown();
      }
    });

    toggle.addEventListener("focus", openDropdown);

    dropdownWrap.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDropdownNow();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!dropdownWrap.contains(event.target)) {
        closeDropdownNow();
      }
    });
  }

  /* =========================================================
     MOBILE NAVIGATION DRAWER
     ========================================================= */
  function initMobileNav() {
    var hamburgerBtn = document.getElementById("hamburgerBtn");
    var closeBtn = document.getElementById("mobileNavClose");
    var overlay = document.getElementById("mobileNavOverlay");
    var drawer = document.getElementById("mobileNav");

    if (!hamburgerBtn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add("is-open");
      overlay.classList.add("is-visible");
      drawer.setAttribute("aria-hidden", "false");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      drawer.setAttribute("aria-hidden", "true");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburgerBtn.addEventListener("click", openDrawer);
    overlay.addEventListener("click", closeDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    // Close drawer automatically if resized up to desktop breakpoint.
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  /* =========================================================
     MOBILE "BED FRAMES" ACCORDION
     ========================================================= */
  function initMobileAccordion() {
    var accordions = qsa(".mobile-accordion");

    accordions.forEach(function (accordion) {
      var toggleBtn = qs(".mobile-accordion__toggle", accordion);
      if (!toggleBtn) return;

      toggleBtn.addEventListener("click", function () {
        var isOpen = accordion.classList.contains("is-open");
        accordion.classList.toggle("is-open", !isOpen);
        toggleBtn.setAttribute("aria-expanded", String(!isOpen));
        toggleBtn.setAttribute("aria-label", (!isOpen ? "Collapse" : "Expand") + " Bed Frames");
      });
    });
  }

  /* =========================================================
     NEWSLETTER FORM — client-side validation only.
     ---------------------------------------------------------
     Structured so a real fetch() POST to a backend endpoint
     can be dropped in where indicated.
     ========================================================= */
  function initNewsletterForm() {
    var form = document.getElementById("newsletterForm");
    var messageEl = document.getElementById("newsletterMessage");
    if (!form || !messageEl) return;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var emailInput = document.getElementById("newsletter-email");
      var email = emailInput ? emailInput.value.trim() : "";

      messageEl.classList.remove("is-error", "is-success");

      if (!emailPattern.test(email)) {
        messageEl.textContent = "Please enter a valid email address.";
        messageEl.classList.add("is-error");
        if (emailInput) emailInput.setAttribute("aria-invalid", "true");
        return;
      }

      if (emailInput) emailInput.removeAttribute("aria-invalid");

      // Placeholder submission handler.
      // Replace with a real API call once the newsletter backend
      // is connected, e.g.:
      //   fetch("/api/newsletter", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email: email })
      //   });

      messageEl.textContent = "Thanks \u2014 you're on the list.";
      messageEl.classList.add("is-success");
      form.reset();
    });
  }

  /* =========================================================
     HERO VIDEO — respect prefers-reduced-motion
     ---------------------------------------------------------
     CSS already swaps the video for a static poster image when
     reduced motion is preferred; this pauses playback too so no
     bandwidth is wasted decoding a video the person can't see.
     ========================================================= */
  function initHeroVideo() {
    var video = document.querySelector(".hero__video");
    if (!video) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncPlayback() {
      if (reduceMotion.matches) {
        video.pause();
      } else {
        // Autoplay can be blocked in rare cases; fail silently since the
        // poster attribute already provides a sensible static fallback.
        video.play().catch(function () {});
      }
    }

    syncPlayback();

    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", syncPlayback);
    }
  }

  /* =========================================================
     SEARCH INDEX
     ---------------------------------------------------------
     Combines the demo product data above into one flat list for
     the header search, plus a couple of extra demo entries so
     category terms like "mattress" and "sofa" return a result
     even though those product grids aren't built on this page
     yet. Replace this whole index with a real catalogue lookup
     (e.g. an API call) once a backend is connected — none of
     this affects the Popular Products / Best Sellers sections.
     ========================================================= */
  var SEARCH_EXTRA_DEMO_PRODUCTS = [
    {
      id: "demo-s1",
      slug: "ashcombe-pocket-spring-mattress",
      name: "Ashcombe Pocket Spring Mattress",
      image: "images/products/demo-product-9.jpg",
      alt: "Demo product: Ashcombe pocket spring mattress",
      price: 399,
      previousPrice: null,
      monthlyPrice: 17,
      badge: null
    },
    {
      id: "demo-s2",
      slug: "hadley-three-seat-sofa",
      name: "Hadley Three-Seat Sofa",
      image: "images/products/demo-product-10.jpg",
      alt: "Demo product: Hadley three-seat sofa in sage fabric",
      price: 1099,
      previousPrice: 1299,
      monthlyPrice: 46,
      badge: "New"
    }
  ];

  function buildSearchIndex() {
    return [].concat(PRODUCTS.popular, PRODUCTS.bestSellers, SEARCH_EXTRA_DEMO_PRODUCTS);
  }

  var SEARCH_INDEX = buildSearchIndex();
  var SEARCH_RESULTS_LIMIT = 6;

  function formatPrice(value) {
    return "\u00A3" + value;
  }

  function searchProducts(query) {
    var normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SEARCH_INDEX.filter(function (product) {
      return product.name.toLowerCase().indexOf(normalized) !== -1;
    }).slice(0, SEARCH_RESULTS_LIMIT);
  }

  function createSuggestionItem(product) {
    var item = document.createElement("a");
    item.className = "search-suggestion";
    item.href = "product.html?slug=" + product.slug;
    item.setAttribute("role", "option");
    item.innerHTML =
      '<span class="search-suggestion__image">' +
        '<img src="' + product.image + '" alt="" loading="lazy" width="48" height="48" />' +
      "</span>" +
      '<span class="search-suggestion__body">' +
        '<span class="search-suggestion__name">' + product.name + "</span>" +
        '<span class="search-suggestion__price">' + formatPrice(product.price) + "</span>" +
      "</span>";
    return item;
  }

  function initHeaderSearch() {
    var form = document.getElementById("searchForm");
    var input = document.getElementById("search-input");
    var suggestionsPanel = document.getElementById("searchSuggestions");
    var mobileToggle = document.getElementById("mobileSearchToggle");

    if (!form || !input || !suggestionsPanel) return;

    function openSuggestions() {
      suggestionsPanel.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function closeSuggestions() {
      suggestionsPanel.hidden = true;
      input.setAttribute("aria-expanded", "false");
    }

    function renderResults(query) {
      var results = searchProducts(query);
      suggestionsPanel.innerHTML = "";

      if (!query.trim()) {
        closeSuggestions();
        return;
      }

      if (results.length === 0) {
        var empty = document.createElement("p");
        empty.className = "search-suggestions__empty";
        empty.textContent = "No products found for \u201c" + query.trim() + "\u201d.";
        suggestionsPanel.appendChild(empty);
        openSuggestions();
        return;
      }

      var fragment = document.createDocumentFragment();
      results.forEach(function (product) {
        fragment.appendChild(createSuggestionItem(product));
      });
      suggestionsPanel.appendChild(fragment);

      var viewAll = document.createElement("button");
      viewAll.type = "submit";
      viewAll.className = "search-suggestions__viewall";
      viewAll.textContent = "View all results for \u201c" + query.trim() + "\u201d";
      suggestionsPanel.appendChild(viewAll);

      openSuggestions();
    }

    input.addEventListener("input", function () {
      renderResults(input.value);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim()) renderResults(input.value);
    });

    // Enter key (and the search icon button, which is type="submit")
    // both land here — re-run the search rather than reloading the page.
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      renderResults(input.value);
    });

    document.addEventListener("click", function (event) {
      if (!form.contains(event.target)) {
        closeSuggestions();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeSuggestions();
      }
    });

    // Mobile search toggle: repositions the same search form into a
    // full-width overlay panel beneath the header (see CSS), rather
    // than duplicating the search markup for small screens.
    if (mobileToggle) {
      mobileToggle.addEventListener("click", function () {
        var isActive = form.classList.contains("is-mobile-active");
        form.classList.toggle("is-mobile-active", !isActive);
        mobileToggle.setAttribute("aria-expanded", String(!isActive));
        if (!isActive) {
          input.focus();
        } else {
          closeSuggestions();
        }
      });
    }
  }

  /* =========================================================
     MISC: footer year
     ========================================================= */
  function initFooterYear() {
    var yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    initProductGrids();
    initWishlist();
    initCart();
    initDesktopDropdown();
    initHeaderSearch();
    initMobileNav();
    initMobileAccordion();
    initNewsletterForm();
    initHeroVideo();
    initFooterYear();
    updateWishlistCount();
  });
})();