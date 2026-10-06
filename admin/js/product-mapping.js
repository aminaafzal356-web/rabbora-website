/*!
 * Rabbora Living — "which products offer this?" panel (window.RabboraMapping)
 * Used by admin/fabrics.html and admin/storage-options.html.
 *
 * Reads:  GET /api/admin/fabrics/:id/products | /api/admin/storage-options/:id/products
 *         GET /api/admin/categories, GET /api/admin/products?categoryId=…
 *         GET /api/admin/products/:id   (that product's current links, all of them)
 * Writes: the EXISTING per-product endpoints
 *         PUT /api/products/:id/fabrics          { fabrics: [{ fabricId, priceAdjustment }] }
 *         PUT /api/products/:id/storage-options  { storageOptions: [{ storageOptionId, priceAdjustment, isDefault }] }
 * Those endpoints replace a product's whole list, so each save first
 * reads the product's current list and only adds/removes THIS option —
 * every other link (and its price adjustment) is sent back unchanged.
 * Price adjustments are never edited here (new links get £0).
 */
(function (window, document) {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var cfg = null;
  var state = null;

  function kindText() {
    return cfg.kind === "fabric" ? "fabric" : "storage option";
  }

  function apiBase() {
    return cfg.kind === "fabric" ? "/admin/fabrics/" : "/admin/storage-options/";
  }

  function render() {
    var p = cfg.panel;
    var isStorage = cfg.kind === "storage";
    var changes = changedProducts();
    p.innerHTML =
      '<div class="admin-panel__head">' +
        '<h2 class="admin-panel__title">Products offering “' + A.escapeHtml(cfg.option.name) + '”</h2>' +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-map-close>Close</button>' +
      "</div>" +
      '<p class="admin-hint">Tick the products that offer this ' + kindText() + "." +
        (isStorage ? " “Default” is the option selected first for that product (one per product)." : "") +
        " Changes are saved per product when you press Save.</p>" +
      '<div class="admin-toolbar admin-toolbar--two admin-map-toolbar">' +
        '<div class="admin-field"><label class="admin-label" for="mapCategory">Category</label>' +
          '<select class="admin-input" id="mapCategory">' +
            '<option value="">Products already offering it (' + state.linked.length + ")</option>" +
            state.categories.map(function (c) {
              return '<option value="' + c.id + '"' + (String(c.id) === String(state.categoryId) ? " selected" : "") + ">" +
                A.escapeHtml(c.name) + " (" + c.productCount + ")</option>";
            }).join("") +
          "</select></div>" +
        '<div class="admin-field"><label class="admin-label" for="mapSearch">Filter</label>' +
          '<input class="admin-input" id="mapSearch" type="search" placeholder="Product name" value="' + A.escapeHtml(state.filter) + '" /></div>' +
      "</div>" +
      '<div class="admin-actions admin-map-bulk">' +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-map-all>Tick all shown</button>' +
        '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-map-none>Untick all shown</button>' +
      "</div>" +
      '<div class="admin-map-list" id="mapList">' + listHtml() + "</div>" +
      '<div class="admin-actions" id="mapFooter">' + footerHtml(changes) + "</div>" +
      '<p class="admin-hint" id="mapStatus" role="status" aria-live="polite">' + A.escapeHtml(state.status || "") + "</p>";
  }

  function footerHtml(changes) {
    var off = !changes.length || !!state.saving;
    return '<button type="button" class="admin-btn admin-btn--primary" data-map-save' + (off ? " disabled" : "") + ">" +
        (state.saving ? A.escapeHtml(state.saving) : "Save " + changes.length + " change" + (changes.length === 1 ? "" : "s")) + "</button>" +
      '<button type="button" class="admin-btn admin-btn--ghost" data-map-reset' + (off ? " disabled" : "") + ">Undo changes</button>";
  }

  // Updates one row and the Save button in place (keeps keyboard focus).
  function refreshRow(id) {
    var row = id === null ? null : cfg.panel.querySelector('[data-map-row="' + id + '"]');
    if (row) {
      var want = state.wanted[id];
      var orig = state.original[id];
      var changed = want.on !== !!orig || (cfg.kind === "storage" && want.def !== !!(orig && orig.isDefault));
      row.classList.toggle("is-changed", changed);
      var on = row.querySelector("[data-map-on]");
      var def = row.querySelector("[data-map-def]");
      if (on) on.checked = want.on;
      if (def) { def.checked = want.def; def.disabled = !want.on; }
      var badge = row.querySelector(".admin-badge");
      if (changed && !badge) row.insertAdjacentHTML("beforeend", '<span class="admin-badge admin-badge--warn">changed</span>');
      if (!changed && badge) badge.parentNode.removeChild(badge);
    }
    var footer = document.getElementById("mapFooter");
    if (footer) footer.innerHTML = footerHtml(changedProducts());
  }

  function shownProducts() {
    var q = state.filter.trim().toLowerCase();
    return state.products.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) !== -1; });
  }

  function listHtml() {
    if (state.loading) return '<p class="admin-muted">Loading products…</p>';
    var shown = shownProducts();
    if (!shown.length) return '<p class="admin-muted">' + (state.categoryId ? "No products." : "No products offer this " + kindText() + " yet. Choose a category to add some.") + "</p>";
    var isStorage = cfg.kind === "storage";
    return shown.map(function (p) {
      var want = state.wanted[p.id];
      var changed = want.on !== !!state.original[p.id] || (isStorage && want.def !== !!(state.original[p.id] && state.original[p.id].isDefault));
      return (
        '<div class="admin-map-row' + (changed ? " is-changed" : "") + (p.isActive === false ? " is-inactive" : "") + '" data-map-row="' + p.id + '">' +
          '<label class="admin-check admin-map-check"><input type="checkbox" data-map-on="' + p.id + '"' + (want.on ? " checked" : "") + " />" +
            "<span>" + A.escapeHtml(p.name) + (p.isActive === false ? ' <small class="admin-muted">(inactive)</small>' : "") + "</span></label>" +
          (isStorage
            ? '<label class="admin-check admin-map-default"><input type="checkbox" data-map-def="' + p.id + '"' + (want.def ? " checked" : "") + (want.on ? "" : " disabled") + " /><span>Default</span></label>"
            : "") +
          (changed ? '<span class="admin-badge admin-badge--warn">changed</span>' : "") +
        "</div>"
      );
    }).join("");
  }

  function changedProducts() {
    if (!state) return [];
    var isStorage = cfg.kind === "storage";
    return Object.keys(state.wanted).filter(function (id) {
      var want = state.wanted[id];
      var orig = state.original[id];
      if (want.on !== !!orig) return true;
      return isStorage && want.on && want.def !== !!(orig && orig.isDefault);
    }).map(Number);
  }

  function ensureWanted(products) {
    products.forEach(function (p) {
      if (!state.wanted[p.id]) {
        var orig = state.original[p.id];
        state.wanted[p.id] = { on: !!orig, def: !!(orig && orig.isDefault) };
      }
    });
  }

  function loadLinked() {
    return A.request(apiBase() + cfg.option.id + "/products").then(function (result) {
      if (!result.ok) throw result;
      state.linked = result.data.products;
      state.original = {};
      state.linked.forEach(function (l) { state.original[l.productId] = l; });
    });
  }

  function showProductsFor(categoryId) {
    state.categoryId = categoryId || "";
    if (!state.categoryId) {
      state.products = state.linked.map(function (l) { return { id: l.productId, name: l.name, isActive: true }; });
      ensureWanted(state.products);
      render();
      return Promise.resolve();
    }
    state.loading = true;
    render();
    var all = [];
    function page(n) {
      return A.request("/admin/products?categoryId=" + encodeURIComponent(state.categoryId) + "&limit=100&page=" + n).then(function (result) {
        if (!result.ok) throw result;
        all = all.concat(result.data.products);
        if (all.length < result.data.total && result.data.products.length) return page(n + 1);
      });
    }
    return page(1).then(function () {
      state.loading = false;
      state.products = all.map(function (p) { return { id: p.id, name: p.name, isActive: p.isActive }; });
      ensureWanted(state.products);
      render();
    }).catch(function (result) {
      state.loading = false;
      state.status = A.errorMessage(result, "Products could not be loaded.");
      render();
    });
  }

  // Builds the full new list for one product and sends it.
  function saveOne(productId) {
    var want = state.wanted[productId];
    return A.request("/admin/products/" + productId).then(function (result) {
      if (!result.ok) throw result;
      var body;
      if (cfg.kind === "fabric") {
        var fabrics = result.data.fabricLinks
          .filter(function (l) { return l.fabricId !== cfg.option.id; })
          .map(function (l) { return { fabricId: l.fabricId, priceAdjustment: l.priceAdjustment }; });
        var current = result.data.fabricLinks.filter(function (l) { return l.fabricId === cfg.option.id; })[0];
        if (want.on) fabrics.push({ fabricId: cfg.option.id, priceAdjustment: current ? current.priceAdjustment : 0 });
        body = { fabrics: fabrics };
      } else {
        var links = result.data.storageLinks;
        var mine = links.filter(function (l) { return l.storageOptionId === cfg.option.id; })[0];
        var options = links
          .filter(function (l) { return l.storageOptionId !== cfg.option.id; })
          .map(function (l) {
            // Only one default per product: making this one the default clears the others.
            return { storageOptionId: l.storageOptionId, priceAdjustment: l.priceAdjustment, isDefault: want.on && want.def ? false : l.isDefault };
          });
        if (want.on) options.push({ storageOptionId: cfg.option.id, priceAdjustment: mine ? mine.priceAdjustment : 0, isDefault: !!want.def });
        body = { storageOptions: options };
      }
      var path = "/products/" + productId + (cfg.kind === "fabric" ? "/fabrics" : "/storage-options");
      return A.request(path, { method: "PUT", body: body }).then(function (put) {
        if (!put.ok) throw put;
      });
    });
  }

  function saveAll() {
    var ids = changedProducts();
    if (!ids.length) return;
    var done = 0;
    var chain = Promise.resolve();
    ids.forEach(function (id) {
      chain = chain.then(function () {
        state.saving = "Saving " + (done + 1) + " of " + ids.length + "…";
        refreshRow(null);
        return saveOne(id).then(function () { done += 1; });
      });
    });
    chain.then(function () {
      state.saving = null;
      state.status = "Saved " + done + " product" + (done === 1 ? "" : "s") + ".";
      return refreshAfterSave();
    }).catch(function (result) {
      state.saving = null;
      state.status = "Stopped after " + done + " of " + ids.length + ": " + A.errorMessage(result, "a product could not be saved.");
      return refreshAfterSave();
    });
  }

  function refreshAfterSave() {
    return loadLinked().then(function () {
      state.wanted = {};
      return showProductsFor(state.categoryId);
    }).then(function () {
      if (cfg.onSaved) cfg.onSaved();
      A.flash(state.status, /Stopped/.test(state.status) ? "error" : "success");
    }).catch(function (result) {
      A.flash(A.errorMessage(result, "Could not reload the product list."), "error");
    });
  }

  function onClick(event) {
    var t = event.target;
    if (t.closest("[data-map-close]")) { close(); return; }
    if (t.closest("[data-map-save]")) { saveAll(); return; }
    if (t.closest("[data-map-reset]")) { state.wanted = {}; ensureWanted(state.products); state.status = ""; render(); return; }
    var all = t.closest("[data-map-all]");
    var none = t.closest("[data-map-none]");
    if (all || none) {
      shownProducts().forEach(function (p) {
        state.wanted[p.id].on = !!all;
        if (!all) state.wanted[p.id].def = false;
        refreshRow(p.id);
      });
    }
  }

  function onChange(event) {
    var t = event.target;
    if (t.id === "mapCategory") { showProductsFor(t.value); return; }
    if (t.hasAttribute("data-map-on")) {
      var id = Number(t.getAttribute("data-map-on"));
      state.wanted[id].on = t.checked;
      if (!t.checked) state.wanted[id].def = false;
      refreshRow(id);
    } else if (t.hasAttribute("data-map-def")) {
      var did = Number(t.getAttribute("data-map-def"));
      state.wanted[did].def = t.checked;
      refreshRow(did);
    }
  }

  function onInput(event) {
    if (event.target.id === "mapSearch") {
      state.filter = event.target.value;
      var pos = event.target.selectionStart;
      document.getElementById("mapList").innerHTML = listHtml();
      event.target.setSelectionRange(pos, pos);
    }
  }

  function close() {
    if (state && changedProducts().length && !window.confirm("Close without saving your changes?")) return;
    cfg.panel.hidden = true;
    cfg.panel.innerHTML = "";
    state = null;
  }

  function open(options) {
    if (cfg && cfg.panel) {
      cfg.panel.removeEventListener("click", onClick);
      cfg.panel.removeEventListener("change", onChange);
      cfg.panel.removeEventListener("input", onInput);
    }
    cfg = options;
    state = { categories: [], linked: [], original: {}, wanted: {}, products: [], categoryId: "", filter: "", loading: true, saving: null, status: "" };
    cfg.panel.hidden = false;
    cfg.panel.innerHTML = '<p class="admin-muted">Loading…</p>';
    cfg.panel.addEventListener("click", onClick);
    cfg.panel.addEventListener("change", onChange);
    cfg.panel.addEventListener("input", onInput);
    cfg.panel.scrollIntoView({ block: "start", behavior: "smooth" });

    Promise.all([
      A.request("/admin/categories").then(function (r) {
        if (!r.ok) throw r;
        state.categories = r.data.categories;
      }),
      loadLinked()
    ]).then(function () {
      state.loading = false;
      return showProductsFor("");
    }).catch(function (result) {
      cfg.panel.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(A.errorMessage(result, "Could not load the products.")) + "</p>";
    });
  }

  window.RabboraMapping = { open: open, close: close };
})(window, document);