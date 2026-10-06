/*!
 * Rabbora Living — admin login (admin/login.html)
 * Uses the EXISTING login: POST /api/auth/login (session cookie), then
 * checks the role the backend returns. A non-admin account is logged
 * straight out again and told it has no admin access.
 */
(function () {
  "use strict";

  var A = window.RabboraAdmin;
  var form = document.getElementById("adminLoginForm");
  if (!A || !form) return;

  var button = document.getElementById("adminLoginBtn");
  // Only admin pages are allowed as the "go back to" page.
  var NEXT_ALLOWED = /^(index|products|product|categories|fabrics|storage-options|inventory|orders|customers|reviews)\.html(\?[A-Za-z0-9=&_%-]*)?$/;

  function nextPage() {
    var match = /[?&]next=([^&#]*)/.exec(window.location.search);
    var next = match ? decodeURIComponent(match[1]) : "";
    return NEXT_ALLOWED.test(next) ? next : "index.html";
  }

  function setError(name, message) {
    var field = form.querySelector('[data-field="' + name + '"]');
    if (!field) return;
    var input = field.querySelector("input");
    var err = field.querySelector(".admin-error");
    err.textContent = message || "";
    err.hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function setBusy(busy) {
    button.disabled = busy;
    button.textContent = busy ? "Signing in…" : "Sign in";
  }

  if (/[?&]loggedOut=1/.test(window.location.search)) A.flash("You have been logged out.", "success");

  // Already signed in as an admin (e.g. a refresh): go straight in.
  A.request("/auth/me").then(function (result) {
    if (result.ok && result.data && result.data.user && result.data.user.role === "admin") {
      window.location.replace(nextPage());
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = form.elements.email.value.trim();
    var password = form.elements.password.value;
    setError("email", "");
    setError("password", "");
    A.flash("");

    var ok = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Enter a valid email address."); ok = false; }
    if (!password) { setError("password", "Enter your password."); ok = false; }
    if (!ok) return;

    setBusy(true);
    A.request("/auth/login", {
      method: "POST",
      body: { email: email, password: password, remember: !!form.elements.remember.checked }
    }).then(function (result) {
      form.elements.password.value = "";
      if (result.ok && result.data && result.data.user) {
        if (result.data.user.role === "admin") {
          window.location.replace(nextPage());
          return;
        }
        // A customer account: do not leave a session open from the admin login.
        return A.request("/auth/logout", { method: "POST" }).then(function () {
          setBusy(false);
          A.flash("This account does not have admin access.", "error");
        });
      }
      setBusy(false);
      var errors = A.fieldErrors(result);
      if (errors.email) setError("email", errors.email);
      if (errors.password) setError("password", errors.password);
      A.flash(result.status === 401 ? "Invalid email or password." : A.errorMessage(result, "We couldn't sign you in."), "error");
    });
  });
})();