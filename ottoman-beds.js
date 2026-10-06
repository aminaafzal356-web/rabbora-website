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
      { threshold: 0.01 }
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
    "name": "Rabbora Manhattan Slatted Ottoman Bed",
    "price": 249.0,
    "oldPrice": 429.0,
    "monthlyPrice": 21,
    "rating": 4,
    "reviewCount": 75,
    "badge": "42% off",
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
    "description": "A refined slatted ottoman bed designed to give your bedroom a sophisticated look while providing comfortable sleeping and practical hidden storage.",
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
      "slatted/img-1.jfif",
    "slatted/img-6.jfif" ,
     "slatted/img-5.jfif" ,
     "slatted/img-4.jfif" ,
     "slatted/img-2.jfif" 
    ]
  },
  {
    "id": 2,
    "slug": "hampton-slatted-ottoman-bed",
    "name": "Rabbora Milan Slatted Wingback Ottoman Bed",
    "price": 259.0,
    "oldPrice": 420.0,
    "monthlyPrice": 22,
    "rating": 4,
    "reviewCount": 147,
    "badge": "38% off",
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
    "description": "A beautifully styled wingback design combining elegant bedroom character, comfortable support and convenient ottoman storage.",
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
  "slatted/img-7.jfif",
    "slatted/img-8.jfif" ,
     "slatted/img-9.jfif" ,
     "slatted/img-10.jfif" ,
     "slatted/img-3.jfif"  
    ]
  },
  {
    "id": 3,
    "slug": "monaco-ottoman-bed",
    "name": "Rabbora Athens Slatted Designer Ottoman Bed",
    "price": 289.0,
    "oldPrice": 400.0,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 58,
    "badge": "28% off",
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
    "description": "A contemporary designer bed created to bring clean styling, relaxing comfort and useful storage together in one elegant bedroom piece.",
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
         "slatted/img-12.jfif" ,
             "slatted/img-15.jfif" ,
                 "slatted/img-13.jfif" ,
                     "slatted/img-11.jfif" ,
                         "slatted/img-14.jfif" 
    ]
  },
  {
    "id": 4,
    "slug": "windsor-slatted-ottoman-bed",
    "name": "Rabbora Empire Slatted Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 172,
    "badge": "31% off",
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
    "description": "A statement bedroom design featuring sophisticated detailing, comfortable sleeping space and practical under-bed storage.",
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
           "slatted/img-17.jfif" ,
           "slatted/img-19.jfif", 
          "slatted/img-.jfif" ,
          "slatted/img-18.jfif" ,
           "slatted/img-12.jfif" ,
             
    ]
  },
  {
    "id": 5,
    "slug": "kensington-slatted-ottoman-bed",
    "name": "Rabbora Art Deco Slatted Ottoman Bed",
    "price": 252.0,
    "oldPrice": 420.0,
    "monthlyPrice": 21,
    "rating": 5,
    "reviewCount": 110,
    "badge": "40% off",
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
    "description": "Inspired by elegant Art Deco styling, this bed brings a luxurious character to the bedroom while offering practical ottoman storage.",
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
           "slatted/img-22.jfif" ,
           "slatted/img-24.jfif", 
          "slatted/img-25.jfif" ,
          "slatted/img-26.jfif" ,
           "slatted/img-23.jfif" ,
    ]
  },
  {
    "id": 6,
    "slug": "mayfair-ottoman-bed",
    "name": "Rabbora Orlando Slatted Ottoman Bed",
    "price": 306.59,
    "oldPrice": 420.0,
    "monthlyPrice": 26,
    "rating": 5,
    "reviewCount": 89,
    "badge": "27% off",
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
    "description": "A stylish and versatile bedroom centrepiece designed to provide everyday comfort together with convenient storage beneath the bed.",
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
       "slatted/img-30.png" ,
           "slatted/img-28.png", 
          "slatted/img-29.png" ,
          "slatted/img-31.png" ,
           "slatted/img-27.png" 
    ]
  },
  {
    "id": 7,
    "slug": "richmond-slatted-ottoman-bed",
    "name": "Rabbora Kendal Slatted Wingback Bed",
    "price": 299.0,
    "oldPrice": 444.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 180,
    "badge": "33% off",
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
    "description": "A graceful wingback silhouette combined with comfortable design and practical storage, ideal for creating an inviting bedroom atmosphere.",
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
       "slatted/img-35.png" ,
        "slatted/img-34.png" ,
         "slatted/img-33.png" ,
         "slatted/img-32.png" ,
           "slatted/img-36.png" ,
    ]
  },
  {
    "id": 8,
    "slug": "cambridge-slatted-ottoman-bed",
    "name": "Rabbora Teddy Orlando Slatted Ottoman Bed",
    "price": 306.59,
    "oldPrice": 420.0,
    "monthlyPrice": 26,
    "rating": 4,
    "reviewCount": 193,
    "badge": "27% off",
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
    "description": "A soft and inviting bedroom design that combines elegant styling, comfortable sleeping and useful hidden storage.",
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
        "slatted/34.png" ,
        "slatted/35.png" ,
        "slatted/36.png" ,
        "slatted/37.png" 
    ]
  },
  {
    "id": 9,
    "slug": "victoria-ottoman-bed",
    "name": "Rabbora Park Lane Ambassador Slatted Bed",
    "price": 449.0,
    "oldPrice": 600.0,
    "monthlyPrice": 38,
    "rating": 4,
    "reviewCount": 185,
    "badge": "25% off",
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
    "description": "A luxurious statement bed designed to add refined character, comfort and an impressive finish to a modern bedroom.",
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
        "slatted/38.png" ,
        "slatted/39.png" ,
        "slatted/img-37.png" ,
        "slatted/img-39.png" 
    ]
  },
  {
    "id": 10,
    "slug": "oxford-slatted-ottoman-bed",
    "name": "Rabbora Brooklyn Slatted Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 85,
    "badge": "29% off",
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
    "description": "A clean and contemporary slatted design offering a stylish bedroom appearance with comfortable sleeping and practical functionality.",
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
         "slatted/40.png" ,
        "slatted/41.png" ,
        "slatted/43.png" ,
        "slatted/42.png" 

    ]
  },
  {
    "id": 11,
    "slug": "chester-slatted-ottoman-bed",
    "name": "Rabbora Washington Slatted Bed",
    "price": 349.0,
    "oldPrice": 599.0,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 46,
    "badge": "42% off",
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
    "description": "A distinctive bedroom design combining elegant upholstery with a sophisticated frame detail for a refined modern appearance.",
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
     "slatted/45.png" ,
        "slatted/47.png" ,
        "slatted/46.png" ,
        "slatted/44.png"
    ]
  },
  {
    "id": 12,
    "slug": "kingston-ottoman-bed",
    "name": "Rabbora Nevada Slatted Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 153,
    "badge": "29% off",
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
    "description": "A contemporary slatted bed designed to bring understated elegance, everyday comfort and practical bedroom storage together.",
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
        "slatted/48.png" ,
        "slatted/50.png" ,
        "slatted/49.png"
    ]
  },
  {
    "id": 13,
    "slug": "manhattan-slatted-ottoman-bed",
    "name": "Rabbora Hawaii Cream Slatted Ottoman Bed",
    "price": 239.0,
    "oldPrice": 420.0,
    "monthlyPrice": 20,
    "rating": 4,
    "reviewCount": 93,
    "badge": "43% off",
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
    "description": "A beautifully soft-looking bedroom centrepiece designed to create a calm and elegant setting with useful ottoman storage.",
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
     "slatted/84.png" ,
        "slatted/85.jfif" ,
        "slatted/86.png"
    ]
  },
  {
    "id": 14,
    "slug": "brighton-slatted-ottoman-bed",
    "name": "Rabbora Ibiza Slatted Upholstered Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 181,
    "badge": "22% off",
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
    "description": "A sophisticated upholstered design with modern detailing, created to provide a stylish bedroom look and comfortable sleeping space.",
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
      "slatted/87.png" ,
        "slatted/88.jfif" ,
        "slatted/89.png"
    ]
  },
  {
    "id": 15,
    "slug": "lancaster-ottoman-bed",
    "name": "Rabbora Tokyo Sunrise Slatted Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 110,
    "badge": "31% off",
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
    "description": "A distinctive designer-inspired bed offering an elegant silhouette, comfortable sleeping area and convenient hidden storage.",
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
       "slatted/90.png" ,
        "slatted/91.jfif" ,
        "slatted/92.jfif"
    ]
  },
  {
    "id": 16,
    "slug": "bristol-slatted-ottoman-bed",
    "name": "Rabbora Malaga Slatted Designer Bed",
    "price": 275.0,
    "oldPrice": 360.0,
    "monthlyPrice": 23,
    "rating": 5,
    "reviewCount": 50,
    "badge": "24% off",
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
    "description": "A graceful designer bed created to add warmth and sophistication to your bedroom while keeping comfort at the centre.",
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
      "slatted/93.png" ,
        "slatted/95.jfif" ,
        "slatted/94.jfif"
    ]
  },
  {
    "id": 17,
    "slug": "soho-slatted-ottoman-bed",
    "name": "Rabbora Madrid Slatted Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 200,
    "badge": "17% off",
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
    "description": "A contemporary lined design that combines modern bedroom styling with comfortable support and practical ottoman storage.",
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
      "slatted/96.jfif" ,
       "slatted/97.jfif" ,
        "slatted/98.jfif" 
    ]
  },
  {
    "id": 18,
    "slug": "belgravia-ottoman-bed",
    "name": "Rabbora Lisbon Slatted Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthlyPrice": 30,
    "rating": 5,
    "reviewCount": 23,
    "badge": "17% off",
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
    "description": "An elegant bedroom design offering a balanced combination of stylish detailing, comfortable sleeping and useful storage.",
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
     "slatted/99.jfif" ,
       "slatted/101.png" ,
        "slatted/100.png" 
    ]
  },
  {
    "id": 19,
    "slug": "fulham-slatted-ottoman-bed",
    "name": "Rabbora Rome Slatted Wingback Bed",
    "price": 389.0,
    "oldPrice": 478.8,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 36,
    "badge": "19% off",
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
    "description": "A sophisticated wingback design that creates an elegant focal point while offering a comfortable and welcoming place to rest.",
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
     "slatted/102.png" ,
       "slatted/103.png" ,
        "slatted/104.png"
    ]
  },
  {
    "id": 20,
    "slug": "chiswick-slatted-ottoman-bed",
    "name": "Rabbora Mona Lisa Slatted Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 165,
    "badge": "29% off",
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
    "description": "A graceful and elegant bed designed to add a refined presence to the bedroom with the practicality of hidden storage.",
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
      "slatted/105.jfif",
      "slatted/106.jfif",
      "slatted/107.jfif"
    ]
  },
  {
    "id": 21,
    "slug": "greenwich-ottoman-bed",
    "name": "Rabbora Barcelona Slatted Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthlyPrice": 30,
    "rating": 5,
    "reviewCount": 123,
    "badge": "17% off",
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
    "description": "A modern lined bed design created to bring clean sophistication, comfort and versatile bedroom styling into your home.",
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
      "slatted/108.jfif",
      "slatted/109.jfif",
      "slatted/110.jfif"
    ]
  },
  {
    "id": 22,
    "slug": "camden-slatted-ottoman-bed",
    "name": "Rabbora Florence Slatted Designer Bed",
    "price": 399.0,
    "oldPrice": 478.8,
    "monthlyPrice": 34,
    "rating": 4,
    "reviewCount": 67,
    "badge": "17% off",
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
    "description": "A beautifully proportioned designer bed offering timeless bedroom appeal, comfortable support and a refined finish.",
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
       "slatted/111.png",
      "slatted/112.jfif",
      "slatted/113.jfif"
    ]
  },
  {
    "id": 23,
    "slug": "notting-hill-slatted-ottoman-bed",
    "name": "Rabbora Duke Slatted Luxury Wide Headboard Bed",
    "price": 799.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 67,
    "rating": 4,
    "reviewCount": 131,
    "badge": "20% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A grand bedroom statement featuring a wide headboard design that brings a luxurious hotel-inspired atmosphere to your space.",
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
    "slatted/114.png",
    "slatted/116.png",
    "slatted/115.png"
    ]
  },
  {
    "id": 24,
    "slug": "marylebone-ottoman-bed",
    "name": "Rabbora Golden Crown Slatted Ottoman Bed",
    "price": 349.0,
    "oldPrice": 549.0,
    "monthlyPrice": 30,
    "rating": 5,
    "reviewCount": 72,
    "badge": "36% off",
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
    "description": "An elegant statement bed designed to bring a luxurious touch to the bedroom while providing practical hidden storage.",
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
      "slatted/118.png",
    "slatted/117.png",
    "slatted/119.png"
    ]
  },
  {
    "id": 25,
    "slug": "highgate-slatted-ottoman-bed",
    "name": "Rabbora Avon Slatted Triple Panel Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthlyPrice": 30,
    "rating": 5,
    "reviewCount": 126,
    "badge": "17% off",
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
    "description": "A stylish triple-panel design created to add structure and character to your bedroom while providing comfortable everyday use.",
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
       "slatted/51.png",
    "slatted/52.png",
    "slatted/53.png"
    ]
  },
  {
    "id": 26,
    "slug": "hampstead-slatted-ottoman-bed",
    "name": "Rabbora Duchess Slatted La Rosa Bed",
    "price": 299.0,
    "oldPrice": 414.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 206,
    "badge": "28% off",
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
    "description": "A graceful and sophisticated bedroom design offering elegant styling, comfortable support and a timeless decorative presence.",
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
    "slatted/54.png",
    "slatted/56.png",
    "slatted/55.png"
    ]
  },
  {
    "id": 27,
    "slug": "clapham-ottoman-bed",
    "name": "Rabbora Osaka Slatted Upholstered Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthlyPrice": 33,
    "rating": 4,
    "reviewCount": 65,
    "badge": "22% off",
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
    "description": "A modern upholstered design with distinctive detailing, created for stylish bedrooms and comfortable everyday relaxation.",
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
         "slatted/57.png",
    "slatted/58.png",
    "slatted/59.png"
    ]
  },
  {
    "id": 28,
    "slug": "islington-slatted-ottoman-bed",
    "name": "Rabbora Jersey Slatted Ottoman Bed",
    "price": 249.0,
    "oldPrice": 420.0,
    "monthlyPrice": 21,
    "rating": 5,
    "reviewCount": 38,
    "badge": "41% off",
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
    "description": "A versatile bedroom centrepiece combining comfortable sleeping with practical hidden storage and an elegant contemporary appearance.",
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
      "slatted/120.png",
    "slatted/60.png",
    "slatted/61.png"
    ]
  },
  {
    "id": 29,
    "slug": "shoreditch-slatted-ottoman-bed",
    "name": "Rabbora Victoria Slatted Designer Bed",
    "price": 299.0,
    "oldPrice": 360.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 135,
    "badge": "17% off",
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
    "description": "A refined lined design that brings elegant proportions, comfortable support and sophisticated bedroom character together.",
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
       "slatted/62.png",
    "slatted/64.png",
    "slatted/63.png"
    ]
  },
  {
    "id": 30,
    "slug": "southbank-ottoman-bed",
    "name": "Rabbora Thames Slatted Wingback Bed",
    "price": 319.0,
    "oldPrice": 420.0,
    "monthlyPrice": 27,
    "rating": 4,
    "reviewCount": 107,
    "badge": "24% off",
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
    "description": "A striking wingback-inspired design created to provide a luxurious bedroom presence with comfortable everyday support.",
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
       "slatted/65.png",
    "slatted/67.png",
    "slatted/66.png"
    ]
  },
  {
    "id": 31,
    "slug": "kew-slatted-ottoman-bed",
    "name": "Rabbora Cloud Slatted Boucle Bed",
    "price": 789.0,
    "oldPrice": 1399.0,
    "monthlyPrice": 66,
    "rating": 5,
    "reviewCount": 20,
    "badge": "44% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A soft and luxurious bedroom design with a welcoming appearance, created to bring comfort and modern elegance to your space.",
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
      "slatted/68.png",
    "slatted/70.png",
    "slatted/69.png"
    ]
  },
  {
    "id": 32,
    "slug": "putney-slatted-ottoman-bed",
    "name": "Rabbora Las Vegas Slatted Luxury High Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 63,
    "rating": 5,
    "reviewCount": 57,
    "badge": "25% off",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A dramatic high-headboard design inspired by luxury hotel interiors, creating an impressive focal point for the bedroom.",
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
      "slatted/71.png",
      "slatted/74.png",
      "slatted/73.png",
    "slatted/72.png"
    
   

    ]
  },
  {
    "id": 33,
    "slug": "wimbledon-ottoman-bed",
    "name": "Rabbora Paris Slatted Linear Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 41,
    "badge": "17% off",
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
    "description": "A clean linear design offering contemporary elegance, comfortable sleeping and a sophisticated foundation for modern bedrooms.",
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
       "slatted/75.png",
      "slatted/77.png",
      "slatted/76.png"
    
    ]
  },
  {
    "id": 34,
    "slug": "dulwich-slatted-ottoman-bed",
    "name": "Rabbora Skyscraper Slatted Art Deco Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 207,
    "badge": "29% off",
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
    "description": "A distinctive Art Deco-inspired design created to give the bedroom a bold architectural feel with elegant styling.",
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
     "slatted/78.png",
      "slatted/121.png",
      "slatted/79.png"
    ]
  },
  {
    "id": 35,
    "slug": "ealing-slatted-ottoman-bed",
    "name": "Rabbora Torino Slatted Designer Bed",
    "price": 290.0,
    "oldPrice": 396.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 159,
    "badge": "27% off",
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
    "description": "A beautifully structured bedroom design offering a refined appearance, comfortable sleeping space and versatile styling.",
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
    "slatted/80.png",
      "slatted/122.png",
      "slatted/81.png"
    ]
  },
  {
    "id": 36,
    "slug": "harrow-ottoman-bed",
    "name": "Rabbora Sheffield Slatted Studded Bed",
    "price": 349.0,
    "oldPrice": 456.0,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 108,
    "badge": "23% off",
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
    "description": "A sophisticated studded design that adds elegant detailing and character while maintaining a comfortable bedroom atmosphere.",
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
       "slatted/82.png",
      "slatted/123.png",
      "slatted/83.png"
    ]
  },
  {
    "id": 37,
    "slug": "barnet-slatted-ottoman-bed",
    "name": "Rabbora Cannes Slatted Ottoman Bed",
    "price": 399.0,
    "oldPrice": 499.0,
    "monthlyPrice": 34,
    "rating": 5,
    "reviewCount": 24,
    "badge": "20% off",
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
    "description": "A stylish bedroom centrepiece designed to combine elegant detailing, comfortable support and practical storage.",
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
      "slatted/82.jfif",
      "slatted/123.jfif",
      "slatted/83.jfif"
    ]
  },
  {
    "id": 38,
    "slug": "farringdon-slatted-ottoman-bed",
    "name": "Rabbora Teddy Zen Slatted Boucle Ottoman Bed",
    "price": 599.0,
    "oldPrice": 1399.0,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 48,
    "badge": "57% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A calm and luxurious bedroom design combining a soft boucle-inspired appearance with comfortable sleeping and useful storage.",
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
      "slatted/198.png",
    "slatted/199.jfif",
    "slatted/200.png"
    ]
  },
  {
    "id": 39,
    "slug": "barbican-slatted-ottoman-bed",
    "name": "Rabbora Venice Slatted Linear Ottoman Bed",
    "price": 314.99,
    "oldPrice": 372.0,
    "monthlyPrice": 27,
    "rating": 4,
    "reviewCount": 125,
    "badge": "15% off",
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
    "description": "A contemporary linear design offering a clean bedroom appearance, comfortable sleeping and convenient hidden storage.",
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
     "slatted/195.png",
    "slatted/196.jfif",
    "slatted/197.jfif"
    ]
  },
  {
    "id": 40,
    "slug": "angel-ottoman-bed",
    "name": "Rabbora Geneva Slatted High & Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 63,
    "rating": 5,
    "reviewCount": 175,
    "badge": "25% off",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A luxurious wide-headboard design created to make a dramatic bedroom statement while offering a comfortable and refined sleeping space.",
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
       "slatted/192.jfif",
    "slatted/193.jfif",
    "slatted/194.jfif"
    ]
  },
  {
    "id": 41,
    "slug": "finsbury-slatted-ottoman-bed",
    "name": "Rabbora Zurich Slatted Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 89,
    "badge": "29% off",
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
    "description": "A sophisticated and practical bedroom design combining elegant styling, comfortable support and convenient under-bed storage.",
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
        "slatted/189.jfif",
    "slatted/190.jfif",
    "slatted/191.jfif"
    ]
  },
  {
    "id": 42,
    "slug": "whitechapel-slatted-ottoman-bed",
    "name": "Rabbora Arizona Slatted Ottoman Bed",
    "price": 289.0,
    "oldPrice": null,
    "monthlyPrice": 25,
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
    "description": "A versatile bedroom design created to provide comfortable sleeping with a clean and stylish appearance and useful storage.",
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
      "slatted/186.jfif",
    "slatted/187.jfif",
    "slatted/188.png"
    ]
  },
  {
    "id": 43,
    "slug": "aldgate-ottoman-bed",
    "name": "Rabbora Golden Ibiza Slatted Linear Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthlyPrice": 33,
    "rating": 4,
    "reviewCount": 79,
    "badge": "22% off",
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
    "description": "A luxurious linear design with distinctive detailing, created to add elegance and a premium finish to the bedroom.",
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
     "slatted/183.jfif",
    "slatted/184.jfif",
    "slatted/185.png"
    ]
  },
  {
    "id": 44,
    "slug": "stratford-slatted-ottoman-bed",
    "name": "Rabbora Sheffield Slatted Upholstered Bed",
    "price": 295.0,
    "oldPrice": 456.0,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 93,
    "badge": "35% off",
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
    "description": "A refined upholstered bedroom design offering comfortable support, elegant styling and versatile appeal.",
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
   "slatted/180.png",
    "slatted/181.jfif",
    "slatted/182.jfif"
    ]
  },
  {
    "id": 45,
    "slug": "hackney-wick-slatted-ottoman-bed",
    "name": "Rabbora Yukon Slatted Wing Bed",
    "price": 294.0,
    "oldPrice": 420.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 208,
    "badge": "30% off",
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
    "description": "A stylish winged design created to give the bedroom a sophisticated appearance while providing comfortable everyday support.",
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
     "slatted/177.jfif",
    "slatted/178.jfif",
    "slatted/179.jfif"
    ]
  },
  {
    "id": 46,
    "slug": "bow-ottoman-bed",
    "name": "Rabbora Presidential Slatted Ottoman Bed",
    "price": 749.0,
    "oldPrice": 1052.0,
    "monthlyPrice": 63,
    "rating": 5,
    "reviewCount": 48,
    "badge": "29% off",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A grand bedroom design offering an impressive presence, comfortable sleeping space and practical hidden storage.",
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
      "slatted/174.png",
    "slatted/175.png",
    "slatted/176.jfif"
    ]
  },
  {
    "id": 47,
    "slug": "poplar-slatted-ottoman-bed",
    "name": "Rabbora Montana Ambassador Slatted Bed",
    "price": 599.0,
    "oldPrice": 800.0,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 170,
    "badge": "25% off",
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
    "description": "A luxurious ambassador-inspired design created to bring a premium and sophisticated atmosphere into the bedroom.",
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
      "slatted/171.jfif",
    "slatted/172.png",
    "slatted/173.jfif"
    ]
  },
  {
    "id": 48,
    "slug": "limehouse-slatted-ottoman-bed",
    "name": "Rabbora Amalfi Slatted Italian Style Ottoman Bed",
    "price": 299.0,
    "oldPrice": 599.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 29,
    "badge": "50% off",
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
    "description": "An elegant Italian-inspired design combining sophisticated bedroom styling, comfortable sleeping and practical storage.",
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
    "slatted/168.jfif",
    "slatted/169.png",
    "slatted/170.jfif"
    ]
  },
  {
    "id": 49,
    "slug": "rotherhithe-ottoman-bed",
    "name": "Rabbora Teddy Wave Slatted Ottoman Bed",
    "price": 449.0,
    "oldPrice": 520.0,
    "monthlyPrice": 38,
    "rating": 5,
    "reviewCount": 105,
    "badge": "14% off",
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
    "description": "A soft and contemporary wave-inspired design created to bring comfort, character and modern elegance to the bedroom.",
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
      "slatted/165.jfif",
    "slatted/166.jfif",
    "slatted/167.png"
    ]
  },
  {
    "id": 50,
    "slug": "deptford-slatted-ottoman-bed",
    "name": "Rabbora Black Plush Golden Pyramid Slatted Ottoman Bed",
    "price": 539.0,
    "oldPrice": 649.0,
    "monthlyPrice": 45,
    "rating": 4,
    "reviewCount": 56,
    "badge": "17% off",
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
    "description": "A bold luxury design combining dramatic styling with comfortable sleeping and practical ottoman storage.",
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
      "slatted/160.jfif",
    "slatted/161.jfif",
    "slatted/162.jfif"
    ]
  },
  {
    "id": 51,
    "slug": "new-cross-slatted-ottoman-bed",
    "name": "Rabbora Bahamas Slatted Luxury Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 63,
    "rating": 5,
    "reviewCount": 131,
    "badge": "25% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A grand hotel-inspired bedroom centrepiece featuring a wide headboard design for an impressive and luxurious appearance.",
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
     "slatted/157.jfif",
    "slatted/158.jfif",
    "slatted/159.png"
    ]
  },
  {
    "id": 52,
    "slug": "catford-ottoman-bed",
    "name": "Rabbora Riviera Slatted High Headboard Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 187,
    "badge": "39% off",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A sophisticated high-headboard design created to add a luxurious focal point and elegant character to your bedroom.",
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
     "slatted/154.jfif",
    "slatted/155.jfif",
    "slatted/156.jfif"
    ]
  },
  {
    "id": 53,
    "slug": "sydenham-slatted-ottoman-bed",
    "name": "Rabbora New York Slatted Tall Headboard Bed",
    "price": 799.0,
    "oldPrice": 900.0,
    "monthlyPrice": 67,
    "rating": 5,
    "reviewCount": 92,
    "badge": "11% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A bold tall-headboard design bringing contemporary luxury and a striking architectural presence to the bedroom.",
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
    "slatted/153.png",
    "slatted/152.png",
    "slatted/151.png"
    ]
  },
  {
    "id": 54,
    "slug": "crystal-palace-slatted-ottoman-bed",
    "name": "Rabbora Grand Slatted Luxury Upholstered Bed",
    "price": 1199.0,
    "oldPrice": 1499.0,
    "monthlyPrice": 100,
    "rating": 5,
    "reviewCount": 187,
    "badge": "20% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A truly impressive bedroom centrepiece designed with a luxurious appearance, sophisticated detailing and comfortable sleeping space.",
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
     "slatted/148.jfif",
    "slatted/149.png",
    "slatted/150.jfif"
    ]
  },
  {
    "id": 55,
    "slug": "norwood-ottoman-bed",
    "name": "Rabbora Silver Fern Slatted High Headboard Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 209,
    "badge": "39% off",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "An elegant high-headboard design created to bring a refined and luxurious atmosphere to contemporary bedrooms.",
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
       "slatted/147.png",
    "slatted/145.png",
    "slatted/146.jfif"
    ]
  },
  {
    "id": 56,
    "slug": "streatham-slatted-ottoman-bed",
    "name": "Rabbora Marble Bahamas Slatted Luxury Bed",
    "price": 799.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 67,
    "rating": 5,
    "reviewCount": 38,
    "badge": "20% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A grand hotel-style design combining a wide statement profile with sophisticated styling and a luxurious bedroom presence.",
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
     "slatted/142.jfif",
    "slatted/143.jfif",
    "slatted/144.jfif"
    ]
  },
  {
    "id": 57,
    "slug": "balham-slatted-ottoman-bed",
    "name": "Rabbora Duke of Orlando Slatted Wide Headboard Bed",
    "price": 799.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 67,
    "rating": 5,
    "reviewCount": 165,
    "badge": "20% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A bold wide-headboard design created to become the focal point of a luxury bedroom while providing comfortable everyday use.",
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
    "slatted/140.jfif",
    "slatted/139.png",
    "slatted/141.jfif"
    ]
  }, 
  {
    "id": 58,
    "slug": "tooting-ottoman-bed",
    "name": "Rabbora Ascot Slatted Tall Headboard Bed",
    "price": 799.0,
    "oldPrice": 900.0,
    "monthlyPrice": 67,
    "rating": 5,
    "reviewCount": 41,
    "badge": "11% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A sophisticated tall-headboard design offering an elegant bedroom statement with comfortable sleeping and premium styling.",
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
      "slatted/136.jfif",
    "slatted/137.jfif",
    "slatted/138.jfif"
    ]
  },
  {
    "id": 59,
    "slug": "earlsfield-slatted-ottoman-bed",
    "name": "Rabbora Teddy Duke Slatted Wide Headboard Bed",
    "price": 849.0,
    "oldPrice": 1000.0,
    "monthlyPrice": 71,
    "rating": 5,
    "reviewCount": 187,
    "badge": "15% off",
    "availableSizeLabels": [
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "description": "A luxurious wide-headboard design combining soft contemporary character with an impressive and comfortable bedroom setting.",
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
     "slatted/133.png",
    "slatted/135.jfif",
    "slatted/134.jfif"
    ]
  },
  {
    "id": 60,
    "slug": "raynes-park-slatted-ottoman-bed",
    "name": "Rabbora Astoria Slatted Deco Ottoman Bed",
    "price": 299.0,
    "oldPrice": 599.0,
    "monthlyPrice": 25,
    "rating": 5,
    "reviewCount": 18,
    "badge": "50% off",
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
    "description": "A refined Deco-inspired ottoman design created to add elegant character, comfortable sleeping and practical hidden storage.",
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
    "slatted/129.png",
    "slatted/131.jfif",
    "slatted/132.jfif"
    ]
  },
];

  // Price of each size, per bed (site owner's price list, 26 Sep 2026).
  // Sizes not in a bed's list are not offered for that bed. Beds not in
  // this table (Cannes) keep the size differences below.
  const SLATTED_OTTOMAN_SIZE_PRICES = {
    "chelsea-slatted-ottoman-bed": { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 } /* 2026 Manhattan Bed Frame with Lines ® */,
    "hampton-slatted-ottoman-bed": { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 } /* 2026 Milan Wingback Bed® with Optional Ottoman Storage */,
    "monaco-ottoman-bed": { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 } /* 2026 Athens Linear Designer Bed® */,
    "windsor-slatted-ottoman-bed": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } /* 2026 Empire Bed Frame with Optional Ottoman Storage */,
    "kensington-slatted-ottoman-bed": { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 } /* The 2026 Art Deco Bed Style */,
    "mayfair-ottoman-bed": { "Single": 306.59, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 } /* 2026 Orlando Bed frame (Optional Ottoman Storage) */,
    "richmond-slatted-ottoman-bed": { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 } /* 2026 Kendal Butterfly Wingback Bed */,
    "cambridge-slatted-ottoman-bed": { "Single": 306.59, "Small Double": 439, "Double": 489, "King": 509, "Super King": 559 } /* 2026 Teddy-Orlando Bed frame (Optional Ottoman Storage) */,
    "victoria-ottoman-bed": { "Single": 449, "Small Double": 589, "Double": 599, "King": 649, "Super King": 699 } /* 2026 Park lane Ambassador Luxury Bed ® */,
    "oxford-slatted-ottoman-bed": { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 } /* 2026 Brooklyn Bed Frame with Lines */,
    "chester-slatted-ottoman-bed": { "Single": 349, "Small Double": 449, "Double": 459, "King": 519, "Super King": 569 } /* 2026 Washington Black Wooden Frame with Black Fabric Covering Edges */,
    "kingston-ottoman-bed": { "Single": 299, "Small Double": 409, "Double": 429, "King": 459, "Super King": 499 } /* 2026 Nevada Bed Frame with Lines */,
    "manhattan-slatted-ottoman-bed": { "Single": 239, "Small Double": 379, "Double": 399, "King": 449, "Super King": 499 } /* 2026 Hawaii Cream Bouclé bed with optional ottoman storage */,
    "brighton-slatted-ottoman-bed": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* 2026 Ibiza Linear Upholstered Bed with Black Lining */,
    "lancaster-ottoman-bed": { "Single": 289, "Small Double": 409, "Double": 425, "King": 459, "Super King": 485 } /* 2026 Tokyo Sunrise Designer Bed® – With Optional Ottoman Storage */,
    "bristol-slatted-ottoman-bed": { "Single": 275, "Small Double": 339, "Double": 349, "King": 399, "Super King": 419 } /* 2026 Málaga Upholstery Designer Bed */,
    "soho-slatted-ottoman-bed": { "Single": 349, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 } /* 2026 Madrid Bed frame with Lines (Optional Ottoman Storage) */,
    "belgravia-ottoman-bed": { "Single": 349, "Small Double": 399, "Double": 449, "King": 489, "Super King": 549 } /* 2026 Lisbon Bed Frame with Optional Ottoman Storage */,
    "fulham-slatted-ottoman-bed": { "Single": 389, "Small Double": 449, "Double": 489, "King": 549, "Super King": 609 } /* 2026 Rome Luxury Wingback Bed */,
    "chiswick-slatted-ottoman-bed": { "Single": 299, "Small Double": 399, "Double": 419, "King": 449, "Super King": 499 } /* 2026 Mona Lisa bed with optional ottoman storage */,
    "greenwich-ottoman-bed": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* 2026 Barcelona Bed Frame with Lines */,
    "camden-slatted-ottoman-bed": { "Single": 399, "Small Double": 479, "Double": 499, "King": 579, "Super King": 609 } /* 2026 Florence Design Bed Frame */,
    "notting-hill-slatted-ottoman-bed": { "Double": 799, "King": 849, "Super King": 899 } /* 2026 DUKE OF PSCL LUXURY HOTEL STYLE WIDE 3 PIECE HEADBOARD BED */,
    "marylebone-ottoman-bed": { "Single": 349, "Small Double": 489, "Double": 499, "King": 549, "Super King": 589 } /* 2026 Golden Crown Bed with Optional Ottoman Storage */,
    "highgate-slatted-ottoman-bed": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* 2026 Avon Triple Panel Bed */,
    "hampstead-slatted-ottoman-bed": { "Single": 299, "Small Double": 349, "Double": 389, "King": 419, "Super King": 499 } /* Duchess of La Rosa Bed (2026 Collection) */,
    "clapham-ottoman-bed": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* 2026 Osaka Linear Upholstered Bed with Black Lining */,
    "islington-slatted-ottoman-bed": { "Single": 249, "Small Double": 339, "Double": 389, "King": 429, "Super King": 449 } /* 2026 Jersey bed with optional ottoman storage */,
    "shoreditch-slatted-ottoman-bed": { "Single": 299, "Small Double": 399, "Double": 409, "King": 449, "Super King": 469 } /* 2026 Victoria V Lined Designer Bed */,
    "southbank-ottoman-bed": { "Single": 319, "Small Double": 379, "Double": 409, "King": 449, "Super King": 499 } /* 2026 Thames Triple Wingback Bed */,
    "kew-slatted-ottoman-bed": { "Double": 789, "King": 849, "Super King": 899 } /* 2026 Cloud of Boucle Cream bed frame */,
    "putney-slatted-ottoman-bed": { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 } /* 2026 Las Vegas Luxury High Headboard Bed Frame (2-Piece Headboard) */,
    "wimbledon-ottoman-bed": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* 2026 Paris Linear Bed Frame */,
    "dulwich-slatted-ottoman-bed": { "Single": 299, "Small Double": 439, "Double": 465, "King": 499, "Super King": 529 } /* 2026 New Skyscraper Art Deco Bed */,
    "ealing-slatted-ottoman-bed": { "Single": 290, "Small Double": 399, "Double": 399, "King": 449, "Super King": 499 } /* 2026 Torino Bumper Style Designer Bed */,
    "harrow-ottoman-bed": { "Single": 349, "Small Double": 399, "Double": 429, "King": 499, "Super King": 549 } /* 2026 Sheffield Bed With Studs */,
    "farringdon-slatted-ottoman-bed": { "Double": 599, "King": 699, "Super King": 719 } /* 2026 Teddy Zen (Teddy Boucle Cream) Bed frame with optional ottoman storage */,
    "barbican-slatted-ottoman-bed": { "Single": 319, "Small Double": 314.99, "Double": 399, "King": 429, "Super King": 469 } /* 2026 Venice Linear Bed with optional ottoman storage */,
    "angel-ottoman-bed": { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 } /* 2026 Geneva High & Wide Headboard Bed Frame (2-Piece Headboard) */,
    "finsbury-slatted-ottoman-bed": { "Single": 299, "Small Double": 399, "Double": 409, "King": 449, "Super King": 499 } /* 2026 Zurich Bed with Optional Ottoman Storage */,
    "whitechapel-slatted-ottoman-bed": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } /* 2026 PSCL Arizona Bed Frame with optional ottoman storage */,
    "aldgate-ottoman-bed": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* 2026 Golden Ibiza Linear Bed with Gold Fabric Lining */,
    "stratford-slatted-ottoman-bed": { "Single": 295, "Small Double": 399, "Double": 429, "King": 489, "Super King": 529 } /* 2026 Sheffield Upholstery Bed */,
    "hackney-wick-slatted-ottoman-bed": { "Single": 294, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* 2026 Yukon Bed Frame with Wings */,
    "bow-ottoman-bed": { "Small Double": 749, "Double": 779, "King": 819, "Super King": 899 } /* 2026 Presidential Bed Frame with Optional Ottoman Storage */,
    "poplar-slatted-ottoman-bed": { "Single": 599, "Small Double": 699, "Double": 749, "King": 799, "Super King": 899 } /* 2026 MONTANA AMBASSADOR DESIGN */,
    "limehouse-slatted-ottoman-bed": { "Single": 299, "Small Double": 429, "Double": 459, "King": 499, "Super King": 529 } /* 2026 PSCL Amalfi Italian Style Bed with Optional Ottoman Storage */,
    "rotherhithe-ottoman-bed": { "Single": 449, "Small Double": 519, "Double": 539, "King": 599, "Super King": 649 } /* 2026 Teddy-Wave Cream Bed Frame with Optional Ottoman Storage */,
    "deptford-slatted-ottoman-bed": { "Single": 539, "Small Double": 649, "Double": 699, "King": 799, "Super King": 899 } /* Black Plush Golden Pyramid Bed with Optional Ottoman Storage */,
    "new-cross-slatted-ottoman-bed": { "Double": 749, "King": 799, "Super King": 849 } /* 2026 THE BAHAMAS LUXURY HOTEL STYLE WIDE 2 PIECE HEADBOARD BED */,
    "catford-ottoman-bed": { "Small Double": 549, "Double": 599, "King": 659, "Super King": 699 } /* 2026 Riviera High Headboard Bed Frame (2-Piece Headboard) */,
    "sydenham-slatted-ottoman-bed": { "Double": 799, "King": 849, "Super King": 899 } /* 2026 New York Tall headboard Bed Frame (2/3 Piece Headboard) */,
    "crystal-palace-slatted-ottoman-bed": { "Double": 1199, "King": 1349, "Super King": 1699 } /* 2026 The Grand Bed Frame – Luxury Upholstered (With metal lining) */,
    "norwood-ottoman-bed": { "Small Double": 549, "Double": 599, "King": 659, "Super King": 699 } /* 2026 Silver Fern Bed with High Headboard (2-Piece Headboard) */,
    "streatham-slatted-ottoman-bed": { "Double": 799, "King": 849, "Super King": 899 } /* 2026 Marble Bahamas PSCL Luxury Hotel Style Wide Bed, Marble Fabric */,
    "balham-slatted-ottoman-bed": { "Double": 799, "King": 849, "Super King": 899 } /* 2026 Duke of Orlando wide headboard bed frame */,
    "tooting-ottoman-bed": { "Double": 799, "King": 849, "Super King": 899 } /* 2026 PSCL Ascot – Tall headboard Bed Frame (2 Piece Headboard) */,
    "earlsfield-slatted-ottoman-bed": { "Double": 849, "King": 899, "Super King": 949 } /* 2026 Teddy-Duke Wide Headboard Luxury Bed Frame (3-Piece Headboard) */,
    "raynes-park-slatted-ottoman-bed": { "Single": 299, "Small Double": 419, "Double": 449, "King": 499, "Super King": 509 } /* 2026 Astoria Deco Bed with Optional Ottoman Storage */
  };

  // Old (original / "was") price for each size, same layout as
  // SLATTED_OTTOMAN_SIZE_PRICES above. Single 3ft keeps its existing old
  // price. The other sizes are worked out from their existing sale price:
  //   Small Double 21% off -> old = sale / 0.79
  //   Double       28% off -> old = sale / 0.72
  //   King         29% off -> old = sale / 0.71
  //   Super King   29% off -> old = sale / 0.71
  // Any number here can be changed in VS Code; a size left out (or null)
  // shows no old price.
  const SLATTED_OTTOMAN_SIZE_OLD_PRICES = {
    "chelsea-slatted-ottoman-bed": { "Single": 429, "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 } /* 2026 Manhattan Bed Frame with Lines ® */,
    "hampton-slatted-ottoman-bed": { "Single": 420, "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 } /* 2026 Milan Wingback Bed® with Optional Ottoman Storage */,
    "monaco-ottoman-bed": { "Single": 400, "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 } /* 2026 Athens Linear Designer Bed® */,
    "windsor-slatted-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 } /* 2026 Empire Bed Frame with Optional Ottoman Storage */,
    "kensington-slatted-ottoman-bed": { "Single": 420, "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 } /* The 2026 Art Deco Bed Style */,
    "mayfair-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 } /* 2026 Orlando Bed frame (Optional Ottoman Storage) */,
    "richmond-slatted-ottoman-bed": { "Single": 444, "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 } /* 2026 Kendal Butterfly Wingback Bed */,
    "cambridge-slatted-ottoman-bed": { "Single": 420, "Small Double": 555.7, "Double": 679.17, "King": 716.9, "Super King": 787.32 } /* 2026 Teddy-Orlando Bed frame (Optional Ottoman Storage) */,
    "victoria-ottoman-bed": { "Single": 600, "Small Double": 745.57, "Double": 831.94, "King": 914.08, "Super King": 984.51 } /* 2026 Park lane Ambassador Luxury Bed ® */,
    "oxford-slatted-ottoman-bed": { "Single": 420, "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 } /* 2026 Brooklyn Bed Frame with Lines */,
    "chester-slatted-ottoman-bed": { "Single": 599, "Small Double": 568.35, "Double": 637.5, "King": 730.99, "Super King": 801.41 } /* 2026 Washington Black Wooden Frame with Black Fabric Covering Edges */,
    "kingston-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 595.83, "King": 646.48, "Super King": 702.82 } /* 2026 Nevada Bed Frame with Lines */,
    "manhattan-slatted-ottoman-bed": { "Single": 420, "Small Double": 479.75, "Double": 554.17, "King": 632.39, "Super King": 702.82 } /* 2026 Hawaii Cream Bouclé bed with optional ottoman storage */,
    "brighton-slatted-ottoman-bed": { "Single": 499, "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* 2026 Ibiza Linear Upholstered Bed with Black Lining */,
    "lancaster-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 590.28, "King": 646.48, "Super King": 683.1 } /* 2026 Tokyo Sunrise Designer Bed® – With Optional Ottoman Storage */,
    "bristol-slatted-ottoman-bed": { "Single": 360, "Small Double": 429.11, "Double": 484.72, "King": 561.97, "Super King": 590.14 } /* 2026 Málaga Upholstery Designer Bed */,
    "soho-slatted-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 } /* 2026 Madrid Bed frame with Lines (Optional Ottoman Storage) */,
    "belgravia-ottoman-bed": { "Single": 420, "Small Double": 505.06, "Double": 623.61, "King": 688.73, "Super King": 773.24 } /* 2026 Lisbon Bed Frame with Optional Ottoman Storage */,
    "fulham-slatted-ottoman-bed": { "Single": 478.8, "Small Double": 568.35, "Double": 679.17, "King": 773.24, "Super King": 857.75 } /* 2026 Rome Luxury Wingback Bed */,
    "chiswick-slatted-ottoman-bed": { "Single": 420, "Small Double": 505.06, "Double": 581.94, "King": 632.39, "Super King": 702.82 } /* 2026 Mona Lisa bed with optional ottoman storage */,
    "greenwich-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* 2026 Barcelona Bed Frame with Lines */,
    "camden-slatted-ottoman-bed": { "Single": 478.8, "Small Double": 606.33, "Double": 693.06, "King": 815.49, "Super King": 857.75 } /* 2026 Florence Design Bed Frame */,
    "notting-hill-slatted-ottoman-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 DUKE OF PSCL LUXURY HOTEL STYLE WIDE 3 PIECE HEADBOARD BED */,
    "marylebone-ottoman-bed": { "Single": 549, "Small Double": 618.99, "Double": 693.06, "King": 773.24, "Super King": 829.58 } /* 2026 Golden Crown Bed with Optional Ottoman Storage */,
    "highgate-slatted-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* 2026 Avon Triple Panel Bed */,
    "hampstead-slatted-ottoman-bed": { "Single": 414, "Small Double": 441.77, "Double": 540.28, "King": 590.14, "Super King": 702.82 } /* Duchess of La Rosa Bed (2026 Collection) */,
    "clapham-ottoman-bed": { "Single": 499, "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* 2026 Osaka Linear Upholstered Bed with Black Lining */,
    "islington-slatted-ottoman-bed": { "Single": 420, "Small Double": 429.11, "Double": 540.28, "King": 604.23, "Super King": 632.39 } /* 2026 Jersey bed with optional ottoman storage */,
    "shoreditch-slatted-ottoman-bed": { "Single": 360, "Small Double": 505.06, "Double": 568.06, "King": 632.39, "Super King": 660.56 } /* 2026 Victoria V Lined Designer Bed */,
    "southbank-ottoman-bed": { "Single": 420, "Small Double": 479.75, "Double": 568.06, "King": 632.39, "Super King": 702.82 } /* 2026 Thames Triple Wingback Bed */,
    "kew-slatted-ottoman-bed": { "Double": 1095.83, "King": 1195.77, "Super King": 1266.2 } /* 2026 Cloud of Boucle Cream bed frame */,
    "putney-slatted-ottoman-bed": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 Las Vegas Luxury High Headboard Bed Frame (2-Piece Headboard) */,
    "wimbledon-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* 2026 Paris Linear Bed Frame */,
    "dulwich-slatted-ottoman-bed": { "Single": 420, "Small Double": 555.7, "Double": 645.83, "King": 702.82, "Super King": 745.07 } /* 2026 New Skyscraper Art Deco Bed */,
    "ealing-slatted-ottoman-bed": { "Single": 396, "Small Double": 505.06, "Double": 554.17, "King": 632.39, "Super King": 702.82 } /* 2026 Torino Bumper Style Designer Bed */,
    "harrow-ottoman-bed": { "Single": 456, "Small Double": 505.06, "Double": 595.83, "King": 702.82, "Super King": 773.24 } /* 2026 Sheffield Bed With Studs */,
    "barnet-slatted-ottoman-bed": { "Single": 399, "Small Double": 441.77, "Double": 554.17, "King": 702.82, "Super King": 829.58 } /* Rabbora Cannes Slatted Ottoman Bed */,
    "farringdon-slatted-ottoman-bed": { "Double": 831.94, "King": 984.51, "Super King": 1012.68 } /* 2026 Teddy Zen (Teddy Boucle Cream) Bed frame with optional ottoman storage */,
    "barbican-slatted-ottoman-bed": { "Single": 372, "Small Double": 398.72, "Double": 554.17, "King": 604.23, "Super King": 660.56 } /* 2026 Venice Linear Bed with optional ottoman storage */,
    "angel-ottoman-bed": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 Geneva High & Wide Headboard Bed Frame (2-Piece Headboard) */,
    "finsbury-slatted-ottoman-bed": { "Single": 420, "Small Double": 505.06, "Double": 568.06, "King": 632.39, "Super King": 702.82 } /* 2026 Zurich Bed with Optional Ottoman Storage */,
    "aldgate-ottoman-bed": { "Single": 499, "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* 2026 Golden Ibiza Linear Bed with Gold Fabric Lining */,
    "stratford-slatted-ottoman-bed": { "Single": 456, "Small Double": 505.06, "Double": 595.83, "King": 688.73, "Super King": 745.07 } /* 2026 Sheffield Upholstery Bed */,
    "hackney-wick-slatted-ottoman-bed": { "Single": 420, "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* 2026 Yukon Bed Frame with Wings */,
    "bow-ottoman-bed": { "Small Double": 948.1, "Double": 1081.94, "King": 1153.52, "Super King": 1266.2 } /* 2026 Presidential Bed Frame with Optional Ottoman Storage */,
    "poplar-slatted-ottoman-bed": { "Single": 800, "Small Double": 884.81, "Double": 1040.28, "King": 1125.35, "Super King": 1266.2 } /* 2026 MONTANA AMBASSADOR DESIGN */,
    "limehouse-slatted-ottoman-bed": { "Single": 599, "Small Double": 543.04, "Double": 637.5, "King": 702.82, "Super King": 745.07 } /* 2026 PSCL Amalfi Italian Style Bed with Optional Ottoman Storage */,
    "rotherhithe-ottoman-bed": { "Single": 520, "Small Double": 656.96, "Double": 748.61, "King": 843.66, "Super King": 914.08 } /* 2026 Teddy-Wave Cream Bed Frame with Optional Ottoman Storage */,
    "deptford-slatted-ottoman-bed": { "Single": 649, "Small Double": 821.52, "Double": 970.83, "King": 1125.35, "Super King": 1266.2 } /* Black Plush Golden Pyramid Bed with Optional Ottoman Storage */,
    "new-cross-slatted-ottoman-bed": { "Double": 1040.28, "King": 1125.35, "Super King": 1195.77 } /* 2026 THE BAHAMAS LUXURY HOTEL STYLE WIDE 2 PIECE HEADBOARD BED */,
    "catford-ottoman-bed": { "Small Double": 694.94, "Double": 831.94, "King": 928.17, "Super King": 984.51 } /* 2026 Riviera High Headboard Bed Frame (2-Piece Headboard) */,
    "sydenham-slatted-ottoman-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 New York Tall headboard Bed Frame (2/3 Piece Headboard) */,
    "crystal-palace-slatted-ottoman-bed": { "Double": 1665.28, "King": 1900, "Super King": 2392.96 } /* 2026 The Grand Bed Frame – Luxury Upholstered (With metal lining) */,
    "norwood-ottoman-bed": { "Small Double": 694.94, "Double": 831.94, "King": 928.17, "Super King": 984.51 } /* 2026 Silver Fern Bed with High Headboard (2-Piece Headboard) */,
    "streatham-slatted-ottoman-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 Marble Bahamas PSCL Luxury Hotel Style Wide Bed, Marble Fabric */,
    "balham-slatted-ottoman-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 Duke of Orlando wide headboard bed frame */,
    "tooting-ottoman-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 } /* 2026 PSCL Ascot – Tall headboard Bed Frame (2 Piece Headboard) */,
    "earlsfield-slatted-ottoman-bed": { "Double": 1179.17, "King": 1266.2, "Super King": 1336.62 } /* 2026 Teddy-Duke Wide Headboard Luxury Bed Frame (3-Piece Headboard) */,
    "raynes-park-slatted-ottoman-bed": { "Single": 599, "Small Double": 530.38, "Double": 623.61, "King": 702.82, "Super King": 716.9 } /* 2026 Astoria Deco Bed with Optional Ottoman Storage */,
    "whitechapel-slatted-ottoman-bed": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 } /* 2026 PSCL Arizona Bed Frame (no Single old price) */
  };

  const SLATTED_OTTOMAN_SIZE_DELTAS = {
    "Single": -100,
    "Small Double": -50,
    "Double": 0,
    "King": 100,
    "Super King": 190
  };

var OTTOMAN_FABRIC_COLLECTIONS = [
    {
      name: "Plush",
      fabrics: [
        { slug: "plush-grey", name: "Plush Grey", image: "fabric/plush-grey.jfif" },
        { slug: "plush-silver", name: "Plush Silver", image: "fabric/plush-silver.jfif" },
        { slug: "plush-steel", name: "Plush Steel", image: "fabric/plush-steel.jfif" },
        { slug: "plush-cream", name: "Plush Cream", image: "fabric/plush-cream.jfif" },
        { slug: "plush-beige", name: "Plush Beige", image: "fabric/plush-beige.jfif" },
        { slug: "plush-black", name: "Plush Black", image: "fabric/plush-black.jfif" },
        { slug: "plush-pink", name: "Plush Pink", image: "fabric/plush-pink.jfif" },
        { slug: "plush-mustard", name: "Plush Mustard", image: "fabric/plush-mustard.jfif" },
        { slug: "plush-green", name: "Plush Green", image: "fabric/plush-green.jfif" },
        { slug: "plush-turquoise", name: "Plush Turquoise", image: "fabric/plush-turquoise.jfif" },
        { slug: "plush-royal-blue", name: "Plush Royal Blue", image: "fabric/plush-royal-blue.jfif" },
        { slug: "plush-white", name: "Plush White", image: "fabric/plush-white.jfif" },
        { slug: "plush-baby-pink", name: "Plush Baby Pink", image: "fabric/plush-baby-pink.jfif" },
        { slug: "plush-ice-silver", name: "Plush Ice Silver", image: "fabric/plush-ice-sliver.jfif" },
        { slug: "plush-pebble", name: "Plush Pebble", image: "fabric/plush-pebble.jfif" },
        { slug: "plush-mocca", name: "Plush Mocca", image: "fabric/plush-mocca.jfif" },
        { slug: "plush-emerald-green", name: "Plush Emerald Green", image: "fabric/plush-emerald-green.jfif" },
        { slug: "plush-duck-egg", name: "Plush Duck Egg", image: "fabric/plush-duck-egg.jfif" },
        { slug: "plush-camel", name: "Plush Camel", image: "fabric/plush-camel.jfif" },
        { slug: "plush-teal", name: "Plush Teal", image: "fabric/plush-teal.jfif" },
        { slug: "plush-plum", name: "Plush Plum", image: "fabric/plush-plum.jfif" }
      ]
    },
    {
      name: "Coniston",
      fabrics: [
        { slug: "coniston-charcoal", name: "Coniston Charcoal", image: "fabric/coniston-charcoal.jfif" },
        { slug: "coniston-almond", name: "Coniston Almond", image: "fabric/coniston-almond.jfif" },
        { slug: "coniston-armour", name: "Coniston Armour", image: "fabric/coniston-armour.jfif" },
        { slug: "coniston-emerald", name: "Coniston Emerald", image: "fabric/coniston-emerald.jfif" },
        { slug: "coniston-pink", name: "Coniston Pink", image: "fabric/coniston-pink.jfif" },
        { slug: "coniston-blue", name: "Coniston Blue", image: "fabric/coniston-blue.jfif" }
      ]
    },
    {
      name: "Naples",
      fabrics: [
        { slug: "naples-silver", name: "Naples Silver", image: "fabric/naples-silver.jfif" },
        { slug: "naples-steel", name: "Naples Steel", image: "fabric/naples-steel.jfif" },
        { slug: "naples-black", name: "Naples Black", image: "fabric/naples-black.jfif" },
        { slug: "naples-ivory", name: "Naples Ivory", image: "fabric/naples-ivory.jfif" },
        { slug: "naples-pearl-blue", name: "Naples Pearl Blue", image: "fabric/naples-pearl-blue.jfif" },
        { slug: "naples-cream", name: "Naples Cream", image: "fabric/naples-cream.jfif" },
        { slug: "naples-sand", name: "Naples Sand", image: "fabric/naples-sand.jfif" },
        { slug: "naples-mink", name: "Naples Mink", image: "fabric/naples-mink.jfif" },
        { slug: "naples-seal-grey", name: "Naples Seal Grey", image: "fabric/naples-seal-grey.jfif" },
        { slug: "naples-slate-grey", name: "Naples Slate Grey", image: "fabric/naples-slate-grey.jfif" },
        { slug: "naples-charcoal", name: "Naples Charcoal", image: "fabric/naples-charcoal.jfif" },
        { slug: "naples-blue", name: "Naples Blue", image: "fabric/naples-blue.jfif" },
        { slug: "naples-plum", name: "Naples Plum", image: "fabric/naples-plum.jfif" }
      ]
    },
    {
      name: "Crushed Velvet",
      fabrics: [
        { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver", image: "fabric/crushed-velvet-silver.jfif" },
        { slug: "crushed-velvet-black", name: "Crushed Velvet Black", image: "fabric/crushed-velvet-black.jfif" },
        { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream", image: "fabric/crushed-velvet-cream.jfif" },
        { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink", image: "fabric/crushed-velvet-mink.jfif" },
        { slug: "crushed-velvet-white", name: "Crushed Velvet White", image: "fabric/crushed-white.jfif" },
        { slug: "crushed-velvet-grey", name: "Crushed Velvet Grey", image: "fabric/crushed-grey.jfif" },
        { slug: "crushed-velvet-camel", name: "Crushed Velvet Camel", image: "fabric/crushed-camel.jfif" },
        { slug: "crushed-velvet-gold", name: "Crushed Velvet Gold", image: "fabric/crushed-gold.jfif" },
        { slug: "crushed-velvet-teal", name: "Crushed Velvet Teal", image: "fabric/crushed-teal.jfif" },
        { slug: "crushed-velvet-denim", name: "Crushed Velvet Denim", image: "fabric/crushed-denim.jfif" },
        { slug: "crushed-velvet-hot-pink", name: "Crushed Velvet Hot Pink", image: "fabric/crushed-hot-pink.jfif" },
        { slug: "crushed-velvet-purple", name: "Crushed Velvet Purple", image: "fabric/crushed-purple.jfif" },
        { slug: "crushed-velvet-plum", name: "Crushed Velvet Plum", image: "fabric/crushed-plum.jfif" },
        { slug: "crushed-velvet-baby-pink", name: "Crushed Velvet Baby Pink", image: "fabric/crushed-baby-pink.jfif" }
      ]
    },
    {
      name: "Chenille",
      fabrics: [
        { slug: "chenille-cream", name: "Chenille Cream", image: "fabric/chenille-cream.jfif" },
        { slug: "chenille-mink", name: "Chenille Mink", image: "fabric/chenille-mink.jfif" },
        { slug: "chenille-chocolate", name: "Chenille Chocolate", image: "fabric/chenille-chocolate.jfif" },
        { slug: "chenille-steel", name: "Chenille Steel", image: "fabric/chenille-steel.jfif" },
        { slug: "chenille-charcoal", name: "Chenille Charcoal", image: "fabric/chenille-charcoal.jfif" },
        { slug: "chenille-duck-egg", name: "Chenille Duck Egg", image: "fabric/chenille-duck-egg.jfif" },
        { slug: "chenille-teal", name: "Chenille Teal", image: "fabric/chenille-teal.jfif" },
        { slug: "chenille-purple", name: "Chenille Purple", image: "fabric/chenille-purple.jfif" },
        { slug: "chenille-plum", name: "Chenille Plum", image: "fabric/chenille-plum.jfif" },
        { slug: "chenille-red", name: "Chenille Red", image: "fabric/chenille-red.jfif" },
        { slug: "chenille-black", name: "Chenille Black", image: "fabric/chenille-black.jfif" }
      ]
    },
    {
      name: "Linoso",
      fabrics: [
        { slug: "linoso-sand", name: "Linoso Sand", image: "fabric/linoso-sand.jfif" },
        { slug: "linoso-silver", name: "Linoso Silver", image: "fabric/linoso-silver.jfif" },
        { slug: "linoso-slate-grey", name: "Linoso Slate Grey", image: "fabric/linoso-slate-grey.jfif" },
        { slug: "linoso-charcoal", name: "Linoso Charcoal", image: "fabric/linoso-charcoal.jfif" },
        { slug: "linoso-truffle", name: "Linoso Truffle", image: "fabric/linoso-truffle.jfif" },
        { slug: "linoso-black", name: "Linoso Black", image: "fabric/linoso-black.jfif" },
        { slug: "linoso-midnight-blue", name: "Linoso Midnight Blue", image: "fabric/linoso-midnight-blue.jfif" },
        { slug: "linoso-plum", name: "Linoso Plum", image: "fabric/linoso-plum.jfif" }
      ]
    },
    {
      name: "Boucle",
      fabrics: [
        { slug: "boucle-granite", name: "Boucle Granite", image: "fabric/boucle-granite.jfif" },
        { slug: "boucle-dove", name: "Boucle Dove", image: "fabric/boucle-dove.jfif" },
        { slug: "boucle-ivory", name: "Boucle Ivory", image: "fabric/boucle-ivory.jfif" },
        { slug: "boucle-truffle", name: "Boucle Truffle", image: "fabric/boucle-truffle.jfif" }
      ]
    },
    {
      name: "Naples Alternative",
      fabrics: [
        { slug: "grey-naples", name: "Grey Naples", image: "fabric/plush-grey.jfif" },
        { slug: "sand-naples", name: "Sand Naples", image: "fabric/naples-sand.jfif" },
        { slug: "silver-naples", name: "Silver Naples", image: "fabric/Naples-Silver.jfif" },
        { slug: "black-naples", name: "Black Naples", image: "fabric/Naples-Black.jfif" },
        { slug: "brown-naples", name: "Brown Naples", image: "fabric/naple-brown.jfif" },
        { slug: "cream-naples", name: "Cream Naples", image: "fabric/naples-cream.jfif" }
      ]
    },
    {
      name: "Additional Colours",
      fabrics: [
        { slug: "dove", name: "Dove", image: "fabric/dove.jfif" },
        { slug: "ivory", name: "Ivory", image: "fabric/ivory.jfif" },
        { slug: "latte", name: "Latte", image: "fabric/latte.jfif" },
        { slug: "mink", name: "Mink", image: "fabric/mink.jfif" },
        { slug: "truffle", name: "Truffle", image: "fabric/truffle.jfif" },
        { slug: "saffron", name: "Saffron", image: "fabric/saffron.jfif" },
        { slug: "powder", name: "Powder", image: "fabric/powder.jfif" },
        { slug: "sky", name: "Sky", image: "fabric/sky.jfif" },
        { slug: "marine", name: "Marine", image: "fabric/marrine.jfif" }
      ]
    },
    {
      name: "Marble",
      fabrics: [
        { slug: "marble-oatmeal", name: "Marble Oatmeal", image: "fabric/marble-oatmeal.jfif" },
        { slug: "marble-platinum", name: "Marble Platinum", image: "fabric/marble-platinum.jfif" },
        { slug: "marble-silver", name: "Marble Silver", image: "fabric/marble-silver.jfif" }
      ]
    }
  ];

var OTTOMAN_FABRIC_COLLECTIONS_FLAT = [];
OTTOMAN_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    OTTOMAN_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});

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
    "[Rabbora] ottoman-beds.js loaded \u2014 fabric-fallback-v2 \u2014 " +
    OTTOMAN_PRODUCTS_LIST.length + " products found. " +
    "Expected: 84. If this number is wrong, missing 'fabric-fallback-v2', " +
    "or this line never appears at all, the live server is not running this file."
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
    selectedOttoman: null,
    diamantes: false,
    buttons: false,
    matching: null,
    matchingType: "footstool",
    headboardCustom: null,
    customRequest: "",
    assembly: null,
    deliveryDelay: null,
    deliveryDate: "",
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
    var ottomanStorageMsg = document.getElementById("obOttomanStorageMessage");
    var diamantesToggle = document.getElementById("obDiamantesToggle");
    var buttonsToggle = document.getElementById("obButtonsToggle");
    var matchingOptionsEl = document.getElementById("obMatchingOptions");
    var footstoolMsg = document.getElementById("obFootstoolMessage");
    var matchingPanel = document.getElementById("obMatchingPanel");
    var matchingFabricNameEl = document.getElementById("obMatchingFabricName");
    var headboardCustomEl = document.getElementById("obHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("obHeadboardCustomMessage");
    var customRequestEl = document.getElementById("obCustomRequest");
    var assemblyEl = document.getElementById("obAssemblyOptions");
    var assemblyMsg = document.getElementById("obAssemblyMessage");
    var deliveryDelayEl = document.getElementById("obDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("obDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("obDelayDateWrap");
    var delayDateInput = document.getElementById("obDelayDate");
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
      var fabric = OTTOMAN_FABRIC_COLLECTIONS_FLAT[obState.selectedFabricIndex];
      return fabric ? fabric.name : "Same as main display picture";
    }

    var ASSEMBLY_PRICE = 59;

    // Price of the chosen size (before add-ons). Uses the bed's own
    // size price list when it has one; otherwise the size difference.
    function sizePriceFor(product, size) {
      // A product loaded from the backend API carries its own size prices.
      if (size && product.sizePrices && typeof product.sizePrices[size] === "number") return product.sizePrices[size];
      var prices = SLATTED_OTTOMAN_SIZE_PRICES[product.slug];
      if (prices) {
        return (size && typeof prices[size] === "number") ? prices[size] : product.price;
      }
      var delta = size ? (OTTOMAN_SIZE_DELTAS[size] || 0) : 0;
      return Math.max(0, product.price + delta);
    }

    // The stored oldPrice is the original price of the bed's first
    // (smallest) size. It is only shown for that size, or before a size
    // is chosen, and only when it is higher than the price shown.
    function validOldPriceFor(product, size, sizePrice) {
      // Old price written for this exact size in SLATTED_OTTOMAN_SIZE_OLD_PRICES.
      var sizeOlds = SLATTED_OTTOMAN_SIZE_OLD_PRICES[product.slug];
      var listedOldPrice = (size && sizeOlds && typeof sizeOlds[size] === "number") ? sizeOlds[size] : null;
      if (product.sizeOldPrices) {
        // Product from the backend API: the old price listed above for this
        // size comes first; the API compare-at price is used for a size the
        // list does not have.
        var apiOldPrice = size ? (listedOldPrice || product.sizeOldPrices[size]) : product.oldPrice;
        return (apiOldPrice && apiOldPrice > sizePrice) ? apiOldPrice : null;
      }
      if (listedOldPrice) return listedOldPrice > sizePrice ? listedOldPrice : null;
      if (!product.oldPrice || product.oldPrice <= sizePrice) return null;
      if (!size) return product.oldPrice;
      if (SLATTED_OTTOMAN_SIZE_PRICES[product.slug]) {
        return size === product.availableSizes[0] ? product.oldPrice : null;
      }
      return (OTTOMAN_SIZE_DELTAS[size] || 0) === 0 ? product.oldPrice : null;
    }

    function currentPrice(product) {
      var addons = 0;
      if (obState.buttons) addons += product.detailingButtonsPrice || 15;
      if (obState.assembly === "yes") addons += ASSEMBLY_PRICE;
      var total = Number(sizePriceFor(product, obState.selectedSize)) + addons;
      // Rounded to whole pence so the page and the basket always hold the
      // exact same number (e.g. 367.5 + 15 = 382.50, never 382.49999).
      return isFinite(total) ? Math.round(total * 100) / 100 : NaN;
    }

    // True only for a real, usable price (not NaN, undefined or \u00A30).
    function isValidPrice(v) {
      return typeof v === "number" && isFinite(v) && v > 0;
    }

    // ---- Price display helpers (price area only; prices are unchanged) ----

    // True when a paid add-on (Detailing Buttons or Assembly) is part of
    // the final price shown.
    function hasPaidAddons() {
      return obState.buttons === true || obState.assembly === "yes";
    }

    // "42% off", worked out only from a real old price and the real price
    // it belongs to. No old price (or not higher) -> no percentage.
    function discountPercentFor(oldPrice, price) {
      if (!oldPrice || !price || oldPrice <= price) return null;
      var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
      return pct > 0 ? pct : null;
    }

    // The page's existing monthly rule: price / 12, rounded up to the next
    // whole pound (every product's monthlyPrice follows it, e.g. £249 ->
    // £21). Worked out in pence so 300 / 12 stays exactly 25.
    function monthlyAmountFor(price) {
      return Math.ceil(Math.round(price * 100) / 1200);
    }

    // Small "% off" text next to a crossed-out price. Created by script so
    // no HTML/CSS file has to change; inline style only for spacing/weight.
    function createDiscountEl() {
      var el = document.createElement("span");
      el.className = "ob-price-discount";
      el.style.marginLeft = "0.5rem";
      el.style.fontSize = "0.8rem";
      el.style.fontWeight = "600";
      return el;
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


    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always shows the price of the size that is currently selected, and
    // nothing while no size is selected. The crossed-out price is only
    // shown when the product data has a real original price for that
    // size (the stored oldPrice belongs to the base size, i.e. the size
    // with no price difference) and it is higher than the price.
    // ---- Selected size label (price area) ----
    // Label of the size button that is currently selected, exactly as it
    // appears on the button (e.g. "Double 4ft 6\"").
    function rbSelectedSizeLabel(sizeOptionsContainer) {
      if (!sizeOptionsContainer) return "";
      var btn = sizeOptionsContainer.querySelector('[aria-pressed="true"], .is-active');
      return btn ? btn.textContent.trim() : "";
    }

    // "Selected: Double 4ft 6"" line just above the size buttons.
    function rbRenderSizeLabel(sizeOptionsContainer, sizeKey) {
      if (!sizeOptionsContainer || !sizeOptionsContainer.parentNode) return;
      var labelEl = sizeOptionsContainer.previousElementSibling;
      if (!labelEl || !labelEl.hasAttribute("data-rb-size-label")) {
        labelEl = document.createElement("p");
        labelEl.setAttribute("data-rb-size-label", "");
        labelEl.setAttribute("aria-live", "polite");
        labelEl.style.margin = "0 0 0.5rem";
        labelEl.style.fontSize = "0.85rem";
        labelEl.style.fontWeight = "600";
        sizeOptionsContainer.parentNode.insertBefore(labelEl, sizeOptionsContainer);
      }
      function update() {
        var label = sizeKey ? (rbSelectedSizeLabel(sizeOptionsContainer) || String(sizeKey)) : "";
        labelEl.textContent = label ? "Selected: " + label : "";
        labelEl.hidden = !label;
      }
      update();
      // When a product first opens, the price is drawn just before its
      // size buttons are, so read the button label again once they exist.
      setTimeout(update, 0);
    }


    var sizePriceRow = null;
    function renderSelectedSizePrice(sizeKey, sizePrice, oldPrice) {
      var anchor = sizeOptionsEl;
      if (!anchor || !anchor.parentNode) return;
      if (!sizePriceRow) {
        sizePriceRow = document.createElement("div");
        sizePriceRow.className = "bb-modal__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="bb-modal__price"></span>' +
          '<span class="product-card__price-prev"></span>';
        // "% off" for this size (only when the size has a real old price).
        sizePriceRow.appendChild(createDiscountEl());
      }
      if (anchor.nextSibling !== sizePriceRow) {
        anchor.parentNode.insertBefore(sizePriceRow, anchor.nextSibling);
      }
      if (!sizeKey) {
        sizePriceRow.style.display = "none";
        return;
      }
      var validOld = (oldPrice && oldPrice > sizePrice) ? oldPrice : null;
      var pct = discountPercentFor(validOld, sizePrice);
      sizePriceRow.style.display = "";
      sizePriceRow.children[0].textContent = obMoney(sizePrice);
      sizePriceRow.children[1].textContent = validOld ? obMoney(validOld) : "";
      sizePriceRow.children[2].textContent = pct ? pct + "% off" : "";
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

    // Fabric Colour selector — updated to the current, real Rabbora
    // Fabric Samples collection (95 colours across 10 groups, the same
    // verified real fabric/*.jfif paths already used on Blanket Boxes,
    // Sofas, Bed Frames, Solid Base Ottoman and High Headboard Beds),
    // replacing the old 29-colour catalog with broken image paths. The
    // grouped/collection-heading swatch layout matches the pattern
    // already proven on those pages. Ottoman's own "Same as main
    // display picture" default-option behaviour is unchanged.
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
      var defaultGridEl = document.createElement("div");
      defaultGridEl.className = "bb-modal__fabric-grid";
      defaultGridEl.appendChild(defaultBtn);
      fabricOptionsEl.appendChild(defaultGridEl);

      OTTOMAN_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var flatIndex = OTTOMAN_FABRIC_COLLECTIONS_FLAT.indexOf(fabric);
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(obState.selectedFabricIndex === flatIndex));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
              '<span class="fabric-swatch__check" aria-hidden="true">' +
                '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</span>' +
            '<span class="fabric-swatch__name">' + fabric.name + '</span>';
          btn.addEventListener("click", function () {
            // Clicking the already-selected swatch again reverts to the
            // "Default" option (-1) rather than leaving nothing
            // selected, since this page always needs some fabric state
            // resolved.
            selectFabric(obState.selectedFabricIndex === flatIndex ? -1 : flatIndex);
          });
          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricOptionsEl.appendChild(groupEl);
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
      if (currentProduct) renderPurchasePanel(currentProduct);
      // A matching fabric-specific product photo isn't available for
      // every fabric, so per the spec we keep the main product image
      // and simply update the selected fabric name/highlight.
    }

    // ---- Sale price block (main price area) ----
    // Original Price: £XXX (crossed out)
    // Sale Price:     £XXX (the existing big price, unchanged element)
    // You Save:       £XXX (XX% OFF)
    // Every number comes from the page's existing price data:
    //   Sale price     = currentPrice(product)  (size price + paid add-ons)
    //   Original price = the size's real old price + the same paid add-ons
    //                    (add-ons are never discounted, so they count at
    //                    their normal price on both sides)
    //   You save       = Original price - Sale price
    //   % off          = round(You save / Original price * 100)
    // Only shown when the selected size has a real old price (API
    // compare_at_price or this file's fallback rule). No old price -> just
    // the normal price, exactly as before.
    var saleOriginalEl = null;
    var saleLabelEl = null;
    var saleSaveEl = null;

    function injectSalePriceStyles() {
      if (document.getElementById("obSalePriceStyles")) return;
      var style = document.createElement("style");
      style.id = "obSalePriceStyles";
      style.textContent =
        ".ob-sale__original{margin:0 0 .3rem;font-family:var(--font-body,sans-serif);font-size:.9rem;color:rgba(35,35,32,.62);letter-spacing:.01em;}" +
        ".ob-sale__original s{color:inherit;text-decoration-thickness:1px;}" +
        ".ob-sale__label{align-self:center;margin-right:.55rem;font-family:var(--font-body,sans-serif);font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--color-brass,#a47b4c);}" +
        ".ob-sale__save{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:.4rem 0 .3rem;font-family:var(--font-body,sans-serif);font-size:.9rem;font-weight:600;color:var(--color-forest,#1b3a2f);}" +
        ".ob-sale__badge{display:inline-block;padding:.18rem .65rem;border-radius:999px;background:var(--color-forest,#1b3a2f);color:var(--color-ivory,#f1ebde);font-size:.72rem;font-weight:700;letter-spacing:.08em;}" +
        ".ob-sale__original[hidden],.ob-sale__label[hidden],.ob-sale__save[hidden]{display:none!important;}" +
        "@media (max-width:600px){.ob-sale__original,.ob-sale__save{font-size:.85rem;}.ob-sale__label{font-size:.7rem;}}";
      document.head.appendChild(style);
    }

    function ensureSalePriceEls() {
      var row = priceEl.parentNode;
      if (saleOriginalEl || !row || !row.parentNode) return;
      injectSalePriceStyles();
      saleOriginalEl = document.createElement("p");
      saleOriginalEl.className = "ob-sale__original";
      saleOriginalEl.innerHTML = 'Original Price: <s data-ob-original-price></s>';
      row.parentNode.insertBefore(saleOriginalEl, row);

      saleLabelEl = document.createElement("span");
      saleLabelEl.className = "ob-sale__label";
      saleLabelEl.textContent = "Sale Price:";
      row.insertBefore(saleLabelEl, priceEl);

      saleSaveEl = document.createElement("p");
      saleSaveEl.className = "ob-sale__save";
      saleSaveEl.setAttribute("aria-live", "polite");
      saleSaveEl.innerHTML = '<span>You Save: <span data-ob-save-amount></span></span> <span class="ob-sale__badge" data-ob-save-pct></span>';
      row.parentNode.insertBefore(saleSaveEl, row.nextSibling);
    }

    function renderSalePrice(originalPrice, salePrice) {
      ensureSalePriceEls();
      if (!saleOriginalEl) return;
      var save = originalPrice ? Math.round((originalPrice - salePrice) * 100) / 100 : 0;
      var pct = save > 0 ? Math.round((save / originalPrice) * 100) : 0;
      var onSale = save > 0 && pct > 0;
      saleOriginalEl.hidden = !onSale;
      saleLabelEl.hidden = !onSale;
      saleSaveEl.hidden = !onSale;
      if (!onSale) return;
      saleOriginalEl.querySelector("[data-ob-original-price]").textContent = obMoney(originalPrice);
      saleSaveEl.querySelector("[data-ob-save-amount]").textContent = obMoney(save);
      saleSaveEl.querySelector("[data-ob-save-pct]").textContent = "(" + pct + "% OFF)";
    }

    // ---- Total Price (above quantity / Add to Basket) ----
    // Total Price = currentPrice(product) x quantity. It uses the exact same
    // currentPrice() that Add to Basket sends to the cart, so the page and
    // the basket can never show different amounts. When the configuration
    // is on sale it also shows the original total crossed out and the
    // total saved. Created by script, like the sale block above, so no
    // HTML/CSS file has to change.
    var totalBlockEl = null;

    function injectTotalPriceStyles() {
      if (document.getElementById("obTotalPriceStyles")) return;
      var style = document.createElement("style");
      style.id = "obTotalPriceStyles";
      style.textContent =
        ".ob-total{margin:1.25rem 0 1rem;padding:1rem 1.15rem;border:1px solid rgba(164,123,76,.35);border-radius:4px;background:rgba(241,235,222,.55);}" +
        ".ob-total__row{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.35rem .75rem;}" +
        ".ob-total__label{font-family:var(--font-body,sans-serif);font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-forest,#1b3a2f);}" +
        ".ob-total__amounts{display:flex;flex-wrap:wrap;align-items:baseline;gap:.6rem;}" +
        ".ob-total__was{font-family:var(--font-body,sans-serif);font-size:.95rem;color:rgba(35,35,32,.55);text-decoration:line-through;text-decoration-thickness:1px;}" +
        ".ob-total__amount{font-family:var(--font-display,Georgia,serif);font-size:1.75rem;line-height:1.1;font-weight:600;color:var(--color-forest,#1b3a2f);}" +
        ".ob-total__meta{margin:.45rem 0 0;font-family:var(--font-body,sans-serif);font-size:.85rem;color:rgba(35,35,32,.7);}" +
        ".ob-total__save{margin:.3rem 0 0;font-family:var(--font-body,sans-serif);font-size:.88rem;font-weight:600;color:var(--color-brass,#a47b4c);}" +
        ".ob-total__was[hidden],.ob-total__meta[hidden],.ob-total__save[hidden]{display:none!important;}" +
        "@media (max-width:600px){.ob-total{padding:.85rem .9rem;}.ob-total__amount{font-size:1.5rem;}.ob-total__label{font-size:.72rem;}}";
      document.head.appendChild(style);
    }

    // Placed directly above the row that holds the quantity control, so it
    // sits just before Add to Basket whatever the surrounding markup is.
    function ensureTotalBlock() {
      if (totalBlockEl && document.contains(totalBlockEl)) return totalBlockEl;
      if (!addToCartBtn || !qtyValueEl) return null;
      var common = addToCartBtn.parentNode;
      while (common && !common.contains(qtyValueEl)) common = common.parentNode;
      if (!common) return null;
      var anchor = qtyValueEl;
      while (anchor.parentNode && anchor.parentNode !== common) anchor = anchor.parentNode;
      injectTotalPriceStyles();
      totalBlockEl = document.createElement("div");
      totalBlockEl.className = "ob-total";
      totalBlockEl.setAttribute("aria-live", "polite");
      totalBlockEl.innerHTML =
        '<div class="ob-total__row">' +
          '<span class="ob-total__label">Total Price</span>' +
          '<span class="ob-total__amounts">' +
            '<span class="ob-total__was" data-ob-total-was hidden></span>' +
            '<span class="ob-total__amount" data-ob-total-amount></span>' +
          '</span>' +
        '</div>' +
        '<p class="ob-total__save" data-ob-total-save hidden></p>' +
        '<p class="ob-total__meta" data-ob-total-meta hidden></p>';
      common.insertBefore(totalBlockEl, anchor);
      return totalBlockEl;
    }

    function renderTotalPrice(unitPrice, originalUnit) {
      var el = ensureTotalBlock();
      if (!el) return;
      var qty = obState.quantity > 0 ? obState.quantity : 1;
      var amountEl = el.querySelector("[data-ob-total-amount]");
      var wasEl = el.querySelector("[data-ob-total-was]");
      var saveEl = el.querySelector("[data-ob-total-save]");
      var metaEl = el.querySelector("[data-ob-total-meta]");

      if (!isValidPrice(unitPrice)) {
        amountEl.textContent = "Price unavailable";
        wasEl.hidden = true; saveEl.hidden = true;
        metaEl.hidden = false;
        metaEl.textContent = "Please choose another size or contact us for a quote.";
        return;
      }

      var total = Math.round(unitPrice * qty * 100) / 100;
      var onSale = isValidPrice(originalUnit) && originalUnit > unitPrice;
      var originalTotal = onSale ? Math.round(originalUnit * qty * 100) / 100 : 0;
      var saved = onSale ? Math.round((originalTotal - total) * 100) / 100 : 0;

      amountEl.textContent = (obState.selectedSize ? "" : "From ") + obMoney(total);
      wasEl.hidden = !onSale;
      wasEl.textContent = onSale ? obMoney(originalTotal) : "";
      saveEl.hidden = !onSale;
      saveEl.textContent = onSale ? "You Save: " + obMoney(saved) : "";

      var meta = [];
      if (!obState.selectedSize) meta.push("Select a size to confirm your price.");
      if (qty > 1) meta.push(qty + " \u00d7 " + obMoney(unitPrice) + " each");
      metaEl.hidden = meta.length === 0;
      metaEl.textContent = meta.join(" \u00b7 ");
    }

    function renderPurchasePanel(product) {
      var finalPrice = currentPrice(product);
      priceEl.textContent = obMoney(finalPrice);
      var sizePrice = sizePriceFor(product, obState.selectedSize);
      var validOldPrice = validOldPriceFor(product, obState.selectedSize, sizePrice);

      // Original total of this exact configuration: the size's real old
      // price plus the same paid add-ons that are in the sale price.
      var addonsTotal = Math.round((finalPrice - sizePrice) * 100) / 100;
      var originalTotal = validOldPrice ? validOldPrice + addonsTotal : null;
      // The old price now has its own "Original Price" line, so the small
      // crossed-out price next to the big price stays empty.
      prevPriceEl.textContent = "";
      renderSalePrice(originalTotal, finalPrice);

      // Monthly amount from the final price shown (paid add-ons included),
      // using the page's existing rule. With no size and no add-ons this is
      // exactly the product's own monthlyPrice.
      if (monthlyEl) {
        var monthly = (!obState.selectedSize && !hasPaidAddons() && typeof product.monthlyPrice === "number")
          ? product.monthlyPrice
          : monthlyAmountFor(finalPrice);
        monthlyEl.textContent = "or from £" + monthly + "/month";
      }

      renderSelectedSizePrice(obState.selectedSize, sizePrice, validOldPrice);
      // Selected size shown above the size buttons.
      rbRenderSizeLabel(sizeOptionsEl, obState.selectedSize);
      // Total Price for the whole configuration and quantity.
      renderTotalPrice(finalPrice, originalTotal);
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
          if (ottomanStorageMsg) ottomanStorageMsg.textContent = "";
          if (currentProduct) renderPurchasePanel(currentProduct);
        });
      });

      if (diamantesToggle) {
        diamantesToggle.addEventListener("click", function () {
          obState.diamantes = !obState.diamantes;
          diamantesToggle.setAttribute("aria-pressed", String(obState.diamantes));
          if (currentProduct) renderPurchasePanel(currentProduct);
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
          if (footstoolMsg) footstoolMsg.textContent = "";
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

      // The three brand-new single-select option groups (Headboard
      // Height, Assembly, Delivery Delay) share the same plain
      // .mt-option-pill radio-group pattern as the groups above.
      function initNewRadioGroup(container, stateKey, messageEl2, onSelect) {
        if (!container) return;
        qsa(".mt-option-pill", container).forEach(function (btn) {
          btn.addEventListener("click", function () {
            obState[stateKey] = btn.dataset.value;
            qsa(".mt-option-pill", container).forEach(function (el) {
              el.setAttribute("aria-pressed", "false");
            });
            btn.setAttribute("aria-pressed", "true");
            if (messageEl2) messageEl2.textContent = "";
            if (onSelect) onSelect(btn.dataset.value);
          });
        });
      }

      initNewRadioGroup(headboardCustomEl, "headboardCustom", headboardCustomMsg);

      initNewRadioGroup(assemblyEl, "assembly", assemblyMsg, function () {
        if (currentProduct) renderPurchasePanel(currentProduct);
      });

      initNewRadioGroup(deliveryDelayEl, "deliveryDelay", deliveryDelayMsg, function (value) {
        if (delayDateWrap) delayDateWrap.hidden = value !== "yes";
      });

      if (customRequestEl) {
        customRequestEl.addEventListener("input", function () {
          obState.customRequest = customRequestEl.value;
        });
      }

      if (delayDateInput) {
        delayDateInput.addEventListener("change", function () {
          obState.deliveryDate = delayDateInput.value;
        });
      }
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
              '<span class="product-card__no-reviews">No reviews yet</span>' +
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
      // No verified real review data exists yet for this product, so show
      // an honest "No reviews yet" instead of the fake rating/count that
      // used to be hardcoded here.
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
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
      obState.selectedOttoman = null;
      obState.diamantes = false;
      obState.buttons = false;
      obState.matching = null;
      obState.matchingType = "footstool";
      obState.headboardCustom = null;
      obState.customRequest = "";
      obState.assembly = null;
      obState.deliveryDelay = null;
      obState.deliveryDate = "";
      obState.quantity = 1;
      qtyValueEl.textContent = "1";
      purchaseMessage.textContent = "";
      purchaseMessage.classList.remove("is-error");
      matchingPanel.hidden = true;
      if (diamantesToggle) diamantesToggle.setAttribute("aria-pressed", "false");
      if (buttonsToggle) buttonsToggle.setAttribute("aria-pressed", "false");
      qsa(".mt-option-pill", ottomanOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", "false");
      });
      qsa(".mt-option-pill", matchingOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", "false");
      });
      [headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        qsa(".mt-option-pill", group).forEach(function (el) {
          el.setAttribute("aria-pressed", "false");
        });
      });
      [ottomanStorageMsg, footstoolMsg, headboardCustomMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
        if (msg) msg.textContent = "";
      });
      if (customRequestEl) customRequestEl.value = "";
      if (delayDateInput) delayDateInput.value = "";
      if (delayDateWrap) delayDateWrap.hidden = true;

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

    // ---- Backend Product Detail API ----
    // The detail view first asks the backend for the product. Only the
    // name, images, sizes, size prices, compare-at prices and (where this
    // page shows them) dimensions come from the API. They are merged ON TOP
    // of a copy of the existing product object from this file, so every
    // frontend-only field stays exactly as it is. If the API fails, is
    // unreachable, returns 404 or sends unexpected data, the original
    // product object from this file is used exactly as before.
    // Address from api-config.js (window.RabboraApi), which must load
    // before this file: GET <API_URL>/products/slug/<slug>.
    var RB_API_PRODUCT_URL = window.RabboraApi && typeof window.RabboraApi.url === "function"
      ? window.RabboraApi.url("/products/slug/")
      : null;
    if (!RB_API_PRODUCT_URL) {
      console.warn(
        "[Rabbora Ottoman Beds] api-config.js is not loaded, so product details come from this file only. " +
        "Add <script src=\"api-config.js\"></script> before ottoman-beds.js."
      );
    }
    var RB_API_TIMEOUT_MS = 4000;
    var rbApiCache = {};
    var rbApiRouteId = 0;

    function rbApiIsValid(apiProduct, slug) {
      if (!apiProduct || apiProduct.slug !== slug) return false;
      if (typeof apiProduct.name !== "string" || !apiProduct.name.trim()) return false;
      if (!Array.isArray(apiProduct.images) || apiProduct.images.length === 0) return false;
      if (!Array.isArray(apiProduct.variants) || apiProduct.variants.length === 0) return false;
      var imagesOk = apiProduct.images.every(function (img) {
        return img && typeof img.image_url === "string" && img.image_url.trim() !== "";
      });
      var variantsOk = apiProduct.variants.every(function (v) {
        return v &&
          typeof v.option_value === "string" && v.option_value !== "" &&
          typeof v.option_label === "string" && v.option_label !== "" &&
          typeof v.price === "number" && isFinite(v.price) && v.price > 0;
      });
      return imagesOk && variantsOk;
    }

    // Shallow copy, so the original product object in this file is never
    // changed (grid cards, related products and the fallback keep using it).
    function rbApiCopy(baseProduct) {
      var copy = {};
      Object.keys(baseProduct).forEach(function (key) { copy[key] = baseProduct[key]; });
      return copy;
    }

    // Size data from the API variants, in the API's sort order. When
    // needDimensions is true, every size must end up with a width/length
    // (API value, or this file's existing value) or null is returned.
    function rbApiSizeData(baseProduct, apiProduct, needDimensions) {
      var variants = apiProduct.variants.slice().sort(function (a, b) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      });
      var data = {
        sizes: [], labels: [], labelMap: {}, sizePrices: {}, sizeOldPrices: {}, dimensions: {},
        images: apiProduct.images.map(function (img) { return img.image_url; })
      };
      var baseDims = baseProduct.dimensions && typeof baseProduct.dimensions === "object" ? baseProduct.dimensions : {};
      Object.keys(baseDims).forEach(function (size) { data.dimensions[size] = baseDims[size]; });
      var ok = true;
      variants.forEach(function (v) {
        data.sizes.push(v.option_value);
        data.labels.push(v.option_label);
        data.labelMap[v.option_value] = v.option_label;
        data.sizePrices[v.option_value] = v.price;
        data.sizeOldPrices[v.option_value] =
          (typeof v.compare_at_price === "number" && v.compare_at_price > v.price) ? v.compare_at_price : null;
        if (typeof v.width_cm === "number" && typeof v.length_cm === "number") {
          data.dimensions[v.option_value] = { width: v.width_cm, length: v.length_cm };
        }
        var d = data.dimensions[v.option_value];
        if (needDimensions && !(d && typeof d.width === "number" && typeof d.length === "number")) ok = false;
      });
      if (!ok) return null;
      // Base (no size selected) price: this page's own base price when one
      // of the API sizes has exactly that price (so the page shows the same
      // "from" price as before); otherwise the API product price (its
      // lowest size). The crossed-out price is that size's compare-at price.
      var baseVariant = null;
      if (typeof baseProduct.price === "number") {
        baseVariant = variants.filter(function (v) { return Math.abs(v.price - baseProduct.price) < 0.001; })[0] || null;
      }
      if (baseVariant) {
        data.price = baseVariant.price;
      } else {
        data.price = (typeof apiProduct.price === "number" && isFinite(apiProduct.price) && apiProduct.price > 0)
          ? apiProduct.price : variants[0].price;
        baseVariant = variants.filter(function (v) { return Math.abs(v.price - data.price) < 0.001; })[0] || variants[0];
      }
      data.oldPrice = data.sizeOldPrices[baseVariant.option_value];
      // Some pages keep the crossed-out price on their first size even when
      // another size is the base price; the page showed it before a size
      // was chosen, so the first size's compare-at price is used then.
      if (!data.oldPrice) {
        var firstOld = data.sizeOldPrices[variants[0].option_value];
        data.oldPrice = (firstOld && firstOld > data.price) ? firstOld : null;
      }
      return data;
    }

    // Page-specific merge: which API values go into which fields this
    // page already reads.
    function rbApiMerge(baseProduct, apiProduct) {
      var d = rbApiSizeData(baseProduct, apiProduct, true);
      if (!d) return null;
      var merged = rbApiCopy(baseProduct);
      merged.name = apiProduct.name;
      merged.images = d.images;
      merged.availableSizes = d.sizes;
      merged.availableSizeLabels = d.labels;
      merged.sizePrices = d.sizePrices;
      merged.sizeOldPrices = d.sizeOldPrices;
      merged.dimensions = d.dimensions;
      merged.price = d.price;
      merged.oldPrice = d.oldPrice;
      return merged;
    }

    // Resolves with the merged API product, or null when the original
    // product object should be used instead. Never rejects.
    function rbApiFetch(baseProduct, slug) {
      if (rbApiCache[slug]) return Promise.resolve(rbApiCache[slug]);
      if (typeof fetch !== "function" || !RB_API_PRODUCT_URL) return Promise.resolve(null);
      var controller = typeof AbortController === "function" ? new AbortController() : null;
      var timeoutId = controller ? window.setTimeout(function () { controller.abort(); }, RB_API_TIMEOUT_MS) : null;
      return fetch(RB_API_PRODUCT_URL + encodeURIComponent(slug), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      })
        .then(function (response) {
          if (!response.ok) return null;
          return response.json().catch(function () { return null; });
        })
        .then(function (data) {
          var apiProduct = data && data.success === true ? data.product : null;
          if (!rbApiIsValid(apiProduct, slug)) return null;
          var merged = rbApiMerge(baseProduct, apiProduct);
          if (merged) rbApiCache[slug] = merged;
          return merged;
        })
        .catch(function () { return null; })
        .then(function (result) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return result;
        });
    }

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") {
        rbApiRouteId++;
        showCategoryView();
        return;
      }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) {
        rbApiRouteId++;
        showCategoryView();
        return;
      }
      var product = OTTOMAN_PRODUCTS[slug];
      if (!product) {
        rbApiRouteId++;
        showNotFound();
        return;
      }
      // Only the newest route may render (ignores late answers).
      var requestId = ++rbApiRouteId;
      rbApiFetch(product, slug).then(function (apiProduct) {
        if (requestId !== rbApiRouteId) return;
        showDetail(apiProduct || product);
      });
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
          if (currentProduct) renderPurchasePanel(currentProduct);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        obState.quantity += 1;
        qtyValueEl.textContent = String(obState.quantity);
        if (currentProduct) renderPurchasePanel(currentProduct);
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
        // Each required new option shows its own inline message right
        // next to that option (not just one generic message at the
        // bottom), checked top-to-bottom in the order they appear.
        if (!obState.selectedOttoman) {
          ottomanStorageMsg.textContent = "Please select an option.";
          ottomanOptionsEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!obState.matching) {
          footstoolMsg.textContent = "Please select an option.";
          matchingOptionsEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!obState.headboardCustom) {
          headboardCustomMsg.textContent = "Please select an option.";
          headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!obState.assembly) {
          assemblyMsg.textContent = "Please select an option.";
          assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!obState.deliveryDelay) {
          deliveryDelayMsg.textContent = "Please select an option.";
          deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        var detailBits = [];
        if (obState.diamantes) detailBits.push("Diamantes");
        if (obState.buttons) detailBits.push("Matching Fabric Buttons");
        var detailText = detailBits.length ? " with " + detailBits.join(" & ") : "";

        var fabricName = selectedFabricName();
        // Same function the Total Price uses, so the basket receives
        // exactly the price shown on the page.
        var unitPrice = currentPrice(currentProduct);
        if (!isValidPrice(unitPrice)) {
          purchaseMessage.textContent = "Sorry, we couldn't work out a price for this size. Please choose another size or contact us.";
          purchaseMessage.classList.add("is-error");
          return;
        }

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
                buttons: obState.buttons ? "Yes" : null,
                ottomanStorage: obState.selectedOttoman,
                footstoolBlanketBox: obState.matching,
                footstoolBlanketBoxType: obState.matching === "yes" ? obState.matchingType : null,
                headboardHeight: obState.headboardCustom,
                customRequest: obState.customRequest || null,
                assembly: obState.assembly,
                assemblyPrice: obState.assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: obState.deliveryDelay,
                deliveryDate: obState.deliveryDelay === "yes" ? (obState.deliveryDate || null) : null
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
            // No verified real review data exists yet, so this snapshot
            // deliberately omits "stars"/"reviewCount" — wishlist.js only
            // renders a rating row when these are present, so leaving them
            // out means the saved item correctly shows no rating at all
            // instead of carrying over a fake one.
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

  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.bb-modal__rating), which is populated
     separately by initOttomanDetail() once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.bb-modal__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
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