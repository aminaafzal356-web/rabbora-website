/*!
 * Rabbora Living — shared customer helpers (window.RabboraCustomer)
 * ---------------------------------------------------------------
 * Used by account-dashboard.js (My Account), checkout.js and
 * reviews.js, so addresses and orders look and behave the same
 * everywhere and there is only ONE address book: the backend one.
 *
 * Needs api-config.js (window.RabboraApi) loaded BEFORE this file.
 * Nothing private (addresses, orders, profile) is ever written to
 * localStorage or sessionStorage — it is always read fresh from the
 * backend with the login cookie.
 *
 * Backend endpoints used (backend/routes/users.js, orders.js):
 *   GET    /api/users/me/addresses
 *   POST   /api/users/me/addresses        { fullName, phone, addressLine1, addressLine2,
 *   PATCH  /api/users/me/addresses/:id      city, county, postcode, country, isDefault }
 *   DELETE /api/users/me/addresses/:id
 */
(function (window) {
  "use strict";

  var api = window.RabboraApi && typeof window.RabboraApi.request === "function" ? window.RabboraApi : null;
  if (!api) {
    console.error(
      "[Rabbora] api-config.js is not loaded on this page, so the backend address is unknown. " +
      "Add <script src=\"api-config.js\"></script> before customer.js."
    );
  }

  // Same UK postcode and phone rules as backend/utils/validate.js, only
  // to show a helpful message before sending. The backend still checks.
  var UK_POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
  var PHONE_ALLOWED = /^\+?[0-9 ()-]+$/;

  var MSG_NETWORK = "We can't reach the server right now. Please check your connection and try again.";
  var MSG_SESSION = "Your session has ended. Please log in again.";

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  // Same format as cart.js formatMoney(): £1,234.00
  function money(amount) {
    var n = Number(amount);
    if (!isFinite(n) || n < 0) n = 0;
    return "£" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatDate(value) {
    var d = new Date(value);
    if (isNaN(d.getTime())) return "";
    try {
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch (err) {
      return d.toDateString();
    }
  }

  function request(path, options) {
    if (!api) return Promise.resolve({ ok: false, status: 0, data: null });
    return api.request(path, options);
  }

  // A short, safe message for a failed request (never a fake success).
  function errorMessage(result, fallback) {
    if (!result || result.status === 0) return MSG_NETWORK;
    if (result.status === 401) return MSG_SESSION;
    if (result.data && typeof result.data.message === "string" && result.data.message) {
      if (result.data.code === "VALIDATION_ERROR" || result.status === 400) {
        var errors = fieldErrors(result);
        var keys = Object.keys(errors);
        if (keys.length) return errors[keys[0]];
      }
      return result.data.message;
    }
    return fallback || "Something went wrong. Please try again.";
  }

  // Backend validation errors [{ field, message }] -> { field: message }
  function fieldErrors(result) {
    var out = {};
    var list = result && result.data && Array.isArray(result.data.errors) ? result.data.errors : [];
    list.forEach(function (e) {
      if (e && e.field && !out[e.field]) out[e.field] = e.message;
    });
    return out;
  }

  function isLoggedInHere() {
    try {
      return window.localStorage.getItem("rabboraLoggedIn") === "1";
    } catch (err) {
      return false;
    }
  }

  // =============================================================
  // Addresses
  // =============================================================

  var ADDRESS_FIELDS = [
    { name: "fullName", label: "Full name", type: "text", autocomplete: "name", required: true, max: 200 },
    { name: "phone", label: "Phone number", type: "tel", autocomplete: "tel", required: true, max: 20 },
    { name: "addressLine1", label: "Address line 1", type: "text", autocomplete: "address-line1", required: true, max: 200 },
    { name: "addressLine2", label: "Address line 2 (optional)", type: "text", autocomplete: "address-line2", required: false, max: 200 },
    { name: "city", label: "Town / city", type: "text", autocomplete: "address-level2", required: true, max: 100 },
    { name: "county", label: "County (optional)", type: "text", autocomplete: "address-level1", required: false, max: 100 },
    { name: "postcode", label: "Postcode", type: "text", autocomplete: "postal-code", required: true, max: 10 },
    { name: "country", label: "Country", type: "text", autocomplete: "country-name", required: true, max: 100 }
  ];

  function fieldId(prefix, name) {
    return prefix + name.charAt(0).toUpperCase() + name.slice(1);
  }

  // The address fields (same on My Account and Checkout).
  function addressFieldsHtml(prefix, options) {
    var opts = options || {};
    var html = ADDRESS_FIELDS.map(function (f) {
      var id = fieldId(prefix, f.name);
      var wide = f.name === "addressLine1" || f.name === "addressLine2" || f.name === "fullName";
      return (
        '<div class="rb-field' + (wide ? " rb-field--wide" : "") + '" data-field="' + f.name + '">' +
          '<label class="rb-field__label" for="' + id + '">' + escapeHtml(f.label) + "</label>" +
          '<input class="rb-input" id="' + id + '" name="' + f.name + '" type="' + f.type + '"' +
            ' autocomplete="' + f.autocomplete + '" maxlength="' + f.max + '"' +
            (f.required ? ' required aria-required="true"' : "") +
            (f.name === "country" ? ' value="United Kingdom"' : "") +
            ' aria-invalid="false" aria-describedby="' + id + 'Error" />' +
          '<p class="rb-field__error" id="' + id + 'Error" role="alert" hidden></p>' +
        "</div>"
      );
    }).join("");
    if (opts.withDefault) {
      html +=
        '<label class="rb-check rb-field--wide">' +
          '<input type="checkbox" name="isDefault" id="' + fieldId(prefix, "isDefault") + '" />' +
          "<span>Make this my default address</span>" +
        "</label>";
    }
    return '<div class="rb-fields">' + html + "</div>";
  }

  function readAddressForm(form) {
    var data = {};
    ADDRESS_FIELDS.forEach(function (f) {
      var input = form.querySelector('[name="' + f.name + '"]');
      var value = input ? input.value.trim() : "";
      if (f.required) {
        data[f.name] = value;
      } else {
        // Empty optional field -> null, so an edit can also clear it.
        data[f.name] = value || null;
      }
    });
    var def = form.querySelector('[name="isDefault"]');
    if (def) data.isDefault = !!def.checked;
    return data;
  }

  function validateAddress(data) {
    var errors = {};
    ADDRESS_FIELDS.forEach(function (f) {
      if (f.required && !data[f.name]) errors[f.name] = "Please enter your " + f.label.replace(" (optional)", "").toLowerCase() + ".";
    });
    if (data.phone && !errors.phone) {
      var digits = data.phone.replace(/[^0-9]/g, "").length;
      if (!PHONE_ALLOWED.test(data.phone) || digits < 10 || digits > 15) errors.phone = "Please enter a valid phone number (10 to 15 digits).";
    }
    if (data.postcode && !errors.postcode && !UK_POSTCODE.test(data.postcode)) {
      errors.postcode = "Please enter a valid UK postcode.";
    }
    return errors;
  }

  function showFieldErrors(form, errors) {
    var first = null;
    var fields = form.querySelectorAll(".rb-field[data-field]");
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var name = field.getAttribute("data-field");
      var input = field.querySelector("input, textarea, select");
      var errEl = field.querySelector(".rb-field__error");
      var message = errors[name] || "";
      if (errEl) {
        errEl.textContent = message;
        errEl.hidden = !message;
      }
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
      if (message && !first) first = input;
    }
    if (first) first.focus();
    return !first;
  }

  function fillAddressForm(form, address) {
    ADDRESS_FIELDS.forEach(function (f) {
      var input = form.querySelector('[name="' + f.name + '"]');
      if (!input) return;
      var value = address && address[f.name] != null ? address[f.name] : "";
      if (f.name === "country" && !value) value = "United Kingdom";
      input.value = value;
    });
    var def = form.querySelector('[name="isDefault"]');
    if (def) def.checked = !!(address && address.isDefault);
    showFieldErrors(form, {});
  }

  function addressLines(address) {
    if (!address) return [];
    return [
      address.fullName,
      address.addressLine1,
      address.addressLine2,
      [address.city, address.county].filter(Boolean).join(", "),
      address.postcode,
      address.country,
      address.phone
    ].filter(function (line) { return line !== null && line !== undefined && String(line).trim() !== ""; });
  }

  function addressHtml(address) {
    return '<address class="rb-address">' + addressLines(address).map(escapeHtml).join("<br />") + "</address>";
  }

  function listAddresses() {
    return request("/users/me/addresses");
  }

  function createAddress(data) {
    return request("/users/me/addresses", { method: "POST", body: data });
  }

  function updateAddress(id, data) {
    return request("/users/me/addresses/" + encodeURIComponent(id), { method: "PATCH", body: data });
  }

  function deleteAddress(id) {
    return request("/users/me/addresses/" + encodeURIComponent(id), { method: "DELETE" });
  }

  // =============================================================
  // Orders (display only — every figure comes from the backend)
  // =============================================================

  var STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded"
  };
  var PAYMENT_LABELS = { unpaid: "Unpaid", paid: "Paid", refunded: "Refunded" };

  function statusLabel(status) {
    return STATUS_LABELS[status] || (status ? String(status) : "");
  }

  function paymentLabel(status) {
    return PAYMENT_LABELS[status] || (status ? String(status) : "");
  }

  // Same labels as cart.js buildVariantHtml().
  var OPTION_LABELS = { size: "Size", colour: "Colour", color: "Colour", fabric: "Fabric", diamantes: "Diamantes", buttons: "Buttons" };

  function optionsHtml(options) {
    if (!options || typeof options !== "object") return "";
    var parts = [];
    Object.keys(options).forEach(function (key) {
      var value = options[key];
      if (value === null || value === undefined || value === "" || typeof value === "object") return;
      var label = OPTION_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
      parts.push("<span>" + escapeHtml(label) + ": <strong>" + escapeHtml(value) + "</strong></span>");
    });
    return parts.length ? '<div class="rb-line__options">' + parts.join("") + "</div>" : "";
  }

  // One product line: image, name, options, quantity, unit price, line total.
  function lineHtml(line) {
    var image = line.image ? escapeHtml(line.image) : "images/img-2.png";
    return (
      '<div class="rb-line">' +
        '<img class="rb-line__image" src="' + image + '" alt="' + escapeHtml(line.alt || line.name) + '" width="88" height="88" loading="lazy" />' +
        '<div class="rb-line__body">' +
          '<p class="rb-line__name">' + escapeHtml(line.name) + "</p>" +
          optionsHtml(line.options) +
          '<p class="rb-line__meta">Qty ' + escapeHtml(line.quantity) + " &times; " + money(line.unitPrice) + "</p>" +
        "</div>" +
        '<p class="rb-line__total">' + money(line.lineTotal) + "</p>" +
      "</div>"
    );
  }

  function orderLineHtml(item) {
    return lineHtml({
      image: item.image,
      name: item.productName,
      alt: item.productName,
      options: item.options,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.totalPrice
    });
  }

  function totalsHtml(subtotal, shipping, total) {
    return (
      '<div class="rb-totals">' +
        '<div class="rb-totals__row"><span>Subtotal</span><span>' + money(subtotal) + "</span></div>" +
        '<div class="rb-totals__row"><span>Shipping</span><span>' + (Number(shipping) > 0 ? money(shipping) : "Free") + "</span></div>" +
        '<div class="rb-totals__row rb-totals__row--total"><span>Total</span><span>' + money(total) + "</span></div>" +
      "</div>"
    );
  }

  // Full order: number, date, status, payment, address, products, totals.
  function orderDetailHtml(order) {
    var items = Array.isArray(order.items) ? order.items : [];
    return (
      '<div class="rb-order">' +
        '<dl class="rb-order__facts">' +
          "<div><dt>Order number</dt><dd>" + escapeHtml(order.orderNumber) + "</dd></div>" +
          "<div><dt>Order date</dt><dd>" + escapeHtml(formatDate(order.createdAt)) + "</dd></div>" +
          '<div><dt>Order status</dt><dd><span class="rb-badge rb-badge--' + escapeHtml(order.status) + '">' + escapeHtml(statusLabel(order.status)) + "</span></dd></div>" +
          "<div><dt>Payment</dt><dd>" + escapeHtml(paymentLabel(order.paymentStatus)) + "</dd></div>" +
        "</dl>" +
        '<div class="rb-order__cols">' +
          '<div class="rb-order__items">' +
            '<h4 class="rb-order__subheading">Products</h4>' +
            items.map(orderLineHtml).join("") +
          "</div>" +
          '<div class="rb-order__side">' +
            '<h4 class="rb-order__subheading">Shipping address</h4>' +
            addressHtml(order.shippingAddress) +
            (order.notes ? '<h4 class="rb-order__subheading">Order notes</h4><p class="rb-order__notes">' + escapeHtml(order.notes) + "</p>" : "") +
            totalsHtml(order.subtotal, order.shipping, order.total) +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  window.RabboraCustomer = {
    escapeHtml: escapeHtml,
    money: money,
    formatDate: formatDate,
    request: request,
    errorMessage: errorMessage,
    fieldErrors: fieldErrors,
    isLoggedInHere: isLoggedInHere,
    addressFieldsHtml: addressFieldsHtml,
    readAddressForm: readAddressForm,
    validateAddress: validateAddress,
    showFieldErrors: showFieldErrors,
    fillAddressForm: fillAddressForm,
    addressLines: addressLines,
    addressHtml: addressHtml,
    listAddresses: listAddresses,
    createAddress: createAddress,
    updateAddress: updateAddress,
    deleteAddress: deleteAddress,
    statusLabel: statusLabel,
    paymentLabel: paymentLabel,
    optionsHtml: optionsHtml,
    lineHtml: lineHtml,
    orderLineHtml: orderLineHtml,
    totalsHtml: totalsHtml,
    orderDetailHtml: orderDetailHtml
  };
})(window);