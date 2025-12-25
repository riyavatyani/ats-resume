require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

/* ==================== IMPORTANT (RENDER FIX) ==================== */
// Render / proxies send X-Forwarded-For
app.set("trust proxy", 1); // ✅ MUST BE BEFORE rate-limit
/* ================================================================ */

// middlewares
app.use(cors());
app.use(express.json());

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/resume", resumeRoutes);

// ==================== SERVE FRONTEND ====================
app.use(
  express.static(path.join(__dirname, "../frontend/dist"))
);

// React fallback (VERY IMPORTANT)
app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

// ======================================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
