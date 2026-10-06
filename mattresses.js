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

  var MATTRESS_PRODUCTS_LIST = 
[
  {
    "id": 1,
    "slug": "bedzone-hybrid-memory-pocket-spring",
    "name": "Bedzone Hybrid Memory Pocket Spring Mattress",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 279,
    "oldPrice": null,
    "monthlyPrice": 24,
    "rating": 5,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Memory foam comfort layer",
      "Breathable knitted cover"
    ],
    "description": "Layered memory foam over individually wrapped pocket springs for balanced support and pressure relief. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Combines springs and foam for balanced support",
      "Reduces motion transfer between sleeping partners",
      "Breathable cover to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#3f6b5e",
    "images": [
      "images/img-23.webp",
        "images/img-142.webp",
      "images/img-143.png"
    ]
   
  },
  {
    "id": 2,
    "slug": "orthopaedic-zero-gravity",
    "name": "Healthopaedic Zero Gravity Orthoflex Mattress",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 389,
    "oldPrice": 699,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 0,
    "badge": "44% Off",
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "High-density support foam",
      "Reinforced firm base layer",
      "Quilted supportive cover"
    ],
    "description": "Firm, structured support engineered to keep the spine aligned through the night. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Firm, structured support for spinal alignment",
      "Dense foam base resists sagging over time",
      "Supportive quilted cover for a stable sleep surface",
      "Well suited to those who prefer a firmer feel"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#4a6b82",
    "images": [
      "images/img-144.webp",
        "images/img-145.webp",
          "images/img-146.png"
    ]
  },
  {
    "id": 3,
    "slug": "pillowtop-2000",
    "name": "Chicago 3000 Pocket Sprung Ultimate Luxury Mattress",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 59,
    "rating": 5,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Temperature-sensitive memory foam",
      "High-resilience support foam base",
      "Soft-touch quilted cover"
    ],
    "description": "A generously padded pillow-top layer for a soft, cushioned sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Slow-responding foam contours to the body",
      "Helps relieve pressure at the hips and shoulders",
      "Reduces motion transfer between sleeping partners",
      "Soft-touch cover for a comfortable sleep surface"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#7d7690",
    "images": [
      "images/img-73.png",
      "images/img-147.webp",
       "images/img-148.jpg"
      

    ]
  },
  {
    "id": 4,
    "slug": "luxury-pocket-spring",
    "name": "Healthopaedic Pillowtop 3000 Mattress",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 599,
    "oldPrice": 899,
    "monthlyPrice": 50,
    "rating": 0,
    "reviewCount": 0,
    "badge": "33% Off",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Natural fibre comfort layer",
      "Quilted knitted cover"
    ],
    "description": "Individually wrapped springs that move independently, reducing partner disturbance. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Individually wrapped springs move independently",
      "Even weight distribution across the sleep surface",
      "Breathable construction to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#a48a6a",
    "images": [
      "images/img-72.png",
      "images/img-149.png",
      "images/img-150.webp"
    ]
  },
  {
    "id": 5,
    "slug": "cloudrest-memory-foam",
    "name": "Healthopedic Zero Gravity ZenFloat 1000 Mattress",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 449,
    "oldPrice": 699,
    "monthlyPrice": 38,
    "rating": 5,
    "reviewCount": 0,
    "badge": "36% Off",
    "firmness": [
      "Soft"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Temperature-sensitive memory foam",
      "High-resilience support foam base",
      "Soft-touch quilted cover"
    ],
    "description": "Slow-responding memory foam that cradles the body and eases pressure points. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Slow-responding foam contours to the body",
      "Helps relieve pressure at the hips and shoulders",
      "Reduces motion transfer between sleeping partners",
      "Soft-touch cover for a comfortable sleep surface"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#7d7690",
    "images": [
      "images/img-74.png",
      "images/img-151.jpg",
      "images/img-152.png"
    ]
  },
  {
    "id": 6,
    "slug": "harmony-hybrid-deluxe",
    "name": "Backcare Luxury 2000 Pocket Mattress",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 359,
    "oldPrice": null,
    "monthlyPrice": 30,
    "rating": 0,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Memory foam comfort layer",
      "Breathable knitted cover"
    ],
    "description": "A refined hybrid construction balancing plush comfort with dependable support. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Combines springs and foam for balanced support",
      "Reduces motion transfer between sleeping partners",
      "Breathable cover to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#3f6b5e",
    "images": [
      "images/img-99.png",
          "images/img-153.jpg",
              "images/img-154.jpg"
    ]
  },
  {
    "id": 7,
    "slug": "firmsupport-orthopaedic-pro",
    "name": "1000 CoolGel Mattress",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 349,
    "oldPrice": null,
    "monthlyPrice": 30,
    "rating": 0,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "High-density support foam",
      "Reinforced firm base layer",
      "Quilted supportive cover"
    ],
    "description": "Dense support layers designed for those who prefer a firmer sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Firm, structured support for spinal alignment",
      "Dense foam base resists sagging over time",
      "Supportive quilted cover for a stable sleep surface",
      "Well suited to those who prefer a firmer feel"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#4a6b82",
    "images": [
      "images/img-78.png",
        "images/img-155.jpg",
          "images/img-156.webp"
    ]
  },
  {
    "id": 8,
    "slug": "serenity-pocket-1000",
    "name": "California Pillow Top Mattress",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 349,
    "oldPrice": null,
    "monthlyPrice": 30,
    "rating": 0,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Natural fibre comfort layer",
      "Quilted knitted cover"
    ],
    "description": "A dependable 1000-count pocket spring mattress offering even, supportive comfort. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Individually wrapped springs move independently",
      "Even weight distribution across the sleep surface",
      "Breathable construction to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#a48a6a",
    "images": [
      "images/img-157.webp",
      "images/img-158.webp",
      "images/img-159.webp"
    ]
  },
  {
    "id": 9,
    "slug": "dreamsoft-memory-foam",
    "name": "Orion 1000 Pocket Sprung Luxury Mattress",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 289,
    "oldPrice": null,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Temperature-sensitive memory foam",
      "High-resilience support foam base",
      "Soft-touch quilted cover"
    ],
    "description": "Soft-touch memory foam layered for a gentle, enveloping feel. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Slow-responding foam contours to the body",
      "Helps relieve pressure at the hips and shoulders",
      "Reduces motion transfer between sleeping partners",
      "Soft-touch cover for a comfortable sleep surface"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#7d7690",
    "images": [
      "images/img-128.jpg",
      "images/img-160.png",
      "images/img-161.png"
    ]
  },
  {
    "id": 10,
    "slug": "everest-hybrid-support",
    "name": "MTRS Comfort Dynamics 1000 Mattress",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 450,
    "oldPrice": 899,
    "monthlyPrice": 38,
    "rating": 0,
    "reviewCount": 0,
    "badge": "50% Off",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Memory foam comfort layer",
      "Breathable knitted cover"
    ],
    "description": "A supportive hybrid build combining foam comfort layers with responsive springs. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Combines springs and foam for balanced support",
      "Reduces motion transfer between sleeping partners",
      "Breathable cover to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#3f6b5e",
    "images": [
      "images/img-126.jfif",
      "images/img-162.png",
      "images/img-163.jpg"
    ]
  },
  {
    "id": 11,
    "slug": "royaltouch-pocket-spring",
    "name": "Bedzone Titanium Ortho 12.5 Mattress",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 279,
    "oldPrice": null,
    "monthlyPrice": 24,
    "rating": 0,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Natural fibre comfort layer",
      "Quilted knitted cover"
    ],
    "description": "A premium pocket spring mattress finished with a plush, quilted sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Individually wrapped springs move independently",
      "Even weight distribution across the sleep surface",
      "Breathable construction to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#a48a6a",
    "images": [
      "images/img-165.png",
      "images/img-166.png",
      "images/img-167.png"
    ]
  },
  {
    "id": 12,
    "slug": "restwell-orthopaedic-classic",
    "name": "Orion 2000 Pocket Sprung Luxury Mattress",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 299,
    "oldPrice": null,
    "monthlyPrice": 25,
    "rating": 0,
    "reviewCount": 0,
    "badge": null,
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "High-density support foam",
      "Reinforced firm base layer",
      "Quilted supportive cover"
    ],
    "description": "Reliable orthopaedic support at an accessible price point. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Firm, structured support for spinal alignment",
      "Dense foam base resists sagging over time",
      "Supportive quilted cover for a stable sleep surface",
      "Well suited to those who prefer a firmer feel"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#4a6b82",
    "images": [
      "images/img-129.jpg",
       "images/img-168.jpg",
        "images/img-169.jpg"
    ]
  },
  {
    "id": 13,
    "slug": "nightcloud-memory-foam-plus",
    "name": "MTRS Atomic Comfort 5000 Mattress",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 899,
    "oldPrice": 1350,
    "monthlyPrice": 75,
    "rating": 0,
    "reviewCount": 0,
    "badge": "33% Off",
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Temperature-sensitive memory foam",
      "High-resilience support foam base",
      "Soft-touch quilted cover"
    ],
    "description": "An upgraded memory foam layer for deeper contouring comfort. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Slow-responding foam contours to the body",
      "Helps relieve pressure at the hips and shoulders",
      "Reduces motion transfer between sleeping partners",
      "Soft-touch cover for a comfortable sleep surface"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#7d7690",
    "images": [
      "images/img-124.jfif",
      "images/img-170.png",
      "images/img-171.png"
   
    ]
  },
  {
    "id": 14,
    "slug": "coastal-hybrid-breeze",
    "name": "MTRS Comfort Dynamics 2000 Pocket Mattress",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 599,
    "oldPrice": 899,
    "monthlyPrice": 50,
    "rating": 0,
    "reviewCount": 0,
    "badge": "33% Off",
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Memory foam comfort layer",
      "Breathable knitted cover"
    ],
    "description": "A breathable hybrid mattress designed to help regulate temperature through the night. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Combines springs and foam for balanced support",
      "Reduces motion transfer between sleeping partners",
      "Breathable cover to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#3f6b5e",
    "images": [
      "images/img-130.webp",
      "images/img-172.png",
      "images/img-173.png"
    ]
  },
  {
    "id": 15,
    "slug": "pureposture-orthopaedic",
    "name": "MTRS Atomic Comfort 3000 Mattress",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 675,
    "oldPrice": 1100,
    "monthlyPrice": 57,
    "rating": 0,
    "reviewCount": 0,
    "badge": "39% Off",
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "High-density support foam",
      "Reinforced firm base layer",
      "Quilted supportive cover"
    ],
    "description": "Posture-focused support built for consistent spinal alignment. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Firm, structured support for spinal alignment",
      "Dense foam base resists sagging over time",
      "Supportive quilted cover for a stable sleep surface",
      "Well suited to those who prefer a firmer feel"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#4a6b82",
    "images": [
      "images/img-131.webp",
      "images/img-150.webp",
      "images/img-162.png"
    
    ]
  },
  {
    "id": 16,
    "slug": "signature-pocket-2000",
    "name": "MTRS Lux Comfort 9000 Mattress",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 1550,
    "oldPrice": 2100,
    "monthlyPrice": 130,
    "rating": 0,
    "reviewCount": 0,
    "badge": "26% Off",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Small Double",
      "Double",
      "King Size",
      "Super King"
    ],
    "materials": [
      "Individually wrapped pocket springs",
      "Natural fibre comfort layer",
      "Quilted knitted cover"
    ],
    "description": "Our most advanced pocket spring construction, with 2000 individually wrapped coils. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come.",
    "features": [
      "Individually wrapped springs move independently",
      "Even weight distribution across the sleep surface",
      "Breathable construction to help regulate temperature",
      "Reinforced edges for consistent support to the perimeter"
    ],
    "warranty": "24 month warranty",
    "delivery": "Free UK delivery, rolled and boxed for easy access",
    "colour": "#a48a6a",
    "images": [
      "images/img-79.png",
      "images/img-174.png",
      "images/img-163.jpg"
      
    ]
  }
];

  var MATTRESS_PRODUCTS = {};
  MATTRESS_PRODUCTS_LIST.forEach(function (p) {
    MATTRESS_PRODUCTS[p.slug] = p;
  });

  // "Single" is no longer an offered size. The remaining four keep their
  // existing price deltas exactly as before ("King" renamed to "King
  // Size" — same £80 uplift, not a new price).
  var MATTRESS_SIZE_DELTAS = {
    "Small Double": -40,
    "Double": 0,
    "King Size": 80,
    "Super King": 150
  };

  // Exact per-size prices (current Pascal Beds prices for the matching
  // mattresses). A product listed here uses these prices instead of the
  // deltas above; product.price is its cheapest size (Small Double).
  var MATTRESS_SIZE_PRICES = {
    "bedzone-hybrid-memory-pocket-spring": { "Small Double": 279, "Double": 299, "King Size": 349, "Super King": 399 }, // Bedzone Hybrid Memory Pocket Spring [Medium]
    "orthopaedic-zero-gravity": { "Small Double": 389, "Double": 429, "King Size": 529, "Super King": 599 }, // Healthopaedic Zero Gravity Orthoflex
    "pillowtop-2000": { "Small Double": 699, "Double": 729, "King Size": 799, "Super King": 899 }, // Chicago 3000 Pocket Sprung Ultimate Luxury
    "luxury-pocket-spring": { "Small Double": 599, "Double": 629, "King Size": 749, "Super King": 888 }, // Healthopaedic Pillowtop 3000
    "cloudrest-memory-foam": { "Small Double": 449, "Double": 469, "King Size": 549, "Super King": 649 }, // Healthopedic Zero Gravity ZenFloat 1000
    "harmony-hybrid-deluxe": { "Small Double": 359, "Double": 359, "King Size": 399, "Super King": 449 }, // Backcare Luxury 2000 Pocket
    "firmsupport-orthopaedic-pro": { "Small Double": 349, "Double": 349, "King Size": 399, "Super King": 449 }, // 1000 CoolGel [Medium to Firm]
    "serenity-pocket-1000": { "Small Double": 349, "Double": 349, "King Size": 399, "Super King": 449 }, // California Pillow Top FIRM
    "dreamsoft-memory-foam": { "Small Double": 289, "Double": 329, "King Size": 399, "Super King": 429 }, // Orion 1000 Pocket Sprung Luxury
    "everest-hybrid-support": { "Small Double": 450, "Double": 450, "King Size": 530, "Super King": 630 }, // MTRS Comfort Dynamics 1000
    "royaltouch-pocket-spring": { "Small Double": 279, "Double": 299, "King Size": 349, "Super King": 399 }, // Bedzone Titanium Ortho 12.5 [FIRM]
    "restwell-orthopaedic-classic": { "Small Double": 299, "Double": 369, "King Size": 399, "Super King": 499 }, // Orion 2000 Pocket Sprung Luxury
    "nightcloud-memory-foam-plus": { "Small Double": 899, "Double": 899, "King Size": 1049, "Super King": 1099 }, // MTRS Atomic Comfort 5000
    "coastal-hybrid-breeze": { "Small Double": 599, "Double": 699, "King Size": 699, "Super King": 799 }, // MTRS Comfort Dynamics 2000 Pocket Firm
    "pureposture-orthopaedic": { "Small Double": 675, "Double": 675, "King Size": 775, "Super King": 849 }, // MTRS Atomic Comfort 3000
    "signature-pocket-2000": { "Small Double": 1550, "Double": 1550, "King Size": 1799, "Super King": 1899 }  // MTRS Lux Comfort 9000
  };

  // Price of one size (before any add-ons). With no size selected this is
  // the product's base price.
  function mtSizePrice(product, size) {
    // A product loaded from the backend API carries its own size prices.
    if (size && product.sizePrices && typeof product.sizePrices[size] === "number") return product.sizePrices[size];
    var map = MATTRESS_SIZE_PRICES[product.slug];
    if (size && map && typeof map[size] === "number") return map[size];
    var delta = size ? (MATTRESS_SIZE_DELTAS[size] || 0) : 0;
    return Math.max(0, product.price + delta);
  }

  var MATTRESS_SIZE_DIMENSIONS = {
    "Small Double": "120 x 190cm",
    "Double": "135 x 190cm",
    "King Size": "150 x 200cm",
    "Super King": "180 x 200cm"
  };

  function mtMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function mtStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  var mtState = {
    page: 1,
    category: "all",
    selectedSize: null,
    selectedFirmness: null,
    quantity: 1,
    detailImageIndex: 0
  };

  function initMattressFilters() {
    var grid = document.getElementById("mtProductGrid");
    if (!grid) return;

    var typeSelect = document.getElementById("mtTypeSelect");
    var firmnessSelect = document.getElementById("mtFirmnessSelect");
    var sizeSelect = document.getElementById("mtSizeSelect");
    var priceSelect = document.getElementById("mtPriceSelect");
    var ratingSelect = document.getElementById("mtRatingSelect");
    var sortSelect = document.getElementById("mtSortSelect");
    var categoryPills = qsa(".mt-category-pill");

    var filtersBtn = document.getElementById("mtFiltersBtn");
    var filtersCountEl = document.getElementById("mtFiltersCount");
    var drawer = document.getElementById("mtFilterDrawer");
    var drawerClose = document.getElementById("mtFilterDrawerClose");
    var overlay = document.getElementById("mtFilterOverlay");
    var applyBtn = document.getElementById("mtApplyFilters");
    var clearBtn = document.getElementById("mtClearFilters");
    var productCountEl = document.getElementById("mtProductCount");
    var fallbackNote = document.getElementById("mtFallbackNote");
    var pagination = document.getElementById("mtPagination");
    var pagePrevBtn = document.getElementById("mtPagePrev");
    var pageNextBtn = document.getElementById("mtPageNext");
    var pageButtons = qsa(".mt-pagination__page", pagination);

    var PAGE_SIZE = 12;
    var cards = qsa(".mt-product-card", grid);

    function priceInRange(price, range) {
      if (range === "all") return true;
      if (range === "under-350") return price < 350;
      if (range === "350-550") return price >= 350 && price <= 550;
      if (range === "over-550") return price > 550;
      return true;
    }

    function getFilterState() {
      return {
        category: mtState.category,
        type: typeSelect ? typeSelect.value : "all",
        firmness: firmnessSelect ? firmnessSelect.value : "all",
        size: sizeSelect ? sizeSelect.value : "all",
        price: priceSelect ? priceSelect.value : "all",
        rating: ratingSelect ? ratingSelect.value : "all"
      };
    }

    function cardHasFirmness(card, firmness) {
      if (firmness === "all") return true;
      var options = (card.dataset.firmness || "").split("|");
      return options.indexOf(firmness) !== -1;
    }

    function cardMatches(card, state) {
      var typeMatch = state.type === "all" || card.dataset.type === state.type;
      var categoryMatch = state.category === "all" || card.dataset.type === state.category;
      return (
        typeMatch &&
        categoryMatch &&
        cardHasFirmness(card, state.firmness) &&
        (state.size === "all" || true) && // every mattress offers every size
        priceInRange(parseFloat(card.dataset.price), state.price) &&
        (state.rating === "all" || parseInt(card.dataset.rating, 10) >= parseInt(state.rating, 10))
      );
    }

    function cardScore(card, state) {
      var score = 0;
      if (state.category !== "all" && card.dataset.type === state.category) score += 60;
      if (state.type !== "all" && card.dataset.type === state.type) score += 60;
      if (state.firmness !== "all" && cardHasFirmness(card, state.firmness)) score += 25;
      if (state.rating !== "all" && parseInt(card.dataset.rating, 10) >= parseInt(state.rating, 10)) score += 10;
      if (priceInRange(parseFloat(card.dataset.price), state.price)) score += 1;
      return score;
    }

    function activeFilterCount(state) {
      var count = 0;
      if (state.type !== "all") count += 1;
      if (state.firmness !== "all") count += 1;
      if (state.size !== "all") count += 1;
      if (state.price !== "all") count += 1;
      if (state.rating !== "all") count += 1;
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
      var order = MATTRESS_PRODUCTS_LIST.map(function (p) { return p.slug; });

      sorted.sort(function (a, b) {
        var priceA = parseFloat(a.dataset.price);
        var priceB = parseFloat(b.dataset.price);
        if (mode === "price-asc") return priceA - priceB;
        if (mode === "price-desc") return priceB - priceA;
        if (mode === "rating") return parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10);
        if (mode === "newest") return order.indexOf(b.dataset.slug) - order.indexOf(a.dataset.slug);
        if (mode === "bestselling") {
          var aBadge = MATTRESS_PRODUCTS[a.dataset.slug].badge === "Best Seller" ? 0 : 1;
          var bBadge = MATTRESS_PRODUCTS[b.dataset.slug].badge === "Best Seller" ? 0 : 1;
          return aBadge - bBadge;
        }
        // "featured" — original catalogue order.
        return parseInt(a.dataset.order, 10) - parseInt(b.dataset.order, 10);
      });

      return sorted;
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      pageButtons.forEach(function (btn) {
        var page = parseInt(btn.dataset.page, 10);
        btn.hidden = page > totalPages;
        btn.classList.toggle("is-active", page === mtState.page);
        btn.setAttribute("aria-current", page === mtState.page ? "page" : "false");
      });
      if (pagePrevBtn) pagePrevBtn.disabled = mtState.page <= 1;
      if (pageNextBtn) pageNextBtn.disabled = mtState.page >= totalPages;
      pagination.hidden = totalPages <= 1;
    }

    // Never shows a fully empty grid: if no card matches every active
    // filter exactly, fall back to the closest-scoring cards instead,
    // prioritising Category/Type, then Firmness, Rating and Price.
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
        usedFallback = activeFilterCount(state) > 0 || state.category !== "all";
      }

      var sortMode = sortSelect ? sortSelect.value : "featured";
      matched = sortCards(matched, sortMode);

      if (resetPage) mtState.page = 1;

      var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
      if (mtState.page > totalPages) mtState.page = totalPages;

      var startIndex = (mtState.page - 1) * PAGE_SIZE;
      var pageItems = matched.slice(startIndex, startIndex + PAGE_SIZE);

      cards.forEach(function (card) {
        card.hidden = pageItems.indexOf(card) === -1;
      });

      // Keep DOM order matching the sorted/paginated order for a clean
      // visual result and correct tab order.
      pageItems.forEach(function (card) {
        grid.appendChild(card);
      });

      if (fallbackNote) fallbackNote.hidden = !usedFallback;

      if (productCountEl) {
        if (matched.length === 0) {
          productCountEl.textContent = "0 mattresses";
        } else {
          var from = startIndex + 1;
          var to = Math.min(startIndex + PAGE_SIZE, matched.length);
          productCountEl.textContent = "Showing " + from + "\u2013" + to + " of " + matched.length + " mattresses";
        }
      }

      renderPagination(totalPages);
      updateFiltersCountBadge(state);
    }

    [typeSelect, firmnessSelect, sizeSelect, priceSelect, ratingSelect].forEach(function (select) {
      if (select) select.addEventListener("change", function () { applyFilters(true); });
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", function () { applyFilters(false); });
    }

    categoryPills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        categoryPills.forEach(function (el) { el.classList.remove("is-active"); });
        pill.classList.add("is-active");
        mtState.category = pill.dataset.category;
        if (typeSelect) {
          typeSelect.value = pill.dataset.category === "all" ? "all" : pill.dataset.category;
        }
        applyFilters(true);
      });
    });

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener("click", function () {
        if (mtState.page > 1) {
          mtState.page -= 1;
          applyFilters(false);
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    if (pageNextBtn) {
      pageNextBtn.addEventListener("click", function () {
        mtState.page += 1;
        applyFilters(false);
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    pageButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        mtState.page = parseInt(btn.dataset.page, 10);
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
        [typeSelect, firmnessSelect, sizeSelect, priceSelect, ratingSelect].forEach(function (select) {
          if (select) select.value = "all";
        });
        categoryPills.forEach(function (el) { el.classList.remove("is-active"); });
        var allPill = categoryPills.filter(function (el) { return el.dataset.category === "all"; })[0];
        if (allPill) allPill.classList.add("is-active");
        mtState.category = "all";
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

  function initMattressViewToggle() {
    var grid = document.getElementById("mtProductGrid");
    var gridBtn = document.getElementById("mtGridViewBtn");
    var largeBtn = document.getElementById("mtLargeGridViewBtn");
    var listBtn = document.getElementById("mtListViewBtn");
    if (!grid || !gridBtn || !largeBtn || !listBtn) return;

    var buttons = [gridBtn, largeBtn, listBtn];

    function setActive(activeBtn) {
      buttons.forEach(function (btn) {
        var isActive = btn === activeBtn;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    }

    gridBtn.addEventListener("click", function () {
      grid.classList.remove("is-list-view", "is-large-grid");
      setActive(gridBtn);
    });

    largeBtn.addEventListener("click", function () {
      grid.classList.remove("is-list-view");
      grid.classList.add("is-large-grid");
      setActive(largeBtn);
    });

    listBtn.addEventListener("click", function () {
      grid.classList.remove("is-large-grid");
      grid.classList.add("is-list-view");
      setActive(listBtn);
    });
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

  function initMattressDetail() {
    var categoryView = document.getElementById("mtCategoryView");
    var detailView = document.getElementById("mtDetailView");
    var notFoundView = document.getElementById("mtNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("mtDetailBreadcrumbName");
    var mainImage = document.getElementById("mtGalleryMainImage");
    var thumbsWrap = document.getElementById("mtGalleryThumbs");
    var prevBtn = document.getElementById("mtGalleryPrev");
    var nextBtn = document.getElementById("mtGalleryNext");
    var zoomBtn = document.getElementById("mtGalleryZoom");
    var typeEl = document.getElementById("mtDetailType");
    var titleEl = document.getElementById("mtDetailTitle");
    var starsEl = document.getElementById("mtDetailStars");
    var reviewCountEl = document.getElementById("mtDetailReviewCount");
    var priceEl = document.getElementById("mtDetailPrice");
    var prevPriceEl = document.getElementById("mtDetailPrevPrice");
    var monthlyEl = document.getElementById("mtDetailMonthly");
    var descriptionEl = document.getElementById("mtDetailDescription");
    var sizeOptionsEl = document.getElementById("mtSizeOptions");
    var firmnessOptionsEl = document.getElementById("mtFirmnessOptions");
    var featuresEl = document.getElementById("mtDetailFeatures");
    var materialsEl = document.getElementById("mtDetailMaterials");
    var deliveryEl = document.getElementById("mtDetailDelivery");
    var warrantyEl = document.getElementById("mtDetailWarranty");
    var relatedEl = document.getElementById("mtDetailRelated");
    var qtyValueEl = document.getElementById("mtQtyValue");
    var qtyMinus = document.getElementById("mtQtyMinus");
    var qtyPlus = document.getElementById("mtQtyPlus");
    var addToCartBtn = document.getElementById("mtAddToCart");
    var buyNowBtn = document.getElementById("mtBuyNow");
    var wishlistBtn = document.getElementById("mtDetailWishlist");
    var purchaseMessage = document.getElementById("mtPurchaseMessage");
    var lightbox = document.getElementById("mtLightbox");
    var lightboxImage = document.getElementById("mtLightboxImage");
    var lightboxClose = document.getElementById("mtLightboxClose");

    function currentPrice(product) {
      return mtSizePrice(product, mtState.selectedSize);
    }

    function renderGallery(product) {
      mainImage.src = product.images[mtState.detailImageIndex];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      product.images.forEach(function (imgSrc, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === mtState.detailImageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + imgSrc + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          mtState.detailImageIndex = index;
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
      sizePriceRow.children[0].textContent = mtMoney(sizePrice);
      sizePriceRow.children[1].textContent =
        (oldPrice && oldPrice > sizePrice) ? mtMoney(oldPrice) : "";
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.availableSizes.forEach(function (size) {
        var dimensions = MATTRESS_SIZE_DIMENSIONS[size];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.dataset.size = size;
        btn.setAttribute("aria-pressed", String(mtState.selectedSize === size));
        btn.textContent = (product.sizeLabels && product.sizeLabels[size]) || (dimensions ? size + " \u2014 " + dimensions : size);
        btn.addEventListener("click", function () {
          mtState.selectedSize = size;
          purchaseMessage.textContent = "";
          purchaseMessage.classList.remove("is-error");
          renderPurchasePanel(product);
        });
        sizeOptionsEl.appendChild(btn);
      });
    }

    function renderFirmnessOptions(product) {
      firmnessOptionsEl.innerHTML = "";
      // Only this product's own available firmness options are shown.
      product.firmness.forEach(function (level) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.setAttribute("aria-pressed", String(mtState.selectedFirmness === level));
        btn.textContent = level;
        btn.addEventListener("click", function () {
          mtState.selectedFirmness = level;
          purchaseMessage.textContent = "";
          qsa(".mt-option-pill", firmnessOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
        });
        firmnessOptionsEl.appendChild(btn);
      });
    }

    function renderPurchasePanel(product) {
      priceEl.textContent = mtMoney(currentPrice(product));
      var sizePrice = mtSizePrice(product, mtState.selectedSize);
      var validOldPrice;
      if (product.sizeOldPrices) {
        // Product from the backend API: each size has its own compare-at price.
        var apiOldPrice = mtState.selectedSize ? product.sizeOldPrices[mtState.selectedSize] : product.oldPrice;
        validOldPrice = (apiOldPrice && apiOldPrice > sizePrice) ? apiOldPrice : null;
      } else {
        // The stored oldPrice belongs to the base (first, cheapest) size only,
        // even when another size happens to cost the same.
        var isBaseSize = !mtState.selectedSize ||
          (MATTRESS_SIZE_PRICES[product.slug]
            ? mtState.selectedSize === product.availableSizes[0]
            : sizePrice === product.price);
        validOldPrice = (isBaseSize && product.oldPrice && product.oldPrice > sizePrice) ? product.oldPrice : null;
      }
      prevPriceEl.textContent = validOldPrice ? mtMoney(validOldPrice) : "";
      renderSelectedSizePrice(mtState.selectedSize, sizePrice, validOldPrice);
      qsa(".mt-option-pill", sizeOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", String(el.dataset.size === mtState.selectedSize));
      });
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: mtState.selectedSize, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: mtMoney
      });
    }

    function renderRelated(product) {
      relatedEl.innerHTML = "";
      var others = MATTRESS_PRODUCTS_LIST.filter(function (p) { return p.slug !== product.slug; });
      var sameType = others.filter(function (p) { return p.mattressType === product.mattressType; });
      var rest = others.filter(function (p) { return p.mattressType !== product.mattressType; });
      var related = sameType.concat(rest).slice(0, 5);

      related.forEach(function (p) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "bb-modal__related-item";
        item.innerHTML =
          '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" />' +
          '<span>' + p.name + '</span>';
        item.addEventListener("click", function () {
          window.location.hash = "#/" + p.slug;
        });
        relatedEl.appendChild(item);
      });
    }

    function syncWishlistButton(product) {
      if (!wishlistBtn) return;
      var key = "mattress-" + product.slug;
      var isSaved = hasWishlistStore() ? window.RabboraWishlist.has(key) : state.wishlist.has(key);
      wishlistBtn.setAttribute("aria-pressed", String(isSaved));
      wishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }

    function renderDetail(product) {
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute(
          "content",
          product.name + " — " + product.description.split(". ")[0] + ". Shop now at Rabbora Living with free Mainland UK delivery and a 24 month warranty."
        );
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) {
        canonicalTag.setAttribute("href", "https://rabbora.co.uk/mattresses/" + product.slug);
      }

      breadcrumbName.textContent = product.name;
      typeEl.textContent = product.mattressTypeLabel;
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      monthlyEl.textContent = "or from \u00A3" + product.monthlyPrice + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = product.delivery;
      warrantyEl.textContent = product.warranty;

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

      mtState.detailImageIndex = 0;
      mtState.selectedSize = null;
      mtState.selectedFirmness = null;
      mtState.quantity = 1;
      qtyValueEl.textContent = "1";
      purchaseMessage.textContent = "";

      renderGallery(product);
      renderSizeOptions(product);
      renderFirmnessOptions(product);
      renderPurchasePanel(product);
      renderRelated(product);
      syncWishlistButton(product);
    }

    function showCategoryView() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Mattresses UK | Premium Comfort & Support | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute(
          "content",
          "Shop premium mattresses at Rabbora Living. Pocket spring, memory foam, hybrid and orthopaedic mattresses designed for better sleep, with fast delivery and a 24-month warranty."
        );
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/mattresses");
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Mattress Not Found | Rabbora Living";
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      renderDetail(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    // Simple hash-based router: #/product-slug shows that product's
    // detail view; no hash (or an unrecognised one only when a hash
    // is actually present) shows the category grid. Supports full
    // back/forward navigation via the hashchange event.
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
        "[Rabbora Mattresses] api-config.js is not loaded, so product details come from this file only. " +
        "Add <script src=\"api-config.js\"></script> before mattresses.js."
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
      merged.sizeLabels = d.labelMap;
      merged.sizePrices = d.sizePrices;
      merged.sizeOldPrices = d.sizeOldPrices;
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

    // The product the detail view is currently showing: the merged API
    // product when it belongs to the current hash, otherwise the product
    // from MATTRESS_PRODUCTS exactly as before. The gallery arrows, Add
    // to Basket, Buy Now and wishlist handlers below all read it.
    var mtApiDetailProduct = null;
    function mtDetailProduct() {
      var slug = currentSlugFromHash();
      if (mtApiDetailProduct && mtApiDetailProduct.slug === slug) return mtApiDetailProduct;
      return MATTRESS_PRODUCTS[slug];
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
      var product = MATTRESS_PRODUCTS[slug];
      if (!product) {
        rbApiRouteId++;
        showNotFound();
        return;
      }
      // Only the newest route may render (ignores late answers).
      var requestId = ++rbApiRouteId;
      rbApiFetch(product, slug).then(function (apiProduct) {
        if (requestId !== rbApiRouteId) return;
        mtApiDetailProduct = apiProduct;
        showDetail(apiProduct || product);
      });
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    function currentSlugFromHash() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var product = mtDetailProduct();
        if (!product) return;
        mtState.detailImageIndex = (mtState.detailImageIndex - 1 + product.images.length) % product.images.length;
        renderGallery(product);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var product = mtDetailProduct();
        if (!product) return;
        mtState.detailImageIndex = (mtState.detailImageIndex + 1) % product.images.length;
        renderGallery(product);
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
      lightboxClose.addEventListener("click", function () { lightbox.hidden = true; });
    }

    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.hidden = true;
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        lightbox.hidden = true;
      }
    });

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (mtState.quantity > 1) {
          mtState.quantity -= 1;
          qtyValueEl.textContent = String(mtState.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        mtState.quantity += 1;
        qtyValueEl.textContent = String(mtState.quantity);
      });
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        var product = mtDetailProduct();
        if (!product) return;

        if (!mtState.selectedSize) {
          purchaseMessage.textContent = "Please select a mattress size.";
          purchaseMessage.classList.add("is-error");
          return;
        }
        if (product.firmness.length > 1 && !mtState.selectedFirmness) {
          purchaseMessage.textContent = "Please select a firmness.";
          purchaseMessage.classList.add("is-error");
          return;
        }
        // Single-firmness products don't need an explicit choice.
        var firmness = mtState.selectedFirmness || product.firmness[0];
        var unitPrice = currentPrice(product);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "mattress-" + product.slug,
              slug: product.slug,
              name: product.name,
              url: "mattresses.html#/" + product.slug,
              image: product.images && product.images.length ? product.images[0] : "",
              alt: product.name,
              price: unitPrice,
              category: "Luxury Mattresses",
              variant: {
                size: mtState.selectedSize,
                dimensions: MATTRESS_SIZE_DIMENSIONS[mtState.selectedSize] || "",
                firmness: firmness
              }
            },
            mtState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Cart clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent =
          "Added " + mtState.quantity + " \u00d7 " + product.name + " (" + mtState.selectedSize + ", " + firmness +
          ") to your cart \u2014 " + mtMoney(unitPrice * mtState.quantity) + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        var product = mtDetailProduct();
        if (!product) return;

        if (!mtState.selectedSize) {
          purchaseMessage.textContent = "Please select a mattress size.";
          purchaseMessage.classList.add("is-error");
          return;
        }
        if (product.firmness.length > 1 && !mtState.selectedFirmness) {
          purchaseMessage.textContent = "Please select a firmness.";
          purchaseMessage.classList.add("is-error");
          return;
        }

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent = "Taking you to checkout for " + mtState.quantity + " \u00d7 " + product.name + "...";
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function () {
        var product = mtDetailProduct();
        if (!product) return;
        var key = "mattress-" + product.slug;
        var willAdd;

        if (hasWishlistStore()) {
          var snapshot = {
            id: key,
            slug: product.slug,
            name: product.name,
            url: "mattresses.html#/" + product.slug,
            image: (product.images && product.images[0]) || "",
            alt: product.name,
            price: mtMoney(currentPrice(product)),
            previousPrice: product.oldPrice ? mtMoney(product.oldPrice) : "",
            monthly: product.monthlyPrice ? ("or from \u00A3" + product.monthlyPrice + "/mo") : "",
            badge: product.badge || "",
            stars: product.rating ? mtStars(product.rating) : "",
            reviewCount: product.reviewCount || "",
            category: "Luxury Mattresses"
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

        syncWishlistButton(product);
        updateWishlistCount();

        // Keep the matching grid card's heart in sync too.
        var gridBtn = document.querySelector('.mt-wishlist-btn[data-slug="' + product.slug + '"]');
        if (gridBtn) {
          gridBtn.setAttribute("aria-pressed", String(willAdd));
        }
      });
    }
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
    initMattressFilters();
    initMattressViewToggle();
    initMattressHelp();
    initMattressDetail();
    initStorageDrawersFaq();
  });
})();