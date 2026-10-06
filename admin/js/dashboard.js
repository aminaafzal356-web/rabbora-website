/*!
 * Rabbora Living — admin dashboard (admin/index.html)
 * Every figure comes from GET /api/admin/stats (counted in the
 * database). Nothing is hardcoded.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A) return;

  var CARDS = [
    { key: "totalProducts", label: "Total products", sub: function (s) { return s.inactiveProducts + " inactive"; }, href: "products.html" },
    { key: "activeProducts", label: "Active products", sub: function () { return "Shown in the shop"; }, href: "products.html?status=active" },
    { key: "categories", label: "Categories", sub: function (s) { return s.activeCategories + " active"; }, href: "categories.html" },
    { key: "orders", label: "Orders", sub: function (s) { return s.pendingOrders + " pending"; }, href: "orders.html" },
    { key: "customers", label: "Customers", sub: function () { return "Customer accounts"; }, href: "customers.html" },
    { key: "lowStockItems", label: "Low stock items", sub: function () { return "Tracked stock at or below its alert level"; }, warn: true, href: "inventory.html?filter=low" },
    { key: "pendingReviews", label: "Hidden reviews", sub: function () { return "Not shown in the shop"; }, href: "reviews.html?status=pending" }
  ];

  var statsEl = document.getElementById("adminStats");

  function render(stats) {
    statsEl.innerHTML = CARDS.map(function (card) {
      var value = stats[card.key];
      var tag = card.href ? "a" : "div";
      var attention = card.warn && value > 0;
      return (
        "<" + tag + ' class="admin-stat' + (attention ? " admin-stat--attention" : "") + '"' + (card.href ? ' href="' + card.href + '"' : "") + ' data-stat="' + card.key + '">' +
          '<p class="admin-stat__label">' + A.escapeHtml(card.label) + "</p>" +
          '<p class="admin-stat__value">' + A.escapeHtml(value) + "</p>" +
          '<p class="admin-stat__sub">' + A.escapeHtml(card.sub(stats)) + "</p>" +
        "</" + tag + ">"
      );
    }).join("");
    statsEl.setAttribute("aria-busy", "false");
    var updated = document.getElementById("adminStatsUpdated");
    if (updated) updated.textContent = "Figures loaded from the database at " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + ".";
  }

  function load() {
    statsEl.innerHTML = CARDS.map(function () {
      return '<div class="admin-stat admin-stat--loading"><span></span><span></span></div>';
    }).join("");
    A.request("/admin/stats").then(function (result) {
      if (result.ok && result.data && result.data.stats) return render(result.data.stats);
      statsEl.innerHTML = "";
      statsEl.setAttribute("aria-busy", "false");
      A.flash(A.errorMessage(result, "The dashboard figures could not be loaded."), "error");
    });
  }

  A.requireAdmin("dashboard").then(load);
})();