(function () {
  "use strict";

  console.log(
    "[Rabbora] sofas.js loaded \u2014 FULL-PAGE detail view version (v2). " +
    "If clicking a sofa still opens a popup/modal instead of a full page, " +
    "or this line does not appear at all, the browser is running an old " +
    "cached copy of this file \u2014 not the one just uploaded."
  );

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

    // Reflect any previously-saved wishlist state on every heart
    // already rendered on this page (e.g. after a refresh).
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
        // Defensive fallback so the heart still responds even if the
        // shared wishlist store failed to load — state just won't
        // persist in that case.
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

    // Keep the header count and any hearts on this page in sync when
    // the wishlist changes elsewhere — another tab, or wishlist.html
    // removing an item.
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

  var SF_PRODUCTS = 
{
  "chesterfield-3-seater-sofa": {
    "name": "Chesterfield 3-Seater Sofa",
    "price": 899.0,
    "prev": 1099.0,
    "monthly": 75,
    "rating": 5,
    "reviews": 143,
    "description": "The Chesterfield 3-Seater Sofa brings timeless character to any living room. Deep-button detailing and rolled arms pair with a solid hardwood frame, giving you a statement seating piece built to be lived with for years.",
    "features": [
      "Traditional deep-button Chesterfield detailing",
      "Solid hardwood frame built for everyday use",
      "High-density foam and fibre-wrapped cushions",
      "Turned wooden feet for a classic finish"
    ],
    "dimensions": "Approx. 210cm wide \u00d7 90cm deep \u00d7 78cm high",
    "images": [
      "images/img-44.png",
      "images/img-53.png",
      "images/img-54.png"
    ]
  },
  "chelsea-corner-sofa": {
    "name": "Chelsea Corner Sofa",
    "price": 1399.0,
    "prev": null,
    "monthly": 117,
    "rating": 5,
    "reviews": 88,
    "description": "The Chelsea Corner Sofa is built for relaxed, everyday family living. Its generous corner layout and deep, plush cushioning create a comfortable spot to unwind, finished in a hardwearing woven fabric.",
    "features": [
      "Generous corner layout suited to family living rooms",
      "Deep seats with plush, supportive cushioning",
      "Woven fabric finish that wears well day to day",
      "Reinforced frame designed for regular use"
    ],
    "dimensions": "Approx. 280cm \u00d7 210cm corner footprint \u00d7 85cm high",
    "images": [
      "images/img-41.png",
      "images/img-55.png",
      "images/img-56.png"
    ]
  },
  "hampton-2-seater-sofa": {
    "name": "Hampton 2-Seater Sofa",
    "price": 649.0,
    "prev": 799.0,
    "monthly": 54,
    "rating": 4,
    "reviews": 52,
    "description": "The Hampton 2-Seater Sofa brings a soft, contemporary look to compact living spaces. Its tailored linen-look fabric and neat tapered legs make it equally suited to a city flat or a smaller snug.",
    "features": [
      "Compact contemporary silhouette for smaller rooms",
      "Soft linen-look fabric with a tailored finish",
      "Comfortable foam-filled seat and back cushions",
      "Neat tapered legs in a natural wood finish"
    ],
    "dimensions": "Approx. 165cm wide \u00d7 86cm deep \u00d7 80cm high",
    "images": [
      "images/img-42.png",
      "images/img-57.png",
      "images/img-58.png"
    ]
  },
  "harlow-modular-sofa": {
    "name": "Harlow Modular Sofa",
    "price": 1599.0,
    "prev": null,
    "monthly": 133,
    "rating": 5,
    "reviews": 67,
    "description": "The Harlow Modular Sofa is designed to move with you. Its modular sections can be arranged to suit your room, finished in a rich, plush velvet-style fabric that feels as good as it looks.",
    "features": [
      "Modular sections that adapt to your room layout",
      "Plush velvet-style upholstery for a luxury finish",
      "Deep-fill cushions for a relaxed, comfortable seat",
      "Reinforced frame designed for everyday family use"
    ],
    "dimensions": "Approx. 300cm configurable \u00d7 95cm deep \u00d7 80cm high",
    "images": [
      "images/img-45.png",
      "images/img-59.png",
      "images/img-60.png"
    ]
  }
};

  var SOFA_FABRIC_OPTIONS = [
    { "slug": "plush-grey", "name": "Plush Grey", "image": "images/img-34.jfif" },
    { "slug": "plush-silver", "name": "Plush Silver", "image": "images/img-35.jfif" },
    { "slug": "plush-steel", "name": "Plush Steel", "image": "images/img-36.jfif" },
    { "slug": "coniston-charcoal", "name": "Coniston Charcoal", "image": "images/img-37.jfif" },
    { "slug": "coniston-almond", "name": "Coniston Almond", "image": "images/img-105.jfif" },
    { "slug": "plush-cream", "name": "Plush Cream", "image": "images/img-38.jfif" },
    { "slug": "naples-silver", "name": "Naples Silver", "image": "images/img-39.jfif" },
    { "slug": "naples-steel", "name": "Naples Steel", "image": "images/img-40.jfif" },
    { "slug": "coniston-armour", "name": "Coniston Armour", "image": "images/img-101.jfif" },
    { "slug": "plush-beige", "name": "Plush Beige", "image": "images/img-102.jfif" },
    { "slug": "plush-black", "name": "Plush Black", "image": "images/img-104.jfif" },
    { "slug": "plush-pink", "name": "Plush Pink", "image": "images/img-106.jfif" },
    { "slug": "coniston-emerald", "name": "Coniston Emerald", "image": "images/img-107.jfif" },
    { "slug": "coniston-pink", "name": "Coniston Pink", "image": "images/img-108.jfif" },
    { "slug": "naples-black", "name": "Naples Black", "image": "images/img-109.jfif" },
    { "slug": "naples-ivory", "name": "Naples Ivory", "image": "images/img-110.jfif" },
    { "slug": "crushed-velvet-silver", "name": "Crushed Velvet Silver", "image": "images/img-111.jfif" },
    { "slug": "crushed-velvet-black", "name": "Crushed Velvet Black", "image": "images/img-112.jfif" },
    { "slug": "crushed-velvet-cream", "name": "Crushed Velvet Cream", "image": "images/img-113.jfif" },
    { "slug": "crushed-velvet-mink", "name": "Crushed Velvet Mink", "image": "images/img-114.jfif" },
    { "slug": "plush-mustard", "name": "Plush Mustard", "image": "images/img-115.jfif" },
    { "slug": "plush-green", "name": "Plush Green", "image": "images/img-116.jfif" },
    { "slug": "plush-turquoise", "name": "Plush Turquoise", "image": "images/img-117.jfif" },
    { "slug": "coniston-blue", "name": "Coniston Blue", "image": "images/img-118.jfif" },
    { "slug": "cream-boucle", "name": "Cream Boucle", "image": "images/img-119.jfif" },
    { "slug": "pink-boucle", "name": "Pink Boucle", "image": "images/img-120.jfif" },
    { "slug": "marble-oatmeal", "name": "Marble Oatmeal", "image": "images/img-121.jfif" },
    { "slug": "marble-platinum", "name": "Marble Platinum", "image": "images/img-122.jfif" },
    { "slug": "marble-silver", "name": "Marble Silver", "image": "images/img-123.jfif" }
  ];

  function sfMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function sfStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  var sfModalState = {
    slug: null,
    imageIndex: 0,
    quantity: 1,
    selectedFabric: null
  };

  function initSofaFilters() {
    var grid = document.getElementById("sfProductGrid");
    if (!grid) return;

    var seatingSelect = document.getElementById("sfSeatingSelect");
    var styleSelect = document.getElementById("sfStyleSelect");
    var fabricSelect = document.getElementById("sfFabricSelect");
    var colourSelect = document.getElementById("sfColourSelect");
    var priceSelect = document.getElementById("sfPriceSelect");

    var filtersBtn = document.getElementById("sfFiltersBtn");
    var filtersCountEl = document.getElementById("sfFiltersCount");
    var drawer = document.getElementById("sfFilterDrawer");
    var drawerClose = document.getElementById("sfFilterDrawerClose");
    var overlay = document.getElementById("sfFilterOverlay");
    var applyBtn = document.getElementById("sfApplyFilters");
    var clearBtn = document.getElementById("sfClearFilters");
    var productCountEl = document.getElementById("sfProductCount");
    var fallbackNote = document.getElementById("sfFallbackNote");

    var cards = qsa(".sf-product-card", grid);

    function priceInRange(price, range) {
      if (range === "all") return true;
      if (range === "under-700") return price < 700;
      if (range === "700-1200") return price >= 700 && price <= 1200;
      if (range === "over-1200") return price > 1200;
      return true;
    }

    function getFilterState() {
      return {
        seating: seatingSelect ? seatingSelect.value : "all",
        style: styleSelect ? styleSelect.value : "all",
        fabric: fabricSelect ? fabricSelect.value : "all",
        colour: colourSelect ? colourSelect.value : "all",
        price: priceSelect ? priceSelect.value : "all"
      };
    }

    // Colour options are the same 29 fabric names used on the Fabric
    // Samples page. A sofa "matches" a selected colour when that exact
    // fabric is one of its own available options — reusing the same
    // product.fabrics data already powering the detail modal, rather
    // than a separate colour list.
    function cardMatchesColour(card, colour) {
      if (colour === "all") return true;
      var product = SF_PRODUCTS[card.dataset.slug];
      if (!product || !product.fabrics) return false;
      return product.fabrics.some(function (fabric) {
        return fabric.name === colour;
      });
    }

    function cardMatches(card, state) {
      return (
        (state.seating === "all" || card.dataset.seating === state.seating) &&
        (state.style === "all" || card.dataset.style === state.style) &&
        (state.fabric === "all" || card.dataset.fabric === state.fabric) &&
        cardMatchesColour(card, state.colour) &&
        priceInRange(parseFloat(card.dataset.price), state.price)
      );
    }

    function cardScore(card, state) {
      var score = 0;
      if (state.colour !== "all" && cardMatchesColour(card, state.colour)) score += 100;
      if (state.fabric !== "all" && card.dataset.fabric === state.fabric) score += 10;
      if (state.style !== "all" && card.dataset.style === state.style) score += 5;
      if (state.seating !== "all" && card.dataset.seating === state.seating) score += 3;
      if (priceInRange(parseFloat(card.dataset.price), state.price)) score += 1;
      return score;
    }

    function activeFilterCount(state) {
      var count = 0;
      if (state.seating !== "all") count += 1;
      if (state.style !== "all") count += 1;
      if (state.fabric !== "all") count += 1;
      if (state.colour !== "all") count += 1;
      if (state.price !== "all") count += 1;
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

    // Never shows a fully empty grid: if no card matches every active
    // filter exactly, fall back to the closest-scoring card(s) instead,
    // prioritising Colour first, then Fabric, Style, Seating and Price.
    function applyFilters() {
      var state = getFilterState();
      var exactMatches = cards.filter(function (card) {
        return cardMatches(card, state);
      });

      var visibleCards = exactMatches;
      var usedFallback = false;

      if (visibleCards.length === 0) {
        var scored = cards.map(function (card) {
          return { card: card, score: cardScore(card, state) };
        });
        var maxScore = Math.max.apply(null, scored.map(function (s) { return s.score; }));
        visibleCards = scored
          .filter(function (s) { return s.score === maxScore; })
          .map(function (s) { return s.card; });
        usedFallback = activeFilterCount(state) > 0;
      }

      cards.forEach(function (card) {
        card.hidden = visibleCards.indexOf(card) === -1;
      });

      if (fallbackNote) {
        fallbackNote.hidden = !usedFallback;
      }

      if (productCountEl) {
        var count = visibleCards.length;
        productCountEl.textContent = count + (count === 1 ? " Sofa" : " Sofas");
      }

      updateFiltersCountBadge(state);
    }

    [seatingSelect, styleSelect, fabricSelect, colourSelect, priceSelect].forEach(function (select) {
      if (select) select.addEventListener("change", applyFilters);
    });

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      if (overlay) {
        overlay.hidden = false;
        requestAnimationFrame(function () {
          overlay.classList.add("is-visible");
        });
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
        window.setTimeout(function () {
          overlay.hidden = true;
        }, 250);
      }
      if (filtersBtn) filtersBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("sf-drawer-open");
    }

    if (filtersBtn) {
      filtersBtn.addEventListener("click", function () {
        var isMobile = window.matchMedia("(max-width: 1023px)").matches;
        if (!isMobile) {
          // Desktop: the bar is already visible inline — just bring it
          // into view rather than opening an overlay drawer.
          if (drawer) drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        var isOpen = drawer && drawer.classList.contains("is-open");
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
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
        applyFilters();
        closeDrawer();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        [seatingSelect, styleSelect, fabricSelect, colourSelect, priceSelect].forEach(function (select) {
          if (select) select.value = "all";
        });
        applyFilters();
      });
    }

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches && drawer && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    applyFilters();
  }

  function initSofaViewToggle() {
    var grid = document.getElementById("sfProductGrid");
    var gridBtn = document.getElementById("sfGridViewBtn");
    var listBtn = document.getElementById("sfListViewBtn");
    if (!grid || !gridBtn || !listBtn) return;

    gridBtn.addEventListener("click", function () {
      grid.classList.remove("is-list-view");
      gridBtn.classList.add("is-active");
      gridBtn.setAttribute("aria-pressed", "true");
      listBtn.classList.remove("is-active");
      listBtn.setAttribute("aria-pressed", "false");
    });

    listBtn.addEventListener("click", function () {
      grid.classList.add("is-list-view");
      listBtn.classList.add("is-active");
      listBtn.setAttribute("aria-pressed", "true");
      gridBtn.classList.remove("is-active");
      gridBtn.setAttribute("aria-pressed", "false");
    });
  }

  function initSofaModal() {
    var grid = document.getElementById("sfProductGrid");
    var categoryView = document.getElementById("sfCategoryView");
    var detailView = document.getElementById("sfDetailView");
    var notFoundView = document.getElementById("sfNotFoundView");
    if (!grid || !categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("sfDetailBreadcrumbName");
    var mainImage = document.getElementById("sfModalMainImage");
    var thumbsWrap = document.getElementById("sfModalThumbs");
    var prevBtn = document.getElementById("sfGalleryPrev");
    var nextBtn = document.getElementById("sfGalleryNext");
    var zoomBtn = document.getElementById("sfGalleryZoom");
    var titleEl = document.getElementById("sfModalTitle");
    var starsEl = document.getElementById("sfModalStars");
    var reviewCountEl = document.getElementById("sfModalReviewCount");
    var priceEl = document.getElementById("sfModalPrice");
    var prevPriceEl = document.getElementById("sfModalPrevPrice");
    var monthlyEl = document.getElementById("sfModalMonthly");
    var descriptionEl = document.getElementById("sfModalDescription");
    var featuresEl = document.getElementById("sfModalFeatures");
    var fabricsEl = document.getElementById("sfModalFabrics");
    var relatedEl = document.getElementById("sfModalRelated");
    var qtyValueEl = document.getElementById("sfQtyValue");
    var qtyMinus = document.getElementById("sfQtyMinus");
    var qtyPlus = document.getElementById("sfQtyPlus");
    var addToCartBtn = document.getElementById("sfAddToCart");
    var buyNowBtn = document.getElementById("sfBuyNow");
    var purchaseMessage = document.getElementById("sfPurchaseMessage");
    var lightbox = document.getElementById("sfLightbox");
    var lightboxImage = document.getElementById("sfLightboxImage");
    var lightboxClose = document.getElementById("sfLightboxClose");

    function currentSlugFromHash() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function renderGallery() {
      var product = SF_PRODUCTS[sfModalState.slug];
      if (!product) return;

      mainImage.src = product.images[sfModalState.imageIndex];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      product.images.forEach(function (imgSrc, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === sfModalState.imageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + imgSrc + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          sfModalState.imageIndex = index;
          renderGallery();
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function renderFabrics() {
      fabricsEl.innerHTML = "";
      if (!SOFA_FABRIC_OPTIONS || SOFA_FABRIC_OPTIONS.length === 0) {
        fabricsEl.parentElement.hidden = true;
        return;
      }
      fabricsEl.parentElement.hidden = false;

      // Same 8 fabric/colour options shown on every sofa's detail page.
      // fabric.image is used directly as the <img> src below — to swap
      // a photo, just change the "image" path in SOFA_FABRIC_OPTIONS.
      SOFA_FABRIC_OPTIONS.forEach(function (fabric, index) {
        var isSelected = sfModalState.selectedFabric === fabric.name;
        if (sfModalState.selectedFabric === null && index === 0) {
          sfModalState.selectedFabric = fabric.name;
          isSelected = true;
        }

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fabric-swatch";
        btn.setAttribute("aria-pressed", String(isSelected));
        btn.setAttribute("aria-label", "Select " + fabric.name);
        btn.innerHTML =
          '<span class="fabric-swatch__ring">' +
            '<img src="' + fabric.image + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
            '<span class="fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="fabric-swatch__name">' + fabric.name + '</span>';

        btn.addEventListener("click", function () {
          var alreadySelected = sfModalState.selectedFabric === fabric.name;

          qsa(".fabric-swatch", fabricsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });

          if (alreadySelected) {
            sfModalState.selectedFabric = null;
          } else {
            sfModalState.selectedFabric = fabric.name;
            btn.setAttribute("aria-pressed", "true");
          }
        });

        fabricsEl.appendChild(btn);
      });
    }

    function renderRelated() {
      var product = SF_PRODUCTS[sfModalState.slug];
      relatedEl.innerHTML = "";
      if (!product) return;

      var otherSlugs = Object.keys(SF_PRODUCTS).filter(function (slug) {
        return slug !== sfModalState.slug;
      });

      otherSlugs.forEach(function (slug) {
        var related = SF_PRODUCTS[slug];
        var item = document.createElement("a");
        item.href = "sofas.html#/" + slug;
        item.className = "bb-modal__related-item";
        item.innerHTML =
          '<img src="' + related.images[0] + '" alt="' + related.name + '" loading="lazy" />' +
          '<span>' + related.name + '</span>';
        relatedEl.appendChild(item);
      });
    }

    function renderDetail(product) {
      titleEl.textContent = product.name;
      if (breadcrumbName) breadcrumbName.textContent = product.name;
      starsEl.textContent = sfStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      priceEl.textContent = sfMoney(product.price);
      prevPriceEl.textContent = product.prev ? sfMoney(product.prev) : "";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      renderGallery();
      renderFabrics();
      renderRelated();

      qtyValueEl.textContent = String(sfModalState.quantity);
      purchaseMessage.textContent = "";
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      renderDetail(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function handleRoute() {
      // Defensive: always release the mobile-menu scroll lock and close
      // the drawer on every route change (see blanket-boxes.js for full
      // explanation of why this is needed).
      document.body.style.overflow = "";
      var mobileDrawer = document.getElementById("mobileNav");
      var mobileOverlay = document.getElementById("mobileNavOverlay");
      var hamburgerBtn = document.getElementById("hamburgerBtn");
      if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
        mobileDrawer.classList.remove("is-open");
        mobileDrawer.setAttribute("aria-hidden", "true");
        if (mobileOverlay) mobileOverlay.classList.remove("is-visible");
        if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
      }

      var slug = currentSlugFromHash();
      if (!slug) {
        sfModalState.slug = null;
        showCategory();
        return;
      }

      var product = SF_PRODUCTS[slug];
      if (!product) {
        showNotFound();
        return;
      }

      sfModalState.slug = slug;
      sfModalState.imageIndex = 0;
      sfModalState.quantity = 1;
      sfModalState.selectedFabric = null;
      showDetail(product);
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        lightbox.hidden = true;
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var product = SF_PRODUCTS[sfModalState.slug];
        if (!product) return;
        sfModalState.imageIndex = (sfModalState.imageIndex - 1 + product.images.length) % product.images.length;
        renderGallery();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var product = SF_PRODUCTS[sfModalState.slug];
        if (!product) return;
        sfModalState.imageIndex = (sfModalState.imageIndex + 1) % product.images.length;
        renderGallery();
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function () {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.hidden = false;
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", function () {
        lightbox.hidden = true;
      });
    }

    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.hidden = true;
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (sfModalState.quantity > 1) {
          sfModalState.quantity -= 1;
          qtyValueEl.textContent = String(sfModalState.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        sfModalState.quantity += 1;
        qtyValueEl.textContent = String(sfModalState.quantity);
      });
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        var product = SF_PRODUCTS[sfModalState.slug];
        if (!product) return;

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "sofa-" + sfModalState.slug,
              slug: sfModalState.slug,
              name: product.name,
              url: "sofas.html#/" + sfModalState.slug,
              image: product.images && product.images.length ? product.images[0] : "",
              alt: product.name,
              price: product.price,
              category: "Sofas",
              variant: {
                fabric: sfModalState.selectedFabric || null
              }
            },
            sfModalState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Cart clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        purchaseMessage.textContent = "Added " + sfModalState.quantity + " to your cart in " + (sfModalState.selectedFabric || "the selected fabric") + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        purchaseMessage.textContent = "Taking you to checkout for " + sfModalState.quantity + " item(s)...";
      });
    }
  }

  function initSofaReviewCarousel() {
    var carousel = document.getElementById("sfReviewCarousel");
    var track = document.getElementById("sfReviewTrack");
    var dotsWrap = document.getElementById("sfReviewDots");
    var prevBtn = document.getElementById("sfReviewPrev");
    var nextBtn = document.getElementById("sfReviewNext");
    if (!carousel || !track || !dotsWrap) return;

    var slides = qsa(".fabric-review-carousel__slide", track);
    if (slides.length === 0) return;

    var current = 0;
    var dots = [];

    slides.forEach(function (slide, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "fabric-review-carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show review " + (index + 1));
      dot.addEventListener("click", function () {
        goTo(index);
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
      track.style.transform = "translateX(-" + current * 100 + "%)";
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    goTo(0);
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

  function obMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function obStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
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
    initSofaFilters();
    initSofaViewToggle();
    initSofaModal();
    initMattressHelp();
    initStorageDrawersFaq();
    initSofaReviewCarousel();
  });
})();