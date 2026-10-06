/*!
 * Rabbora Living — admin orders (admin/orders.html)
 *   GET   /api/admin/orders      list + status counts (search, status, payment, pages)
 *   GET   /api/orders/:id        one order with its lines (existing; admins may open any order)
 *   PATCH /api/orders/:id        { status }   (existing admin endpoint; cancelling puts
 *                                tracked stock back, a cancelled order cannot be reopened)
 * Payment status is shown as stored — no payment processing here (Stripe comes later).
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var PAGE_SIZE = 25;
  var STATUS_LABELS = { pending: "Pending", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded" };
  var PAYMENT_LABELS = { unpaid: "Unpaid", paid: "Paid", refunded: "Refunded" };
  // Statuses an admin can choose here (the backend also allows these).
  var EDITABLE = ["pending", "processing", "shipped", "delivered", "cancelled"];
  var CLOSED = ["cancelled", "refunded"];

  var els = {
    summary: document.getElementById("listSummary"),
    search: document.getElementById("listSearch"),
    status: document.getElementById("listStatus"),
    payment: document.getElementById("listPayment"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    pager: document.getElementById("listPager"),
    prev: document.getElementById("pagerPrev"),
    next: document.getElementById("pagerNext"),
    pagerInfo: document.getElementById("pagerInfo"),
    detail: document.getElementById("detailPanel")
  };
  var state = { orders: [], total: 0, page: 1, requestId: 0, open: null };

  function statusBadge(status) {
    var cls = { pending: "warn", confirmed: "neutral", processing: "neutral", shipped: "ok", delivered: "ok", cancelled: "off", refunded: "off" }[status] || "neutral";
    return '<span class="admin-badge admin-badge--' + cls + '">' + A.escapeHtml(STATUS_LABELS[status] || status) + "</span>";
  }

  function paymentBadge(ps) {
    return '<span class="admin-badge ' + (ps === "paid" ? "admin-badge--ok" : "admin-badge--neutral") + '">' + A.escapeHtml(PAYMENT_LABELS[ps] || ps) + "</span>";
  }

  // ---------- address bar ----------

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    if (STATUS_LABELS[p.get("status")]) els.status.value = p.get("status");
    if (PAYMENT_LABELS[p.get("paymentStatus")]) els.payment.value = p.get("paymentStatus");
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
    return parseInt(p.get("order"), 10) || null;
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (els.payment.value !== "all") p.set("paymentStatus", els.payment.value);
    if (state.page > 1) p.set("page", String(state.page));
    if (state.open) p.set("order", String(state.open));
    var qs = p.toString();
    window.history.replaceState(null, "", "orders.html" + (qs ? "?" + qs : ""));
  }

  // ---------- list ----------

  function renderSummary(s) {
    var cards = [
      { key: "all", label: "Total orders", value: s.total },
      { key: "pending", label: "Pending", value: s.pending, warn: true },
      { key: "processing", label: "Processing", value: s.processing },
      { key: "shipped", label: "Shipped", value: s.shipped },
      { key: "delivered", label: "Delivered", value: s.delivered },
      { key: "cancelled", label: "Cancelled", value: s.cancelled }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<button type="button" class="admin-stat admin-stat--button' + (c.warn && c.value > 0 ? " admin-stat--attention" : "") +
        (els.status.value === c.key ? " is-selected" : "") + '" data-filter="' + c.key + '">' +
        '<span class="admin-stat__label">' + c.label + '</span><span class="admin-stat__value">' + c.value + "</span></button>";
    }).join("");
  }

  function rowHtml(o) {
    return (
      "<tr>" +
        '<td data-label="Order"><button type="button" class="admin-link-btn" data-open="' + o.id + '"><strong>' + A.escapeHtml(o.orderNumber) + "</strong></button></td>" +
        '<td data-label="Customer">' + A.escapeHtml(o.customer.name) + '<span class="admin-cell-note">' + A.escapeHtml(o.customer.email) + "</span></td>" +
        '<td data-label="Date" class="admin-nowrap">' + A.escapeHtml(A.formatDate(o.createdAt)) + "</td>" +
        '<td data-label="Items">' + o.itemCount + "</td>" +
        '<td data-label="Total"><strong>' + A.money(o.total) + "</strong></td>" +
        '<td data-label="Payment">' + paymentBadge(o.paymentStatus) + "</td>" +
        '<td data-label="Status">' + statusBadge(o.status) + "</td>" +
        '<td class="admin-row-actions"><button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-open="' + o.id + '">View</button></td>' +
      "</tr>"
    );
  }

  function render() {
    els.rows.innerHTML = state.orders.length ? state.orders.map(rowHtml).join("") : '<tr><td colspan="8" class="admin-empty">No orders match.</td></tr>';
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total ? "Showing " + from + "–" + to + " of " + state.total + " order" + (state.total === 1 ? "" : "s") : "0 orders";
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
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.status.value !== "all") p.set("status", els.status.value);
    if (els.payment.value !== "all") p.set("paymentStatus", els.payment.value);
    els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">Loading…</td></tr>';
    return A.request("/admin/orders?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.orders)) {
        state.orders = result.data.orders;
        state.total = result.data.total;
        renderSummary(result.data.summary);
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Orders could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- detail ----------

  function addressLines(a) {
    if (!a) return "—";
    return [a.fullName, a.addressLine1, a.addressLine2, [a.city, a.county].filter(Boolean).join(", "), a.postcode, a.country, a.phone]
      .filter(function (x) { return x; }).map(A.escapeHtml).join("<br />");
  }

  function itemRow(it) {
    var img = A.imageUrl(it.image);
    return (
      "<tr>" +
        '<td data-label="Product"><div class="admin-product-cell">' +
          (img ? '<img src="' + A.escapeHtml(img) + '" alt="" width="52" height="52" loading="lazy" />' : '<span class="admin-thumb-empty"></span>') +
          "<div><strong>" + A.escapeHtml(it.productName) + "</strong></div></div></td>" +
        '<td data-label="Size">' + (it.selectedSize ? A.escapeHtml(it.selectedSize) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Fabric">' + (it.selectedFabric ? A.escapeHtml(it.selectedFabric) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Storage">' + (it.selectedStorage ? A.escapeHtml(it.selectedStorage) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Qty">' + it.quantity + "</td>" +
        '<td data-label="Unit price">' + A.money(it.unitPrice) + "</td>" +
        '<td data-label="Line total"><strong>' + A.money(it.totalPrice) + "</strong></td>" +
      "</tr>"
    );
  }

  function statusControl(o) {
    if (CLOSED.indexOf(o.status) !== -1) {
      return '<p class="admin-hint">This order is ' + A.escapeHtml((STATUS_LABELS[o.status] || o.status).toLowerCase()) + " and can’t be reopened.</p>";
    }
    var options = EDITABLE.slice();
    if (options.indexOf(o.status) === -1) options.unshift(o.status); // e.g. "confirmed"
    return (
      '<div class="admin-status-form">' +
        '<label class="admin-label" for="orderStatus">Change status</label>' +
        '<div class="admin-status-form__row">' +
          '<select class="admin-input" id="orderStatus">' +
            options.map(function (s) { return '<option value="' + s + '"' + (s === o.status ? " selected" : "") + ">" + (STATUS_LABELS[s] || s) + "</option>"; }).join("") +
          "</select>" +
          '<button type="button" class="admin-btn admin-btn--primary" data-status-save>Update status</button>' +
        "</div>" +
        '<p class="admin-hint">Cancelling puts any tracked stock back. A cancelled order can’t be reopened.</p>' +
      "</div>"
    );
  }

  function renderDetail(o) {
    state.detailOrder = o;
    var c = o.customer || {};
    els.detail.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">Order ' + A.escapeHtml(o.orderNumber) + " " + statusBadge(o.status) + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button>' +
      "</div>" +
      '<div class="admin-detail-grid">' +
        '<section><h3 class="admin-panel__subtitle">Customer</h3><dl class="admin-facts">' +
          "<div><dt>Name</dt><dd>" + A.escapeHtml(c.name || "—") + "</dd></div>" +
          "<div><dt>Email</dt><dd>" + A.escapeHtml(c.email || "—") + "</dd></div>" +
          "<div><dt>Phone</dt><dd>" + A.escapeHtml(c.phone || "—") + "</dd></div>" +
          (o.userId ? '<div><dt>Account</dt><dd><a href="customers.html?customer=' + o.userId + '">Open customer</a></dd></div>' : "") +
        "</dl></section>" +
        '<section><h3 class="admin-panel__subtitle">Shipping address</h3><address class="admin-address">' + addressLines(o.shippingAddress) + "</address></section>" +
        '<section><h3 class="admin-panel__subtitle">Order</h3><dl class="admin-facts">' +
          "<div><dt>Order number</dt><dd>" + A.escapeHtml(o.orderNumber) + "</dd></div>" +
          "<div><dt>Created</dt><dd>" + A.escapeHtml(A.formatDate(o.createdAt)) + "</dd></div>" +
          "<div><dt>Status</dt><dd>" + statusBadge(o.status) + "</dd></div>" +
          "<div><dt>Payment</dt><dd>" + paymentBadge(o.paymentStatus) + "</dd></div>" +
          '<div><dt>Shipping method</dt><dd><span class="admin-muted">Not stored with the order</span></dd></div>' +
          "<div><dt>Shipping</dt><dd>" + (o.shipping > 0 ? A.money(o.shipping) : "Free") + "</dd></div>" +
          "<div><dt>Subtotal</dt><dd>" + A.money(o.subtotal) + "</dd></div>" +
          (o.discount > 0 ? "<div><dt>Discount</dt><dd>−" + A.money(o.discount) + "</dd></div>" : "") +
          '<div class="admin-facts__total"><dt>Total</dt><dd>' + A.money(o.total) + "</dd></div>" +
        "</dl>" + statusControl(o) + "</section>" +
      "</div>" +
      (o.notes ? '<h3 class="admin-panel__subtitle">Customer notes</h3><p class="admin-notes">' + A.escapeHtml(o.notes) + "</p>" : "") +
      '<h3 class="admin-panel__subtitle">Items</h3>' +
      '<div class="admin-table-wrap"><table class="admin-table admin-table--items"><thead><tr>' +
        '<th scope="col">Product</th><th scope="col">Size</th><th scope="col">Fabric</th><th scope="col">Storage</th><th scope="col">Qty</th><th scope="col">Unit price</th><th scope="col">Line total</th>' +
      "</tr></thead><tbody>" + (o.items || []).map(itemRow).join("") + "</tbody></table></div>";
    els.detail.hidden = false;
  }

  function openOrder(id) {
    state.open = id;
    writeUrl();
    els.detail.hidden = false;
    els.detail.innerHTML = '<p class="admin-muted">Loading order…</p>';
    els.detail.scrollIntoView({ block: "start", behavior: "smooth" });
    A.request("/orders/" + encodeURIComponent(id)).then(function (result) {
      if (result.ok && result.data && result.data.order) {
        renderDetail(result.data.order);
        els.detail.focus();
        return;
      }
      els.detail.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(A.errorMessage(result, "This order could not be loaded.")) + "</p>";
    });
  }

  function closeOrder() {
    state.open = null;
    els.detail.hidden = true;
    els.detail.innerHTML = "";
    writeUrl();
  }

  function saveStatus(button) {
    var select = document.getElementById("orderStatus");
    var order = state.open;
    var next = select.value;
    var current = state.detailOrder;
    var number = current ? current.orderNumber : "this order";
    if (current && current.status === next) { A.flash("The order already has this status.", "info"); return; }
    if (next === "cancelled" && !window.confirm("Cancel order " + number + "? Any tracked stock is put back, and a cancelled order can’t be reopened.")) return;
    button.disabled = true;
    A.request("/orders/" + order, { method: "PATCH", body: { status: next } }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.order) {
        renderDetail(result.data.order);
        A.flash("Order " + result.data.order.orderNumber + " is now " + (STATUS_LABELS[result.data.order.status] || result.data.order.status).toLowerCase() + ".", "success");
        return load();
      }
      A.flash(A.errorMessage(result, "The status could not be changed."), "error");
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.page = 1; load(); }, 300); });
  [els.status, els.payment].forEach(function (el) { el.addEventListener("change", function () { state.page = 1; load(); }); });
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
    if (b) openOrder(Number(b.getAttribute("data-open")));
  });
  els.detail.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) closeOrder();
    var save = event.target.closest("[data-status-save]");
    if (save) saveStatus(save);
  });

  A.requireAdmin("orders").then(function () {
    var openId = readUrl();
    load().then(function () { if (openId) openOrder(openId); });
  });
})();