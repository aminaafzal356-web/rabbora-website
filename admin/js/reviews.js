/*!
 * Rabbora Living — admin reviews (admin/reviews.html)
 *   GET   /api/admin/reviews           every review + counts (search, status, pages)
 *   GET   /api/admin/reviews/:id       one review
 *   PATCH /api/reviews/:id/approval    { approved: true | false }   (existing admin endpoint)
 * Reviews are never deleted here. New customer reviews are published
 * straight away (is_approved = TRUE). A review is either Visible (shown
 * in the shop) or Hidden (is_approved = FALSE, taken off the shop by an
 * admin). The API still calls these "approved" and "pending".
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var PAGE_SIZE = 25;
  var CATEGORY_PAGES = {
    "slatted-ottoman-beds": "ottoman-beds.html", "solid-base-ottomans": "solid-base-ottomans.html",
    "storage-drawers": "storage-drawers.html", "high-headboard-beds": "high-headboard-beds.html",
    "tv-beds": "tv-beds.html", "kids-beds": "kids-beds.html", "mattresses": "mattresses.html", "sofas": "sofas.html"
  };

  var els = {
    summary: document.getElementById("listSummary"),
    search: document.getElementById("listSearch"),
    status: document.getElementById("listStatus"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    pager: document.getElementById("listPager"),
    prev: document.getElementById("pagerPrev"),
    next: document.getElementById("pagerNext"),
    pagerInfo: document.getElementById("pagerInfo"),
    detail: document.getElementById("detailPanel")
  };
  var state = { list: [], total: 0, page: 1, requestId: 0, open: null };

  function stars(n) {
    var k = Math.max(0, Math.min(5, Number(n) || 0));
    return '<span class="admin-stars" aria-label="' + k + ' out of 5">' + "★★★★★".slice(0, k) + '<span class="admin-stars__off">' + "★★★★★".slice(0, 5 - k) + "</span></span>";
  }

  function statusBadge(r) {
    return r.isApproved ? '<span class="admin-badge admin-badge--ok">Visible</span>' : '<span class="admin-badge admin-badge--warn">Hidden</span>';
  }

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    if (["pending", "approved"].indexOf(p.get("status")) !== -1) els.status.value = p.get("status");
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
    return parseInt(p.get("review"), 10) || null;
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (state.page > 1) p.set("page", String(state.page));
    if (state.open) p.set("review", String(state.open));
    var qs = p.toString();
    window.history.replaceState(null, "", "reviews.html" + (qs ? "?" + qs : ""));
  }

  // ---------- list ----------

  function renderSummary(s) {
    var cards = [
      { key: "all", label: "Total reviews", value: s.total },
      { key: "approved", label: "Visible", value: s.approved },
      { key: "pending", label: "Hidden", value: s.pending }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<button type="button" class="admin-stat admin-stat--button' + (c.warn && c.value > 0 ? " admin-stat--attention" : "") +
        (els.status.value === c.key ? " is-selected" : "") + '" data-filter="' + c.key + '">' +
        '<span class="admin-stat__label">' + c.label + '</span><span class="admin-stat__value">' + c.value + "</span></button>";
    }).join("");
  }

  function excerpt(r) {
    var text = (r.title ? r.title + " — " : "") + r.body;
    return text.length > 110 ? text.slice(0, 110) + "…" : text;
  }

  function rowHtml(r) {
    return (
      "<tr>" +
        '<td data-label="Product">' + A.escapeHtml(r.productName) + "</td>" +
        '<td data-label="Customer">' + A.escapeHtml(r.customerName) + '<span class="admin-cell-note">' + A.escapeHtml(r.customerEmail) + "</span></td>" +
        '<td data-label="Rating">' + stars(r.rating) + "</td>" +
        '<td data-label="Review" class="admin-review-cell">' + A.escapeHtml(excerpt(r)) + "</td>" +
        '<td data-label="Date" class="admin-nowrap">' + A.escapeHtml(A.formatDate(r.createdAt)) + "</td>" +
        '<td data-label="Status">' + statusBadge(r) + "</td>" +
        '<td class="admin-row-actions">' +
          '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-open="' + r.id + '">View</button>' +
          (r.isApproved
            ? '<button type="button" class="admin-btn admin-btn--danger-ghost admin-btn--sm" data-approve="0" data-id="' + r.id + '">Hide</button>'
            : '<button type="button" class="admin-btn admin-btn--primary admin-btn--sm" data-approve="1" data-id="' + r.id + '">Show</button>') +
        "</td>" +
      "</tr>"
    );
  }

  function render() {
    els.rows.innerHTML = state.list.length ? state.list.map(rowHtml).join("") : '<tr><td colspan="7" class="admin-empty">No reviews match.</td></tr>';
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total ? "Showing " + from + "–" + to + " of " + state.total + " review" + (state.total === 1 ? "" : "s") : "0 reviews";
    var pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
    els.pager.hidden = pages <= 1;
    els.pagerInfo.textContent = "Page " + state.page + " of " + pages;
    els.prev.disabled = state.page <= 1;
    els.next.disabled = state.page >= pages;
  }

  function load() {
    state.requestId += 1;
    var id = state.requestId;
    writeUrl();
    var p = new URLSearchParams({ page: String(state.page), limit: String(PAGE_SIZE), status: els.status.value });
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    els.rows.innerHTML = '<tr><td colspan="7" class="admin-empty">Loading…</td></tr>';
    return A.request("/admin/reviews?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.reviews)) {
        state.list = result.data.reviews;
        state.total = result.data.total;
        renderSummary(result.data.summary);
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="7" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Reviews could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- detail ----------

  function renderDetail(r) {
    state.detail = r;
    var page = CATEGORY_PAGES[r.categorySlug];
    els.detail.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">Review ' + statusBadge(r) + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button>' +
      "</div>" +
      '<dl class="admin-facts admin-facts--wide">' +
        "<div><dt>Product</dt><dd>" + A.escapeHtml(r.productName) +
          (page ? ' &middot; <a href="../' + page + "#/" + A.escapeHtml(r.productSlug) + '" target="_blank" rel="noopener">View in shop</a>' : "") + "</dd></div>" +
        "<div><dt>Customer</dt><dd>" + A.escapeHtml(r.customerName) + " &middot; " + A.escapeHtml(r.customerEmail) +
          ' &middot; <a href="customers.html?customer=' + r.userId + '">Open customer</a></dd></div>' +
        "<div><dt>Rating</dt><dd>" + stars(r.rating) + " (" + r.rating + "/5)</dd></div>" +
        "<div><dt>Date</dt><dd>" + A.escapeHtml(A.formatDate(r.createdAt)) + (r.updatedAt && r.updatedAt !== r.createdAt ? " (edited " + A.escapeHtml(A.formatDate(r.updatedAt)) + ")" : "") + "</dd></div>" +
        "<div><dt>Status</dt><dd>" + (r.isApproved ? "Visible — shown in the shop" : "Hidden — not shown in the shop") + "</dd></div>" +
      "</dl>" +
      (r.title ? '<h3 class="admin-review-title">' + A.escapeHtml(r.title) + "</h3>" : "") +
      '<p class="admin-notes">' + A.escapeHtml(r.body) + "</p>" +
      '<div class="admin-actions">' +
        (r.isApproved
          ? '<button type="button" class="admin-btn admin-btn--danger-ghost" data-approve="0" data-id="' + r.id + '">Hide from shop</button>'
          : '<button type="button" class="admin-btn admin-btn--primary" data-approve="1" data-id="' + r.id + '">Show in shop again</button>') +
      "</div>";
    els.detail.hidden = false;
  }

  function openReview(id) {
    state.open = id;
    writeUrl();
    els.detail.hidden = false;
    els.detail.innerHTML = '<p class="admin-muted">Loading…</p>';
    els.detail.scrollIntoView({ block: "start", behavior: "smooth" });
    A.request("/admin/reviews/" + encodeURIComponent(id)).then(function (result) {
      if (result.ok && result.data && result.data.review) {
        renderDetail(result.data.review);
        els.detail.focus();
        return;
      }
      els.detail.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(A.errorMessage(result, "This review could not be loaded.")) + "</p>";
    });
  }

  function closeReview() {
    state.open = null;
    els.detail.hidden = true;
    els.detail.innerHTML = "";
    writeUrl();
  }

  function moderate(button) {
    var id = Number(button.getAttribute("data-id"));
    var approve = button.getAttribute("data-approve") === "1";
    if (!approve && !window.confirm("Hide this review from the shop? It is not deleted and can be shown again.")) return;
    button.disabled = true;
    A.request("/reviews/" + id + "/approval", { method: "PATCH", body: { approved: approve } }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.review) {
        A.flash(approve ? "Review is visible in the shop again." : "Review hidden from the shop.", "success");
        if (state.open === id) openReview(id);
        return load();
      }
      A.flash(A.errorMessage(result, "The review could not be changed."), "error");
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.page = 1; load(); }, 300); });
  els.status.addEventListener("change", function () { state.page = 1; load(); });
  els.prev.addEventListener("click", function () { if (state.page > 1) { state.page -= 1; load(); } });
  els.next.addEventListener("click", function () { state.page += 1; load(); });
  els.summary.addEventListener("click", function (event) {
    var b = event.target.closest("[data-filter]");
    if (!b) return;
    els.status.value = b.getAttribute("data-filter");
    state.page = 1;
    load();
  });
  els.rows.addEventListener("click", function (event) {
    var open = event.target.closest("[data-open]");
    var mod = event.target.closest("[data-approve]");
    if (open) openReview(Number(open.getAttribute("data-open")));
    else if (mod) moderate(mod);
  });
  els.detail.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) closeReview();
    var mod = event.target.closest("[data-approve]");
    if (mod) moderate(mod);
  });

  A.requireAdmin("reviews").then(function () {
    var openId = readUrl();
    load().then(function () { if (openId) openReview(openId); });
  });
})();