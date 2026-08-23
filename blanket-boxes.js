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

  function initCart() {
    var cartBtn = document.getElementById("cartBtn");
    var cartCountEl = document.getElementById("cartCount");
    if (!cartBtn || !cartCountEl) return;

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

  var FABRIC_CATALOG = [
    { slug: "plush-grey", name: "Plush Grey" },
    { slug: "plush-silver", name: "Plush Silver" },
    { slug: "plush-steel", name: "Plush Steel" },
    { slug: "coniston-charcoal", name: "Coniston Charcoal" },
    { slug: "coniston-almond", name: "Coniston Almond" },
    { slug: "plush-cream", name: "Plush Cream" },
    { slug: "naples-silver", name: "Naples Silver" },
    { slug: "naples-steel", name: "Naples Steel" },
    { slug: "coniston-armour", name: "Coniston Armour" },
    { slug: "plush-beige", name: "Plush Beige" },
    { slug: "plush-black", name: "Plush Black" },
    { slug: "plush-pink", name: "Plush Pink" },
    { slug: "coniston-emerald", name: "Coniston Emerald" },
    { slug: "coniston-pink", name: "Coniston Pink" },
    { slug: "naples-black", name: "Naples Black" },
    { slug: "naples-ivory", name: "Naples Ivory" },
    { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver" },
    { slug: "crushed-velvet-black", name: "Crushed Velvet Black" },
    { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream" },
    { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink" },
    { slug: "plush-mustard", name: "Plush Mustard" },
    { slug: "plush-green", name: "Plush Green" },
    { slug: "plush-turquoise", name: "Plush Turquoise" },
    { slug: "coniston-blue", name: "Coniston Blue" },
    { slug: "cream-boucle", name: "Cream Boucle" },
    { slug: "pink-boucle", name: "Pink Boucle" },
    { slug: "marble-oatmeal", name: "Marble Oatmeal" },
    { slug: "marble-platinum", name: "Marble Platinum" },
    { slug: "marble-silver", name: "Marble Silver" }
  ];

  var BB_PRODUCTS = 
{
  "manhattan-style-blanket-box": {
    "name": "Manhattan Style Blanket Box",
    "price": 129.0,
    "prev": 179.0,
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
      "images/img-84.png",
      "images/img-91.png",
      "images/img-92.png"
    ]
  },
  "chesterfield-blanket-box": {
    "name": "Chesterfield Blanket Box",
    "price": 169.0,
    "prev": 219.0,
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
      "images/img-86.png",
      "images/img-93.png"
    ]
  },
  "luxury-storage-blanket-box": {
    "name": "Luxury Storage Blanket Box",
    "price": 199.0,
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
      "images/img-87.png",
      "images/img-94.png"
    ]
  },
  "ottoman-style-blanket-box": {
    "name": "Ottoman Style Blanket Box",
    "price": 149.0,
    "prev": 189.0,
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
      "images/img-88.png",
      "images/img-95.png"
    ]
  },
  "premium-fabric-blanket-box": {
    "name": "Premium Fabric Blanket Box",
    "price": 159.0,
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
      "images/img-85.png",
      "images/img-95.png"
    ]
  },
  "classic-blanket-box": {
    "name": "Classic Blanket Box",
    "price": 119.0,
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
      "images/img-89.png",
      "images/img-97.png"
    ]
  },
  "plush-storage-blanket-box": {
    "name": "Plush Storage Blanket Box",
    "price": 139.0,
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
      "images/img-90.png",
      "images/img-98.png"
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
    selectedFabric: null
  };

  function initBlanketModal() {
    var grid = document.getElementById("bbProductGrid");
    var modal = document.getElementById("bbModal");
    var overlay = document.getElementById("bbModalOverlay");
    if (!grid || !modal || !overlay) return;

    var closeBtn = document.getElementById("bbModalClose");
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

    function renderFabrics() {
      var product = BB_PRODUCTS[bbModalState.slug];
      fabricsEl.innerHTML = "";
      if (!product) return;

      FABRIC_CATALOG.forEach(function (fabric, index) {
        var isSelected = bbModalState.selectedFabric === fabric.name;
        if (bbModalState.selectedFabric === null && index === 0) {
          bbModalState.selectedFabric = fabric.name;
          isSelected = true;
        }

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fabric-swatch";
        btn.setAttribute("aria-pressed", String(isSelected));
        btn.setAttribute("aria-label", "Select " + fabric.name);
        btn.innerHTML =
          '<span class="fabric-swatch__ring">' +
            '<img src="images/fabrics/' + fabric.slug + '.svg" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
            '<span class="fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="fabric-swatch__name">' + fabric.name + '</span>';

        btn.addEventListener("click", function () {
          bbModalState.selectedFabric = fabric.name;
          qsa(".fabric-swatch", fabricsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
        });

        fabricsEl.appendChild(btn);
      });
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
        var item = document.createElement("button");
        item.type = "button";
        item.className = "bb-modal__related-item";
        item.innerHTML =
          '<img src="' + related.images[0] + '" alt="' + related.name + '" loading="lazy" />' +
          '<span>' + related.name + '</span>';
        item.addEventListener("click", function () {
          openProductModal(slug);
        });
        relatedEl.appendChild(item);
      });
    }

    function renderModal() {
      var product = BB_PRODUCTS[bbModalState.slug];
      if (!product) return;

      titleEl.textContent = product.name;
      starsEl.textContent = bbStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
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
      renderFabrics();
      renderRelated();

      qtyValueEl.textContent = String(bbModalState.quantity);
      purchaseMessage.textContent = "";
    }

    function openProductModal(slug) {
      if (!BB_PRODUCTS[slug]) return;
      bbModalState.slug = slug;
      bbModalState.imageIndex = 0;
      bbModalState.quantity = 1;
      bbModalState.selectedFabric = null;

      renderModal();

      overlay.hidden = false;
      requestAnimationFrame(function () {
        overlay.classList.add("is-visible");
        modal.classList.add("is-visible");
      });
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("bb-modal-open");
      closeBtn.focus();
    }

    function closeProductModal() {
      overlay.classList.remove("is-visible");
      modal.classList.remove("is-visible");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("bb-modal-open");
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 250);
    }

    qsa(".bb-product-open", grid).forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openProductModal(trigger.dataset.slug);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeProductModal);
    if (overlay) overlay.addEventListener("click", closeProductModal);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        if (!lightbox.hidden) {
          lightbox.hidden = true;
          return;
        }
        if (modal.classList.contains("is-visible")) closeProductModal();
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
        var cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
          var current = parseInt(cartCountEl.textContent, 10) || 0;
          cartCountEl.textContent = String(current + bbModalState.quantity);
        }
        purchaseMessage.textContent = "Added " + bbModalState.quantity + " to your cart in " + (bbModalState.selectedFabric || "the selected fabric") + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        purchaseMessage.textContent = "Taking you to checkout for " + bbModalState.quantity + " item(s)...";
      });
    }
  }

  function initBlanketReviewCarousel() {
    var carousel = document.getElementById("bbReviewCarousel");
    var track = document.getElementById("bbReviewTrack");
    var dotsWrap = document.getElementById("bbReviewDots");
    var prevBtn = document.getElementById("bbReviewPrev");
    var nextBtn = document.getElementById("bbReviewNext");
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
    initBlanketToolbar();
    initBlanketModal();
    initBlanketReviewCarousel();
    initMattressHelp();
    initStorageDrawersFaq();
  });
})();