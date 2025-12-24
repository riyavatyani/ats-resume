import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ 1. Save draft ALWAYS
    localStorage.setItem(
      "resumeDraft",
      JSON.stringify(formData)
    );

    // ✅ 2. Check login
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return; // ⛔ STOP here
    }

    // ✅ 3. If already logged in
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Build Your Resume
        </h1>

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

          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" placeholder="Full name" required className="input" onChange={handleChange} />
            <input name="email" placeholder="Email address" required className="input" onChange={handleChange} />
            <input name="phone" placeholder="Phone number" className="input" onChange={handleChange} />
            <input name="skills" placeholder="Skills (React, Node, SQL)" className="input" onChange={handleChange} />
          </div>

          <textarea name="education" placeholder="Education" className="input h-24" onChange={handleChange} />
          <textarea name="experience" placeholder="Experience" className="input h-28" onChange={handleChange} />
          <input name="keywords" placeholder="ATS keywords" className="input" onChange={handleChange} />

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium"
          >
            Generate Resume →
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResumeForm;
