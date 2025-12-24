const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { generateAI } = require("../controllers/aiController");

router.post("/generate", protect, generateAI);

module.exports = router;
