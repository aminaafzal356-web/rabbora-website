/*!
 * Rabbora Living — product editor sections (admin/product.html?id=…)
 * Loaded after product-edit.js. Each section saves on its own:
 *
 *   Images     POST   /api/products/:id/images              add a path (added last)
 *              PATCH  /api/products/:id/images/:imageId     change path / alt, make primary
 *              DELETE /api/products/:id/images/:imageId     remove from this product (file kept)
 *              PUT    /api/products/:id/images/order        new order
 *   Inventory  read only (stock is changed on the Inventory page)
 *   Fabrics    PUT    /api/products/:id/fabrics             (existing endpoint)
 *   Storage    PUT    /api/products/:id/storage-options     (existing endpoint)
 *
 * The fabric / storage endpoints replace the product's whole list, so a
 * save first re-reads the product's CURRENT links from the backend and
 * applies only the adds / removes made here. Every other link keeps its
 * price adjustment, order and on/off state. Prices are never edited here
 * and new links get £0 (the shop charges nothing extra for them).
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  var E = window.RabboraProductEditor;
  if (!A || !E || E.isNew || !E.productId) return;

  var IMAGE_PATH = /^(?:https?:\/\/[^\s"'<>\\]+|(?!\/\/)(?!.*\.\.)[A-Za-z0-9._\-\/ ()%]+\.(?:jpe?g|jfif|png|webp|gif|avif|svg))$/i;
  var IMAGE_PATH_MESSAGE = "Enter an image path such as images/beds/example.jpg (jpg, jpeg, jfif, png, webp, gif, avif or svg).";
  var pid = E.productId;

  function $(id) { return document.getElementById(id); }

  var els = {
    imagesPanel: $("imagesPanel"), imagesList: $("imagesList"), imagesCount: $("imagesCount"),
    imgUrl: $("imgNewUrl"), imgAlt: $("imgNewAlt"), imgAdd: $("imgAddBtn"), imgAddForm: $("imageAddForm"),
    invPanel: $("inventoryPanel"), invRows: $("inventoryRows"), invLink: $("inventoryLink"),
    fabPanel: $("fabricsPanel"), fabChosen: $("fabricsChosen"), fabCount: $("fabricsCount"), fabSearch: $("fabricsSearch"),
    fabShow: $("fabricsShow"), fabList: $("fabricsList"), fabPending: $("fabricsPending"), fabSave: $("fabricsSave"),
    fabReset: $("fabricsReset"), fabAll: $("fabricsTickAll"), fabNone: $("fabricsUntickAll"),
    stPanel: $("storagePanel"), stRows: $("storageRows"), stPending: $("storagePending"), stSave: $("storageSave"), stReset: $("storageReset")
  };

  var state = {
    data: null,
    images: [], imageBusy: false, editingImage: null,
    fabrics: null, fabricsError: null, fabricBase: {}, fabricAdd: {}, fabricRemove: {}, fabricBusy: false,
    storage: null, storageError: null, storageBase: {}, storageDefaultBase: null, storageOn: {}, storageDefault: null, storageTouched: false, storageBusy: false
  };

  function compact(text) {
    return String(text || "").toLowerCase().replace(/\s+/g, "");
  }

  function setFieldErrors(scope, errors) {
    var fields = scope.querySelectorAll(".admin-field[data-field]");
    var first = null;
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i].getAttribute("data-field");
      var input = fields[i].querySelector("input, textarea, select");
      var err = fields[i].querySelector(".admin-error");
      var message = errors[name] || "";
      if (err) { err.textContent = message; err.hidden = !message; }
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
      if (message && !first) first = input;
    }
    if (first) first.focus();
    return !first;
  }

  // Enter inside these sections must not submit the product form.
  [els.imagesPanel, els.fabPanel, els.stPanel].forEach(function (panel) {
    panel.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" || event.target.tagName !== "INPUT" || event.target.type === "checkbox" || event.target.type === "radio") return;
      event.preventDefault();
      if (event.target === els.imgUrl || event.target === els.imgAlt) addImage();
      var row = event.target.closest("[data-image-edit-form]");
      if (row) saveImageEdit(row);
    });
  });

  // =================================================================
  // Images
  // =================================================================

  function sortedImages(list) {
    return (list || []).slice().sort(function (a, b) {
      return (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id;
    });
  }

  function renderImages() {
    var list = state.images;
    var hasPrimary = list.some(function (img) { return img.is_primary; });
    els.imagesCount.textContent = list.length + " image" + (list.length === 1 ? "" : "s") + (hasPrimary ? "" : " · no primary set (the first image is used)");
    var busy = state.imageBusy;
    els.imagesList.innerHTML = list.map(function (img, i) {
      var url = A.imageUrl(img.image_url);
      if (state.editingImage === img.id) {
        return (
          '<li class="admin-gallery__item is-editing" data-image-id="' + img.id + '">' +
            '<div class="admin-gallery__thumb">' + (url ? '<img src="' + A.escapeHtml(url) + '" alt="" loading="lazy" />' : "") + "</div>" +
            '<div class="admin-gallery__edit" data-image-edit-form="' + img.id + '">' +
              '<div class="admin-field" data-field="url"><label class="admin-label" for="imgEditUrl">Image path</label>' +
                '<input class="admin-input admin-input--mono" id="imgEditUrl" type="text" maxlength="1000" value="' + A.escapeHtml(img.image_url) + '" aria-invalid="false" />' +
                '<p class="admin-error" role="alert" hidden></p></div>' +
              '<div class="admin-field" data-field="altText"><label class="admin-label" for="imgEditAlt">Alt text</label>' +
                '<input class="admin-input" id="imgEditAlt" type="text" maxlength="255" value="' + A.escapeHtml(img.alt_text || "") + '" aria-invalid="false" />' +
                '<p class="admin-error" role="alert" hidden></p></div>' +
              '<div class="admin-actions">' +
                '<button type="button" class="admin-btn admin-btn--primary admin-btn--sm" data-img-save="' + img.id + '"' + (busy ? " disabled" : "") + ">Save image</button>" +
                '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-img-cancel>Cancel</button>' +
              "</div>" +
            "</div>" +
          "</li>"
        );
      }
      return (
        '<li class="admin-gallery__item' + (img.is_primary ? " is-primary" : "") + '" data-image-id="' + img.id + '">' +
          '<div class="admin-gallery__thumb">' + (url ? '<img src="' + A.escapeHtml(url) + '" alt="" loading="lazy" />' : "") + "</div>" +
          '<div class="admin-gallery__info">' +
            '<p class="admin-gallery__path admin-mono">' + A.escapeHtml(img.image_url) + "</p>" +
            '<p class="admin-gallery__meta">' +
              '<span class="admin-gallery__pos">#' + (i + 1) + "</span>" +
              (img.is_primary ? '<span class="admin-badge admin-badge--ok">Primary</span>' : "") +
              (img.alt_text ? '<span class="admin-muted">Alt: ' + A.escapeHtml(img.alt_text) + "</span>" : '<span class="admin-muted">No alt text</span>') +
            "</p>" +
          "</div>" +
          '<div class="admin-gallery__actions">' +
            '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-img-move="-1" data-id="' + img.id + '" aria-label="Move image ' + (i + 1) + ' up"' + (busy || i === 0 ? " disabled" : "") + ">&uarr;</button>" +
            '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-img-move="1" data-id="' + img.id + '" aria-label="Move image ' + (i + 1) + ' down"' + (busy || i === list.length - 1 ? " disabled" : "") + ">&darr;</button>" +
            (img.is_primary ? "" : '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-img-primary="' + img.id + '"' + (busy ? " disabled" : "") + ">Make primary</button>") +
            '<button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-img-edit="' + img.id + '"' + (busy ? " disabled" : "") + ">Edit</button>" +
            '<button type="button" class="admin-btn admin-btn--danger-ghost admin-btn--sm" data-img-remove="' + img.id + '"' +
              (busy || list.length <= 1 ? " disabled" : "") + (list.length <= 1 ? ' title="A product needs at least one image"' : "") + ">Remove</button>" +
          "</div>" +
        "</li>"
      );
    }).join("") || '<li class="admin-empty">This product has no images yet.</li>';
    els.imgAdd.disabled = busy;
  }

  function imageRequest(path, options, successText) {
    if (state.imageBusy) return Promise.resolve(false);
    state.imageBusy = true;
    renderImages();
    return A.request(path, options).then(function (result) {
      state.imageBusy = false;
      if (result.ok && result.data && Array.isArray(result.data.images)) {
        state.editingImage = null;
        // The whole product is reloaded: the primary image also changes the list thumbnail.
        return E.reload().then(function () {
          A.flash(successText, "success");
          return true;
        });
      }
      renderImages();
      A.flash(A.errorMessage(result, "The image could not be saved."), "error");
      return result;
    });
  }

  function addImage() {
    var url = els.imgUrl.value.trim();
    var alt = els.imgAlt.value.trim();
    var errors = {};
    if (!url) errors.url = "Enter the image path.";
    else if (url.length > 1000 || !IMAGE_PATH.test(url)) errors.url = IMAGE_PATH_MESSAGE;
    else if (state.images.some(function (img) { return img.image_url === url; })) errors.url = "This image is already on this product.";
    if (alt.length > 255) errors.altText = "The alt text can be at most 255 characters.";
    if (!setFieldErrors(els.imgAddForm, errors)) return;
    var body = { url: url };
    if (alt) body.altText = alt;
    imageRequest("/products/" + pid + "/images", { method: "POST", body: body }, "Image added.").then(function (r) {
      if (r === true) {
        els.imgUrl.value = "";
        els.imgAlt.value = "";
        return;
      }
      if (r && r.status) {
        var errs = A.fieldErrors(r);
        if (r.status === 409) errs.url = "This image is already on this product.";
        setFieldErrors(els.imgAddForm, errs);
      }
    });
  }

  function saveImageEdit(row) {
    var id = Number(row.getAttribute("data-image-edit-form"));
    var img = state.images.filter(function (x) { return x.id === id; })[0];
    if (!img) return;
    var url = row.querySelector("#imgEditUrl").value.trim();
    var alt = row.querySelector("#imgEditAlt").value.trim();
    var errors = {};
    if (!url) errors.url = "Enter the image path.";
    else if (url.length > 1000 || !IMAGE_PATH.test(url)) errors.url = IMAGE_PATH_MESSAGE;
    else if (url !== img.image_url && state.images.some(function (x) { return x.image_url === url; })) errors.url = "This image is already on this product.";
    if (!setFieldErrors(row, errors)) return;
    var body = {};
    if (url !== img.image_url) body.url = url;
    if (alt !== (img.alt_text || "")) body.altText = alt || null;
    if (!Object.keys(body).length) {
      state.editingImage = null;
      renderImages();
      A.flash("There are no changes to save for this image.", "info");
      return;
    }
    imageRequest("/products/" + pid + "/images/" + id, { method: "PATCH", body: body }, "Image saved.").then(function (r) {
      if (r && r !== true && r.status) {
        var errs = A.fieldErrors(r);
        if (r.status === 409) errs.url = "This image is already on this product.";
        var again = els.imagesList.querySelector("[data-image-edit-form]");
        if (again) setFieldErrors(again, errs);
      }
    });
  }

  function moveImage(id, dir) {
    var list = state.images.map(function (img) { return img.id; });
    var i = list.indexOf(id);
    var j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    list[i] = list[j];
    list[j] = id;
    imageRequest("/products/" + pid + "/images/order", { method: "PUT", body: { imageIds: list } }, "Image order saved.");
  }

  els.imgAdd.addEventListener("click", addImage);
  els.imagesList.addEventListener("click", function (event) {
    var t = event.target;
    var b;
    if ((b = t.closest("[data-img-move]"))) return moveImage(Number(b.getAttribute("data-id")), Number(b.getAttribute("data-img-move")));
    if ((b = t.closest("[data-img-primary]"))) {
      return imageRequest("/products/" + pid + "/images/" + b.getAttribute("data-img-primary"), { method: "PATCH", body: { isPrimary: true } },
        "Primary image changed. It now shows first on the product page.");
    }
    if ((b = t.closest("[data-img-edit]"))) {
      state.editingImage = Number(b.getAttribute("data-img-edit"));
      renderImages();
      var input = $("imgEditUrl");
      if (input) input.focus();
      return;
    }
    if (t.closest("[data-img-cancel]")) {
      state.editingImage = null;
      renderImages();
      return;
    }
    if ((b = t.closest("[data-img-save]"))) return saveImageEdit(b.closest("[data-image-edit-form]"));
    if ((b = t.closest("[data-img-remove]"))) {
      var img = state.images.filter(function (x) { return x.id === Number(b.getAttribute("data-img-remove")); })[0];
      if (!img || !window.confirm("Remove this image from the product?\n\n" + img.image_url + "\n\nThe file itself is not deleted and can be added again.")) return;
      return imageRequest("/products/" + pid + "/images/" + img.id, { method: "DELETE" }, "Image removed from this product.");
    }
  });

  // =================================================================
  // Inventory (read only)
  // =================================================================

  function trackingCell(inv) {
    if (!inv) return '<span class="admin-badge admin-badge--neutral">Not tracked</span>';
    if (!inv.isActive) return '<span class="admin-badge admin-badge--neutral">Not tracked</span><span class="admin-cell-note">Record switched off</span>';
    if (inv.stockQuantity <= 0) return '<span class="admin-badge admin-badge--danger">Out of stock</span>';
    if (inv.stockQuantity <= inv.lowStockThreshold) return '<span class="admin-badge admin-badge--warn">Low stock</span>';
    return '<span class="admin-badge admin-badge--ok">Tracked</span>';
  }

  function invRow(label, note, inv) {
    var tracked = inv && inv.isActive;
    return (
      "<tr>" +
        '<td data-label="Size"><strong>' + A.escapeHtml(label) + "</strong>" + (note ? '<span class="admin-cell-note">' + A.escapeHtml(note) + "</span>" : "") + "</td>" +
        '<td data-label="Stock SKU" class="admin-mono">' + (inv && inv.sku ? A.escapeHtml(inv.sku) : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Current stock">' + (tracked ? inv.stockQuantity : '<span class="admin-muted">Not tracked</span>') + "</td>" +
        '<td data-label="Low-stock threshold">' + (tracked ? inv.lowStockThreshold : '<span class="admin-muted">—</span>') + "</td>" +
        '<td data-label="Tracking">' + trackingCell(inv) + "</td>" +
      "</tr>"
    );
  }

  function renderInventory() {
    var d = state.data;
    var rows = (d.variants || []).map(function (v) {
      return invRow(v.optionLabel, v.isActive ? "" : "Size switched off", v.inventory);
    });
    if (d.productInventory) rows.unshift(invRow("Whole product", "One stock count for every size", d.productInventory));
    els.invRows.innerHTML = rows.join("") || '<tr><td colspan="5" class="admin-empty">This product has no sizes.</td></tr>';
    els.invLink.href = "inventory.html?search=" + encodeURIComponent(d.product.name);
  }

  // =================================================================
  // Fabrics
  // =================================================================

  function fabricOn(id) {
    if (state.fabricAdd[id]) return true;
    if (state.fabricRemove[id]) return false;
    return !!state.fabricBase[id];
  }

  function fabricChanges() {
    return { add: Object.keys(state.fabricAdd).map(Number), remove: Object.keys(state.fabricRemove).map(Number) };
  }

  function toggleFabric(id, on) {
    if (on) {
      delete state.fabricRemove[id];
      if (!state.fabricBase[id]) state.fabricAdd[id] = true;
    } else {
      delete state.fabricAdd[id];
      if (state.fabricBase[id]) state.fabricRemove[id] = true;
    }
  }

  function fabricById(id) {
    return (state.fabrics || []).filter(function (f) { return f.id === id; })[0] || null;
  }

  function shownFabrics() {
    var q = compact(els.fabSearch.value);
    var show = els.fabShow.value;
    return (state.fabrics || []).filter(function (f) {
      if (q && compact(f.name).indexOf(q) === -1 && compact(f.collection).indexOf(q) === -1) return false;
      if (show === "on" && !fabricOn(f.id)) return false;
      if (show === "off" && fabricOn(f.id)) return false;
      return true;
    });
  }

  function renderFabrics() {
    if (state.fabricsError) {
      els.fabList.innerHTML = '<p class="admin-flash admin-flash--error">' + A.escapeHtml(state.fabricsError) + " Saving is switched off so no links are lost.</p>";
      els.fabSave.disabled = true;
      els.fabChosen.innerHTML = "";
      return;
    }
    if (!state.fabrics) {
      els.fabList.innerHTML = '<p class="admin-muted">Loading fabrics…</p>';
      els.fabSave.disabled = true;
      return;
    }
    var linkInfo = {};
    (state.data.fabricLinks || []).forEach(function (l) { linkInfo[l.fabricId] = l; });
    var onIds = state.fabrics.filter(function (f) { return fabricOn(f.id); }).map(function (f) { return f.id; });
    // Links to a fabric that is not in the list at all (should not happen) are kept and shown.
    Object.keys(state.fabricBase).map(Number).forEach(function (id) {
      if (!fabricById(id) && fabricOn(id)) onIds.push(id);
    });
    els.fabCount.textContent = onIds.length + " of " + state.fabrics.length + " fabrics offered";
    els.fabChosen.innerHTML = onIds.length
      ? onIds.map(function (id) {
          var f = fabricById(id);
          var name = f ? f.name : "Fabric " + id;
          var tags = (f && !f.isActive ? " (inactive)" : "") + (linkInfo[id] && !linkInfo[id].isActive ? " (link off)" : "");
          return '<span class="admin-chip' + (state.fabricAdd[id] ? " is-new" : "") + '">' + A.escapeHtml(name + tags) +
            '<button type="button" class="admin-chip__remove" data-fab-remove="' + id + '" aria-label="Remove ' + A.escapeHtml(name) + '"' + (state.fabricBusy ? " disabled" : "") + ">&times;</button></span>";
        }).join("")
      : '<p class="admin-muted">No fabrics are linked to this product yet.</p>';

    var list = shownFabrics();
    els.fabList.innerHTML = list.length
      ? list.map(function (f) {
          var on = fabricOn(f.id);
          var changed = !!(state.fabricAdd[f.id] || state.fabricRemove[f.id]);
          return '<label class="admin-option' + (on ? " is-on" : "") + (changed ? " is-changed" : "") + '">' +
            '<input type="checkbox" data-fab="' + f.id + '"' + (on ? " checked" : "") + (state.fabricBusy ? " disabled" : "") + " />" +
            (f.imageUrl ? '<img class="admin-option__swatch" src="' + A.escapeHtml(A.imageUrl(f.imageUrl)) + '" alt="" loading="lazy" />' : '<span class="admin-option__swatch"></span>') +
            '<span class="admin-option__text"><strong>' + A.escapeHtml(f.name) + "</strong>" +
              '<small>' + A.escapeHtml(f.collection || "No collection") + (f.isActive ? "" : " · inactive (not shown in the shop)") + "</small></span>" +
          "</label>";
        }).join("")
      : '<p class="admin-muted">No fabrics match.</p>';

    var c = fabricChanges();
    var pending = c.add.length + c.remove.length;
    els.fabPending.textContent = pending
      ? "Not saved yet: " + (c.add.length ? c.add.length + " to add" : "") + (c.add.length && c.remove.length ? ", " : "") + (c.remove.length ? c.remove.length + " to remove" : "")
      : "No unsaved changes.";
    els.fabSave.disabled = state.fabricBusy || !pending;
    els.fabReset.disabled = state.fabricBusy || !pending;
    els.fabAll.disabled = els.fabNone.disabled = state.fabricBusy;
  }

  function loadFabricCatalogue() {
    return A.request("/admin/fabrics").then(function (result) {
      if (result.ok && result.data && Array.isArray(result.data.fabrics)) {
        state.fabrics = result.data.fabrics;
        state.fabricsError = null;
      } else {
        state.fabricsError = A.errorMessage(result, "The fabric list could not be loaded.");
      }
      renderFabrics();
    });
  }

  function saveFabrics() {
    if (state.fabricBusy || state.fabricsError || !state.fabrics) return;
    var c = fabricChanges();
    if (!c.add.length && !c.remove.length) return;
    if (c.remove.length && !window.confirm("Remove " + c.remove.length + " fabric" + (c.remove.length === 1 ? "" : "s") + " from this product? Customers won't be able to choose " + (c.remove.length === 1 ? "it" : "them") + " for this product.")) return;
    state.fabricBusy = true;
    els.fabSave.textContent = "Saving…";
    renderFabrics();
    var done = function (ok, message) {
      state.fabricBusy = false;
      els.fabSave.textContent = "Save fabrics";
      if (ok) {
        state.fabricAdd = {};
        state.fabricRemove = {};
        return E.reload().then(function () { A.flash(message, "success"); });
      }
      renderFabrics();
      A.flash(message, "error");
    };
    // 1. read the CURRENT links (someone may have changed them on the Fabrics page)
    A.request("/admin/products/" + pid).then(function (fresh) {
      if (!(fresh.ok && fresh.data && Array.isArray(fresh.data.fabricLinks))) {
        return done(false, A.errorMessage(fresh, "The current fabric links could not be read, so nothing was saved."));
      }
      var removeSet = {};
      c.remove.forEach(function (id) { removeSet[id] = true; });
      var have = {};
      var list = [];
      fresh.data.fabricLinks.forEach(function (l) {
        if (removeSet[l.fabricId]) return;
        have[l.fabricId] = true;
        list.push({ fabricId: l.fabricId, priceAdjustment: l.priceAdjustment, isActive: l.isActive });
      });
      c.add.forEach(function (id) {
        if (!have[id]) list.push({ fabricId: id, priceAdjustment: 0, isActive: true });
      });
      // 2. send the full list back with only these changes applied
      A.request("/products/" + pid + "/fabrics", { method: "PUT", body: { fabrics: list } }).then(function (result) {
        if (result.ok) {
          return done(true, "Fabrics saved: " + list.length + " fabric" + (list.length === 1 ? "" : "s") + " offered.");
        }
        done(false, A.errorMessage(result, "The fabrics could not be saved."));
      });
    });
  }

  els.fabSearch.addEventListener("input", renderFabrics);
  els.fabShow.addEventListener("change", renderFabrics);
  els.fabList.addEventListener("change", function (event) {
    var box = event.target.closest("[data-fab]");
    if (!box) return;
    toggleFabric(Number(box.getAttribute("data-fab")), box.checked);
    renderFabrics();
  });
  els.fabChosen.addEventListener("click", function (event) {
    var b = event.target.closest("[data-fab-remove]");
    if (!b) return;
    toggleFabric(Number(b.getAttribute("data-fab-remove")), false);
    renderFabrics();
  });
  els.fabAll.addEventListener("click", function () { shownFabrics().forEach(function (f) { toggleFabric(f.id, true); }); renderFabrics(); });
  els.fabNone.addEventListener("click", function () { shownFabrics().forEach(function (f) { toggleFabric(f.id, false); }); renderFabrics(); });
  els.fabReset.addEventListener("click", function () { state.fabricAdd = {}; state.fabricRemove = {}; renderFabrics(); });
  els.fabSave.addEventListener("click", saveFabrics);

  // =================================================================
  // Storage options
  // =================================================================

  function storageChanged() {
    var ids = (state.storage || []).map(function (s) { return s.id; });
    Object.keys(state.storageBase).forEach(function (id) { if (ids.indexOf(Number(id)) === -1) ids.push(Number(id)); });
    var changed = ids.some(function (id) { return !!state.storageOn[id] !== !!state.storageBase[id]; });
    return changed || state.storageDefault !== state.storageDefaultBase;
  }

  function renderStorage() {
    if (state.storageError) {
      els.stRows.innerHTML = '<tr><td colspan="3"><p class="admin-flash admin-flash--error">' + A.escapeHtml(state.storageError) + " Saving is switched off so no links are lost.</p></td></tr>";
      els.stSave.disabled = true;
      return;
    }
    if (!state.storage) {
      els.stRows.innerHTML = '<tr><td colspan="3" class="admin-empty">Loading…</td></tr>';
      els.stSave.disabled = true;
      return;
    }
    var busy = state.storageBusy;
    var linkInfo = {};
    (state.data.storageLinks || []).forEach(function (l) { linkInfo[l.storageOptionId] = l; });
    els.stRows.innerHTML = state.storage.map(function (s) {
      var on = !!state.storageOn[s.id];
      return (
        '<tr class="' + (on ? "" : "is-inactive") + '">' +
          '<td data-label="Option"><strong>' + A.escapeHtml(s.name) + '</strong><span class="admin-cell-note admin-mono">' + A.escapeHtml(s.code) +
            (s.isActive ? "" : " · inactive (not shown in the shop)") + (linkInfo[s.id] && !linkInfo[s.id].isActive ? " · link off" : "") + "</span></td>" +
          '<td data-label="Offered"><label class="admin-check admin-check--inline"><input type="checkbox" data-st-on="' + s.id + '"' + (on ? " checked" : "") + (busy ? " disabled" : "") + " /><span>Offered</span></label></td>" +
          '<td data-label="Default"><label class="admin-check admin-check--inline"><input type="radio" name="storageDefault" data-st-default="' + s.id + '"' +
            (state.storageDefault === s.id ? " checked" : "") + (on && !busy ? "" : " disabled") + " /><span>Default</span></label></td>" +
        "</tr>"
      );
    }).join("") +
      '<tr><td data-label="Option"><span class="admin-muted">No default (customer chooses)</span></td><td></td>' +
      '<td data-label="Default"><label class="admin-check admin-check--inline"><input type="radio" name="storageDefault" data-st-default="0"' +
        (state.storageDefault === null ? " checked" : "") + (busy ? " disabled" : "") + " /><span>No default</span></label></td></tr>";
    var changed = storageChanged();
    els.stPending.textContent = changed ? "Not saved yet." : "No unsaved changes.";
    els.stSave.disabled = busy || !changed;
    els.stReset.disabled = busy || !changed;
  }

  function resetStorage() {
    state.storageOn = {};
    Object.keys(state.storageBase).forEach(function (id) { state.storageOn[id] = true; });
    state.storageDefault = state.storageDefaultBase;
    state.storageTouched = false;
  }

  function loadStorageCatalogue() {
    return A.request("/admin/storage-options").then(function (result) {
      if (result.ok && result.data && Array.isArray(result.data.storageOptions)) {
        state.storage = result.data.storageOptions;
        state.storageError = null;
      } else {
        state.storageError = A.errorMessage(result, "The storage options could not be loaded.");
      }
      renderStorage();
    });
  }

  function saveStorage() {
    if (state.storageBusy || state.storageError || !state.storage || !storageChanged()) return;
    var removed = Object.keys(state.storageBase).filter(function (id) { return !state.storageOn[id]; });
    if (removed.length && !window.confirm("Stop offering " + removed.length + " storage option" + (removed.length === 1 ? "" : "s") + " for this product?")) return;
    state.storageBusy = true;
    els.stSave.textContent = "Saving…";
    renderStorage();
    var done = function (ok, message) {
      state.storageBusy = false;
      els.stSave.textContent = "Save storage";
      if (ok) {
        state.storageTouched = false;
        return E.reload().then(function () { A.flash(message, "success"); });
      }
      renderStorage();
      A.flash(message, "error");
    };
    A.request("/admin/products/" + pid).then(function (fresh) {
      if (!(fresh.ok && fresh.data && Array.isArray(fresh.data.storageLinks))) {
        return done(false, A.errorMessage(fresh, "The current storage links could not be read, so nothing was saved."));
      }
      // Apply only what was changed here to the CURRENT links.
      var want = {};
      Object.keys(state.storageOn).forEach(function (id) { if (state.storageOn[id]) want[id] = true; });
      var added = Object.keys(want).filter(function (id) { return !state.storageBase[id]; });
      var list = [];
      var have = {};
      fresh.data.storageLinks.forEach(function (l) {
        if (state.storageBase[l.storageOptionId] && !want[l.storageOptionId]) return; // removed here
        have[l.storageOptionId] = true;
        list.push({ storageOptionId: l.storageOptionId, priceAdjustment: l.priceAdjustment, isActive: l.isActive, isDefault: false });
      });
      added.forEach(function (id) {
        if (!have[id]) list.push({ storageOptionId: Number(id), priceAdjustment: 0, isActive: true, isDefault: false });
      });
      list.forEach(function (item) { item.isDefault = state.storageDefault !== null && item.storageOptionId === state.storageDefault; });
      if (state.storageDefault !== null && !list.some(function (i) { return i.isDefault; })) {
        return done(false, "The default option must also be offered.");
      }
      A.request("/products/" + pid + "/storage-options", { method: "PUT", body: { storageOptions: list } }).then(function (result) {
        if (result.ok) return done(true, "Storage options saved.");
        done(false, A.errorMessage(result, "The storage options could not be saved."));
      });
    });
  }

  els.stRows.addEventListener("change", function (event) {
    var on = event.target.closest("[data-st-on]");
    var def = event.target.closest("[data-st-default]");
    state.storageTouched = true;
    if (on) {
      var id = Number(on.getAttribute("data-st-on"));
      state.storageOn[id] = on.checked;
      if (!on.checked && state.storageDefault === id) state.storageDefault = null;
    } else if (def) {
      var d = Number(def.getAttribute("data-st-default"));
      state.storageDefault = d || null;
    }
    renderStorage();
  });
  els.stReset.addEventListener("click", function () { resetStorage(); renderStorage(); });
  els.stSave.addEventListener("click", saveStorage);

  // =================================================================
  // Product loaded / reloaded (event from product-edit.js)
  // =================================================================

  var first = true;
  document.addEventListener("rabbora:product-loaded", function (event) {
    var d = event.detail;
    state.data = d;
    state.images = sortedImages(d.product.images);
    if (state.editingImage && !state.images.some(function (i) { return i.id === state.editingImage; })) state.editingImage = null;

    // Fabric baseline = what is stored. Unsaved adds/removes are kept
    // (they are differences, so they stay correct on the new baseline).
    state.fabricBase = {};
    (d.fabricLinks || []).forEach(function (l) { state.fabricBase[l.fabricId] = true; });
    Object.keys(state.fabricAdd).forEach(function (id) { if (state.fabricBase[id]) delete state.fabricAdd[id]; });
    Object.keys(state.fabricRemove).forEach(function (id) { if (!state.fabricBase[id]) delete state.fabricRemove[id]; });

    state.storageBase = {};
    state.storageDefaultBase = null;
    (d.storageLinks || []).forEach(function (l) {
      state.storageBase[l.storageOptionId] = true;
      if (l.isDefault) state.storageDefaultBase = l.storageOptionId;
    });
    if (!state.storageTouched) resetStorage();

    [els.imagesPanel, els.invPanel, els.fabPanel, els.stPanel].forEach(function (p) { p.hidden = false; });
    renderImages();
    renderInventory();
    renderFabrics();
    renderStorage();
    if (first) {
      first = false;
      loadFabricCatalogue();
      loadStorageCatalogue();
    }
  });

  // The product may already be loaded before this file ran.
  if (E.data()) document.dispatchEvent(new CustomEvent("rabbora:product-loaded", { detail: E.data() }));
})();