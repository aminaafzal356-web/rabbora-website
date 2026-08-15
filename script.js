/* =========================================================
   RABBORA LIVING — HOME PAGE SCRIPT
   Vanilla JavaScript only. No frameworks, no dependencies.
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     DEMO PRODUCT DATA
     ---------------------------------------------------------
     Placeholder products for layout/design purposes only.
     Replace this object with real catalogue data from a
     backend/database before launch. Structure kept simple
     and flat so a future fetch() call can populate it.
     ========================================================= */
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

  /* =========================================================
     STATE (in-memory only — replace with real persistence
     / backend calls when connecting a database)
     ========================================================= */
  var state = {
    wishlist: new Set(),
    cartCount: 0
  };

  /* =========================================================
     UTILITIES
     ========================================================= */
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

  /* =========================================================
     PRODUCT CARD RENDERING
     ========================================================= */
  function createProductCard(product) {
    var card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = product.id;

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

  /* =========================================================
     WISHLIST (product cards + header icon)
     ---------------------------------------------------------
     Delegated click handler covers cards rendered dynamically.
     ========================================================= */
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

  /* =========================================================
     CART COUNTER (placeholder — increments only, no real
     cart logic until a backend/database is connected)
     ========================================================= */
  function initCart() {
    var cartBtn = document.getElementById("cartBtn");
    var cartCountEl = document.getElementById("cartCount");
    if (!cartBtn || !cartCountEl) return;

    cartBtn.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

  /* =========================================================
     DESKTOP "BED FRAMES" DROPDOWN
     ---------------------------------------------------------
     Hover (with a short close delay) + click + keyboard support.
     ========================================================= */
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

  /* =========================================================
     MOBILE NAVIGATION DRAWER
     ========================================================= */
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

  /* =========================================================
     MOBILE "BED FRAMES" ACCORDION
     ========================================================= */
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

  /* =========================================================
     NEWSLETTER FORM — client-side validation only.
     ---------------------------------------------------------
     Structured so a real fetch() POST to a backend endpoint
     can be dropped in where indicated.
     ========================================================= */
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

  /* =========================================================
     HERO SLIDESHOW — respects prefers-reduced-motion
     ---------------------------------------------------------
     Cycles through the hero__slide images automatically with a smooth
     crossfade. Respects reduced-motion by leaving the first slide
     showing statically instead of auto-rotating.
     ========================================================= */
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

  /* =========================================================
     SEARCH INDEX
     ---------------------------------------------------------
     Combines the demo product data above into one flat list for
     the header search, plus a couple of extra demo entries so
     category terms like "mattress" and "sofa" return a result
     even though those product grids aren't built on this page
     yet. Replace this whole index with a real catalogue lookup
     (e.g. an API call) once a backend is connected — none of
     this affects the Popular Products / Best Sellers sections.
     ========================================================= */
  var SEARCH_EXTRA_DEMO_PRODUCTS = [
    {
      id: "demo-s1",
      slug: "ashcombe-pocket-spring-mattress",
      name: "Ashcombe Pocket Spring Mattress",
      image: "images/products/demo-product-9.jpg",
      alt: "Demo product: Ashcombe pocket spring mattress",
      price: 399,
      previousPrice: null,
      monthlyPrice: 17,
      badge: null
    },
    {
      id: "demo-s2",
      slug: "hadley-three-seat-sofa",
      name: "Hadley Three-Seat Sofa",
      image: "images/products/demo-product-10.jpg",
      alt: "Demo product: Hadley three-seat sofa in sage fabric",
      price: 1099,
      previousPrice: 1299,
      monthlyPrice: 46,
      badge: "New"
    }
  ];

  function buildSearchIndex() {
    return [].concat(PRODUCTS.popular, PRODUCTS.bestSellers, SEARCH_EXTRA_DEMO_PRODUCTS);
  }

  var SEARCH_INDEX = buildSearchIndex();
  var SEARCH_RESULTS_LIMIT = 6;

  function formatPrice(value) {
    return "\u00A3" + value;
  }

  function searchProducts(query) {
    var normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return SEARCH_INDEX.filter(function (product) {
      return product.name.toLowerCase().indexOf(normalized) !== -1;
    }).slice(0, SEARCH_RESULTS_LIMIT);
  }

  function createSuggestionItem(product) {
    var item = document.createElement("a");
    item.className = "search-suggestion";
    item.href = "product.html?slug=" + product.slug;
    item.setAttribute("role", "option");
    item.innerHTML =
      '<span class="search-suggestion__image">' +
        '<img src="' + product.image + '" alt="" loading="lazy" width="48" height="48" />' +
      "</span>" +
      '<span class="search-suggestion__body">' +
        '<span class="search-suggestion__name">' + product.name + "</span>" +
        '<span class="search-suggestion__price">' + formatPrice(product.price) + "</span>" +
      "</span>";
    return item;
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

  /* =========================================================
     MISC: footer year
     ========================================================= */
  function initFooterYear() {
    var yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     FABRIC SAMPLES PAGE
     ---------------------------------------------------------
     Everything here is guarded on the presence of #fabricGrid,
     so none of it runs (or can affect) any other page.
     ========================================================= */
  var FABRIC_MAX_SELECTION = 4;

  function initFabricSwatches() {
    var grid = document.getElementById("fabricGrid");
    if (!grid) return;

    var statusEl = document.getElementById("fabricSelectionStatus");
    var limitMessageEl = document.getElementById("fabricLimitMessage");
    var swatches = qsa(".fabric-swatch", grid);
    var selected = [];
    var limitTimer = null;

    function updateStatus() {
      if (statusEl) {
        statusEl.textContent = selected.length + " / " + FABRIC_MAX_SELECTION + " Samples Selected";
      }
    }

    function showLimitMessage() {
      if (!limitMessageEl) return;
      limitMessageEl.hidden = false;
      if (limitTimer) clearTimeout(limitTimer);
      limitTimer = setTimeout(function () {
        limitMessageEl.hidden = true;
      }, 2800);
    }

    function syncFormFields() {
      var listEl = document.getElementById("fabricFormSelectedList");
      var inputEl = document.getElementById("fabric-samples");

      if (listEl) {
        listEl.innerHTML = "";
        if (selected.length === 0) {
          var empty = document.createElement("li");
          empty.className = "fabric-form__selected-empty";
          empty.textContent = "No samples selected yet — choose up to 4 above.";
          listEl.appendChild(empty);
        } else {
          selected.forEach(function (name) {
            var item = document.createElement("li");
            item.textContent = "\u2713 " + name;
            listEl.appendChild(item);
          });
        }
      }

      if (inputEl) {
        inputEl.value = selected.join(", ");
      }
    }

    function selectSwatch(btn, name) {
      if (selected.length >= FABRIC_MAX_SELECTION) {
        showLimitMessage();
        btn.classList.add("fabric-swatch--shake");
        window.setTimeout(function () {
          btn.classList.remove("fabric-swatch--shake");
        }, 400);
        return;
      }
      selected.push(name);
      btn.setAttribute("aria-pressed", "true");
      updateStatus();
      syncFormFields();
    }

    function deselectSwatch(btn, name) {
      var index = selected.indexOf(name);
      if (index !== -1) selected.splice(index, 1);
      btn.setAttribute("aria-pressed", "false");
      updateStatus();
      syncFormFields();
    }

    swatches.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.dataset.fabric;
        var isSelected = btn.getAttribute("aria-pressed") === "true";
        if (isSelected) {
          deselectSwatch(btn, name);
        } else {
          selectSwatch(btn, name);
        }
      });
    });

    updateStatus();
    syncFormFields();
  }

  /* =========================================================
     FABRIC SAMPLES FORM — client-side validation only.
     ========================================================= */
  function initFabricForm() {
    var form = document.getElementById("fabricSamplesForm");
    var messageEl = document.getElementById("fabricFormMessage");
    if (!form || !messageEl) return;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      messageEl.classList.remove("is-error", "is-success");

      var samplesInput = document.getElementById("fabric-samples");
      var requiredFields = qsa("[required]", form);
      var firstInvalid = null;

      requiredFields.forEach(function (field) {
        var valid = field.value.trim() !== "";
        if (field.type === "email" && valid) {
          valid = emailPattern.test(field.value.trim());
        }
        field.setAttribute("aria-invalid", valid ? "false" : "true");
        if (!valid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        if (firstInvalid === samplesInput) {
          messageEl.textContent = "Please select at least one fabric sample above.";
        } else {
          messageEl.textContent = "Please complete all required fields correctly.";
        }
        messageEl.classList.add("is-error");
        firstInvalid.focus();
        return;
      }

      // Placeholder submission handler.
      // Replace with a real API call once the sample-request backend
      // is connected, e.g.:
      //   fetch("/api/fabric-samples", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(Object.fromEntries(new FormData(form)))
      //   });

      messageEl.textContent = "Thanks \u2014 your free sample request has been received.";
      messageEl.classList.add("is-success");
    });
  }

  /* =========================================================
     SCROLL-REVEAL — used by the Fabric Samples page sections.
     Guarded by the presence of .reveal elements, so it is
     inert (does nothing) on pages that don't use it.
     ========================================================= */
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

  /* =========================================================
     FABRIC REVIEW CAROUSEL
     ========================================================= */
  function initFabricReviewCarousel() {
    var carousel = document.getElementById("fabricReviewCarousel");
    var track = document.getElementById("fabricReviewTrack");
    var dotsWrap = document.getElementById("fabricReviewDots");
    var prevBtn = document.getElementById("fabricReviewPrev");
    var nextBtn = document.getElementById("fabricReviewNext");
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

      // Mobile/narrow layout: slide the track horizontally.
      track.style.transform = "translateX(-" + current * 100 + "%)";
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(current - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(current + 1);
      });
    }

    goTo(0);
  }


  /* =========================================================
     BLANKET BOXES PAGE
     ---------------------------------------------------------
     Everything here is guarded on the presence of #bbProductGrid,
     so none of it runs (or can affect) any other page.
     ========================================================= */
  /* Complete fabric collection — same 29 names and same swatch
     images used on the Fabric Samples page, reused here rather
     than duplicated per product, so every Blanket Box product
     detail view offers the full collection. */
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
      "images/blanket-boxes/manhattan-style-blanket-box-main.svg",
      "images/blanket-boxes/manhattan-style-blanket-box-angle.svg",
      "images/blanket-boxes/manhattan-style-blanket-box-detail.svg"
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
      "images/blanket-boxes/chesterfield-blanket-box-main.svg",
      "images/blanket-boxes/chesterfield-blanket-box-angle.svg",
      "images/blanket-boxes/chesterfield-blanket-box-detail.svg"
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
      "images/blanket-boxes/luxury-storage-blanket-box-main.svg",
      "images/blanket-boxes/luxury-storage-blanket-box-angle.svg",
      "images/blanket-boxes/luxury-storage-blanket-box-detail.svg"
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
      "images/blanket-boxes/ottoman-style-blanket-box-main.svg",
      "images/blanket-boxes/ottoman-style-blanket-box-angle.svg",
      "images/blanket-boxes/ottoman-style-blanket-box-detail.svg"
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
      "images/blanket-boxes/premium-fabric-blanket-box-main.svg",
      "images/blanket-boxes/premium-fabric-blanket-box-angle.svg",
      "images/blanket-boxes/premium-fabric-blanket-box-detail.svg"
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
      "images/blanket-boxes/classic-blanket-box-main.svg",
      "images/blanket-boxes/classic-blanket-box-angle.svg",
      "images/blanket-boxes/classic-blanket-box-detail.svg"
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
      "images/blanket-boxes/plush-storage-blanket-box-main.svg",
      "images/blanket-boxes/plush-storage-blanket-box-angle.svg",
      "images/blanket-boxes/plush-storage-blanket-box-detail.svg"
    ]
  }
};

  function bbMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function bbStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  /* ---- Toolbar: sort, grid/list view, mobile filter drawer ---- */
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

  /* ---- Product detail modal ---- */
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

  /* ---- Review carousel (Blanket Boxes page instance) ---- */
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


  /* =========================================================
     SOFAS PAGE
     ---------------------------------------------------------
     Everything here is guarded on the presence of #sfProductGrid,
     so none of it runs (or can affect) any other page.
     ========================================================= */
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
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
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
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
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
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
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
        "slug": "plush-turquoise",
        "name": "Plush Turquoise"
      },
      {
        "slug": "coniston-blue",
        "name": "Coniston Blue"
      }
    ],
    "images": [
      "images/img-45.png",
      "images/img-59.png",
      "images/img-60.png"
    ]
  }
};

  function sfMoney(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function sfStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }

  /* ---- Product detail modal ---- */
  var sfModalState = {
    slug: null,
    imageIndex: 0,
    quantity: 1,
    selectedFabric: null
  };


  /* ---- Filter bar / drawer: shared state and logic ----
     One set of controls (selects only, including Colour) drives both
     the always-visible desktop filter bar and the slide-in tablet/
     mobile drawer — there is only one filter state here, never two. */
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

  /* ---- Grid / list view toggle ---- */
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
    var modal = document.getElementById("sfModal");
    var overlay = document.getElementById("sfModalOverlay");
    if (!grid || !modal || !overlay) return;

    var closeBtn = document.getElementById("sfModalClose");
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
    var dimensionsEl = document.getElementById("sfModalDimensions");
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
      var product = SF_PRODUCTS[sfModalState.slug];
      fabricsEl.innerHTML = "";
      if (!product || !product.fabrics || product.fabrics.length === 0) {
        fabricsEl.parentElement.hidden = true;
        return;
      }
      fabricsEl.parentElement.hidden = false;

      // Only this sofa's own available fabrics are shown — restricted
      // per product, reusing the same fabric data/images as the
      // Fabric Samples page rather than a new fabric list.
      product.fabrics.forEach(function (fabric, index) {
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
            '<img src="images/fabrics/' + fabric.slug + '.svg" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
            '<span class="fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="fabric-swatch__name">' + fabric.name + '</span>';

        btn.addEventListener("click", function () {
          sfModalState.selectedFabric = fabric.name;
          qsa(".fabric-swatch", fabricsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
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
      var product = SF_PRODUCTS[sfModalState.slug];
      if (!product) return;

      titleEl.textContent = product.name;
      starsEl.textContent = sfStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      priceEl.textContent = sfMoney(product.price);
      prevPriceEl.textContent = product.prev ? sfMoney(product.prev) : "";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      dimensionsEl.textContent = product.dimensions || "";

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

    function openProductModal(slug) {
      if (!SF_PRODUCTS[slug]) return;
      sfModalState.slug = slug;
      sfModalState.imageIndex = 0;
      sfModalState.quantity = 1;
      sfModalState.selectedFabric = null;

      renderModal();

      overlay.hidden = false;
      requestAnimationFrame(function () {
        overlay.classList.add("is-visible");
        modal.classList.add("is-visible");
      });
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("bb-modal-open");
      closeBtn.focus();

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + slug);
      }
    }

    function closeProductModal() {
      overlay.classList.remove("is-visible");
      modal.classList.remove("is-visible");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("bb-modal-open");
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 250);

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    qsa(".sf-product-open", grid).forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openProductModal(trigger.dataset.slug);
      });
    });

    // Support a shareable-ish URL: /sofas.html#chesterfield-3-seater-sofa
    // opens straight into that product's detail view on load.
    var initialSlug = window.location.hash ? window.location.hash.slice(1) : "";
    if (initialSlug && SF_PRODUCTS[initialSlug]) {
      openProductModal(initialSlug);
    }

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
        var cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
          var current = parseInt(cartCountEl.textContent, 10) || 0;
          cartCountEl.textContent = String(current + sfModalState.quantity);
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

  /* ---- Review carousel (Sofas page instance) ---- */
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


  /* =========================================================
     MATTRESSES PAGE
     ---------------------------------------------------------
     Everything here is guarded on the presence of #mtProductGrid,
     so none of it runs (or can affect) any other page. One
     reusable detail view (#mtDetailView) is populated dynamically
     from MATTRESS_PRODUCTS based on the current URL slug, rather
     than 16 separate hard-coded detail pages.
     ========================================================= */
  var MATTRESS_PRODUCTS_LIST = 
[
  {
    "id": 1,
    "slug": "bedzone-hybrid-memory-pocket-spring",
    "name": "Bedzone Hybrid Memory Pocket Spring",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 449,
    "oldPrice": 599,
    "monthlyPrice": 37,
    "rating": 5,
    "reviewCount": 201,
    "badge": "Best Seller",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/bedzone-hybrid-memory-pocket-spring-main.svg",
      "images/mattresses/bedzone-hybrid-memory-pocket-spring-lifestyle.svg",
      "images/mattresses/bedzone-hybrid-memory-pocket-spring-profile.svg",
      "images/mattresses/bedzone-hybrid-memory-pocket-spring-closeup.svg"
    ]
  },
  {
    "id": 2,
    "slug": "orthopaedic-zero-gravity",
    "name": "Orthopaedic Zero Gravity",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 399,
    "oldPrice": 499,
    "monthlyPrice": 33,
    "rating": 5,
    "reviewCount": 88,
    "badge": "New",
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/orthopaedic-zero-gravity-main.svg",
      "images/mattresses/orthopaedic-zero-gravity-lifestyle.svg",
      "images/mattresses/orthopaedic-zero-gravity-profile.svg",
      "images/mattresses/orthopaedic-zero-gravity-closeup.svg"
    ]
  },
  {
    "id": 3,
    "slug": "pillowtop-2000",
    "name": "Pillowtop 2000",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 349,
    "oldPrice": null,
    "monthlyPrice": 29,
    "rating": 4,
    "reviewCount": 52,
    "badge": null,
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/pillowtop-2000-main.svg",
      "images/mattresses/pillowtop-2000-lifestyle.svg",
      "images/mattresses/pillowtop-2000-profile.svg",
      "images/mattresses/pillowtop-2000-closeup.svg"
    ]
  },
  {
    "id": 4,
    "slug": "luxury-pocket-spring",
    "name": "Luxury Pocket Spring",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 529,
    "oldPrice": 649,
    "monthlyPrice": 44,
    "rating": 5,
    "reviewCount": 134,
    "badge": "Great Choice",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/luxury-pocket-spring-main.svg",
      "images/mattresses/luxury-pocket-spring-lifestyle.svg",
      "images/mattresses/luxury-pocket-spring-profile.svg",
      "images/mattresses/luxury-pocket-spring-closeup.svg"
    ]
  },
  {
    "id": 5,
    "slug": "cloudrest-memory-foam",
    "name": "CloudRest Memory Foam",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 299,
    "oldPrice": 379,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 66,
    "badge": "Sale",
    "firmness": [
      "Soft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/cloudrest-memory-foam-main.svg",
      "images/mattresses/cloudrest-memory-foam-lifestyle.svg",
      "images/mattresses/cloudrest-memory-foam-profile.svg",
      "images/mattresses/cloudrest-memory-foam-closeup.svg"
    ]
  },
  {
    "id": 6,
    "slug": "harmony-hybrid-deluxe",
    "name": "Harmony Hybrid Deluxe",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 599,
    "oldPrice": 729,
    "monthlyPrice": 50,
    "rating": 5,
    "reviewCount": 97,
    "badge": "Best Seller",
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/harmony-hybrid-deluxe-main.svg",
      "images/mattresses/harmony-hybrid-deluxe-lifestyle.svg",
      "images/mattresses/harmony-hybrid-deluxe-profile.svg",
      "images/mattresses/harmony-hybrid-deluxe-closeup.svg"
    ]
  },
  {
    "id": 7,
    "slug": "firmsupport-orthopaedic-pro",
    "name": "FirmSupport Orthopaedic Pro",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 459,
    "oldPrice": null,
    "monthlyPrice": 38,
    "rating": 4,
    "reviewCount": 41,
    "badge": null,
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/firmsupport-orthopaedic-pro-main.svg",
      "images/mattresses/firmsupport-orthopaedic-pro-lifestyle.svg",
      "images/mattresses/firmsupport-orthopaedic-pro-profile.svg",
      "images/mattresses/firmsupport-orthopaedic-pro-closeup.svg"
    ]
  },
  {
    "id": 8,
    "slug": "serenity-pocket-1000",
    "name": "Serenity Pocket 1000",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 329,
    "oldPrice": null,
    "monthlyPrice": 27,
    "rating": 4,
    "reviewCount": 73,
    "badge": null,
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/serenity-pocket-1000-main.svg",
      "images/mattresses/serenity-pocket-1000-lifestyle.svg",
      "images/mattresses/serenity-pocket-1000-profile.svg",
      "images/mattresses/serenity-pocket-1000-closeup.svg"
    ]
  },
  {
    "id": 9,
    "slug": "dreamsoft-memory-foam",
    "name": "DreamSoft Memory Foam",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 279,
    "oldPrice": 349,
    "monthlyPrice": 23,
    "rating": 5,
    "reviewCount": 58,
    "badge": "Sale",
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/dreamsoft-memory-foam-main.svg",
      "images/mattresses/dreamsoft-memory-foam-lifestyle.svg",
      "images/mattresses/dreamsoft-memory-foam-profile.svg",
      "images/mattresses/dreamsoft-memory-foam-closeup.svg"
    ]
  },
  {
    "id": 10,
    "slug": "everest-hybrid-support",
    "name": "Everest Hybrid Support",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 499,
    "oldPrice": null,
    "monthlyPrice": 42,
    "rating": 5,
    "reviewCount": 112,
    "badge": "New",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/everest-hybrid-support-main.svg",
      "images/mattresses/everest-hybrid-support-lifestyle.svg",
      "images/mattresses/everest-hybrid-support-profile.svg",
      "images/mattresses/everest-hybrid-support-closeup.svg"
    ]
  },
  {
    "id": 11,
    "slug": "royaltouch-pocket-spring",
    "name": "RoyalTouch Pocket Spring",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 649,
    "oldPrice": 799,
    "monthlyPrice": 54,
    "rating": 5,
    "reviewCount": 156,
    "badge": "Best Seller",
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/royaltouch-pocket-spring-main.svg",
      "images/mattresses/royaltouch-pocket-spring-lifestyle.svg",
      "images/mattresses/royaltouch-pocket-spring-profile.svg",
      "images/mattresses/royaltouch-pocket-spring-closeup.svg"
    ]
  },
  {
    "id": 12,
    "slug": "restwell-orthopaedic-classic",
    "name": "RestWell Orthopaedic Classic",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 379,
    "oldPrice": null,
    "monthlyPrice": 32,
    "rating": 4,
    "reviewCount": 39,
    "badge": null,
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/restwell-orthopaedic-classic-main.svg",
      "images/mattresses/restwell-orthopaedic-classic-lifestyle.svg",
      "images/mattresses/restwell-orthopaedic-classic-profile.svg",
      "images/mattresses/restwell-orthopaedic-classic-closeup.svg"
    ]
  },
  {
    "id": 13,
    "slug": "nightcloud-memory-foam-plus",
    "name": "NightCloud Memory Foam Plus",
    "mattressType": "memory-foam",
    "mattressTypeLabel": "Memory Foam",
    "price": 319,
    "oldPrice": 399,
    "monthlyPrice": 27,
    "rating": 4,
    "reviewCount": 47,
    "badge": "Great Choice",
    "firmness": [
      "Soft",
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/nightcloud-memory-foam-plus-main.svg",
      "images/mattresses/nightcloud-memory-foam-plus-lifestyle.svg",
      "images/mattresses/nightcloud-memory-foam-plus-profile.svg",
      "images/mattresses/nightcloud-memory-foam-plus-closeup.svg"
    ]
  },
  {
    "id": 14,
    "slug": "coastal-hybrid-breeze",
    "name": "Coastal Hybrid Breeze",
    "mattressType": "hybrid",
    "mattressTypeLabel": "Hybrid",
    "price": 549,
    "oldPrice": null,
    "monthlyPrice": 46,
    "rating": 5,
    "reviewCount": 82,
    "badge": null,
    "firmness": [
      "Medium"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/coastal-hybrid-breeze-main.svg",
      "images/mattresses/coastal-hybrid-breeze-lifestyle.svg",
      "images/mattresses/coastal-hybrid-breeze-profile.svg",
      "images/mattresses/coastal-hybrid-breeze-closeup.svg"
    ]
  },
  {
    "id": 15,
    "slug": "pureposture-orthopaedic",
    "name": "PurePosture Orthopaedic",
    "mattressType": "orthopaedic",
    "mattressTypeLabel": "Orthopaedic",
    "price": 419,
    "oldPrice": 489,
    "monthlyPrice": 35,
    "rating": 4,
    "reviewCount": 28,
    "badge": "Sale",
    "firmness": [
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/pureposture-orthopaedic-main.svg",
      "images/mattresses/pureposture-orthopaedic-lifestyle.svg",
      "images/mattresses/pureposture-orthopaedic-profile.svg",
      "images/mattresses/pureposture-orthopaedic-closeup.svg"
    ]
  },
  {
    "id": 16,
    "slug": "signature-pocket-2000",
    "name": "Signature Pocket 2000",
    "mattressType": "pocket-spring",
    "mattressTypeLabel": "Pocket Spring",
    "price": 699,
    "oldPrice": null,
    "monthlyPrice": 58,
    "rating": 5,
    "reviewCount": 164,
    "badge": "Best Seller",
    "firmness": [
      "Medium",
      "Firm"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
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
      "images/mattresses/signature-pocket-2000-main.svg",
      "images/mattresses/signature-pocket-2000-lifestyle.svg",
      "images/mattresses/signature-pocket-2000-profile.svg",
      "images/mattresses/signature-pocket-2000-closeup.svg"
    ]
  }
];

  var MATTRESS_PRODUCTS = {};
  MATTRESS_PRODUCTS_LIST.forEach(function (p) {
    MATTRESS_PRODUCTS[p.slug] = p;
  });

  var MATTRESS_SIZE_DELTAS = {
    "Single": -80,
    "Small Double": -40,
    "Double": 0,
    "King": 80,
    "Super King": 150
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

  /* ---- Filters + category pills + sort + pagination (shared state) ---- */
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

  /* ---- Grid / large-grid / list view toggle ---- */
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

  /* ---- Help section accordion ---- */
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

  /* ---- Detail view: one reusable component, populated dynamically
     from MATTRESS_PRODUCTS based on the current URL slug. ---- */
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
      var delta = mtState.selectedSize ? (MATTRESS_SIZE_DELTAS[mtState.selectedSize] || 0) : 0;
      return Math.max(0, product.price + delta);
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

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.availableSizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.setAttribute("aria-pressed", String(mtState.selectedSize === size));
        btn.textContent = size;
        btn.addEventListener("click", function () {
          mtState.selectedSize = size;
          purchaseMessage.textContent = "";
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
      prevPriceEl.textContent = product.oldPrice ? mtMoney(product.oldPrice) : "";
      qsa(".mt-option-pill", sizeOptionsEl).forEach(function (el) {
        el.setAttribute("aria-pressed", String(el.textContent === mtState.selectedSize));
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
      var isSaved = state.wishlist.has("mattress-" + product.slug);
      wishlistBtn.setAttribute("aria-pressed", String(isSaved));
      wishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }

    function renderDetail(product) {
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute(
          "content",
          product.name + " — " + product.description.split(". ")[0] + ". Shop now at Rabbora Living with free delivery and a 24 month warranty."
        );
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) {
        canonicalTag.setAttribute("href", "https://www.rabboraliving.com/mattresses/" + product.slug);
      }

      breadcrumbName.textContent = product.name;
      typeEl.textContent = product.mattressTypeLabel;
      titleEl.textContent = product.name;
      starsEl.textContent = mtStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviewCount + ")";
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
      if (canonicalTag) canonicalTag.setAttribute("href", "https://www.rabboraliving.com/mattresses");
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
      var product = MATTRESS_PRODUCTS[slug];
      if (product) {
        showDetail(product);
      } else {
        showNotFound();
      }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    function currentSlugFromHash() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        var product = MATTRESS_PRODUCTS[currentSlugFromHash()];
        if (!product) return;
        mtState.detailImageIndex = (mtState.detailImageIndex - 1 + product.images.length) % product.images.length;
        renderGallery(product);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        var product = MATTRESS_PRODUCTS[currentSlugFromHash()];
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
        var product = MATTRESS_PRODUCTS[currentSlugFromHash()];
        if (!product) return;

        if (!mtState.selectedSize) {
          purchaseMessage.textContent = "Please select a size.";
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

        var cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
          var current = parseInt(cartCountEl.textContent, 10) || 0;
          cartCountEl.textContent = String(current + mtState.quantity);
        }

        purchaseMessage.classList.remove("is-error");
        purchaseMessage.textContent =
          "Added " + mtState.quantity + " \u00d7 " + product.name + " (" + mtState.selectedSize + ", " + firmness +
          ") to your cart \u2014 " + mtMoney(currentPrice(product) * mtState.quantity) + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        var product = MATTRESS_PRODUCTS[currentSlugFromHash()];
        if (!product) return;

        if (!mtState.selectedSize) {
          purchaseMessage.textContent = "Please select a size.";
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
        var product = MATTRESS_PRODUCTS[currentSlugFromHash()];
        if (!product) return;
        var key = "mattress-" + product.slug;
        var isSaved = state.wishlist.has(key);

        if (isSaved) {
          state.wishlist.delete(key);
        } else {
          state.wishlist.add(key);
        }
        syncWishlistButton(product);
        updateWishlistCount();

        // Keep the matching grid card's heart in sync too.
        var gridBtn = document.querySelector('.mt-wishlist-btn[data-slug="' + product.slug + '"]');
        if (gridBtn) {
          gridBtn.setAttribute("aria-pressed", String(!isSaved));
        }
      });
    }
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    initProductGrids();
    initWishlist();
    initCart();
    initDesktopDropdown();
    initHeaderSearch();
    initMobileNav();
    initMobileAccordion();
    initNewsletterForm();
    initHeroSlideshow();
    initFooterYear();
    updateWishlistCount();
    initFabricSwatches();
    initFabricForm();
    initScrollReveal();
    initFabricReviewCarousel();
    initBlanketToolbar();
    initBlanketModal();
    initBlanketReviewCarousel();
    initSofaFilters();
    initSofaViewToggle();
    initSofaModal();
    initMattressFilters();
    initMattressViewToggle();
    initMattressHelp();
    initMattressDetail();
    initSofaReviewCarousel();
  });
})();