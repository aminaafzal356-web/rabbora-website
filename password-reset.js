/*!
 * Rabbora Living — Forgot Password + Reset Password pages
 * ---------------------------------------------------------------
 * forget-password.html  ->  POST /api/auth/forgot-password { email }
 *   Always shows the same message afterwards, whether or not the email
 *   has an account (the backend answers the same way for both).
 *
 * reset-password.html#token=…  (the link from the email)
 *   1. reads the token from the address (after "#", so it is never sent
 *      to the web server) and removes it from the address bar,
 *   2. POST /api/auth/reset-password/validate { token }
 *        -> shows the form, or "link invalid / expired",
 *   3. POST /api/auth/reset-password { token, password, confirmPassword }
 *        -> "password updated" + Log in button.
 *
 * Needs api-config.js (window.RabboraApi) loaded first. Nothing is
 * stored in localStorage / sessionStorage; the token only lives in
 * this page's memory.
 */
(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PASSWORD_MIN = 8;
  var PASSWORD_MAX_BYTES = 72; // same limit as the backend (bcrypt)
  var TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
  var REQUEST_TIMEOUT_MS = 15000;

  var API = window.RabboraApi && window.RabboraApi.API_URL ? window.RabboraApi.API_URL : null;
  if (!API) {
    console.error("[Rabbora] api-config.js is not loaded on this page, so the backend address is unknown.");
  }

  var MSG_NETWORK = "Can't reach the server. Please check your connection and try again.";
  var MSG_SERVER = "Something went wrong on our side. Please try again in a few minutes.";
  var MSG_INVALID_LINK = "This password reset link is invalid or has expired. Please request a new one.";
  var MSG_GENERIC_SENT = "If an account exists with this email, you will receive a password reset link shortly.";

  function $(id) {
    return document.getElementById(id);
  }

  // Always resolves with { ok, status, data } (status 0 = no response).
  function postJson(path, payload) {
    if (!API) return Promise.resolve({ ok: false, status: 0, data: null });
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
    return fetch(API + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (response) {
        return response.json().catch(function () { return null; }).then(function (data) {
          return { ok: response.ok, status: response.status, data: data };
        });
      })
      .catch(function () {
        return { ok: false, status: 0, data: null };
      })
      .then(function (result) {
        if (timer) window.clearTimeout(timer);
        return result;
      });
  }

  function messageFor(result, fallback) {
    if (result.status === 0) return MSG_NETWORK;
    if (result.data && typeof result.data.message === "string" && result.status < 500) return result.data.message;
    return fallback || MSG_SERVER;
  }

  // ---------- small UI helpers ----------

  function setFieldError(fieldId, inputId, errorId, message) {
    var field = $(fieldId);
    var input = $(inputId);
    var errorEl = $(errorId);
    if (!input || !errorEl) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
      if (field) {
        field.classList.remove("is-shaking");
        void field.offsetWidth;
        field.classList.add("is-shaking");
      }
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
      errorEl.hidden = true;
      if (field) field.classList.remove("is-shaking");
    }
  }

  function setLoading(button, isLoading, idleText, busyText) {
    if (!button) return;
    var text = button.querySelector(".login-button__text");
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    button.setAttribute("aria-busy", String(isLoading));
    if (text) text.textContent = isLoading ? busyText : idleText;
  }

  function showNotice(boxId, textId, message) {
    var box = $(boxId);
    if (!box) return;
    if (textId && $(textId)) $(textId).textContent = message || "";
    box.hidden = false;
  }

  function hide(id) {
    var el = $(id);
    if (el) el.hidden = true;
  }

  function show(id) {
    var el = $(id);
    if (el) el.hidden = false;
  }

  function initPasswordToggles() {
    var toggles = document.querySelectorAll("[data-pw-toggle]");
    Array.prototype.forEach.call(toggles, function (toggle) {
      var input = $(toggle.getAttribute("data-pw-toggle"));
      if (!input) return;
      function sync() {
        var visible = input.type === "text";
        toggle.setAttribute("aria-pressed", String(visible));
        toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
      }
      toggle.addEventListener("mousedown", function (event) { event.preventDefault(); });
      toggle.addEventListener("click", function () {
        input.type = input.type === "text" ? "password" : "text";
        sync();
        input.focus();
      });
      sync();
    });
  }

  // Same soft floating particles as the login page (account.js).
  function initParticles() {
    var container = $("loginParticles");
    if (!container || container.childElementCount) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var positions = [
      ["6%", "10%"], ["14%", "92%"], ["24%", "4%"], ["34%", "96%"], ["46%", "6%"], ["58%", "94%"], ["68%", "8%"],
      ["78%", "90%"], ["88%", "18%"], ["92%", "62%"], ["4%", "48%"], ["96%", "40%"], ["50%", "95%"]
    ];
    var fragment = document.createDocumentFragment();
    positions.forEach(function (pos, p) {
      var particle = document.createElement("span");
      particle.className = "login-particle";
      particle.style.top = pos[0];
      particle.style.left = pos[1];
      particle.style.setProperty("--particle-size", (3 + (p % 3)) + "px");
      particle.style.setProperty("--particle-duration", (10 + p * 0.77) + "s");
      particle.style.setProperty("--particle-delay", (p * -1.6) + "s");
      fragment.appendChild(particle);
    });
    container.appendChild(fragment);
  }

  function passwordProblem(value) {
    if (!value) return "Please enter a new password.";
    if (value.length < PASSWORD_MIN) return "Password must be at least " + PASSWORD_MIN + " characters.";
    var bytes = typeof TextEncoder === "function" ? new TextEncoder().encode(value).length : value.length;
    if (bytes > PASSWORD_MAX_BYTES) return "Password is too long.";
    return "";
  }

  // ---------- forget-password.html ----------

  function initForgotPage() {
    var form = $("forgotForm");
    var input = $("forgotEmail");
    var button = $("forgotSubmitBtn");
    if (!form || !input) return;

    function validate() {
      var value = input.value.trim();
      if (!value) {
        setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "Enter your email address.");
        return false;
      }
      if (value.length > 254 || !EMAIL_PATTERN.test(value)) {
        setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "Enter a valid email address.");
        return false;
      }
      setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "");
      return true;
    }

    input.addEventListener("blur", function () {
      if (input.value.trim()) validate();
    });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validate();
      hide("forgotError");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (button && button.disabled) return;
      hide("forgotError");
      if (!validate()) {
        input.focus();
        return;
      }

      setLoading(button, true, "Send reset link", "Sending...");
      postJson("/auth/forgot-password", { email: input.value.trim() }).then(function (result) {
        setLoading(button, false, "Send reset link", "Sending...");

        if (result.ok) {
          form.hidden = true;
          showNotice("forgotSuccess", "forgotSuccessText", (result.data && result.data.message) || MSG_GENERIC_SENT);
          var box = $("forgotSuccess");
          if (box) box.focus();
          return;
        }
        if (result.status === 400 && result.data && result.data.errors && result.data.errors.email) {
          setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", result.data.errors.email);
          input.focus();
          return;
        }
        showNotice("forgotError", "forgotErrorText", messageFor(result));
      });
    });
  }

  // ---------- reset-password.html ----------

  // Reads the token from "#token=…" (or "?token=…") and removes it from
  // the address bar, so it isn't left in the browser history or shown
  // over someone's shoulder.
  function takeTokenFromAddress() {
    var token = "";
    var hash = window.location.hash.replace(/^#/, "");
    var search = window.location.search.replace(/^\?/, "");
    [hash, search].forEach(function (part) {
      if (token || !part) return;
      part.split("&").forEach(function (pair) {
        var bits = pair.split("=");
        if (bits[0] === "token" && bits[1]) {
          try { token = decodeURIComponent(bits[1]); } catch (err) { token = ""; }
        }
      });
    });
    if (window.history && typeof window.history.replaceState === "function") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    return token;
  }

  function initResetPage() {
    var form = $("resetForm");
    if (!form) return;
    var passwordInput = $("resetPassword");
    var confirmInput = $("resetConfirm");
    var button = $("resetSubmitBtn");
    var token = takeTokenFromAddress();

    // A second reset link opened in this same tab only changes the "#…"
    // part, which doesn't reload the page — reload so it is checked.
    window.addEventListener("hashchange", function () {
      if (/token=/.test(window.location.hash)) window.location.reload();
    });

    function linkProblem(message) {
      hide("resetChecking");
      form.hidden = true;
      var heading = $("resetHeading");
      if (heading) heading.textContent = "Reset link not valid";
      var intro = $("resetIntro");
      if (intro) intro.textContent = "Password reset links work once and expire after a short time.";
      showNotice("resetError", "resetErrorText", message || MSG_INVALID_LINK);
      show("resetRequestAction");
    }

    function validatePassword() {
      var problem = passwordProblem(passwordInput.value);
      setFieldError("resetPasswordField", "resetPassword", "resetPasswordError", problem);
      return !problem;
    }

    function validateConfirm() {
      var problem = "";
      if (!confirmInput.value) problem = "Please confirm your new password.";
      else if (confirmInput.value !== passwordInput.value) problem = "Passwords do not match.";
      setFieldError("resetConfirmField", "resetConfirm", "resetConfirmError", problem);
      return !problem;
    }

    passwordInput.addEventListener("blur", function () { if (passwordInput.value) validatePassword(); });
    confirmInput.addEventListener("blur", function () { if (confirmInput.value) validateConfirm(); });
    passwordInput.addEventListener("input", function () {
      if (passwordInput.getAttribute("aria-invalid") === "true") validatePassword();
      if (confirmInput.getAttribute("aria-invalid") === "true") validateConfirm();
    });
    confirmInput.addEventListener("input", function () {
      if (confirmInput.getAttribute("aria-invalid") === "true") validateConfirm();
    });

    if (!TOKEN_PATTERN.test(token)) {
      linkProblem();
      return;
    }

    postJson("/auth/reset-password/validate", { token: token }).then(function (result) {
      if (result.ok && result.data && result.data.valid === true) {
        hide("resetChecking");
        form.hidden = false;
        passwordInput.focus();
        return;
      }
      if (result.status === 400) {
        linkProblem(result.data && result.data.message);
        return;
      }
      // Server unreachable / busy: say so, without calling the link bad.
      hide("resetChecking");
      showNotice("resetError", "resetErrorText", messageFor(result));
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (button && button.disabled) return;
      hide("resetError");

      var okPassword = validatePassword();
      var okConfirm = validateConfirm();
      if (!okPassword || !okConfirm) {
        (okPassword ? confirmInput : passwordInput).focus();
        return;
      }

      setLoading(button, true, "Update password", "Updating...");
      postJson("/auth/reset-password", {
        token: token,
        password: passwordInput.value,
        confirmPassword: confirmInput.value,
      }).then(function (result) {
        setLoading(button, false, "Update password", "Updating...");

        if (result.ok) {
          token = "";
          passwordInput.value = "";
          confirmInput.value = "";
          form.hidden = true;
          var heading = $("resetHeading");
          if (heading) heading.textContent = "Password updated";
          var intro = $("resetIntro");
          if (intro) intro.textContent = "For your security you have been logged out on all devices.";
          show("resetSuccess");
          show("resetLoginAction");
          var box = $("resetSuccess");
          if (box) box.focus();
          return;
        }

        if (result.status === 400 && result.data && result.data.code === "INVALID_TOKEN") {
          token = "";
          linkProblem(result.data.message);
          return;
        }
        if (result.status === 400 && result.data && result.data.errors) {
          var errors = result.data.errors;
          if (errors.password) setFieldError("resetPasswordField", "resetPassword", "resetPasswordError", errors.password);
          if (errors.confirmPassword) setFieldError("resetConfirmField", "resetConfirm", "resetConfirmError", errors.confirmPassword);
          return;
        }
        showNotice("resetError", "resetErrorText", messageFor(result));
      });
    });
  }

  function init() {
    initParticles();
    initPasswordToggles();
    initForgotPage();
    initResetPage();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();