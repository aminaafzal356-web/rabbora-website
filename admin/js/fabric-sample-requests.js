/*!
 * Rabbora Living — admin fabric sample requests (admin/fabric-sample-requests.html)
 *   GET   /api/admin/fabric-sample-requests        list + status counts (search, status, pages)
 *   GET   /api/admin/fabric-sample-requests/:id    one request
 *   PATCH /api/admin/fabric-sample-requests/:id    { status }
 * Real data from PostgreSQL (table fabric_sample_requests). Newest first.
 * Statuses: new, read, in_progress, completed, cancelled.
 * Nothing is ever deleted here.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var ENDPOINT = "/admin/fabric-sample-requests";
  var PAGE = "fabric-sample-requests.html";
  var OPEN_PARAM = "request";
  var LIST_KEY = "requests";      // array in the list answer
  var ITEM_KEY = "request";      // object in the one-item answer
  var NOUN = "request";
  var NOUN_PLURAL = "requests";
  var COLS = 8;
  var PAGE_SIZE = 25;

  var STATUSES = ["new", "read", "in_progress", "completed", "cancelled"];
  var STATUS_LABELS = { new: "New", read: "Read", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" };
  var STATUS_BADGE = { new: "warn", read: "neutral", in_progress: "neutral", completed: "ok", cancelled: "off" };

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
  var state = { list: [], total: 0, page: 1, requestId: 0, open: null, item: null };

  function esc(v) { return A.escapeHtml(v); }
  function dash(v) { return v ? esc(v) : '<span class="admin-muted">—</span>'; }

  function statusBadge(status) {
    return '<span class="admin-badge admin-badge--' + (STATUS_BADGE[status] || "neutral") + '">' + esc(STATUS_LABELS[status] || status) + "</span>";
  }

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    if (STATUSES.indexOf(p.get("status")) !== -1) els.status.value = p.get("status");
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
    return parseInt(p.get(OPEN_PARAM), 10) || null;
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (state.page > 1) p.set("page", String(state.page));
    if (state.open) p.set(OPEN_PARAM, String(state.open));
    var qs = p.toString();
    window.history.replaceState(null, "", PAGE + (qs ? "?" + qs : ""));
  }

  // ---------- list ----------

  function renderSummary(s) {
    var cards = [
      { key: "all", label: "Total", value: s.total },
      { key: "new", label: "New", value: s.new, warn: true },
      { key: "in_progress", label: "In progress", value: s.in_progress },
      { key: "completed", label: "Completed", value: s.completed }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<button type="button" class="admin-stat admin-stat--button' + (c.warn && c.value > 0 ? " admin-stat--attention" : "") +
        (els.status.value === c.key ? " is-selected" : "") + '" data-filter="' + c.key + '">' +
        '<span class="admin-stat__label">' + esc(c.label) + '</span><span class="admin-stat__value">' + (c.value || 0) + "</span></button>";
    }).join("");
  }

  function rowHtml(r) {
    return "<tr>" + 
      '<td data-label="Request ID">' + '#' + r.id + "</td>" +
      '<td data-label="Customer Name">' + esc(r.name) + "</td>" +
      '<td data-label="Email" style="overflow-wrap:anywhere">' + esc(r.email) + "</td>" +
      '<td data-label="Phone">' + dash(r.phone) + "</td>" +
      '<td data-label="Postcode">' + esc(r.postcode) + "</td>" +
      '<td data-label="Selected Fabrics" style="overflow-wrap:anywhere">' + esc(r.selectedFabrics) + "</td>" +
      '<td data-label="Status">' + statusBadge(r.status) + "</td>" +
      '<td data-label="Date" class="admin-nowrap">' + esc(A.formatDate(r.createdAt)) + "</td>" +
      '<td class="admin-row-actions"><button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-open="' + r.id + '">View</button></td>' +
      "</tr>";
  }

  function render() {
    var colspan = COLS + 1;
    els.rows.innerHTML = state.list.length ? state.list.map(rowHtml).join("") :
      '<tr><td colspan="' + colspan + '" class="admin-empty">No ' + NOUN_PLURAL + " match.</td></tr>";
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total ? "Showing " + from + "–" + to + " of " + state.total + " " + (state.total === 1 ? NOUN : NOUN_PLURAL) : "0 " + NOUN_PLURAL;
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
    var p = new URLSearchParams({ page: String(state.page), limit: String(PAGE_SIZE) });
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    els.rows.innerHTML = '<tr><td colspan="' + (COLS + 1) + '" class="admin-empty">Loading…</td></tr>';
    return A.request(ENDPOINT + "?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data[LIST_KEY])) {
        state.list = result.data[LIST_KEY];
        state.total = result.data.total;
        renderSummary(result.data.summary || {});
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="' + (COLS + 1) + '" class="admin-empty">' +
        esc(A.errorMessage(result, "The " + NOUN_PLURAL + " could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- detail ----------

  function statusControl(r) {
    return '<div class="admin-status-form">' +
        '<label class="admin-label" for="itemStatus">Change status</label>' +
        '<div class="admin-status-form__row">' +
          '<select class="admin-input" id="itemStatus">' +
            STATUSES.map(function (s) { return '<option value="' + s + '"' + (s === r.status ? " selected" : "") + ">" + STATUS_LABELS[s] + "</option>"; }).join("") +
          "</select>" +
          '<button type="button" class="admin-btn admin-btn--primary" data-status-save>Update status</button>' +
        "</div>" +
      "</div>";
  }

  function renderDetail(r) {
    state.item = r;
    els.detail.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">Sample request #' + r.id + " " + statusBadge(r.status) + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button>' +
      "</div>" + 
      '<dl class="admin-facts admin-facts--wide">' +
        "<div><dt>Name</dt><dd>" + esc(r.name) + "</dd></div>" +
        '<div><dt>Email</dt><dd style="overflow-wrap:anywhere"><a href="mailto:' + esc(r.email) + '">' + esc(r.email) + "</a></dd></div>" +
        '<div><dt>Phone</dt><dd><a href="tel:' + esc(String(r.phone || "").replace(/[^0-9+]/g, "")) + '">' + esc(r.phone) + "</a></dd></div>" +
        "<div><dt>Postcode</dt><dd>" + esc(r.postcode) + "</dd></div>" +
        '<div><dt>Address</dt><dd style="overflow-wrap:anywhere">' + esc(r.address) + "</dd></div>" +
        '<div><dt>Selected Fabrics</dt><dd><span class="admin-chips">' + (r.fabrics || []).map(function (f) { return '<span class="admin-chip">' + esc(f) + "</span>"; }).join(" ") + "</span></dd></div>" +
        "<div><dt>Marketing Consent</dt><dd>" + (r.marketingConsent ? "Yes \u2014 agreed to marketing updates" : "No") + "</dd></div>" +
        "<div><dt>Status</dt><dd>" + statusBadge(r.status) + "</dd></div>" +
        "<div><dt>Created Date</dt><dd>" + esc(A.formatDate(r.createdAt)) + "</dd></div>" +
      "</dl>" +
      '<h3 class="admin-review-title">Notes</h3>' +
      (r.notes ? '<p class="admin-notes">' + esc(r.notes) + "</p>" : '<p class="admin-muted">No notes.</p>') +
      statusControl(r);
    els.detail.hidden = false;
  }

  function openItem(id) {
    state.open = id;
    writeUrl();
    els.detail.hidden = false;
    els.detail.innerHTML = '<p class="admin-muted">Loading…</p>';
    els.detail.scrollIntoView({ block: "start", behavior: "smooth" });
    return A.request(ENDPOINT + "/" + encodeURIComponent(id)).then(function (result) {
      if (result.ok && result.data && result.data[ITEM_KEY]) {
        renderDetail(result.data[ITEM_KEY]);
        els.detail.focus();
        return;
      }
      els.detail.innerHTML = '<p class="admin-flash admin-flash--error">' + esc(A.errorMessage(result, "This " + NOUN + " could not be loaded.")) + "</p>";
    });
  }

  function closeItem() {
    state.open = null;
    state.item = null;
    els.detail.hidden = true;
    els.detail.innerHTML = "";
    writeUrl();
  }

  function saveStatus(button) {
    var select = document.getElementById("itemStatus");
    if (!select || !state.item) return;
    var status = select.value;
    if (status === state.item.status) {
      A.flash("Status is already " + STATUS_LABELS[status] + ".", "success");
      return;
    }
    button.disabled = true;
    select.disabled = true;
    var id = state.item.id;
    A.request(ENDPOINT + "/" + id, { method: "PATCH", body: { status: status } }).then(function (result) {
      button.disabled = false;
      select.disabled = false;
      if (result.ok && result.data && result.data[ITEM_KEY]) {
        A.flash("Status changed to " + STATUS_LABELS[result.data[ITEM_KEY].status] + ".", "success");
        renderDetail(result.data[ITEM_KEY]);
        return load();
      }
      A.flash(A.errorMessage(result, "The status could not be changed."), "error");
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
    if (open) openItem(Number(open.getAttribute("data-open")));
  });
  els.detail.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) closeItem();
    var save = event.target.closest("[data-status-save]");
    if (save) saveStatus(save);
  });

  A.requireAdmin("fabric-samples").then(function () {
    var openId = readUrl();
    load().then(function () { if (openId) openItem(openId); });
  });
})();