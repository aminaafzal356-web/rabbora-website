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
    "price": 999.00,
    "prev": 1998.0,
    "monthly": 84,
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
    "price": 799.00,
    "prev": null,
    "monthly": 67,
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
    "price": 799.00,
    "prev": null,
    "monthly": 67,
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
    "price": 999.00,
    "prev": 1998.0,
    "monthly": 84,
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

  var SF_SIZE_OPTIONS = ["2 Seater Sofa", "3 Seater Sofa", "3+2 Seater", "Left Corner Sofa", "Right Corner Sofa"];

  // Exact price of every size each sofa is sold in (current Pascal Beds
  // prices, 26 Sep 2026). Only these sizes are shown for that sofa.
  var SF_SIZE_PRICES = {
    "chesterfield-3-seater-sofa": { "2 Seater Sofa": 999, "3 Seater Sofa": 1199 }, // Rabbora #1 = Pascal #3 PSCL Teddy-Cubex 3 Seater Square Panel Sofa (Teddy-Boucle Cream Fabric)
    "chelsea-corner-sofa": { "2 Seater Sofa": 799, "3 Seater Sofa": 999, "Left Corner Sofa": 1499, "Right Corner Sofa": 1499 }, // Rabbora #2 = Pascal #8 PSCL Model A - Sprung Handmade Sofa
    "hampton-2-seater-sofa": { "2 Seater Sofa": 799, "3 Seater Sofa": 949, "3+2 Seater": 1599, "Left Corner Sofa": 1499, "Right Corner Sofa": 1499 }, // Rabbora #3 = Pascal #2 PSCL Model C - Handmade Sofa with Comfort Dynamics
    "harlow-modular-sofa": { "2 Seater Sofa": 999, "3 Seater Sofa": 1199 } // Rabbora #4 = Pascal #6 PSCL Teddy-Cubex Dark 3 Seater Square Panel Sofa (Teddy-Boucle Black Fabric)
  };

  // Original (crossed-out) price of each size, where Pascal shows one.
  // Old (crossed-out) price per size. Only the 1st and 4th sofas are on a
  // 50% sale: old price = sale price / 0.50 (sale price x 2).
  var SF_SIZE_OLD_PRICES = {
    "chesterfield-3-seater-sofa": { "2 Seater Sofa": 1998, "3 Seater Sofa": 2398 },
    "harlow-modular-sofa": { "2 Seater Sofa": 1998, "3 Seater Sofa": 2398 }
  };

  // Sizes offered for one sofa, in the usual order.
  function sfSizesFor(slug) {
    var map = SF_SIZE_PRICES[slug];
    if (!map) return SF_SIZE_OPTIONS.slice();
    return SF_SIZE_OPTIONS.filter(function (size) { return typeof map[size] === "number"; });
  }

  // Price of one size; with no size selected, the sofa's "from" price.
  function sfSizePrice(slug, product, size) {
    // A sofa loaded from the backend API carries its own size prices.
    if (size && product && product.sizePrices && typeof product.sizePrices[size] === "number") return product.sizePrices[size];
    var map = SF_SIZE_PRICES[slug];
    if (size && map && typeof map[size] === "number") return map[size];
    return product.price;
  }

  // Crossed-out price for one size (or the "from" price's one).
  function sfSizeOldPrice(slug, product, size, sizePrice) {
    // A size listed in SF_SIZE_OLD_PRICES uses that old price.
    var listed = (size && SF_SIZE_OLD_PRICES[slug]) ? SF_SIZE_OLD_PRICES[slug][size] : null;
    if (typeof listed === "number") return listed > sizePrice ? listed : null;
    if (size && product && product.sizeOldPrices) {
      // Sofa from the backend API: each size has its own compare-at price.
      var apiOld = product.sizeOldPrices[size];
      return (apiOld && apiOld > sizePrice) ? apiOld : null;
    }
    var olds = SF_SIZE_OLD_PRICES[slug];
    var old = (size && olds) ? olds[size] : (size && SF_SIZE_PRICES[slug] ? null : product.prev);
    return (old && old > sizePrice) ? old : null;
  }

var FABRIC_COLLECTIONS = [
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
    selectedSize: null,
    selectedFabric: null,
    selectedFabricSlug: null,
    selectedFabricImage: null
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
    var fabricSelectedStatusEl = document.getElementById("sfFabricSelectedStatus");
    var sizeOptionsEl = document.getElementById("sfSizeOptions");
    var sizeSelectedStatusEl = document.getElementById("sfSizeSelectedStatus");
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
      var product = sfCurrentProduct();
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

    function updateSizeSelectedStatus() {
      if (!sizeSelectedStatusEl) return;
      if (sfModalState.selectedSize) {
        sizeSelectedStatusEl.textContent = "Selected: " + sfModalState.selectedSize;
        sizeSelectedStatusEl.classList.remove("is-empty");
      } else {
        sizeSelectedStatusEl.textContent = "No size selected yet";
        sizeSelectedStatusEl.classList.add("is-empty");
      }
    }


    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always shows the price of the size that is currently selected, and
    // nothing while no size is selected. The crossed-out price is only
    // shown when the product data has a real original price for that
    // size (the stored oldPrice belongs to the base size, i.e. the size
    // with no price difference) and it is higher than the price.
    // ---- Price area: selected size, current price, crossed-out old
    // price, "% off" and monthly amount ----
    // Same presentation on every product page. Nothing here changes a
    // price: every number comes from this page's existing price logic.
    // - Old price: only the real old/compare-at price of the selected size
    //   (API compare_at_price, or this file's own fallback rule). None ->
    //   no crossed-out price and no "% off".
    // - Paid add-ons (e.g. Assembly): the old price belongs to the size
    //   price only, so it stays on the size-price line and is not shown
    //   next to the final price while an add-on is included.
    // - "% off" = round((old - price) / old * 100), from real prices only.
    // - Monthly = final displayed price / 12, rounded up to the next whole
    //   pound (the rule every existing "or from £X/month" value follows,
    //   e.g. £249 -> £21). Add-ons included. No finance provider named.
    function rbDiscountPercent(oldPrice, price) {
      if (!oldPrice || !price || oldPrice <= price) return null;
      var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
      return pct > 0 ? pct : null;
    }

    function rbMonthlyAmount(price) {
      // In pence, so e.g. 300 / 12 stays exactly 25.
      return Math.ceil(Math.round(price * 100) / 1200);
    }

    // "% off" text beside a crossed-out price (created once, by script,
    // so no HTML/CSS file has to change).
    function rbDiscountEl(container, afterEl) {
      if (!container) return null;
      var el = container.querySelector("[data-rb-discount]");
      if (!el) {
        el = document.createElement("span");
        el.setAttribute("data-rb-discount", "");
        el.style.marginLeft = "0.5rem";
        el.style.fontSize = "0.8rem";
        el.style.fontWeight = "600";
        if (afterEl && afterEl.parentNode === container) {
          container.insertBefore(el, afterEl.nextSibling);
        } else {
          container.appendChild(el);
        }
      }
      return el;
    }

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

    // o = { priceEl, prevEl, monthlyEl, finalPrice, sizePrice, oldPrice,
    //       sizeKey, sizeOptions, sizeRow, money, noSizeLabel }
    function rbUpdatePriceArea(o) {
      var validOld = (o.oldPrice && o.oldPrice > o.sizePrice) ? o.oldPrice : null;
      var hasAddons = Math.round(o.finalPrice * 100) !== Math.round(o.sizePrice * 100);

      // Main (final) price: crossed-out old price + "% off" only while no
      // paid add-on is included.
      var mainOld = (validOld && !hasAddons) ? validOld : null;
      if (o.prevEl) {
        o.prevEl.textContent = mainOld ? o.money(mainOld) : "";
        var mainPctEl = rbDiscountEl(o.prevEl.parentNode, o.prevEl);
        var mainPct = rbDiscountPercent(mainOld, o.finalPrice);
        if (mainPctEl) mainPctEl.textContent = mainPct ? mainPct + "% off" : "";
      }

      // Monthly amount from the final displayed price. Pages without a
      // monthly line get one right under the main price row.
      var monthlyEl = o.monthlyEl;
      if (!monthlyEl && o.priceEl && o.priceEl.parentNode && o.priceEl.parentNode.parentNode) {
        var row = o.priceEl.parentNode;
        monthlyEl = row.nextElementSibling && row.nextElementSibling.hasAttribute("data-rb-monthly")
          ? row.nextElementSibling : null;
        if (!monthlyEl) {
          monthlyEl = document.createElement("p");
          monthlyEl.className = "product-card__monthly bb-modal__monthly";
          monthlyEl.setAttribute("data-rb-monthly", "");
          row.parentNode.insertBefore(monthlyEl, row.nextSibling);
        }
      }
      if (monthlyEl && typeof o.finalPrice === "number" && isFinite(o.finalPrice) && o.finalPrice > 0) {
        monthlyEl.textContent = "or from £" + rbMonthlyAmount(o.finalPrice) + "/month";
      }

      // Size-price line (below the size buttons): selected size, size
      // price, its real old price and "% off".
      if (o.sizeRow) {
        var rowPctEl = rbDiscountEl(o.sizeRow, null);
        var rowPct = o.sizeKey ? rbDiscountPercent(validOld, o.sizePrice) : null;
        if (rowPctEl) rowPctEl.textContent = rowPct ? rowPct + "% off" : "";
        if (!o.noSizeLabel) rbRenderSizeLabel(o.sizeOptions, o.sizeKey);
      }
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
      }
      if (anchor.nextSibling !== sizePriceRow) {
        anchor.parentNode.insertBefore(sizePriceRow, anchor.nextSibling);
      }
      if (!sizeKey) {
        sizePriceRow.style.display = "none";
        return;
      }
      sizePriceRow.style.display = "";
      sizePriceRow.children[0].textContent = sfMoney(sizePrice);
      sizePriceRow.children[1].textContent =
        (oldPrice && oldPrice > sizePrice) ? sfMoney(oldPrice) : "";
    }

    function currentSizePriceRender() {
      var product = sfCurrentProduct();
      if (!product) { renderSelectedSizePrice(null); return; }
      var sizePrice = sfSizePrice(sfModalState.slug, product, sfModalState.selectedSize);
      var validOldPrice = sfSizeOldPrice(sfModalState.slug, product, sfModalState.selectedSize, sizePrice);
      renderSelectedSizePrice(sfModalState.selectedSize, sizePrice, validOldPrice);
      // Keep the main price at the top in step with the selected size.
      if (priceEl) priceEl.textContent = sfMoney(sizePrice);
      if (prevPriceEl) prevPriceEl.textContent = validOldPrice ? sfMoney(validOldPrice) : "";
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: sizePrice, sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: sfModalState.selectedSize, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: sfMoney
      });
    }

    function renderSizeOptions() {
      if (!sizeOptionsEl) return;
      sizeOptionsEl.innerHTML = "";

      // Sizes from the backend API when the sofa came from it;
      // otherwise the existing size list as before.
      var sfSizeProduct = sfCurrentProduct();
      var sizes = (sfSizeProduct && sfSizeProduct.availableSizes)
        ? sfSizeProduct.availableSizes.slice()
        : sfSizesFor(sfModalState.slug);
      if (sfModalState.selectedSize && sizes.indexOf(sfModalState.selectedSize) === -1) {
        sfModalState.selectedSize = null;
      }
      sizes.forEach(function (size) {
        var isSelected = sfModalState.selectedSize === size;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "sf-option-pill";
        btn.setAttribute("aria-pressed", String(isSelected));
        btn.setAttribute("aria-label", "Select " + size);
        btn.textContent = size;

        btn.addEventListener("click", function () {
          sfModalState.selectedSize = size;

          qsa(".sf-option-pill", sizeOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");

          updateSizeSelectedStatus();
          currentSizePriceRender();

          if (purchaseMessage && purchaseMessage.classList.contains("is-error")) {
            purchaseMessage.textContent = "";
            purchaseMessage.classList.remove("is-error");
          }
        });

        sizeOptionsEl.appendChild(btn);
      });

      updateSizeSelectedStatus();
    }

    function updateFabricSelectedStatus() {
      if (!fabricSelectedStatusEl) return;
      if (sfModalState.selectedFabric) {
        fabricSelectedStatusEl.textContent = "Selected: " + sfModalState.selectedFabric;
        fabricSelectedStatusEl.classList.remove("is-empty");
      } else {
        fabricSelectedStatusEl.textContent = "No fabric colour selected yet";
        fabricSelectedStatusEl.classList.add("is-empty");
      }
    }

    function renderFabrics() {
      fabricsEl.innerHTML = "";

      // No fabric is pre-selected — the customer must actively choose one
      // (required before Add to Cart; see the addToCartBtn handler below).
      // Same collection-grouped structure and real fabric/ image paths as
      // the working Blanket Box implementation.
      FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl = document.createElement("p");
        titleEl.className = "bb-modal__fabric-collection-title";
        titleEl.textContent = collection.name;
        groupEl.appendChild(titleEl);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var isSelected = sfModalState.selectedFabric === fabric.name;

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
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
              sfModalState.selectedFabricSlug = null;
              sfModalState.selectedFabricImage = null;
            } else {
              sfModalState.selectedFabric = fabric.name;
              sfModalState.selectedFabricSlug = fabric.slug;
              sfModalState.selectedFabricImage = fabric.image;
              btn.setAttribute("aria-pressed", "true");
            }

            updateFabricSelectedStatus();

            if (purchaseMessage && purchaseMessage.classList.contains("is-error")) {
              purchaseMessage.textContent = "";
              purchaseMessage.classList.remove("is-error");
            }
          });

          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricsEl.appendChild(groupEl);
      });

      updateFabricSelectedStatus();
    }

    function renderRelated() {
      var product = sfCurrentProduct();
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
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      priceEl.textContent = sfMoney(product.price);
      prevPriceEl.textContent = (product.prev && product.prev > product.price) ? sfMoney(product.prev) : "";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      renderGallery();
      renderSizeOptions();
      currentSizePriceRender();
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
        "[Rabbora Sofas] api-config.js is not loaded, so product details come from this file only. " +
        "Add <script src=\"api-config.js\"></script> before sofas.js."
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
      var d = rbApiSizeData(baseProduct, apiProduct, false);
      if (!d) return null;
      var merged = rbApiCopy(baseProduct);
      merged.name = apiProduct.name;
      merged.images = d.images;
      merged.availableSizes = d.sizes;
      merged.sizePrices = d.sizePrices;
      merged.sizeOldPrices = d.sizeOldPrices;
      merged.price = d.price;
      // "prev" (the crossed-out price shown before a size is chosen) stays
      // from this file; sized crossed-out prices come from the API.
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

    // The sofa the detail view is currently showing: the merged API
    // product when it belongs to the current slug, otherwise the sofa from
    // SF_PRODUCTS exactly as before. Every detail function below reads it.
    var sfApiDetailProduct = null;
    var sfApiDetailSlug = null;
    function sfCurrentProduct() {
      if (sfApiDetailProduct && sfApiDetailSlug === sfModalState.slug) return sfApiDetailProduct;
      return SF_PRODUCTS[sfModalState.slug];
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
        rbApiRouteId++;
        sfModalState.slug = null;
        showCategory();
        return;
      }

      var product = SF_PRODUCTS[slug];
      if (!product) {
        rbApiRouteId++;
        showNotFound();
        return;
      }

      // Only the newest route may render (ignores late answers).
      var requestId = ++rbApiRouteId;
      rbApiFetch(product, slug).then(function (apiProduct) {
        if (requestId !== rbApiRouteId) return;
        sfApiDetailProduct = apiProduct;
        sfApiDetailSlug = apiProduct ? slug : null;
        sfModalState.slug = slug;
        sfModalState.imageIndex = 0;
        sfModalState.quantity = 1;
        sfModalState.selectedSize = null;
        sfModalState.selectedFabric = null;
        sfModalState.selectedFabricSlug = null;
        sfModalState.selectedFabricImage = null;
        showDetail(apiProduct || product);
      });
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
        var product = sfCurrentProduct();
        if (!product) return;
        sfModalState.imageIndex = (sfModalState.imageIndex - 1 + product.images.length) % product.images.length;
        renderGallery();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var product = sfCurrentProduct();
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
        var product = sfCurrentProduct();
        if (!product) return;

        // Both the sofa size and the fabric colour are required before
        // this item can be added — block the add and show an inline
        // message (matching the site's existing status/error message
        // pattern) instead of adding with a missing option.
        if (!sfModalState.selectedSize) {
          purchaseMessage.classList.add("is-error");
          purchaseMessage.textContent = "Please select a sofa size.";
          return;
        }

        if (!sfModalState.selectedFabric || !sfModalState.selectedFabricSlug) {
          purchaseMessage.classList.add("is-error");
          purchaseMessage.textContent = "Please select a fabric colour.";
          return;
        }

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              // A plain, stable product id — the cart's own buildLineId()
              // already derives a unique line identity from this id PLUS
              // everything inside "variant", so a different size OR a
              // different fabric colour naturally becomes a separate
              // cart line, while the SAME size + SAME colour merges into
              // the existing line instead of duplicating it.
              id: "sofa-" + sfModalState.slug,
              slug: sfModalState.slug,
              name: product.name,
              url: "sofas.html#/" + sfModalState.slug,
              image: product.images && product.images.length ? product.images[0] : "",
              alt: product.name,
              price: sfSizePrice(sfModalState.slug, product, sfModalState.selectedSize),
              category: "Sofas",
              // fabricImage is a plain top-level field (not inside
              // variant) since checkout's buildVariantText() renders
              // every variant key it finds — this is a swatch-image
              // path for Cart/Checkout to optionally show a colour dot,
              // not something a customer should see printed as text.
              fabricImage: sfModalState.selectedFabricImage,
              variant: {
                size: sfModalState.selectedSize,
                fabric: sfModalState.selectedFabric
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

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent = "Added " + sfModalState.quantity + " to your cart \u2014 " + sfModalState.selectedSize + ", " + sfModalState.selectedFabric + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        purchaseMessage.textContent = "Taking you to checkout for " + sfModalState.quantity + " item(s)...";
      });
    }
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


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.bb-modal__rating), which is populated
     separately by renderDetail() once a product is opened. ---- */
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
    initSofaFilters();
    initSofaViewToggle();
    initSofaModal();
    initMattressHelp();
    initStorageDrawersFaq();
  });
})();