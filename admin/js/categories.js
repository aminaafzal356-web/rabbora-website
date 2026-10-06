/*!
 * Rabbora Living — admin categories (admin/categories.html)
 *   GET   /api/admin/categories      every category (also inactive) + product counts
 *   POST  /api/categories            add      (existing admin endpoint)
 *   PATCH /api/categories/:id        edit / activate / deactivate / sort order (existing)
 * Categories are never deleted. Deactivating one hides it in the shop;
 * its products and their category link stay exactly as they are.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  var els = {
    search: document.getElementById("listSearch"),
    add: document.getElementById("addBtn"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    panel: document.getElementById("editorPanel"),
    title: document.getElementById("editorTitle"),
    form: document.getElementById("editorForm"),
    save: document.getElementById("editorSave")
  };
  var f = els.form.elements;
  var state = { list: [], editing: null, slugTouched: false, requestId: 0 };

  // ---------- list ----------

  function rowHtml(c) {
    return (
      '<tr data-id="' + c.id + '"' + (c.isActive ? "" : ' class="is-inactive"') + ">" +
        '<td data-label="Category"><strong>' + A.escapeHtml(c.name) + '</strong><span class="admin-product-cell__slug">' + A.escapeHtml(c.slug) + "</span>" +
          (c.description ? '<span class="admin-cell-note">' + A.escapeHtml(c.description.length > 90 ? c.description.slice(0, 90) + "…" : c.description) + "</span>" : "") +
        "</td>" +
        '<td data-label="Products"><a href="products.html?categoryId=' + c.id + '">' + c.productCount + "</a>" +
          '<span class="admin-cell-note">' + c.activeProductCount + " active</span></td>" +
        '<td data-label="Sort order"><div class="admin-sort">' +
          '<button type="button" class="admin-icon-btn" data-sort="-1" data-id="' + c.id + '" aria-label="Move ' + A.escapeHtml(c.name) + ' up">↑</button>' +
          '<span class="admin-mono">' + c.sortOrder + "</span>" +
          '<button type="button" class="admin-icon-btn" data-sort="1" data-id="' + c.id + '" aria-label="Move ' + A.escapeHtml(c.name) + ' down">↓</button>' +
        "</div></td>" +
        '<td data-label="Status"><span class="admin-badge ' + (c.isActive ? "admin-badge--ok" : "admin-badge--off") + '">' + (c.isActive ? "Active" : "Inactive") + "</span></td>" +
        '<td class="admin-row-actions">' +
          '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-edit="' + c.id + '">Edit</button>' +
          '<button type="button" class="admin-btn admin-btn--sm ' + (c.isActive ? "admin-btn--danger-ghost" : "admin-btn--ghost") + '" data-toggle="' + c.id + '">' + (c.isActive ? "Deactivate" : "Activate") + "</button>" +
        "</td>" +
      "</tr>"
    );
  }

  function render() {
    els.rows.innerHTML = state.list.length
      ? state.list.map(rowHtml).join("")
      : '<tr><td colspan="5" class="admin-empty">No categories match.</td></tr>';
    els.count.textContent = state.list.length + " categor" + (state.list.length === 1 ? "y" : "ies");
  }

  function load() {
    state.requestId += 1;
    var id = state.requestId;
    var q = els.search.value.trim();
    return A.request("/admin/categories" + (q ? "?search=" + encodeURIComponent(q) : "")).then(function (result) {
      if (id !== state.requestId) return;
      if (result.ok && result.data && Array.isArray(result.data.categories)) {
        state.list = result.data.categories;
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="5" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Categories could not be loaded.")) + "</td></tr>";
    });
  }

  function find(id) {
    return state.list.filter(function (c) { return String(c.id) === String(id); })[0] || null;
  }

  // ---------- editor ----------

  function openEditor(category) {
    state.editing = category || null;
    state.slugTouched = !!category;
    els.title.textContent = category ? "Edit category: " + category.name : "Add a category";
    f.name.value = category ? category.name : "";
    f.slug.value = category ? category.slug : "";
    f.description.value = category && category.description ? category.description : "";
    f.sortOrder.value = category ? String(category.sortOrder) : String(nextSortOrder());
    f.isActive.checked = category ? category.isActive : true;
    els.save.textContent = category ? "Save changes" : "Add category";
    A.showErrors(els.form, {});
    els.panel.hidden = false;
    els.panel.scrollIntoView({ block: "start", behavior: "smooth" });
    f.name.focus();
  }

  function closeEditor() {
    els.panel.hidden = true;
    state.editing = null;
  }

  function nextSortOrder() {
    return state.list.reduce(function (max, c) { return Math.max(max, c.sortOrder); }, 0) + 1;
  }

  function readForm() {
    return {
      name: f.name.value.trim(),
      slug: f.slug.value.trim().toLowerCase(),
      description: f.description.value.trim() || null,
      sortOrder: f.sortOrder.value.trim(),
      isActive: f.isActive.checked
    };
  }

  function validate(d) {
    var e = {};
    if (!d.name) e.name = "Enter the category name.";
    else if (d.name.length > 100) e.name = "The name can be at most 100 characters.";
    if (!d.slug) e.slug = "Enter a slug.";
    else if (!SLUG_PATTERN.test(d.slug) || d.slug.length > 100) e.slug = "Use lowercase letters, numbers and single hyphens only.";
    if (d.description && d.description.length > 5000) e.description = "The description can be at most 5,000 characters.";
    if (!/^\d+$/.test(d.sortOrder) || Number(d.sortOrder) > 100000) e.sortOrder = "Enter a whole number from 0 to 100000.";
    return e;
  }

  function save(event) {
    event.preventDefault();
    var d = readForm();
    if (!A.showErrors(els.form, validate(d))) return;
    var body;
    var c = state.editing;
    if (c) {
      body = {};
      if (d.name !== c.name) body.name = d.name;
      if (d.slug !== c.slug) body.slug = d.slug;
      if (d.description !== (c.description || null)) body.description = d.description;
      if (Number(d.sortOrder) !== c.sortOrder) body.sortOrder = Number(d.sortOrder);
      if (d.isActive !== c.isActive) body.isActive = d.isActive;
      if (!Object.keys(body).length) { A.flash("There are no changes to save.", "info"); return; }
      if (body.slug && !window.confirm("Change the slug from “" + c.slug + "” to “" + body.slug + "”? Shop links that use it will change.")) return;
      if (body.isActive === false && !window.confirm(deactivateMessage(c))) return;
    } else {
      body = { name: d.name, slug: d.slug, sortOrder: Number(d.sortOrder), isActive: d.isActive };
      if (d.description) body.description = d.description;
    }
    els.save.disabled = true;
    var call = c
      ? A.request("/categories/" + c.id, { method: "PATCH", body: body })
      : A.request("/categories", { method: "POST", body: body });
    call.then(function (result) {
      els.save.disabled = false;
      if (result.ok && result.data && result.data.category) {
        closeEditor();
        A.flash((c ? "Saved “" : "Added “") + result.data.category.name + "”.", "success");
        return load();
      }
      var errors = A.fieldErrors(result);
      if (result.status === 409) errors.slug = "A category with this slug already exists.";
      A.showErrors(els.form, errors);
      A.flash(result.status === 409 ? "A category with this slug already exists." : A.errorMessage(result, "The category could not be saved."), "error");
    });
  }

  function deactivateMessage(c) {
    return "Deactivate “" + c.name + "”? It will be hidden in the shop. Its " + c.productCount +
      " product(s) are NOT deleted and keep their category.";
  }

  // ---------- quick actions ----------

  function patch(c, body, button, doneMessage) {
    if (button) button.disabled = true;
    return A.request("/categories/" + c.id, { method: "PATCH", body: body }).then(function (result) {
      if (button) button.disabled = false;
      if (result.ok && result.data && result.data.category) {
        if (doneMessage) A.flash(doneMessage(result.data.category), "success");
        return true;
      }
      A.flash(A.errorMessage(result, "The change could not be saved."), "error");
      return false;
    });
  }

  function toggle(c, button) {
    var next = !c.isActive;
    if (!next && !window.confirm(deactivateMessage(c))) return;
    patch(c, { isActive: next }, button, function (saved) {
      return "“" + saved.name + "” " + (saved.isActive ? "activated." : "deactivated.");
    }).then(function (ok) { if (ok) load(); });
  }

  // Moves a category one place up/down. The new order is saved as
  // sort order 1, 2, 3 … through PATCH (only rows whose number changes),
  // so categories that all had the same number get a clear order.
  function move(c, dir, button) {
    if (els.search.value.trim()) {
      A.flash("Clear the search to change the order.", "info");
      return;
    }
    var sorted = state.list.slice().sort(function (a, b) { return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name) || a.id - b.id; });
    var i = sorted.indexOf(c);
    var j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    sorted[i] = sorted[j];
    sorted[j] = c;
    var changes = [];
    sorted.forEach(function (cat, index) {
      if (cat.sortOrder !== index + 1) changes.push({ cat: cat, sortOrder: index + 1 });
    });
    button.disabled = true;
    var chain = Promise.resolve(true);
    changes.forEach(function (ch) {
      chain = chain.then(function (ok) {
        if (!ok) return false;
        return patch(ch.cat, { sortOrder: ch.sortOrder }, null);
      });
    });
    chain.then(function (ok) {
      button.disabled = false;
      if (ok) A.flash("Order changed.", "success");
      return load();
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(load, 300);
  });
  els.add.addEventListener("click", function () { openEditor(null); });
  els.form.addEventListener("submit", save);
  els.panel.addEventListener("click", function (event) {
    if (event.target.closest("[data-editor-close]")) closeEditor();
  });
  f.name.addEventListener("input", function () {
    if (!state.editing && !state.slugTouched) f.slug.value = A.slugify(f.name.value, 100);
  });
  f.slug.addEventListener("input", function () { state.slugTouched = true; });
  els.rows.addEventListener("click", function (event) {
    var edit = event.target.closest("[data-edit]");
    var tog = event.target.closest("[data-toggle]");
    var sort = event.target.closest("[data-sort]");
    if (edit) openEditor(find(edit.getAttribute("data-edit")));
    else if (tog) toggle(find(tog.getAttribute("data-toggle")), tog);
    else if (sort) move(find(sort.getAttribute("data-id")), Number(sort.getAttribute("data-sort")), sort);
  });

  A.requireAdmin("categories").then(load);
})();