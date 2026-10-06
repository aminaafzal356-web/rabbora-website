/* =========================================================
   RABBORA LIVING — CREATE ACCOUNT (register.html)
   ---------------------------------------------------------
   Form validation and submit handling for the registration
   form only. The page's background animation is run by
   account.js (loaded before this file), exactly as on the
   login page; the header, search, wishlist and cart counts
   are run by script.js.

   The form is sent to the backend (POST /api/auth/register). Nothing
   on this page is ever saved in the browser — no localStorage,
   no sessionStorage, no cookies — and the password is only sent
   to the API, never stored or shown.
   ========================================================= */

(function () {
  "use strict";

  // Backend registration endpoint (backend/routes/auth.js), address from
  // api-config.js (window.RabboraApi), which must load before this file.
  var REGISTER_API_URL = window.RabboraApi && window.RabboraApi.API_URL
    ? window.RabboraApi.API_URL + "/auth/register"
    : null;
  if (!REGISTER_API_URL) {
    console.error(
      "[Rabbora Register] api-config.js is not loaded on this page, so the backend address is unknown. " +
      "Add <script src=\"api-config.js\"></script> before register.js."
    );
  }

  // Messages shown under the form.
  var MSG_SUCCESS = "Account created successfully. You can now log in.";
  var MSG_DUPLICATE = "An account with this email address already exists.";
  var MSG_CHECK_FIELDS = "Please check the highlighted fields.";
  var MSG_SERVER = "We couldn't create your account right now. Please try again later.";
  var MSG_NETWORK = "We couldn't reach the server. Please check your connection and try again.";

  // Same rules as the login form in account.js.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_PASSWORD_LENGTH = 8;

  // Phone: digits with optional spaces, brackets, dashes and a leading +,
  // 10 to 15 digits in total (e.g. 07123 456789, +44 7123 456789).
  var PHONE_ALLOWED = /^\+?[0-9\s()\-]+$/;
  var PHONE_MIN_DIGITS = 10;
  var PHONE_MAX_DIGITS = 15;

  var FIELDS = {
    firstName: { field: "registerFirstNameField", input: "registerFirstName", error: "registerFirstNameError" },
    lastName: { field: "registerLastNameField", input: "registerLastName", error: "registerLastNameError" },
    email: { field: "registerEmailField", input: "registerEmail", error: "registerEmailError" },
    phone: { field: "registerPhoneField", input: "registerPhone", error: "registerPhoneError" },
    password: { field: "registerPasswordField", input: "registerPassword", error: "registerPasswordError" },
    confirmPassword: { field: "registerConfirmPasswordField", input: "registerConfirmPassword", error: "registerConfirmPasswordError" }
  };

  // Order the fields appear on the page (used to focus the first error).
  var FIELD_ORDER = ["firstName", "lastName", "email", "phone", "password", "confirmPassword"];

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function inputOf(key) {
    return document.getElementById(FIELDS[key].input);
  }

  /**
   * Sends the new account to the backend.
   * "details" is { firstName, lastName, email, phone, password } —
   * confirmPassword is only checked in the browser and is not sent.
   * The backend hashes the password and creates the account.
   *
   * Resolves with { ok, status, data } for any HTTP answer (201, 400,
   * 409, 500 …). Rejects only when the server can't be reached at all.
   */
  function registerAccount(details) {
    // No backend address (api-config.js missing): treated like "server
    // not reachable", so the page shows its normal connection message.
    if (!REGISTER_API_URL) return Promise.reject(new Error("API address not configured"));

    return fetch(REGISTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(details)
    }).then(function (response) {
      return response.json()
        .catch(function () { return {}; })
        .then(function (data) {
          return { ok: response.ok, status: response.status, data: data || {} };
        });
    });
  }

  function announce(message) {
    var statusEl = document.getElementById("registerFormStatus");
    if (statusEl) statusEl.textContent = message;
  }

  // Same visual behaviour as the login form: red message under the
  // field, aria-invalid, and the subtle shake on every new error.
  function setFieldError(key, message) {
    var ids = FIELDS[key];
    var field = document.getElementById(ids.field);
    var input = document.getElementById(ids.input);
    var errorEl = document.getElementById(ids.error);
    if (!field || !input || !errorEl) return;

    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
      field.classList.remove("is-shaking");
      void field.offsetWidth;
      field.classList.add("is-shaking");
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function setFormError(message) {
    var el = document.getElementById("registerFormError");
    if (!el) return;
    el.style.color = "";
    el.textContent = message || "";
    el.hidden = !message;
  }

  // Success message in the same place as the form error, in the site's
  // green, with a link to the login page.
  function setFormSuccess(message) {
    var el = document.getElementById("registerFormError");
    if (!el) return;
    el.style.color = "var(--color-forest)";
    el.textContent = message + " ";
    var link = document.createElement("a");
    link.href = "account.html";
    link.textContent = "Log in";
    link.style.fontWeight = "700";
    link.style.textDecoration = "underline";
    el.appendChild(link);
    el.hidden = false;
  }

  // Clears every field's error message (used after a successful sign-up).
  function clearFieldErrors() {
    FIELD_ORDER.forEach(function (key) { setFieldError(key, ""); });
  }

  // ---- Validators: each returns an error message, or "" when valid ----

  function checkFirstName(value) {
    return value.trim() ? "" : "Enter your first name.";
  }

  function checkLastName(value) {
    return value.trim() ? "" : "Enter your last name.";
  }

  function checkEmail(value) {
    var v = value.trim();
    if (!v) return "Enter your email address.";
    if (!EMAIL_PATTERN.test(v)) return "Enter a valid email address.";
    return "";
  }

  function checkPhone(value) {
    var v = value.trim();
    if (!v) return "Enter your phone number.";
    var digits = v.replace(/\D/g, "");
    if (!PHONE_ALLOWED.test(v) || digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) {
      return "Enter a valid phone number.";
    }
    return "";
  }

  function checkPassword(value) {
    if (!value) return "Enter a password.";
    if (value.length < MIN_PASSWORD_LENGTH) {
      return "Password must be at least " + MIN_PASSWORD_LENGTH + " characters.";
    }
    return "";
  }

  function checkConfirmPassword(value) {
    if (!value) return "Confirm your password.";
    var password = inputOf("password") ? inputOf("password").value : "";
    if (value !== password) return "Passwords do not match.";
    return "";
  }

  var CHECKS = {
    firstName: checkFirstName,
    lastName: checkLastName,
    email: checkEmail,
    phone: checkPhone,
    password: checkPassword,
    confirmPassword: checkConfirmPassword
  };

  function validateField(key) {
    var input = inputOf(key);
    if (!input) return true;
    var message = CHECKS[key](input.value);
    setFieldError(key, message);
    return !message;
  }

  // Validate on blur; once a field shows an error, re-check it as the
  // customer types so the message clears as soon as it's fixed.
  function initLiveValidation() {
    FIELD_ORDER.forEach(function (key) {
      var input = inputOf(key);
      if (!input) return;

      input.addEventListener("blur", function () {
        // Don't flag an untouched, empty field just for tabbing past it.
        if (input.value === "" && input.getAttribute("aria-invalid") !== "true") return;
        validateField(key);
      });

      input.addEventListener("input", function () {
        setFormError("");
        if (input.getAttribute("aria-invalid") === "true") validateField(key);
        // Changing the password re-checks an already-typed confirmation.
        if (key === "password") {
          var confirm = inputOf("confirmPassword");
          if (confirm && confirm.value) validateField("confirmPassword");
        }
      });
    });
  }

  // Show/hide buttons for Password and Confirm Password. Each button
  // only controls its own field. As on the login page, the button's
  // aria-pressed is the single source of truth and account.css shows
  // the eye icon for "false" and the eye-off icon for "true".
  // Each toggle's sync function, so the form can put both password
  // fields back to hidden after a successful sign-up.
  var passwordToggleSyncs = [];

  function initPasswordToggles() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-password-toggle]"), function (toggle) {
      var input = document.getElementById(toggle.getAttribute("data-password-toggle"));
      if (!input) return;
      // "password" or "confirm password", taken from the button's label.
      var name = (toggle.getAttribute("aria-label") || "Show password").replace(/^(Show|Hide) /, "");

      function syncToggle() {
        var isVisible = input.type === "text";
        toggle.setAttribute("aria-pressed", String(isVisible));
        toggle.setAttribute("aria-label", (isVisible ? "Hide " : "Show ") + name);
      }

      // Keep focus in the field when clicked with a mouse, so its blur
      // validation doesn't fire just because the eye was clicked.
      toggle.addEventListener("mousedown", function (event) {
        event.preventDefault();
      });

      toggle.addEventListener("click", function () {
        input.type = input.type === "text" ? "password" : "text";
        syncToggle();
        input.focus();
      });

      syncToggle();
      passwordToggleSyncs.push(function () {
        input.type = "password";
        syncToggle();
      });
    });
  }

  function setLoadingState(isLoading) {
    var btn = document.getElementById("registerSubmitBtn");
    var textEl = btn ? qs(".login-button__text", btn) : null;
    if (!btn) return;

    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
    btn.setAttribute("aria-busy", String(isLoading));
    if (textEl) textEl.textContent = isLoading ? "Creating account..." : "Create account";
  }

  function initForm() {
    var form = document.getElementById("registerForm");
    if (!form) return;

    var isSubmitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (isSubmitting) return;

      setFormError("");
      var firstInvalid = null;
      FIELD_ORDER.forEach(function (key) {
        var ok = validateField(key);
        if (!ok && !firstInvalid) firstInvalid = inputOf(key);
      });

      if (firstInvalid) {
        announce("Please fix the highlighted fields.");
        firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      setLoadingState(true);
      announce("Creating your account…");

      var details = {
        firstName: inputOf("firstName").value.trim(),
        lastName: inputOf("lastName").value.trim(),
        email: inputOf("email").value.trim().toLowerCase(),
        phone: inputOf("phone").value.trim(),
        password: inputOf("password").value
      };

      registerAccount(details)
        .then(function (result) {
          var data = result.data;

          // 201 — account created.
          if (result.ok) {
            form.reset();
            passwordToggleSyncs.forEach(function (sync) { sync(); });
            clearFieldErrors();
            announce(MSG_SUCCESS);
            setFormSuccess(MSG_SUCCESS);
            return;
          }

          // 409 — this email is already registered.
          if (result.status === 409) {
            var duplicateMessage = data.message || MSG_DUPLICATE;
            setFieldError("email", duplicateMessage);
            announce(duplicateMessage);
            setFormError(duplicateMessage);
            inputOf("email").focus();
            return;
          }

          // 400 — the backend rejected some fields; show each message
          // under its own field, using the same keys as this form.
          if (result.status === 400) {
            var firstInvalid = null;
            var fieldErrors = data.errors && typeof data.errors === "object" ? data.errors : {};
            FIELD_ORDER.forEach(function (key) {
              if (typeof fieldErrors[key] === "string" && fieldErrors[key]) {
                setFieldError(key, fieldErrors[key]);
                if (!firstInvalid) firstInvalid = inputOf(key);
              }
            });
            var checkMessage = data.message || MSG_CHECK_FIELDS;
            announce(checkMessage);
            setFormError(checkMessage);
            if (firstInvalid) firstInvalid.focus();
            return;
          }

          // Anything else (500 etc.) — a safe, general message only.
          announce(MSG_SERVER);
          setFormError(MSG_SERVER);
        })
        .catch(function () {
          // The server couldn't be reached (backend not running, no
          // connection, or the request was blocked by the browser).
          announce(MSG_NETWORK);
          setFormError(MSG_NETWORK);
        })
        .finally(function () {
          details = null;
          isSubmitting = false;
          setLoadingState(false);
        });
    });
  }

  function initRegisterPage() {
    initPasswordToggles();
    initLiveValidation();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegisterPage);
  } else {
    initRegisterPage();
  }
})();