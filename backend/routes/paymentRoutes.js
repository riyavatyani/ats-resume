const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { paymentLimiter } = require("../middlewares/rateLimit");

const {
  createOrder,
  verifyPayment,
  razorpayWebhook,   // ✅ ADD
  canDownload,
} = require("../controllers/paymentController");

// 💳 Create Razorpay order (rate-limited)
router.post("/create-order", protect, paymentLimiter, createOrder);

// ✅ Verify payment (optional / legacy)
router.post("/verify", protect, paymentLimiter, verifyPayment);

// 🔴 WEBHOOK (RAW BODY, NO AUTH, NO LIMITER)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

// 🔓 Check download access
router.get("/can-download", protect, canDownload);

module.exports = router;
