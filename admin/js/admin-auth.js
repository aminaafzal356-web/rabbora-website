/*!
 * Rabbora Living — admin panel core (window.RabboraAdmin)
 * ---------------------------------------------------------------
 * Loaded on every admin page after ../api-config.js. It:
 *   - checks the login with the EXISTING session (GET /api/auth/me);
 *     not logged in -> login.html, logged in but not an admin -> an
 *     "access denied" screen. The backend still checks every admin
 *     request itself (requireAdmin): this is only the page guard.
 *   - draws the sidebar navigation and the top bar;
 *   - logs out with the existing POST /api/auth/logout;
 *   - offers small helpers (API calls via RabboraApi, money, errors).
 * No second login system, no second API helper, no hardcoded address.
 */
(function (window, document) {
  "use strict";

  var api = window.RabboraApi && typeof window.RabboraApi.request === "function" ? window.RabboraApi : null;
  if (!api) {
    console.error("[Rabbora Admin] ../api-config.js is not loaded — add it before admin-auth.js.");
  }

  // Modules that exist get a link; the rest are shown as "Soon" (no fake pages).
  var NAV = [
    { key: "dashboard", label: "Dashboard", href: "index.html", icon: "M3 10l7-6 7 6v7a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z" },
    { key: "products", label: "Products", href: "products.html", icon: "M3 6l7-3 7 3v8l-7 3-7-3zM3 6l7 3 7-3M10 9v8" },
    { key: "categories", label: "Categories", href: "categories.html", icon: "M3 4h6v6H3zM11 4h6v6h-6zM3 12h6v5H3zM11 12h6v5h-6z" },
    { key: "fabrics", label: "Fabrics", href: "fabrics.html", icon: "M4 4h12v12H4zM4 8h12M4 12h12M8 4v12M12 4v12" },
    { key: "storage", label: "Storage options", href: "storage-options.html", icon: "M3 9h14v7H3zM3 9l2-5h10l2 5M8 12h4" },
    { key: "inventory", label: "Inventory", href: "inventory.html", icon: "M3 5h14v3H3zM4 8h12v9H4zM8 11h4" },
    { key: "orders", label: "Orders", href: "orders.html", icon: "M5 3h10l1 4H4zM4 7h12v10H4zM8 11h4" },
    { key: "customers", label: "Customers", href: "customers.html", icon: "M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 17c1-3.5 4-5 7-5s6 1.5 7 5" },
    { key: "reviews", label: "Reviews", href: "reviews.html", icon: "M10 3l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.3l5-.7z" },
    { key: "fabric-samples", label: "Fabric Sample Requests", href: "fabric-sample-requests.html", icon: "M4 3h8l4 4v10H4zM12 3v4h4M7 10h6M7 13h6" },
    { key: "contact-messages", label: "Contact Messages", href: "contact-messages.html", icon: "M3 5h14v10H3zM3 5l7 6 7-6" }
  ];

  var currentUser = null;

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  function escapeHtml(value) {
    var div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function money(amount) {
    if (amount === null || amount === undefined || amount === "") return "—";
    var n = Number(amount);
    if (!isFinite(n)) return "—";
    return "£" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Product images are stored relative to the shop's root
  // ("slatted/img-1.jfif"); admin pages live one folder down.
  function imageUrl(path) {
    if (!path) return "";
    var p = String(path);
    if (/^(https?:)?\/\//i.test(p) || p.charAt(0) === "/" || /^data:/i.test(p)) return p;
    return "../" + p;
  }

  function request(path, options) {
    if (!api) return Promise.resolve({ ok: false, status: 0, data: null });
    return api.request(path, options).then(function (result) {
      // Session ended while working: back to the login page.
      if (result.status === 401 && path.indexOf("/auth/") !== 0) goToLogin();
      if (result.status === 403 && path.indexOf("/auth/") !== 0) showDenied();
      return result;
    });
  }

  // Field errors from either backend format: [{ field, message }] or { field: message }.
  function fieldErrors(result) {
    var out = {};
    var errors = result && result.data ? result.data.errors : null;
    if (Array.isArray(errors)) {
      errors.forEach(function (e) { if (e && e.field && !out[e.field]) out[e.field] = e.message; });
    } else if (errors && typeof errors === "object") {
      Object.keys(errors).forEach(function (k) { out[k] = errors[k]; });
    }
    return out;
  }

  function errorMessage(result, fallback) {
    if (!result || result.status === 0) return "Can't reach the server. Check that the backend is running and try again.";
    if (result.status === 401) return "Your session has ended. Please log in again.";
    if (result.status === 403) return "This account does not have admin access.";
    var errs = fieldErrors(result);
    var keys = Object.keys(errs);
    if (keys.length) return errs[keys[0]];
    if (result.data && result.data.message) return result.data.message;
    return fallback || "Something went wrong. Please try again.";
  }

  // Small status banner at the top of the page content.
  var flashTimer = null;
  function flash(message, kind) {
    var el = document.getElementById("adminFlash");
    if (!el) return;
    window.clearTimeout(flashTimer);
    el.textContent = message || "";
    el.className = "admin-flash" + (kind ? " admin-flash--" + kind : "");
    el.hidden = !message;
    if (message && kind === "success") {
      flashTimer = window.setTimeout(function () { el.hidden = true; }, 5000);
    }
  }

  function currentPage() {
    var file = window.location.pathname.split("/").pop() || "index.html";
    return file + (window.location.search || "");
  }

  function goToLogin() {
    window.location.replace("login.html?next=" + encodeURIComponent(currentPage()));
  }

  // ---------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------

  function icon(d) {
    return '<svg class="admin-nav__icon" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="' + d +
      '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function renderShell(activeKey) {
    var sidebar = document.getElementById("adminSidebar");
    if (sidebar) {
      sidebar.innerHTML =
        '<div class="admin-brand">' +
          '<img src="../images/img-2.png" alt="" width="36" height="36" />' +
          '<div><p class="admin-brand__name">Rabbora Living</p><p class="admin-brand__sub">Admin</p></div>' +
        "</div>" +
        '<nav class="admin-nav" aria-label="Admin">' +
          "<ul>" +
          NAV.map(function (item) {
            if (!item.href) {
              return '<li><span class="admin-nav__link is-disabled" aria-disabled="true">' + icon(item.icon) +
                "<span>" + escapeHtml(item.label) + '</span><span class="admin-nav__soon">Soon</span></span></li>';
            }
            var active = item.key === activeKey;
            return '<li><a class="admin-nav__link' + (active ? " is-active" : "") + '" href="' + item.href + '"' +
              (active ? ' aria-current="page"' : "") + ">" + icon(item.icon) + "<span>" + escapeHtml(item.label) + "</span></a></li>";
          }).join("") +
          "</ul>" +
        "</nav>" +
        '<div class="admin-sidebar__foot">' +
          '<a class="admin-nav__link" href="../index.html" target="_blank" rel="noopener">' +
            icon("M11 3h6v6M17 3l-8 8M15 11v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5") + "<span>View shop</span></a>" +
          '<button type="button" class="admin-nav__link admin-logout" data-admin-logout>' +
            icon("M8 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M13 14l4-4-4-4M17 10H8") + "<span>Log out</span></button>" +
        "</div>";
    }

    var user = document.getElementById("adminUser");
    if (user && currentUser) {
      user.innerHTML =
        '<span class="admin-user__avatar" aria-hidden="true">' + escapeHtml((currentUser.first_name || "A").charAt(0)) + "</span>" +
        '<span class="admin-user__text"><strong>' + escapeHtml(currentUser.first_name + " " + currentUser.last_name) + "</strong>" +
        "<small>" + escapeHtml(currentUser.email) + "</small></span>";
    }

    var toggle = document.getElementById("adminMenuToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = document.body.classList.toggle("admin-nav-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    var scrim = document.getElementById("adminScrim");
    if (scrim) {
      scrim.addEventListener("click", function () {
        document.body.classList.remove("admin-nav-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  }

  function logout() {
    var buttons = document.querySelectorAll("[data-admin-logout]");
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
    return request("/auth/logout", { method: "POST" }).then(function (result) {
      if (result.ok) {
        currentUser = null;
        window.location.replace("login.html?loggedOut=1");
        return;
      }
      for (var j = 0; j < buttons.length; j++) buttons[j].disabled = false;
      flash(errorMessage(result, "We couldn't log you out. Please try again."), "error");
    });
  }

  document.addEventListener("click", function (event) {
    if (event.target.closest && event.target.closest("[data-admin-logout]")) logout();
  });

  // "Access denied" for a logged-in customer (the backend would answer 403 anyway).
  function showDenied() {
    var denied = document.getElementById("adminDenied");
    var layout = document.getElementById("adminLayout");
    if (layout) layout.hidden = true;
    if (denied) denied.hidden = false;
    document.body.classList.remove("admin--loading");
  }

  /**
   * Page guard. Resolves with the admin user, or never resolves (the
   * page is redirected to the login or shows "access denied").
   */
  function requireAdmin(activeKey) {
    return request("/auth/me").then(function (result) {
      if (result.status === 401) {
        goToLogin();
        return new Promise(function () {});
      }
      if (!result.ok || !result.data || !result.data.user) {
        document.body.classList.remove("admin--loading");
        var layout = document.getElementById("adminLayout");
        if (layout) layout.hidden = true;
        var down = document.getElementById("adminOffline");
        if (down) {
          down.hidden = false;
          down.querySelector("p").textContent = errorMessage(result, "The admin panel could not load.");
        }
        return new Promise(function () {});
      }
      if (result.data.user.role !== "admin") {
        showDenied();
        return new Promise(function () {});
      }
      currentUser = result.data.user;
      renderShell(activeKey);
      document.body.classList.remove("admin--loading");
      return currentUser;
    });
  }

  // Shows field errors under .admin-field[data-field] inside `scope`.
  // Returns true when there are none (and focuses the first bad field).
  function showErrors(scope, errors) {
    var first = null;
    var fields = scope.querySelectorAll(".admin-field[data-field]");
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i].getAttribute("data-field");
      var input = fields[i].querySelector("input, textarea, select");
      var err = fields[i].querySelector(".admin-error");
      var message = (errors && errors[name]) || "";
      if (err) { err.textContent = message; err.hidden = !message; }
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
      if (message && !first) first = input;
    }
    if (first) first.focus();
    return !first;
  }

  function slugify(text, max) {
    return String(text || "").toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max || 255)
      .replace(/-+$/g, "");
  }

  function formatDate(value) {
    var d = new Date(value);
    return isNaN(d.getTime()) ? "\u2014" : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  window.RabboraAdmin = {
    showErrors: showErrors,
    slugify: slugify,
    formatDate: formatDate,
    request: request,
    requireAdmin: requireAdmin,
    logout: logout,
    escapeHtml: escapeHtml,
    money: money,
    imageUrl: imageUrl,
    fieldErrors: fieldErrors,
    errorMessage: errorMessage,
    flash: flash
  };
})(window, document);