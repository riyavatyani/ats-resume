const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { generateResume } = require("../controllers/aiController");

router.post("/generate", protect, generateResume);

module.exports = router;
