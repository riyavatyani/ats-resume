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

  /* ================= AI GENERATION ================= */
  const handleGenerateAI = async () => {
    try {
      setLoadingAI(true);

      const res = await axios.post("/api/ai/generate", formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


      return res.data.text;
    } catch (err) {
      console.error("AI generation failed", err);
      alert("AI generation failed");
      return null;
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  const {
    name,
    email,
    phone,
    education,
    experience,
    skills,
    keywords,
  } = formData;

  if (
    !name ||
    !email ||
    !phone ||
    !education ||
    !experience ||
    !skills ||
    !keywords
  ) {
    alert("All fields except photo are mandatory");
    return;
  }

  if (phone.length < 10) {
    alert("Enter a valid phone number");
    return;
  }

  localStorage.removeItem("formattedResume");


    // 1️⃣ Generate AI resume
    const generatedText = await handleGenerateAI();
    if (!generatedText) return;

    try {
      // 2️⃣ Save resume as GUEST
      const saveRes = await axios.post(
        "/api/resume/save",
        {
          ...formData,
          aiText: generatedText,
        }
      );

      // store resume id
      localStorage.setItem("resumeId", saveRes.data._id);

      // 3️⃣ Auth flow
      const res = await axios.post(
        "/api/auth/check-email",
        { email: formData.email }
      );

      res.data.exists
        ? navigate("/login")
        : navigate("/register");

    } catch (err) {
      console.error("Resume save failed", err);
      alert("Something went wrong while saving resume");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white border rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Build Your Resume
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PHOTO */}
          <div className="flex items-center gap-6">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 border flex items-center justify-center text-xs">
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

          <input
            name="name"
            placeholder="Full name"
            required
            className="input"
            onChange={handleChange}
          />

          <input
  name="email"
  type="email"
  placeholder="Email"
  required
  className="input"
  onChange={handleChange}
/>


          <input
  name="phone"
  placeholder="Phone"
  required
  className="input"
  onChange={handleChange}
/>

<textarea
  name="education"
  placeholder="Education"
  required
  className="input"
  onChange={handleChange}
/>

<textarea
  name="experience"
  placeholder="Experience"
  required
  className="input"
  onChange={handleChange}
/>

<input
  name="skills"
  placeholder="Skills (React, Node, SQL)"
  required
  className="input"
  onChange={handleChange}
/>

<input
  name="keywords"
  placeholder="ATS keywords (job-specific)"
  required
  className="input"
  onChange={handleChange}
/>



          <button
            type="submit"
            disabled={loadingAI}
            className="w-full bg-violet-600 text-white py-3 rounded-lg"
          >
            {loadingAI ? "Generating..." : "Generate Resume →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
