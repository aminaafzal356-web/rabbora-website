(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * ===========================================================
   * FUTURE BACKEND INTEGRATION POINT
   * ===========================================================
   * This is the one function that needs to change when a real
   * password-reset backend exists. Right now there is no backend
   * to call, so this deliberately does NOT pretend to succeed —
   * it rejects with a clear "not yet connected" error every time,
   * and the success state is never shown as a result.
   *
   * When a real endpoint exists, replace the body of this
   * function with something like:
   *
   *   return fetch("/api/password-reset/request", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     body: JSON.stringify({ email: email })
   *   }).then(function (response) {
   *     if (!response.ok) {
   *       return response.json().then(function (data) {
   *         throw new Error((data && data.message) || "Could not send the reset link.");
   *       });
   *     }
   *     return response.json(); // e.g. { sent: true }
   *   });
   *
   * A real backend should respond the same way whether or not the
   * email address has an account (to avoid revealing which emails
   * are registered) — that's a backend concern, not something to
   * work around here. This function never creates, stores, or
   * even sees a reset token; that belongs entirely to the server.
   *
   * Returns a Promise that resolves on success, or rejects with an
   * Error whose message is safe to show the user.
   */
  function requestPasswordReset(email) {
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        reject(new Error("Password reset isn't available yet — this account system isn't connected to a server."));
      }, 700);
    });
  }

  function announce(message) {
    var statusEl = document.getElementById("forgotFormStatus");
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
      setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "Enter your email address.");
      return false;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "Enter a valid email address.");
      return false;
    }
    setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", "");
    return true;
  }

  function initLiveValidation() {
    var emailInput = document.getElementById("forgotEmail");
    if (!emailInput) return;

    emailInput.addEventListener("blur", function () {
      validateEmail(emailInput);
    });
    emailInput.addEventListener("input", function () {
      if (emailInput.getAttribute("aria-invalid") === "true") {
        validateEmail(emailInput);
      }
    });
  }

  function setLoadingState(isLoading) {
    var btn = document.getElementById("forgotSubmitBtn");
    var textEl = btn ? qs(".forgot-button__text", btn) : null;
    if (!btn) return;

    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
    btn.setAttribute("aria-busy", String(isLoading));
    if (textEl) textEl.textContent = isLoading ? "Sending..." : "Send reset link";
  }

  /**
   * Shows the success panel in place of the request form. This is
   * only ever called from the .then() of a genuinely successful
   * requestPasswordReset() call — never speculatively, and never
   * just because the form was submitted.
   */
  function showSuccessState(email) {
    var requestState = document.getElementById("forgotRequestState");
    var successState = document.getElementById("forgotSuccessState");
    var emailEl = document.getElementById("forgotSuccessEmail");
    if (!requestState || !successState) return;

    if (emailEl) emailEl.textContent = email;
    requestState.hidden = true;
    successState.hidden = false;

    var heading = qs(".forgot-success__heading", successState);
    if (heading) heading.focus();
  }

  function initForm() {
    var form = document.getElementById("forgotForm");
    var emailInput = document.getElementById("forgotEmail");
    if (!form || !emailInput) return;

    var isSubmitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Prevent duplicate submissions if the button is somehow
      // triggered again before the previous attempt finishes.
      if (isSubmitting) return;

      var emailValid = validateEmail(emailInput);

      if (!emailValid) {
        announce("Please enter a valid email address.");
        emailInput.focus();
        return;
      }

      isSubmitting = true;
      setLoadingState(true);
      announce("Sending reset instructions\u2026");

      var email = emailInput.value.trim();

      requestPasswordReset(email)
        .then(function () {
          // Only reached once a real backend genuinely confirms the
          // request. Never fabricate this path — there is no backend
          // to call yet, so this branch cannot currently run, and it
          // must stay that way until a real API is connected.
          announce("Reset instructions sent. Check your email.");
          showSuccessState(email);
        })
        .catch(function (error) {
          var message = error && error.message ? error.message : "Something went wrong. Please try again.";
          announce(message);
          setFieldError("forgotEmailField", "forgotEmail", "forgotEmailError", message);
        })
        .finally(function () {
          isSubmitting = false;
          setLoadingState(false);
        });
    });
  }

  /**
   * ===========================================================
   * AMBIENT BACKGROUND — 'Luxury Silk / Flowing Fabric + Aurora
   * Light', identical visual family and mechanism to login.js
   * and register.js, fully isolated with forgot-scoped selectors
   * so this file never touches or depends on either of them.
   * ===========================================================
   * The aurora, glow, silk and light-sweep shapes are pure CSS on
   * static markup already in forgot-password.html — nothing here
   * creates or touches them. This section only does two small,
   * independent things, each of which fails silently (does
   * nothing at all) if its target element is missing:
   *
   *   1. Populates a handful of floating particle dots into the
   *      already-existing #forgotParticles container.
   *   2. On desktop only, applies a small parallax offset to each
   *      of the three depth layers (back/mid/front) as the mouse
   *      moves — each at a different speed. The forgot-password
   *      card itself is never touched by this.
   */

  function initForgotParticles() {
    var particlesContainer = document.getElementById("forgotParticles");
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
      particle.className = "forgot-particle";
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

  function initForgotParallax() {
    var backLayer = document.getElementById("forgotParallaxBack");
    var midLayer = document.getElementById("forgotParallaxMid");
    var frontLayer = document.getElementById("forgotParallaxFront");

    if (!backLayer && !midLayer && !frontLayer) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Desktop-with-a-real-mouse only — never enabled on touch devices.
    // Mobile/tablet get the CSS-only animation with no parallax at all.
    var isDesktopPointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktopPointer) return;

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

    window.addEventListener("mouseleave", function () {
      latestEvent = null;
      LAYERS.forEach(function (layer) {
        layer.el.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  function initForgotBackground() {
    initForgotParticles();
    initForgotParallax();
  }

  function initForgotPage() {
    initForgotBackground();
    initLiveValidation();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForgotPage);
  } else {
    initForgotPage();
  }
})();