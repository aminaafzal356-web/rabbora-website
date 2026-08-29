(function () {
  "use strict";

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  /**
   * ===========================================================
   * DATA
   * ===========================================================
   * Every answer below is written as genuinely neutral, factual
   * wording — nothing here invents a return window, delivery
   * guarantee, refund timeframe, payment provider, warranty
   * term, tracking system, or fee that isn't already established
   * elsewhere in the project. Where an exact business detail
   * isn't confirmed, the answer says so plainly rather than
   * making one up. This structure (id/category/question/answer)
   * is what makes it easy to swap in real, final copy later
   * without touching any rendering logic below.
   */

  var CATEGORIES = [
    { id: "all", label: "All" },
    { id: "orders", label: "Orders" },
    { id: "products", label: "Products" },
    { id: "delivery", label: "Delivery" },
    { id: "returns", label: "Returns & Refunds" },
    { id: "payments", label: "Payments" },
    { id: "account", label: "Account" },
    { id: "care", label: "Care & Support" }
  ];

  var CATEGORY_LABELS = CATEGORIES.reduce(function (map, cat) {
    map[cat.id] = cat.label;
    return map;
  }, {});

  var FAQ_ITEMS = [
    {
      id: "orders-place",
      category: "orders",
      question: "How do I place an order?",
      answer: "Browse our collection, choose the options that suit your space, and add the item to your basket. From there you can review your order and proceed to checkout whenever you're ready.",
      popular: true
    },
    {
      id: "orders-change",
      category: "orders",
      question: "Can I change my order after placing it?",
      answer: "If you need to make a change after placing an order, please contact us as soon as possible and our team will do what they can to help."
    },
    {
      id: "orders-status",
      category: "orders",
      question: "How can I check my order status?",
      answer: "Your account area is the best place to check on an order. If you need an update sooner, our team can also look into it for you directly."
    },
    {
      id: "products-dimensions",
      category: "products",
      question: "Where can I find product dimensions?",
      answer: "Every product page includes the dimensions for that item. If a size you need isn't listed, get in touch and we'll help confirm the details.",
      popular: true
    },
    {
      id: "products-colours",
      category: "products",
      question: "Are product colours available in different options?",
      answer: "Many of our pieces are available in a choice of colours or fabrics — you'll find the available options on the individual product page."
    },
    {
      id: "products-size",
      category: "products",
      question: "How do I choose the right size?",
      answer: "Compare the product's listed dimensions against the space you have available, and check the \u201cWill It Fit?\u201d guidance on our Delivery page for tips on doorways, stairs and access."
    },
    {
      id: "delivery-how",
      category: "delivery",
      question: "How does delivery work?",
      answer: "Once your order is confirmed, it's prepared with care and then dispatched to you. You can find a full walkthrough of the process on our Delivery Information page.",
      popular: true
    },
    {
      id: "delivery-dispatch",
      category: "delivery",
      question: "How will I know when my order is dispatched?",
      answer: "We'll share the delivery information we have available once your order has been dispatched."
    },
    {
      id: "delivery-track",
      category: "delivery",
      question: "Can I track my delivery?",
      answer: "We're continuing to build out order tracking. In the meantime, our team can give you an update on your delivery directly."
    },
    {
      id: "delivery-before",
      category: "delivery",
      question: "What should I do before my furniture arrives?",
      answer: "It's worth measuring your entrance, checking stairways and lift access, and clearing space in the room beforehand — our Delivery page has a full preparation checklist.",
      popular: true
    },
    {
      id: "returns-request",
      category: "returns",
      question: "How do I request a return?",
      answer: "You can start a return request through our Returns &amp; Refunds page, or by getting in touch with our team directly."
    },
    {
      id: "returns-damaged",
      category: "returns",
      question: "What happens if my furniture arrives damaged?",
      answer: "If your furniture arrives damaged, please contact us as soon as possible with details and, where possible, photos, and we'll help put it right."
    },
    {
      id: "returns-refunds",
      category: "returns",
      question: "How are refunds handled?",
      answer: "Refund details are covered on our Returns &amp; Refunds page. If you can't find what you need there, our team is happy to help directly."
    },
    {
      id: "returns-exchange",
      category: "returns",
      question: "Can I request an exchange?",
      answer: "Exchanges may be possible depending on the item — please get in touch with our team and we'll talk through the options with you."
    },
    {
      id: "payments-methods",
      category: "payments",
      question: "Which payment methods are available?",
      answer: "Accepted payment methods are shown at checkout. If you have a specific question about payment options, our team can confirm what's available."
    },
    {
      id: "payments-when",
      category: "payments",
      question: "When is payment taken?",
      answer: "Payment timing is confirmed as part of the checkout process for your order."
    },
    {
      id: "payments-secure",
      category: "payments",
      question: "Is my payment information secure?",
      answer: "Payment information is handled through our checkout process. If you have specific security questions, our team is happy to talk you through it."
    },
    {
      id: "account-create",
      category: "account",
      question: "How do I create an account?",
      answer: "You can create an account from the Create Account page — it only takes a moment and lets you track orders and save your wishlist.",
      popular: true
    },
    {
      id: "account-forgot",
      category: "account",
      question: "I forgot my password. What should I do?",
      answer: "Use the Forgot Password page to request a password reset, and follow the instructions from there."
    },
    {
      id: "account-update",
      category: "account",
      question: "How do I update my account details?",
      answer: "You can review and update your account details from your account area once you're logged in."
    },
    {
      id: "care-furniture",
      category: "care",
      question: "How should I care for my furniture?",
      answer: "Care requirements vary by material and fabric — check the product page for your specific piece, or contact us if you'd like guidance."
    },
    {
      id: "care-contact",
      category: "care",
      question: "How can I contact Rabbora Living?",
      answer: "You can reach our team any time through the Contact Us page."
    }
  ];

  // Resolve a couple of answers to real, existing routes rather than
  // leaving plain text — done here (once) instead of duplicating link
  // markup throughout the data above.
  var LINK_REPLACEMENTS = {
    "delivery-how": { text: "Delivery Information page", href: "delivery.html" },
    "delivery-before": { text: "Delivery page", href: "delivery.html" },
    "returns-request": { text: "Returns &amp; Refunds page", href: "returns.html" },
    "returns-refunds": { text: "Returns &amp; Refunds page", href: "returns.html" },
    "account-create": { text: "Create Account page", href: "register.html" },
    "account-forgot": { text: "Forgot Password page", href: "forgot-password.html" },
    "care-contact": { text: "Contact Us page", href: "contact.html" }
  };

  function resolvedAnswer(item) {
    var link = LINK_REPLACEMENTS[item.id];
    if (!link) return item.answer;
    return item.answer.replace(link.text, '<a href="' + link.href + '">' + link.text + '</a>');
  }

  var ICONS = {
    orders: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 6.5L10 2.5l7.5 4v7L10 17.5l-7.5-4v-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    products: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8h8M6 11.5h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    delivery: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M1.5 5h9v8h-9zM10.5 8.5h4l3 3V13h-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    returns: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 0 1 10.2-4.2M16 10a6 6 0 0 1-10.2 4.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M14.6 3.4v3h-3M5.4 16.6v-3h3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    payments: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="5" width="15" height="10.5" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 8.3h15" stroke="currentColor" stroke-width="1.4"/></svg>',
    account: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.5 17c1.2-3.4 4-5 6.5-5s5.3 1.6 6.5 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    care: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17s-6.5-3.9-8.2-8.1C.6 6 2 3 5.1 3c1.9 0 3.4 1.1 4.9 3 1.5-1.9 3-3 4.9-3 3.1 0 4.5 3 3.3 5.9C16.5 13.1 10 17 10 17z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  };

  var state = {
    activeCategory: "all",
    searchTerm: ""
  };

  function renderCategories() {
    var container = document.getElementById("faqCategories");
    if (!container) return;

    var html = CATEGORIES.map(function (cat) {
      var pressed = cat.id === state.activeCategory;
      return (
        '<button type="button" class="faq-category-btn" data-category="' + escapeHtml(cat.id) + '" aria-pressed="' + pressed + '">' +
          escapeHtml(cat.label) +
        '</button>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderPopular() {
    var container = document.getElementById("faqPopularGrid");
    if (!container) return;

    var popularItems = FAQ_ITEMS.filter(function (item) {
      return item.popular;
    });

    var html = popularItems.map(function (item) {
      return (
        '<button type="button" class="faq-popular-card faq-reveal" data-popular-link="' + escapeHtml(item.id) + '">' +
          '<span class="faq-popular-card__icon">' + (ICONS[item.category] || "") + '</span>' +
          '<span class="faq-popular-card__text">' + escapeHtml(item.question) + '</span>' +
        '</button>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function buildFaqItemHtml(item) {
    return (
      '<div class="faq-item" id="faq-item-' + escapeHtml(item.id) + '" data-faq-id="' + escapeHtml(item.id) + '" data-category="' + escapeHtml(item.category) + '">' +
        '<span class="faq-item__category">' + escapeHtml(CATEGORY_LABELS[item.category] || item.category) + '</span>' +
        '<button type="button" class="faq-item__toggle" id="faq-toggle-' + escapeHtml(item.id) + '" aria-expanded="false" aria-controls="faq-panel-' + escapeHtml(item.id) + '">' +
          '<span>' + escapeHtml(item.question) + '</span>' +
          '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
        '</button>' +
        '<div class="faq-item__panel" id="faq-panel-' + escapeHtml(item.id) + '" role="region" aria-labelledby="faq-toggle-' + escapeHtml(item.id) + '">' +
          '<div class="faq-item__panel-inner">' +
            '<p>' + resolvedAnswer(item) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderFaqList() {
    var container = document.getElementById("faqList");
    if (!container) return;

    var html = FAQ_ITEMS.map(buildFaqItemHtml).join("");
    container.innerHTML = html;
  }

  function matchesSearch(item, term) {
    if (!term) return true;
    var haystack = (
      item.question + " " + item.answer + " " + (CATEGORY_LABELS[item.category] || item.category)
    ).toLowerCase();
    return haystack.indexOf(term.toLowerCase()) !== -1;
  }

  function applyFilters() {
    var listEl = document.getElementById("faqList");
    var noResultsEl = document.getElementById("faqNoResults");
    var countEl = document.getElementById("faqResultsCount");
    if (!listEl || !noResultsEl) return;

    var visibleCount = 0;

    FAQ_ITEMS.forEach(function (item) {
      var el = document.getElementById("faq-item-" + item.id);
      if (!el) return;

      var categoryMatches = state.activeCategory === "all" || item.category === state.activeCategory;
      var searchMatches = matchesSearch(item, state.searchTerm);
      var shouldShow = categoryMatches && searchMatches;

      if (shouldShow) {
        visibleCount++;
        el.hidden = false;
        el.classList.remove("is-filtering-out");
      } else {
        el.hidden = true;
        el.classList.remove("is-filtering-out");
      }
    });

    noResultsEl.hidden = visibleCount > 0;
    listEl.hidden = visibleCount === 0;

    if (countEl) {
      countEl.textContent = visibleCount === 0
        ? "No questions found."
        : visibleCount + " question" + (visibleCount === 1 ? "" : "s") + " shown.";
    }
  }

  function initCategoryFilter() {
    var container = document.getElementById("faqCategories");
    if (!container) return;

    container.addEventListener("click", function (event) {
      var btn = event.target.closest(".faq-category-btn");
      if (!btn) return;

      state.activeCategory = btn.getAttribute("data-category");
      qsa(".faq-category-btn", container).forEach(function (otherBtn) {
        otherBtn.setAttribute("aria-pressed", String(otherBtn === btn));
      });

      applyFilters();
    });
  }

  function initSearch() {
    var input = document.getElementById("faqSearchInput");
    var clearBtn = document.getElementById("faqSearchClear");
    if (!input) return;

    input.addEventListener("input", function () {
      state.searchTerm = input.value.trim();
      if (clearBtn) clearBtn.classList.toggle("is-visible", state.searchTerm.length > 0);
      applyFilters();
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        state.searchTerm = "";
        clearBtn.classList.remove("is-visible");
        applyFilters();
        input.focus();
      });
    }
  }

  function initNoResultsReset() {
    var resetBtn = document.getElementById("faqNoResultsReset");
    var input = document.getElementById("faqSearchInput");
    var clearBtn = document.getElementById("faqSearchClear");
    var categoriesContainer = document.getElementById("faqCategories");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", function () {
      state.searchTerm = "";
      state.activeCategory = "all";
      if (input) input.value = "";
      if (clearBtn) clearBtn.classList.remove("is-visible");
      if (categoriesContainer) {
        qsa(".faq-category-btn", categoriesContainer).forEach(function (btn) {
          btn.setAttribute("aria-pressed", String(btn.getAttribute("data-category") === "all"));
        });
      }
      applyFilters();
      if (input) input.focus();
    });
  }

  function openFaqItem(id) {
    var item = document.getElementById("faq-item-" + id);
    var toggle = document.getElementById("faq-toggle-" + id);
    if (!item || !toggle) return;

    // Close any other open item first, matching the single-open
    // accordion behaviour used elsewhere.
    qsa(".faq-item.is-open").forEach(function (openItem) {
      if (openItem !== item) {
        openItem.classList.remove("is-open");
        var openToggle = qs(".faq-item__toggle", openItem);
        if (openToggle) openToggle.setAttribute("aria-expanded", "false");
      }
    });

    item.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function initAccordion() {
    var list = document.getElementById("faqList");
    if (!list) return;

    list.addEventListener("click", function (event) {
      var toggle = event.target.closest(".faq-item__toggle");
      if (!toggle) return;

      var item = toggle.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");

      qsa(".faq-item", list).forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove("is-open");
          var otherToggle = qs(".faq-item__toggle", otherItem);
          if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  function initPopularLinks() {
    var container = document.getElementById("faqPopularGrid");
    if (!container) return;

    container.addEventListener("click", function (event) {
      var card = event.target.closest("[data-popular-link]");
      if (!card) return;

      var id = card.getAttribute("data-popular-link");

      // Make sure the category filter and search state don't hide the
      // target item before we try to scroll to and open it.
      state.activeCategory = "all";
      state.searchTerm = "";
      var input = document.getElementById("faqSearchInput");
      var clearBtn = document.getElementById("faqSearchClear");
      if (input) input.value = "";
      if (clearBtn) clearBtn.classList.remove("is-visible");
      var categoriesContainer = document.getElementById("faqCategories");
      if (categoriesContainer) {
        qsa(".faq-category-btn", categoriesContainer).forEach(function (btn) {
          btn.setAttribute("aria-pressed", String(btn.getAttribute("data-category") === "all"));
        });
      }
      applyFilters();

      var target = document.getElementById("faq-item-" + id);

      // Open the item first — this must succeed regardless of whether
      // smooth-scrolling is available, so a user's click always does
      // the one thing that matters most: reveal the answer.
      openFaqItem(id);

      if (target && typeof target.scrollIntoView === "function") {
        try {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (err) {
          // Some environments don't support the options object form —
          // fall back to the no-argument call rather than losing the
          // scroll entirely.
          try {
            target.scrollIntoView();
          } catch (err2) {
            // Scrolling isn't essential — the item is already open.
          }
        }
      }
    });
  }

  function initHeroParticles() {
    var container = document.getElementById("faqHeroParticles");
    if (!container) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var particleCount = 8;
    var positions = [
      { top: "12%", left: "10%" }, { top: "20%", left: "84%" },
      { top: "66%", left: "6%" }, { top: "74%", left: "90%" },
      { top: "8%", left: "48%" }, { top: "84%", left: "44%" },
      { top: "40%", left: "4%" }, { top: "46%", left: "94%" }
    ];

    var fragment = document.createDocumentFragment();
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "faq-hero__particle";
      var pos = positions[p % positions.length];
      particle.style.top = pos.top;
      particle.style.left = pos.left;
      particle.style.setProperty("--particle-size", (2 + (p % 2)) + "px");
      particle.style.setProperty("--particle-duration", (12 + p * 1.1) + "s");
      particle.style.setProperty("--particle-delay", (p * -1.9) + "s");
      fragment.appendChild(particle);
    }
    container.appendChild(fragment);
  }

  function initScrollReveal() {
    var revealTargets = qsa(".faq-reveal");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initFaqPage() {
    renderCategories();
    renderPopular();
    renderFaqList();
    applyFilters();

    initCategoryFilter();
    initSearch();
    initNoResultsReset();
    initAccordion();
    initPopularLinks();
    initHeroParticles();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFaqPage);
  } else {
    initFaqPage();
  }
})();
