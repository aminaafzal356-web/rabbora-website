(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_PASSWORD_LENGTH = 8;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * ===========================================================
   * FUTURE BACKEND INTEGRATION POINT
   * ===========================================================
   * This is the one function that needs to change when a real
   * authentication backend exists. Right now there is no backend
   * to call, so this deliberately does NOT pretend to succeed —
   * it rejects with a clear "not yet connected" error every time.
   *
   * When a real endpoint exists, replace the body of this
   * function with something like:
   *
   *   return fetch("/api/login", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     credentials: "include", // send/receive the session cookie
   *     body: JSON.stringify({ email: email, password: password })
   *   }).then(function (response) {
   *     if (!response.ok) {
   *       return response.json().then(function (data) {
   *         throw new Error((data && data.message) || "Login failed.");
   *       });
   *     }
   *     return response.json(); // e.g. { user: {...} }
   *   });
   *
   * The backend, not this file, is responsible for verifying the
   * password and issuing a session/cookie/token — nothing here
   * should ever store or compare a real password itself.
   *
   * Returns a Promise that resolves with a user object on success,
   * or rejects with an Error whose message is safe to show the user.
   */
  function authenticateUser(email, password) {
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        reject(new Error("Login is not available yet — this account system isn't connected to a server."));
      }, 700);
    });
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

    var showIcon = qs(".login-password-toggle__icon-show", toggle);
    var hideIcon = qs(".login-password-toggle__icon-hide", toggle);

    toggle.addEventListener("click", function () {
      var isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.setAttribute("aria-pressed", String(!isVisible));
      toggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
      if (showIcon) showIcon.hidden = !isVisible ? false : true;
      if (hideIcon) hideIcon.hidden = !isVisible ? true : false;
      // Keep focus on the field itself, not the toggle button, so
      // typing can continue immediately.
      input.focus();
    });
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

      authenticateUser(email, password)
        .then(function (user) {
          // Only reached once a real backend genuinely confirms
          // success. Never fabricate this path — there is no backend
          // to call yet, so this branch cannot currently run, and it
          // must stay that way until a real API is connected.
          announce("Signed in. Redirecting\u2026");
          // Future: show a brief success/checkmark state here, then
          // redirect — e.g. window.location.href = "account.html";
        })
        .catch(function (error) {
          announce(error && error.message ? error.message : "Something went wrong. Please try again.");
          setFieldError(
            "loginPasswordField",
            "loginPassword",
            "loginPasswordError",
            error && error.message ? error.message : "Something went wrong. Please try again."
          );
        })
        .finally(function () {
          isSubmitting = false;
          setLoadingState(false);
        });
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLoginPage);
  } else {
    initLoginPage();
  }
})();