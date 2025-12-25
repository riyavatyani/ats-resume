import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resumeId = localStorage.getItem("resumeId");

    if (!resumeId) {
      navigate("/build");
      return;
    }

    fetch(`/api/resume/${resumeId}`)
      .then((res) => res.json())
      .then((data) => setResume(data))
      .catch(() => navigate("/build"));
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!resume) return;

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register", {
        name: resume.name,
        email: resume.email,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // claim guest resume
      await axios.post(
        "/api/resume/claim",
        { resumeId: resume._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ IMPORTANT: prevent blank screen
  if (!resume) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Just set a password to continue
        </p>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              value={resume.name}
              disabled
              className="w-full mt-1 input bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={resume.email}
              disabled
              className="w-full mt-1 input bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 input"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creating account..." : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
