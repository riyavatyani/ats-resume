const Payment = require("../models/Payment");

exports.checkDownload = async (req, res) => {
  const { resumeId } = req.body;

  const payment = await Payment.findOne({
    userId: req.user._id,
    resumeId,
    status: "success",
    downloadsRemaining: { $gt: 0 },
  });

  if (!payment) {
    return res.status(403).json({ message: "Payment required" });
  }

  payment.downloadsRemaining -= 1;
  await payment.save();

  res.json({ allowed: true });
};
