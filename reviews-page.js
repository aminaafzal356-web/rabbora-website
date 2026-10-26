/*!
 * Rabbora Living — main Reviews page (reviews.html)
 * ---------------------------------------------------------------
 * Fills the Reviews page from the database, through the backend:
 *   GET /api/reviews/all?page=N&limit=12&rating=1-5&category=<slug>&sort=newest|highest|lowest
 * Only APPROVED reviews are returned (pending and hidden reviews are never
 * sent to the public). Each review links to its product page.
 *
 * Needs api-config.js (window.RabboraApi) loaded first.
 */
(function () {
  "use strict";

  var PAGE_SIZE = 12;

  // Database category slug -> the page that shows its products (with the
  // product detail view at "page.html#/<product-slug>").
  var PAGE_BY_CATEGORY = {
    "slatted-ottoman-beds": "ottoman-beds.html",
    "solid-base-ottomans": "solid-base-ottomans.html",
    "high-headboard-beds": "high-headboard-beds.html",
    "tv-beds": "tv-beds.html",
    "storage-drawers": "storage-drawers.html",
    "kids-beds": "kids-beds.html",
    "mattresses": "mattresses.html",
    "sofas": "sofas.html",
    "blanket-boxes": "blanket-boxes.html",
    "rapid-delivery-beds": "rapid-delivery-beds.html"
  };

  var API = window.RabboraApi;
  var grid = document.getElementById("reviewsGrid");
  var avgEl = document.getElementById("reviewsAvgScore");
  var avgStarsEl = document.getElementById("reviewsAvgStars");
  var countEl = document.getElementById("reviewsCountLabel");
  var breakdownEl = document.getElementById("reviewsBreakdown");
  var emptyEl = document.getElementById("reviewsEmptyState");
  var productSelect = document.getElementById("reviewsProductFilter");
  var sortSelect = document.getElementById("reviewsSort");
  var pills = document.querySelectorAll("[data-star-filter]");
  if (!grid) return;

  var state = { page: 1, rating: "all", category: "all", sort: "newest", total: 0, shown: 0, requestId: 0 };

  // Status line (loading / error) above the grid, and the "load more" button below it.
  var statusEl = document.createElement("p");
  statusEl.className = "reviews-status";
  statusEl.id = "reviewsStatus";
  statusEl.setAttribute("role", "status");
  statusEl.setAttribute("aria-live", "polite");
  statusEl.hidden = true;
  grid.parentNode.insertBefore(statusEl, grid);

  var moreWrap = document.createElement("div");
  moreWrap.className = "reviews-more";
  moreWrap.hidden = true;
  moreWrap.innerHTML = '<button type="button" class="btn btn--outline-forest" id="reviewsMoreBtn">Load more reviews</button>';
  grid.parentNode.insertBefore(moreWrap, grid.nextSibling);
  var moreBtn = document.getElementById("reviewsMoreBtn");

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function stars(n) {
    var r = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
    return "★".repeat(r) + "☆".repeat(5 - r);
  }

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return "";
    try {
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch (err) {
      return d.toDateString();
    }
  }

  function setStatus(text, isError) {
    statusEl.hidden = !text;
    statusEl.className = "reviews-status" + (isError ? " reviews-status--error" : "");
    statusEl.innerHTML = isError
      ? esc(text) + ' <button type="button" class="rb-link-btn" id="reviewsRetryBtn">Try again</button>'
      : esc(text);
    var retry = document.getElementById("reviewsRetryBtn");
    if (retry) retry.addEventListener("click", function () { load(false); });
  }

  function filtersActive() {
    return state.rating !== "all" || state.category !== "all";
  }

  function renderSummary(overall) {
    var count = overall && overall.count ? overall.count : 0;
    var average = overall && overall.average !== null && overall.average !== undefined ? overall.average : null;
    if (avgEl) avgEl.textContent = average === null ? "—" : Number(average).toFixed(1);
    if (avgStarsEl) avgStarsEl.textContent = average === null ? "" : stars(average);
    if (countEl) {
      countEl.textContent = count
        ? "Based on " + count + " customer review" + (count === 1 ? "" : "s")
        : "Based on customer reviews";
    }
    if (breakdownEl) {
      var dist = (overall && overall.distribution) || {};
      var html = "";
      [5, 4, 3, 2, 1].forEach(function (n) {
        var c = Number(dist[n] || 0);
        var pct = count ? Math.round((c / count) * 100) : 0;
        html +=
          '<div class="reviews-summary__bar-row">' +
            "<span>" + n + " star" + (n === 1 ? "" : "s") + "</span>" +
            '<div class="reviews-summary__bar-track"><div class="reviews-summary__bar-fill" style="--bar-pct:' + pct + '%"></div></div>' +
            '<span class="reviews-summary__bar-count">' + c + "</span>" +
          "</div>";
      });
      breakdownEl.innerHTML = html;
    }
  }

  function cardHtml(r) {
    var pageFile = PAGE_BY_CATEGORY[r.categorySlug];
    var productLink = pageFile && r.productSlug
      ? '<a href="' + esc(pageFile) + "#/" + esc(r.productSlug) + '">' + esc(r.productName) + "</a>"
      : esc(r.productName || "");
    return (
      '<article class="reviews-card">' +
        '<p class="reviews-card__stars" aria-label="' + esc(r.rating) + ' out of 5 stars">' + stars(r.rating) + "</p>" +
        (r.title ? '<h3 class="reviews-card__title">' + esc(r.title) + "</h3>" : "") +
        '<p class="reviews-card__body">' + esc(r.body) + "</p>" +
        '<p class="reviews-card__meta">' + esc(r.author || "Customer") + " &middot; " + esc(formatDate(r.createdAt)) + "</p>" +
        '<p class="reviews-card__product">' + productLink + "</p>" +
      "</article>"
    );
  }

  function render(data, append) {
    var list = Array.isArray(data.reviews) ? data.reviews : [];
    state.total = Number(data.total || 0);
    state.shown = append ? state.shown + list.length : list.length;
    renderSummary(data.overall);
    if (!append) grid.innerHTML = "";
    grid.insertAdjacentHTML("beforeend", list.map(cardHtml).join(""));
    if (emptyEl) {
      var none = state.shown === 0;
      emptyEl.hidden = !none;
      emptyEl.textContent = filtersActive()
        ? "No reviews match these filters yet."
        : "No reviews have been published yet. Be the first to share your experience from a product page.";
    }
    moreWrap.hidden = state.shown >= state.total;
    setStatus("", false);
  }

  function load(append) {
    if (!API) {
      setStatus("We could not load reviews. Please refresh the page.", true);
      return;
    }
    var id = ++state.requestId;
    var query = "/reviews/all?page=" + state.page + "&limit=" + PAGE_SIZE + "&sort=" + encodeURIComponent(state.sort);
    if (state.rating !== "all") query += "&rating=" + encodeURIComponent(state.rating);
    if (state.category !== "all") query += "&category=" + encodeURIComponent(state.category);
    if (!append) grid.innerHTML = "";
    setStatus("Loading reviews…", false);
    API.request(query, { method: "GET" }).then(function (result) {
      if (id !== state.requestId) return;
      if (!result || !result.ok || !result.data) {
        setStatus("We could not load reviews right now. Please try again.", true);
        return;
      }
      render(result.data, append);
    });
  }

  function reset() {
    state.page = 1;
    state.shown = 0;
    load(false);
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      state.rating = pill.getAttribute("data-star-filter");
      pills.forEach(function (p) {
        var on = p === pill;
        p.classList.toggle("is-active", on);
        p.setAttribute("aria-pressed", on ? "true" : "false");
      });
      reset();
    });
  });

  if (productSelect) {
    productSelect.addEventListener("change", function () {
      state.category = productSelect.value || "all";
      reset();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value || "newest";
      reset();
    });
  }

  moreBtn.addEventListener("click", function () {
    state.page += 1;
    load(true);
  });

  load(false);
})();