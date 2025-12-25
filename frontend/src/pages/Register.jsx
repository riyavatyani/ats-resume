import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // get resume-first data
  const resumeData = JSON.parse(localStorage.getItem("resumeData"));

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 If someone opens /register directly without resume data
  useEffect(() => {
    if (!resumeData) {
      navigate("/resume-form");
    }
  }, [resumeData, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!resumeData) return;

    try {
      setLoading(true);

     const res = await axios.post(
  `/api/auth/register`,
  {
    name: resumeData.name,
    email: resumeData.email,
    password,
  }
);


      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!resumeData) return null; // prevent flicker

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Your Account ✨
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Just set a password to continue
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={resumeData.name}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={resumeData.email}
              disabled
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Creating account..." : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
