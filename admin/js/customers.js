/*!
 * Rabbora Living — admin customers (admin/customers.html)
 *   GET   /api/admin/customers       accounts + order count / total spent (search, role, status, pages)
 *   GET   /api/admin/customers/:id   one account: addresses, recent orders, wishlist / review counts
 *   PATCH /api/users/:id             { isActive }  (existing admin endpoint)
 * No passwords or password hashes are ever loaded. Roles are not changed
 * here, and admin accounts can't be deactivated from this page.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var PAGE_SIZE = 25;
  var STATUS_LABELS = { pending: "Pending", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded" };

  var els = {
    summary: document.getElementById("listSummary"),
    search: document.getElementById("listSearch"),
    role: document.getElementById("listRole"),
    status: document.getElementById("listStatus"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    pager: document.getElementById("listPager"),
    prev: document.getElementById("pagerPrev"),
    next: document.getElementById("pagerNext"),
    pagerInfo: document.getElementById("pagerInfo"),
    detail: document.getElementById("detailPanel")
  };
  var state = { list: [], total: 0, page: 1, requestId: 0, open: null, me: null };

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    if (["customer", "admin", "all"].indexOf(p.get("role")) !== -1) els.role.value = p.get("role");
    if (["active", "inactive"].indexOf(p.get("status")) !== -1) els.status.value = p.get("status");
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
    return parseInt(p.get("customer"), 10) || null;
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.role.value !== "customer") p.set("role", els.role.value);
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (state.page > 1) p.set("page", String(state.page));
    if (state.open) p.set("customer", String(state.open));
    var qs = p.toString();
    window.history.replaceState(null, "", "customers.html" + (qs ? "?" + qs : ""));
  }

  function statusBadge(u) {
    var role = u.role === "admin" ? ' <span class="admin-badge admin-badge--neutral">Admin</span>' : "";
    return '<span class="admin-badge ' + (u.isActive ? "admin-badge--ok" : "admin-badge--off") + '">' + (u.isActive ? "Active" : "Inactive") + "</span>" + role;
  }

  function dateOnly(v) {
    var d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  // ---------- list ----------

  function renderSummary(s) {
    var cards = [
      { label: "Total customers", value: s.customers, sub: "Customer accounts" },
      { label: "Active", value: s.active, sub: "Can log in" },
      { label: "With orders", value: s.withOrders, sub: "Placed at least one order" },
      { label: "New (30 days)", value: s.new30Days, sub: "Registered in the last 30 days" }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<div class="admin-stat"><p class="admin-stat__label">' + c.label + '</p><p class="admin-stat__value">' + c.value + '</p><p class="admin-stat__sub">' + c.sub + "</p></div>";
    }).join("");
  }

  function rowHtml(u) {
    return (
      "<tr" + (u.isActive ? "" : ' class="is-inactive"') + ">" +
        '<td data-label="Customer"><button type="button" class="admin-link-btn" data-open="' + u.id + '"><strong>' + A.escapeHtml(u.name) + "</strong></button>" +
          '<span class="admin-cell-note">' + A.escapeHtml(u.email) + "</span></td>" +
        '<td data-label="Phone">' + A.escapeHtml(u.phone || "—") + "</td>" +
        '<td data-label="Registered" class="admin-nowrap">' + A.escapeHtml(dateOnly(u.createdAt)) + "</td>" +
        '<td data-label="Orders">' + u.orderCount + "</td>" +
        '<td data-label="Total spent"><strong>' + A.money(u.totalSpent) + "</strong></td>" +
        '<td data-label="Status">' + statusBadge(u) + "</td>" +
        '<td class="admin-row-actions"><button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-open="' + u.id + '">View</button></td>' +
      "</tr>"
    );
  }

  function render() {
    els.rows.innerHTML = state.list.length ? state.list.map(rowHtml).join("") : '<tr><td colspan="7" class="admin-empty">No accounts match.</td></tr>';
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total ? "Showing " + from + "–" + to + " of " + state.total : "0 accounts";
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
    var p = new URLSearchParams({ page: String(state.page), limit: String(PAGE_SIZE), role: els.role.value, status: els.status.value });
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    els.rows.innerHTML = '<tr><td colspan="7" class="admin-empty">Loading…</td></tr>';
    return A.request("/admin/customers?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.customers)) {
        state.list = result.data.customers;
        state.total = result.data.total;
        renderSummary(result.data.summary);
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="7" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Customers could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- detail ----------

  function addressHtml(a) {
    return '<div class="admin-address-card">' + (a.isDefault ? '<span class="admin-badge admin-badge--neutral">Default</span>' : "") +
      '<address class="admin-address">' +
      [a.fullName, a.addressLine1, a.addressLine2, [a.city, a.county].filter(Boolean).join(", "), a.postcode, a.country, a.phone]
        .filter(function (x) { return x; }).map(A.escapeHtml).join("<br />") +
      "</address></div>";
  }

  function renderDetail(c) {
    state.detail = c;
    var canToggle = c.role !== "admin" && (!state.me || state.me.id !== c.id);
    els.detail.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">' + A.escapeHtml(c.name) + " " + statusBadge(c) + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button>' +
      "</div>" +
      '<div class="admin-detail-grid">' +
        '<section><h3 class="admin-panel__subtitle">Account</h3><dl class="admin-facts">' +
          "<div><dt>Name</dt><dd>" + A.escapeHtml(c.name) + "</dd></div>" +
          "<div><dt>Email</dt><dd>" + A.escapeHtml(c.email) + "</dd></div>" +
          "<div><dt>Phone</dt><dd>" + A.escapeHtml(c.phone || "—") + "</dd></div>" +
          "<div><dt>Registered</dt><dd>" + A.escapeHtml(A.formatDate(c.createdAt)) + "</dd></div>" +
          "<div><dt>Role</dt><dd>" + (c.role === "admin" ? "Admin" : "Customer") + "</dd></div>" +
        "</dl>" +
        (canToggle
          ? '<button type="button" class="admin-btn admin-btn--sm ' + (c.isActive ? "admin-btn--danger-ghost" : "admin-btn--ghost") + ' admin-detail-action" data-toggle-active>' + (c.isActive ? "Deactivate account" : "Activate account") + "</button>" +
            '<p class="admin-hint">An inactive account can’t log in. Its orders, addresses and reviews are kept.</p>'
          : '<p class="admin-hint">Admin accounts can’t be deactivated here.</p>') +
        "</section>" +
        '<section><h3 class="admin-panel__subtitle">Activity</h3><dl class="admin-facts">' +
          "<div><dt>Orders</dt><dd>" + c.orderCount + "</dd></div>" +
          "<div><dt>Total spent</dt><dd>" + A.money(c.totalSpent) + "</dd></div>" +
          "<div><dt>Wishlist items</dt><dd>" + c.wishlistCount + "</dd></div>" +
          "<div><dt>Reviews</dt><dd>" + c.reviewCount + (c.reviewCount ? " (" + c.approvedReviewCount + " shown in the shop)" : "") + "</dd></div>" +
        "</dl><p class=\"admin-hint\">Total spent leaves out cancelled and refunded orders.</p></section>" +
        '<section><h3 class="admin-panel__subtitle">Addresses</h3>' +
          (c.addresses.length ? c.addresses.map(addressHtml).join("") : '<p class="admin-muted">No saved addresses.</p>') +
        "</section>" +
      "</div>" +
      '<h3 class="admin-panel__subtitle">Recent orders</h3>' +
      (c.recentOrders.length
        ? '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Payment</th><th scope="col">Total</th></tr></thead><tbody>' +
          c.recentOrders.map(function (o) {
            return '<tr><td data-label="Order"><a href="orders.html?order=' + o.id + '">' + A.escapeHtml(o.orderNumber) + "</a></td>" +
              '<td data-label="Date">' + A.escapeHtml(A.formatDate(o.createdAt)) + "</td>" +
              '<td data-label="Status">' + A.escapeHtml(STATUS_LABELS[o.status] || o.status) + "</td>" +
              '<td data-label="Payment">' + A.escapeHtml(String(o.paymentStatus || "").replace(/^./, function (c) { return c.toUpperCase(); })) + "</td>" +
              '<td data-label="Total">' + A.money(o.total) + "</td></tr>";
          }).join("") + "</tbody></table></div>"
        : '<p class="admin-muted">No orders yet.</p>');
    els.detail.hidden = false;
  }

  function openCustomer(id) {
    state.open = id;
    writeUrl();
    els.detail.hidden = false;
    els.detail.innerHTML = '<p class="admin-muted">Loading…</p>';
    els.detail.scrollIntoView({ block: "start", behavior: "smooth" });
    A.request("/admin/customers/" + encodeURIComponent(id)).then(function (result) {
      if (result.ok && result.data && result.data.customer) {
        renderDetail(result.data.customer);
        els.detail.focus();
        return;
      }
      els.detail.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(A.errorMessage(result, "This customer could not be loaded.")) + "</p>";
    });
  }

  function closeCustomer() {
    state.open = null;
    els.detail.hidden = true;
    els.detail.innerHTML = "";
    writeUrl();
  }

  function toggleActive(button) {
    var c = state.detail;
    var next = !c.isActive;
    if (!next && !window.confirm("Deactivate " + c.name + "? They won’t be able to log in until you activate the account again. Their orders are kept.")) return;
    button.disabled = true;
    A.request("/users/" + c.id, { method: "PATCH", body: { isActive: next } }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.user) {
        A.flash(c.name + "’s account is now " + (result.data.user.isActive ? "active." : "inactive."), "success");
        openCustomer(c.id);
        return load();
      }
      A.flash(A.errorMessage(result, "The account could not be changed."), "error");
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.page = 1; load(); }, 300); });
  [els.role, els.status].forEach(function (el) { el.addEventListener("change", function () { state.page = 1; load(); }); });
  els.prev.addEventListener("click", function () { if (state.page > 1) { state.page -= 1; load(); } });
  els.next.addEventListener("click", function () { state.page += 1; load(); });
  els.rows.addEventListener("click", function (event) {
    var b = event.target.closest("[data-open]");
    if (b) openCustomer(Number(b.getAttribute("data-open")));
  });
  els.detail.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) closeCustomer();
    var t = event.target.closest("[data-toggle-active]");
    if (t) toggleActive(t);
  });

  A.requireAdmin("customers").then(function (me) {
    state.me = me;
    var openId = readUrl();
    load().then(function () { if (openId) openCustomer(openId); });
  });
})();