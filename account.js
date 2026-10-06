(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_PASSWORD_LENGTH = 8;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  // Real Rabbora backend (backend/routes/auth.js), address from
  // api-config.js (window.RabboraApi), which must load before this file.
  // In development, open the page on the same host name as the API
  // ("localhost", not 127.0.0.1) so the login cookie is shared with it.
  var API_BASE_URL = window.RabboraApi && window.RabboraApi.API_URL ? window.RabboraApi.API_URL : null;
  var LOGIN_API_URL = API_BASE_URL ? API_BASE_URL + "/auth/login" : null;
  var LOGOUT_API_URL = API_BASE_URL ? API_BASE_URL + "/auth/logout" : null;
  var ME_API_URL = API_BASE_URL ? API_BASE_URL + "/auth/me" : null;
  if (!API_BASE_URL) {
    console.error(
      "[Rabbora Account] api-config.js is not loaded on this page, so the backend address is unknown. " +
      "Add <script src=\"api-config.js\"></script> before account.js."
    );
  }
  // Give up waiting after this long so a hung server doesn't leave a
  // button spinning forever.
  var REQUEST_TIMEOUT_MS = 15000;

  var MSG_INVALID_LOGIN = "Invalid email or password.";
  var MSG_SERVER = "We couldn't log you in right now. Please try again later.";
  var MSG_NETWORK = "Can't reach the server. Please check your connection and try again.";
  var MSG_LOGOUT_FAILED = "We couldn't log you out right now. Please try again.";
  var MSG_LOGGED_OUT = "You've been logged out.";

  /**
   * Calls the backend and always resolves with { ok, status, data }:
   *   ok     — true for HTTP 2xx
   *   status — the HTTP status code (0 when the request never got a
   *            response: network error, CORS block, server not running,
   *            or timeout)
   *   data   — the parsed JSON body, or null if there wasn't one
   *
   * credentials: "include" makes the browser send and save the
   * HttpOnly session cookie. The page itself never sees or stores the
   * cookie, and nothing is written to localStorage / sessionStorage.
   */
  function apiRequest(url, options) {
    // No backend address (api-config.js missing): same result as "server
    // not reachable", so the page shows its normal connection message.
    if (!url) return Promise.resolve({ ok: false, status: 0, data: null });

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeoutId = controller
      ? window.setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS)
      : null;

    var init = {
      method: options.method,
      headers: options.headers,
      credentials: "include",
      signal: controller ? controller.signal : undefined,
    };
    if (options.body !== undefined) init.body = options.body;

    return fetch(url, init)
      .then(function (response) {
        return response
          .json()
          .catch(function () { return null; })
          .then(function (data) {
            return { ok: response.ok, status: response.status, data: data };
          });
      })
      .catch(function () {
        return { ok: false, status: 0, data: null };
      })
      .finally(function () {
        if (timeoutId) window.clearTimeout(timeoutId);
      });
  }

  // POST /api/auth/login — the password is only ever sent in this request
  // body; it is never stored or logged. On success the backend starts
  // a session and sets the cookie.
  function authenticateUser(email, password, remember) {
    return apiRequest(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: email, password: password, remember: remember === true }),
    });
  }

  // GET /api/auth/me — who is logged in (200) or nobody (401).
  function fetchCurrentUser() {
    return apiRequest(ME_API_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  }

  // POST /api/auth/logout — ends the session and removes the cookie.
  function logoutUser() {
    return apiRequest(LOGOUT_API_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
  }

  // Tells the shared cart store (cart-data.js) and wishlist store
  // (wishlist-data.js) about the login state, so a logged-in customer's
  // cart and wishlist are loaded from / saved to the backend. Also tells
  // the rest of the page (account-dashboard.js) with a
  // "rabbora:account:change" event. Returns a Promise that settles when
  // the stores have finished syncing.
  function cartSession(action) {
    var stores = [window.RabboraCart, window.RabboraWishlist];
    var pending = [];
    for (var i = 0; i < stores.length; i++) {
      var store = stores[i];
      if (store && typeof store[action] === "function") pending.push(store[action]());
    }
    if (action === "markLoggedOut") {
      // Review ids this browser remembered for the account (reviews.js).
      try {
        window.localStorage.removeItem("rabboraMyReviews");
      } catch (err) {
        // Storage disabled: nothing was remembered.
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("rabbora:account:change", {
        detail: { loggedIn: action === "markLoggedIn" }
      }));
    } catch (err) {
      // Older browsers without CustomEvent: the account sections simply stay hidden.
    }
    return Promise.all(pending.map(function (p) {
      return Promise.resolve(p).catch(function () { return null; });
    }));
  }

  // account.html?next=checkout.html — after logging in, go back to the
  // checkout. Only pages on this list are allowed (never an outside URL).
  var NEXT_PAGES = ["checkout.html"];

  function nextPageAfterLogin() {
    var match = /[?&]next=([^&#]*)/.exec(window.location.search || "");
    var page = match ? decodeURIComponent(match[1]) : "";
    return NEXT_PAGES.indexOf(page) !== -1 ? page : null;
  }

  function goToNextPage() {
    var page = nextPageAfterLogin();
    if (page) window.location.href = page;
  }

  function announce(message) {
    var statusEl = document.getElementById("loginFormStatus");
    if (statusEl) statusEl.textContent = message;
  }

  function setFieldError(fieldId, inputId, errorId, message) {
    var field = document.getElementById(fieldId);
    var input = document.getElementById(inputId);
    var errorEl = document.getElementById(errorId);
    if (!field || !input || !errorEl) return;

    // Undo the green success colour (setLoginSuccess) if it was used.
    errorEl.style.color = "";

    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;

      // Subtle shake, restarted cleanly on every new error so repeated
      // invalid submissions still visibly re-trigger it.
      field.classList.remove("is-shaking");
      // Force a reflow so removing/re-adding the class actually restarts
      // the CSS animation instead of being a no-op.
      void field.offsetWidth;
      field.classList.add("is-shaking");
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  // Shows the success message in the existing message area under the
  // password field, in the site's green. It is not an error, so the
  // field is not marked invalid and does not shake.
  function setLoginSuccess(message) {
    var errorEl = document.getElementById("loginPasswordError");
    if (!errorEl) return;
    errorEl.style.color = "var(--color-forest)";
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  // Puts the password field back to hidden (dots) and the eye button
  // back to "Show password" — the same attributes initPasswordToggle
  // sets, so the CSS-driven eye icons stay in step.
  function resetPasswordVisibility() {
    var toggle = document.getElementById("loginPasswordToggle");
    var input = document.getElementById("loginPassword");
    if (input) input.type = "password";
    if (toggle) {
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Show password");
    }
  }

  // ---------- Logged-in / logged-out views ----------

  // Shows or hides one part of the login card. Some parts (the form,
  // the divider) have display:flex in account.css, which would beat the
  // plain hidden attribute, so the inline display is set too.
  function setShown(el, shown) {
    if (!el) return;
    el.hidden = !shown;
    el.style.display = shown ? "" : "none";
  }

  // The card's original heading and intro text, restored on logout.
  var guestHeadingText = null;
  var guestSubtextText = null;

  function getCardParts() {
    var card = document.getElementById("loginCard");
    if (!card) return null;
    return {
      heading: qs(".login-heading", card),
      subtext: qs(".login-subtext", card),
      form: document.getElementById("loginForm"),
      divider: qs(".login-divider", card),
      createAccount: qs(".login-create-account", card),
      accountView: document.getElementById("loginAccountView"),
      logoutBtn: document.getElementById("logoutBtn"),
      logoutError: document.getElementById("logoutError"),
    };
  }

  function setLogoutError(message) {
    var el = document.getElementById("logoutError");
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
  }

  // Replaces the login form with "Welcome back, [First Name]" and the
  // Log out button. Text is set with textContent (never as HTML).
  function showAccountView(user, moveFocus) {
    var parts = getCardParts();
    if (!parts || !parts.accountView) return;

    var firstName = user && user.first_name ? user.first_name : "";
    if (parts.heading) parts.heading.textContent = firstName ? "Welcome back, " + firstName : "Welcome back";
    if (parts.subtext) {
      parts.subtext.textContent = user && user.email
        ? "You're logged in as " + user.email + "."
        : "You're logged in.";
    }

    setShown(parts.form, false);
    setShown(parts.divider, false);
    setShown(parts.createAccount, false);
    setLogoutError("");
    setShown(parts.accountView, true);

    if (moveFocus && parts.logoutBtn) parts.logoutBtn.focus();
  }

  // Puts the normal login form back.
  function showGuestView() {
    var parts = getCardParts();
    if (!parts) return;

    if (parts.heading && guestHeadingText !== null) parts.heading.textContent = guestHeadingText;
    if (parts.subtext && guestSubtextText !== null) parts.subtext.textContent = guestSubtextText;

    setShown(parts.accountView, false);
    setLogoutError("");
    setShown(parts.form, true);
    setShown(parts.divider, true);
    setShown(parts.createAccount, true);
  }

  function validateEmail(input) {
    var value = input.value.trim();
    if (!value) {
      setFieldError("loginEmailField", "loginEmail", "loginEmailError", "Enter your email address.");
      return false;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setFieldError("loginEmailField", "loginEmail", "loginEmailError", "Enter a valid email address.");
      return false;
    }
    setFieldError("loginEmailField", "loginEmail", "loginEmailError", "");
    return true;
  }

  function validatePassword(input) {
    var value = input.value;
    if (!value) {
      setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", "Enter your password.");
      return false;
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      setFieldError(
        "loginPasswordField",
        "loginPassword",
        "loginPasswordError",
        "Password must be at least " + MIN_PASSWORD_LENGTH + " characters."
      );
      return false;
    }
    setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", "");
    return true;
  }

  function initPasswordToggle() {
    var toggle = document.getElementById("loginPasswordToggle");
    var input = document.getElementById("loginPassword");
    if (!toggle || !input) return;

    // The button's aria-pressed is the single source of truth: CSS in
    // account.css shows the "eye" icon when it is "false" and the
    // "eye-off" icon when it is "true", so the icons can never get out
    // of step with the field and both can never show at once.
    function syncToggle() {
      var isVisible = input.type === "text";
      toggle.setAttribute("aria-pressed", String(isVisible));
      toggle.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
    }

    // Keep focus in the password field when the button is pressed with
    // a mouse, so the field's blur validation doesn't fire just because
    // the eye was clicked. Keyboard Enter/Space still work normally.
    toggle.addEventListener("mousedown", function (event) {
      event.preventDefault();
    });

    toggle.addEventListener("click", function () {
      input.type = input.type === "text" ? "password" : "text";
      syncToggle();
      input.focus();
    });

    syncToggle();
  }

  function initLiveValidation() {
    var emailInput = document.getElementById("loginEmail");
    var passwordInput = document.getElementById("loginPassword");

    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        validateEmail(emailInput);
      });
      emailInput.addEventListener("input", function () {
        if (emailInput.getAttribute("aria-invalid") === "true") {
          validateEmail(emailInput);
        }
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("blur", function () {
        validatePassword(passwordInput);
      });
      passwordInput.addEventListener("input", function () {
        if (passwordInput.getAttribute("aria-invalid") === "true") {
          validatePassword(passwordInput);
        }
      });
    }
  }

  function setLoadingState(isLoading) {
    var btn = document.getElementById("loginSubmitBtn");
    var textEl = btn ? qs(".login-button__text", btn) : null;
    if (!btn) return;

    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
    btn.setAttribute("aria-busy", String(isLoading));
    if (textEl) textEl.textContent = isLoading ? "Signing in..." : "Log in";
  }

  function initForgotPasswordLink() {
    var link = document.getElementById("loginForgotLink");
    if (!link) return;

    link.addEventListener("click", function (event) {
      // No password-reset backend exists yet — don't pretend a reset
      // email was sent. This stays a plain link (ready to point at a
      // real reset page/route once one exists) rather than firing a
      // fake success message.
      if (link.getAttribute("href") === "#") {
        event.preventDefault();
        announce("Password reset isn't available yet. Please contact us if you need help accessing your account.");
      }
    });
  }

  function initForm() {
    var form = document.getElementById("loginForm");
    var emailInput = document.getElementById("loginEmail");
    var passwordInput = document.getElementById("loginPassword");
    if (!form || !emailInput || !passwordInput) return;

    var isSubmitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Prevent duplicate submissions if the button is somehow
      // triggered again before the previous attempt finishes.
      if (isSubmitting) return;

      var emailValid = validateEmail(emailInput);
      var passwordValid = validatePassword(passwordInput);

      if (!emailValid || !passwordValid) {
        announce("Please fix the highlighted fields and try again.");
        var firstInvalid = !emailValid ? emailInput : passwordInput;
        firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      setLoadingState(true);
      announce("Signing in\u2026");

      var email = emailInput.value.trim();
      var password = passwordInput.value;
      var rememberInput = document.getElementById("loginRemember");
      var remember = !!(rememberInput && rememberInput.checked);

      authenticateUser(email, password, remember)
        .then(function (result) {
          var data = result.data || {};

          // 200 — the backend confirmed the email and password.
          if (result.ok && data.success === true) {
            var firstName = data.user && data.user.first_name ? data.user.first_name : "";
            var successMessage = firstName
              ? "Welcome back, " + firstName + "! You're logged in."
              : "You're logged in.";

            // Don't keep the password in the page after it has been used.
            passwordInput.value = "";
            resetPasswordVisibility();
            setFieldError("loginEmailField", "loginEmail", "loginEmailError", "");
            setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", "");
            // The backend has set the HttpOnly session cookie, so this
            // view also comes back after a page refresh (via /api/me).
            showAccountView(data.user, true);
            announce(successMessage);
            // The guest cart is sent to the account first, then (if the
            // visitor came from the checkout) the checkout opens again.
            cartSession("markLoggedIn").then(goToNextPage);
            return;
          }

          // 400 — the backend rejected the fields. Show each message under
          // its own field; fall back to the general message.
          if (result.status === 400) {
            var errors = data.errors || {};
            var shown = false;
            if (errors.email) {
              setFieldError("loginEmailField", "loginEmail", "loginEmailError", errors.email);
              shown = true;
            }
            if (errors.password) {
              setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", errors.password);
              shown = true;
            }
            if (!shown) {
              setFieldError(
                "loginPasswordField",
                "loginPassword",
                "loginPasswordError",
                data.message || "Please check your details and try again."
              );
            }
            announce(data.message || "Please check your details and try again.");
            (errors.email ? emailInput : passwordInput).focus();
            return;
          }

          // 401 — wrong email or wrong password (the backend never says which).
          if (result.status === 401) {
            setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", MSG_INVALID_LOGIN);
            announce(MSG_INVALID_LOGIN);
            passwordInput.focus();
            return;
          }

          // 0 — no response at all: network down, CORS blocked, backend
          // not running, or the request timed out.
          if (result.status === 0) {
            setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", MSG_NETWORK);
            announce(MSG_NETWORK);
            return;
          }

          // 500 or anything else unexpected.
          setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", MSG_SERVER);
          announce(MSG_SERVER);
        })
        .finally(function () {
          isSubmitting = false;
          setLoadingState(false);
        });
    });
  }

  // ---------- Session: check on page load + Log out ----------

  function setLogoutLoading(isLoading) {
    var btn = document.getElementById("logoutBtn");
    var textEl = btn ? qs(".login-button__text", btn) : null;
    if (!btn) return;

    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
    btn.setAttribute("aria-busy", String(isLoading));
    if (textEl) textEl.textContent = isLoading ? "Logging out..." : "Log out";
  }

  function initLogout() {
    var btn = document.getElementById("logoutBtn");
    var form = document.getElementById("loginForm");
    if (!btn) return;

    var isLoggingOut = false;

    btn.addEventListener("click", function () {
      if (isLoggingOut) return;
      isLoggingOut = true;
      setLogoutLoading(true);
      setLogoutError("");
      announce("Logging out\u2026");

      logoutUser()
        .then(function (result) {
          if (result.ok) {
            // The account cart stays on the backend; this browser's
            // copy is emptied (shared computers).
            cartSession("markLoggedOut");
            // Clear the form completely (shared computers).
            if (form) form.reset();
            resetPasswordVisibility();
            setFieldError("loginEmailField", "loginEmail", "loginEmailError", "");
            setFieldError("loginPasswordField", "loginPassword", "loginPasswordError", "");
            showGuestView();
            setLoginSuccess(MSG_LOGGED_OUT);
            announce(MSG_LOGGED_OUT);
            var emailInput = document.getElementById("loginEmail");
            if (emailInput) emailInput.focus();
            return;
          }

          var message = result.status === 0 ? MSG_NETWORK : MSG_LOGOUT_FAILED;
          setLogoutError(message);
          announce(message);
        })
        .finally(function () {
          isLoggingOut = false;
          setLogoutLoading(false);
        });
    });
  }

  // On page load / refresh: ask the backend whether this browser's
  // session cookie belongs to a logged-in user. If so, show the account
  // view; otherwise (401, server down, ...) the login form simply stays.
  function initSessionCheck() {
    var parts = getCardParts();
    if (!parts || !parts.accountView) return;

    guestHeadingText = parts.heading ? parts.heading.textContent : null;
    guestSubtextText = parts.subtext ? parts.subtext.textContent : null;

    fetchCurrentUser().then(function (result) {
      var data = result.data || {};
      if (result.ok && data.success === true && data.user) {
        showAccountView(data.user, false);
        cartSession("markLoggedIn").then(goToNextPage);
      }
    });
  }

  /**
   * ===========================================================
   * AMBIENT BACKGROUND — 'Luxury Silk / Flowing Fabric Light'
   * ===========================================================
   * All of the glow, silk-ribbon, shimmer and light-sweep shapes
   * are pure CSS on static markup already in login.html — nothing
   * here creates or touches them. This section only does two
   * small, independent things, each of which fails silently (does
   * nothing at all) if its target element is missing, so a
   * renamed or removed element can never throw an error:
   *
   *   1. Populates a handful of floating particle dots into the
   *      already-existing #loginParticles container.
   *   2. On desktop only, applies a small parallax offset to each
   *      of the three depth layers (back/mid/front) as the mouse
   *      moves — each at a different speed, so the scene has real
   *      depth rather than moving as one flat image. The login
   *      card itself is never touched by this.
   */

  function initLoginParticles() {
    var particlesContainer = document.getElementById("loginParticles");
    if (!particlesContainer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var particleCount = 13;
    // Fixed, hand-placed spread concentrated toward the edges of the
    // viewport rather than pure randomness, so particles never drift
    // across the card and stay a genuinely secondary background detail.
    var positions = [
      { top: "6%", left: "10%" },
      { top: "14%", left: "92%" },
      { top: "24%", left: "4%" },
      { top: "34%", left: "96%" },
      { top: "46%", left: "6%" },
      { top: "58%", left: "94%" },
      { top: "68%", left: "8%" },
      { top: "78%", left: "90%" },
      { top: "88%", left: "18%" },
      { top: "92%", left: "62%" },
      { top: "4%", left: "48%" },
      { top: "96%", left: "40%" },
      { top: "50%", left: "95%" }
    ];

    var fragment = document.createDocumentFragment();

    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "login-particle";
      var pos = positions[p % positions.length];
      particle.style.top = pos.top;
      particle.style.left = pos.left;
      particle.style.setProperty("--particle-size", (3 + (p % 3)) + "px");
      // Spec range: particles 10-20s.
      particle.style.setProperty("--particle-duration", (10 + p * 0.77) + "s");
      particle.style.setProperty("--particle-delay", (p * -1.6) + "s");
      fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
  }

  function initLoginParallax() {
    var backLayer = document.getElementById("loginParallaxBack");
    var midLayer = document.getElementById("loginParallaxMid");
    var frontLayer = document.getElementById("loginParallaxFront");

    // If none of the layers exist there is nothing to wire up; if only
    // some exist, still parallax whichever ones are actually present.
    if (!backLayer && !midLayer && !frontLayer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Desktop-with-a-real-mouse only — never enabled on touch devices,
    // where there is no hover/mousemove concept and the effect would
    // either never fire or fire from a stray touch. Mobile/tablet get
    // the CSS-only animation with no parallax at all, exactly as
    // specified.
    var isDesktopPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktopPointer) return;

    // Each layer moves at a different fraction of the same mouse
    // offset, so the back (furthest) layer barely shifts while the
    // front (nearest) layer shifts the most — genuine parallax depth
    // from a single mousemove listener rather than three separate ones.
    var LAYERS = [
      { el: backLayer, maxPx: 5 },
      { el: midLayer, maxPx: 9 },
      { el: frontLayer, maxPx: 14 }
    ].filter(function (layer) {
      return !!layer.el;
    });

    var ticking = false;
    var latestEvent = null;

    function applyParallax() {
      ticking = false;
      if (!latestEvent) return;

      var xRatio = (latestEvent.clientX / window.innerWidth) - 0.5; // -0.5..0.5
      var yRatio = (latestEvent.clientY / window.innerHeight) - 0.5;

      LAYERS.forEach(function (layer) {
        var offsetX = xRatio * -2 * layer.maxPx;
        var offsetY = yRatio * -2 * layer.maxPx;
        layer.el.style.transform = "translate3d(" + offsetX.toFixed(1) + "px, " + offsetY.toFixed(1) + "px, 0)";
      });
    }

    window.addEventListener("mousemove", function (event) {
      latestEvent = event;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyParallax);
      }
    });

    // If the pointer leaves the window entirely, ease every layer back
    // to center rather than freezing at the last offset.
    window.addEventListener("mouseleave", function () {
      latestEvent = null;
      LAYERS.forEach(function (layer) {
        layer.el.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  function initLoginBackground() {
    initLoginParticles();
    initLoginParallax();
  }

  function initLoginPage() {
    initLoginBackground();
    initPasswordToggle();
    initLiveValidation();
    initForgotPasswordLink();
    initForm();
    initLogout();
    initSessionCheck();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoginPage);
  } else {
    initLoginPage();
  }
})();