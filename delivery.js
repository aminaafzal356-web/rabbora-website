(function () {
  "use strict";

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /**
   * ===========================================================
   * CONTENT DATA
   * ===========================================================
   * Kept as plain data here rather than duplicated across the
   * HTML, so real business content (exact timings, carriers,
   * coverage areas, policies) can be dropped in later without
   * touching markup or layout. Every placeholder below is
   * deliberately neutral — nothing here promises a specific
   * carrier, delivery window, price, or coverage area that
   * hasn't been confirmed.
   */

  var DELIVERY_STEPS = [
    {
      number: "01",
      title: "Order Confirmed",
      body: "Once you place your order, you'll receive confirmation and your order moves into preparation."
    },
    {
      number: "02",
      title: "Preparing Your Furniture",
      body: "Your furniture is carefully prepared ahead of dispatch, with care taken at every stage."
    },
    {
      number: "03",
      title: "On Its Way",
      body: "Once your order is dispatched, we'll share the delivery information we have available for it."
    },
    {
      number: "04",
      title: "Delivered to Your Home",
      body: "Your furniture arrives at your home, ready to become part of it."
    }
  ];

  var DELIVERY_OPTIONS = [
    {
      icon: "box",
      title: "Standard Delivery",
      body: "Your order delivered to your doorstep. Exact timings and availability are confirmed at checkout.",
      note: "Details confirmed at checkout"
    },
    {
      icon: "home",
      title: "Room of Choice",
      body: "Where available, have your furniture brought to the room of your choice rather than left at the door.",
      note: "Availability may vary by item"
    },
    {
      icon: "truck",
      title: "Large Furniture Delivery",
      body: "Larger pieces are handled with extra care, reflecting the space and access they need to arrive safely.",
      note: "Recommended for larger items"
    }
  ];

  var DELIVERY_DAY_POINTS = [
    "Be available for delivery on the day arranged.",
    "Make sure the entrance to your home is accessible.",
    "Check doorways, stairs and corridors are clear.",
    "Clear a space for your new furniture in advance.",
    "Inspect your delivery when it arrives."
  ];

  var CHECKLIST_ITEMS = [
    "Measure your entrance, doorways and hallway.",
    "Check stairways for width and any tight turns.",
    "Check lift access, if your home has one.",
    "Clear the room where your furniture will go.",
    "Make sure there's safe, unobstructed access throughout.",
    "Arrange for someone to be home to receive the delivery, if required."
  ];

  var FIT_POINTS = [
    "Door width",
    "Hallway width",
    "Stair width",
    "Ceiling clearance",
    "Lift dimensions, where applicable",
    "Turning space at corners"
  ];

  var SUPPORT_ITEMS = [
    {
      icon: "mail",
      title: "Contact Us",
      body: "Have a question about your delivery? Our team is here to help.",
      href: "contact.html"
    },
    {
      icon: "truck",
      title: "Track My Order",
      body: "Check in on your order once it's on its way.",
      href: "contact.html"
    },
    {
      icon: "help",
      title: "Delivery Questions",
      body: "Browse common questions about how delivery works.",
      href: "#deliveryFaqHeading"
    }
  ];

  var FAQ_ITEMS = [
    {
      question: "When will my order be delivered?",
      answer: "Delivery timing depends on the item and your location. We'll confirm the details for your specific order as it progresses."
    },
    {
      question: "How will I know when my furniture is on its way?",
      answer: "We'll share the delivery information we have available once your order has been dispatched."
    },
    {
      question: "Do I need to be home for delivery?",
      answer: "In most cases, yes — someone should be available to receive the delivery. We'll confirm what's needed for your specific order."
    },
    {
      question: "What should I do before delivery?",
      answer: "Take a look at the \u201cBefore Your Delivery\u201d checklist above — measuring access points and clearing space in advance makes delivery day much smoother."
    },
    {
      question: "What if access to my home is difficult?",
      answer: "If you know your home has tricky access — narrow stairs, a tight turn, limited parking — let us know ahead of time so we can plan accordingly."
    },
    {
      question: "Can I track my delivery?",
      answer: "We're continuing to build out order tracking. In the meantime, our team can give you an update on your delivery directly."
    },
    {
      question: "What happens if I miss my delivery?",
      answer: "If you're not available to receive your delivery, please get in touch with us as soon as possible so we can help arrange next steps."
    },
    {
      question: "How do I contact you about my delivery?",
      answer: "You can reach our team through the Contact Us page, and we'll be happy to help with any delivery question."
    }
  ];

  /**
   * ===========================================================
   * FUTURE BACKEND INTEGRATION POINTS
   * ===========================================================
   * Neither of these currently has a real backend to call. Both
   * are kept as clearly separated, easy-to-replace functions
   * rather than being faked inline.
   */

  // Replace with a real call to an order-tracking API once one
  // exists, e.g. fetch("/api/orders/" + orderId + "/tracking").
  function trackOrder(orderReference) {
    return Promise.reject(new Error("Order tracking isn't connected yet — please contact us for an update on your delivery."));
  }

  // Replace with a real postcode/coverage-check API once one
  // exists, e.g. fetch("/api/delivery/coverage?postcode=" + postcode).
  function checkDeliveryCoverage(postcode) {
    return Promise.reject(new Error("Postcode delivery checking isn't connected yet — please contact us to confirm coverage for your area."));
  }

  var ICONS = {
    box: '<svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 6.5L10 2.5l7.5 4v7L10 17.5l-7.5-4v-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M2.5 6.5L10 10.5l7.5-4M10 10.5V17.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    home: '<svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1h-3v-5H7v5H4a1 1 0 0 1-1-1V9.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    truck: '<svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true"><path d="M1.5 5h9v8h-9zM10.5 8.5h4l3 3V13h-7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="5" cy="15" r="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="14.5" cy="15" r="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    mail: '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4" width="16" height="12" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 5l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    help: '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7.8 7.8a2.2 2.2 0 1 1 3.1 2c-.9.5-1.4 1-1.4 1.9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="14.3" r="0.9" fill="currentColor"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ruler: '<svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="7" width="16" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 7v2M9 7v3M12.5 7v2M16 7v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
  };

  function renderTimeline() {
    var container = document.getElementById("deliveryTimeline");
    if (!container) return;

    var html = DELIVERY_STEPS.map(function (step) {
      return (
        '<div class="delivery-step">' +
          '<div class="delivery-step__marker">' + step.number + '</div>' +
          '<div class="delivery-step__card">' +
            '<h3 class="delivery-step__title">' + step.title + '</h3>' +
            '<p class="delivery-step__body">' + step.body + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderOptions() {
    var container = document.getElementById("deliveryOptionsGrid");
    if (!container) return;

    var html = DELIVERY_OPTIONS.map(function (option) {
      return (
        '<div class="delivery-option-card delivery-reveal">' +
          '<div class="delivery-option-card__icon">' + (ICONS[option.icon] || "") + '</div>' +
          '<h3 class="delivery-option-card__title">' + option.title + '</h3>' +
          '<p class="delivery-option-card__body">' + option.body + '</p>' +
          '<p class="delivery-option-card__note">' + option.note + '</p>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderDeliveryDay() {
    var container = document.getElementById("deliveryDayGrid");
    if (!container) return;

    var html = DELIVERY_DAY_POINTS.map(function (text) {
      return (
        '<div class="delivery-day-point delivery-reveal">' +
          '<div class="delivery-day-point__icon">' + ICONS.check + '</div>' +
          '<p class="delivery-day-point__text">' + text + '</p>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderChecklist() {
    var container = document.getElementById("deliveryChecklist");
    if (!container) return;

    var html = CHECKLIST_ITEMS.map(function (text) {
      return (
        '<div class="delivery-checklist__item">' +
          '<span class="delivery-checklist__check">' + ICONS.check + '</span>' +
          '<span class="delivery-checklist__text">' + text + '</span>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderFitPoints() {
    var container = document.getElementById("deliveryFitGrid");
    if (!container) return;

    var html = FIT_POINTS.map(function (text) {
      return (
        '<div class="delivery-fit-point delivery-reveal">' +
          ICONS.ruler +
          '<span>' + text + '</span>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderSupport() {
    var container = document.getElementById("deliverySupportGrid");
    if (!container) return;

    var html = SUPPORT_ITEMS.map(function (item) {
      return (
        '<a class="delivery-support-card delivery-reveal" href="' + item.href + '">' +
          '<div class="delivery-support-card__icon">' + (ICONS[item.icon] || "") + '</div>' +
          '<h3 class="delivery-support-card__title">' + item.title + '</h3>' +
          '<p class="delivery-support-card__body">' + item.body + '</p>' +
        '</a>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function renderFaq() {
    var container = document.getElementById("deliveryFaqList");
    if (!container) return;

    var html = FAQ_ITEMS.map(function (item, index) {
      var id = "deliveryFaq" + index;
      return (
        '<div class="delivery-faq-item" data-faq-item>' +
          '<button type="button" class="delivery-faq-item__toggle" id="' + id + '-toggle" aria-expanded="false" aria-controls="' + id + '-panel">' +
            '<span>' + item.question + '</span>' +
            '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '</button>' +
          '<div class="delivery-faq-item__panel" id="' + id + '-panel" role="region" aria-labelledby="' + id + '-toggle">' +
            '<div class="delivery-faq-item__panel-inner">' +
              '<p>' + item.answer + '</p>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    container.innerHTML = html;
  }

  function initFaqAccordion() {
    var list = document.getElementById("deliveryFaqList");
    if (!list) return;

    list.addEventListener("click", function (event) {
      var toggle = event.target.closest(".delivery-faq-item__toggle");
      if (!toggle) return;

      var item = toggle.closest(".delivery-faq-item");
      var isOpen = item.classList.contains("is-open");

      // Only one open at a time, matching the site's existing FAQ
      // pattern elsewhere.
      qsa(".delivery-faq-item", list).forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove("is-open");
          var otherToggle = qs(".delivery-faq-item__toggle", otherItem);
          if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  /**
   * A single IntersectionObserver drives every scroll-reveal effect
   * on the page (.delivery-reveal, timeline steps, checklist items,
   * and the timeline track fill) rather than creating a separate
   * observer per section.
   */
  function initScrollReveal() {
    var revealTargets = qsa(".delivery-reveal, .delivery-step, .delivery-checklist__item");
    var timelineWrap = document.getElementById("deliveryTimelineWrap");

    if (!("IntersectionObserver" in window)) {
      // Graceful degradation: show everything immediately rather than
      // leaving content permanently invisible in older browsers.
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
      if (timelineWrap) timelineWrap.classList.add("is-visible");
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

    if (timelineWrap) {
      var timelineObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      timelineObserver.observe(timelineWrap);
    }
  }

  function initHeroParticles() {
    var container = document.getElementById("deliveryHeroParticles");
    if (!container) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var particleCount = 8;
    var positions = [
      { top: "14%", left: "12%" }, { top: "22%", left: "82%" },
      { top: "68%", left: "8%" }, { top: "76%", left: "88%" },
      { top: "10%", left: "50%" }, { top: "86%", left: "46%" },
      { top: "42%", left: "6%" }, { top: "48%", left: "92%" }
    ];

    var fragment = document.createDocumentFragment();
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "delivery-hero__particle";
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

  function initDeliveryPage() {
    renderTimeline();
    renderOptions();
    renderDeliveryDay();
    renderChecklist();
    renderFitPoints();
    renderSupport();
    renderFaq();
    initFaqAccordion();
    initHeroParticles();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDeliveryPage);
  } else {
    initDeliveryPage();
  }
})();
