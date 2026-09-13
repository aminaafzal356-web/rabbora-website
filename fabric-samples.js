
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

  var FABRIC_MAX_SELECTION = 4;

  function initFabricSwatches() {
    var grid = document.getElementById("fabricGrid");
    if (!grid) return;

    var statusEl = document.getElementById("fabricSelectionStatus");
    var limitMessageEl = document.getElementById("fabricLimitMessage");
    var swatches = qsa(".fabric-swatch", grid);
    var selected = [];
    var limitTimer = null;

    // If a swatch is already marked as selected in the HTML (the
    // default fabric shown when the page loads), reflect that in the
    // selection state so the counter/form list match what's on screen.
    swatches.forEach(function (btn) {
      if (btn.getAttribute("aria-pressed") === "true") {
        selected.push(btn.dataset.fabric);
      }
    });

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
      // True multi-select: up to FABRIC_MAX_SELECTION (4) fabrics can be
      // selected at once. Selecting a new one never clears existing
      // selections — it's only blocked once the limit is reached.
      if (selected.length >= FABRIC_MAX_SELECTION) {
        showLimitMessage();
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

  var FABRIC_CATALOG = [
    { slug: "plush-grey", name: "Plush Grey", image: "img-34.jfif" },
    { slug: "plush-silver", name: "Plush Silver", image: "img-35.jfif" },
    { slug: "plush-steel", name: "Plush Steel", image: "img-36.jfif" },
    { slug: "plush-black", name: "Plush Black", image: "img-37.jfif" },
    { slug: "plush-mustard", name: "Plush Mustard", image: "img-38.jfif" },
    { slug: "plush-duck-egg", name: "Plush Duck Egg", image: "img-39.jfif" },
    { slug: "plush-camel", name: "Plush Camel", image: "img-40.jfif" },
    { slug: "plush-teal", name: "Plush Teal", image: "img-46.jfif" },
    { slug: "plush-royal-blue", name: "Plush Royal Blue", image: "img-48.jfif" },
    { slug: "plush-plum", name: "Plush Plum", image: "img-51.jfif" },
    { slug: "plush-white", name: "Plush White", image: "img-101.jfif" },
    { slug: "plush-baby-pink", name: "Plush Baby Pink", image: "img-102.jfif" },
    { slug: "plush-ice-silver", name: "Plush Ice Silver", image: "img-104.jfif" },
    { slug: "plush-cream", name: "Plush Cream", image: "img-105.jfif" },
    { slug: "plush-pebble", name: "Plush Pebble", image: "img-106.jfif" },
    { slug: "plush-mocca", name: "Plush Mocca", image: "img-107.jfif" },
    { slug: "plush-emerald-green", name: "Plush Emerald Green", image: "img-108.jfif" },
    { slug: "plush-beige", name: "Plush Beige", image: "img-109.jfif" },
    { slug: "plush-pink", name: "Plush Pink", image: "img-110.jfif" },
    { slug: "plush-green", name: "Plush Green", image: "img-111.jfif" },
    { slug: "plush-turquoise", name: "Plush Turquoise", image: "img-112.jfif" },
    { slug: "chenille-cream", name: "Chenille Cream", image: "img-113.jfif" },
    { slug: "chenille-mink", name: "Chenille Mink", image: "img-114.jfif" },
    { slug: "chenille-chocolate", name: "Chenille Chocolate", image: "img-115.jfif" },
    { slug: "chenille-steel", name: "Chenille Steel", image: "img-116.jfif" },
    { slug: "chenille-charcoal", name: "Chenille Charcoal", image: "img-117.jfif" },
    { slug: "chenille-duck-egg", name: "Chenille Duck Egg", image: "img-118.jfif" },
    { slug: "chenille-teal", name: "Chenille Teal", image: "img-119.jfif" },
    { slug: "chenille-purple", name: "Chenille Purple", image: "img-120.jfif" },
    { slug: "chenille-plum", name: "Chenille Plum", image: "img-121.jfif" },
    { slug: "chenille-red", name: "Chenille Red", image: "img-122.jfif" },
    { slug: "chenille-black", name: "Chenille Black", image: "img-123.jfif" },
    { slug: "coniston-charcoal", name: "Coniston Charcoal", image: "img-34.jfif" },
    { slug: "coniston-almond", name: "Coniston Almond", image: "img-35.jfif" },
    { slug: "coniston-armour", name: "Coniston Armour", image: "img-36.jfif" },
    { slug: "coniston-emerald", name: "Coniston Emerald", image: "img-37.jfif" },
    { slug: "coniston-pink", name: "Coniston Pink", image: "img-38.jfif" },
    { slug: "coniston-blue", name: "Coniston Blue", image: "img-39.jfif" },
    { slug: "naples-silver", name: "Naples Silver", image: "img-40.jfif" },
    { slug: "naples-steel", name: "Naples Steel", image: "img-46.jfif" },
    { slug: "naples-black", name: "Naples Black", image: "img-48.jfif" },
    { slug: "naples-ivory", name: "Naples Ivory", image: "img-51.jfif" },
    { slug: "naples-cream", name: "Naples Cream", image: "img-101.jfif" },
    { slug: "naples-sand", name: "Naples Sand", image: "img-102.jfif" },
    { slug: "naples-mink", name: "Naples Mink", image: "img-104.jfif" },
    { slug: "naples-seal-grey", name: "Naples Seal Grey", image: "img-105.jfif" },
    { slug: "naples-slate", name: "Naples Slate", image: "img-106.jfif" },
    { slug: "naples-charcoal", name: "Naples Charcoal", image: "img-107.jfif" },
    { slug: "naples-blue", name: "Naples Blue", image: "img-108.jfif" },
    { slug: "naples-plum", name: "Naples Plum", image: "img-109.jfif" },
    { slug: "naples-grey", name: "Naples Grey", image: "img-110.jfif" },
    { slug: "naples-brown", name: "Naples Brown", image: "img-111.jfif" },
    { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver", image: "img-112.jfif" },
    { slug: "crushed-velvet-black", name: "Crushed Velvet Black", image: "img-113.jfif" },
    { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream", image: "img-114.jfif" },
    { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink", image: "img-115.jfif" },
    { slug: "crushed-white", name: "Crushed White", image: "img-116.jfif" },
    { slug: "crushed-grey", name: "Crushed Grey", image: "img-117.jfif" },
    { slug: "crushed-cream", name: "Crushed Cream", image: "img-118.jfif" },
    { slug: "crushed-camel", name: "Crushed Camel", image: "img-119.jfif" },
    { slug: "crushed-gold", name: "Crushed Gold", image: "img-120.jfif" },
    { slug: "crushed-mink", name: "Crushed Mink", image: "img-121.jfif" },
    { slug: "crushed-truffle", name: "Crushed Truffle", image: "img-122.jfif" },
    { slug: "crushed-teal", name: "Crushed Teal", image: "img-123.jfif" },
    { slug: "crushed-denim", name: "Crushed Denim", image: "img-34.jfif" },
    { slug: "crushed-hot-pink", name: "Crushed Hot Pink", image: "img-35.jfif" },
    { slug: "crushed-purple", name: "Crushed Purple", image: "img-36.jfif" },
    { slug: "crushed-plum", name: "Crushed Plum", image: "img-37.jfif" },
    { slug: "crushed-baby-pink", name: "Crushed Baby Pink", image: "img-38.jfif" },
    { slug: "linoso-sand", name: "Linoso Sand", image: "img-39.jfif" },
    { slug: "linoso-silver", name: "Linoso Silver", image: "img-40.jfif" },
    { slug: "linoso-slate-grey", name: "Linoso Slate Grey", image: "img-46.jfif" },
    { slug: "linoso-charcoal", name: "Linoso Charcoal", image: "img-48.jfif" },
    { slug: "linoso-truffle", name: "Linoso Truffle", image: "img-51.jfif" },
    { slug: "linoso-black", name: "Linoso Black", image: "img-101.jfif" },
    { slug: "linoso-midnight-blue", name: "Linoso Midnight Blue", image: "img-102.jfif" },
    { slug: "linoso-plum", name: "Linoso Plum", image: "img-104.jfif" },
    { slug: "boucle-granite", name: "Boucle Granite", image: "img-105.jfif" },
    { slug: "boucle-dove", name: "Boucle Dove", image: "img-106.jfif" },
    { slug: "boucle-ivory", name: "Boucle Ivory", image: "img-107.jfif" },
    { slug: "boucle-truffle", name: "Boucle Truffle", image: "img-108.jfif" },
    { slug: "cream-boucle", name: "Cream Boucle", image: "img-109.jfif" },
    { slug: "pink-boucle", name: "Pink Boucle", image: "img-110.jfif" },
    { slug: "marble-oatmeal", name: "Marble Oatmeal", image: "img-111.jfif" },
    { slug: "marble-platinum", name: "Marble Platinum", image: "img-112.jfif" },
    { slug: "marble-silver", name: "Marble Silver", image: "img-113.jfif" }
  ];

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
    initWishlist();
    initCart();
    initDesktopDropdown();
    initSearchCategoryMenu();
    initHeaderSearch();
    initMobileNav();
    initMobileAccordion();
    initFooterYear();
    updateWishlistCount();
    initFabricSwatches();
    initFabricForm();
    initScrollReveal();
    initFabricReviewCarousel();
    initMattressHelp();
    initStorageDrawersFaq();
  });
})();