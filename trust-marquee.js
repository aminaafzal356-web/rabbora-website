/*!
 * Rabbora Living — trust strip marquee (trust-marquee.js)
 * ---------------------------------------------------------------
 * Makes the trust strip under the navigation ("Excellent customer
 * reviews", "Made in Britain", "24 Month Warranty", "Easy Returns",
 * "0% Finance Available") scroll continuously right-to-left on EVERY
 * page, exactly like the home page.
 *
 * Why a separate file: many pages don't load style.css or script.js
 * (they use their own CSS copy such as blanket-boxes.css), so the home
 * page marquee never reached them. This file brings its own CSS, so it
 * works on any page that has the strip.
 *
 * Same behaviour as the home page: the list is copied enough times to
 * cover the screen, then that whole set is copied once more; the track
 * moves by exactly one set (-50%), so the loop never jumps. Pauses on
 * hover (desktop). With "reduce motion" switched on, nothing moves and
 * the strip can be scrolled by hand. Without JavaScript the strip keeps
 * its original static layout.
 *
 * Safe next to script.js: if script.js already started the marquee
 * (home page), this file does nothing; otherwise it removes the
 * data-marquee attribute so script.js won't start a second one.
 * No dependencies.
 */
(function () {
  "use strict";

  var SPEED_PX_PER_SEC = 45;

  function addStyles() {
    if (document.getElementById("rbTrustMarqueeStyles")) return;
    // Base look of the strip (same values as style.css). Wrapped in
    // :where() so it has zero priority: any page CSS that already styles
    // the strip always wins; it only fills in on pages whose CSS has no
    // strip styles (e.g. cart, checkout, delivery, FAQs).
    var base =
      ":where(.trust-bar){background-color:var(--color-ivory,#f1ebde);border-bottom:1px solid var(--color-border,rgba(35,35,32,.1))}" +
      ":where(.trust-bar__list){display:flex;align-items:center;justify-content:flex-start;gap:1.5rem;" +
        "padding-block:.9rem;margin:0;list-style:none;overflow-x:auto;scrollbar-width:none}" +
      ":where(.trust-bar__item){display:flex;align-items:center;gap:.55rem;font-size:.8rem;" +
        "color:var(--color-forest-dark,#12281f);white-space:nowrap;flex-shrink:0}" +
      ":where(.trust-bar__item svg){color:var(--color-brass,#a47b4c);flex-shrink:0}" +
      ":where(.trust-bar__item--rating){gap:.6rem}" +
      ":where(.trust-bar__stars){display:inline-flex;align-items:center;gap:1px;color:var(--color-brass,#a47b4c);flex-shrink:0}" +
      ":where(.trust-bar__label){display:inline-flex;align-items:baseline;gap:.35rem;font-weight:600}" +
      ":where(.trust-bar__divider){width:1px;height:16px;background-color:var(--color-border,rgba(35,35,32,.1));flex-shrink:0}" +
      "@media (max-width:1023px){:where(.trust-bar__divider){display:none}}";
    var css = base +
      ".trust-bar.is-marquee{overflow:hidden}" +
      ".trust-bar.is-marquee .trust-bar__viewport{overflow:hidden;width:100%}" +
      ".trust-bar.is-marquee .trust-bar__track{display:flex;width:max-content;" +
        "animation:rbTrustMarquee var(--trust-marquee-duration,30s) linear infinite;will-change:transform}" +
      ".trust-bar.is-marquee .trust-bar__list{display:flex;flex-wrap:nowrap;align-items:center;" +
        "flex-shrink:0;justify-content:flex-start;overflow:visible;" +
        "scroll-snap-type:none;gap:1.5rem;padding-right:1.5rem}" +
      ".trust-bar.is-marquee .trust-bar__item{white-space:nowrap;flex-shrink:0}" +
      "@media (min-width:1024px){" +
        ".trust-bar.is-marquee .trust-bar__list{gap:2.5rem;padding-right:2.5rem}" +
        ".trust-bar.is-marquee .trust-bar__list::after{content:\"\";width:1px;height:16px;" +
          "background-color:var(--color-border,rgba(35,35,32,.14));flex-shrink:0}" +
      "}" +
      "@media (hover:hover){.trust-bar.is-marquee:hover .trust-bar__track{animation-play-state:paused}}" +
      "@keyframes rbTrustMarquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}" +
      "@media (prefers-reduced-motion:reduce){" +
        ".trust-bar.is-marquee .trust-bar__viewport{overflow-x:auto;scrollbar-width:none}" +
        ".trust-bar.is-marquee .trust-bar__track{animation:none}" +
      "}";
    var style = document.createElement("style");
    style.id = "rbTrustMarqueeStyles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function start(bar) {
    // Already running (script.js on the home page, or this file twice).
    if (bar.classList.contains("is-marquee") || bar.querySelector(".trust-bar__track")) return;
    var list = bar.querySelector(".trust-bar__list");
    if (!list || !list.parentNode) return;

    // Stop script.js from building a second marquee on this strip.
    bar.removeAttribute("data-marquee");

    var viewport = document.createElement("div");
    viewport.className = "trust-bar__viewport";
    var track = document.createElement("div");
    track.className = "trust-bar__track";

    // Replace the list's container with the moving track.
    var holder = list.parentNode;
    holder.parentNode.replaceChild(viewport, holder);
    viewport.appendChild(track);

    function hiddenCopy() {
      var copy = list.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      return copy;
    }

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
      for (var i = 1; i < copies; i++) track.appendChild(hiddenCopy());
      // Second, identical set for the seamless loop.
      for (var j = 0; j < copies; j++) track.appendChild(hiddenCopy());

      var distance = setWidth * copies;
      track.style.setProperty("--trust-marquee-duration", (distance / SPEED_PX_PER_SEC).toFixed(2) + "s");
      void track.offsetWidth; // restart the animation cleanly after a rebuild
      track.style.animation = "";
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
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  }

  function init() {
    var bars = document.querySelectorAll(".trust-bar");
    if (!bars.length) return;
    addStyles();
    Array.prototype.forEach.call(bars, start);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();