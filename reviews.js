(function () {
  "use strict";

  var state = {
    wishlist: new Set(),
    cartCount: 0
  };

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function hasWishlistStore() {
    return !!(window.RabboraWishlist && typeof window.RabboraWishlist.toggle === "function");
  }

  function updateWishlistCount() {
    var countEl = document.getElementById("wishlistCount");
    var count = hasWishlistStore() ? window.RabboraWishlist.count() : state.wishlist.size;
    if (countEl) countEl.textContent = String(count);

    var headerBtn = document.getElementById("wishlistBtn");
    if (headerBtn) {
      headerBtn.setAttribute("aria-label", "Wishlist, " + count + " items");
    }
  }

  function initWishlist() {
    if (!hasWishlistStore()) {
      console.error(
        "[Rabbora Wishlist] window.RabboraWishlist is not available on this page. " +
        "Wishlist saves will NOT persist (in-memory fallback only) until this is fixed. " +
        "Check that <script src=\"wishlist-data.js\"></script> is present on this page, " +
        "loads before this script, and returns 200 (not 404) — open the Network tab and reload."
      );
    }

    if (hasWishlistStore()) {
      window.RabboraWishlist.syncButtons(document);
    }

    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".product-card__wishlist");
      if (!btn) return;

      var card = btn.closest(".product-card");
      var productId = card ? (card.dataset.productId || card.dataset.slug) : null;
      var isPressed = btn.getAttribute("aria-pressed") === "true";

      if (hasWishlistStore() && productId) {
        var product = window.RabboraWishlist.fromCard(card, productId);
        var result = window.RabboraWishlist.toggle(product);
        btn.setAttribute("aria-pressed", String(result.added));
        btn.setAttribute("aria-label", result.added ? "Remove from wishlist" : "Add to wishlist");
      } else {
        btn.setAttribute("aria-pressed", String(!isPressed));
        btn.setAttribute("aria-label", isPressed ? "Add to wishlist" : "Remove from wishlist");
        if (productId) {
          if (isPressed) {
            state.wishlist.delete(productId);
          } else {
            state.wishlist.add(productId);
          }
        }
      }

      updateWishlistCount();
    });

    var headerWishlistBtn = document.getElementById("wishlistBtn");
    if (headerWishlistBtn) {
      headerWishlistBtn.addEventListener("click", function () {
        window.location.href = "wishlist.html";
      });
    }

    if (hasWishlistStore()) {
      window.addEventListener(window.RabboraWishlist.EVENT_NAME, function () {
        updateWishlistCount();
        window.RabboraWishlist.syncButtons(document);
      });
    }
  }

  function hasCartStore() {
    return !!(window.RabboraCart && typeof window.RabboraCart.count === "function");
  }

  function updateCartCount() {
    var countEl = document.getElementById("cartCount");
    var count = hasCartStore() ? window.RabboraCart.count() : 0;
    if (countEl) countEl.textContent = String(count);

    var headerBtn = document.getElementById("cartBtn");
    if (headerBtn) {
      headerBtn.setAttribute("aria-label", "Shopping cart, " + count + " items");
    }
  }

  function initCart() {
    var cartBtn = document.getElementById("cartBtn");
    var cartCountEl = document.getElementById("cartCount");
    if (!cartBtn || !cartCountEl) return;

    updateCartCount();

    if (hasCartStore()) {
      window.addEventListener(window.RabboraCart.EVENT_NAME, updateCartCount);
    }

    cartBtn.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

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

  function buildSearchIndex() {
    return (typeof GLOBAL_SEARCH_INDEX !== "undefined") ? GLOBAL_SEARCH_INDEX : [];
  }

  var SEARCH_INDEX = buildSearchIndex();

  var SEARCH_RESULTS_LIMIT = 8;

  function formatPrice(value) {
    return "\u00A3" + value;
  }

  function searchProducts(query) {
    var normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SEARCH_INDEX.filter(function (item) {
      var haystack = (item.name + " " + item.category + " " + (item.keywords || "")).toLowerCase();
      return haystack.indexOf(normalized) !== -1;
    }).slice(0, SEARCH_RESULTS_LIMIT);
  }

  function createSuggestionItem(item) {
    var suggestion = document.createElement("a");
    suggestion.className = "search-suggestion";
    suggestion.href = item.url;
    suggestion.setAttribute("role", "option");
    var imageHtml = item.image
      ? '<img src="' + item.image + '" alt="" loading="lazy" width="48" height="48" />'
      : "";
    var priceHtml = (item.price !== null && item.price !== undefined)
      ? '<span class="search-suggestion__price">' + formatPrice(item.price) + "</span>"
      : "";
    suggestion.innerHTML =
      '<span class="search-suggestion__image">' + imageHtml + "</span>" +
      '<span class="search-suggestion__body">' +
        '<span class="search-suggestion__name">' + item.name + "</span>" +
        '<span class="search-suggestion__category">' + item.category + "</span>" +
        priceHtml +
      "</span>";
    return suggestion;
  }

  function initMainNavReveal() {
    var nav = document.querySelector(".main-nav");
    if (!nav) return;

    var TOP_HOTSPOT_PX = 30;
    var desktopQuery = window.matchMedia("(min-width: 1024px)");
    var isNavHidden = false;

    function show() {
      isNavHidden = false;
      nav.classList.remove("is-nav-hidden");
    }

    function hide() {
      if (!desktopQuery.matches) return;
      isNavHidden = true;
      nav.classList.add("is-nav-hidden");
    }

    function handleScroll() {
      if (window.scrollY <= 0) {
        show();
      } else {
        hide();
      }
    }

    document.addEventListener("mousemove", function (event) {
      if (event.clientY <= TOP_HOTSPOT_PX) show();
    });

    window.addEventListener("scroll", handleScroll, { passive: true });

    function handleViewportChange(event) {
      if (!event.matches) show();
    }
    desktopQuery.addEventListener
      ? desktopQuery.addEventListener("change", handleViewportChange)
      : desktopQuery.addListener(handleViewportChange);
  }

  function initSearchCategoryMenu() {
    var toggle = document.getElementById("searchCategoryToggle");
    var list = document.getElementById("searchCategoryList");
    if (!toggle || !list) return;

    if (toggle.dataset.navMenuInitialized === "true") return;
    toggle.dataset.navMenuInitialized = "true";

    function close() {
      list.classList.remove("is-open");
      list.setAttribute("data-state", "closed");
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      list.classList.add("is-open");
      list.setAttribute("data-state", "open");
      toggle.setAttribute("aria-expanded", "true");
    }

    close();

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      if (list.classList.contains("is-open")) { close(); } else { open(); }
    });

    document.addEventListener("click", function (event) {
      if (!list.contains(event.target) && event.target !== toggle) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    window.addEventListener("pageshow", function (event) {
      if (event.persisted) close();
    });
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

  function initFooterYear() {
    var yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initScrollReveal() {
    var targets = qsa(".reveal, .reveal-fade-up, .reveal--image");
    if (targets.length === 0) return;

    targets.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.setProperty("--reveal-delay", delay + "s");
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

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

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  /* =========================================================
     REVIEWS HERO — premium "champagne dust" particle layer.
     Same mechanism as about.js's hero particles: a fixed set of
     small glowing particles generated once on load (randomised
     size/position/speed/opacity, three depth tiers), animated
     purely via CSS keyframes. Only per-frame JS work is a very
     subtle rAF-throttled mouse parallax on the whole layer.
     ========================================================= */
  function initHeroParticles() {
    var layer = document.getElementById("reviewsHeroParticles");
    if (!layer) return;

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isDesktop = window.matchMedia("(min-width: 768px)").matches;
    var count = isDesktop ? 50 : 24;

    var TIERS = [
      { share: 0.5, size: [1.5, 2.5], opacity: [0.18, 0.35], duration: [16, 22], glow: false },
      { share: 0.35, size: [2.5, 3.5], opacity: [0.35, 0.55], duration: [11, 16], glow: false },
      { share: 0.15, size: [3.5, 5], opacity: [0.55, 0.8], duration: [8, 11], glow: true }
    ];

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    var fragment = document.createDocumentFragment();
    var built = 0;

    TIERS.forEach(function (tier) {
      var tierCount = Math.round(count * tier.share);
      for (var i = 0; i < tierCount && built < count; i++, built++) {
        var el = document.createElement("span");
        el.className = "reviews-hero__particle" + (tier.glow ? " reviews-hero__particle--glow" : "");
        el.style.setProperty("--x", rand(0, 100) + "%");
        el.style.setProperty("--size", rand(tier.size[0], tier.size[1]).toFixed(1) + "px");
        el.style.setProperty("--max-opacity", rand(tier.opacity[0], tier.opacity[1]).toFixed(2));
        el.style.setProperty("--dur", rand(tier.duration[0], tier.duration[1]).toFixed(1) + "s");
        el.style.setProperty("--delay", (-rand(0, tier.duration[1])).toFixed(1) + "s");
        el.style.setProperty("--rise", -rand(90, 220).toFixed(0) + "px");
        el.style.setProperty("--sway", (Math.random() < 0.5 ? -1 : 1) * rand(6, 22).toFixed(0) + "px");
        fragment.appendChild(el);
      }
    });

    layer.appendChild(fragment);

    if (prefersReduced || !isDesktop) return;

    var heroSection = document.getElementById("reviewsHero");
    if (!heroSection) return;

    var ticking = false;
    var pendingX = 0;
    var pendingY = 0;

    function apply() {
      layer.style.setProperty("--particle-parallax-x", pendingX.toFixed(1) + "px");
      layer.style.setProperty("--particle-parallax-y", pendingY.toFixed(1) + "px");
      ticking = false;
    }

    heroSection.addEventListener("mousemove", function (event) {
      var rect = heroSection.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var relX = (event.clientX - rect.left) / rect.width - 0.5;
      var relY = (event.clientY - rect.top) / rect.height - 0.5;
      pendingX = relX * 10;
      pendingY = relY * 10;
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    });

    heroSection.addEventListener("mouseleave", function () {
      pendingX = 0;
      pendingY = 0;
      window.requestAnimationFrame(apply);
    });
  }

  /* =========================================================
     REVIEWS DATA
     ---------------------------------------------------------
     FRONTEND DEMO DATA — not real customer submissions. This
     array is shaped to match a future GET /api/reviews response
     so the backend can drop straight in later:

       { id, productId, productName, customerName, rating,
         title, comment, date, verified }

     Replace this array with the API response once the Node.js /
     PostgreSQL backend exists — nothing else in this file should
     need to change.
     ========================================================= */
  var REVIEWS_DATA = [
    { id: 1, productId: "bed-frames", productName: "Bed Frame", customerName: "Demo Customer", rating: 5, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2026-01-15", verified: true },
    { id: 2, productId: "ottoman-beds", productName: "Slatted Ottoman Bed", customerName: "Demo Customer", rating: 4, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2026-01-10", verified: true },
    { id: 3, productId: "mattresses", productName: "Mattress", customerName: "Demo Customer", rating: 5, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2026-01-05", verified: false },
    { id: 4, productId: "sofas", productName: "Sofa", customerName: "Demo Customer", rating: 3, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2025-12-28", verified: true },
    { id: 5, productId: "solid-base-ottomans", productName: "Solid Ottoman Bed", customerName: "Demo Customer", rating: 5, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2025-12-20", verified: true },
    { id: 6, productId: "storage-drawers", productName: "Drawer Bed", customerName: "Demo Customer", rating: 4, title: "Sample review title", comment: "Sample review text — replace with real customer reviews once the backend is connected.", date: "2025-12-14", verified: false }
  ];

  var PRODUCT_LABELS = {
    "bed-frames": "Bed Frames",
    "ottoman-beds": "Slatted Ottoman Storage",
    "solid-base-ottomans": "Solid Ottoman Storage",
    "storage-drawers": "Storage with Drawers",
    "tv-beds": "TV Beds",
    "kids-beds": "Kids\u2019 Beds",
    "high-headboard-beds": "High Headboard Beds",
    "mattresses": "Luxury Mattresses",
    "sofas": "Sofas",
    "blanket-boxes": "Blanket Boxes",
    "rapid-delivery-beds": "Rapid Delivery Beds"
  };

  function starString(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 0; i < 5; i++) out += i < full ? "\u2605" : "\u2606";
    return out;
  }

  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function initReviewsSummary() {
    var avgEl = document.getElementById("reviewsAvgScore");
    var starsEl = document.getElementById("reviewsAvgStars");
    var countEl = document.getElementById("reviewsCountLabel");
    var breakdownEl = document.getElementById("reviewsBreakdown");
    if (!avgEl) return;

    var total = REVIEWS_DATA.length;
    var sum = REVIEWS_DATA.reduce(function (acc, r) { return acc + r.rating; }, 0);
    var avg = total ? sum / total : 0;

    avgEl.textContent = total ? avg.toFixed(1) + " / 5" : "\u2014";
    if (starsEl) starsEl.textContent = starString(avg);
    if (countEl) countEl.textContent = "Based on " + total + " customer review" + (total === 1 ? "" : "s");

    if (breakdownEl) {
      breakdownEl.innerHTML = "";
      for (var star = 5; star >= 1; star--) {
        var countForStar = REVIEWS_DATA.filter(function (r) { return r.rating === star; }).length;
        var pct = total ? Math.round((countForStar / total) * 100) : 0;

        var row = document.createElement("div");
        row.className = "reviews-summary__bar-row";
        row.innerHTML =
          '<span class="reviews-summary__bar-label">' + star + ' \u2605</span>' +
          '<span class="reviews-summary__bar-track"><span class="reviews-summary__bar-fill" style="--bar-pct:' + pct + '%"></span></span>' +
          '<span class="reviews-summary__bar-count">' + countForStar + '</span>';
        breakdownEl.appendChild(row);
      }
    }
  }

  function buildReviewCard(review) {
    var card = document.createElement("article");
    card.className = "review-summary-card reveal";
    card.innerHTML =
      '<div class="review-summary-card__stars" aria-hidden="true">' + starString(review.rating) + '</div>' +
      '<h3 class="review-summary-card__title">' + review.title + '</h3>' +
      '<p class="review-summary-card__comment">' + review.comment + '</p>' +
      '<div class="review-summary-card__meta">' +
        '<span class="review-summary-card__name">' + review.customerName + '</span>' +
        (review.verified ? '<span class="review-summary-card__verified">\u2713 Verified Purchase</span>' : '') +
      '</div>' +
      '<div class="review-summary-card__footer">' +
        '<span class="review-summary-card__product">' + (PRODUCT_LABELS[review.productId] || review.productName) + '</span>' +
        '<span class="review-summary-card__date">' + formatDate(review.date) + '</span>' +
      '</div>';
    return card;
  }

  function initReviewsList() {
    var grid = document.getElementById("reviewsGrid");
    var emptyState = document.getElementById("reviewsEmptyState");
    var starPills = document.querySelectorAll(".reviews-filters__pill");
    var productSelect = document.getElementById("reviewsProductFilter");
    var sortSelect = document.getElementById("reviewsSort");
    if (!grid) return;

    var state = { star: "all", product: "all", sort: "newest" };

    function render() {
      var filtered = REVIEWS_DATA.filter(function (r) {
        if (state.star !== "all" && String(r.rating) !== state.star) return false;
        if (state.product !== "all" && r.productId !== state.product) return false;
        return true;
      });

      filtered.sort(function (a, b) {
        if (state.sort === "highest") return b.rating - a.rating;
        if (state.sort === "lowest") return a.rating - b.rating;
        return new Date(b.date) - new Date(a.date); // newest first
      });

      grid.innerHTML = "";
      if (filtered.length === 0) {
        if (emptyState) emptyState.hidden = false;
        return;
      }
      if (emptyState) emptyState.hidden = true;

      var fragment = document.createDocumentFragment();
      filtered.forEach(function (review, index) {
        var card = buildReviewCard(review);
        card.style.setProperty("--reveal-delay", (Math.min(index, 5) * 0.08).toFixed(2) + "s");
        fragment.appendChild(card);
      });
      grid.appendChild(fragment);

      initScrollReveal();
    }

    starPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        starPills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        state.star = pill.getAttribute("data-star-filter");
        render();
      });
    });

    if (productSelect) {
      productSelect.addEventListener("change", function () {
        state.product = productSelect.value;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        render();
      });
    }

    render();
  }

  function initWriteReviewButton() {
    var btn = document.getElementById("writeReviewBtn");
    if (!btn) return;
    // Placeholder for now — will open a real review submission flow
    // once the backend (POST /api/reviews) exists.
    btn.addEventListener("click", function () {
      window.location.href = "contact.html";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMainNavReveal();
    initMobileNav();
    initWishlist();
    initCart();
    initDesktopDropdown();
    initSearchCategoryMenu();
    initHeaderSearch();
    initMobileAccordion();
    initFooterYear();
    updateWishlistCount();
    initHeroParticles();
    initReviewsSummary();
    initReviewsList();
    initWriteReviewButton();
    initScrollReveal();
  });
})();