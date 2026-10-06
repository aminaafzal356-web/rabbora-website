/*!
 * Rabbora Living — admin storage options (admin/storage-options.html)
 *   GET   /api/admin/storage-options   every option (also inactive) + product / default counts
 *   POST  /api/storage-options         add       (existing admin endpoint)
 *   PATCH /api/storage-options/:id     edit / activate / deactivate (existing)
 *   Products offering an option + default: product-mapping.js (existing per-product PUT)
 * Options are never deleted; the wording only changes when an admin edits it.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  var els = {
    add: document.getElementById("addBtn"),
    rows: document.getElementById("listRows"),
    count: document.getElementById("listCount"),
    panel: document.getElementById("editorPanel"),
    title: document.getElementById("editorTitle"),
    form: document.getElementById("editorForm"),
    save: document.getElementById("editorSave"),
    mapping: document.getElementById("mappingPanel")
  };
  var f = els.form.elements;
  var state = { all: [], editing: null, codeTouched: false };

  function rowHtml(x) {
    return (
      '<tr data-id="' + x.id + '"' + (x.isActive ? "" : ' class="is-inactive"') + ">" +
        '<td data-label="Option"><strong>' + A.escapeHtml(x.name) + "</strong>" +
          (x.description ? '<span class="admin-cell-note">' + A.escapeHtml(x.description) + "</span>" : "") + "</td>" +
        '<td data-label="Code" class="admin-mono">' + A.escapeHtml(x.code) + "</td>" +
        '<td data-label="Products">' + x.productCount + (x.defaultCount ? '<span class="admin-cell-note">default for ' + x.defaultCount + "</span>" : "") + "</td>" +
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
    els.rows.innerHTML = state.all.length ? state.all.map(rowHtml).join("") : '<tr><td colspan="5" class="admin-empty">No storage options yet.</td></tr>';
    els.count.textContent = state.all.length + " storage option" + (state.all.length === 1 ? "" : "s");
  }

  function load() {
    return A.request("/admin/storage-options").then(function (result) {
      if (result.ok && result.data && Array.isArray(result.data.storageOptions)) {
        state.all = result.data.storageOptions;
        render();
        return;
      }
      els.rows.innerHTML = '<tr><td colspan="5" class="admin-empty">' + A.escapeHtml(A.errorMessage(result, "Storage options could not be loaded.")) + "</td></tr>";
    });
  }

  function find(id) {
    return state.all.filter(function (x) { return String(x.id) === String(id); })[0] || null;
  }

  function openEditor(x) {
    state.editing = x || null;
    state.codeTouched = !!x;
    els.title.textContent = x ? "Edit storage option" : "Add a storage option";
    f.name.value = x ? x.name : "";
    f.code.value = x ? x.code : "";
    f.description.value = x && x.description ? x.description : "";
    f.sortOrder.value = x ? String(x.sortOrder) : String(state.all.reduce(function (m, s) { return Math.max(m, s.sortOrder); }, 0) + 1);
    f.isActive.checked = x ? x.isActive : true;
    els.save.textContent = x ? "Save changes" : "Add storage option";
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
      code: f.code.value.trim().toLowerCase(),
      description: f.description.value.trim() || null,
      sortOrder: f.sortOrder.value.trim(),
      isActive: f.isActive.checked
    };
  }

  function validate(d) {
    var e = {};
    if (!d.name) e.name = "Enter the name customers see.";
    else if (d.name.length > 100) e.name = "The name can be at most 100 characters.";
    if (!d.code) e.code = "Enter a code.";
    else if (!SLUG_PATTERN.test(d.code) || d.code.length > 50) e.code = "Use lowercase letters, numbers and single hyphens only.";
    if (d.description && d.description.length > 2000) e.description = "At most 2,000 characters.";
    if (!/^\d+$/.test(d.sortOrder) || Number(d.sortOrder) > 100000) e.sortOrder = "Enter a whole number from 0 to 100000.";
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
      ["name", "code", "description"].forEach(function (k) { if (d[k] !== (x[k] || null)) body[k] = d[k]; });
      if (Number(d.sortOrder) !== x.sortOrder) body.sortOrder = Number(d.sortOrder);
      if (d.isActive !== x.isActive) body.isActive = d.isActive;
      if (!Object.keys(body).length) { A.flash("There are no changes to save.", "info"); return; }
      if (body.code && !window.confirm("Change the code from “" + x.code + "” to “" + body.code + "”?")) return;
    } else {
      body = { name: d.name, code: d.code, sortOrder: Number(d.sortOrder), isActive: d.isActive };
      if (d.description) body.description = d.description;
    }
    els.save.disabled = true;
    var call = x
      ? A.request("/storage-options/" + x.id, { method: "PATCH", body: body })
      : A.request("/storage-options", { method: "POST", body: body });
    call.then(function (result) {
      els.save.disabled = false;
      if (result.ok && result.data && result.data.storageOption) {
        closeEditor();
        A.flash((x ? "Saved “" : "Added “") + result.data.storageOption.name + "”.", "success");
        return load();
      }
      var errors = A.fieldErrors(result);
      if (result.status === 409) errors.code = "A storage option with this code already exists.";
      A.showErrors(els.form, errors);
      A.flash(result.status === 409 ? "A storage option with this code already exists." : A.errorMessage(result, "The storage option could not be saved."), "error");
    });
  }

  function toggle(x, button) {
    var next = !x.isActive;
    if (!next && !window.confirm("Deactivate “" + x.name + "”? It stays in the list and can be activated again.")) return;
    button.disabled = true;
    A.request("/storage-options/" + x.id, { method: "PATCH", body: { isActive: next } }).then(function (result) {
      button.disabled = false;
      if (result.ok && result.data && result.data.storageOption) {
        A.flash("“" + result.data.storageOption.name + "” " + (result.data.storageOption.isActive ? "activated." : "deactivated."), "success");
        return load();
      }
      A.flash(A.errorMessage(result, "The change could not be saved."), "error");
    });
  }

  els.add.addEventListener("click", function () { openEditor(null); });
  els.form.addEventListener("submit", save);
  els.panel.addEventListener("click", function (event) { if (event.target.closest("[data-editor-close]")) closeEditor(); });
  f.code.addEventListener("input", function () { state.codeTouched = true; });
  els.rows.addEventListener("click", function (event) {
    var edit = event.target.closest("[data-edit]");
    var map = event.target.closest("[data-map]");
    var tog = event.target.closest("[data-toggle]");
    if (edit) openEditor(find(edit.getAttribute("data-edit")));
    else if (tog) toggle(find(tog.getAttribute("data-toggle")), tog);
    else if (map && window.RabboraMapping) {
      var x = find(map.getAttribute("data-map"));
      window.RabboraMapping.open({ kind: "storage", option: { id: x.id, name: x.name }, panel: els.mapping, onSaved: load });
    }
  });

  A.requireAdmin("storage").then(load);
})();