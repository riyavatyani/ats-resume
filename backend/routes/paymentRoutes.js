const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { paymentLimiter } = require("../middlewares/rateLimit");

const {
  createOrder,
  verifyPayment,
  canDownload, // ✅ ADD THIS
} = require("../controllers/paymentController");

router.get("/can-download", protect, canDownload);


// 💳 Create Razorpay order (rate-limited)
router.post("/create-order", protect, paymentLimiter, createOrder);

// ✅ Verify payment (rate-limited)
router.post("/verify", protect, paymentLimiter, verifyPayment);

router.get("/can-download", protect, canDownload);

module.exports = router;
