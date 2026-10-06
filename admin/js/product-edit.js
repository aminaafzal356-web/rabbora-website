/*!
 * Rabbora Living — admin product editor (admin/product.html)
 *   product.html?new=1     create   -> POST  /api/products
 *   product.html?id=5      edit     -> GET   /api/admin/products/5   (incl. inactive + every size)
 *                                      PATCH /api/products/5        (only the fields that changed)
 *   Sizes (existing admin endpoints):  POST  /api/products/5/variants
 *                                      PATCH /api/products/5/variants/:variantId
 * Images, inventory, fabrics and storage are in js/product-options.js; it
 * gets the loaded product through window.RabboraProductEditor and the
 * "rabbora:product-loaded" event, and calls reload() after saving.
 * The backend validates everything again; its messages are shown here.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  var MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;
  // Category slug -> the shop page that shows it ("page.html#/<slug>").
  var CATEGORY_PAGES = {
    "slatted-ottoman-beds": "ottoman-beds.html",
    "solid-base-ottomans": "solid-base-ottomans.html",
    "storage-drawers": "storage-drawers.html",
    "high-headboard-beds": "high-headboard-beds.html",
    "tv-beds": "tv-beds.html",
    "kids-beds": "kids-beds.html",
    "mattresses": "mattresses.html",
    "sofas": "sofas.html"
  };

  var form = document.getElementById("productForm");
  var f = {
    name: document.getElementById("pName"),
    slug: document.getElementById("pSlug"),
    description: document.getElementById("pDescription"),
    categoryId: document.getElementById("pCategory"),
    sku: document.getElementById("pSku"),
    mainImage: document.getElementById("pImage"),
    isActive: document.getElementById("pActive"),
    isFeatured: document.getElementById("pFeatured"),
    isBestSeller: document.getElementById("pBestSeller"),
    price: document.getElementById("pPrice")
  };
  var els = {
    title: document.getElementById("adminPageTitle"),
    preview: document.getElementById("pImagePreview"),
    priceHint: document.getElementById("pPriceHint"),
    pricingFacts: document.getElementById("pPricingFacts"),
    infoPanel: document.getElementById("pInfoPanel"),
    info: document.getElementById("pInfo"),
    save: document.getElementById("productSaveBtn"),
    viewLink: document.getElementById("productViewLink"),
    variantsPanel: document.getElementById("variantsPanel"),
    variantRows: document.getElementById("variantRows"),
    variantEmpty: document.getElementById("variantEmpty"),
    variantAdd: document.getElementById("variantAddBtn"),
    variantFormWrap: document.getElementById("variantFormWrap"),
    mainImagePanel: document.getElementById("mainImagePanel"),
    saveHint: document.getElementById("productSaveHint")
  };

  var params = new URLSearchParams(window.location.search);
  var isNew = params.get("new") === "1";
  var productId = parseInt(params.get("id"), 10) || null;
  var state = { product: null, variants: [], categories: [], slugTouched: false, saving: false, data: null };

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  function showErrors(scope, errors) {
    var first = null;
    var fields = scope.querySelectorAll(".admin-field[data-field]");
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

  function slugify(text) {
    return String(text || "").toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 255);
  }

  function textOrNull(value) {
    var v = String(value || "").trim();
    return v ? v : null;
  }

  function moneyError(value, label, required) {
    var v = String(value || "").trim();
    if (!v) return required ? "Enter the " + label + "." : "";
    if (!MONEY_PATTERN.test(v)) return "Enter the " + label + " in pounds, e.g. 249 or 249.99.";
    if (Number(v) <= 0) return "The " + label + " must be more than £0.";
    if (Number(v) > 99999999.99) return "The " + label + " is too large.";
    return "";
  }

  function setPreview(path) {
    var url = A.imageUrl(path);
    els.preview.innerHTML = url ? '<img src="' + A.escapeHtml(url) + '" alt="" />' : "<span>No image</span>";
  }

  function formatDate(value) {
    var d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function activeVariants() {
    return state.variants.filter(function (v) { return v.isActive; });
  }

  // ---------------------------------------------------------------
  // Fill the form
  // ---------------------------------------------------------------

  function fillCategories(selectedId, selectedName) {
    var list = state.categories.slice();
    if (selectedId && !list.some(function (c) { return c.id === selectedId; })) {
      list.push({ id: selectedId, name: (selectedName || "Category " + selectedId) + " (inactive)" });
    }
    f.categoryId.innerHTML = '<option value="">No category</option>' + list.map(function (c) {
      return '<option value="' + c.id + '">' + A.escapeHtml(c.name) + "</option>";
    }).join("");
    f.categoryId.value = selectedId ? String(selectedId) : "";
  }

  function fillPricing() {
    var p = state.product;
    var hasSizes = !!p && activeVariants().length > 0;
    // With sizes, products.price is kept as the lowest active size price by
    // the backend (syncFromPrice) — it is changed through the sizes only.
    f.price.readOnly = hasSizes;
    f.price.classList.toggle("is-readonly", hasSizes);
    if (isNew) {
      els.priceHint.textContent = "The price customers pay. If you add sizes later, this becomes the lowest size price automatically.";
    } else if (hasSizes) {
      els.priceHint.textContent = "Set by the sizes below (the lowest active size price). Change prices in “Sizes & prices”.";
    } else {
      els.priceHint.textContent = "This product has no sizes, so this is its only price.";
    }
    if (!p || !p.fromPricing) {
      els.pricingFacts.innerHTML = "";
      return;
    }
    var fp = p.fromPricing;
    els.pricingFacts.innerHTML =
      "<div><dt>Shop shows</dt><dd>" + (hasSizes ? "from " : "") + A.money(fp.salePrice) + "</dd></div>" +
      (fp.originalPrice ? "<div><dt>Original price</dt><dd>" + A.money(fp.originalPrice) + "</dd></div>" : "") +
      (fp.discountPercentage ? "<div><dt>Discount</dt><dd>" + fp.discountPercentage + "% off</dd></div>" : "") +
      (fp.monthly ? "<div><dt>Monthly</dt><dd>" + A.escapeHtml(fp.monthlyText || "") + "</dd></div>" : "");
  }

  function fillInfo() {
    var p = state.product;
    if (!p) { els.infoPanel.hidden = true; return; }
    els.infoPanel.hidden = false;
    var tracked = p.inventory && p.inventory.tracked;
    els.info.innerHTML =
      "<div><dt>Product ID</dt><dd>" + p.id + "</dd></div>" +
      "<div><dt>Created</dt><dd>" + A.escapeHtml(formatDate(p.createdAt)) + "</dd></div>" +
      "<div><dt>Last updated</dt><dd>" + A.escapeHtml(formatDate(p.updatedAt)) + "</dd></div>" +
      "<div><dt>Stock</dt><dd>" + (tracked ? "Tracked per size (see sizes)" : "Not tracked (unlimited)") + "</dd></div>" +
      '<div><dt>Reviews</dt><dd>' + (p.rating && p.rating.count ? p.rating.average + " / 5 (" + p.rating.count + ")" : "None approved") + "</dd></div>";

    var page = p.category && CATEGORY_PAGES[p.category.slug];
    if (page && p.isActive) {
      els.viewLink.href = "../" + page + "#/" + p.slug;
      els.viewLink.hidden = false;
    } else {
      els.viewLink.hidden = true;
    }
  }

  function fillForm() {
    var p = state.product;
    f.name.value = p ? p.name || "" : "";
    f.slug.value = p ? p.slug || "" : "";
    f.description.value = p ? p.description || "" : "";
    f.sku.value = p ? p.sku || "" : "";
    f.mainImage.value = p ? p.main_image || "" : "";
    f.isActive.checked = p ? !!p.isActive : true;
    f.isFeatured.checked = p ? !!p.featured : false;
    f.isBestSeller.checked = p ? !!p.bestSeller : false;
    f.price.value = p && p.price !== null && p.price !== undefined ? Number(p.price).toFixed(2) : "";
    fillCategories(p ? p.category_id : null, p && p.category ? p.category.name : null);
    setPreview(f.mainImage.value);
    fillPricing();
    fillInfo();
    showErrors(form, {});
    var title = isNew ? "Add a product" : p.name;
    els.title.textContent = title;
    document.title = title + " | Rabbora Admin";
    els.save.textContent = isNew ? "Create product" : "Save changes";
    els.variantsPanel.hidden = isNew;
    // After creating, images are managed in the Images panel (product-options.js).
    els.mainImagePanel.hidden = !isNew;
    els.saveHint.hidden = isNew;
    if (!isNew) renderVariants();
    form.hidden = false;
  }

  // ---------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------

  function loadCategories() {
    return A.request("/categories").then(function (result) {
      state.categories = result.ok && result.data && Array.isArray(result.data.categories) ? result.data.categories : [];
    });
  }

  function loadProduct() {
    return A.request("/admin/products/" + productId).then(function (result) {
      if (result.ok && result.data && result.data.product) {
        state.product = result.data.product;
        state.variants = result.data.variants || [];
        state.data = result.data;
        fillForm();
        document.dispatchEvent(new CustomEvent("rabbora:product-loaded", { detail: result.data }));
        return true;
      }
      A.flash(A.errorMessage(result, "This product could not be loaded."), "error");
      return false;
    });
  }

  // ---------------------------------------------------------------
  // Save product
  // ---------------------------------------------------------------

  function readForm() {
    var categoryId = f.categoryId.value ? parseInt(f.categoryId.value, 10) : null;
    return {
      name: f.name.value.trim(),
      slug: f.slug.value.trim().toLowerCase(),
      description: textOrNull(f.description.value),
      categoryId: categoryId,
      sku: textOrNull(f.sku.value),
      mainImage: textOrNull(f.mainImage.value),
      isActive: f.isActive.checked,
      isFeatured: f.isFeatured.checked,
      isBestSeller: f.isBestSeller.checked,
      price: f.price.value.trim()
    };
  }

  function validate(d) {
    var errors = {};
    if (!d.name) errors.name = "Enter the product name.";
    else if (d.name.length > 255) errors.name = "The name can be at most 255 characters.";
    if (!d.slug) errors.slug = "Enter a slug.";
    else if (!SLUG_PATTERN.test(d.slug) || d.slug.length > 255) errors.slug = "Use lowercase letters, numbers and single hyphens only (e.g. hampton-ottoman-bed).";
    if (d.description && d.description.length > 10000) errors.description = "The description can be at most 10,000 characters.";
    if (d.sku && d.sku.length > 64) errors.sku = "The SKU can be at most 64 characters.";
    if (d.mainImage && d.mainImage.length > 1000) errors.mainImage = "The image path is too long.";
    if (isNew || !f.price.readOnly) {
      var pe = moneyError(d.price, "price", true);
      if (pe) errors.price = pe;
    }
    return errors;
  }

  // Only what changed is sent on edit (PATCH changes only the fields sent).
  function changes(d) {
    var p = state.product;
    var out = {};
    if (d.name !== p.name) out.name = d.name;
    if (d.slug !== p.slug) out.slug = d.slug;
    if (d.description !== (p.description || null)) out.description = d.description;
    if (d.categoryId !== (p.category_id || null)) out.categoryId = d.categoryId;
    if (d.sku !== (p.sku || null)) out.sku = d.sku;
    if (d.mainImage !== (p.main_image || null)) out.mainImage = d.mainImage;
    if (d.isActive !== !!p.isActive) out.isActive = d.isActive;
    if (d.isFeatured !== !!p.featured) out.isFeatured = d.isFeatured;
    if (d.isBestSeller !== !!p.bestSeller) out.isBestSeller = d.isBestSeller;
    if (!f.price.readOnly && Math.round(Number(d.price) * 100) !== Math.round(Number(p.price) * 100)) out.price = Number(d.price);
    return out;
  }

  function backendErrors(result) {
    var errors = A.fieldErrors(result);
    if (result.status === 409) {
      errors.slug = errors.slug || "A product with this slug or SKU already exists.";
    }
    return errors;
  }

  function setSaving(saving, text) {
    state.saving = saving;
    els.save.disabled = saving;
    els.save.textContent = saving ? text : (isNew ? "Create product" : "Save changes");
  }

  function save(event) {
    event.preventDefault();
    if (state.saving) return;
    var d = readForm();
    if (!showErrors(form, validate(d))) {
      A.flash("Please check the highlighted fields.", "error");
      return;
    }

    if (isNew) {
      var body = {
        name: d.name, slug: d.slug, description: d.description, categoryId: d.categoryId,
        sku: d.sku, mainImage: d.mainImage, price: Number(d.price),
        isActive: d.isActive, isFeatured: d.isFeatured, isBestSeller: d.isBestSeller
      };
      Object.keys(body).forEach(function (k) { if (body[k] === null) delete body[k]; });
      setSaving(true, "Creating…");
      A.request("/products", { method: "POST", body: body }).then(function (result) {
        if (result.ok && result.data && result.data.product) {
          window.location.replace("product.html?id=" + result.data.product.id + "&created=1");
          return;
        }
        setSaving(false);
        showErrors(form, backendErrors(result));
        A.flash(result.status === 409 ? "A product with this slug or SKU already exists." : A.errorMessage(result, "The product could not be created."), "error");
      });
      return;
    }

    var patch = changes(d);
    if (!Object.keys(patch).length) {
      A.flash("There are no changes to save.", "info");
      return;
    }
    if (patch.slug && !window.confirm("Change the slug from “" + state.product.slug + "” to “" + patch.slug + "”? Links to this product's page will change.")) return;
    if (patch.isActive === false && !window.confirm("Deactivate this product? It will be hidden from the shop until you activate it again. Existing orders are not affected.")) return;
    if (patch.price !== undefined && !window.confirm("Change the live price from " + A.money(state.product.price) + " to " + A.money(patch.price) + "?")) return;

    setSaving(true, "Saving…");
    A.request("/products/" + productId, { method: "PATCH", body: patch }).then(function (result) {
      if (result.ok && result.data && result.data.product) {
        // Reload from the backend so the form shows exactly what was saved.
        return loadProduct().then(function () {
          setSaving(false);
          A.flash("Saved. The product now shows what the backend has stored.", "success");
        });
      }
      setSaving(false);
      showErrors(form, backendErrors(result));
      A.flash(result.status === 409 ? "A product with this slug or SKU already exists." : A.errorMessage(result, "The changes could not be saved."), "error");
    });
  }

  // ---------------------------------------------------------------
  // Sizes & prices
  // ---------------------------------------------------------------

  // Same rules as backend/utils/pricing.js, in whole pence:
  //   savings = original - sale;  discount % = round(savings / original * 100)
  function pence(value) {
    return value === null || value === undefined || value === "" ? null : Math.round(Number(value) * 100);
  }

  function savingsOf(price, compareAtPrice) {
    var sale = pence(price);
    var original = pence(compareAtPrice);
    if (sale === null || original === null || original <= sale) return null;
    return { savings: (original - sale) / 100, percent: Math.round((original - sale) / original * 100) };
  }

  function stockText(v) {
    if (!v.inventory || !v.inventory.isActive) return '<span class="admin-muted">Not tracked</span>';
    var low = v.inventory.stockQuantity <= v.inventory.lowStockThreshold;
    return '<span class="' + (low ? "admin-text-warn" : "") + '">' + v.inventory.stockQuantity + " in stock</span>";
  }

  function renderVariants() {
    var list = state.variants;
    els.variantEmpty.hidden = list.length > 0;
    els.variantRows.innerHTML = list.map(function (v) {
      return (
        '<tr data-variant-id="' + v.id + '"' + (v.isActive ? "" : ' class="is-inactive"') + ">" +
          '<td data-label="Size"><strong>' + A.escapeHtml(v.optionLabel) + '</strong><span class="admin-product-cell__slug">' + A.escapeHtml(v.optionType + ": " + v.optionValue) + "</span></td>" +
          '<td data-label="SKU" class="admin-mono">' + (v.sku ? A.escapeHtml(v.sku) : '<span class="admin-muted">—</span>') + "</td>" +
          '<td data-label="Sale price"><strong>' + A.money(v.price) + "</strong></td>" +
          '<td data-label="Original price">' + (v.compareAtPrice ? A.money(v.compareAtPrice) : '<span class="admin-muted">—</span>') + "</td>" +
          (function () {
            var sv = savingsOf(v.price, v.compareAtPrice);
            return '<td data-label="Savings">' + (sv ? A.money(sv.savings) : '<span class="admin-muted">—</span>') + "</td>" +
              '<td data-label="Discount">' + (sv ? sv.percent + "%" : '<span class="admin-muted">—</span>') + "</td>";
          })() +
          '<td data-label="Currency" class="admin-mono">' + A.escapeHtml(v.currency || "GBP") + "</td>" +
          '<td data-label="Stock">' + stockText(v) + "</td>" +
          '<td data-label="Status"><span class="admin-badge ' + (v.isActive ? "admin-badge--ok" : "admin-badge--off") + '">' + (v.isActive ? "Active" : "Off") + "</span></td>" +
          '<td class="admin-row-actions"><button type="button" class="admin-btn admin-btn--ghost admin-btn--sm" data-variant-edit="' + v.id + '">Edit</button></td>' +
        "</tr>"
      );
    }).join("");
  }

  function field(name, label, value, opts) {
    var o = opts || {};
    var id = "v_" + name;
    return (
      '<div class="admin-field' + (o.wide ? " admin-field--wide" : "") + '" data-field="' + name + '">' +
        '<label class="admin-label" for="' + id + '">' + A.escapeHtml(label) + "</label>" +
        '<input class="admin-input' + (o.mono ? " admin-input--mono" : "") + '" id="' + id + '" name="' + name + '" type="text"' +
          (o.inputmode ? ' inputmode="' + o.inputmode + '"' : "") + (o.max ? ' maxlength="' + o.max + '"' : "") +
          ' value="' + A.escapeHtml(value == null ? "" : value) + '" aria-invalid="false" />' +
        (o.hint ? '<p class="admin-hint">' + A.escapeHtml(o.hint) + "</p>" : "") +
        '<p class="admin-error" role="alert" hidden></p>' +
      "</div>"
    );
  }

  function openVariantForm(variant) {
    var isEdit = !!variant;
    var v = variant || {};
    els.variantFormWrap.innerHTML =
      // A <div>, not a <form>: this sits inside the product form, and
      // forms cannot be nested. Enter and the button both save it.
      '<div class="admin-variant-form" id="variantForm" role="group" aria-label="' + (isEdit ? "Edit size" : "Add a size") + '">' +
        '<h3 class="admin-panel__subtitle">' + (isEdit ? "Edit size: " + A.escapeHtml(v.optionLabel) : "Add a size") + "</h3>" +
        '<div class="admin-grid">' +
          (isEdit
            ? '<div class="admin-field"><span class="admin-label">Size code</span><p class="admin-static admin-mono">' + A.escapeHtml(v.optionType + ": " + v.optionValue) + '</p><p class="admin-hint">Saved carts and orders use this code, so it can’t be changed.</p></div>'
            : '<div class="admin-field" data-field="optionType"><label class="admin-label" for="v_optionType">Type</label>' +
                '<select class="admin-input" id="v_optionType" name="optionType"><option value="size">Size</option><option value="width">Width</option></select>' +
                '<p class="admin-error" role="alert" hidden></p></div>' +
              field("optionValue", "Size code", "", { max: 50, hint: "Exactly as the product page uses it, e.g. Double or King." })) +
          field("optionLabel", "Label (button text)", v.optionLabel, { max: 50 }) +
          field("price", "Sale price (£)", isEdit ? Number(v.price).toFixed(2) : "", { inputmode: "decimal" }) +
          field("compareAtPrice", "Original price (£, optional)", isEdit && v.compareAtPrice ? Number(v.compareAtPrice).toFixed(2) : "", { inputmode: "decimal", hint: "Must be higher than the sale price. Leave empty for no old price." }) +
          '<div class="admin-field"><span class="admin-label">Currency</span><p class="admin-static admin-mono">GBP</p></div>' +
          '<div class="admin-field admin-field--wide"><span class="admin-label">Customers see</span><p class="admin-static" id="v_preview" aria-live="polite"></p></div>' +
          field("sku", "SKU (optional)", v.sku, { max: 64, mono: true, hint: "Must be unique across all sizes." }) +
          (isEdit ? "" :
            field("widthCm", "Width cm (optional)", "", { inputmode: "numeric" }) +
            field("lengthCm", "Length cm (optional)", "", { inputmode: "numeric" }) +
            field("sortOrder", "Sort order (optional)", "", { inputmode: "numeric" })) +
        "</div>" +
        '<label class="admin-check"><input type="checkbox" name="isActive"' + (isEdit ? (v.isActive ? " checked" : "") : " checked") + " /><span>Active (customers can choose this size)</span></label>" +
        '<div class="admin-actions">' +
          '<button type="button" class="admin-btn admin-btn--primary" data-variant-save>' + (isEdit ? "Save size" : "Add size") + "</button>" +
          '<button type="button" class="admin-btn admin-btn--ghost" data-variant-cancel>Cancel</button>' +
        "</div>" +
      "</div>";
    els.variantFormWrap.hidden = false;
    var vf = document.getElementById("variantForm");
    var preview = function () {
      var priceEl = vf.querySelector('[name="price"]');
      var compareEl = vf.querySelector('[name="compareAtPrice"]');
      var out = document.getElementById("v_preview");
      var pv = priceEl.value.trim();
      var cv = compareEl.value.trim();
      if (!MONEY_PATTERN.test(pv) || Number(pv) <= 0) { out.textContent = "Enter a sale price."; return; }
      var sv = MONEY_PATTERN.test(cv) ? savingsOf(pv, cv) : null;
      out.textContent = A.money(Number(pv)) + (sv
        ? " — was " + A.money(Number(cv)) + ", save " + A.money(sv.savings) + " (" + sv.percent + "% off)"
        : (cv ? " — the original price must be higher than the sale price" : " — no original price shown"));
    };
    vf.querySelector('[name="price"]').addEventListener("input", preview);
    vf.querySelector('[name="compareAtPrice"]').addEventListener("input", preview);
    preview();
    vf.querySelector("[data-variant-save]").addEventListener("click", function (event) { saveVariant(event, vf, variant); });
    vf.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName === "INPUT" && event.target.type !== "checkbox") {
        event.preventDefault();
        saveVariant(event, vf, variant);
      }
    });
    var first = vf.querySelector("input, select");
    if (first) first.focus();
  }

  function closeVariantForm() {
    els.variantFormWrap.hidden = true;
    els.variantFormWrap.innerHTML = "";
  }

  function intOrError(value, label, errors, key) {
    var v = String(value || "").trim();
    if (!v) return undefined;
    if (!/^\d+$/.test(v)) { errors[key] = label + " must be a whole number."; return undefined; }
    return parseInt(v, 10);
  }

  function saveVariant(event, vf, variant) {
    event.preventDefault();
    var isEdit = !!variant;
    var get = function (name) { var el = vf.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ""; };
    var errors = {};
    var body = {};

    var label = get("optionLabel");
    if (!label) errors.optionLabel = "Enter the label.";
    var priceErr = moneyError(get("price"), "sale price", true);
    if (priceErr) errors.price = priceErr;
    var compareErr = moneyError(get("compareAtPrice"), "original price", false);
    if (compareErr) errors.compareAtPrice = compareErr;
    if (!priceErr && !compareErr && get("compareAtPrice") && Number(get("compareAtPrice")) <= Number(get("price"))) {
      errors.compareAtPrice = "The original price must be higher than the sale price.";
    }
    if (get("sku").length > 64) errors.sku = "The SKU can be at most 64 characters.";

    if (!isEdit) {
      if (!get("optionValue")) errors.optionValue = "Enter the size code.";
      var w = intOrError(get("widthCm"), "Width", errors, "widthCm");
      var l = intOrError(get("lengthCm"), "Length", errors, "lengthCm");
      if ((w === undefined) !== (l === undefined) && !errors.widthCm && !errors.lengthCm) {
        errors[w === undefined ? "widthCm" : "lengthCm"] = "Enter both width and length, or neither.";
      }
      var so = intOrError(get("sortOrder"), "Sort order", errors, "sortOrder");
      body = { optionType: get("optionType") || "size", optionValue: get("optionValue") };
      if (w !== undefined) body.widthCm = w;
      if (l !== undefined) body.lengthCm = l;
      if (so !== undefined) body.sortOrder = so;
    }
    if (!showErrors(vf, errors)) return;

    var newPrice = Number(get("price"));
    var newCompare = get("compareAtPrice") ? Number(get("compareAtPrice")) : null;
    var newSku = get("sku") || null;
    var newActive = !!vf.querySelector('[name="isActive"]').checked;

    if (isEdit) {
      if (label !== variant.optionLabel) body.optionLabel = label;
      if (Math.round(newPrice * 100) !== Math.round(variant.price * 100)) body.price = newPrice;
      if ((newCompare === null ? null : Math.round(newCompare * 100)) !== (variant.compareAtPrice === null ? null : Math.round(variant.compareAtPrice * 100))) body.compareAtPrice = newCompare;
      if (newSku !== (variant.sku || null)) body.sku = newSku;
      if (newActive !== variant.isActive) body.isActive = newActive;
      if (!Object.keys(body).length) {
        A.flash("There are no changes to save for this size.", "info");
        return;
      }
      if (body.price !== undefined || body.compareAtPrice !== undefined) {
        var msg = "Change the LIVE prices of “" + variant.optionLabel + "”?\n\n" +
          "Sale price: " + A.money(variant.price) + " → " + A.money(newPrice) + "\n" +
          "Original price: " + (variant.compareAtPrice ? A.money(variant.compareAtPrice) : "none") + " → " + (newCompare ? A.money(newCompare) : "none");
        if (!window.confirm(msg)) return;
      }
      if (body.isActive === false && !window.confirm("Switch off “" + variant.optionLabel + "”? Customers won't be able to choose this size.")) return;
    } else {
      body.optionLabel = label;
      body.price = newPrice;
      if (newCompare !== null) body.compareAtPrice = newCompare;
      if (newSku) body.sku = newSku;
      body.isActive = newActive;
    }

    var submit = vf.querySelector("[data-variant-save]");
    submit.disabled = true;
    var call = isEdit
      ? A.request("/products/" + productId + "/variants/" + variant.id, { method: "PATCH", body: body })
      : A.request("/products/" + productId + "/variants", { method: "POST", body: body });
    call.then(function (result) {
      submit.disabled = false;
      if (result.ok) {
        closeVariantForm();
        return loadProduct().then(function () {
          A.flash(isEdit ? "Size saved." : "Size added.", "success");
        });
      }
      var errs = A.fieldErrors(result);
      if (result.status === 409) {
        if (isEdit) errs.sku = errs.sku || "This SKU is already used by another size.";
        else errs.optionValue = errs.optionValue || "This size code or SKU already exists.";
      }
      showErrors(vf, errs);
      A.flash(result.status === 409 ? "This size code or SKU already exists." : A.errorMessage(result, "The size could not be saved."), "error");
    });
  }

  // ---------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------

  form.addEventListener("submit", save);
  f.mainImage.addEventListener("change", function () { setPreview(f.mainImage.value.trim()); });
  f.slug.addEventListener("input", function () { state.slugTouched = true; });
  f.name.addEventListener("input", function () {
    if (isNew && !state.slugTouched) f.slug.value = slugify(f.name.value);
  });
  els.variantAdd.addEventListener("click", function () { openVariantForm(null); });
  els.variantsPanel.addEventListener("click", function (event) {
    var edit = event.target.closest("[data-variant-edit]");
    if (edit) {
      var id = parseInt(edit.getAttribute("data-variant-edit"), 10);
      openVariantForm(state.variants.filter(function (v) { return v.id === id; })[0]);
    } else if (event.target.closest("[data-variant-cancel]")) {
      closeVariantForm();
    }
  });

  // Used by js/product-options.js.
  window.RabboraProductEditor = {
    productId: productId,
    isNew: isNew,
    reload: function () { return loadProduct(); },
    data: function () { return state.data; },
    categoryPage: function () {
      var p = state.product;
      return p && p.category ? CATEGORY_PAGES[p.category.slug] || null : null;
    }
  };

  A.requireAdmin("products").then(function () {
    return loadCategories();
  }).then(function () {
    if (isNew) {
      fillForm();
      return;
    }
    if (!productId) {
      A.flash("No product was chosen. Go back to the product list.", "error");
      return;
    }
    return loadProduct().then(function (ok) {
      if (ok && params.get("created") === "1") A.flash("Product created. You can now add its sizes and prices.", "success");
    });
  });
})();