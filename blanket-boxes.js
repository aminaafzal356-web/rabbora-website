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

  var BB_WIDTH_OPTIONS = ["3ft Wide", "4ft Wide", "4.6ft Wide", "5ft Wide", "6ft Wide"];

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

  var BB_PRODUCTS = 
{
  "manhattan-style-blanket-box": {
    "name": "Manhattan Style Blanket Box",
    "price": 200.0,
    "prev": 210.0,
    "monthly": 11,
    "rating": 5,
    "reviews": 86,
    "description": "The Manhattan Style Blanket Box brings a clean, contemporary look to any bedroom. Its tailored fabric finish and understated silhouette make it equally at home in a minimal city flat or a spacious main suite, while the deep interior keeps spare bedding, cushions and throws neatly out of sight.",
    "features": [
      "Deep interior storage for spare bedding and throws",
      "Soft-close hinged lid for safe, quiet use",
      "Solid frame construction with a tailored fabric finish",
      "Doubles as extra seating at the foot of the bed"
    ],
    "fabrics": [
      {
        "slug": "plush-grey",
        "name": "Plush Grey"
      },
      {
        "slug": "plush-silver",
        "name": "Plush Silver"
      },
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      }
    ],
    "images": [
      "blanket/img-90.png",
      "blanket/img-98.png"
     
    ]
  },
  "chesterfield-blanket-box": {
    "name": "Chesterfield Blanket Box",
    "price": 329.0,
    "prev": 405.0,
    "monthly": 14,
    "rating": 5,
    "reviews": 54,
    "description": "The Chesterfield Blanket Box pairs traditional deep-button detailing with practical everyday storage. It brings warmth and character to a bedroom while offering a sturdy, padded seat and generous space for bedding underneath.",
    "features": [
      "Traditional deep-button Chesterfield detailing",
      "Sturdy frame designed to support everyday seating",
      "Generous storage space beneath a padded lid",
      "Turned wooden feet for a classic finish"
    ],
    "fabrics": [
      {
        "slug": "crushed-velvet-mink",
        "name": "Crushed Velvet Mink"
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
    "images": [
       "blanket/img-89.png",
       "blanket/img-97.png",
    ]
  },
  "luxury-storage-blanket-box": {
    "name": "Luxury Storage Blanket Box",
    "price": 200.0,
    "prev": null,
    "monthly": 17,
    "rating": 5,
    "reviews": 112,
    "description": "The Luxury Storage Blanket Box is designed to be the statement piece in your bedroom. Its rich, plush upholstery and extra-deep interior give you generous space for bulkier bedding, while the reinforced frame is built for daily use.",
    "features": [
      "Plush velvet-style upholstery for a luxury finish",
      "Extra-deep interior for bulkier bedding and blankets",
      "Reinforced base for long-term everyday use",
      "Padded lid doubles as a comfortable seat"
    ],
    "fabrics": [
      {
        "slug": "coniston-emerald",
        "name": "Coniston Emerald"
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
    "images": [
       "blanket/img-88.png",
       "blanket/img-95.png",
    ]
  },
  "ottoman-style-blanket-box": {
    "name": "Ottoman Style Blanket Box",
    "price": 200.0,
    "prev": 220.0,
    "monthly": 13,
    "rating": 4,
    "reviews": 39,
    "description": "The Ottoman Style Blanket Box brings a soft, textured finish to everyday storage. Its neutral tones and compact footprint make it a versatile addition to bedrooms of any size, with a practical lift-up lid for easy access.",
    "features": [
      "Soft, textured boucl\u00e9-style fabric finish",
      "Lift-up lid with practical hinge mechanism",
      "Neutral tones suited to a range of bedroom styles",
      "Compact footprint for smaller rooms"
    ],
    "fabrics": [
      {
        "slug": "cream-boucle",
        "name": "Cream Boucle"
      },
      {
        "slug": "naples-ivory",
        "name": "Naples Ivory"
      },
      {
        "slug": "marble-oatmeal",
        "name": "Marble Oatmeal"
      }
    ],
    "images": [
       "blanket/img-86.png",
      "blanket/img-93.png",
    ]
  },
  "premium-fabric-blanket-box": {
    "name": "Premium Fabric Blanket Box",
    "price": 200.0,
    "prev": null,
    "monthly": 14,
    "rating": 5,
    "reviews": 67,
    "description": "The Premium Fabric Blanket Box is finished in a soft, plush upholstery that feels as good as it looks. It offers a roomy interior for duvets and pillows, with tailored seams and a considered profile that suits a range of bedroom styles.",
    "features": [
      "Premium plush fabric with a soft-touch finish",
      "Roomy interior suited to duvets and pillows",
      "Neatly finished seams and tailored edges",
      "Sits comfortably at the foot of most bed sizes"
    ],
    "fabrics": [
      {
        "slug": "plush-pink",
        "name": "Plush Pink"
      },
      {
        "slug": "coniston-pink",
        "name": "Coniston Pink"
      },
      {
        "slug": "pink-boucle",
        "name": "Pink Boucle"
      }
    ],
    "images": [
       "blanket/img-85.png",
      "blanket/img-96.png",
    ]
  },
  "classic-blanket-box": {
    "name": "Classic Blanket Box",
    "price": 200.0,
    "prev": null,
    "monthly": 10,
    "rating": 4,
    "reviews": 28,
    "description": "The Classic Blanket Box keeps things simple with a timeless woven finish and a versatile silhouette that suits both modern and traditional bedrooms. It's a practical, accessible way to add extra storage without compromising on style.",
    "features": [
      "Timeless woven-texture fabric finish",
      "Straightforward, versatile silhouette",
      "Practical storage for everyday bedroom items",
      "An accessible entry point into the range"
    ],
    "fabrics": [
      {
        "slug": "coniston-charcoal",
        "name": "Coniston Charcoal"
      },
      {
        "slug": "naples-black",
        "name": "Naples Black"
      },
      {
        "slug": "plush-black",
        "name": "Plush Black"
      }
    ],
    "images": [
     "blanket/img-84.png",
       "blanket/img-92.png",
    ]
  },
  "plush-storage-blanket-box": {
    "name": "Plush Storage Blanket Box",
    "price": 200.0,
    "prev": 175.0,
    "monthly": 12,
    "rating": 5,
    "reviews": 71,
    "description": "The Plush Storage Blanket Box combines a warm, soft-touch finish with generous everyday storage. Its sturdy frame and padded lid make it a comfortable, practical addition to the end of the bed.",
    "features": [
      "Warm, soft-touch plush fabric finish",
      "Generously sized for bulkier bedroom items",
      "Sturdy frame with a comfortable padded lid",
      "Available in a range of considered colourways"
    ],
    "fabrics": [
      {
        "slug": "plush-mustard",
        "name": "Plush Mustard"
      },
      {
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
    "images": [
      "blanket/img-87.png",
      "blanket/img-94.png",
    ]
  }
};

  function bbMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function bbStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  function initBlanketToolbar() {
    var grid = document.getElementById("bbProductGrid");
    if (!grid) return;

    var sortSelect = document.getElementById("bbSortSelect");
    var gridBtn = document.getElementById("bbGridViewBtn");
    var listBtn = document.getElementById("bbListViewBtn");
    var filterToggle = document.getElementById("bbFilterToggle");
    var filterPanel = document.getElementById("bbFilterPanel");

    function getPrice(card) {
      var slug = card.dataset.slug;
      var product = BB_PRODUCTS[slug];
      return product ? product.price : 0;
    }

    function sortCards(mode) {
      var cards = qsa(".bb-product-card", grid);

      cards.sort(function (a, b) {
        if (mode === "price-asc") return getPrice(a) - getPrice(b);
        if (mode === "price-desc") return getPrice(b) - getPrice(a);
        if (mode === "newest") {
          // "Newest" — treat product declaration order in BB_PRODUCTS,
          // reversed, as a stand-in for a real created-date field.
          var keys = Object.keys(BB_PRODUCTS);
          return keys.indexOf(b.dataset.slug) - keys.indexOf(a.dataset.slug);
        }
        // "Most Popular" default — order as originally rendered.
        return 0;
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortCards(sortSelect.value);
      });
    }

    if (gridBtn && listBtn) {
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

    if (filterToggle && filterPanel) {
      filterToggle.addEventListener("click", function () {
        var isOpen = filterPanel.classList.contains("is-open");
        filterPanel.classList.toggle("is-open", !isOpen);
        filterToggle.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  var bbModalState = {
    slug: null,
    imageIndex: 0,
    quantity: 1,
    selectedWidth: null,
    selectedFabric: null,
    selectedFabricSlug: null,
    selectedFabricImage: null
  };

  function initBlanketModal() {
    var grid = document.getElementById("bbProductGrid");
    var categoryView = document.getElementById("bbCategoryView");
    var detailView = document.getElementById("bbDetailView");
    var notFoundView = document.getElementById("bbNotFoundView");
    if (!grid || !categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("bbDetailBreadcrumbName");
    var mainImage = document.getElementById("bbModalMainImage");
    var thumbsWrap = document.getElementById("bbModalThumbs");
    var prevBtn = document.getElementById("bbGalleryPrev");
    var nextBtn = document.getElementById("bbGalleryNext");
    var zoomBtn = document.getElementById("bbGalleryZoom");
    var titleEl = document.getElementById("bbModalTitle");
    var starsEl = document.getElementById("bbModalStars");
    var reviewCountEl = document.getElementById("bbModalReviewCount");
    var priceEl = document.getElementById("bbModalPrice");
    var prevPriceEl = document.getElementById("bbModalPrevPrice");
    var monthlyEl = document.getElementById("bbModalMonthly");
    var descriptionEl = document.getElementById("bbModalDescription");
    var featuresEl = document.getElementById("bbModalFeatures");
    var fabricsEl = document.getElementById("bbModalFabrics");
    var fabricSelectedStatusEl = document.getElementById("bbFabricSelectedStatus");
    var widthOptionsEl = document.getElementById("bbWidthOptions");
    var widthSelectedStatusEl = document.getElementById("bbWidthSelectedStatus");
    var relatedEl = document.getElementById("bbModalRelated");
    var qtyValueEl = document.getElementById("bbQtyValue");
    var qtyMinus = document.getElementById("bbQtyMinus");
    var qtyPlus = document.getElementById("bbQtyPlus");
    var addToCartBtn = document.getElementById("bbAddToCart");
    var buyNowBtn = document.getElementById("bbBuyNow");
    var purchaseMessage = document.getElementById("bbPurchaseMessage");
    var lightbox = document.getElementById("bbLightbox");
    var lightboxImage = document.getElementById("bbLightboxImage");
    var lightboxClose = document.getElementById("bbLightboxClose");

    function currentSlugFromHash() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function renderGallery() {
      var product = BB_PRODUCTS[bbModalState.slug];
      if (!product) return;

      var src = product.images[bbModalState.imageIndex];
      mainImage.src = src;
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      product.images.forEach(function (imgSrc, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === bbModalState.imageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + imgSrc + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          bbModalState.imageIndex = index;
          renderGallery();
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function updateWidthSelectedStatus() {
      if (!widthSelectedStatusEl) return;
      if (bbModalState.selectedWidth) {
        widthSelectedStatusEl.textContent = "Selected: " + bbModalState.selectedWidth;
        widthSelectedStatusEl.classList.remove("is-empty");
      } else {
        widthSelectedStatusEl.textContent = "No width selected yet";
        widthSelectedStatusEl.classList.add("is-empty");
      }
    }

    function renderWidthOptions() {
      if (!widthOptionsEl) return;
      widthOptionsEl.innerHTML = "";

      BB_WIDTH_OPTIONS.forEach(function (width) {
        var isSelected = bbModalState.selectedWidth === width;

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bb-option-pill";
        btn.setAttribute("aria-pressed", String(isSelected));
        btn.setAttribute("aria-label", "Select " + width);
        btn.textContent = width;

        btn.addEventListener("click", function () {
          bbModalState.selectedWidth = width;

          qsa(".bb-option-pill", widthOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");

          updateWidthSelectedStatus();

          if (purchaseMessage && purchaseMessage.classList.contains("is-error")) {
            purchaseMessage.textContent = "";
            purchaseMessage.classList.remove("is-error");
          }
        });

        widthOptionsEl.appendChild(btn);
      });

      updateWidthSelectedStatus();
    }

    function updateFabricSelectedStatus() {
      if (!fabricSelectedStatusEl) return;
      if (bbModalState.selectedFabric) {
        fabricSelectedStatusEl.textContent = "Selected: " + bbModalState.selectedFabric;
        fabricSelectedStatusEl.classList.remove("is-empty");
      } else {
        fabricSelectedStatusEl.textContent = "No fabric colour selected yet";
        fabricSelectedStatusEl.classList.add("is-empty");
      }
    }

    function renderFabrics() {
      var product = BB_PRODUCTS[bbModalState.slug];
      fabricsEl.innerHTML = "";
      if (!product) return;

      // No fabric is pre-selected — the customer must actively choose one
      // (required before Add to Cart; see the addToCartBtn handler below).
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
          var isSelected = bbModalState.selectedFabric === fabric.name;
          var swatchImagePath = fabric.image;

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + swatchImagePath + '" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
              '<span class="fabric-swatch__check" aria-hidden="true">' +
                '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</span>' +
            '<span class="fabric-swatch__name">' + fabric.name + '</span>';

          btn.addEventListener("click", function () {
            var alreadySelected = bbModalState.selectedFabric === fabric.name;

            qsa(".fabric-swatch", fabricsEl).forEach(function (el) {
              el.setAttribute("aria-pressed", "false");
            });

            if (alreadySelected) {
              // Clicking the already-selected swatch again deselects it.
              bbModalState.selectedFabric = null;
              bbModalState.selectedFabricSlug = null;
              bbModalState.selectedFabricImage = null;
            } else {
              bbModalState.selectedFabric = fabric.name;
              bbModalState.selectedFabricSlug = fabric.slug;
              bbModalState.selectedFabricImage = fabric.image;
              btn.setAttribute("aria-pressed", "true");
            }

            updateFabricSelectedStatus();

            // Selecting a fabric after an earlier "please select a colour"
            // validation message clears that message.
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
      var product = BB_PRODUCTS[bbModalState.slug];
      relatedEl.innerHTML = "";
      if (!product) return;

      var otherSlugs = Object.keys(BB_PRODUCTS).filter(function (slug) {
        return slug !== bbModalState.slug;
      });

      otherSlugs.slice(0, 5).forEach(function (slug) {
        var related = BB_PRODUCTS[slug];
        var item = document.createElement("a");
        item.href = "blanket-boxes.html#/" + slug;
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
      priceEl.textContent = bbMoney(product.price);
      prevPriceEl.textContent = product.prev ? bbMoney(product.prev) : "";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      renderGallery();
      renderWidthOptions();
      renderFabrics();
      renderRelated();

      qtyValueEl.textContent = String(bbModalState.quantity);
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
      // the drawer on every route change. Without this, if the mobile
      // menu happens to be open when the page navigates between the
      // category and detail views (a hash change, with no full page
      // reload), the drawer's own close handler is never triggered —
      // leaving document.body.style.overflow stuck at "hidden" and the
      // page unable to scroll on mobile.
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
        bbModalState.slug = null;
        showCategory();
        return;
      }

      var product = BB_PRODUCTS[slug];
      if (!product) {
        showNotFound();
        return;
      }

      bbModalState.slug = slug;
      bbModalState.imageIndex = 0;
      bbModalState.quantity = 1;
      bbModalState.selectedWidth = null;
      bbModalState.selectedFabric = null;
      bbModalState.selectedFabricSlug = null;
      bbModalState.selectedFabricImage = null;
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
        var product = BB_PRODUCTS[bbModalState.slug];
        if (!product) return;
        bbModalState.imageIndex = (bbModalState.imageIndex - 1 + product.images.length) % product.images.length;
        renderGallery();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var product = BB_PRODUCTS[bbModalState.slug];
        if (!product) return;
        bbModalState.imageIndex = (bbModalState.imageIndex + 1) % product.images.length;
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
        if (bbModalState.quantity > 1) {
          bbModalState.quantity -= 1;
          qtyValueEl.textContent = String(bbModalState.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        bbModalState.quantity += 1;
        qtyValueEl.textContent = String(bbModalState.quantity);
      });
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", function () {
        var product = BB_PRODUCTS[bbModalState.slug];
        if (!product) return;

        // Both the width and the fabric colour are required before this
        // item can be added — block the add and show an inline message
        // (matching the site's existing status/error message pattern)
        // instead of adding with a missing option. Width is checked
        // first, matching the on-page top-to-bottom option order.
        if (!bbModalState.selectedWidth) {
          purchaseMessage.classList.add("is-error");
          purchaseMessage.textContent = "Please select a blanket box width.";
          return;
        }

        if (!bbModalState.selectedFabric || !bbModalState.selectedFabricSlug) {
          purchaseMessage.classList.add("is-error");
          purchaseMessage.textContent = "Please select a fabric colour.";
          return;
        }

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              // The cart's own buildLineId() already derives a unique,
              // stable line identity from this plain product id PLUS
              // everything inside "variant" — so a different width OR a
              // different fabric colour naturally becomes a separate
              // cart line, while the SAME width + SAME colour merges
              // into the existing line, exactly as designed. Width and
              // fabric therefore both belong inside "variant" itself,
              // not baked into the id string.
              id: "blanket-box-" + bbModalState.slug,
              slug: bbModalState.slug,
              name: product.name,
              url: "blanket-boxes.html#/" + bbModalState.slug,
              image: product.images && product.images.length ? product.images[0] : "",
              alt: product.name,
              price: product.price,
              category: "Blanket Boxes",
              // fabricImage is a plain top-level field (not inside
              // variant) since checkout's buildVariantText() renders
              // every variant key it finds — this is a swatch-image
              // path for Cart/Checkout to optionally show a colour dot,
              // not something a customer should see printed as text.
              // cart-data.js's add() carries it through explicitly.
              fabricImage: bbModalState.selectedFabricImage,
              variant: {
                width: bbModalState.selectedWidth,
                fabric: bbModalState.selectedFabric
              }
            },
            bbModalState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Cart clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent = "Added " + bbModalState.quantity + " to your cart \u2014 " + bbModalState.selectedWidth + ", " + bbModalState.selectedFabric + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        purchaseMessage.textContent = "Taking you to checkout for " + bbModalState.quantity + " item(s)...";
      });
    }
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
     message instead of showing invented numbers. ---- */
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
    initBlanketToolbar();
    initBlanketModal();
    initMattressHelp();
    initStorageDrawersFaq();
  });
})();