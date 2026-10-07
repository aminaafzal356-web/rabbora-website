/*!
 * Rabbora Living — global footer (footer.js + footer.css)
 * ---------------------------------------------------------------
 * ONE footer for every page. Each page only has:
 *
 *   <footer class="rb-footer" id="rbFooter" data-rb-footer> …noscript… </footer>
 *   <script src="footer.js?v=footer-1"></script>
 *
 * and this file builds the same footer into it. To change a link, the
 * phone number, the email or the Click Empire address, edit CONFIG below
 * — every page updates at once.
 *
 * Other pages can show the same contact details with
 *   <a data-rb-contact="phone">…</a>   <a data-rb-contact="email">…</a>
 * (filled in from CONFIG; the HTML text is only a fallback).
 *
 * No framework, no network request, no page-specific code.
 */
(function () {
  "use strict";

  // =================================================================
  // EDIT HERE
  // =================================================================
  var CONFIG = {
    phoneDisplay: "+44 7853 444640",
    phoneHref: "tel:+447853444640",
    // TEMPORARY address — replace with the final Rabbora email.
    email: "info@rabbora.co.uk",
    // TODO: put the Click Empire website address here (e.g. "https://…").
    // While it is "#", the link is shown but does nothing.
    clickEmpireUrl: "#",

    // Only pages that exist in the project. Add a line when a new page
    // exists, e.g. { label: "Privacy Policy", href: "privacy-policy.html" }.
    customerCare: [
      { label: "Contact Us", href: "contact.html" },
      { label: "Warranty", href: "warranty.html" },
      { label: "Terms & Conditions", href: "terms-and-conditions.html" },
      { label: "Delivery Information", href: "delivery.html" },
      { label: "Returns & Refunds", href: "terms-and-conditions.html#cancellations" },
      { label: "FAQs", href: "faqs.html" }
    ],
    usefulLinks: [
      { label: "Shop", href: "index.html#popular-categories-heading" },
      { label: "Beds", href: "bed-frames.html" },
      { label: "Mattresses", href: "mattresses.html" },
      { label: "Storage Beds", href: "storage-drawers.html" },
      { label: "Fabric Samples", href: "fabric-samples.html" },
      { label: "My Account", href: "account.html" },
      { label: "Wishlist", href: "wishlist.html" },
      { label: "Track Order", href: "account.html#orders" }
    ],
    // Shown as clean text badges (no third-party logos). The checkout
    // shows which options are actually available for an order.
    paymentMethods: ["Visa", "Mastercard", "Amex", "PayPal", "Klarna", "Zopa Bank"],
    social: [
      { label: "Instagram", href: "https://instagram.com/rabboraliving", path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.06.25 2.5.43a5 5 0 0 1 1.8 1.17 5 5 0 0 1 1.17 1.8c.18.44.37 1.3.43 2.5.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 2.06-.43 2.5a5 5 0 0 1-1.17 1.8 5 5 0 0 1-1.8 1.17c-.44.18-1.3.37-2.5.43-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2.06-.25-2.5-.43a5 5 0 0 1-1.8-1.17 5 5 0 0 1-1.17-1.8c-.18-.44-.37-1.3-.43-2.5-.06-1.3-.07-1.7-.07-4.9s0-3.6.07-4.9c.06-1.2.25-2.06.43-2.5a5 5 0 0 1 1.17-1.8 5 5 0 0 1 1.8-1.17c.44-.18 1.3-.37 2.5-.43C8.4 2.2 8.8 2.2 12 2.2Zm0 3.13a6.67 6.67 0 1 0 0 13.34 6.67 6.67 0 0 0 0-13.34Zm0 11a4.33 4.33 0 1 1 0-8.66 4.33 4.33 0 0 1 0 8.66Zm6.9-11.27a1.56 1.56 0 1 1-3.12 0 1.56 1.56 0 0 1 3.12 0Z" },
      { label: "Facebook", href: "https://facebook.com/rabboraliving", path: "M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.6C16.7 3.5 15.7 3.4 14.6 3.4c-2.3 0-3.9 1.4-3.9 4v2.5H8v3.1h2.7V21h2.8z" },
      { label: "TikTok", href: "https://tiktok.com/@rabboraliving", path: "M16.6 2h-3.2v13.9a2.8 2.8 0 1 1-2-2.68v-3.24a6 6 0 1 0 5.2 5.95V9.1a7.6 7.6 0 0 0 4.4 1.4V7.3a4.4 4.4 0 0 1-4.4-4.4V2Z" },
      { label: "YouTube", href: "https://youtube.com/@rabboraliving", path: "M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.7v1.6c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 6.5.2 6.5.2s3.9 0 6.7-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5v-1.6c0-1.7-.2-3.5-.2-3.5ZM9.9 14.6V8.9l5.4 2.9-5.4 2.8Z" },
      { label: "Pinterest", href: "https://pinterest.com/rabboraliving", path: "M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9l1.3-5.6s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.7 2 2 0 3.4-2.5 3.4-5.5 0-2.3-1.5-4-4.4-4-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .8 2.6.1.1.1.2.1.3l-.3 1.3c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.8-2.4-4.6 0-3.7 2.7-7.2 7.8-7.2 4.1 0 7.3 2.9 7.3 6.8 0 4-2.5 7.3-6.1 7.3-1.2 0-2.3-.6-2.7-1.4l-.7 2.8c-.3 1-1 2.3-1.4 3.1.9.3 1.9.4 3 .4 5.5 0 10-4.5 10-10S17.5 2 12 2z" }
    ]
  };
  // =================================================================

  // Shared with other pages (e.g. warranty.html shows the same contact).
  window.RabboraSite = window.RabboraSite || {};
  window.RabboraSite.contact = { phoneDisplay: CONFIG.phoneDisplay, phoneHref: CONFIG.phoneHref, email: CONFIG.email };

  var DESKTOP = "(min-width: 900px)";

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Marks the link of the page that is open (aria-current="page").
  function currentFile() {
    var file = window.location.pathname.split("/").pop() || "index.html";
    return file.toLowerCase();
  }

  function linkList(items) {
    var here = currentFile();
    return items.map(function (item) {
      var isHere = item.href.toLowerCase() === here;
      return '<li><a href="' + esc(item.href) + '"' + (isHere ? ' aria-current="page"' : "") + ">" + esc(item.label) + "</a></li>";
    }).join("");
  }

  function icon(name) {
    var paths = {
      phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/>',
      mail: '<path d="M3.5 5h17c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-17C2.7 19 2 18.3 2 17.5v-11C2 5.7 2.7 5 3.5 5Zm.6 2 7.9 5.6L19.9 7H4.1Zm15.9 2-7.4 5.2a1 1 0 0 1-1.2 0L4 9v8h16V9Z"/>',
      lock: '<path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Zm6 10H6v8h12v-8Zm-6 2a1.5 1.5 0 0 1 .8 2.8V18h-1.6v-1.2A1.5 1.5 0 0 1 12 14Zm0-10a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3Z"/>',
      chevron: '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    return '<svg class="rb-footer__icon rb-footer__icon--' + name + '" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="currentColor">' + paths[name] + "</svg>";
  }

  // A link group: an accordion on phones, an open column on desktop.
  function group(id, title, items) {
    return (
      '<details class="rb-footer__group" data-rb-footer-group>' +
        '<summary class="rb-footer__summary" id="' + id + '">' +
          '<span class="rb-footer__heading">' + esc(title) + "</span>" + icon("chevron") +
        "</summary>" +
        '<ul class="rb-footer__links" aria-labelledby="' + id + '">' + linkList(items) + "</ul>" +
      "</details>"
    );
  }

  function render() {
    var year = new Date().getFullYear();
    var credit = CONFIG.clickEmpireUrl && CONFIG.clickEmpireUrl !== "#"
      ? '<a class="rb-footer__credit-link" href="' + esc(CONFIG.clickEmpireUrl) + '" target="_blank" rel="noopener">Click Empire</a>'
      : '<a class="rb-footer__credit-link" href="#" data-rb-placeholder-link title="Click Empire">Click Empire</a>';

    return (
      '<div class="rb-footer__inner">' +
        '<div class="rb-footer__grid">' +

          '<div class="rb-footer__brand">' +
            '<a href="index.html" class="rb-footer__logo" aria-label="Rabbora Living home">' +
              '<img src="images/img-2.png" alt="" width="44" height="44" loading="lazy" decoding="async" />' +
              '<span class="rb-footer__wordmark">Rabbora<span class="rb-footer__tm">&trade;</span></span>' +
            "</a>" +
            '<p class="rb-footer__tagline">Premium furniture for beautiful homes.</p>' +
            '<p class="rb-footer__about">Beautifully crafted beds, mattresses and furniture made in Britain &mdash; designed for exceptional comfort and built to last.</p>' +
          "</div>" +

          group("rbFooterCare", "Customer Care", CONFIG.customerCare) +
          group("rbFooterLinks", "Useful Links", CONFIG.usefulLinks) +

          '<div class="rb-footer__contact" id="rbFooterContact" tabindex="-1">' +
            '<h2 class="rb-footer__heading rb-footer__heading--static">Contact Rabbora</h2>' +
            '<ul class="rb-footer__contact-list">' +
              '<li><a href="' + esc(CONFIG.phoneHref) + '">' + icon("phone") + "<span>" + esc(CONFIG.phoneDisplay) + "</span></a></li>" +
              '<li><a href="mailto:' + esc(CONFIG.email) + '">' + icon("mail") + "<span>" + esc(CONFIG.email) + "</span></a></li>" +
            "</ul>" +
            '<ul class="rb-footer__social" aria-label="Rabbora Living on social media">' +
              CONFIG.social.map(function (s) {
                return '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="Rabbora Living on ' + esc(s.label) + '">' +
                  '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false" fill="currentColor"><path d="' + s.path + '"/></svg></a></li>';
              }).join("") +
            "</ul>" +
          "</div>" +

        "</div>" +

        '<div class="rb-footer__payments">' +
          '<p class="rb-footer__secure">' + icon("lock") + "<span>Rabbora &trade; offers safe &amp; secure encrypted payments</span></p>" +
          '<ul class="rb-footer__badges" aria-label="Payment methods">' +
            CONFIG.paymentMethods.map(function (m) {
              return '<li class="rb-footer__badge rb-footer__badge--' + esc(m.toLowerCase().replace(/[^a-z]+/g, "-")) + '">' + esc(m) + "</li>";
            }).join("") +
          "</ul>" +
        "</div>" +

        '<div class="rb-footer__bottom">' +
          '<p class="rb-footer__copy">&copy; <span id="footerYear">' + year + "</span> Rabbora Living. All rights reserved.</p>" +
          '<p class="rb-footer__credit"><span class="rb-footer__credit-text">Developed by Amina Afzal</span><span class="rb-footer__dot" aria-hidden="true">&middot;</span>' + credit + "</p>" +
        "</div>" +
      "</div>"
    );
  }

  // Desktop: every group open (a normal column). Phone/tablet: closed
  // accordions so the footer stays short.
  function syncGroups(root, mq) {
    var groups = root.querySelectorAll("[data-rb-footer-group]");
    for (var i = 0; i < groups.length; i++) {
      if (mq.matches) groups[i].setAttribute("open", "");
      else groups[i].removeAttribute("open");
    }
    root.classList.toggle("rb-footer--desktop", mq.matches);
  }

  function fillContactLinks(scope) {
    var phones = scope.querySelectorAll('[data-rb-contact="phone"]');
    var emails = scope.querySelectorAll('[data-rb-contact="email"]');
    for (var i = 0; i < phones.length; i++) {
      phones[i].setAttribute("href", CONFIG.phoneHref);
      phones[i].textContent = CONFIG.phoneDisplay;
    }
    for (var j = 0; j < emails.length; j++) {
      emails[j].setAttribute("href", "mailto:" + CONFIG.email);
      emails[j].textContent = CONFIG.email;
    }
  }

  function init() {
    var root = document.getElementById("rbFooter") || document.querySelector("[data-rb-footer]");
    if (!root) {
      // A page without the placeholder still gets the footer.
      root = document.createElement("footer");
      root.className = "rb-footer";
      root.id = "rbFooter";
      document.body.appendChild(root);
    }
    root.classList.add("rb-footer");
    root.innerHTML = render();

    var mq = window.matchMedia ? window.matchMedia(DESKTOP) : { matches: true };
    syncGroups(root, mq);
    if (mq.addEventListener) mq.addEventListener("change", function () { syncGroups(root, mq); });
    else if (mq.addListener) mq.addListener(function () { syncGroups(root, mq); });

    // On desktop the headings are plain titles, not toggles.
    root.addEventListener("click", function (event) {
      var summary = event.target.closest(".rb-footer__summary");
      if (summary && mq.matches) event.preventDefault();
      var placeholder = event.target.closest("[data-rb-placeholder-link]");
      if (placeholder) event.preventDefault();
    });

    // "Contact Us": move focus to the contact column (screen readers + keyboard).
    root.addEventListener("click", function (event) {
      var link = event.target.closest('a[href="#rbFooterContact"]');
      if (!link) return;
      event.preventDefault();
      var target = document.getElementById("rbFooterContact");
      target.scrollIntoView({ block: "center", behavior: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      target.focus({ preventScroll: true });
    });

    fillContactLinks(document);
  }

  // The script tag sits right after the footer element, so the element
  // already exists: build it now (before the page scripts run).
  if (document.getElementById("rbFooter") || document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  // Contact links further down a page (after this script) are filled later.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { fillContactLinks(document); });
  }
})();