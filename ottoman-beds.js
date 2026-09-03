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
    // Loud, one-time diagnostic: if wishlist-data.js didn't load on
    // this page, every wishlist click below silently falls back to an
    // in-memory Set that never survives a refresh or shows up on
    // wishlist.html. Say so clearly in the console right away instead
    // of failing quietly.
    if (!hasWishlistStore()) {
      console.error(
        "[Rabbora Wishlist] window.RabboraWishlist is not available on this page. " +
        "Wishlist saves will NOT persist (in-memory fallback only) until this is fixed. " +
        "Check that <script src=\"wishlist-data.js\"></script> is present on this page, " +
        "loads before this script, and returns 200 (not 404) — open the Network tab and reload."
      );
    }

    // Reflect any previously-saved wishlist state on every one of the
    // 84 product cards already rendered on this page (e.g. after a
    // refresh, or when arriving here from another page).
    if (hasWishlistStore()) {
      window.RabboraWishlist.syncButtons(document);
    }

    document.addEventListener("click", function (event) {
      var btn = event.target.closest(".product-card__wishlist");
      if (!btn) return;

      var card = btn.closest(".product-card");
      var productId = card ? (card.dataset.slug || card.dataset.productId) : null;
      var isPressed = btn.getAttribute("aria-pressed") === "true";

      if (hasWishlistStore() && productId) {
        var product = window.RabboraWishlist.fromCard(card, productId);
        var result = window.RabboraWishlist.toggle(product);
        btn.setAttribute("aria-pressed", String(result.added));
        btn.setAttribute("aria-label", result.added ? "Remove from wishlist" : "Add to wishlist");
      } else {
        // Defensive fallback so the heart still responds even if the
        // shared wishlist store failed to load — state just won't
        // persist in that case. Warn loudly every time this path is
        // actually used, so a save that silently didn't count is
        // visible in the console right when it happens.
        if (!hasWishlistStore()) {
          console.warn(
            "[Rabbora Wishlist] Heart clicked but window.RabboraWishlist is unavailable — " +
            "this save will NOT persist to localStorage or appear on wishlist.html."
          );
        } else if (!productId) {
          console.warn(
            "[Rabbora Wishlist] Heart clicked but no data-product-id or data-slug was found " +
            "on the closest .product-card — this save will NOT persist."
          );
        }
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

    // Keep the header count and every grid heart in sync when the
    // wishlist changes elsewhere — the detail-view heart below,
    // another tab, or wishlist.html removing an item.
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
        // Back at the very top: always visible, and stays visible.
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

    // Guard against this running twice (e.g. if some other script also
    // calls it, or DOMContentLoaded fires more than once) — without this,
    // a second run would bind duplicate click/outside-click listeners,
    // which makes the dropdown open on one click and instantly re-close
    // itself, or need two clicks to respond.
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

    // Force a clean closed state the moment this runs, regardless of
    // whatever class the element already had — covers the browser
    // restoring a page from back/forward cache mid-open, or any other
    // script having touched this element before this one runs.
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

    // Belt-and-suspenders: if the page is restored from bfcache (e.g. via
    // the browser's back button), force it closed again rather than trust
    // whatever state the cached DOM snapshot happened to be in.
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

  function initFooterYear() {
    var yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initScrollReveal() {
    var targets = qsa(".reveal");
    if (targets.length === 0) return;

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

  function bbMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function bbStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  function sfMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function sfStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  function mtMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function mtStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  function initMattressHelp() {
    var cards = qsa(".mt-help-card");
    if (cards.length === 0) return;

    cards.forEach(function (card) {
      var toggle = qs(".mt-help-card__toggle", card);
      if (!toggle) return;

      toggle.addEventListener("click", function () {
        var isOpen = card.classList.contains("is-open");
        card.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  const SLATTED_OTTOMAN_PRODUCTS = [
  {
    "id": 1,
    "slug": "chelsea-slatted-ottoman-bed",
    "name": "Chelsea Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": 749,
    "monthlyPrice": 54,
    "rating": 4,
    "reviewCount": 75,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Silver",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Chelsea Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/chelsea-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/chelsea-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/chelsea-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 2,
    "slug": "hampton-slatted-ottoman-bed",
    "name": "Hampton Slatted Ottoman Bed",
    "price": 399,
    "oldPrice": 479,
    "monthlyPrice": 33,
    "rating": 4,
    "reviewCount": 147,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Brown",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Hampton Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/hampton-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/hampton-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/hampton-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 3,
    "slug": "monaco-ottoman-bed",
    "name": "Monaco Ottoman Bed",
    "price": 579,
    "oldPrice": null,
    "monthlyPrice": 48,
    "rating": 4,
    "reviewCount": 58,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "White",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Monaco Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/monaco-ottoman-bed-main.svg",
      "images/ottoman-beds/monaco-ottoman-bed-angle.svg",
      "images/ottoman-beds/monaco-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 4,
    "slug": "windsor-slatted-ottoman-bed",
    "name": "Windsor Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": 529,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 172,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Silver",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Windsor Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/windsor-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/windsor-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/windsor-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 5,
    "slug": "kensington-slatted-ottoman-bed",
    "name": "Kensington Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 110,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Black",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Kensington Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/kensington-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/kensington-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/kensington-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 6,
    "slug": "mayfair-ottoman-bed",
    "name": "Mayfair Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 89,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Pink",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Mayfair Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/mayfair-ottoman-bed-main.svg",
      "images/ottoman-beds/mayfair-ottoman-bed-angle.svg",
      "images/ottoman-beds/mayfair-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 7,
    "slug": "richmond-slatted-ottoman-bed",
    "name": "Richmond Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": 709,
    "monthlyPrice": 54,
    "rating": 5,
    "reviewCount": 180,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Brown",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Richmond Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/richmond-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/richmond-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/richmond-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 8,
    "slug": "cambridge-slatted-ottoman-bed",
    "name": "Cambridge Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": null,
    "monthlyPrice": 54,
    "rating": 4,
    "reviewCount": 193,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "White",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Cambridge Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/cambridge-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/cambridge-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/cambridge-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 9,
    "slug": "victoria-ottoman-bed",
    "name": "Victoria Ottoman Bed",
    "price": 489,
    "oldPrice": 589,
    "monthlyPrice": 41,
    "rating": 4,
    "reviewCount": 185,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Black",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Victoria Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/victoria-ottoman-bed-main.svg",
      "images/ottoman-beds/victoria-ottoman-bed-angle.svg",
      "images/ottoman-beds/victoria-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 10,
    "slug": "oxford-slatted-ottoman-bed",
    "name": "Oxford Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 85,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Beige",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Oxford Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/oxford-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/oxford-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/oxford-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 11,
    "slug": "chester-slatted-ottoman-bed",
    "name": "Chester Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 46,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Silver",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Chester Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/chester-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/chester-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/chester-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 12,
    "slug": "kingston-ottoman-bed",
    "name": "Kingston Ottoman Bed",
    "price": 549,
    "oldPrice": null,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 153,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Blue",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Kingston Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/kingston-ottoman-bed-main.svg",
      "images/ottoman-beds/kingston-ottoman-bed-angle.svg",
      "images/ottoman-beds/kingston-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 13,
    "slug": "manhattan-slatted-ottoman-bed",
    "name": "Manhattan Slatted Ottoman Bed",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 4,
    "reviewCount": 93,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Blue",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Manhattan Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/manhattan-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/manhattan-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/manhattan-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 14,
    "slug": "brighton-slatted-ottoman-bed",
    "name": "Brighton Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 181,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Blue",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Brighton Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/brighton-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/brighton-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/brighton-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 15,
    "slug": "lancaster-ottoman-bed",
    "name": "Lancaster Ottoman Bed",
    "price": 629,
    "oldPrice": 689,
    "monthlyPrice": 52,
    "rating": 4,
    "reviewCount": 110,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Pink",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Lancaster Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/lancaster-ottoman-bed-main.svg",
      "images/ottoman-beds/lancaster-ottoman-bed-angle.svg",
      "images/ottoman-beds/lancaster-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 16,
    "slug": "bristol-slatted-ottoman-bed",
    "name": "Bristol Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 50,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Blue",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Bristol Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/bristol-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/bristol-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/bristol-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 17,
    "slug": "soho-slatted-ottoman-bed",
    "name": "Soho Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 4,
    "reviewCount": 200,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Blue",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Soho Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/soho-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/soho-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/soho-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 18,
    "slug": "belgravia-ottoman-bed",
    "name": "Belgravia Ottoman Bed",
    "price": 429,
    "oldPrice": 489,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 23,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Grey",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Belgravia Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/belgravia-ottoman-bed-main.svg",
      "images/ottoman-beds/belgravia-ottoman-bed-angle.svg",
      "images/ottoman-beds/belgravia-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 19,
    "slug": "fulham-slatted-ottoman-bed",
    "name": "Fulham Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 36,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Blue",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Fulham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/fulham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/fulham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/fulham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 20,
    "slug": "chiswick-slatted-ottoman-bed",
    "name": "Chiswick Slatted Ottoman Bed",
    "price": 679,
    "oldPrice": null,
    "monthlyPrice": 57,
    "rating": 5,
    "reviewCount": 165,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Silver",
      "Blue"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Chiswick Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/chiswick-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/chiswick-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/chiswick-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 21,
    "slug": "greenwich-ottoman-bed",
    "name": "Greenwich Ottoman Bed",
    "price": 649,
    "oldPrice": null,
    "monthlyPrice": 54,
    "rating": 5,
    "reviewCount": 123,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Grey",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Greenwich Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/greenwich-ottoman-bed-main.svg",
      "images/ottoman-beds/greenwich-ottoman-bed-angle.svg",
      "images/ottoman-beds/greenwich-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 22,
    "slug": "camden-slatted-ottoman-bed",
    "name": "Camden Slatted Ottoman Bed",
    "price": 679,
    "oldPrice": 739,
    "monthlyPrice": 57,
    "rating": 4,
    "reviewCount": 67,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Black",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Camden Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/camden-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/camden-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/camden-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 23,
    "slug": "notting-hill-slatted-ottoman-bed",
    "name": "Notting Hill Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 4,
    "reviewCount": 131,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "Silver",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Notting Hill Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/notting-hill-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/notting-hill-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/notting-hill-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 24,
    "slug": "marylebone-ottoman-bed",
    "name": "Marylebone Ottoman Bed",
    "price": 449,
    "oldPrice": null,
    "monthlyPrice": 37,
    "rating": 5,
    "reviewCount": 72,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "Brown",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Marylebone Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/marylebone-ottoman-bed-main.svg",
      "images/ottoman-beds/marylebone-ottoman-bed-angle.svg",
      "images/ottoman-beds/marylebone-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 25,
    "slug": "highgate-slatted-ottoman-bed",
    "name": "Highgate Slatted Ottoman Bed",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 126,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Cream",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Highgate Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/highgate-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/highgate-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/highgate-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 26,
    "slug": "hampstead-slatted-ottoman-bed",
    "name": "Hampstead Slatted Ottoman Bed",
    "price": 489,
    "oldPrice": 549,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 206,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Blue",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Hampstead Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/hampstead-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/hampstead-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/hampstead-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 27,
    "slug": "clapham-ottoman-bed",
    "name": "Clapham Ottoman Bed",
    "price": 399,
    "oldPrice": null,
    "monthlyPrice": 33,
    "rating": 4,
    "reviewCount": 65,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Brown",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Clapham Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/clapham-ottoman-bed-main.svg",
      "images/ottoman-beds/clapham-ottoman-bed-angle.svg",
      "images/ottoman-beds/clapham-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 28,
    "slug": "islington-slatted-ottoman-bed",
    "name": "Islington Slatted Ottoman Bed",
    "price": 629,
    "oldPrice": 689,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 38,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Beige",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      },
      {
        "slug": "crushed-velvet-silver",
        "name": "Crushed Velvet Silver"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Islington Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/islington-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/islington-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/islington-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 29,
    "slug": "shoreditch-slatted-ottoman-bed",
    "name": "Shoreditch Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": 549,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 135,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Silver",
      "Blue"
    ],
    "availableFabrics": [
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Shoreditch Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/shoreditch-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/shoreditch-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/shoreditch-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 30,
    "slug": "southbank-ottoman-bed",
    "name": "Southbank Ottoman Bed",
    "price": 599,
    "oldPrice": 699,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 107,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Green",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Southbank Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/southbank-ottoman-bed-main.svg",
      "images/ottoman-beds/southbank-ottoman-bed-angle.svg",
      "images/ottoman-beds/southbank-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 31,
    "slug": "kew-slatted-ottoman-bed",
    "name": "Kew Slatted Ottoman Bed",
    "price": 629,
    "oldPrice": null,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 20,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Cream",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Kew Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/kew-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/kew-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/kew-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 32,
    "slug": "putney-slatted-ottoman-bed",
    "name": "Putney Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 57,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Beige",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Putney Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/putney-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/putney-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/putney-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 33,
    "slug": "wimbledon-ottoman-bed",
    "name": "Wimbledon Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 41,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "White",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Wimbledon Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/wimbledon-ottoman-bed-main.svg",
      "images/ottoman-beds/wimbledon-ottoman-bed-angle.svg",
      "images/ottoman-beds/wimbledon-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 34,
    "slug": "dulwich-slatted-ottoman-bed",
    "name": "Dulwich Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": null,
    "monthlyPrice": 54,
    "rating": 4,
    "reviewCount": 207,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Pink",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Dulwich Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/dulwich-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/dulwich-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/dulwich-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 35,
    "slug": "ealing-slatted-ottoman-bed",
    "name": "Ealing Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": 699,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 159,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Grey",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Ealing Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/ealing-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/ealing-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/ealing-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 36,
    "slug": "harrow-ottoman-bed",
    "name": "Harrow Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 4,
    "reviewCount": 108,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Beige",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Harrow Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/harrow-ottoman-bed-main.svg",
      "images/ottoman-beds/harrow-ottoman-bed-angle.svg",
      "images/ottoman-beds/harrow-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 37,
    "slug": "barnet-slatted-ottoman-bed",
    "name": "Barnet Slatted Ottoman Bed",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 24,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Black",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Barnet Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/barnet-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/barnet-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/barnet-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 38,
    "slug": "enfield-slatted-ottoman-bed",
    "name": "Enfield Slatted Ottoman Bed",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 27,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Black",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Enfield Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/enfield-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/enfield-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/enfield-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 39,
    "slug": "bromley-ottoman-bed",
    "name": "Bromley Ottoman Bed",
    "price": 469,
    "oldPrice": 549,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 102,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Blue",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Bromley Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/bromley-ottoman-bed-main.svg",
      "images/ottoman-beds/bromley-ottoman-bed-angle.svg",
      "images/ottoman-beds/bromley-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 40,
    "slug": "croydon-slatted-ottoman-bed",
    "name": "Croydon Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": null,
    "monthlyPrice": 54,
    "rating": 5,
    "reviewCount": 102,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Black",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Croydon Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/croydon-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/croydon-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/croydon-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 41,
    "slug": "sutton-slatted-ottoman-bed",
    "name": "Sutton Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 204,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Beige",
      "Black"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "crushed-velvet-silver",
        "name": "Crushed Velvet Silver"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Sutton Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/sutton-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/sutton-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/sutton-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 42,
    "slug": "merton-ottoman-bed",
    "name": "Merton Ottoman Bed",
    "price": 399,
    "oldPrice": null,
    "monthlyPrice": 33,
    "rating": 4,
    "reviewCount": 151,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Silver",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Merton Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/merton-ottoman-bed-main.svg",
      "images/ottoman-beds/merton-ottoman-bed-angle.svg",
      "images/ottoman-beds/merton-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 43,
    "slug": "lewisham-slatted-ottoman-bed",
    "name": "Lewisham Slatted Ottoman Bed",
    "price": 629,
    "oldPrice": 689,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 147,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Blue",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Lewisham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/lewisham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/lewisham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/lewisham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 44,
    "slug": "hackney-slatted-ottoman-bed",
    "name": "Hackney Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 191,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Brown",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Hackney Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/hackney-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/hackney-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/hackney-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 45,
    "slug": "tower-bridge-ottoman-bed",
    "name": "Tower Bridge Ottoman Bed",
    "price": 489,
    "oldPrice": 609,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 173,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Green",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Tower Bridge Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/tower-bridge-ottoman-bed-main.svg",
      "images/ottoman-beds/tower-bridge-ottoman-bed-angle.svg",
      "images/ottoman-beds/tower-bridge-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 46,
    "slug": "canary-wharf-slatted-ottoman-bed",
    "name": "Canary Wharf Slatted Ottoman Bed",
    "price": 649,
    "oldPrice": 749,
    "monthlyPrice": 54,
    "rating": 4,
    "reviewCount": 210,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Cream",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Canary Wharf Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/canary-wharf-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/canary-wharf-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/canary-wharf-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 47,
    "slug": "mile-end-slatted-ottoman-bed",
    "name": "Mile End Slatted Ottoman Bed",
    "price": 399,
    "oldPrice": 519,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 36,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Brown",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Mile End Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/mile-end-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/mile-end-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/mile-end-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 48,
    "slug": "wapping-ottoman-bed",
    "name": "Wapping Ottoman Bed",
    "price": 549,
    "oldPrice": 609,
    "monthlyPrice": 46,
    "rating": 4,
    "reviewCount": 126,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Grey",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "crushed-velvet-silver",
        "name": "Crushed Velvet Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Wapping Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/wapping-ottoman-bed-main.svg",
      "images/ottoman-beds/wapping-ottoman-bed-angle.svg",
      "images/ottoman-beds/wapping-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 49,
    "slug": "bermondsey-slatted-ottoman-bed",
    "name": "Bermondsey Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 188,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Blue",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Bermondsey Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/bermondsey-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/bermondsey-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/bermondsey-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 50,
    "slug": "peckham-slatted-ottoman-bed",
    "name": "Peckham Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 208,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Blue",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Peckham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/peckham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/peckham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/peckham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 51,
    "slug": "brixton-ottoman-bed",
    "name": "Brixton Ottoman Bed",
    "price": 649,
    "oldPrice": 769,
    "monthlyPrice": 54,
    "rating": 4,
    "reviewCount": 200,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Silver",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Brixton Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/brixton-ottoman-bed-main.svg",
      "images/ottoman-beds/brixton-ottoman-bed-angle.svg",
      "images/ottoman-beds/brixton-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 52,
    "slug": "stockwell-slatted-ottoman-bed",
    "name": "Stockwell Slatted Ottoman Bed",
    "price": 449,
    "oldPrice": 529,
    "monthlyPrice": 37,
    "rating": 4,
    "reviewCount": 34,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Grey",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Stockwell Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/stockwell-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/stockwell-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/stockwell-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 53,
    "slug": "vauxhall-slatted-ottoman-bed",
    "name": "Vauxhall Slatted Ottoman Bed",
    "price": 549,
    "oldPrice": 609,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 115,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Pink",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Vauxhall Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/vauxhall-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/vauxhall-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/vauxhall-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 54,
    "slug": "pimlico-ottoman-bed",
    "name": "Pimlico Ottoman Bed",
    "price": 579,
    "oldPrice": 699,
    "monthlyPrice": 48,
    "rating": 5,
    "reviewCount": 25,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Green",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Pimlico Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/pimlico-ottoman-bed-main.svg",
      "images/ottoman-beds/pimlico-ottoman-bed-angle.svg",
      "images/ottoman-beds/pimlico-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 55,
    "slug": "knightsbridge-slatted-ottoman-bed",
    "name": "Knightsbridge Slatted Ottoman Bed",
    "price": 629,
    "oldPrice": null,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 169,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "Cream",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Knightsbridge Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/knightsbridge-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/knightsbridge-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/knightsbridge-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 56,
    "slug": "chelsea-harbour-slatted-ottoman-bed",
    "name": "Chelsea Harbour Slatted Ottoman Bed",
    "price": 449,
    "oldPrice": 569,
    "monthlyPrice": 37,
    "rating": 5,
    "reviewCount": 72,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Brown",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Chelsea Harbour Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/chelsea-harbour-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/chelsea-harbour-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/chelsea-harbour-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 57,
    "slug": "regent-ottoman-bed",
    "name": "Regent Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 31,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "Pink",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Regent Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/regent-ottoman-bed-main.svg",
      "images/ottoman-beds/regent-ottoman-bed-angle.svg",
      "images/ottoman-beds/regent-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 58,
    "slug": "piccadilly-slatted-ottoman-bed",
    "name": "Piccadilly Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 57,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Beige",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Piccadilly Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/piccadilly-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/piccadilly-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/piccadilly-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 59,
    "slug": "bloomsbury-slatted-ottoman-bed",
    "name": "Bloomsbury Slatted Ottoman Bed",
    "price": 679,
    "oldPrice": 779,
    "monthlyPrice": 57,
    "rating": 4,
    "reviewCount": 173,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Black",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Bloomsbury Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/bloomsbury-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/bloomsbury-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/bloomsbury-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 60,
    "slug": "holborn-ottoman-bed",
    "name": "Holborn Ottoman Bed",
    "price": 629,
    "oldPrice": 729,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 191,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Beige",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Holborn Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/holborn-ottoman-bed-main.svg",
      "images/ottoman-beds/holborn-ottoman-bed-angle.svg",
      "images/ottoman-beds/holborn-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 61,
    "slug": "farringdon-slatted-ottoman-bed",
    "name": "Farringdon Slatted Ottoman Bed",
    "price": 679,
    "oldPrice": null,
    "monthlyPrice": 57,
    "rating": 5,
    "reviewCount": 48,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Brown",
      "White",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Farringdon Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/farringdon-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/farringdon-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/farringdon-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 62,
    "slug": "barbican-slatted-ottoman-bed",
    "name": "Barbican Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 125,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Cream",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Barbican Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/barbican-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/barbican-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/barbican-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 63,
    "slug": "angel-ottoman-bed",
    "name": "Angel Ottoman Bed",
    "price": 449,
    "oldPrice": null,
    "monthlyPrice": 37,
    "rating": 5,
    "reviewCount": 175,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Black",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Angel Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/angel-ottoman-bed-main.svg",
      "images/ottoman-beds/angel-ottoman-bed-angle.svg",
      "images/ottoman-beds/angel-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 64,
    "slug": "finsbury-slatted-ottoman-bed",
    "name": "Finsbury Slatted Ottoman Bed",
    "price": 469,
    "oldPrice": null,
    "monthlyPrice": 39,
    "rating": 4,
    "reviewCount": 89,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Brown",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Finsbury Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/finsbury-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/finsbury-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/finsbury-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 65,
    "slug": "whitechapel-slatted-ottoman-bed",
    "name": "Whitechapel Slatted Ottoman Bed",
    "price": 399,
    "oldPrice": null,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 64,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Black",
      "Blue"
    ],
    "availableFabrics": [
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Whitechapel Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/whitechapel-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/whitechapel-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/whitechapel-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 66,
    "slug": "aldgate-ottoman-bed",
    "name": "Aldgate Ottoman Bed",
    "price": 599,
    "oldPrice": 679,
    "monthlyPrice": 50,
    "rating": 4,
    "reviewCount": 79,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Green",
      "Blue"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Aldgate Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/aldgate-ottoman-bed-main.svg",
      "images/ottoman-beds/aldgate-ottoman-bed-angle.svg",
      "images/ottoman-beds/aldgate-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 67,
    "slug": "stratford-slatted-ottoman-bed",
    "name": "Stratford Slatted Ottoman Bed",
    "price": 579,
    "oldPrice": null,
    "monthlyPrice": 48,
    "rating": 4,
    "reviewCount": 93,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "White",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Stratford Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/stratford-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/stratford-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/stratford-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 68,
    "slug": "hackney-wick-slatted-ottoman-bed",
    "name": "Hackney Wick Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 208,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Pink",
      "Blue"
    ],
    "availableFabrics": [
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Hackney Wick Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/hackney-wick-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/hackney-wick-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/hackney-wick-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 69,
    "slug": "bow-ottoman-bed",
    "name": "Bow Ottoman Bed",
    "price": 469,
    "oldPrice": 549,
    "monthlyPrice": 39,
    "rating": 5,
    "reviewCount": 48,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "Pink",
      "Green"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Bow Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/bow-ottoman-bed-main.svg",
      "images/ottoman-beds/bow-ottoman-bed-angle.svg",
      "images/ottoman-beds/bow-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 70,
    "slug": "poplar-slatted-ottoman-bed",
    "name": "Poplar Slatted Ottoman Bed",
    "price": 489,
    "oldPrice": null,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 170,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Beige",
      "White",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "naples-silver",
        "name": "Naples Silver"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Poplar Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/poplar-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/poplar-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/poplar-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 71,
    "slug": "limehouse-slatted-ottoman-bed",
    "name": "Limehouse Slatted Ottoman Bed",
    "price": 489,
    "oldPrice": 569,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 29,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Silver",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Limehouse Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/limehouse-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/limehouse-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/limehouse-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 72,
    "slug": "rotherhithe-ottoman-bed",
    "name": "Rotherhithe Ottoman Bed",
    "price": 629,
    "oldPrice": 749,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 105,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Pink",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Rotherhithe Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/rotherhithe-ottoman-bed-main.svg",
      "images/ottoman-beds/rotherhithe-ottoman-bed-angle.svg",
      "images/ottoman-beds/rotherhithe-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 73,
    "slug": "deptford-slatted-ottoman-bed",
    "name": "Deptford Slatted Ottoman Bed",
    "price": 579,
    "oldPrice": 639,
    "monthlyPrice": 48,
    "rating": 4,
    "reviewCount": 56,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Blue",
      "Brown",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Deptford Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/deptford-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/deptford-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/deptford-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 74,
    "slug": "new-cross-slatted-ottoman-bed",
    "name": "New Cross Slatted Ottoman Bed",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 131,
    "badge": "Popular",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Pink",
      "Grey",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "crushed-velvet-cream",
        "name": "Crushed Velvet Cream"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The New Cross Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/new-cross-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/new-cross-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/new-cross-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 75,
    "slug": "catford-ottoman-bed",
    "name": "Catford Ottoman Bed",
    "price": 699,
    "oldPrice": 779,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 187,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Grey",
      "Brown"
    ],
    "availableFabrics": [
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-steel",
        "name": "Plush Steel"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Catford Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/catford-ottoman-bed-main.svg",
      "images/ottoman-beds/catford-ottoman-bed-angle.svg",
      "images/ottoman-beds/catford-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 76,
    "slug": "sydenham-slatted-ottoman-bed",
    "name": "Sydenham Slatted Ottoman Bed",
    "price": 579,
    "oldPrice": null,
    "monthlyPrice": 48,
    "rating": 5,
    "reviewCount": 92,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Silver",
      "Beige"
    ],
    "availableFabrics": [
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Sydenham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/sydenham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/sydenham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/sydenham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 77,
    "slug": "crystal-palace-slatted-ottoman-bed",
    "name": "Crystal Palace Slatted Ottoman Bed",
    "price": 489,
    "oldPrice": null,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 187,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Cream",
      "Black",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-steel",
        "name": "Naples Steel"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Crystal Palace Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/crystal-palace-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/crystal-palace-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/crystal-palace-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 78,
    "slug": "norwood-ottoman-bed",
    "name": "Norwood Ottoman Bed",
    "price": 429,
    "oldPrice": 529,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 209,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Black",
      "Brown",
      "Pink"
    ],
    "availableFabrics": [
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Norwood Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/norwood-ottoman-bed-main.svg",
      "images/ottoman-beds/norwood-ottoman-bed-angle.svg",
      "images/ottoman-beds/norwood-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 79,
    "slug": "streatham-slatted-ottoman-bed",
    "name": "Streatham Slatted Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 38,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "White",
      "Black",
      "Grey"
    ],
    "availableFabrics": [
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "marble-silver",
        "name": "Marble Silver"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Streatham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/streatham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/streatham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/streatham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 80,
    "slug": "balham-slatted-ottoman-bed",
    "name": "Balham Slatted Ottoman Bed",
    "price": 429,
    "oldPrice": 489,
    "monthlyPrice": 36,
    "rating": 5,
    "reviewCount": 165,
    "badge": "Best Seller",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Black",
      "Cream"
    ],
    "availableFabrics": [
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "plush-cream",
        "name": "Plush Cream"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "crushed-velvet-silver",
        "name": "Crushed Velvet Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Balham Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/balham-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/balham-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/balham-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 81,
    "slug": "tooting-ottoman-bed",
    "name": "Tooting Ottoman Bed",
    "price": 629,
    "oldPrice": null,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 41,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Silver",
      "Cream",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      },
      {
        "slug": "plush-green",
        "name": "Plush Green"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Tooting Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/tooting-ottoman-bed-main.svg",
      "images/ottoman-beds/tooting-ottoman-bed-angle.svg",
      "images/ottoman-beds/tooting-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 82,
    "slug": "earlsfield-slatted-ottoman-bed",
    "name": "Earlsfield Slatted Ottoman Bed",
    "price": 549,
    "oldPrice": null,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 187,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Silver",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      },
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Earlsfield Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/earlsfield-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/earlsfield-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/earlsfield-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 83,
    "slug": "raynes-park-slatted-ottoman-bed",
    "name": "Raynes Park Slatted Ottoman Bed",
    "price": 489,
    "oldPrice": 609,
    "monthlyPrice": 41,
    "rating": 5,
    "reviewCount": 18,
    "badge": null,
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Grey",
      "Beige",
      "White"
    ],
    "availableFabrics": [
      {
        "slug": "marble-platinum",
        "name": "Marble Platinum"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Raynes Park Slatted Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/raynes-park-slatted-ottoman-bed-main.svg",
      "images/ottoman-beds/raynes-park-slatted-ottoman-bed-angle.svg",
      "images/ottoman-beds/raynes-park-slatted-ottoman-bed-closeup.svg"
    ]
  },
  {
    "id": 84,
    "slug": "motspur-ottoman-bed",
    "name": "Motspur Ottoman Bed",
    "price": 629,
    "oldPrice": null,
    "monthlyPrice": 52,
    "rating": 5,
    "reviewCount": 31,
    "badge": "New",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "availableColours": [
      "Green",
      "Pink",
      "Silver"
    ],
    "availableFabrics": [
      {
        "slug": "coniston-armour",
        "name": "Coniston Armour"
      },
      {
        "slug": "crushed-velvet-black",
        "name": "Crushed Velvet Black"
      },
      {
        "slug": "coniston-almond",
        "name": "Coniston Almond"
      },
      {
        "slug": "plush-beige",
        "name": "Plush Beige"
      }
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "description": "The Motspur Ottoman Bed combines a reinforced slatted base with generous gas-lift ottoman storage beneath the mattress. Handmade to order, it's designed to bring smart, hidden storage and tailored upholstered style to a modern bedroom, in a choice of UK sizes and fabrics.",
    "features": [
      "Reinforced slatted base for supportive, breathable sleep",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Available in multiple UK bed sizes"
    ],
    "materials": [
      "Solid timber frame",
      "Reinforced slatted base",
      "High-density foam headboard padding",
      "Tailored fabric upholstery"
    ],
    "warranty": "24 month warranty",
    "delivery": "Handmade to order, with fast delivery options available on selected sizes and fabrics.",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "ottomanUpgradePrice": 0,
    "detailingButtonsPrice": 15,
    "images": [
      "images/ottoman-beds/motspur-ottoman-bed-main.svg",
      "images/ottoman-beds/motspur-ottoman-bed-angle.svg",
      "images/ottoman-beds/motspur-ottoman-bed-closeup.svg"
    ]
  }
];

  const SLATTED_OTTOMAN_SIZE_DELTAS = {
    "Single": -100,
    "Small Double": -50,
    "Double": 0,
    "King": 100,
    "Super King": 190
  };

  var OTTOMAN_FABRIC_CATALOG = [
    { slug: "plush-grey", name: "Plush Grey", image: "img-34.jfif" },
    { slug: "plush-silver", name: "Plush Silver", image: "img-35.jfif" },
    { slug: "plush-steel", name: "Plush Steel", image: "img-36.jfif" },
    { slug: "coniston-charcoal", name: "Coniston Charcoal", image: "img-37.jfif" },
    { slug: "coniston-almond", name: "Coniston Almond", image: "img-105.jfif" },
    { slug: "plush-cream", name: "Plush Cream", image: "img-38.jfif" },
    { slug: "naples-silver", name: "Naples Silver", image: "img-39.jfif" },
    { slug: "naples-steel", name: "Naples Steel", image: "img-40.jfif" },
    { slug: "coniston-armour", name: "Coniston Armour", image: "img-101.jfif" },
    { slug: "plush-beige", name: "Plush Beige", image: "img-102.jfif" },
    { slug: "plush-black", name: "Plush Black", image: "img-104.jfif" },
    { slug: "plush-pink", name: "Plush Pink", image: "img-106.jfif" },
    { slug: "coniston-emerald", name: "Coniston Emerald", image: "img-107.jfif" },
    { slug: "coniston-pink", name: "Coniston Pink", image: "img-108.jfif" },
    { slug: "naples-black", name: "Naples Black", image: "img-109.jfif" },
    { slug: "naples-ivory", name: "Naples Ivory", image: "img-110.jfif" },
    { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver", image: "img-111.jfif" },
    { slug: "crushed-velvet-black", name: "Crushed Velvet Black", image: "img-112.jfif" },
    { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream", image: "img-113.jfif" },
    { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink", image: "img-114.jfif" },
    { slug: "plush-mustard", name: "Plush Mustard", image: "img-115.jfif" },
    { slug: "plush-green", name: "Plush Green", image: "img-116.jfif" },
    { slug: "plush-turquoise", name: "Plush Turquoise", image: "img-117.jfif" },
    { slug: "coniston-blue", name: "Coniston Blue", image: "img-118.jfif" },
    { slug: "cream-boucle", name: "Cream Boucle", image: "img-119.jfif" },
    { slug: "pink-boucle", name: "Pink Boucle", image: "img-120.jfif" },
    { slug: "marble-oatmeal", name: "Marble Oatmeal", image: "img-121.jfif" },
    { slug: "marble-platinum", name: "Marble Platinum", image: "img-122.jfif" },
    { slug: "marble-silver", name: "Marble Silver", image: "img-123.jfif" }
  ];

  var OTTOMAN_PRODUCTS_LIST = SLATTED_OTTOMAN_PRODUCTS;

  var OTTOMAN_PRODUCTS = {};
  OTTOMAN_PRODUCTS_LIST.forEach(function (p) {
    OTTOMAN_PRODUCTS[p.slug] = p;
  });

  // ---------------------------------------------------------------
  // DEPLOYMENT SELF-CHECK — safe to leave in permanently.
  // Prints the moment this file finishes loading, showing exactly
  // how many products it actually found. If the live site is
  // running an old/incomplete copy of this file, this number will
  // be wrong or missing entirely — which is the fastest possible
  // way to confirm, from the Console tab alone, whether the real
  // file deployed correctly, with no need to check file sizes.
  // ---------------------------------------------------------------
  console.log(
    "[Rabbora] ottoman-beds.js loaded \u2014 " +
    OTTOMAN_PRODUCTS_LIST.length + " products found. " +
    "Expected: 84. If this number is wrong, low, or this line " +
    "never appears at all, the live server is not running this file."
  );

  var OTTOMAN_SIZE_DELTAS = SLATTED_OTTOMAN_SIZE_DELTAS;

  function obMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function obStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  var obState = {
    page: 1,
    selectedSize: null,
    selectedFabricIndex: -1, // -1 = "Same as main display picture"
    selectedOttoman: "yes",
    diamantes: false,
    buttons: false,
    matching: "no",
    matchingType: "footstool",
    quantity: 1,
    detailImageIndex: 0
  };

  function initOttomanFilters() {
    var grid = document.getElementById("obProductGrid");
    if (!grid) return;

    var priceSelect = document.getElementById("obPriceSelect");
    var sizeSelect = document.getElementById("obSizeSelect");
    var colourSelect = document.getElementById("obColourSelect");
    var availabilitySelect = document.getElementById("obAvailabilitySelect");
    var sortSelect = document.getElementById("obSortSelect");

    var filtersBtn = document.getElementById("obFiltersBtn");
    var filtersCountEl = document.getElementById("obFiltersCount");
    var drawer = document.getElementById("obFilterDrawer");
    var drawerClose = document.getElementById("obFilterDrawerClose");
    var overlay = document.getElementById("obFilterOverlay");
    var applyBtn = document.getElementById("obApplyFilters");
    var clearBtn = document.getElementById("obClearFilters");
    var productCountEl = document.getElementById("obProductCount");
    var fallbackNote = document.getElementById("obFallbackNote");
    var pagination = document.getElementById("obPagination");
    var pagePrevBtn = document.getElementById("obPagePrev");
    var pageNextBtn = document.getElementById("obPageNext");
    var pageButtons = qsa(".mt-pagination__page", pagination);

    var PAGE_SIZE = 12;
    var cards = qsa(".ob-product-card", grid);

    function priceInRange(price, range) {
      if (range === "all") return true;
      if (range === "under-450") return price < 450;
      if (range === "450-600") return price >= 450 && price <= 600;
      if (range === "over-600") return price > 600;
      return true;
    }

    function getFilterState() {
      return {
        price: priceSelect ? priceSelect.value : "all",
        size: sizeSelect ? sizeSelect.value : "all",
        colour: colourSelect ? colourSelect.value : "all",
        availability: availabilitySelect ? availabilitySelect.value : "all"
      };
    }

    function cardHasColour(card, colour) {
      if (colour === "all") return true;
      var options = (card.dataset.colours || "").split("|");
      return options.indexOf(colour) !== -1;
    }

    function cardMatches(card, state) {
      return (
        priceInRange(parseFloat(card.dataset.price), state.price) &&
        cardHasColour(card, state.colour) &&
        (state.availability === "all" || parseInt(card.dataset.rating, 10) >= 4)
      );
    }

    function cardScore(card, state) {
      var score = 0;
      if (state.colour !== "all" && cardHasColour(card, state.colour)) score += 60;
      if (state.availability !== "all" && parseInt(card.dataset.rating, 10) >= 4) score += 20;
      if (priceInRange(parseFloat(card.dataset.price), state.price)) score += 1;
      return score;
    }

    function activeFilterCount(state) {
      var count = 0;
      if (state.price !== "all") count += 1;
      if (state.size !== "all") count += 1;
      if (state.colour !== "all") count += 1;
      if (state.availability !== "all") count += 1;
      return count;
    }

    function updateFiltersCountBadge(state) {
      if (!filtersCountEl) return;
      var count = activeFilterCount(state);
      if (count > 0) {
        filtersCountEl.textContent = String(count);
        filtersCountEl.hidden = false;
      } else {
        filtersCountEl.hidden = true;
      }
    }

    function sortCards(list, mode) {
      var sorted = list.slice();
      var order = OTTOMAN_PRODUCTS_LIST.map(function (p) { return p.slug; });

      sorted.sort(function (a, b) {
        var priceA = parseFloat(a.dataset.price);
        var priceB = parseFloat(b.dataset.price);
        if (mode === "price-asc") return priceA - priceB;
        if (mode === "price-desc") return priceB - priceA;
        if (mode === "rating") return parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10);
        if (mode === "newest") return order.indexOf(b.dataset.slug) - order.indexOf(a.dataset.slug);
        if (mode === "bestselling") {
          var aBadge = OTTOMAN_PRODUCTS[a.dataset.slug].badge === "Best Seller" ? 0 : 1;
          var bBadge = OTTOMAN_PRODUCTS[b.dataset.slug].badge === "Best Seller" ? 0 : 1;
          return aBadge - bBadge;
        }
        return parseInt(a.dataset.order, 10) - parseInt(b.dataset.order, 10);
      });

      return sorted;
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      pageButtons.forEach(function (btn) {
        var page = parseInt(btn.dataset.page, 10);
        btn.hidden = page > totalPages;
        btn.classList.toggle("is-active", page === obState.page);
        btn.setAttribute("aria-current", page === obState.page ? "page" : "false");
      });
      if (pagePrevBtn) pagePrevBtn.disabled = obState.page <= 1;
      if (pageNextBtn) pageNextBtn.disabled = obState.page >= totalPages;
      pagination.hidden = totalPages <= 1;
    }

    // Never shows a fully empty grid: if no card matches every active
    // filter exactly, fall back to the closest-scoring cards instead,
    // prioritising Colour, then Availability/Rating and Price.
    function applyFilters(resetPage) {
      var state = getFilterState();
      var exactMatches = cards.filter(function (card) {
        return cardMatches(card, state);
      });

      var matched = exactMatches;
      var usedFallback = false;

      if (matched.length === 0) {
        var scored = cards.map(function (card) {
          return { card: card, score: cardScore(card, state) };
        });
        var maxScore = Math.max.apply(null, scored.map(function (s) { return s.score; }));
        matched = scored
          .filter(function (s) { return s.score === maxScore; })
          .map(function (s) { return s.card; });
        usedFallback = activeFilterCount(state) > 0;
      }

      var sortMode = sortSelect ? sortSelect.value : "featured";
      matched = sortCards(matched, sortMode);

      if (resetPage) obState.page = 1;

      var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
      if (obState.page > totalPages) obState.page = totalPages;

      var startIndex = (obState.page - 1) * PAGE_SIZE;
      var pageItems = matched.slice(startIndex, startIndex + PAGE_SIZE);

      cards.forEach(function (card) {
        card.hidden = pageItems.indexOf(card) === -1;
      });

      pageItems.forEach(function (card) {
        grid.appendChild(card);
      });

      if (fallbackNote) fallbackNote.hidden = !usedFallback;

      if (productCountEl) {
        if (matched.length === 0) {
          productCountEl.textContent = "0 beds";
        } else {
          var from = startIndex + 1;
          var to = Math.min(startIndex + PAGE_SIZE, matched.length);
          productCountEl.textContent = "Showing " + from + "\u2013" + to + " of " + matched.length + " beds";
        }
      }

      renderPagination(totalPages);
      updateFiltersCountBadge(state);
    }

    [priceSelect, sizeSelect, colourSelect, availabilitySelect].forEach(function (select) {
      if (select) select.addEventListener("change", function () { applyFilters(true); });
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", function () { applyFilters(false); });
    }

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener("click", function () {
        if (obState.page > 1) {
          obState.page -= 1;
          applyFilters(false);
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    if (pageNextBtn) {
      pageNextBtn.addEventListener("click", function () {
        obState.page += 1;
        applyFilters(false);
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    pageButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        obState.page = parseInt(btn.dataset.page, 10);
        applyFilters(false);
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(function () { overlay.classList.add("is-visible"); });
      }
      if (filtersBtn) filtersBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("sf-drawer-open");
    }

    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      if (overlay) {
        overlay.classList.remove("is-visible");
        window.setTimeout(function () { overlay.hidden = true; }, 250);
      }
      if (filtersBtn) filtersBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("sf-drawer-open");
    }

    if (filtersBtn) {
      filtersBtn.addEventListener("click", function () {
        var isMobile = window.matchMedia("(max-width: 1023px)").matches;
        if (!isMobile) {
          if (drawer) drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        var isOpen = drawer && drawer.classList.contains("is-open");
        if (isOpen) { closeDrawer(); } else { openDrawer(); }
      });
    }

    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    if (applyBtn) {
      applyBtn.addEventListener("click", function () {
        applyFilters(true);
        closeDrawer();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        [priceSelect, sizeSelect, colourSelect, availabilitySelect].forEach(function (select) {
          if (select) select.value = "all";
        });
        applyFilters(true);
      });
    }

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    applyFilters(true);
  }

  function initOttomanViewToggle() {
    var grid = document.getElementById("obProductGrid");
    var btn2 = document.getElementById("obCols2Btn");
    var btn3 = document.getElementById("obCols3Btn");
    var btn4 = document.getElementById("obCols4Btn");
    if (!grid || !btn2 || !btn3 || !btn4) return;

    var buttons = [btn2, btn3, btn4];

    function setActive(activeBtn) {
      buttons.forEach(function (btn) {
        var isActive = btn === activeBtn;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    }

    btn2.addEventListener("click", function () {
      grid.classList.remove("ob-cols-4");
      grid.classList.add("ob-cols-2");
      setActive(btn2);
    });

    btn3.addEventListener("click", function () {
      grid.classList.remove("ob-cols-2", "ob-cols-4");
      setActive(btn3);
    });

    btn4.addEventListener("click", function () {
      grid.classList.remove("ob-cols-2");
      grid.classList.add("ob-cols-4");
      setActive(btn4);
    });
  }

  function initOttomanDetail() {
    var categoryView = document.getElementById("obCategoryView");
    var detailView = document.getElementById("obDetailView");
    var notFoundView = document.getElementById("obNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("obDetailBreadcrumbName");
    var mainImage = document.getElementById("obGalleryMainImage");
    var thumbsWrap = document.getElementById("obGalleryThumbs");
    var prevBtn = document.getElementById("obGalleryPrev");
    var nextBtn = document.getElementById("obGalleryNext");
    var zoomBtn = document.getElementById("obGalleryZoom");
    var titleEl = document.getElementById("obDetailTitle");
    var starsEl = document.getElementById("obDetailStars");
    var reviewCountEl = document.getElementById("obDetailReviewCount");
    var priceEl = document.getElementById("obDetailPrice");
    var prevPriceEl = document.getElementById("obDetailPrevPrice");
    var monthlyEl = document.getElementById("obDetailMonthly");
    var descriptionEl = document.getElementById("obDetailDescription");
    var sizeOptionsEl = document.getElementById("obSizeOptions");
    var fabricOptionsEl = document.getElementById("obFabricOptions");
    var selectedFabricNameEl = document.getElementById("obSelectedFabricName");
    var ottomanOptionsEl = document.getElementById("obOttomanOptions");
    var diamantesToggle = document.getElementById("obDiamantesToggle");
    var buttonsToggle = document.getElementById("obButtonsToggle");
    var matchingOptionsEl = document.getElementById("obMatchingOptions");
    var matchingPanel = document.getElementById("obMatchingPanel");
    var matchingFabricNameEl = document.getElementById("obMatchingFabricName");
    var featuresEl = document.getElementById("obDetailFeatures");
    var materialsEl = document.getElementById("obDetailMaterials");
    var dimensionsEl = document.getElementById("obDetailDimensions");
    var deliveryEl = document.getElementById("obDetailDelivery");
    var warrantyEl = document.getElementById("obDetailWarranty");
    var returnsEl = document.getElementById("obDetailReturns");
    var relatedGrid = document.getElementById("obRelatedGrid");
    var qtyValueEl = document.getElementById("obQtyValue");
    var qtyMinus = document.getElementById("obQtyMinus");
    var qtyPlus = document.getElementById("obQtyPlus");
    var addToCartBtn = document.getElementById("obAddToCart");
    var wishlistBtn = document.getElementById("obDetailWishlist");
    var purchaseMessage = document.getElementById("obPurchaseMessage");
    var lightbox = document.getElementById("obLightbox");
    var lightboxImage = document.getElementById("obLightboxImage");
    var lightboxClose = document.getElementById("obLightboxClose");

    var currentProduct = null;

    function currentSlugFromHash() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function selectedFabricName() {
      if (obState.selectedFabricIndex === -1 || !currentProduct) return "Same as main display picture";
      var fabric = OTTOMAN_FABRIC_CATALOG[obState.selectedFabricIndex];
      return fabric ? fabric.name : "Same as main display picture";
    }

    function currentPrice(product) {
      var delta = obState.selectedSize ? (OTTOMAN_SIZE_DELTAS[obState.selectedSize] || 0) : 0;
      var addons = 0;
      if (obState.buttons) addons += product.detailingButtonsPrice || 15;
      return Math.max(0, product.price + delta + addons);
    }

    function renderGallery(product) {
      mainImage.src = product.images[obState.detailImageIndex];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      product.images.forEach(function (imgSrc, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === obState.detailImageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + imgSrc + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          obState.detailImageIndex = index;
          renderGallery(product);
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.availableSizeLabels.forEach(function (label, index) {
        var sizeKey = product.availableSizes[index];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.setAttribute("aria-pressed", String(obState.selectedSize === sizeKey));
        btn.textContent = label;
        btn.addEventListener("click", function () {
          obState.selectedSize = sizeKey;
          purchaseMessage.textContent = "";
          qsa(".mt-option-pill", sizeOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          renderPurchasePanel(product);
        });
        sizeOptionsEl.appendChild(btn);
      });
    }

    // Fabric Colour selector — reuses the exact fabric images already
    // used on the Fabric Samples and Sofas pages (images/fabrics/*.svg),
    // with "Same as main display picture" as the default first option.
    function renderFabricOptions(product) {
      fabricOptionsEl.innerHTML = "";

      var defaultBtn = document.createElement("button");
      defaultBtn.type = "button";
      defaultBtn.className = "fabric-swatch";
      defaultBtn.setAttribute("aria-pressed", String(obState.selectedFabricIndex === -1));
      defaultBtn.setAttribute("aria-label", "Same as main display picture");
      defaultBtn.innerHTML =
        '<span class="fabric-swatch__ring">' +
          '<img src="' + product.images[0] + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
          '<span class="fabric-swatch__check" aria-hidden="true">' +
            '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</span>' +
        '</span>' +
        '<span class="fabric-swatch__name">Default</span>';
      defaultBtn.addEventListener("click", function () {
        selectFabric(-1);
      });
      fabricOptionsEl.appendChild(defaultBtn);

      OTTOMAN_FABRIC_CATALOG.forEach(function (fabric, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fabric-swatch";
        btn.setAttribute("aria-pressed", String(obState.selectedFabricIndex === index));
        btn.setAttribute("aria-label", "Select " + fabric.name);
        var swatchImagePath = fabric.image ? "images/" + fabric.image : "images/fabrics/" + fabric.slug + ".svg";
        btn.innerHTML =
          '<span class="fabric-swatch__ring">' +
            '<img src="' + swatchImagePath + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
            '<span class="fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="fabric-swatch__name">' + fabric.name + '</span>';
        btn.addEventListener("click", function () {
          // Clicking the already-selected swatch again reverts to the
          // "Default" option (-1) rather than leaving nothing selected,
          // since this page always needs some fabric state resolved.
          selectFabric(obState.selectedFabricIndex === index ? -1 : index);
        });
        fabricOptionsEl.appendChild(btn);
      });
    }

    function selectFabric(index) {
      obState.selectedFabricIndex = index;
      purchaseMessage.textContent = "";
      qsa(".fabric-swatch", fabricOptionsEl).forEach(function (el, i) {
        el.setAttribute("aria-pressed", String((i - 1) === index));
      });
      selectedFabricNameEl.textContent = selectedFabricName();
      if (matchingFabricNameEl) matchingFabricNameEl.textContent = selectedFabricName();
      // A matching fabric-specific product photo isn't available for
      // every fabric, so per the spec we keep the main product image
      // and simply update the selected fabric name/highlight.
    }

    function renderPurchasePanel(product) {
      priceEl.textContent = obMoney(currentPrice(product));
      prevPriceEl.textContent = product.oldPrice ? obMoney(product.oldPrice) : "";
    }

    function renderDimensionsTable(product) {
      var rows = product.availableSizes.map(function (size, i) {
        var dims = product.dimensions[size];
        return "<tr><td>" + product.availableSizeLabels[i] + "</td><td>" + dims.width + "</td><td>" + dims.length + "</td></tr>";
      }).join("");
      dimensionsEl.innerHTML =
        "<thead><tr><th scope=\"col\">Size</th><th scope=\"col\">Width (cm)</th><th scope=\"col\">Length (cm)</th></tr></thead><tbody>" +
        rows + "</tbody>";
    }

    function initAddonControls() {
      qsa(".mt-option-pill", ottomanOptionsEl).forEach(function (btn) {
        btn.addEventListener("click", function () {
          obState.selectedOttoman = btn.dataset.value;
          qsa(".mt-option-pill", ottomanOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
        });
      });

      if (diamantesToggle) {
        diamantesToggle.addEventListener("click", function () {
          obState.diamantes = !obState.diamantes;
          diamantesToggle.setAttribute("aria-pressed", String(obState.diamantes));
        });
      }

      if (buttonsToggle) {
        buttonsToggle.addEventListener("click", function () {
          obState.buttons = !obState.buttons;
          buttonsToggle.setAttribute("aria-pressed", String(obState.buttons));
          if (currentProduct) renderPurchasePanel(currentProduct);
        });
      }

      qsa(".mt-option-pill", matchingOptionsEl).forEach(function (btn) {
        btn.addEventListener("click", function () {
          obState.matching = btn.dataset.value;
          qsa(".mt-option-pill", matchingOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          matchingPanel.hidden = obState.matching !== "yes";
          if (matchingFabricNameEl) matchingFabricNameEl.textContent = selectedFabricName();
        });
      });

      qsa("[data-matching]", matchingPanel).forEach(function (btn) {
        btn.addEventListener("click", function () {
          obState.matchingType = btn.dataset.matching;
          qsa("[data-matching]", matchingPanel).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
        });
      });
    }
    initAddonControls();

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = OTTOMAN_PRODUCTS_LIST.filter(function (p) { return p.slug !== product.slug; });
      var shuffled = others.slice().sort(function () { return 0.5 - Math.random(); });
      var related = shuffled.slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + obMoney(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="ottoman-beds.html#/' + p.slug + '">' +
              '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="ottoman-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
            '<div class="product-card__rating">' +
              '<span class="product-card__stars" aria-hidden="true">' + obStars(p.rating) + '</span>' +
              '<span class="product-card__review-count">(' + p.reviewCount + ')</span>' +
            '</div>' +
            '<div class="product-card__price-row">' +
              '<span class="product-card__price">' + obMoney(p.price) + '</span>' + prevHtml +
            '</div>' +
            '<p class="product-card__monthly">or from \u00A3' + p.monthlyPrice + '/mo</p>' +
          '</div>';
        relatedGrid.appendChild(card);
      });
    }

    function syncWishlistButton(product) {
      if (!wishlistBtn) return;
      var isSaved = hasWishlistStore() ? window.RabboraWishlist.has(product.slug) : state.wishlist.has(product.slug);
      wishlistBtn.setAttribute("aria-pressed", String(isSaved));
      wishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }

    function renderDetail(product) {
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute(
          "content",
          product.name + " — " + product.description.split(". ")[0] + ". Shop now at Rabbora Living with a 24 month warranty."
        );
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) {
        canonicalTag.setAttribute("href", "https://rabbora.co.uk/slatted-ottoman-beds/product/" + product.slug);
      }

      breadcrumbName.textContent = product.name;
      titleEl.textContent = product.name;
      starsEl.textContent = obStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviewCount + ")";
      monthlyEl.textContent = "or from \u00A3" + product.monthlyPrice + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = product.delivery;
      warrantyEl.textContent = product.warranty;
      returnsEl.textContent = product.returns;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      materialsEl.innerHTML = "";
      product.materials.forEach(function (material) {
        var li = document.createElement("li");
        li.textContent = material;
        materialsEl.appendChild(li);
      });

      obState.detailImageIndex = 0;
      obState.selectedSize = null;
      obState.selectedFabricIndex = -1;
      obState.selectedOttoman = "yes";
      obState.diamantes = false;
      obState.buttons = false;
      obState.matching = "no";
      obState.matchingType = "footstool";
      obState.quantity = 1;
      qtyValueEl.textContent = "1";
      purchaseMessage.textContent = "";
      purchaseMessage.classList.remove("is-error");
      matchingPanel.hidden = true;
      if (diamantesToggle) diamantesToggle.setAttribute("aria-pressed", "false");
      if (buttonsToggle) buttonsToggle.setAttribute("aria-pressed", "false");
      qsa(".mt-option-pill", ottomanOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", el.dataset.value === "yes" ? "true" : "false");
      });
      qsa(".mt-option-pill", matchingOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", el.dataset.value === "no" ? "true" : "false");
      });

      currentProduct = product;
      renderGallery(product);
      renderSizeOptions(product);
      renderFabricOptions(product);
      selectedFabricNameEl.textContent = "Same as main display picture";
      renderPurchasePanel(product);
      renderDimensionsTable(product);
      renderRelated(product);
      syncWishlistButton(product);
    }

    function showCategoryView() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Slatted Ottoman Beds | Stylish Storage Beds | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute(
          "content",
          "Shop Slatted Ottoman Beds at Rabbora Living. Reinforced slatted bases with spacious gas-lift storage, handmade to order in a choice of UK sizes and fabrics."
        );
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/slatted-ottoman-beds");
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Bed Not Found | Rabbora Living";
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      renderDetail(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") {
        showCategoryView();
        return;
      }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) {
        showCategoryView();
        return;
      }
      var product = OTTOMAN_PRODUCTS[slug];
      if (product) {
        showDetail(product);
      } else {
        showNotFound();
      }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        obState.detailImageIndex = (obState.detailImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        obState.detailImageIndex = (obState.detailImageIndex + 1) % currentProduct.images.length;
        renderGallery(currentProduct);
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function () {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.hidden = false;
      });
    }

    if (lightboxClose) lightboxClose.addEventListener("click", function () { lightbox.hidden = true; });
    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.hidden = true;
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) lightbox.hidden = true;
    });

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (obState.quantity > 1) {
          obState.quantity -= 1;
          qtyValueEl.textContent = String(obState.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        obState.quantity += 1;
        qtyValueEl.textContent = String(obState.quantity);
      });
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        if (!currentProduct) return;

        if (!obState.selectedSize) {
          purchaseMessage.textContent = "Please select a size.";
          purchaseMessage.classList.add("is-error");
          return;
        }

        var detailBits = [];
        if (obState.diamantes) detailBits.push("Diamantes");
        if (obState.buttons) detailBits.push("Matching Fabric Buttons");
        var detailText = detailBits.length ? " with " + detailBits.join(" & ") : "";

        var fabricName = selectedFabricName();
        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "ottoman-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "ottoman-beds.html#/" + currentProduct.slug,
              image: currentProduct.images && currentProduct.images.length ? currentProduct.images[0] : "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Slatted Ottoman Beds",
              variant: {
                size: obState.selectedSize,
                fabric: fabricName,
                diamantes: obState.diamantes ? "Yes" : null,
                buttons: obState.buttons ? "Yes" : null
              }
            },
            obState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent =
          "Added " + obState.quantity + " \u00d7 " + currentProduct.name + " (" + obState.selectedSize + ", " +
          fabricName + detailText + ") to your basket \u2014 " +
          obMoney(unitPrice * obState.quantity) + ".";
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var key = currentProduct.slug;
        var willAdd;

        if (hasWishlistStore()) {
          var snapshot = {
            id: currentProduct.slug,
            slug: currentProduct.slug,
            name: currentProduct.name,
            url: "ottoman-beds.html#/" + currentProduct.slug,
            image: (currentProduct.images && currentProduct.images[0]) || "",
            alt: currentProduct.name,
            price: obMoney(currentPrice(currentProduct)),
            previousPrice: currentProduct.oldPrice ? obMoney(currentProduct.oldPrice) : "",
            monthly: currentProduct.monthlyPrice ? ("or from \u00A3" + currentProduct.monthlyPrice + "/mo") : "",
            badge: currentProduct.badge || "",
            stars: obStars(currentProduct.rating || 0),
            reviewCount: currentProduct.reviewCount || "",
            category: "Slatted Ottoman Beds"
          };
          willAdd = window.RabboraWishlist.toggle(snapshot).added;
        } else {
          var isSaved = state.wishlist.has(key);
          if (isSaved) {
            state.wishlist.delete(key);
          } else {
            state.wishlist.add(key);
          }
          willAdd = !isSaved;
        }

        syncWishlistButton(currentProduct);
        updateWishlistCount();

        var gridBtn = document.querySelector('.ob-wishlist-btn[data-slug="' + currentProduct.slug + '"]');
        if (gridBtn) gridBtn.setAttribute("aria-pressed", String(willAdd));
      });
    }
  }

  function sdMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function sdStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  function initStorageDrawersFaq() {
    var items = qsa(".sd-faq-item");
    if (items.length === 0) return;

    items.forEach(function (item) {
      var toggle = qs(".sd-faq-item__toggle", item);
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMainNavReveal();
    initWishlist();
    initCart();
    initDesktopDropdown();
    initSearchCategoryMenu();
    initHeaderSearch();
    initMobileNav();
    initMobileAccordion();
    initFooterYear();
    updateWishlistCount();
    initScrollReveal();
    initMattressHelp();
    initOttomanFilters();
    initOttomanViewToggle();
    initOttomanDetail();
    initStorageDrawersFaq();
  });
})();