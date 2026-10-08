// Rabbora Living — Forgot Password / Reset Password routes
// Mounted in server.js under /api/auth (and /api, like the login routes):
//
//   POST /api/auth/forgot-password            { email }
//        Always answers 200 with the same message, whether or not the
//        email belongs to an account (nobody can find out which emails
//        are registered). The email is sent in the background.
//
//   POST /api/auth/reset-password/validate    { token }
//        200 { valid: true } when the link can still be used,
//        400 INVALID_TOKEN when it is unknown, expired or already used.
//
//   POST /api/auth/reset-password             { token, password, confirmPassword }
//        Saves the new password (bcrypt), makes the link unusable and
//        logs the account out on every device.
//
// Rate limits (per visitor IP; email limit is silent):
//   forgot-password : 5 requests / 15 min per IP, and at most
//                     3 reset emails / hour per email address
//   validate        : 30 / 15 min per IP
//   reset-password  : 10 / 15 min per IP
//
// Logs never contain the email address, token, link or password.

const express = require("express");
const { RateLimiter, limitByIp } = require("../middleware/rateLimit");
const resetService = require("../services/passwordResetService");

const router = express.Router();

const GENERIC_FORGOT_MESSAGE =
  "If an account exists with this email, you will receive a password reset link shortly.";
const INVALID_TOKEN_MESSAGE =
  "This password reset link is invalid or has expired. Please request a new one.";
const SERVER_ERROR_MESSAGE =
  "We couldn't reset your password right now. Please try again later.";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const limiters = {
  forgotIp: new RateLimiter({ limit: 5, windowMs: FIFTEEN_MINUTES }),
  forgotEmail: new RateLimiter({ limit: 3, windowMs: ONE_HOUR }),
  validateIp: new RateLimiter({ limit: 30, windowMs: FIFTEEN_MINUTES }),
  resetIp: new RateLimiter({ limit: 10, windowMs: FIFTEEN_MINUTES }),
};

function body(req) {
  return req.body && typeof req.body === "object" ? req.body : {};
}

function noStore(req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

// POST /forgot-password
router.post(
  "/forgot-password",
  noStore,
  limitByIp(limiters.forgotIp, "Too many reset requests. Please wait 15 minutes and try again."),
  (req, res) => {
    const email = resetService.cleanEmail(body(req).email);

    // Only the FORMAT is checked here — it says nothing about accounts.
    if (!resetService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please check the highlighted fields.",
        errors: { email: email ? "Enter a valid email address." : "Email address is required." },
      });
    }

    // Same answer straight away for every valid email, so the response
    // (and its timing) never shows whether the account exists.
    res.status(200).json({ success: true, message: GENERIC_FORGOT_MESSAGE });

    // More than 3 requests an hour for one address: silently ignored
    // (stops someone flooding a customer's inbox).
    if (!limiters.forgotEmail.hit(email).allowed) return;

    setImmediate(() => {
      resetService.requestPasswordReset(email).catch((err) => {
        console.error("[password-reset] Request failed:", err.code || "", err.message);
      });
    });
  }
);

// POST /reset-password/validate
router.post(
  "/reset-password/validate",
  noStore,
  limitByIp(limiters.validateIp),
  async (req, res) => {
    try {
      const valid = await resetService.checkResetToken(body(req).token);
      if (!valid) {
        return res.status(400).json({ success: false, code: "INVALID_TOKEN", message: INVALID_TOKEN_MESSAGE });
      }
      return res.status(200).json({ success: true, valid: true });
    } catch (err) {
      console.error("[password-reset] Could not check link:", err.code || "", err.message);
      return res.status(500).json({ success: false, code: "SERVER_ERROR", message: SERVER_ERROR_MESSAGE });
    }
  }
);

// POST /reset-password
router.post(
  "/reset-password",
  noStore,
  limitByIp(limiters.resetIp, "Too many attempts. Please wait 15 minutes and try again."),
  async (req, res) => {
    const data = body(req);
    const token = data.token;
    // The password is NOT trimmed (spaces are allowed), like registration.
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    const errors = {};
    const problem = resetService.passwordProblem(password);
    if (problem) errors.password = problem;
    else if (confirmPassword !== undefined && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please check the highlighted fields.",
        errors,
      });
    }

    try {
      const result = await resetService.resetPassword(token, password);
      if (!result.ok) {
        return res.status(400).json({ success: false, code: "INVALID_TOKEN", message: INVALID_TOKEN_MESSAGE });
      }
      return res.status(200).json({
        success: true,
        message: "Your password has been updated. You can now log in with your new password.",
      });
    } catch (err) {
      console.error("[password-reset] Could not change password:", err.code || "", err.message);
      return res.status(500).json({ success: false, code: "SERVER_ERROR", message: SERVER_ERROR_MESSAGE });
    }
  }
);

router.limiters = limiters; // used by the automated tests only

module.exports = router;