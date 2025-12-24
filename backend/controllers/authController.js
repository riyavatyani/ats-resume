const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= CHECK EMAIL ================= */
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    res.json({ exists: !!user });
  } catch (err) {
    console.error("CHECK EMAIL ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id }, // 🔥 CONSISTENT PAYLOAD
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id }, // 🔥 SAME PAYLOAD
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    res.status(500).json({ message: "Server error" });
  }
};
