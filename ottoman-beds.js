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