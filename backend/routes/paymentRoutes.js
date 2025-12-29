const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { paymentLimiter } = require("../middlewares/rateLimit");

const {
  createOrder,
  verifyPayment,
  razorpayWebhook,
  canDownload,
} = require("../controllers/paymentController");

// 💳 Create Razorpay order (JSON REQUIRED)
router.post(
  "/create-order",
  express.json(),          // ✅ ADD THIS
  protect,
  paymentLimiter,
  createOrder
);

// ✅ Verify payment (JSON REQUIRED)
router.post(
  "/verify",
  express.json(),          // ✅ ADD THIS
  protect,
  paymentLimiter,
  verifyPayment
);

// 🔴 WEBHOOK (RAW BODY, NO AUTH, NO LIMITER)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

// 🔓 Check download access
router.get("/can-download", protect, canDownload);

module.exports = router;
