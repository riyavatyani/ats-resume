const express = require("express");
const router = express.Router();

const { generateResume } = require("../controllers/aiController");
const { aiLimiter } = require("../middlewares/rateLimit");

// ✅ AI resume generation route (RATE-LIMITED)
router.post("/generate-resume", aiLimiter, generateResume);


module.exports = router;
