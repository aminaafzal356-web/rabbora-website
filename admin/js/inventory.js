/*!
 * Rabbora Living — admin inventory (admin/inventory.html)
 *   GET   /api/admin/inventory     stock records + not-tracked products (search, filter, pages)
 *   GET   /api/admin/products/:id  the product's sizes (to start tracking one size)
 *   POST  /api/inventory           start tracking   (existing admin endpoint)
 *   PATCH /api/inventory/:id       { adjustBy } | { stockQuantity }, { lowStockThreshold }, { isActive }  (existing)
 * Low stock = stock <= alert level (the existing rule). Stock can never go
 * below 0 (database check). Records are never deleted; "Stop tracking"
 * only switches a record off.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var PAGE_SIZE = 25;

  var els = {
    summary: document.getElementById("invSummary"),
    search: document.getElementById("listSearch"),
    filter: document.getElementById("listFilter"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    pager: document.getElementById("listPager"),
    prev: document.getElementById("pagerPrev"),
    next: document.getElementById("pagerNext"),
    pagerInfo: document.getElementById("pagerInfo"),
    panel: document.getElementById("stockPanel")
  };
  var state = { items: [], total: 0, page: 1, requestId: 0 };

  // ---------- address bar ----------

  function readUrl() {
    var p = new URLSearchParams(window.location.search);
    els.search.value = p.get("search") || "";
    var fl = p.get("filter");
    els.filter.value = ["low", "out", "tracked", "untracked"].indexOf(fl) !== -1 ? fl : "all";
    state.page = Math.max(1, parseInt(p.get("page"), 10) || 1);
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    if (els.filter.value !== "all") p.set("filter", els.filter.value);
    if (state.page > 1) p.set("page", String(state.page));
    var qs = p.toString();
    window.history.replaceState(null, "", "inventory.html" + (qs ? "?" + qs : ""));
  }

  // ---------- rendering ----------

  function renderSummary(s) {
    var cards = [
      { key: "tracked", label: "Tracked records", value: s.tracked, sub: "Active stock records" },
      { key: "low", label: "Low stock", value: s.low, sub: "At or below alert level", warn: true },
      { key: "out", label: "Out of stock", value: s.out, sub: "Stock is 0", warn: true },
      { key: "untracked", label: "Not tracked", value: s.untracked, sub: "Products with unlimited stock" }
    ];
    els.summary.innerHTML = cards.map(function (c) {
      return '<button type="button" class="admin-stat admin-stat--button' + (c.warn && c.value > 0 ? " admin-stat--attention" : "") +
        (els.filter.value === c.key ? " is-selected" : "") + '" data-filter="' + c.key + '">' +
        '<span class="admin-stat__label">' + c.label + "</span>" +
        '<span class="admin-stat__value">' + c.value + "</span>" +
        '<span class="admin-stat__sub">' + c.sub + "</span></button>";
    }).join("");
  }

  function levelHtml(it) {
    if (!it.tracked) return '<span class="admin-muted">Not tracked — unlimited</span>';
    if (it.level === "variant") return "Size: <strong>" + A.escapeHtml(it.sizeLabel || "?") + "</strong>" + (it.variantActive === false ? ' <small class="admin-muted">(size off)</small>' : "");
    return "<strong>Whole product</strong>";
  }

  function statusHtml(it) {
    if (!it.tracked) return '<span class="admin-badge admin-badge--neutral">Unlimited</span>';
    if (!it.isActive) return '<span class="admin-badge admin-badge--neutral">Tracking off</span>';
    if (it.outOfStock) return '<span class="admin-badge admin-badge--off">Out of stock</span>';
    if (it.lowStock) return '<span class="admin-badge admin-badge--warn">Low stock</span>';
    return '<span class="admin-badge admin-badge--ok">In stock</span>';
  }

  function rowHtml(it, index) {
    var img = A.imageUrl(it.mainImage);
    return (
      "<tr" + (it.tracked && !it.isActive ? ' class="is-inactive"' : "") + ">" +
        '<td data-label="Product"><div class="admin-product-cell">' +
          (img ? '<img src="' + A.escapeHtml(img) + '" alt="" width="52" height="52" loading="lazy" />' : '<span class="admin-thumb-empty"></span>') +
          '<div><a class="admin-product-cell__name" href="product.html?id=' + it.productId + '">' + A.escapeHtml(it.productName) + "</a>" +
          (it.productActive ? "" : '<span class="admin-cell-note">Product inactive</span>') + "</div>" +
        "</div></td>" +
        '<td data-label="Tracked as">' + levelHtml(it) + "</td>" +
        '<td data-label="SKU" class="admin-mono">' + (it.sku ? A.escapeHtml(it.sku) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Stock"><strong>' + (it.tracked ? it.stockQuantity : "∞") + "</strong></td>" +
        '<td data-label="Alert at">' + (it.tracked ? it.lowStockThreshold : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Status">' + statusHtml(it) + "</td>" +
        '<td data-label="Last updated" class="admin-nowrap">' + (it.tracked ? A.escapeHtml(A.formatDate(it.updatedAt)) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td class="admin-row-actions">' +
          (it.tracked
            ? '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-adjust="' + index + '">Update stock</button>'
            : '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-track="' + index + '">Start tracking</button>') +
        "</td>" +
      "</tr>"
    );
  }

  function render() {
    els.rows.innerHTML = state.items.length
      ? state.items.map(rowHtml).join("")
      : '<tr><td colspan="8" class="admin-empty">Nothing matches.</td></tr>';
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total ? "Showing " + from + "–" + to + " of " + state.total : "0 results";
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
    var p = new URLSearchParams();
    p.set("page", String(state.page));
    p.set("limit", String(PAGE_SIZE));
    p.set("filter", els.filter.value);
    if (els.search.value.trim()) p.set("search", els.search.value.trim());
    els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">Loading…</td></tr>';
    return A.request("/admin/inventory?" + p.toString()).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.items)) {
        state.items = result.data.items;
        state.total = result.data.total;
        renderSummary(result.data.summary);
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Inventory could not be loaded.")) + "</td></tr>";
    });
  }

  // ---------- panel helpers ----------

  function field(name, label, value, hint, attrs) {
    return '<div class="admin-field" data-field="' + name + '">' +
      '<label class="admin-label" for="s_' + name + '">' + label + "</label>" +
      '<input class="admin-input" id="s_' + name + '" name="' + name + '" type="text" value="' + A.escapeHtml(value == null ? "" : value) + '" ' + (attrs || "") + ' aria-invalid="false" />' +
      (hint ? '<p class="admin-hint">' + hint + "</p>" : "") +
      '<p class="admin-error" role="alert" hidden></p></div>';
  }

  function closePanel() {
    els.panel.hidden = true;
    els.panel.innerHTML = "";
  }

  function wholeNumber(value, allowNegative) {
    var v = String(value || "").trim();
    return (allowNegative ? /^-?\d+$/ : /^\d+$/).test(v) ? parseInt(v, 10) : null;
  }

  // ---------- update stock (existing PATCH /api/inventory/:id) ----------

  function openAdjust(it) {
    els.panel.innerHTML =
      '<div class="admin-panel__head"><h2 class="admin-panel__title">Update stock: ' + A.escapeHtml(it.productName) +
        (it.level === "variant" ? " — " + A.escapeHtml(it.sizeLabel) : " (whole product)") + "</h2>" +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button></div>' +
      '<form id="adjustForm" novalidate>' +
        '<div class="admin-grid">' +
          '<div class="admin-field"><span class="admin-label">How</span>' +
            '<div class="admin-segment" role="radiogroup" aria-label="How to change the stock">' +
              '<label><input type="radio" name="mode" value="adjust" checked /><span>Add / remove</span></label>' +
              '<label><input type="radio" name="mode" value="set" /><span>Set exact number</span></label>' +
            "</div></div>" +
          field("amount", "Amount", "", "For add / remove use e.g. 5 or -2.", 'inputmode="numeric"') +
          field("lowStockThreshold", "Alert at (low-stock level)", it.lowStockThreshold, "Low stock when stock is at or below this number.", 'inputmode="numeric"') +
          '<div class="admin-field"><span class="admin-label">Stock</span><p class="admin-before-after" id="beforeAfter"></p></div>' +
        "</div>" +
        '<label class="admin-check"><input type="checkbox" name="isActive"' + (it.isActive ? " checked" : "") + " /><span>Tracking on (when off, this record does not limit sales)</span></label>" +
        '<div class="admin-actions"><button type="submit" class="admin-btn admin-btn--primary">Save</button>' +
          '<button type="button" class="admin-btn admin-btn--ghost" data-close>Cancel</button></div>' +
      "</form>";
    els.panel.hidden = false;
    var form = document.getElementById("adjustForm");

    function preview() {
      var mode = form.querySelector('input[name="mode"]:checked').value;
      var n = wholeNumber(form.elements.amount.value, mode === "adjust");
      var after = n === null ? null : (mode === "adjust" ? it.stockQuantity + n : n);
      var el = document.getElementById("beforeAfter");
      el.innerHTML = "Before <strong>" + it.stockQuantity + "</strong>" +
        (after === null ? "" : " → After <strong class=\"" + (after < 0 ? "admin-text-error" : "") + "\">" + after + "</strong>");
      return after;
    }
    form.addEventListener("input", preview);
    form.addEventListener("change", preview);
    preview();
    els.panel.scrollIntoView({ block: "start", behavior: "smooth" });
    form.elements.amount.focus();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var mode = form.querySelector('input[name="mode"]:checked').value;
      var amountRaw = form.elements.amount.value.trim();
      var errors = {};
      var body = {};
      if (amountRaw) {
        var n = wholeNumber(amountRaw, mode === "adjust");
        if (n === null) errors.amount = mode === "adjust" ? "Enter a whole number, e.g. 5 or -2." : "Enter a whole number of 0 or more.";
        else if (mode === "adjust" && n === 0) errors.amount = "Enter a number other than 0.";
        else if (mode === "adjust" && it.stockQuantity + n < 0) errors.amount = "Stock can't go below 0 (it is " + it.stockQuantity + ").";
        else if (Math.abs(n) > 1000000) errors.amount = "That number is too large.";
        else if (mode === "adjust") body.adjustBy = n;
        else body.stockQuantity = n;
      }
      var th = wholeNumber(form.elements.lowStockThreshold.value, false);
      if (th === null || th > 1000000) errors.lowStockThreshold = "Enter a whole number of 0 or more.";
      else if (th !== it.lowStockThreshold) body.lowStockThreshold = th;
      var active = form.elements.isActive.checked;
      if (active !== it.isActive) body.isActive = active;
      if (!A.showErrors(form, errors)) return;
      if (!Object.keys(body).length) { A.flash("There are no changes to save.", "info"); return; }
      if (body.isActive === false && !window.confirm("Turn tracking off? This record stops limiting sales (it is not deleted).")) return;

      var button = form.querySelector('[type="submit"]');
      button.disabled = true;
      var before = it.stockQuantity;
      A.request("/inventory/" + it.inventoryId, { method: "PATCH", body: body }).then(function (result) {
        button.disabled = false;
        if (result.ok && result.data && result.data.item) {
          var saved = result.data.item;
          closePanel();
          A.flash("Saved. Stock " + before + " → " + saved.stockQuantity + ", alert at " + saved.lowStockThreshold +
            (saved.isActive ? "" : ", tracking off") + ".", "success");
          return load();
        }
        A.showErrors(form, A.fieldErrors(result));
        A.flash(A.errorMessage(result, "The stock could not be saved."), "error");
      });
    });
  }

  // ---------- start tracking (existing POST /api/inventory) ----------

  function openTrack(it) {
    els.panel.hidden = false;
    els.panel.innerHTML = '<p class="admin-muted">Loading sizes…</p>';
    A.request("/admin/products/" + it.productId).then(function (result) {
      if (!result.ok) {
        els.panel.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(A.errorMessage(result, "The product could not be loaded.")) + "</p>";
        return;
      }
      var variants = result.data.variants || [];
      var product = result.data.product;
      // Sizes that already have a record (switched off) can't get a second one.
      var options = '<option value="">Whole product</option>' + variants.map(function (v) {
        var has = v.inventory ? " (record exists)" : "";
        return '<option value="' + v.id + '"' + (v.inventory ? " disabled" : "") + ">Size: " + A.escapeHtml(v.optionLabel) + has + "</option>";
      }).join("");
      els.panel.innerHTML =
        '<div class="admin-panel__head"><h2 class="admin-panel__title">Start tracking: ' + A.escapeHtml(product.name) + "</h2>" +
          '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-close>Close</button></div>' +
        '<p class="admin-flash admin-flash--info">Once tracked, customers can only buy up to the stock you enter. With 0, this product (or size) can no longer be ordered.</p>' +
        '<form id="trackForm" novalidate><div class="admin-grid">' +
          '<div class="admin-field" data-field="productVariantId"><label class="admin-label" for="s_level">Track</label>' +
            '<select class="admin-input" id="s_level" name="productVariantId">' + options + "</select>" +
            '<p class="admin-hint">A size record wins over a whole-product record.</p><p class="admin-error" role="alert" hidden></p></div>' +
          field("sku", "Stock SKU", "", "Required by the backend. Must be unique.", 'maxlength="64"') +
          field("stockQuantity", "Starting stock", "", "", 'inputmode="numeric"') +
          field("lowStockThreshold", "Alert at (low-stock level)", "5", "", 'inputmode="numeric"') +
        "</div>" +
        '<div class="admin-actions"><button type="submit" class="admin-btn admin-btn--primary">Start tracking</button>' +
          '<button type="button" class="admin-btn admin-btn--ghost" data-close>Cancel</button></div></form>';
      var form = document.getElementById("trackForm");
      var sku = form.elements.sku;
      function suggestSku() {
        // Prefill with the product's / size's own SKU when it has one.
        var vid = form.elements.productVariantId.value;
        var v = variants.filter(function (x) { return String(x.id) === vid; })[0];
        sku.value = (v ? v.sku : product.sku) || "";
      }
      form.elements.productVariantId.addEventListener("change", suggestSku);
      suggestSku();
      els.panel.scrollIntoView({ block: "start", behavior: "smooth" });

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var errors = {};
        var body = { productId: product.id };
        var vid = form.elements.productVariantId.value;
        if (vid) body.productVariantId = parseInt(vid, 10);
        var s = sku.value.trim();
        if (!s) errors.sku = "Enter a SKU for this stock record.";
        else if (s.length > 64) errors.sku = "At most 64 characters.";
        else body.sku = s;
        var q = wholeNumber(form.elements.stockQuantity.value, false);
        if (q === null || q > 1000000) errors.stockQuantity = "Enter a whole number of 0 or more.";
        else body.stockQuantity = q;
        var th = wholeNumber(form.elements.lowStockThreshold.value, false);
        if (th === null || th > 1000000) errors.lowStockThreshold = "Enter a whole number of 0 or more.";
        else body.lowStockThreshold = th;
        if (!A.showErrors(form, errors)) return;
        var button = form.querySelector('[type="submit"]');
        button.disabled = true;
        A.request("/inventory", { method: "POST", body: body }).then(function (res) {
          button.disabled = false;
          if (res.ok && res.data && res.data.item) {
            closePanel();
            A.flash("Now tracking " + res.data.item.productName + (res.data.item.sizeLabel ? " — " + res.data.item.sizeLabel : " (whole product)") +
              " with stock " + res.data.item.stockQuantity + ".", "success");
            return load();
          }
          var errs = A.fieldErrors(res);
          if (res.status === 409) errs.sku = res.data && res.data.message ? res.data.message : "This SKU, product or size already has a record.";
          A.showErrors(form, errs);
          A.flash(A.errorMessage(res, "Tracking could not be started."), "error");
        });
      });
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () { window.clearTimeout(timer); timer = window.setTimeout(function () { state.page = 1; load(); }, 300); });
  els.filter.addEventListener("change", function () { state.page = 1; load(); });
  els.prev.addEventListener("click", function () { if (state.page > 1) { state.page -= 1; load(); } });
  els.next.addEventListener("click", function () { state.page += 1; load(); });
  els.summary.addEventListener("click", function (event) {
    var b = event.target.closest("[data-filter]");
    if (!b) return;
    els.filter.value = els.filter.value === b.getAttribute("data-filter") ? "all" : b.getAttribute("data-filter");
    state.page = 1;
    load();
  });
  els.rows.addEventListener("click", function (event) {
    var adj = event.target.closest("[data-adjust]");
    var trk = event.target.closest("[data-track]");
    if (adj) openAdjust(state.items[Number(adj.getAttribute("data-adjust"))]);
    else if (trk) openTrack(state.items[Number(trk.getAttribute("data-track"))]);
  });
  els.panel.addEventListener("click", function (event) { if (event.target.closest("[data-close]")) closePanel(); });

  A.requireAdmin("inventory").then(function () {
    readUrl();
    load();
  });
})();