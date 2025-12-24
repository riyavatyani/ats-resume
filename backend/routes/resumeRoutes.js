const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const { protect } = require("../middlewares/authMiddleware");

// ✅ CREATE or UPDATE RESUME
router.post("/save", protect, async (req, res) => {
  try {
    const { resumeId, ...data } = req.body;

    let resume;

    if (resumeId) {
      resume = await Resume.findOneAndUpdate(
        { _id: resumeId, user: req.user._id },
        data,
        { new: true }
      );
    } else {
      resume = await Resume.create({
        ...data,
        user: req.user._id,
      });
    }

    res.json(resume);
  } catch (err) {
    console.error("Resume save error", err);
    res.status(500).json({ message: "Resume save failed" });
  }
});

module.exports = router;
