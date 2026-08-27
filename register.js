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
   * registration backend exists. Right now there is no backend
   * to call, so this deliberately does NOT pretend to succeed —
   * it rejects with a clear "not yet connected" error every time.
   *
   * When a real endpoint exists, replace the body of this
   * function with something like:
   *
   *   return fetch("/api/register", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     credentials: "include",
   *     body: JSON.stringify({
   *       firstName: formData.firstName,
   *       lastName: formData.lastName,
   *       email: formData.email,
   *       password: formData.password
   *     })
   *   }).then(function (response) {
   *     if (!response.ok) {
   *       return response.json().then(function (data) {
   *         throw new Error((data && data.message) || "Registration failed.");
   *       });
   *     }
   *     return response.json(); // e.g. { user: {...} }
   *   });
   *
   * The backend is responsible for hashing/storing the password,
   * checking for an existing account, and issuing a session once
   * registration succeeds — nothing here should ever store or
   * compare a real password itself.
   *
   * Returns a Promise that resolves with a user object on success,
   * or rejects with an Error whose message is safe to show the user.
   */
  function registerUser(formData) {
    return new Promise(function (resolve, reject) {
      window.setTimeout(function () {
        reject(new Error("Account creation is not available yet — this account system isn't connected to a server."));
      }, 700);
    });
  }

  function announce(message) {
    var statusEl = document.getElementById("registerFormStatus");
    if (statusEl) statusEl.textContent = message;
  }

  function setFieldError(fieldId, inputId, errorId, message) {
    var field = document.getElementById(fieldId);
    var input = inputId ? document.getElementById(inputId) : null;
    var errorEl = document.getElementById(errorId);
    if (!field || !errorEl) return;

    if (message) {
      if (input) input.setAttribute("aria-invalid", "true");
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
      if (input) input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function validateFirstName(input) {
    var value = input.value.trim();
    if (!value) {
      setFieldError("registerFirstNameField", "registerFirstName", "registerFirstNameError", "Enter your first name.");
      return false;
    }
    setFieldError("registerFirstNameField", "registerFirstName", "registerFirstNameError", "");
    return true;
  }

  function validateLastName(input) {
    var value = input.value.trim();
    if (!value) {
      setFieldError("registerLastNameField", "registerLastName", "registerLastNameError", "Enter your last name.");
      return false;
    }
    setFieldError("registerLastNameField", "registerLastName", "registerLastNameError", "");
    return true;
  }

  function validateEmail(input) {
    var value = input.value.trim();
    if (!value) {
      setFieldError("registerEmailField", "registerEmail", "registerEmailError", "Enter your email address.");
      return false;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setFieldError("registerEmailField", "registerEmail", "registerEmailError", "Enter a valid email address.");
      return false;
    }
    setFieldError("registerEmailField", "registerEmail", "registerEmailError", "");
    return true;
  }

  function validatePassword(input) {
    var value = input.value;
    if (!value) {
      setFieldError("registerPasswordField", "registerPassword", "registerPasswordError", "Enter a password.");
      return false;
    }
    if (value.length < MIN_PASSWORD_LENGTH) {
      setFieldError(
        "registerPasswordField",
        "registerPassword",
        "registerPasswordError",
        "Password must be at least " + MIN_PASSWORD_LENGTH + " characters."
      );
      return false;
    }
    setFieldError("registerPasswordField", "registerPassword", "registerPasswordError", "");
    return true;
  }

  function validateConfirmPassword(passwordInput, confirmInput) {
    var value = confirmInput.value;
    if (!value) {
      setFieldError("registerConfirmPasswordField", "registerConfirmPassword", "registerConfirmPasswordError", "Confirm your password.");
      return false;
    }
    if (value !== passwordInput.value) {
      setFieldError("registerConfirmPasswordField", "registerConfirmPassword", "registerConfirmPasswordError", "Passwords do not match.");
      return false;
    }
    setFieldError("registerConfirmPasswordField", "registerConfirmPassword", "registerConfirmPasswordError", "");
    return true;
  }

  function validateTerms(checkbox) {
    if (!checkbox.checked) {
      setFieldError("registerTermsField", "registerTerms", "registerTermsError", "You must agree to the Terms & Conditions and Privacy Policy to continue.");
      return false;
    }
    setFieldError("registerTermsField", "registerTerms", "registerTermsError", "");
    return true;
  }

  /**
   * A simple, purely client-side strength heuristic for UI feedback
   * only — this never leaves the browser and the password itself is
   * never logged or stored anywhere.
   */
  function calculatePasswordStrength(password) {
    if (!password) return "";

    var score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return "weak";
    if (score <= 3) return "medium";
    return "strong";
  }

  function updatePasswordStrength(password) {
    var strengthEl = document.getElementById("registerPasswordStrength");
    var labelEl = document.getElementById("registerPasswordStrengthLabel");
    if (!strengthEl || !labelEl) return;

    var strength = calculatePasswordStrength(password);
    strengthEl.setAttribute("data-strength", strength);

    var labels = { weak: "Weak", medium: "Medium", strong: "Strong" };
    labelEl.textContent = password ? (labels[strength] || "") : "";
  }

  function initPasswordToggle(toggleId, inputId) {
    var toggle = document.getElementById(toggleId);
    var input = document.getElementById(inputId);
    if (!toggle || !input) return;

    var showIcon = qs(".register-password-toggle__icon-show", toggle);
    var hideIcon = qs(".register-password-toggle__icon-hide", toggle);

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
    var firstNameInput = document.getElementById("registerFirstName");
    var lastNameInput = document.getElementById("registerLastName");
    var emailInput = document.getElementById("registerEmail");
    var passwordInput = document.getElementById("registerPassword");
    var confirmInput = document.getElementById("registerConfirmPassword");
    var termsCheckbox = document.getElementById("registerTerms");

    if (firstNameInput) {
      firstNameInput.addEventListener("blur", function () { validateFirstName(firstNameInput); });
      firstNameInput.addEventListener("input", function () {
        if (firstNameInput.getAttribute("aria-invalid") === "true") validateFirstName(firstNameInput);
      });
    }

    if (lastNameInput) {
      lastNameInput.addEventListener("blur", function () { validateLastName(lastNameInput); });
      lastNameInput.addEventListener("input", function () {
        if (lastNameInput.getAttribute("aria-invalid") === "true") validateLastName(lastNameInput);
      });
    }

    if (emailInput) {
      emailInput.addEventListener("blur", function () { validateEmail(emailInput); });
      emailInput.addEventListener("input", function () {
        if (emailInput.getAttribute("aria-invalid") === "true") validateEmail(emailInput);
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        updatePasswordStrength(passwordInput.value);
        if (passwordInput.getAttribute("aria-invalid") === "true") validatePassword(passwordInput);
        // Re-check confirm-password live too, since its validity
        // depends on this field's current value.
        if (confirmInput && confirmInput.getAttribute("aria-invalid") === "true") {
          validateConfirmPassword(passwordInput, confirmInput);
        }
      });
      passwordInput.addEventListener("blur", function () { validatePassword(passwordInput); });
    }

    if (confirmInput) {
      confirmInput.addEventListener("blur", function () {
        if (passwordInput) validateConfirmPassword(passwordInput, confirmInput);
      });
      confirmInput.addEventListener("input", function () {
        if (confirmInput.getAttribute("aria-invalid") === "true" && passwordInput) {
          validateConfirmPassword(passwordInput, confirmInput);
        }
      });
    }

    if (termsCheckbox) {
      termsCheckbox.addEventListener("change", function () {
        validateTerms(termsCheckbox);
      });
    }
  }

  function setLoadingState(isLoading) {
    var btn = document.getElementById("registerSubmitBtn");
    var textEl = btn ? qs(".register-button__text", btn) : null;
    if (!btn) return;

    btn.disabled = isLoading;
    btn.classList.toggle("is-loading", isLoading);
    btn.setAttribute("aria-busy", String(isLoading));
    if (textEl) textEl.textContent = isLoading ? "Creating account..." : "Create account";
  }

  function initForm() {
    var form = document.getElementById("registerForm");
    var firstNameInput = document.getElementById("registerFirstName");
    var lastNameInput = document.getElementById("registerLastName");
    var emailInput = document.getElementById("registerEmail");
    var passwordInput = document.getElementById("registerPassword");
    var confirmInput = document.getElementById("registerConfirmPassword");
    var termsCheckbox = document.getElementById("registerTerms");
    if (!form || !firstNameInput || !lastNameInput || !emailInput || !passwordInput || !confirmInput || !termsCheckbox) return;

    var isSubmitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Prevent duplicate submissions if the button is somehow
      // triggered again before the previous attempt finishes.
      if (isSubmitting) return;

      var firstNameValid = validateFirstName(firstNameInput);
      var lastNameValid = validateLastName(lastNameInput);
      var emailValid = validateEmail(emailInput);
      var passwordValid = validatePassword(passwordInput);
      var confirmValid = validateConfirmPassword(passwordInput, confirmInput);
      var termsValid = validateTerms(termsCheckbox);

      var allValid = firstNameValid && lastNameValid && emailValid && passwordValid && confirmValid && termsValid;

      if (!allValid) {
        announce("Please fix the highlighted fields and try again.");
        var firstInvalid =
          !firstNameValid ? firstNameInput :
          !lastNameValid ? lastNameInput :
          !emailValid ? emailInput :
          !passwordValid ? passwordInput :
          !confirmValid ? confirmInput :
          termsCheckbox;
        firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      setLoadingState(true);
      announce("Creating your account\u2026");

      var formData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
      };

      registerUser(formData)
        .then(function (user) {
          // Only reached once a real backend genuinely confirms
          // success. Never fabricate this path — there is no backend
          // to call yet, so this branch cannot currently run, and it
          // must stay that way until a real API is connected.
          announce("Account created. Redirecting\u2026");
          // Future: show a brief success/checkmark state here, then
          // redirect — e.g. window.location.href = "account.html";
        })
        .catch(function (error) {
          var message = error && error.message ? error.message : "Something went wrong. Please try again.";
          announce(message);
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
   * Light', identical visual family and mechanism to login.js,
   * fully isolated with register-scoped selectors so this file
   * never touches or depends on anything in login.js.
   * ===========================================================
   * The aurora, glow, silk, shimmer and light-ray shapes are pure
   * CSS on static markup already in register.html — nothing here
   * creates or touches them. This section only does two small,
   * independent things, each of which fails silently (does
   * nothing at all) if its target element is missing:
   *
   *   1. Populates a handful of floating particle dots into the
   *      already-existing #registerParticles container.
   *   2. On desktop only, applies a small parallax offset to each
   *      of the three depth layers (back/mid/front) as the mouse
   *      moves — each at a different speed. The register card
   *      itself is never touched by this.
   */

  function initRegisterParticles() {
    var particlesContainer = document.getElementById("registerParticles");
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
      particle.className = "register-particle";
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

  function initRegisterParallax() {
    var backLayer = document.getElementById("registerParallaxBack");
    var midLayer = document.getElementById("registerParallaxMid");
    var frontLayer = document.getElementById("registerParallaxFront");

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

  function initRegisterBackground() {
    initRegisterParticles();
    initRegisterParallax();
  }

  function initRegisterPage() {
    initRegisterBackground();
    initPasswordToggle("registerPasswordToggle", "registerPassword");
    initPasswordToggle("registerConfirmPasswordToggle", "registerConfirmPassword");
    initLiveValidation();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRegisterPage);
  } else {
    initRegisterPage();
  }
})();