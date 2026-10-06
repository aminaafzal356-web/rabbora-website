/*!
 * Rabbora Living — admin product list (admin/products.html)
 *   GET   /api/admin/products   list incl. inactive (search, category, status, flags, pages)
 *   GET   /api/categories       categories for the filter
 *   PATCH /api/products/:id     { isActive } / { isFeatured } / { isBestSeller }  (existing admin endpoint)
 * The filters are kept in the address bar, so a refresh keeps them.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var PAGE_SIZE = 20;

  var els = {
    form: document.getElementById("productFilters"),
    search: document.getElementById("filterSearch"),
    category: document.getElementById("filterCategory"),
    status: document.getElementById("filterStatus"),
    flag: document.getElementById("filterFlag"),
    rows: document.getElementById("productRows"),
    count: document.getElementById("productCount"),
    pager: document.getElementById("productPager"),
    prev: document.getElementById("pagerPrev"),
    next: document.getElementById("pagerNext"),
    pagerInfo: document.getElementById("pagerInfo")
  };

  var state = { page: 1, total: 0, products: [], requestId: 0 };

  // ---------- filters <-> address bar ----------

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    els.search.value = params.get("search") || "";
    els.status.value = ["active", "inactive"].indexOf(params.get("status")) !== -1 ? params.get("status") : "all";
    els.flag.value = ["featured", "bestSeller"].indexOf(params.get("flag")) !== -1 ? params.get("flag") : "";
    state.page = Math.max(1, parseInt(params.get("page"), 10) || 1);
    return params.get("categoryId") || "";
  }

  function writeUrl() {
    var params = new URLSearchParams();
    if (els.search.value.trim()) params.set("search", els.search.value.trim());
    if (els.category.value) params.set("categoryId", els.category.value);
    if (els.status.value !== "all") params.set("status", els.status.value);
    if (els.flag.value) params.set("flag", els.flag.value);
    if (state.page > 1) params.set("page", String(state.page));
    var qs = params.toString();
    window.history.replaceState(null, "", "products.html" + (qs ? "?" + qs : ""));
  }

  function apiQuery() {
    var params = new URLSearchParams();
    params.set("page", String(state.page));
    params.set("limit", String(PAGE_SIZE));
    if (els.search.value.trim()) params.set("search", els.search.value.trim());
    if (els.category.value) params.set("categoryId", els.category.value);
    if (els.status.value !== "all") params.set("status", els.status.value);
    if (els.flag.value === "featured") params.set("featured", "true");
    if (els.flag.value === "bestSeller") params.set("bestSeller", "true");
    return "/admin/products?" + params.toString();
  }

  // ---------- rendering ----------

  function priceHtml(p) {
    var pr = p.pricing || {};
    var sale = pr.salePrice !== undefined && pr.salePrice !== null ? pr.salePrice : p.price;
    return (
      '<span class="admin-price">' + (p.variantCount > 1 ? '<small>from</small> ' : "") + A.money(sale) + "</span>" +
      (pr.originalPrice ? '<span class="admin-price-old">' + A.money(pr.originalPrice) + "</span>" : "")
    );
  }

  function toggleHtml(p, field, on, label) {
    return (
      '<button type="button" class="admin-toggle' + (on ? " is-on" : "") + '" role="switch" aria-checked="' + on + '"' +
        ' data-toggle="' + field + '" data-id="' + p.id + '" aria-label="' + A.escapeHtml(label + ": " + p.name) + '">' +
        '<span class="admin-toggle__knob"></span>' +
      "</button>"
    );
  }

  function rowHtml(p) {
    var img = A.imageUrl(p.mainImage);
    return (
      '<tr data-product-id="' + p.id + '"' + (p.isActive ? "" : ' class="is-inactive"') + ">" +
        '<td data-label="Product"><div class="admin-product-cell">' +
          (img ? '<img src="' + A.escapeHtml(img) + '" alt="" width="52" height="52" loading="lazy" />' : '<span class="admin-thumb-empty"></span>') +
          '<div><a class="admin-product-cell__name" href="product.html?id=' + p.id + '">' + A.escapeHtml(p.name) + "</a>" +
          '<span class="admin-product-cell__slug">' + A.escapeHtml(p.slug) + "</span></div>" +
        "</div></td>" +
        '<td data-label="SKU" class="admin-mono">' + (p.sku ? A.escapeHtml(p.sku) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Category">' + (p.category ? A.escapeHtml(p.category.name) : '<span class="admin-muted">None</span>') + "</td>" +
        '<td data-label="Price">' + priceHtml(p) + "</td>" +
        '<td data-label="Status"><span class="admin-badge ' + (p.isActive ? "admin-badge--ok" : "admin-badge--off") + '">' + (p.isActive ? "Active" : "Inactive") + "</span></td>" +
        '<td data-label="Featured">' + toggleHtml(p, "isFeatured", p.featured, "Featured") + "</td>" +
        '<td data-label="Best seller">' + toggleHtml(p, "isBestSeller", p.bestSeller, "Best seller") + "</td>" +
        '<td class="admin-row-actions">' +
          '<a class="admin-btn admin-btn--ghost admin-btn--sm" href="product.html?id=' + p.id + '">Edit</a>' +
          '<button type="button" class="admin-btn admin-btn--sm ' + (p.isActive ? "admin-btn--danger-ghost" : "admin-btn--ghost") + '" data-toggle="isActive" data-id="' + p.id + '">' +
            (p.isActive ? "Deactivate" : "Activate") +
          "</button>" +
        "</td>" +
      "</tr>"
    );
  }

  function render() {
    if (!state.products.length) {
      els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">No products match these filters.</td></tr>';
    } else {
      els.rows.innerHTML = state.products.map(rowHtml).join("");
    }
    var from = state.total ? (state.page - 1) * PAGE_SIZE + 1 : 0;
    var to = Math.min(state.page * PAGE_SIZE, state.total);
    els.count.textContent = state.total
      ? "Showing " + from + "–" + to + " of " + state.total + " product" + (state.total === 1 ? "" : "s")
      : "0 products";
    var pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
    els.pager.hidden = pages <= 1;
    els.pagerInfo.textContent = "Page " + state.page + " of " + pages;
    els.prev.disabled = state.page <= 1;
    els.next.disabled = state.page >= pages;
  }

  function load() {
    state.requestId += 1;
    var requestId = state.requestId;
    writeUrl();
    els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">Loading products…</td></tr>';
    A.request(apiQuery()).then(function (result) {
      if (requestId !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.products)) {
        state.products = result.data.products;
        state.total = result.data.total;
        var pages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
        if (state.page > pages && state.total) {
          state.page = pages;
          return load();
        }
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="8" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Products could not be loaded.")) + "</td></tr>";
      els.count.textContent = "";
    });
  }

  function loadCategories(selected) {
    return A.request("/categories").then(function (result) {
      var list = result.ok && result.data && Array.isArray(result.data.categories) ? result.data.categories : [];
      els.category.innerHTML = '<option value="">All categories</option>' + list.map(function (c) {
        return '<option value="' + c.id + '">' + A.escapeHtml(c.name) + "</option>";
      }).join("");
      if (selected && list.some(function (c) { return String(c.id) === String(selected); })) els.category.value = selected;
      if (!result.ok) A.flash(A.errorMessage(result, "Categories could not be loaded."), "error");
    });
  }

  // ---------- quick changes (existing PATCH /api/products/:id) ----------

  function findProduct(id) {
    return state.products.filter(function (p) { return String(p.id) === String(id); })[0] || null;
  }

  function quickUpdate(button) {
    var id = button.getAttribute("data-id");
    var field = button.getAttribute("data-toggle");
    var product = findProduct(id);
    if (!product) return;
    var current = field === "isActive" ? product.isActive : field === "isFeatured" ? product.featured : product.bestSeller;
    var next = !current;
    if (field === "isActive" && !next &&
        !window.confirm("Deactivate “" + product.name + "”? It will be hidden from the shop and can't be bought until you activate it again. Existing orders are not affected.")) {
      return;
    }
    var body = {};
    body[field] = next;
    button.disabled = true;
    A.request("/products/" + encodeURIComponent(id), { method: "PATCH", body: body }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.product) {
        var saved = result.data.product; // what the backend now has
        product.isActive = saved.isActive;
        product.featured = saved.featured;
        product.bestSeller = saved.bestSeller;
        render();
        var labels = { isActive: saved.isActive ? "activated" : "deactivated", isFeatured: saved.featured ? "marked as featured" : "no longer featured", isBestSeller: saved.bestSeller ? "marked as a best seller" : "no longer a best seller" };
        A.flash("“" + saved.name + "” " + labels[field] + ".", "success");
        return;
      }
      A.flash(A.errorMessage(result, "The change could not be saved."), "error");
    });
  }

  // ---------- events ----------

  var searchTimer = null;
  els.search.addEventListener("input", function () {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () { state.page = 1; load(); }, 300);
  });
  [els.category, els.status, els.flag].forEach(function (el) {
    el.addEventListener("change", function () { state.page = 1; load(); });
  });
  els.form.addEventListener("submit", function (event) {
    event.preventDefault();
    state.page = 1;
    load();
  });
  els.prev.addEventListener("click", function () { if (state.page > 1) { state.page -= 1; load(); } });
  els.next.addEventListener("click", function () { state.page += 1; load(); });
  els.rows.addEventListener("click", function (event) {
    var button = event.target.closest("[data-toggle]");
    if (button) quickUpdate(button);
  });

  A.requireAdmin("products").then(function () {
    var categoryId = readUrl();
    loadCategories(categoryId).then(load);
  });
})();