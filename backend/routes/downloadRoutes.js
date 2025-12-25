const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { checkDownload } = require("../controllers/downloadController");
console.log("protect =", protect);
console.log("checkDownload =", checkDownload);

router.post("/resume", protect, checkDownload);

module.exports = router;
