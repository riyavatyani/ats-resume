const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { generateAI } = require("../controllers/aiController");

console.log("AI ROUTE LOADED, generateAI =", generateAI);

router.post("/generate", generateAI);

module.exports = router;
