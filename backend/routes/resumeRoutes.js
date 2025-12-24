const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const { protect } = require("../middlewares/authMiddleware");

/* =====================================================
   CREATE or UPDATE RESUME
   ===================================================== */
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
    console.error("Resume save error 👉", err);
    res.status(500).json({ message: "Resume save failed" });
  }
});

/* =====================================================
   GET LATEST RESUME FOR LOGGED-IN USER
   ===================================================== */
router.get("/latest", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        message: "No resume found",
      });
    }

    res.json(resume);
  } catch (err) {
    console.error("Resume fetch error 👉", err);
    res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
});

module.exports = router;
