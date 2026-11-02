/*!
 * Rabbora Living — checkout (checkout.html)
 * ---------------------------------------------------------------
 * Logged-in customers only. The backend is the source of truth for
 * everything that costs money:
 *   GET  /api/cart                  the basket (lines, unit prices, subtotal)
 *   GET  /api/users/me/addresses    saved addresses (via customer.js)
 *   POST /api/users/me/addresses    a new address typed here (via customer.js)
 *   POST /api/orders                { shippingAddressId, notes }
 *        -> the backend re-checks every price and stock, works out the
 *           totals, gives the order its number (e.g. RB261003-1001),
 *           saves it as "pending" / "unpaid" and empties the basket in
 *           ONE transaction. If anything fails, nothing changes.
 *
 * Payment (Stripe Payment Element, on this page, when the backend has keys):
 *   GET  /api/payments/stripe/config            is online payment on? + publishable key
 *   POST /api/payments/stripe/payment-intent    { orderId }
 *        -> the backend takes the amount from the SAVED order and returns a
 *           client secret. Stripe.js draws the card form on this page; card
 *           details go straight to Stripe, never to this page's code.
 *   "Pay now" -> stripe.confirmPayment(). The page then asks the backend
 *   (GET /api/payments/stripe/orders/ID/status), which checks the payment
 *   with Stripe itself. "Payment received" is shown ONLY when the backend
 *   says the order is paid. The basket is emptied only then.
 *   Stripe may send the customer back here after a bank check:
 *     ?payment=success&order=ID  -> the status check above
 * Without Stripe keys the page works exactly as before (order placed,
 * payment arranged by the team).
 *
 * Needs api-config.js, cart-data.js and customer.js loaded first.
 */
(function () {
  "use strict";

  var C = window.RabboraCustomer;
  if (!C) {
    console.error("[Rabbora Checkout] customer.js is not loaded on this page — add it before checkout.js.");
    return;
  }

  /**
   * Shipping shown before the order is placed. It MUST match the
   * backend setting SHIPPING_FLAT_GBP in backend/.env (currently 0 =
   * free Mainland UK delivery — the site's "Free UK delivery" offer).
   * The backend adds its own configured shipping to the real order; if
   * the two ever differ, the confirmation shows the backend figures and
   * a clear warning (nothing is hidden). The backend has no endpoint
   * that returns this setting yet — see the Step 7 report.
   */
  var SHIPPING_FLAT_GBP = 0;

  var els = {
    status: document.getElementById("checkoutStatus"),
    notice: document.getElementById("checkoutNotice"),
    login: document.getElementById("checkoutLogin"),
    empty: document.getElementById("checkoutEmpty"),
    emptyNote: document.getElementById("checkoutEmptyNote"),
    layout: document.getElementById("checkoutLayout"),
    lines: document.getElementById("checkoutLines"),
    localOnly: document.getElementById("checkoutLocalOnly"),
    addressList: document.getElementById("checkoutAddressList"),
    addAddressBtn: document.getElementById("checkoutAddAddressBtn"),
    addressForm: document.getElementById("checkoutAddressForm"),
    addressFields: document.getElementById("checkoutAddressFields"),
    addressCancel: document.getElementById("checkoutAddressCancel"),
    addressMessage: document.getElementById("checkoutAddressMessage"),
    shippingText: document.getElementById("checkoutShippingText"),
    notes: document.getElementById("checkoutNotes"),
    subtotal: document.getElementById("checkoutSubtotal"),
    shipping: document.getElementById("checkoutShipping"),
    total: document.getElementById("checkoutTotal"),
    summaryAddress: document.getElementById("checkoutSummaryAddress"),
    placeOrder: document.getElementById("checkoutPlaceOrder"),
    terms: document.getElementById("checkoutTerms"),
    email: document.getElementById("checkoutEmail"),
    placeMessage: document.getElementById("checkoutPlaceMessage"),
    confirmation: document.getElementById("checkoutConfirmation")
  };

  var state = {
    cart: null,          // last GET /api/cart answer (cart object)
    addresses: [],
    selectedAddressId: null,
    placing: false,
    payments: { enabled: false, mode: null, publishableKey: "" }, // GET /api/payments/stripe/config
    paying: false,       // true while a card payment is being confirmed (blocks a second submit)
    pay: null,           // the order being paid, plus its Stripe objects (see mountPaymentElement)
    lastOrder: null
  };

  function show(el, shown) {
    if (el) el.hidden = !shown;
  }

  function announce(message) {
    if (els.status) els.status.textContent = message || "";
  }

  function setNotice(message, kind) {
    if (!els.notice) return;
    els.notice.textContent = message || "";
    els.notice.hidden = !message;
    els.notice.className = "ck-notice" + (kind ? " ck-notice--" + kind : "");
  }

  function setMessage(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
    el.classList.toggle("is-error", !!isError);
  }

  function shippingAmount() {
    var n = Number(SHIPPING_FLAT_GBP);
    return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
  }

  // Pence maths so £ amounts never pick up floating-point errors.
  function addMoney(a, b) {
    return (Math.round(Number(a) * 100) + Math.round(Number(b) * 100)) / 100;
  }

  function sameMoney(a, b) {
    return Math.round(Number(a) * 100) === Math.round(Number(b) * 100);
  }

  // ---------------------------------------------------------------
  // Views
  // ---------------------------------------------------------------

  function showView(name) {
    show(els.login, name === "login");
    show(els.empty, name === "empty");
    show(els.layout, name === "checkout");
    show(els.confirmation, name === "confirmation");
  }

  function showLogin(message) {
    showView("login");
    setNotice(message || "", message ? "info" : "");
    announce("Please log in to check out.");
  }

  // Lines only this browser has (products the backend cannot take yet,
  // e.g. Blanket Boxes): never part of an online order, kept in the cart.
  function localOnlyLines() {
    if (!window.RabboraCart || typeof window.RabboraCart.getAll !== "function") return [];
    return window.RabboraCart.getAll().filter(function (line) { return !line.serverItemId; });
  }

  function renderLocalOnly() {
    var lines = localOnlyLines();
    if (!els.localOnly) return lines;
    if (!lines.length) {
      els.localOnly.hidden = true;
      els.localOnly.innerHTML = "";
      return lines;
    }
    els.localOnly.innerHTML =
      "<p><strong>Not included in this order:</strong> " +
      lines.map(function (l) { return C.escapeHtml(l.name); }).join(", ") +
      ". These items can&rsquo;t be ordered online yet, so they stay in your cart. Please contact us to order them.</p>";
    els.localOnly.hidden = false;
    return lines;
  }

  // Customer-facing labels for the options a basket line carries. Internal
  // keys (image paths, fabric slugs, raw prices) are not shown.
  var CHECKOUT_OPTION_LABELS = {
    size: "Size", width: "Width", dimensions: "Dimensions", firmness: "Firmness",
    fabric: "Fabric", diamantes: "Diamantes", buttons: "Buttons",
    ottomanStorage: "Storage base", footstoolBlanketBox: "Footstool or blanket box",
    headboardHeight: "Headboard", customRequest: "Custom request",
    assembly: "Assembly", deliveryDelay: "Delayed delivery"
  };
  var CHECKOUT_HIDDEN_OPTIONS = { fabricSlug: true, fabricImage: true, footstoolBlanketBoxType: true, assemblyPrice: true, deliveryDate: true, requiredDeliveryDate: true };

  function checkoutOptions(options) {
    var out = {};
    if (!options || typeof options !== "object") return out;
    Object.keys(options).forEach(function (key) {
      var value = options[key];
      if (CHECKOUT_HIDDEN_OPTIONS[key] || value === null || value === undefined || value === "" || typeof value === "object") return;
      var label = CHECKOUT_OPTION_LABELS[key] || key;
      var text = String(value);
      if (text === "yes") {
        text = "Yes";
        if (key === "assembly" && options.assemblyPrice) text += " (+" + C.money(options.assemblyPrice) + ")";
        if (key === "footstoolBlanketBox" && options.footstoolBlanketBoxType) text += " (" + String(options.footstoolBlanketBoxType) + ")";
        if (key === "deliveryDelay") {
          var date = options.deliveryDate || options.requiredDeliveryDate;
          if (date) text += " (from " + String(date) + ")";
        }
      } else if (text === "no") {
        text = "No";
      } else if (key === "headboardHeight") {
        text = text === "normal" ? "Standard height" : (text === "increase" ? "Increased height" : (text === "decrease" ? "Decreased height" : text));
      }
      out[label] = text;
    });
    return out;
  }

  function cartLineHtml(item) {
    var f = item.frontend_item || {};
    return C.lineHtml({
      image: f.image || item.image || (item.product && item.product.main_image) || "",
      name: item.name || f.name,
      alt: item.alt || item.name,
      options: checkoutOptions(item.options),
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total
    });
  }

  // Products / sizes switched off since they were added.
  function unavailableLines(cart) {
    return cart.items.filter(function (item) {
      return (item.product && item.product.is_active === false) || (item.variant && item.variant.is_active === false);
    });
  }

  function renderCart(cart) {
    state.cart = cart;
    if (els.lines) els.lines.innerHTML = cart.items.map(cartLineHtml).join("");

    var shipping = shippingAmount();
    var total = addMoney(cart.subtotal, shipping);
    if (els.subtotal) els.subtotal.textContent = C.money(cart.subtotal);
    if (els.shipping) els.shipping.textContent = shipping > 0 ? C.money(shipping) : "Free";
    if (els.total) els.total.textContent = C.money(total);
    if (els.shippingText) {
      els.shippingText.textContent = shipping > 0
        ? "Standard UK delivery: " + C.money(shipping) + "."
        : "Free Mainland UK delivery.";
    }

    var unavailable = unavailableLines(cart);
    if (unavailable.length) {
      setNotice(
        "Some items are no longer available: " +
        unavailable.map(function (i) { return i.name; }).join(", ") +
        ". Please remove them from your cart before placing your order.",
        "error"
      );
    }
    renderLocalOnly();
    updatePlaceButton();
  }

  function cartSignature(cart) {
    return cart.items.map(function (i) {
      return i.id + ":" + i.quantity + ":" + Math.round(Number(i.unit_price) * 100);
    }).join("|") + "=" + Math.round(Number(cart.subtotal) * 100);
  }

  // ---------------------------------------------------------------
  // Addresses
  // ---------------------------------------------------------------

  function selectedAddress() {
    var id = state.selectedAddressId;
    return state.addresses.filter(function (a) { return a.id === id; })[0] || null;
  }

  function renderSummaryAddress() {
    if (!els.summaryAddress) return;
    var address = selectedAddress();
    els.summaryAddress.innerHTML = address
      ? '<p class="ck-summary__label">Shipping to</p>' + C.addressHtml(address)
      : '<p class="ck-summary__label">Shipping to</p><p class="ck-summary__none">Please choose a shipping address.</p>';
  }

  function renderAddresses() {
    if (!els.addressList) return;
    if (!state.addresses.length) {
      els.addressList.innerHTML = '<p class="ck-muted">You don&rsquo;t have a saved address yet. Please add one below.</p>';
    } else {
      els.addressList.innerHTML = state.addresses.map(function (a) {
        var checked = a.id === state.selectedAddressId;
        return (
          '<label class="ck-address' + (checked ? " is-selected" : "") + '">' +
            '<input type="radio" name="checkoutAddress" value="' + a.id + '"' + (checked ? " checked" : "") + " />" +
            '<span class="ck-address__body">' +
              (a.isDefault ? '<span class="rb-badge rb-badge--default">Default</span>' : "") +
              C.addressHtml(a) +
            "</span>" +
          "</label>"
        );
      }).join("");
    }
    renderSummaryAddress();
    updatePlaceButton();
  }

  function loadAddresses(selectId) {
    return C.listAddresses().then(function (result) {
      if (result.status === 401) return showLogin(C.errorMessage(result));
      if (!result.ok || !result.data || !Array.isArray(result.data.addresses)) {
        state.addresses = [];
        renderAddresses();
        setMessage(els.addressMessage, C.errorMessage(result, "We couldn't load your saved addresses."), true);
        return;
      }
      state.addresses = result.data.addresses;
      var keep = selectId || state.selectedAddressId;
      var stillThere = state.addresses.some(function (a) { return a.id === keep; });
      if (!stillThere) {
        var def = state.addresses.filter(function (a) { return a.isDefault; })[0] || state.addresses[0];
        keep = def ? def.id : null;
      }
      state.selectedAddressId = keep;
      renderAddresses();
      if (!state.addresses.length) openAddressForm();
    });
  }

  function escapeAttr(value) {
    return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function nameFieldHtml(id, label, autocomplete, field, value) {
    return '<div class="rb-field rb-field--half" data-field="' + field + '">' +
      '<label class="rb-field__label" for="' + id + '">' + label + "</label>" +
      '<input class="rb-input" id="' + id + '" type="text" autocomplete="' + autocomplete + '" maxlength="100"' +
      ' value="' + escapeAttr(value) + '" required aria-required="true" aria-invalid="false" aria-describedby="' + id + 'Error" />' +
      '<p class="rb-field__error" id="' + id + 'Error" role="alert" hidden></p>' +
      "</div>";
  }

  // Shows First name and Last name in place of the single "Full name" field.
  // The address is still saved with one fullName, exactly as before.
  function splitNameFields() {
    var form = els.addressForm;
    if (!form) return;
    var wrap = form.querySelector('[data-field="fullName"]');
    if (!wrap || wrap.getAttribute("data-split") === "1") return;
    var full = wrap.querySelector('input[name="fullName"]');
    if (!full) return;
    var parts = full.value.trim().split(/\s+/);
    var first = parts.shift() || "";
    var last = parts.join(" ");
    wrap.setAttribute("data-split", "1");
    wrap.hidden = true;
    full.tabIndex = -1;
    var holder = document.createElement("div");
    holder.className = "ck-name-split";
    holder.innerHTML = nameFieldHtml("ckFirstName", "First name", "given-name", "firstName", first) +
      nameFieldHtml("ckLastName", "Last name", "family-name", "lastName", last);
    wrap.parentNode.insertBefore(holder, wrap);
    var firstInput = holder.querySelector("#ckFirstName");
    var lastInput = holder.querySelector("#ckLastName");
    var sync = function () { full.value = (firstInput.value.trim() + " " + lastInput.value.trim()).trim(); };
    [firstInput, lastInput].forEach(function (input) {
      input.addEventListener("input", function () {
        sync();
        input.setAttribute("aria-invalid", "false");
        var err = document.getElementById(input.id + "Error");
        if (err) { err.hidden = true; err.textContent = ""; }
      });
    });
    form._ckSyncName = sync;
    sync();
  }

  // Runs before customer.js's submit handler: a missing first or last name
  // is shown under its own field and the form is not sent.
  function checkNameBeforeSubmit(event) {
    var form = els.addressForm;
    if (!form || !form._ckSyncName) return;
    form._ckSyncName();
    var firstInput = document.getElementById("ckFirstName");
    var lastInput = document.getElementById("ckLastName");
    if (!firstInput || !lastInput) return;
    var missing = !firstInput.value.trim() ? firstInput : (!lastInput.value.trim() ? lastInput : null);
    if (!missing) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var err = document.getElementById(missing.id + "Error");
    missing.setAttribute("aria-invalid", "true");
    if (err) {
      err.textContent = missing === firstInput ? "Please enter your first name." : "Please enter your last name.";
      err.hidden = false;
    }
    missing.focus();
  }

  function openAddressForm() {
    if (!els.addressForm) return;
    C.fillAddressForm(els.addressForm, null);
    splitNameFields();
    els.addressForm.hidden = false;
    if (els.addAddressBtn) els.addAddressBtn.hidden = true;
  }

  function closeAddressForm() {
    if (!els.addressForm) return;
    els.addressForm.hidden = true;
    if (els.addAddressBtn) els.addAddressBtn.hidden = false;
  }

  function initAddresses() {
    if (els.addressFields) els.addressFields.innerHTML = C.addressFieldsHtml("checkoutAddress", { withDefault: true });

    if (els.addressList) {
      els.addressList.addEventListener("change", function (event) {
        if (event.target && event.target.name === "checkoutAddress") {
          state.selectedAddressId = Number(event.target.value);
          renderAddresses();
        }
      });
    }
    if (els.addAddressBtn) {
      els.addAddressBtn.addEventListener("click", function () {
        openAddressForm();
        var first = els.addressForm.querySelector("input");
        if (first) first.focus();
      });
    }
    if (els.addressCancel) {
      els.addressCancel.addEventListener("click", closeAddressForm);
    }
    if (els.addressForm) {
      els.addressForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = C.readAddressForm(els.addressForm);
        if (!C.showFieldErrors(els.addressForm, C.validateAddress(data))) return;
        var button = els.addressForm.querySelector('[type="submit"]');
        button.disabled = true;
        setMessage(els.addressMessage, "Saving your address…");
        // Saved to the account address book (the only address storage).
        C.createAddress(data).then(function (result) {
          button.disabled = false;
          if (result.ok && result.data && result.data.address) {
            closeAddressForm();
            setMessage(els.addressMessage, "Address saved and selected for this order.");
            return loadAddresses(result.data.address.id);
          }
          if (result.status === 401) return showLogin(C.errorMessage(result));
          C.showFieldErrors(els.addressForm, C.fieldErrors(result));
          setMessage(els.addressMessage, C.errorMessage(result, "We couldn't save this address."), true);
        });
      });
    }
  }

  // ---------------------------------------------------------------
  // Basket
  // ---------------------------------------------------------------

  function fetchCart() {
    return C.request("/cart").then(function (result) {
      if (result.ok && result.data && result.data.cart) return { cart: result.data.cart };
      return { error: result };
    });
  }

  function showEmpty() {
    showView("empty");
    var local = localOnlyLines();
    if (els.emptyNote) {
      els.emptyNote.hidden = !local.length;
      els.emptyNote.textContent = local.length
        ? "Your cart only has items that can’t be ordered online yet (" +
          local.map(function (l) { return l.name; }).join(", ") + "). Please contact us to order them."
        : "";
    }
    announce("Your cart is empty.");
  }

  // Contact section: the email the order confirmation goes to (from the account).
  function loadAccountEmail() {
    C.request("/auth/me").then(function (result) {
      var user = result && result.ok && result.data ? result.data.user : null;
      if (user && user.email && els.email) els.email.textContent = user.email;
    }).catch(function () { return null; });
  }

  function loadCheckout() {
    announce("Loading your basket…");
    // Let cart-data.js finish sending this browser's cart to the account
    // first (e.g. items added as a guest just before logging in).
    var sync = window.RabboraCart && typeof window.RabboraCart.syncWithServer === "function"
      ? window.RabboraCart.syncWithServer()
      : Promise.resolve();

    return Promise.resolve(sync).catch(function () { return null; }).then(fetchCart).then(function (r) {
      if (r.error) {
        if (r.error.status === 401) return showLogin();
        showView("none");
        setNotice(C.errorMessage(r.error, "We couldn't load your basket."), "error");
        announce("");
        return;
      }
      // Only show "empty" when the basket really is empty. Items that the
      // backend cannot order yet (not in its product list) are still in
      // this browser's cart, which is what the header count shows, so the
      // basket is shown with them listed as "Not included in this order".
      // Place order stays disabled until there is an orderable line.
      if (!r.cart.items.length && !localOnlyLines().length) return showEmpty();
      showView("checkout");
      renderCart(r.cart);
      announce("");
      loadAccountEmail();
      return loadAddresses();
    });
  }

  // ---------------------------------------------------------------
  // Place order
  // ---------------------------------------------------------------

  function updatePlaceButton() {
    if (!els.placeOrder) return;
    var ready = !state.placing && !!state.cart && state.cart.items.length > 0 &&
      !!selectedAddress() && unavailableLines(state.cart).length === 0 &&
      !!(els.terms && els.terms.checked);
    els.placeOrder.disabled = !ready;
    els.placeOrder.setAttribute("aria-disabled", String(!ready));
  }

  function setPlacing(placing) {
    state.placing = placing;
    if (els.placeOrder) {
      els.placeOrder.setAttribute("aria-busy", placing ? "true" : "false");
      els.placeOrder.textContent = placing ? "Placing your order…" : (state.payments.enabled ? "Pay now" : "Place order");
    }
    updatePlaceButton();
  }

  function placeOrder() {
    if (state.placing || !state.cart) return;
    var address = selectedAddress();
    if (!address) {
      setMessage(els.placeMessage, "Please choose a shipping address.", true);
      return;
    }
    var shownCart = state.cart;
    var shownShipping = shippingAmount();
    var shownTotal = addMoney(shownCart.subtotal, shownShipping);
    var notes = els.notes ? els.notes.value.trim() : "";

    setPlacing(true);
    setMessage(els.placeMessage, "");
    setNotice("");

    // 1. Confirm the basket again (never order from an old copy).
    fetchCart().then(function (r) {
      if (r.error) {
        setPlacing(false);
        if (r.error.status === 401) return showLogin(C.errorMessage(r.error));
        setMessage(els.placeMessage, C.errorMessage(r.error, "We couldn't check your basket. Your order has not been placed."), true);
        return;
      }
      if (!r.cart.items.length) {
        setPlacing(false);
        return showEmpty();
      }
      if (cartSignature(r.cart) !== cartSignature(shownCart)) {
        setPlacing(false);
        renderCart(r.cart);
        setNotice("Your basket has changed. Please check the updated order below and press Place order again.", "info");
        return;
      }

      // 2. Place the order. The backend works out every total.
      var body = { shippingAddressId: address.id };
      if (notes) body.notes = notes;
      return C.request("/orders", { method: "POST", body: body }).then(function (result) {
        if (result.ok && result.data && result.data.order) {
          return orderPlaced(result.data.order, { subtotal: shownCart.subtotal, shipping: shownShipping, total: shownTotal });
        }
        setPlacing(false);
        if (result.status === 401) return showLogin(C.errorMessage(result));
        // One order may wait for payment at a time: take the customer to it.
        if (result.status === 409 && result.data && result.data.code === "ORDER_AWAITING_PAYMENT") {
          return resumeWaitingOrder();
        }
        // Nothing was saved and the basket is unchanged (the backend
        // rolls everything back), e.g. a price change or no stock left.
        setMessage(els.placeMessage, C.errorMessage(result, "We couldn't place your order.") + " Your order has not been placed and your cart is unchanged.", true);
        return fetchCart().then(function (again) {
          if (again.cart && again.cart.items.length) renderCart(again.cart);
        });
      });
    });
  }

  function orderPlaced(order, shown) {
    // The backend has already emptied the account basket in the same
    // transaction. Bring this browser's cart copy in line with it
    // (items that can't be ordered online stay in the cart).
    var sync = window.RabboraCart && typeof window.RabboraCart.syncWithServer === "function"
      ? window.RabboraCart.syncWithServer()
      : Promise.resolve();

    var mismatch = !sameMoney(order.subtotal, shown.subtotal) ||
      !sameMoney(order.shipping, shown.shipping) ||
      !sameMoney(order.total, shown.total);
    if (mismatch) {
      console.error(
        "[Rabbora Checkout] The order total from the backend differs from the checkout page. " +
        "Page: subtotal " + shown.subtotal + ", shipping " + shown.shipping + ", total " + shown.total +
        " | Backend order " + order.orderNumber + ": subtotal " + order.subtotal + ", shipping " + order.shipping +
        ", total " + order.total + ". Check SHIPPING_FLAT_GBP in checkout.js against backend/.env."
      );
    }

    return Promise.resolve(sync).catch(function () { return null; }).then(function () {
      if (state.payments.enabled) return startPayment(order);
      renderConfirmation(order, mismatch ? shown : null);
    });
  }

  // ---------------------------------------------------------------
  // Payment (Stripe Payment Element, on this page)
  // ---------------------------------------------------------------

  var STRIPE_JS_URL = "https://js.stripe.com/v3";
  var stripeJsLoading = null;

  // Tells the customer what happens next when online payment is on.
  function updatePaymentNote() {
    var note = document.getElementById("checkoutPaymentNote");
    if (note) note.textContent = "Your card details are entered in a secure payment form on this page, after you place your order. No payment is taken until you confirm it.";
  }

  function loadPaymentConfig() {
    return C.request("/payments/stripe/config").then(function (result) {
      if (result.ok && result.data) {
        var key = typeof result.data.publishableKey === "string" ? result.data.publishableKey : "";
        state.payments = {
          enabled: !!result.data.enabled && /^pk_/.test(key),
          mode: result.data.mode || null,
          publishableKey: key
        };
        if (state.payments.enabled) updatePaymentNote();
      }
    }).catch(function () { return null; });
  }

  // Loads Stripe.js (once) from Stripe's own address.
  function loadStripeJs() {
    if (window.Stripe) return Promise.resolve(window.Stripe);
    if (!stripeJsLoading) {
      stripeJsLoading = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = STRIPE_JS_URL;
        script.async = true;
        script.onload = function () {
          if (window.Stripe) return resolve(window.Stripe);
          stripeJsLoading = null;
          reject(new Error("The secure payment form did not start. Please refresh the page and try again."));
        };
        script.onerror = function () {
          stripeJsLoading = null;
          if (script.parentNode) script.parentNode.removeChild(script);
          reject(new Error("The secure payment form could not be loaded. Please check your connection, turn off any content blocker for this page, and try again."));
        };
        document.head.appendChild(script);
      });
    }
    return stripeJsLoading;
  }

  // Where Stripe sends the customer if a bank check needs a separate page.
  function returnUrl(orderId) {
    return window.location.origin + window.location.pathname +
      "?payment=success&order=" + encodeURIComponent(orderId);
  }

  function payButton() { return document.getElementById("ckPayButton"); }

  function payError(message) {
    var el = document.getElementById("ckPayError");
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
  }

  // One button, three jobs: loading (disabled), pay, or retry after a load error.
  function updatePayButton() {
    var btn = payButton();
    var pay = state.pay;
    if (!btn || !pay) return;
    if (state.paying) {
      btn.disabled = true;
      btn.textContent = "Processing payment…";
    } else if (pay.loadError) {
      btn.disabled = false;
      btn.textContent = "Try again";
    } else if (!pay.ready) {
      btn.disabled = true;
      btn.textContent = "Loading secure payment form…";
    } else {
      btn.disabled = false;
      btn.textContent = "Pay " + C.money(pay.order.total) + " now";
    }
    btn.setAttribute("aria-busy", state.paying ? "true" : "false");
  }

  function onPaySubmit(event) {
    event.preventDefault();
    var pay = state.pay;
    if (!pay || state.paying) return; // a second press while paying does nothing
    if (pay.loadError) { mountPaymentElement(pay.order); return; }
    if (!pay.ready) return;
    confirmPayment(pay);
  }

  // Asks the backend for a PaymentIntent for this saved order (the backend
  // works out the amount), then draws Stripe's Payment Element into the page.
  function mountPaymentElement(order) {
    var pay = { order: order, stripe: null, elements: null, ready: false, loadError: false };
    state.pay = pay;
    payError("");
    updatePayButton();
    var mount = document.getElementById("ckPaymentMount");
    if (!mount) return Promise.resolve();
    mount.innerHTML = "";

    return C.request("/payments/stripe/payment-intent", { method: "POST", body: { orderId: order.id } })
      .then(function (result) {
        if (state.pay !== pay) return;
        if (result.status === 401) return showLogin(C.errorMessage(result));
        if (result.status === 409 && result.data && result.data.code === "ALREADY_PAID") {
          return refreshAndRender(order.id, null, false);
        }
        if (!(result.ok && result.data && typeof result.data.clientSecret === "string")) {
          throw new Error(C.errorMessage(result, "We couldn't set up the secure payment form. Please try again."));
        }
        var clientSecret = result.data.clientSecret;
        return loadStripeJs().then(function (StripeFn) {
          if (state.pay !== pay) return;
          pay.stripe = StripeFn(state.payments.publishableKey);
          pay.elements = pay.stripe.elements({ clientSecret: clientSecret });
          var element = pay.elements.create("payment", { layout: "tabs" });
          element.on("ready", function () {
            if (state.pay !== pay) return;
            pay.ready = true;
            updatePayButton();
          });
          element.on("loaderror", function (event) {
            if (state.pay !== pay) return;
            pay.loadError = true;
            payError((event && event.error && event.error.message) || "The card form could not be loaded. Please try again.");
            updatePayButton();
          });
          element.mount(mount);
        });
      })
      .catch(function (error) {
        if (state.pay !== pay) return;
        pay.loadError = true;
        mount.innerHTML = "";
        payError((error && error.message) || "We couldn't set up the secure payment form. Please try again.");
        updatePayButton();
      });
  }

  // Sends the card details to Stripe. Success is NOT taken from this browser:
  // the status check below asks the backend, which checks Stripe itself.
  function confirmPayment(pay) {
    if (state.paying) return;
    state.paying = true;
    payError("");
    updatePayButton();
    announce("Processing your payment…");
    pay.stripe.confirmPayment({
      elements: pay.elements,
      confirmParams: { return_url: returnUrl(pay.order.id) },
      redirect: "if_required"
    }).then(function (result) {
      if (result.error) {
        state.paying = false;
        payError(result.error.message || "Your payment could not be completed. Please check your card details and try again.");
        updatePayButton();
        announce("Your payment was not completed.");
        return;
      }
      return refreshAndRender(pay.order.id, null, false).then(function () { state.paying = false; });
    }).catch(function () {
      state.paying = false;
      payError("We couldn't confirm your payment with our payment provider. If you have not been charged, please try again. If you think you have paid, do not pay again: check My Account or contact us.");
      updatePayButton();
    });
  }

  // The payment panel: the Payment Element and the Pay button, in place of
  // the confirmation text, for an order that is saved but not yet paid.
  function renderPayPanel(order, message, kind) {
    showConfirmationHtml(
      paymentHead("Secure payment", "Pay for your order",
        "Order number <strong>" + C.escapeHtml(order.orderNumber) + "</strong>. Enter your card details below. " +
        "Your order is paid only once your payment is confirmed.") +
      (message ? '<p class="ck-notice ck-notice--' + (kind === "error" ? "error" : "info") + '" role="status">' + C.escapeHtml(message) + "</p>" : "") +
      '<form id="ckPayForm" class="ck-pay-form" novalidate>' +
        '<div class="ck-payment-element ck-payment-element--live" id="ckPaymentMount"></div>' +
        '<p class="ck-pay-error" id="ckPayError" role="alert" hidden></p>' +
        '<button type="submit" class="btn btn--forest ck-place-btn" id="ckPayButton" disabled>Loading secure payment form&hellip;</button>' +
      "</form>" +
      '<p class="ck-pay-secure">Your card details go directly to Stripe and are not stored on Rabbora&rsquo;s server.</p>' +
      (order.items ? C.orderDetailHtml(order) : "") +
      '<div class="ck-confirmation__actions">' +
        '<a href="account.html#orders" class="btn btn--outline-forest">View my orders</a>' +
      "</div>",
      "Pay for order " + order.orderNumber + "."
    );
    var form = document.getElementById("ckPayForm");
    if (form) form.addEventListener("submit", onPaySubmit);
  }

  // Shows the payment panel for an order that is saved but not paid.
  function startPayment(order, message, kind) {
    if (state.paying) return Promise.resolve();
    if (!state.payments.enabled) {
      renderPaymentNotice(order, "Online payment is not available right now. Your order is saved and unpaid. Please contact us to pay.", "error", false);
      return Promise.resolve();
    }
    state.lastOrder = order;
    renderPayPanel(order, message || "", kind || "info");
    return mountPaymentElement(order);
  }

  // The backend keeps one order waiting for payment at a time. If the
  // customer places another, take them to that order's payment instead.
  function resumeWaitingOrder() {
    return C.request("/orders").then(function (result) {
      var waiting = result.ok && result.data && Array.isArray(result.data.orders)
        ? result.data.orders.filter(function (o) { return o.paymentStatus === "unpaid" && o.status === "pending"; })[0]
        : null;
      if (!waiting) {
        setMessage(els.placeMessage, "You have an order waiting for payment, but we couldn't load it. Please check My Account, or contact us.", true);
        return;
      }
      return startPayment(waiting, "You already have an order waiting for payment. Please pay for it below.", "info");
    });
  }

  function paymentHead(eyebrow, heading, text) {
    return '<div class="ck-confirmation__head">' +
      '<p class="eyebrow">' + eyebrow + "</p>" +
      '<h2 class="ck-confirmation__heading" tabindex="-1">' + heading + "</h2>" +
      (text ? "<p>" + text + "</p>" : "") +
    "</div>";
  }

  function showConfirmationHtml(html, announceText) {
    els.confirmation.innerHTML = html;
    showView("confirmation");
    setNotice("");
    announce(announceText);
    var heading = els.confirmation.querySelector(".ck-confirmation__heading");
    if (heading) heading.focus();
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
  }

  // Order saved, not paid (payment cancelled, failed or not started).
  function renderPaymentNotice(order, message, kind, canPay) {
    if (!els.confirmation) return;
    var payable = canPay && state.payments.enabled && order.paymentStatus === "unpaid" &&
      ["cancelled", "refunded"].indexOf(order.status) === -1;
    showConfirmationHtml(
      paymentHead(kind === "info" ? "Secure payment" : "Payment not completed",
        kind === "info" ? "Just a moment&hellip;" : "Your order has not been paid",
        "Order number <strong>" + C.escapeHtml(order.orderNumber) + "</strong>.") +
      '<p class="ck-notice ck-notice--' + (kind === "error" ? "error" : "info") + '" role="status">' + C.escapeHtml(message) + "</p>" +
      (order.items ? C.orderDetailHtml(order) : "") +
      '<div class="ck-confirmation__actions">' +
        (payable ? '<button type="button" class="btn btn--forest" data-pay-now="' + order.id + '">Pay now</button>' : "") +
        '<a href="account.html#orders" class="btn btn--outline-forest">View my orders</a>' +
      "</div>",
      message
    );
    state.lastOrder = order;
  }

  function renderPaid(order) {
    showConfirmationHtml(
      paymentHead("Payment received", "Thank you &mdash; your order is paid.",
        "Your order number is <strong>" + C.escapeHtml(order.orderNumber) + "</strong>. " +
        "We have received your payment of <strong>" + C.money(order.total) + "</strong>.") +
      C.orderDetailHtml(order) +
      '<div class="ck-next-steps">' +
        "<h3>What happens next</h3>" +
        "<ol>" +
          "<li>We prepare your order and confirm a delivery date with you.</li>" +
          "<li>You can follow your order status at any time in My Account &rarr; Orders.</li>" +
          "<li>Questions? Contact us and quote your order number.</li>" +
        "</ol>" +
      "</div>" +
      '<div class="ck-confirmation__actions">' +
        '<a href="account.html#orders" class="btn btn--forest">View my orders</a>' +
        '<a href="index.html" class="btn btn--outline-forest">Continue shopping</a>' +
      "</div>",
      "Payment received for order " + order.orderNumber + "."
    );
  }

  // Back from Stripe, but the backend has not confirmed the payment (yet).
  function renderConfirming(order) {
    showConfirmationHtml(
      paymentHead("Checking your payment", "We&rsquo;re confirming your payment",
        "Order number <strong>" + C.escapeHtml(order.orderNumber) + "</strong>. Stripe has not confirmed this payment to us yet. " +
        "This usually takes a few seconds. <strong>Please don&rsquo;t pay again.</strong>") +
      C.orderDetailHtml(order) +
      '<div class="ck-confirmation__actions">' +
        '<button type="button" class="btn btn--forest" data-pay-refresh="' + order.id + '">Check again</button>' +
        '<a href="account.html#orders" class="btn btn--outline-forest">View my orders</a>' +
      "</div>",
      "We are confirming your payment."
    );
  }

  function fetchStatus(orderId, sessionId) {
    var q = sessionId ? "?session_id=" + encodeURIComponent(sessionId) : "";
    return C.request("/payments/stripe/orders/" + encodeURIComponent(orderId) + "/status" + q);
  }

  // Asks the backend (a few times, the webhook can be a little late).
  function refreshAndRender(orderId, sessionId, cancelled) {
    var tries = cancelled ? 1 : 6;
    function attempt(left) {
      return fetchStatus(orderId, sessionId).then(function (result) {
        if (result.status === 401) return showLogin("Please log in to see your order.");
        if (!(result.ok && result.data && result.data.order)) {
          showView("none");
          setNotice(C.errorMessage(result, "We couldn't load this order.") + " If you have paid, please don't pay again — check My Account or contact us.", "error");
          return;
        }
        var order = result.data.order;
        if (order.paymentStatus === "paid") return renderPaid(order);
        if (cancelled) return renderPaymentNotice(order, "Payment was cancelled. Your order has not been paid.", "error", true);
        if (left > 1) return new Promise(function (res) { setTimeout(res, 2000); }).then(function () { return attempt(left - 1); });
        return renderConfirming(order);
      });
    }
    announce(cancelled ? "Loading your order…" : "Checking your payment…");
    return attempt(tries);
  }

  function handleReturn(params) {
    var orderId = params.get("order");
    var sessionId = params.get("session_id");
    var outcome = params.get("payment");
    if (!/^\d+$/.test(orderId || "")) return loadCheckout();
    // Keep the address bar clean (the session id is not needed again).
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + "?payment=" + encodeURIComponent(outcome) + "&order=" + orderId);
    }
    showView("none");
    // A refreshed return page has no session id any more: the backend
    // still knows the answer from the webhook.
    return refreshAndRender(orderId, outcome === "success" ? sessionId : null, outcome !== "success");
  }

  function renderConfirmation(order, shownWhenDifferent) {
    if (!els.confirmation) return;
    var warning = shownWhenDifferent
      ? '<p class="ck-notice ck-notice--error">Please note: the checkout page showed a total of ' +
        C.money(shownWhenDifferent.total) + " (shipping " +
        (shownWhenDifferent.shipping > 0 ? C.money(shownWhenDifferent.shipping) : "Free") +
        "), but your order was saved with a total of " + C.money(order.total) + " (shipping " +
        (order.shipping > 0 ? C.money(order.shipping) : "Free") + "). The order total below is the correct one. " +
        "Please contact us if you have any questions.</p>"
      : "";
    els.confirmation.innerHTML =
      '<div class="ck-confirmation__head">' +
        '<p class="eyebrow">Order confirmed</p>' +
        '<h2 class="ck-confirmation__heading" tabindex="-1">Thank you &mdash; your order has been placed.</h2>' +
        "<p>Your order number is <strong>" + C.escapeHtml(order.orderNumber) + "</strong>. " +
        "A copy is saved in My Account. No payment has been taken &mdash; our team will contact you about payment.</p>" +
      "</div>" +
      warning +
      C.orderDetailHtml(order) +
      '<div class="ck-confirmation__actions">' +
        '<a href="account.html#orders" class="btn btn--forest">View my orders</a>' +
        '<a href="index.html" class="btn btn--outline-forest">Continue shopping</a>' +
      "</div>";
    showView("confirmation");
    setNotice("");
    announce("Your order " + order.orderNumber + " has been placed.");
    var heading = els.confirmation.querySelector(".ck-confirmation__heading");
    if (heading) heading.focus();
    if (typeof window.scrollTo === "function") window.scrollTo(0, 0);
  }

  function init() {
    showView("none");
    initAddresses();
    if (els.placeOrder) els.placeOrder.addEventListener("click", placeOrder);
    if (els.terms) els.terms.addEventListener("change", updatePlaceButton);
    if (els.addressForm) els.addressForm.addEventListener("submit", checkNameBeforeSubmit, true);
    if (els.confirmation) {
      els.confirmation.addEventListener("click", function (event) {
        var pay = event.target.closest("[data-pay-now]");
        var again = event.target.closest("[data-pay-refresh]");
        if (pay && state.lastOrder) {
          pay.disabled = true;
          startPayment(state.lastOrder);
        } else if (again) {
          again.disabled = true;
          refreshAndRender(again.getAttribute("data-pay-refresh"), null, false);
        }
      });
    }
    var params = new URLSearchParams(window.location.search);
    loadPaymentConfig().then(function () {
      if (state.payments.enabled && els.placeOrder && !state.placing) els.placeOrder.textContent = "Pay now";
      // The card-form note in the basket column only applies when online payment is on.
      var cardNote = document.getElementById("checkoutPaymentElement");
      if (cardNote && !state.payments.enabled) cardNote.hidden = true;
      if (params.get("payment") === "success" || params.get("payment") === "cancelled") return handleReturn(params);
      return loadCheckout();
    });
  }

  init();
})();