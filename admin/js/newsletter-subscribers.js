/*!
 * Rabbora Living — admin newsletter subscribers (admin/newsletter-subscribers.html)
 *   GET    /api/admin/newsletter-subscribers              list + counts (search, status, pages)
 *   GET    /api/admin/newsletter-subscribers/export.csv   CSV download (same filters)
 *   GET    /api/admin/newsletter-subscribers/:id          one subscriber (details panel)
 *   PATCH  /api/admin/newsletter-subscribers/:id          { status: "unsubscribed" }
 *   DELETE /api/admin/newsletter-subscribers/:id          confirmed subscribers only
 * Real data from PostgreSQL (table newsletter_subscribers). Newest first.
 * Admins cannot confirm anyone: only the customer can confirm, by clicking the
 * link in their own email. Tokens and token hashes are never sent to this page.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var ENDPOINT = "/admin/newsletter-subscribers";
  var PAGE = "newsletter-subscribers.html";
  var LIST_KEY = "subscribers";
  var COLS = 6;
  var PAGE_SIZE = 25;

  var STATUSES = ["pending", "active", "unsubscribed"];
  // "active" is stored as "active" but shown to the admin as "Confirmed".
  var STATUS_LABELS = { pending: "Pending", active: "Confirmed", unsubscribed: "Unsubscribed" };
  var STATUS_BADGE = { pending: "warn", active: "ok", unsubscribed: "off" };

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
    exportBtn: document.getElementById("exportCsv"),
    detail: document.getElementById("detailPanel")
  };
  var state = { list: [], total: 0, page: 1, requestId: 0, open: null };

  function esc(v) { return A.escapeHtml(v); }
  function dash(v) { return v ? esc(A.formatDate(v)) : '<span class="admin-muted">—</span>'; }

  function statusBadge(status) {
    return '<span class="admin-badge admin-badge--' + (STATUS_BADGE[status] || "neutral") + '">' + esc(STATUS_LABELS[status] || status) + "</span>";
  }

  // Only a subscriber who confirmed their email can be deleted (the server
  // enforces the same rule; this only decides which buttons are shown).
  function canDelete(s) {
    return s.status !== "pending" && Boolean(s.confirmedAt);
  }

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    if (p.get("status") === "all" || STATUSES.indexOf(p.get("status")) !== -1) els.status.value = p.get("status");
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (state.page > 1) p.set("page", String(state.page));
    var qs = p.toString();
    window.history.replaceState(null, "", PAGE + (qs ? "?" + qs : ""));
  }

  function filterQuery() {
    var p = new URLSearchParams();
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    return p;
  }

  // ---------- summary ----------

  function renderSummary(s) {
    var cards = [
      { key: "all", label: "Total", value: s.total },
      { key: "active", label: "Confirmed", value: s.active },
      { key: "pending", label: "Pending confirmation", value: s.pending, warn: true },
      { key: "unsubscribed", label: "Unsubscribed", value: s.unsubscribed }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<button type="button" class="admin-stat admin-stat--button' + (c.warn && c.value > 0 ? " admin-stat--attention" : "") +
        (els.status.value === c.key ? " is-selected" : "") + '" data-filter="' + c.key + '">' +
        '<span class="admin-stat__label">' + esc(c.label) + '</span><span class="admin-stat__value">' + (c.value || 0) + "</span></button>";
    }).join("");
  }

  // ---------- list ----------

  function rowHtml(r) {
    var action = '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-open="' + r.id + '">View</button>';
    return "<tr>" +
      '<td data-label="Email" style="overflow-wrap:anywhere">' + esc(r.email) + "</td>" +
      '<td data-label="Status">' + statusBadge(r.status) + "</td>" +
      '<td data-label="Subscribed" class="admin-nowrap">' + dash(r.consentAt) + "</td>" +
      '<td data-label="Confirmed" class="admin-nowrap">' + dash(r.confirmedAt) + "</td>" +
      '<td data-label="Unsubscribed" class="admin-nowrap">' + dash(r.unsubscribedAt) + "</td>" +
      '<td class="admin-row-actions">' + action + "</td>" +
      "</tr>";
  }

  function render() {
    els.rows.innerHTML = state.list.length ? state.list.map(rowHtml).join("") :
      '<tr><td colspan="' + COLS + '" class="admin-empty">No subscribers match.</td></tr>';
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total
      ? "Showing " + from + "–" + to + " of " + state.total + " " + (state.total === 1 ? "subscriber" : "subscribers")
      : "0 subscribers";
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
    var p = filterQuery();
    p.set("page", String(state.page));
    p.set("limit", String(PAGE_SIZE));
    els.rows.innerHTML = '<tr><td colspan="' + COLS + '" class="admin-empty">Loading…</td></tr>';
    return A.request(ENDPOINT + "?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data[LIST_KEY])) {
        state.list = result.data[LIST_KEY];
        state.total = result.data.total;
        renderSummary(result.data.summary || {});
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="' + COLS + '" class="admin-empty">' +
        esc(A.errorMessage(result, "The subscribers could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- details ----------

  function renderDetail(s) {
    state.open = s;
    var note = s.status === "pending"
      ? '<p class="admin-hint">Waiting for this person to click the link in their confirmation email. It cannot be confirmed from the admin panel.</p>'
      : "";
    var unsubscribe = s.status === "unsubscribed"
      ? ""
      : '<button type="button" class="admin-btn admin-btn--ghost" data-detail-unsubscribe="' + s.id + '" data-email="' + esc(s.email) + '">Unsubscribe</button>';
    var remove = canDelete(s)
      ? '<button type="button" class="admin-btn admin-btn--danger-ghost" data-detail-delete="' + s.id + '" data-email="' + esc(s.email) + '">Delete subscriber</button>'
      : '<p class="admin-hint">Pending subscribers can be deleted only after they confirm their email.</p>';

    els.detail.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">Subscriber #' + esc(s.id) + " " + statusBadge(s.status) + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button>' +
      "</div>" +
      '<dl class="admin-facts admin-facts--wide">' +
        '<div><dt>Email</dt><dd style="overflow-wrap:anywhere">' + esc(s.email) + "</dd></div>" +
        "<div><dt>Status</dt><dd>" + statusBadge(s.status) + "</dd></div>" +
        "<div><dt>Source</dt><dd>" + esc(s.source) + "</dd></div>" +
        "<div><dt>Subscription date</dt><dd>" + dash(s.consentAt) + "</dd></div>" +
        "<div><dt>Confirmation date</dt><dd>" + (s.confirmedAt ? dash(s.confirmedAt) : '<span class="admin-muted">Not confirmed yet</span>') + "</dd></div>" +
        "<div><dt>Unsubscribed date</dt><dd>" + dash(s.unsubscribedAt) + "</dd></div>" +
      "</dl>" +
      note +
      '<div class="admin-actions">' + unsubscribe + remove + "</div>";
    els.detail.hidden = false;
  }

  function openSubscriber(id) {
    state.open = null;
    els.detail.hidden = false;
    els.detail.innerHTML = '<p class="admin-muted">Loading…</p>';
    els.detail.scrollIntoView({ block: "start", behavior: "smooth" });
    return A.request(ENDPOINT + "/" + encodeURIComponent(id)).then(function (result) {
      if (result.ok && result.data && result.data.subscriber) {
        renderDetail(result.data.subscriber);
        els.detail.focus();
        return;
      }
      els.detail.innerHTML = '<p class="admin-flash admin-flash--error">' +
        esc(A.errorMessage(result, "This subscriber could not be loaded.")) + "</p>";
    });
  }

  function closeDetail() {
    state.open = null;
    els.detail.hidden = true;
    els.detail.innerHTML = "";
  }

  // ---------- actions ----------

  function unsubscribe(id, email, button) {
    if (!window.confirm("Unsubscribe " + email + "? They will stop receiving newsletter emails.")) return;
    if (button) button.disabled = true;
    A.request(ENDPOINT + "/" + encodeURIComponent(id), { method: "PATCH", body: { status: "unsubscribed" } }).then(function (result) {
      if (result.ok && result.data && result.data.subscriber) {
        A.flash(email + " has been unsubscribed.", "success");
        if (state.open && String(state.open.id) === String(id)) openSubscriber(id);
        return load();
      }
      if (button) button.disabled = false;
      A.flash(A.errorMessage(result, "The subscriber could not be unsubscribed."), "error");
    });
  }

  function remove(id, email, button) {
    if (!window.confirm("Delete " + email + " permanently? This removes the subscriber from the database and cannot be undone.")) return;
    if (button) button.disabled = true;
    A.request(ENDPOINT + "/" + encodeURIComponent(id), { method: "DELETE" }).then(function (result) {
      if (result.ok) {
        A.flash(email + " has been deleted.", "success");
        closeDetail();
        return load();
      }
      if (button) button.disabled = false;
      A.flash(A.errorMessage(result, "The subscriber could not be deleted."), "error");
    });
  }

  // Downloads the CSV with the admin session cookie. Tokens are never included.
  function exportCsv() {
    var url = window.RabboraApi.url(ENDPOINT + "/export.csv?" + filterQuery().toString());
    els.exportBtn.disabled = true;
    fetch(url, { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.blob();
      })
      .then(function (blob) {
        var link = document.createElement("a");
        var objectUrl = window.URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = "rabbora-newsletter-subscribers.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () { window.URL.revokeObjectURL(objectUrl); }, 1000);
        A.flash("The CSV file has been downloaded.", "success");
      })
      .catch(function () {
        A.flash("The CSV file could not be downloaded. Please try again.", "error");
      })
      .then(function () {
        els.exportBtn.disabled = false;
      });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { state.page = 1; load(); }, 300);
  });
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
    var b = event.target.closest("[data-open]");
    if (b) openSubscriber(b.getAttribute("data-open"));
  });
  els.detail.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) return closeDetail();
    var u = event.target.closest("[data-detail-unsubscribe]");
    if (u) return unsubscribe(u.getAttribute("data-detail-unsubscribe"), u.getAttribute("data-email"), u);
    var d = event.target.closest("[data-detail-delete]");
    if (d) remove(d.getAttribute("data-detail-delete"), d.getAttribute("data-email"), d);
  });
  els.exportBtn.addEventListener("click", exportCsv);

  A.requireAdmin("newsletter-subscribers").then(function () {
    readUrl();
    load();
  });
})();