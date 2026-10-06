/*!
 * Rabbora Living — My Account: details, addresses and orders
 * ---------------------------------------------------------------
 * Fills the "My Account" section of account.html (#accountDashboard)
 * for a logged-in customer. account.js says when the visitor logs in
 * or out (event "rabbora:account:change"); this file never logs
 * anyone in itself and keeps nothing private in the browser storage.
 *
 * Backend endpoints used:
 *   GET   /api/users/me                     profile
 *   PATCH /api/users/me                     { firstName, lastName, phone }
 *   GET / POST / PATCH / DELETE /api/users/me/addresses[/:id]   (via customer.js)
 *   GET   /api/orders                       my orders
 *   GET   /api/orders/:id                   one order with its products
 *   POST  /api/orders/:id/cancel            cancel (the backend decides if allowed)
 *   GET   /api/payments/stripe/config       is online payment on?
 *   POST  /api/payments/stripe/checkout-session  { orderId, returnPath } -> Stripe
 *        ("Pay now" on an unpaid order; the backend works out the amount
 *        from the saved order and Stripe brings the customer back to
 *        checkout.html, which shows the verified result)
 *
 * Needs api-config.js and customer.js loaded before this file.
 */
(function () {
  "use strict";

  var C = window.RabboraCustomer;
  if (!C) {
    console.error("[Rabbora Account] customer.js is not loaded on this page — add it before account-dashboard.js.");
    return;
  }

  var section = document.getElementById("accountDashboard");
  if (!section) return;

  var els = {
    status: document.getElementById("accountDashStatus"),
    tabs: section.querySelectorAll("[data-account-tab]"),
    detailsForm: document.getElementById("accountDetailsForm"),
    detailsMessage: document.getElementById("accountDetailsMessage"),
    addressList: document.getElementById("accountAddressList"),
    addAddressBtn: document.getElementById("accountAddAddressBtn"),
    addressForm: document.getElementById("accountAddressForm"),
    addressFormHeading: document.getElementById("accountAddressFormHeading"),
    addressFields: document.getElementById("accountAddressFields"),
    addressMessage: document.getElementById("accountAddressMessage"),
    addressCancel: document.getElementById("accountAddressCancel"),
    orderList: document.getElementById("accountOrderList"),
    orderDetail: document.getElementById("accountOrderDetail")
  };

  var state = {
    loggedIn: false,
    user: null,
    addresses: [],
    editingAddressId: null,
    loadId: 0 // ignores answers that arrive after a logout
  };

  function setStatus(message) {
    if (els.status) els.status.textContent = message || "";
  }

  function setMessage(el, message, isError) {
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
    el.classList.toggle("is-error", !!isError);
  }

  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = !!busy;
    button.setAttribute("aria-busy", busy ? "true" : "false");
  }

  // ---------------------------------------------------------------
  // Tabs
  // ---------------------------------------------------------------

  function showTab(name) {
    for (var i = 0; i < els.tabs.length; i++) {
      var tab = els.tabs[i];
      var isActive = tab.getAttribute("data-account-tab") === name;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !isActive;
    }
  }

  function tabFromHash() {
    var hash = (window.location.hash || "").replace("#", "");
    return hash === "orders" || hash === "addresses" || hash === "details" ? hash : null;
  }

  function initTabs() {
    for (var i = 0; i < els.tabs.length; i++) {
      els.tabs[i].addEventListener("click", function () {
        showTab(this.getAttribute("data-account-tab"));
      });
    }
    window.addEventListener("hashchange", function () {
      var tab = tabFromHash();
      if (tab && state.loggedIn) showTab(tab);
    });
  }

  // ---------------------------------------------------------------
  // Account details  (GET / PATCH /api/users/me)
  // ---------------------------------------------------------------

  function fillDetails(user) {
    var form = els.detailsForm;
    if (!form) return;
    form.elements.firstName.value = user.firstName || "";
    form.elements.lastName.value = user.lastName || "";
    form.elements.email.value = user.email || "";
    form.elements.phone.value = user.phone || "";
  }

  function loadProfile(loadId) {
    return C.request("/users/me").then(function (result) {
      if (loadId !== state.loadId) return;
      if (result.ok && result.data && result.data.user) {
        state.user = result.data.user;
        fillDetails(state.user);
        return;
      }
      handleFailure(result, els.detailsMessage, "We couldn't load your details.");
    });
  }

  function initDetailsForm() {
    var form = els.detailsForm;
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = {
        firstName: form.elements.firstName.value.trim(),
        lastName: form.elements.lastName.value.trim()
      };
      var phone = form.elements.phone.value.trim();
      var errors = {};
      if (!data.firstName) errors.firstName = "Please enter your first name.";
      if (!data.lastName) errors.lastName = "Please enter your last name.";
      if (phone) {
        var digits = phone.replace(/[^0-9]/g, "").length;
        if (!/^\+?[0-9 ()-]+$/.test(phone) || digits < 10 || digits > 15) errors.phone = "Please enter a valid phone number (10 to 15 digits).";
        data.phone = phone;
      }
      if (!C.showFieldErrors(form, errors)) return;

      var button = form.querySelector('[type="submit"]');
      setBusy(button, true);
      setMessage(els.detailsMessage, "Saving…");
      C.request("/users/me", { method: "PATCH", body: data }).then(function (result) {
        setBusy(button, false);
        if (result.ok && result.data && result.data.user) {
          state.user = result.data.user;
          fillDetails(state.user);
          setMessage(els.detailsMessage, "Your details have been saved.");
          var heading = document.querySelector("#loginCard .login-heading");
          if (heading && /^Welcome back/.test(heading.textContent) && state.user.firstName) {
            heading.textContent = "Welcome back, " + state.user.firstName;
          }
          return;
        }
        C.showFieldErrors(form, C.fieldErrors(result));
        handleFailure(result, els.detailsMessage, "We couldn't save your details.");
      });
    });
  }

  // ---------------------------------------------------------------
  // Addresses  (one address book: the backend one)
  // ---------------------------------------------------------------

  function renderAddresses() {
    if (!els.addressList) return;
    if (!state.addresses.length) {
      els.addressList.innerHTML = '<p class="account-dash__empty">You haven’t saved an address yet.</p>';
      return;
    }
    els.addressList.innerHTML = state.addresses.map(function (a) {
      return (
        '<article class="rb-address-card' + (a.isDefault ? " is-default" : "") + '" data-address-id="' + a.id + '">' +
          (a.isDefault ? '<span class="rb-badge rb-badge--default">Default</span>' : "") +
          C.addressHtml(a) +
          '<div class="rb-address-card__actions">' +
            '<button type="button" class="rb-link-btn" data-address-edit="' + a.id + '">Edit</button>' +
            (a.isDefault ? "" : '<button type="button" class="rb-link-btn" data-address-default="' + a.id + '">Make default</button>') +
            '<button type="button" class="rb-link-btn rb-link-btn--danger" data-address-delete="' + a.id + '">Delete</button>' +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function loadAddresses(loadId) {
    return C.listAddresses().then(function (result) {
      if (loadId !== undefined && loadId !== state.loadId) return;
      if (result.ok && result.data && Array.isArray(result.data.addresses)) {
        state.addresses = result.data.addresses;
        renderAddresses();
        return;
      }
      if (els.addressList) els.addressList.innerHTML = "";
      handleFailure(result, els.addressMessage, "We couldn't load your addresses.");
    });
  }

  function openAddressForm(address) {
    if (!els.addressForm) return;
    state.editingAddressId = address ? address.id : null;
    if (els.addressFormHeading) els.addressFormHeading.textContent = address ? "Edit address" : "Add a new address";
    C.fillAddressForm(els.addressForm, address || null);
    setMessage(els.addressMessage, "");
    els.addressForm.hidden = false;
    if (els.addAddressBtn) els.addAddressBtn.hidden = true;
    var first = els.addressForm.querySelector("input");
    if (first) first.focus();
  }

  function closeAddressForm() {
    if (!els.addressForm) return;
    els.addressForm.hidden = true;
    state.editingAddressId = null;
    if (els.addAddressBtn) els.addAddressBtn.hidden = false;
  }

  function findAddress(id) {
    return state.addresses.filter(function (a) { return String(a.id) === String(id); })[0] || null;
  }

  function initAddresses() {
    if (els.addressFields) els.addressFields.innerHTML = C.addressFieldsHtml("accountAddress", { withDefault: true });

    if (els.addAddressBtn) {
      els.addAddressBtn.addEventListener("click", function () { openAddressForm(null); });
    }
    if (els.addressCancel) {
      els.addressCancel.addEventListener("click", function () {
        closeAddressForm();
        if (els.addAddressBtn) els.addAddressBtn.focus();
      });
    }

    if (els.addressForm) {
      els.addressForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = C.readAddressForm(els.addressForm);
        if (!C.showFieldErrors(els.addressForm, C.validateAddress(data))) return;

        var editingId = state.editingAddressId;
        var button = els.addressForm.querySelector('[type="submit"]');
        setBusy(button, true);
        setMessage(els.addressMessage, "Saving…");
        var call = editingId ? C.updateAddress(editingId, data) : C.createAddress(data);
        call.then(function (result) {
          setBusy(button, false);
          if (result.ok && result.data && result.data.address) {
            closeAddressForm();
            setMessage(els.addressMessage, editingId ? "Address updated." : "Address saved.");
            return loadAddresses();
          }
          C.showFieldErrors(els.addressForm, C.fieldErrors(result));
          handleFailure(result, els.addressMessage, "We couldn't save this address.");
        });
      });
    }

    if (els.addressList) {
      els.addressList.addEventListener("click", function (event) {
        var editBtn = event.target.closest("[data-address-edit]");
        var defaultBtn = event.target.closest("[data-address-default]");
        var deleteBtn = event.target.closest("[data-address-delete]");

        if (editBtn) {
          openAddressForm(findAddress(editBtn.getAttribute("data-address-edit")));
          return;
        }
        if (defaultBtn) {
          setBusy(defaultBtn, true);
          C.updateAddress(defaultBtn.getAttribute("data-address-default"), { isDefault: true }).then(function (result) {
            setBusy(defaultBtn, false);
            if (result.ok) {
              setMessage(els.addressMessage, "Default address changed.");
              return loadAddresses();
            }
            handleFailure(result, els.addressMessage, "We couldn't change your default address.");
          });
          return;
        }
        if (deleteBtn) {
          if (!window.confirm("Delete this address?")) return;
          setBusy(deleteBtn, true);
          C.deleteAddress(deleteBtn.getAttribute("data-address-delete")).then(function (result) {
            setBusy(deleteBtn, false);
            if (result.ok) {
              closeAddressForm();
              setMessage(els.addressMessage, "Address deleted.");
              return loadAddresses();
            }
            handleFailure(result, els.addressMessage, "We couldn't delete this address.");
          });
        }
      });
    }
  }

  // ---------------------------------------------------------------
  // Orders  (GET /api/orders, GET /api/orders/:id, POST /:id/cancel)
  // ---------------------------------------------------------------

  function renderOrders(orders) {
    if (!els.orderList) return;
    if (!orders.length) {
      els.orderList.innerHTML =
        '<p class="account-dash__empty">You haven’t placed an order yet.</p>' +
        '<a href="index.html" class="btn btn--forest">Start shopping</a>';
      return;
    }
    els.orderList.innerHTML =
      '<div class="rb-order-list">' +
      orders.map(function (o) {
        return (
          '<article class="rb-order-row">' +
            '<div class="rb-order-row__main">' +
              '<p class="rb-order-row__number">' + C.escapeHtml(o.orderNumber) + "</p>" +
              '<p class="rb-order-row__date">' + C.escapeHtml(C.formatDate(o.createdAt)) + "</p>" +
            "</div>" +
            '<span class="rb-order-row__badges">' +
              '<span class="rb-badge rb-badge--' + C.escapeHtml(o.status) + '">' + C.escapeHtml(C.statusLabel(o.status)) + "</span>" +
              '<span class="rb-badge rb-badge--pay-' + C.escapeHtml(o.paymentStatus) + '">' + C.escapeHtml(C.paymentLabel(o.paymentStatus)) + "</span>" +
            "</span>" +
            '<p class="rb-order-row__total">' + C.money(o.total) + "</p>" +
            '<button type="button" class="btn btn--outline-forest rb-order-row__btn" data-order-open="' + o.id + '">View details</button>' +
          "</article>"
        );
      }).join("") +
      "</div>";
  }

  function loadOrders(loadId) {
    return C.request("/orders?limit=50").then(function (result) {
      if (loadId !== undefined && loadId !== state.loadId) return;
      if (result.ok && result.data && Array.isArray(result.data.orders)) {
        renderOrders(result.data.orders);
        return;
      }
      if (els.orderList) els.orderList.innerHTML = '<p class="account-dash__empty is-error">' + C.escapeHtml(C.errorMessage(result, "We couldn't load your orders.")) + "</p>";
      handleFailure(result, null, null);
    });
  }

  function renderOrderDetail(order) {
    if (!els.orderDetail) return;
    // The backend allows a customer to cancel only a pending, unpaid
    // order (orderService.cancelOwnOrder). The button follows the
    // order's own status; the backend still makes the final decision.
    var canCancel = order.status === "pending" && order.paymentStatus === "unpaid";
    var canPay = paymentsEnabled && order.paymentStatus === "unpaid" && ["cancelled", "refunded"].indexOf(order.status) === -1;
    els.orderDetail.innerHTML =
      '<button type="button" class="rb-link-btn rb-order__back" data-order-back>&larr; Back to my orders</button>' +
      '<h3 class="account-dash__subheading">Order ' + C.escapeHtml(order.orderNumber) + "</h3>" +
      C.orderDetailHtml(order) +
      '<p class="account-dash__message" id="accountOrderMessage" role="status" hidden></p>' +
      (canPay || canCancel
        ? '<div class="rb-order__actions">' +
            (canPay ? '<button type="button" class="btn btn--forest rb-order__pay" data-order-pay="' + order.id + '">Pay now</button>' : "") +
            (canCancel ? '<button type="button" class="btn btn--outline-forest rb-order__cancel" data-order-cancel="' + order.id + '">Cancel this order</button>' : "") +
          "</div>"
        : "");
    els.orderDetail.hidden = false;
    if (els.orderList) els.orderList.hidden = true;
  }

  // Online payment on? (Stripe keys set in the backend.) Asked once.
  var paymentsEnabled = false;
  C.request("/payments/stripe/config").then(function (result) {
    paymentsEnabled = !!(result.ok && result.data && result.data.enabled);
  }).catch(function () { return null; });

  function payOrder(id, button) {
    setBusy(button, true);
    var returnPath = window.location.pathname.replace(/[^\/]*$/, "checkout.html");
    C.request("/payments/stripe/checkout-session", { method: "POST", body: { orderId: Number(id), returnPath: returnPath } }).then(function (result) {
      if (result.ok && result.data && typeof result.data.url === "string" && /^https:\/\//.test(result.data.url)) {
        window.location.assign(result.data.url);
        return;
      }
      setBusy(button, false);
      setMessage(document.getElementById("accountOrderMessage"), C.errorMessage(result, "We couldn't open the payment page.") + " Your order has not been paid.", true);
      handleFailure(result, null, null);
    });
  }

  function openOrder(id, button) {
    setBusy(button, true);
    C.request("/orders/" + encodeURIComponent(id)).then(function (result) {
      setBusy(button, false);
      if (result.ok && result.data && result.data.order) {
        renderOrderDetail(result.data.order);
        var heading = els.orderDetail.querySelector(".account-dash__subheading");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus();
        }
        return;
      }
      setStatus(C.errorMessage(result, "We couldn't open this order."));
      handleFailure(result, null, null);
    });
  }

  function closeOrder() {
    if (els.orderDetail) {
      els.orderDetail.hidden = true;
      els.orderDetail.innerHTML = "";
    }
    if (els.orderList) els.orderList.hidden = false;
  }

  function initOrders() {
    section.addEventListener("click", function (event) {
      var openBtn = event.target.closest("[data-order-open]");
      var backBtn = event.target.closest("[data-order-back]");
      var cancelBtn = event.target.closest("[data-order-cancel]");
      var payBtn = event.target.closest("[data-order-pay]");
      if (payBtn) {
        payOrder(payBtn.getAttribute("data-order-pay"), payBtn);
      } else if (openBtn) {
        openOrder(openBtn.getAttribute("data-order-open"), openBtn);
      } else if (backBtn) {
        closeOrder();
      } else if (cancelBtn) {
        if (!window.confirm("Cancel this order?")) return;
        var id = cancelBtn.getAttribute("data-order-cancel");
        setBusy(cancelBtn, true);
        C.request("/orders/" + encodeURIComponent(id) + "/cancel", { method: "POST" }).then(function (result) {
          setBusy(cancelBtn, false);
          if (result.ok && result.data && result.data.order) {
            renderOrderDetail(result.data.order);
            setMessage(document.getElementById("accountOrderMessage"), "Your order has been cancelled.");
            loadOrders();
            return;
          }
          // e.g. 400 "This order can no longer be cancelled online."
          setMessage(document.getElementById("accountOrderMessage"), C.errorMessage(result, "We couldn't cancel this order."), true);
          handleFailure(result, null, null);
        });
      }
    });
  }

  // ---------------------------------------------------------------
  // Login state
  // ---------------------------------------------------------------

  function handleFailure(result, messageEl, fallback) {
    if (result && result.status === 401) {
      // Session ended: hide everything private straight away.
      clearAll();
      setStatus(C.errorMessage(result));
      return;
    }
    if (messageEl && fallback) setMessage(messageEl, C.errorMessage(result, fallback), true);
  }

  function clearAll() {
    state.loggedIn = false;
    state.user = null;
    state.addresses = [];
    state.loadId += 1;
    closeAddressForm();
    closeOrder();
    if (els.detailsForm) els.detailsForm.reset();
    if (els.addressList) els.addressList.innerHTML = "";
    if (els.orderList) els.orderList.innerHTML = "";
    setMessage(els.detailsMessage, "");
    setMessage(els.addressMessage, "");
    setStatus("");
    section.hidden = true;
  }

  function onLogin() {
    if (state.loggedIn) return;
    state.loggedIn = true;
    state.loadId += 1;
    var loadId = state.loadId;
    section.hidden = false;
    showTab(tabFromHash() || "details");
    loadProfile(loadId);
    loadAddresses(loadId);
    loadOrders(loadId);
  }

  window.addEventListener("rabbora:account:change", function (event) {
    if (event.detail && event.detail.loggedIn) onLogin();
    else clearAll();
  });

  initTabs();
  initDetailsForm();
  initAddresses();
  initOrders();
})();