const express = require("express");
const router = express.Router();

const {
  checkEmail,
  register,
  login,
  resetPassword,
} = require("../controllers/authController");

const { authLimiter } = require("../middlewares/rateLimit");

// check if email exists (no limiter needed)
router.post("/check-email", checkEmail);

// register new user (rate-limited)
router.post("/register", authLimiter, register);

// login existing user (rate-limited)
router.post("/login", authLimiter, login);

// reset password (rate-limited)
router.post("/reset-password", authLimiter, resetPassword);

module.exports = router;
