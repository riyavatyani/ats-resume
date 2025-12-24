const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ✅ CHECK IF EMAIL EXISTS
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📩 Email received from frontend:", email);

    const user = await User.findOne({ email });

    console.log("👤 User found in DB:", user);

    res.json({
      exists: Boolean(user),
      debugEmail: email,
    });
  } catch (error) {
    console.error("❌ checkEmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ REGISTER USER (EMAIL GOES HERE ✅)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    const resetToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "15m" } // valid for 15 minutes
);

const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // 📧 SEND WELCOME EMAIL (CORRECT PLACE)
   await sendEmail({
  to: email,
  subject: "Welcome to AI Resume Builder 🎉",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px;">
      
      <h2 style="color:#4f46e5;">Hi ${name}, 👋</h2>

      <p>
        Your account has been successfully created on 
        <strong>AI Resume Builder</strong>.
      </p>

      <p>You can now:</p>
      <ul>
        <li>Create ATS-friendly resumes</li>
        <li>Add job-specific keywords</li>
        <li>Download & share resumes</li>
      </ul>

      <hr style="margin: 20px 0;" />

      <p style="font-weight: bold;">
        🔐 Want to change or reset your password?
      </p>

      <p>
        Click the button below to securely reset your password.
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <div style="text-align:center; margin: 25px 0;">
        <a href="${resetLink}"
           style="
            background:#4f46e5;
            color:#fff;
            padding:12px 24px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
           ">
          Reset Password
        </a>
      </div>

      <p style="font-size: 13px; color:#777;">
        If you did not create this account, please ignore this email.
      </p>

      <p style="font-size: 13px; color:#777;">
        — Team <strong>AI Resume Builder</strong>
      </p>
    </div>
  `,
});

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN USER (NO EMAIL HERE ❌)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
