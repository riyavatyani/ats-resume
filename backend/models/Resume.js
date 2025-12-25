const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // 🔐 ownership (always required)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ REQUIRED (from form)
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // 🟡 OPTIONAL (user may or may not fill)
    phone: String,
    photo: String,
    title: String,

    summary: String,
    experience: String,
    projects: String,
    achievements: String,
    certifications: String,
    education: String,
    links: String,

    skills: {
      type: [String],
      default: [],
    },

    // 🤖 AI / SYSTEM FIELDS
    aiText: {
      type: String,
      required: true, // AI generation always happens in your flow
    },

    template: {
      type: String,
      default: "one",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
