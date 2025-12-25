import { useEffect, useState } from "react";
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

    axios
      .get(`/api/resume/${resumeId}`)
      .then((res) => setResume(res.data))
      .catch(() => navigate("/build"));
  }, [navigate]);

  if (!resume) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

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

      // claim resume
      await axios.post(
        "/api/resume/claim",
        { resumeId: resume._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-8 border">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Just set a password to continue
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            value={resume.name}
            disabled
            className="input bg-gray-100"
          />
          <input
            value={resume.email}
            disabled
            className="input bg-gray-100"
          />

          <input
            type="password"
            placeholder="Create password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          <button
            disabled={loading}
            className="w-full bg-violet-600 text-white py-2 rounded-lg"
          >
            {loading ? "Creating..." : "Continue →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
