const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeId: {
      type: String, // resume unique identifier
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    downloadsRemaining: {
      type: Number,
      default: 0, // 1 paid download
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
