/*!
 * Rabbora Living — newsletter confirmation and unsubscribe (newsletter.html)
 *   Confirm link:     newsletter.html#confirm=TOKEN      -> POST /api/newsletter/confirm
 *   Unsubscribe link: newsletter.html#unsubscribe=TOKEN  -> POST /api/newsletter/unsubscribe
 * The token is read from the part after "#", so it is not sent to the web
 * server and is removed from the address bar straight away. Opening a
 * different link in the same tab (a fragment change) runs the new link too.
 */
(function () {
  "use strict";

  var titleEl = document.getElementById("newsletterPageTitle");
  var textEl = document.getElementById("newsletterPageText");
  if (!titleEl || !textEl) return;

  var INVALID_TEXT = "This link is not valid or has expired. Please subscribe again from the homepage, or use the most recent link in your email.";

  function show(title, text) {
    titleEl.textContent = title;
    textEl.textContent = text;
  }

  function run() {
    var match = String(window.location.hash || "").replace(/^#/, "").match(/^(confirm|unsubscribe)=([A-Za-z0-9_-]{32,100})$/);

    // Remove the token from the address bar and history as soon as it is read.
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch (err) {
      // Not supported: the token simply stays in the address bar.
    }

    if (!match) {
      show("Link not valid", INVALID_TEXT);
      return;
    }

    if (!window.RabboraApi || typeof window.RabboraApi.request !== "function") {
      show("Not available", "This page cannot reach the server right now. Please try again later.");
      return;
    }

    var action = match[1];
    var token = match[2];
    var path = action === "confirm" ? "/newsletter/confirm" : "/newsletter/unsubscribe";

    show("Please wait", "Checking your link…");
    window.RabboraApi.request(path, { method: "POST", body: { token: token } })
      .then(function (res) {
        var data = res.data || {};
        if (res.status === 0) {
          show("Could not connect", "We could not reach the server. Please check your connection and open the link again.");
          return;
        }
        if (res.ok && action === "confirm") {
          show("You are subscribed", data.message || "Thank you. Your subscription is confirmed.");
          return;
        }
        if (res.ok && action === "unsubscribe") {
          show("You have been unsubscribed", data.message || "You will no longer receive our marketing emails.");
          return;
        }
        if (res.status === 429) {
          show("Please wait", data.message || "Too many attempts. Please wait a few minutes and try again.");
          return;
        }
        show("Link not valid", data.message || INVALID_TEXT);
      });
  }

  run();
  window.addEventListener("hashchange", run);
})();