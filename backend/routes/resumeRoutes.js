const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const { protect } = require("../middlewares/authMiddleware");

/* ===============================
   CREATE or UPDATE RESUME
================================ */
router.post("/save", async (req, res) => {
  try {
    const { resumeId, ...data } = req.body;

    let resume;

    if (resumeId) {
      resume = await Resume.findByIdAndUpdate(resumeId, data, {
        new: true,
      });
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
    } else {
      resume = await Resume.create({
        ...data,
        user: null, // guest
      });
    }

    res.json(resume);
  } catch (err) {
    console.error("Resume save error 👉", err);
    res.status(500).json({ message: "Resume save failed" });
  }
});

/* ===============================
   FETCH LATEST RESUME (AFTER LOGIN)
   ⚠️ MUST BE ABOVE /:id
================================ */
router.get("/latest", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json(resume || null);
  } catch (err) {
    console.error("Fetch latest resume error 👉", err);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
});

/* ===============================
   CLAIM RESUME AFTER LOGIN
================================ */
router.post("/claim", protect, async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.user = req.user._id;
    await resume.save();

    res.json({ message: "Resume claimed successfully" });
  } catch (err) {
    console.error("Resume claim error 👉", err);
    res.status(500).json({ message: "Resume claim failed" });
  }
});

/* ===============================
   FETCH RESUME BY ID (PREVIEW)
================================ */
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (err) {
    console.error("Resume fetch error", err);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
});

module.exports = router;
