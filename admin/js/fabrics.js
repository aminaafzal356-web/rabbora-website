/*!
 * Rabbora Living — admin fabrics (admin/fabrics.html)
 *   GET   /api/admin/fabrics       every fabric (also inactive) + how many products offer it
 *   POST  /api/fabrics             add       (existing admin endpoint)
 *   PATCH /api/fabrics/:id         edit / activate / deactivate (existing)
 *   Products offering a fabric: product-mapping.js (existing per-product PUT)
 * Fabrics are never deleted.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  var els = {
    search: document.getElementById("listSearch"),
    collection: document.getElementById("listCollection"),
    status: document.getElementById("listStatus"),
    add: document.getElementById("addBtn"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    panel: document.getElementById("editorPanel"),
    title: document.getElementById("editorTitle"),
    form: document.getElementById("editorForm"),
    save: document.getElementById("editorSave"),
    preview: document.getElementById("imagePreview"),
    datalist: document.getElementById("collectionList"),
    mapping: document.getElementById("mappingPanel")
  };
  var f = els.form.elements;
  var state = { all: [], editing: null, slugTouched: false };

  // ---------- list (filtered here: 95 rows load at once) ----------

  function filtered() {
    var q = els.search.value.trim().toLowerCase();
    var col = els.collection.value;
    var st = els.status.value;
    return state.all.filter(function (x) {
      if (col && (x.collection || "") !== col) return false;
      if (st === "active" && !x.isActive) return false;
      if (st === "inactive" && x.isActive) return false;
      if (!q) return true;
      return (x.name + " " + x.slug + " " + (x.collection || "")).toLowerCase().indexOf(q) !== -1;
    });
  }

  function rowHtml(x) {
    var img = A.imageUrl(x.imageUrl);
    return (
      '<tr data-id="' + x.id + '"' + (x.isActive ? "" : ' class="is-inactive"') + ">" +
        '<td data-label="Fabric"><div class="admin-product-cell">' +
          (img ? '<img src="' + A.escapeHtml(img) + '" alt="" width="52" height="52" loading="lazy" />' : '<span class="admin-thumb-empty"></span>') +
          '<div><strong>' + A.escapeHtml(x.name) + '</strong><span class="admin-product-cell__slug">' + A.escapeHtml(x.slug) + "</span></div>" +
        "</div></td>" +
        '<td data-label="Collection">' + (x.collection ? A.escapeHtml(x.collection) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Products">' + x.productCount + "</td>" +
        '<td data-label="Status"><span class="admin-badge ' + (x.isActive ? "admin-badge--ok" : "admin-badge--off") + '">' + (x.isActive ? "Active" : "Inactive") + "</span></td>" +
        '<td class="admin-row-actions">' +
          '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-edit="' + x.id + '">Edit</button>' +
          '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-map="' + x.id + '">Products</button>' +
          '<button type="button" class="admin-btn admin-btn--sm ' + (x.isActive ? "admin-btn--danger-ghost" : "admin-btn--ghost") + '" data-toggle="' + x.id + '">' + (x.isActive ? "Deactivate" : "Activate") + "</button>" +
        "</td>" +
      "</tr>"
    );
  }

  function render() {
    var list = filtered();
    els.rows.innerHTML = list.length ? list.map(rowHtml).join("") : '<tr><td colspan="5" class="admin-empty">No fabrics match.</td></tr>';
    els.count.textContent = "Showing " + list.length + " of " + state.all.length + " fabrics";
  }

  function fillCollections() {
    var names = [];
    state.all.forEach(function (x) { if (x.collection && names.indexOf(x.collection) === -1) names.push(x.collection); });
    names.sort();
    var current = els.collection.value;
    els.collection.innerHTML = '<option value="">All collections</option>' + names.map(function (n) {
      return '<option value="' + A.escapeHtml(n) + '">' + A.escapeHtml(n) + "</option>";
    }).join("");
    if (names.indexOf(current) !== -1) els.collection.value = current;
    els.datalist.innerHTML = names.map(function (n) { return '<option value="' + A.escapeHtml(n) + '"></option>'; }).join("");
  }

  function load() {
    return A.request("/admin/fabrics").then(function (result) {
      if (result.ok && result.data && Array.isArray(result.data.fabrics)) {
        state.all = result.data.fabrics;
        fillCollections();
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="5" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Fabrics could not be loaded.")) + "</td></tr>";
    });
  }

  function find(id) {
    return state.all.filter(function (x) { return String(x.id) === String(id); })[0] || null;
  }

  // ---------- editor ----------

  function setPreview() {
    var url = A.imageUrl(f.imageUrl.value.trim());
    els.preview.innerHTML = url ? '<img src="' + A.escapeHtml(url) + '" alt="" />' : "<span>No image</span>";
  }

  function openEditor(x) {
    state.editing = x || null;
    state.slugTouched = !!x;
    els.title.textContent = x ? "Edit fabric: " + x.name : "Add a fabric";
    f.name.value = x ? x.name : "";
    f.slug.value = x ? x.slug : "";
    f.collection.value = x && x.collection ? x.collection : (els.collection.value || "");
    f.imageUrl.value = x && x.imageUrl ? x.imageUrl : "";
    f.sortOrder.value = x ? String(x.sortOrder) : "0";
    f.isActive.checked = x ? x.isActive : true;
    els.save.textContent = x ? "Save changes" : "Add fabric";
    setPreview();
    A.showErrors(els.form, {});
    els.panel.hidden = false;
    els.panel.scrollIntoView({ block: "start", behavior: "smooth" });
    f.name.focus();
  }

  function closeEditor() {
    els.panel.hidden = true;
    state.editing = null;
  }

  function readForm() {
    return {
      name: f.name.value.trim(),
      slug: f.slug.value.trim().toLowerCase(),
      collection: f.collection.value.trim() || null,
      imageUrl: f.imageUrl.value.trim() || null,
      sortOrder: f.sortOrder.value.trim(),
      isActive: f.isActive.checked
    };
  }

  function validate(d) {
    var e = {};
    if (!d.name) e.name = "Enter the fabric name.";
    else if (d.name.length > 100) e.name = "The name can be at most 100 characters.";
    if (!d.slug) e.slug = "Enter a slug.";
    else if (!SLUG_PATTERN.test(d.slug) || d.slug.length > 100) e.slug = "Use lowercase letters, numbers and single hyphens only.";
    if (d.collection && d.collection.length > 100) e.collection = "At most 100 characters.";
    if (d.imageUrl && d.imageUrl.length > 1000) e.imageUrl = "The image path is too long.";
    if (!/^\d+$/.test(d.sortOrder) || Number(d.sortOrder) > 100000) e.sortOrder = "Enter a whole number from 0 to 100000.";
    // Same name in the same collection = a duplicate.
    var dupe = state.all.filter(function (x) {
      return (!state.editing || x.id !== state.editing.id) &&
        x.name.toLowerCase() === d.name.toLowerCase() && (x.collection || "") === (d.collection || "");
    })[0];
    if (d.name && dupe) e.name = "“" + dupe.name + "” already exists in this collection.";
    return e;
  }

  function save(event) {
    event.preventDefault();
    var d = readForm();
    if (!A.showErrors(els.form, validate(d))) return;
    var x = state.editing;
    var body;
    if (x) {
      body = {};
      ["name", "slug", "collection", "imageUrl"].forEach(function (k) { if (d[k] !== (x[k] || null)) body[k] = d[k]; });
      if (Number(d.sortOrder) !== x.sortOrder) body.sortOrder = Number(d.sortOrder);
      if (d.isActive !== x.isActive) body.isActive = d.isActive;
      if (!Object.keys(body).length) { A.flash("There are no changes to save.", "info"); return; }
    } else {
      body = { name: d.name, slug: d.slug, sortOrder: Number(d.sortOrder), isActive: d.isActive };
      if (d.collection) body.collection = d.collection;
      if (d.imageUrl) body.imageUrl = d.imageUrl;
    }
    els.save.disabled = true;
    var call = x
      ? A.request("/fabrics/" + x.id, { method: "PATCH", body: body })
      : A.request("/fabrics", { method: "POST", body: body });
    call.then(function (result) {
      els.save.disabled = false;
      if (result.ok && result.data && result.data.fabric) {
        closeEditor();
        A.flash((x ? "Saved “" : "Added “") + result.data.fabric.name + "”.", "success");
        return load();
      }
      var errors = A.fieldErrors(result);
      if (result.status === 409) errors.slug = "A fabric with this slug already exists.";
      A.showErrors(els.form, errors);
      A.flash(result.status === 409 ? "A fabric with this slug already exists." : A.errorMessage(result, "The fabric could not be saved."), "error");
    });
  }

  function toggle(x, button) {
    var next = !x.isActive;
    if (!next && !window.confirm("Deactivate “" + x.name + "”? It stays in the list and can be activated again.")) return;
    button.disabled = true;
    A.request("/fabrics/" + x.id, { method: "PATCH", body: { isActive: next } }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.fabric) {
        A.flash("“" + result.data.fabric.name + "” " + (result.data.fabric.isActive ? "activated." : "deactivated."), "success");
        return load();
      }
      A.flash(A.errorMessage(result, "The change could not be saved."), "error");
    });
  }

  // ---------- events ----------

  var timer = null;
  els.search.addEventListener("input", function () { window.clearTimeout(timer); timer = window.setTimeout(render, 150); });
  els.collection.addEventListener("change", render);
  els.status.addEventListener("change", render);
  els.add.addEventListener("click", function () { openEditor(null); });
  els.form.addEventListener("submit", save);
  els.panel.addEventListener("click", function (event) { if (event.target.closest("[data-editor-close]")) closeEditor(); });
  f.name.addEventListener("input", function () { if (!state.editing && !state.slugTouched) f.slug.value = A.slugify(f.name.value, 100); });
  f.slug.addEventListener("input", function () { state.slugTouched = true; });
  f.imageUrl.addEventListener("change", setPreview);
  els.rows.addEventListener("click", function (event) {
    var edit = event.target.closest("[data-edit]");
    var map = event.target.closest("[data-map]");
    var tog = event.target.closest("[data-toggle]");
    if (edit) openEditor(find(edit.getAttribute("data-edit")));
    else if (tog) toggle(find(tog.getAttribute("data-toggle")), tog);
    else if (map && window.RabboraMapping) {
      var x = find(map.getAttribute("data-map"));
      window.RabboraMapping.open({ kind: "fabric", option: { id: x.id, name: x.name }, panel: els.mapping, onSaved: load });
    }
  });

  A.requireAdmin("fabrics").then(load);
})();