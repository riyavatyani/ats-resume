import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResumeForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
    keywords: "",
    photo: "",
  });

  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };
localStorage.removeItem("formattedResume");

  // 🔥 AI GENERATION
  const handleGenerateAI = async () => {
    try {
      setLoadingAI(true);

    const res = await axios.post(
  "http://localhost:8000/api/ai/generate-resume",
  formData
);





      setAiText(res.data.text);
      return res.data.text;
    } catch (err) {
      console.error("AI generation failed", err);
      alert("AI generation failed");
      return null;
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Generate AI resume FIRST
  const generatedText = await handleGenerateAI();
  if (!generatedText) return;

  try {
    const token = localStorage.getItem("token");

    // 2️⃣ SAVE RESUME TO MONGODB (STEP 3)
    const saveRes = await axios.post(
      "http://localhost:8000/api/resume/save",
      {
        ...formData,
        aiText: generatedText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 VERY IMPORTANT
    localStorage.setItem("resumeId", saveRes.data._id);

    // 3️⃣ Existing auth flow (unchanged)
    const res = await axios.post(
      "http://localhost:8000/api/auth/check-email",
      { email: formData.email }
    );

    res.data.exists ? navigate("/login") : navigate("/register");

  } catch (err) {
    console.error("Resume save failed", err);
    alert("Something went wrong while saving resume");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Build Your Resume
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in your details to generate an ATS-optimized resume.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PHOTO */}
          <div className="flex items-center gap-6">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center text-xs text-gray-500">
                Photo
              </div>
            )}

            <label className="text-sm text-violet-600 cursor-pointer">
              Upload photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" placeholder="Full name" required className="input" onChange={handleChange} />
            <input name="email" placeholder="Email address" required className="input" onChange={handleChange} />
            <input name="phone" placeholder="Phone number" className="input" onChange={handleChange} />
            <input name="skills" placeholder="Skills (React, Node, SQL)" className="input" onChange={handleChange} />
          </div>

          <textarea name="education" placeholder="Education" className="input h-24" onChange={handleChange} />
          <textarea name="experience" placeholder="Experience" className="input h-28" onChange={handleChange} />
          <input name="keywords" placeholder="ATS keywords (job-specific)" className="input" onChange={handleChange} />

          {/* CTA */}
          <button
            type="submit"
            disabled={loadingAI}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loadingAI ? "Generating with AI..." : "Generate Resume →"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
