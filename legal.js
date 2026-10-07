/*!
 * Rabbora Living — Warranty + Terms pages (legal.js)
 *  - scroll reveal: [data-anim] gets .is-in when it enters the screen
 *  - "on this page" navigation: highlights the section being read
 *  - Terms contents: open on desktop, collapsible on phones
 * Respects prefers-reduced-motion (nothing is hidden or animated).
 * No dependencies.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  window.__lgReady = true;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- scroll reveal ----------
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-anim]"));
  if (reduce || !("IntersectionObserver" in window)) {
    root.classList.remove("lg-anim");
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    root.classList.add("lg-anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  // ---------- active section in the page navigation ----------
  function trackSections(linkSelector) {
    var links = Array.prototype.slice.call(document.querySelectorAll(linkSelector));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var byId = {};
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace(/^#/, "");
      if (id && document.getElementById(id)) byId[id] = a;
    });
    var ids = Object.keys(byId);
    if (!ids.length) return;

    function setActive(id) {
      links.forEach(function (a) {
        var on = a === byId[id];
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      // Keep the active chip visible in a horizontally scrolling bar.
      var link = byId[id];
      var bar = link && link.closest("ul");
      if (bar && bar.scrollWidth > bar.clientWidth) {
        var left = link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2;
        bar.scrollTo ? bar.scrollTo({ left: left, behavior: reduce ? "auto" : "smooth" }) : (bar.scrollLeft = left);
      }
    }

    // Above the first section (e.g. back at the hero): nothing is active.
    var first = document.getElementById(ids[0]);
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        if (first.getBoundingClientRect().top > window.innerHeight * 0.3) {
          links.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
        }
      });
    }, { passive: true });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    ids.forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  trackSections(".lg-toc a[href^='#']");
  trackSections(".lg-quicknav a[href^='#']");

  // ---------- Terms contents: open on desktop, collapsible on phones ----------
  var toc = document.getElementById("lgToc");
  if (toc && window.matchMedia) {
    var desktop = window.matchMedia("(min-width: 1024px)");
    var sync = function () {
      if (desktop.matches) toc.setAttribute("open", "");
      else toc.removeAttribute("open");
    };
    sync();
    if (desktop.addEventListener) desktop.addEventListener("change", sync);
    else if (desktop.addListener) desktop.addListener(sync);

    toc.addEventListener("click", function (event) {
      if (event.target.closest("summary") && desktop.matches) event.preventDefault();
      if (event.target.closest("a") && !desktop.matches) toc.removeAttribute("open");
    });
  }
})();