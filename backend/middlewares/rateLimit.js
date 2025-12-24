const rateLimit = require("express-rate-limit");

// 🔒 AI is expensive
exports.aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 AI generations per user/IP
  message: {
    message: "Too many AI requests. Please wait before trying again.",
  },
});

// 💳 Payment abuse prevention
exports.paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // create-order attempts
  message: {
    message: "Too many payment attempts. Please slow down.",
  },
});

// 🔐 Login brute-force protection
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});
