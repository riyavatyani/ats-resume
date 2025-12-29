const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Resume = require("../models/Resume");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const generateResumePDF = require("../utils/generateResumePDF");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  const { resumeId } = req.body;

  if (!resumeId) {
    return res.status(400).json({ message: "resumeId required" });
  }

  // 🔒 prevent duplicate payment for same resume
  const existing = await Payment.findOne({
    userId: req.user._id,
    resumeId,
    status: "success",
    downloadsRemaining: { $gt: 0 },
  });

  if (existing) {
    return res.status(400).json({
      message: "Payment already completed for this resume",
    });
  }

  const order = await razorpay.orders.create({
    amount: 4900, // ✅ ₹49 (paise)
    currency: "INR",
  });

  await Payment.create({
    userId: req.user._id,
    resumeId,
    razorpayOrderId: order.id,
    amount: 49,
    status: "pending",
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id } = req.body;

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment record not found" });
  }

  // already verified
  if (payment.status === "success") {
    return res.json({ success: true });
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.status = "success";
  payment.downloadsRemaining = 1;
  await payment.save();

  // ================= SEND EMAIL WITH PDF (ONCE) =================
  const user = await User.findById(payment.userId);
  const resume = await Resume.findOne({ resumeId: payment.resumeId });

  if (user && resume?.aiText) {
    // very basic HTML for backend PDF (stable & safe)
    const resumeHTML = `
      <html>
        <body style="font-family: Arial; padding: 24px;">
          <h1>${user.name}</h1>
          <p>${user.email}</p>
          <hr/>
          <pre style="white-space: pre-wrap;">${resume.aiText}</pre>
        </body>
      </html>
    `;

    const pdfBuffer = await generateResumePDF(resumeHTML);

    await sendEmail({
      to: user.email,
      subject: "Payment Successful – Your Resume PDF",
      html: `
        <p>Hi ${user.name},</p>
        <p>Your payment of <strong>₹49</strong> was successful.</p>
        <p>Your resume PDF is attached.</p>
        <p>You can also download it anytime from the dashboard.</p>
        <br/>
        <p>— Team AI Resume Builder</p>
      `,
      attachments: [
        {
          filename: "Resume.pdf",
          content: pdfBuffer,
        },
      ],
    });
  }

  res.json({ success: true });
};

exports.canDownload = async (req, res) => {
  const { resumeId } = req.query;

  const payment = await Payment.findOne({
    userId: req.user._id,
    resumeId,
    status: "success",
  });

  if (!payment) {
    return res.json({ allowed: false });
  }

  if (payment.downloadsRemaining <= 0) {
    return res.json({ allowed: false });
  }

  return res.json({ allowed: true });
};




// ================= RAZORPAY WEBHOOK =================
exports.razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const body = req.body.toString();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const paymentData = event.payload.payment.entity;

    const payment = await Payment.findOne({
      razorpayOrderId: paymentData.order_id,
    });

    if (payment && payment.status !== "success") {
      payment.razorpayPaymentId = paymentData.id;
      payment.status = "success";
      payment.downloadsRemaining = 1;
      await payment.save();
    }
  }

  res.json({ status: "ok" });
};


////No PDF email attachment

// Unlimited downloads per paid resume

// Webhook + signature verification

// Simple, boring, stable