(function () {
  "use strict";

  // Home page product cards. Every value below is copied exactly from
  // the product's own data file (named in each comment) — same name,
  // image, price, previous price, monthly price and badge as on that
  // product's page. No ratings or review counts: none are real yet.
  var PRODUCTS = {
    popular: [
      {
        // tv-beds.js → TV_BED_PRODUCTS "tv-bed-1"
        id: "tv-bed-tv-bed-1",
        slug: "tv-bed-1",
        name: "Rabbora Milano TV Bed",
        image: "tv/img-1.jfif",
        alt: "Rabbora Milano TV Bed",
        price: 999,
        previousPrice: 1399,
        monthlyPrice: 84,
        badge: "29% Off"
      },
      {
        // ottoman-beds.js → SLATTED_OTTOMAN_PRODUCTS "monaco-ottoman-bed"
        id: "monaco-ottoman-bed",
        slug: "monaco-ottoman-bed",
        name: "Rabbora Athens Slatted Designer Ottoman Bed",
        image: "slatted/img-12.jfif",
        alt: "Rabbora Athens Slatted Designer Ottoman Bed",
        price: 289,
        previousPrice: 400,
        monthlyPrice: 25,
        badge: "28% off"
      },
      {
        // high-headboard-beds.js → HH_BED_PRODUCTS "high-headboard-bed-3"
        id: "high-headboard-bed-3",
        slug: "high-headboard-bed-3",
        name: "Rabbora Athena High Headboard Bed",
        image: "high/9.jfif",
        alt: "Rabbora Athena High Headboard Bed",
        price: 699,
        previousPrice: 900,
        monthlyPrice: 59,
        badge: "22% off"
      },
      {
        // solid-base-ottomans.js → SOLID_OTTOMAN_PRODUCTS "solid-ottoman-bed-3"
        id: "solid-ottoman-bed-3",
        slug: "solid-ottoman-bed-3",
        name: "Rabbora Premium Ottoman Bed",
        image: "solid/7.jfif",
        alt: "Rabbora Premium Ottoman Bed",
        price: 289,
        previousPrice: 400,
        monthlyPrice: 25,
        badge: "28% off"
      }
    ],
    bestSellers: [
      {
        // best-sellers.js → BS_PRODUCTS id 1
        id: "art-deco-bed-style",
        slug: "art-deco-bed-style",
        name: "Rabbora Manhattan Slatted Ottoman Bed",
        image: "slatted/img-1.jfif",
        alt: "Rabbora Manhattan Slatted Ottoman Bed",
        price: 249,
        previousPrice: 429,
        monthlyPrice: 21,
        badge: "Best Seller"
      },
      {
        // best-sellers.js → BS_PRODUCTS id 2
        id: "kendal-butterfly-wingback-bed",
        slug: "kendal-butterfly-wingback-bed",
        name: "Rabbora Duke High & Wide Headboard Bed",
        image: "high/1.jfif",
        alt: "Rabbora Duke High & Wide Headboard Bed",
        price: 799,
        previousPrice: 1000,
        monthlyPrice: 67,
        badge: null
      },
      {
        // best-sellers.js → BS_PRODUCTS id 3
        id: "empire-bed-frame-ottoman-storage",
        slug: "empire-bed-frame-ottoman-storage",
        name: "Rabbora Solid Ottoman Bed",
        image: "solid/1.jfif",
        alt: "Rabbora Solid Ottoman Bed",
        price: 249,
        previousPrice: 429,
        monthlyPrice: 21,
        badge: null
      },
      {
        // best-sellers.js → BS_PRODUCTS id 4
        id: "orlando-bed-frame-ottoman-storage",
        slug: "orlando-bed-frame-ottoman-storage",
        name: "Rabbora Lyon Storage Bed",
        image: "drawar/1.jfif",
        alt: "Rabbora Lyon Storage Bed",
        price: 299,
        previousPrice: 380,
        monthlyPrice: 25,
        badge: "New"
      }
    ]
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
        '<a class="product-card__image-link" href="bed-frames.html">' +
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
        '<a href="bed-frames.html" class="product-card__name">' + product.name + "</a>" +
        '<div class="product-card__rating">' +
          '<span class="product-card__no-reviews">No reviews yet</span>' +
        "</div>" +
        '<div class="product-card__price-row">' +
          '<span class="product-card__price">\u00A3' + product.price + "</span>" +
          prevPriceHtml +
        "</div>" +
        monthlyHtml +
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
    var count = hasWishlistStore() ? window.RabboraWishlist.count() : 0;
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

      if (hasWishlistStore() && productId) {
        var product = window.RabboraWishlist.fromCard(card, productId);
        var result = window.RabboraWishlist.toggle(product);
        btn.setAttribute("aria-pressed", String(result.added));
        btn.setAttribute("aria-label", result.added ? "Remove from wishlist" : "Add to wishlist");

        if (result.persisted === false) {
          console.error(
            "[Rabbora Wishlist] This click did not actually persist to localStorage. " +
            "The heart/count you see may not survive a refresh or appear on wishlist.html."
          );
        }
      } else if (!hasWishlistStore()) {
        // No parallel in-memory store: if the real, persistent store
        // isn't available, do not pretend the click worked. Warn
        // loudly instead of silently tracking state that can never
        // survive a refresh or appear on wishlist.html.
        console.error(
          "[Rabbora Wishlist] Heart clicked but window.RabboraWishlist is unavailable — " +
          "this click was NOT saved. Check that wishlist-data.js is loaded on this page."
        );
      } else if (!productId) {
        console.warn(
          "[Rabbora Wishlist] Heart clicked but no data-product-id or data-slug was found " +
          "on the closest .product-card — this click was NOT saved."
        );
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

    // Reflect whatever is actually in the shared cart store the
    // moment this page loads, rather than leaving whatever static
    // "0" is in the markup.
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

  // Home hero image stack. The six .hero__card elements are never
  // re-created: each tick only rewrites their data-pos attribute
  // (0 = front, 1-5 = behind) and the active pagination number, and
  // CSS transforms animate the stack. Auto-advances every 4.5s; the
  // pager and arrows jump straight to an image and restart the timer.
  function initHeroSlideshow() {
    var stack = document.getElementById("heroSlideshow");
    if (!stack) return;

    var hero = stack.closest(".hero");
    var cards = Array.prototype.slice.call(stack.querySelectorAll(".hero__card"));
    var pages = hero ? Array.prototype.slice.call(hero.querySelectorAll(".hero__page")) : [];
    var prevBtn = hero ? hero.querySelector(".hero__arrow--prev") : null;
    var nextBtn = hero ? hero.querySelector(".hero__arrow--next") : null;
    var total = cards.length;
    if (total < 2) return;

    var INTERVAL_MS = 4500;
    var current = 0;
    var timerId = null;

    function render() {
      cards.forEach(function (card, i) {
        var pos = (i - current + total) % total;
        card.setAttribute("data-pos", String(pos));
        var cardLink = card.querySelector(".hero__card-link");
        if (pos === 0) {
          card.removeAttribute("aria-hidden");
          if (cardLink) cardLink.removeAttribute("tabindex");
        } else {
          card.setAttribute("aria-hidden", "true");
          // Cards behind the front one stay clickable with a mouse, but
          // are skipped by the keyboard since they are aria-hidden.
          if (cardLink) cardLink.setAttribute("tabindex", "-1");
        }
      });
      pages.forEach(function (page, i) {
        var active = i === current;
        page.classList.toggle("is-active", active);
        if (active) {
          page.setAttribute("aria-current", "true");
        } else {
          page.removeAttribute("aria-current");
        }
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      render();
    }

    function stop() {
      if (!timerId) return;
      window.clearInterval(timerId);
      timerId = null;
    }

    function start() {
      if (timerId) return;
      timerId = window.setInterval(function () {
        goTo(current + 1);
      }, INTERVAL_MS);
    }

    function restart() {
      stop();
      start();
    }

    pages.forEach(function (page, i) {
      page.addEventListener("click", function () {
        goTo(i);
        restart();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(current - 1);
        restart();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(current + 1);
        restart();
      });
    }

    render();
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


  // Home page trust strip ("Made in Britain", "24 Month Warranty"…) as a
  // continuous right-to-left marquee. Only runs on a .trust-bar that has
  // the data-marquee attribute (the home page), so the same strip on
  // other pages is untouched. The original list is copied enough times
  // to cover the screen, then that whole set is copied once more; the
  // track moves by exactly one set (-50%), so the loop restarts on an
  // identical frame and never jumps. Without JavaScript the strip keeps
  // its original static layout.
  function initTrustMarquee() {
    var bar = document.querySelector(".trust-bar[data-marquee]");
    if (!bar) return;
    var list = bar.querySelector(".trust-bar__list");
    if (!list) return;

    var SPEED_PX_PER_SEC = 45;
    var viewport = document.createElement("div");
    viewport.className = "trust-bar__viewport";
    var track = document.createElement("div");
    track.className = "trust-bar__track";

    // Replace the list's container with the moving track.
    var holder = list.parentNode;
    holder.parentNode.replaceChild(viewport, holder);
    viewport.appendChild(track);

    function build() {
      track.style.animation = "none";
      track.innerHTML = "";
      bar.classList.add("is-marquee");

      var first = list.cloneNode(true);
      track.appendChild(first);
      var setWidth = first.getBoundingClientRect().width;
      if (!setWidth) return;

      // One "set" = enough copies to be at least as wide as the screen.
      var copies = Math.max(1, Math.ceil(viewport.clientWidth / setWidth));
      for (var i = 1; i < copies; i++) {
        track.appendChild(hiddenCopy());
      }
      // Second, identical set for the seamless loop.
      for (var j = 0; j < copies; j++) {
        track.appendChild(hiddenCopy());
      }

      var distance = setWidth * copies;
      track.style.setProperty("--trust-marquee-duration", (distance / SPEED_PX_PER_SEC).toFixed(2) + "s");
      // Force a reflow so the animation restarts cleanly after a rebuild.
      void track.offsetWidth;
      track.style.animation = "";
    }

    function hiddenCopy() {
      var copy = list.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      return copy;
    }

    build();

    var lastWidth = window.innerWidth;
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    });

    // Web fonts can change the text width after first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build);
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

  function initPage() {
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
    initTrustMarquee();
    initFooterYear();
    updateWishlistCount();
    initScrollReveal();
    initMattressHelp();
    initStorageDrawersFaq();
  }

  // Run as soon as the DOM is actually ready — but if this script
  // happens to execute after that point has already passed, don't
  // wait for an event that will never fire again. Initialize
  // immediately in that case instead.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }

  // Guard against a stale header: if this page is restored from the
  // browser's back/forward cache (bfcache), DOMContentLoaded does NOT
  // fire again, so the wishlist heart states and count badge could
  // still show whatever was true the moment the page was cached —
  // e.g. the user removed an item on wishlist.html, then used the
  // back button to return to a previously-cached category page.
  // Re-sync from the current saved state whenever that happens.
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      updateWishlistCount();
      if (window.RabboraWishlist) {
        window.RabboraWishlist.syncButtons(document);
      }
      updateCartCount();
    }
  });
})();