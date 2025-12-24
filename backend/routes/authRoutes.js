const express = require("express");
const router = express.Router();
const {
  login,
  register,
  checkEmail,
} = require("../controllers/authController");

router.post("/check-email", checkEmail);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
