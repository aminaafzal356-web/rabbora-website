(function () {
  "use strict";

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

  function buildStars(rating) {
    var full = "\u2605".repeat(rating);
    var empty = "\u2606".repeat(5 - rating);
    return full + empty;
  }

  function createProductCard(product) {
    var card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;
    card.dataset.slug = product.slug;

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
    // this page (wrong path, 404, blocked), every wishlist click below
    // will silently fall back to an in-memory Set that never survives
    // a refresh or shows up on wishlist.html. Rather than fail quietly,
    // say so clearly in the console the moment the page finishes
    // loading, so this is diagnosable from a live site without needing
    // to inspect source.
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

  function initHeroSlideshow() {
    var slideshow = document.getElementById("heroSlideshow");
    if (!slideshow) return;

    var slides = slideshow.querySelectorAll(".hero__slide");
    if (slides.length < 2) return;

    var CROSSFADE_MS = 1300;

    // The first slide is forced to opacity:1 with transitions disabled
    // inline (see HTML) so it is guaranteed to be visible the instant the
    // page paints, with no fade-in and no blank moment beforehand. Once
    // that first paint has happened, hand it back to the normal CSS
    // transition so every later crossfade still animates exactly as
    // before.
    var firstSlide = slides[0];
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        firstSlide.style.transition = "";
      });
    });

    // Warm the browser cache for every slide right away so each one is
    // already downloaded by the time its turn in the rotation comes.
    slides.forEach(function (img) {
      if (img.complete) return;
      var warm = new Image();
      warm.src = img.currentSrc || img.src;
    });

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    var currentIndex = 0;
    var intervalId = null;

    function isLoaded(img) {
      return img.complete && img.naturalWidth > 0;
    }

    // True crossfade: the incoming slide is raised above the outgoing
    // one (z-index) and fades in on top of it. The outgoing slide is
    // only hidden again once the fade-in has fully finished, so the
    // hero area is always covered by a fully opaque image — there is
    // never a moment where both are transparent and the background
    // colour underneath could show through.
    function activateSlide(nextIndex) {
      var outgoing = slides[currentIndex];
      var incoming = slides[nextIndex];

      incoming.style.zIndex = "2";
      outgoing.style.zIndex = "1";
      incoming.classList.add("is-active");

      window.setTimeout(function () {
        outgoing.classList.remove("is-active");
        outgoing.style.zIndex = "";
      }, CROSSFADE_MS);

      currentIndex = nextIndex;
    }

    function goToNextSlide() {
      var nextIndex = (currentIndex + 1) % slides.length;
      var nextImg = slides[nextIndex];

      if (isLoaded(nextImg)) {
        activateSlide(nextIndex);
        return;
      }

      // Rare case: the next slide hasn't finished loading yet. Wait for
      // it rather than starting the transition early, so the current
      // image never disappears before the next one is actually ready.
      var onReady = function () {
        nextImg.removeEventListener("load", onReady);
        activateSlide(nextIndex);
      };
      nextImg.addEventListener("load", onReady);
    }

    function start() {
      if (intervalId) return;
      intervalId = window.setInterval(goToNextSlide, 6500);
    }

    function stop() {
      if (!intervalId) return;
      window.clearInterval(intervalId);
      intervalId = null;
    }

    start();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
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
    initProductGrids();
    initWishlist();
    initCart();
    initDesktopDropdown();
    initSearchCategoryMenu();
    initHeaderSearch();
    initMobileNav();
    initMobileAccordion();
    initNewsletterForm();
    initHeroSlideshow();
    initFooterYear();
    updateWishlistCount();
    initScrollReveal();
    initMattressHelp();
    initStorageDrawersFaq();
  });
})();