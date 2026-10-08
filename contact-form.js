/*!
 * Rabbora Living — Contact form (contact.html) -> POST /api/contact
 * ---------------------------------------------------------------
 * Saves the message in PostgreSQL (contact_messages). The thank-you
 * message is shown ONLY after the backend confirms it was saved.
 *
 * This file takes over the form's submit (listening on window in the
 * capture phase), so any older placeholder handler in contact.js that
 * only showed a "sent" message can no longer run. Everything else in
 * contact.js keeps working.
 *
 * Needs api-config.js (window.RabboraApi) loaded before this file.
 */
(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_ALLOWED = /^\+?[0-9 ()-]+$/;

  var api = window.RabboraApi && typeof window.RabboraApi.request === "function" ? window.RabboraApi : null;

  // field -> [input id, error element id]
  var FIELDS = {
    name: ["contact-name", "contact-name-error"],
    email: ["contact-email", "contact-email-error"],
    phone: ["contact-phone", null],
    subject: ["contact-subject", "contact-subject-error"],
    message: ["contact-message", "contact-message-error"]
  };

  var sending = false;

  function $(id) {
    return id ? document.getElementById(id) : null;
  }

  function value(field) {
    var input = $(FIELDS[field][0]);
    return input ? input.value.trim() : "";
  }

  function setFieldError(field, message) {
    var input = $(FIELDS[field][0]);
    var errorEl = $(FIELDS[field][1]);
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) errorEl.textContent = message || "";
  }

  function setStatus(text, kind) {
    var el = $("contactFormMessage");
    if (!el) return;
    el.textContent = text || "";
    el.classList.remove("is-error", "is-success");
    if (kind) el.classList.add("is-" + kind);
  }

  function validate() {
    var errors = {};
    var name = value("name");
    var email = value("email");
    var phone = value("phone");
    if (!name) errors.name = "Please enter your full name.";
    else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";
    if (!email) errors.email = "Please enter your email address.";
    else if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
    if (phone) {
      var digits = phone.replace(/[^0-9]/g, "").length;
      if (phone.length > 20 || !PHONE_ALLOWED.test(phone) || digits < 10 || digits > 15) errors.phone = "Please enter a valid phone number.";
    }
    if (!value("subject")) errors.subject = "Please enter a subject.";
    else if (value("subject").length > 200) errors.subject = "Subject must be 200 characters or fewer.";
    if (!value("message")) errors.message = "Please enter your message.";
    else if (value("message").length > 5000) errors.message = "Message must be 5000 characters or fewer.";
    return errors;
  }

  function showErrors(errors) {
    var first = null;
    Object.keys(FIELDS).forEach(function (field) {
      setFieldError(field, errors[field] || "");
      if (errors[field] && !first) first = $(FIELDS[field][0]);
    });
    if (errors.phone && !FIELDS.phone[1]) setStatus(errors.phone, "error");
    if (first) first.focus();
    return !first;
  }

  function setSending(form, isSending) {
    sending = isSending;
    var button = form.querySelector(".contact-form__submit");
    if (!button) return;
    if (!button.getAttribute("data-label")) button.setAttribute("data-label", button.textContent);
    button.disabled = isSending;
    button.setAttribute("aria-busy", String(isSending));
    button.textContent = isSending ? "Sending…" : button.getAttribute("data-label");
  }

  function submit(form) {
    if (sending) return;
    setStatus("");
    var errors = validate();
    if (!showErrors(errors)) {
      if (!errors.phone) setStatus("Please check the highlighted fields.", "error");
      return;
    }
    if (!api) {
      setStatus("We can't send your message right now. Please try again later.", "error");
      return;
    }

    var payload = {
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      subject: value("subject"),
      message: value("message")
    };

    setSending(form, true);
    api.request("/contact", { method: "POST", body: payload }).then(function (result) {
      setSending(form, false);

      if (result.ok && result.data && result.data.success) {
        form.reset();
        Object.keys(FIELDS).forEach(function (field) { setFieldError(field, ""); });
        setStatus("Thank you — your message has been sent. We'll get back to you soon.", "success");
        return;
      }

      if (result.status === 400 && result.data && Array.isArray(result.data.errors) && result.data.errors.length) {
        var serverErrors = {};
        result.data.errors.forEach(function (e) {
          if (e && e.field && !serverErrors[e.field]) serverErrors[e.field] = e.message;
        });
        showErrors(serverErrors);
        setStatus(result.data.errors[0].message || "Please check the highlighted fields.", "error");
        return;
      }

      if (result.status === 0) {
        setStatus("We can't reach our server right now. Please check your connection and try again.", "error");
      } else if (result.status === 429) {
        setStatus((result.data && result.data.message) || "Too many messages. Please wait a few minutes and try again.", "error");
      } else {
        setStatus("Sorry — we couldn't send your message. Please try again in a moment.", "error");
      }
    });
  }

  // Capture phase on window: runs before any handler on the form itself.
  window.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || form.id !== "contactForm") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    submit(form);
  }, true);

  // Clear a field's error as soon as it is corrected.
  document.addEventListener("input", function (event) {
    var target = event.target;
    if (!target || !target.id) return;
    Object.keys(FIELDS).forEach(function (field) {
      if (FIELDS[field][0] === target.id && target.getAttribute("aria-invalid") === "true") {
        var errors = validate();
        setFieldError(field, errors[field] || "");
      }
    });
  });
})();