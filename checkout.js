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
 * Payment (Stripe Checkout, when the backend has Stripe keys):
 *   GET  /api/payments/stripe/config            is online payment on?
 *   POST /api/payments/stripe/checkout-session  { orderId, returnPath }
 *        -> the backend takes the amount from the SAVED order and answers
 *           with a Stripe address; this page only redirects there.
 *   Stripe sends the customer back to this page:
 *     ?payment=success&order=ID&session_id=…  -> GET /api/payments/stripe/orders/ID/status
 *        The backend checks the session with Stripe itself. "Payment
 *        received" is shown ONLY when the backend says the order is paid.
 *     ?payment=cancelled&order=ID              -> the order stays unpaid and
 *        can be paid again with "Pay now" (no second order is created).
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
    placeMessage: document.getElementById("checkoutPlaceMessage"),
    confirmation: document.getElementById("checkoutConfirmation")
  };

  var state = {
    cart: null,          // last GET /api/cart answer (cart object)
    addresses: [],
    selectedAddressId: null,
    placing: false,
    payments: { enabled: false, mode: null }, // GET /api/payments/stripe/config
    paying: false
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

  function cartLineHtml(item) {
    var f = item.frontend_item || {};
    return C.lineHtml({
      image: f.image || item.image || (item.product && item.product.main_image) || "",
      name: item.name || f.name,
      alt: item.alt || item.name,
      options: item.options,
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

  function openAddressForm() {
    if (!els.addressForm) return;
    C.fillAddressForm(els.addressForm, null);
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
      if (!r.cart.items.length) return showEmpty();
      showView("checkout");
      renderCart(r.cart);
      announce("");
      return loadAddresses();
    });
  }

  // ---------------------------------------------------------------
  // Place order
  // ---------------------------------------------------------------

  function updatePlaceButton() {
    if (!els.placeOrder) return;
    var ready = !state.placing && !!state.cart && state.cart.items.length > 0 &&
      !!selectedAddress() && unavailableLines(state.cart).length === 0;
    els.placeOrder.disabled = !ready;
    els.placeOrder.setAttribute("aria-disabled", String(!ready));
  }

  function setPlacing(placing) {
    state.placing = placing;
    if (els.placeOrder) {
      els.placeOrder.setAttribute("aria-busy", placing ? "true" : "false");
      els.placeOrder.textContent = placing ? "Placing your order…" : (state.payments.enabled ? "Place order and pay" : "Place order");
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
  // Payment (Stripe Checkout)
  // ---------------------------------------------------------------

  function loadPaymentConfig() {
    return C.request("/payments/stripe/config").then(function (result) {
      if (result.ok && result.data) {
        state.payments = { enabled: !!result.data.enabled, mode: result.data.mode || null };
      }
    }).catch(function () { return null; });
  }

  // Asks the backend for a Stripe Checkout address for this (already
  // saved, unpaid) order and goes there. The backend works out the amount.
  function startPayment(order) {
    if (state.paying) return Promise.resolve();
    state.paying = true;
    announce("Taking you to our secure payment page…");
    renderPaymentNotice(order, "Your order " + order.orderNumber + " is saved. Taking you to our secure payment page…", "info", false);
    return C.request("/payments/stripe/checkout-session", {
      method: "POST",
      body: { orderId: order.id, returnPath: window.location.pathname }
    }).then(function (result) {
      if (result.ok && result.data && typeof result.data.url === "string" && /^https:\/\//.test(result.data.url)) {
        window.location.assign(result.data.url);
        return;
      }
      state.paying = false;
      if (result.status === 401) return showLogin(C.errorMessage(result));
      if (result.status === 409 && result.data && result.data.code === "ALREADY_PAID") {
        return refreshAndRender(order.id, null, false);
      }
      renderPaymentNotice(order, C.errorMessage(result, "We couldn't open the payment page.") +
        " Your order is saved but has not been paid. Please try again, or contact us.", "error", true);
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
      if (state.payments.enabled && els.placeOrder && !state.placing) els.placeOrder.textContent = "Place order and pay";
      if (params.get("payment") === "success" || params.get("payment") === "cancelled") return handleReturn(params);
      return loadCheckout();
    });
  }

  init();
})();