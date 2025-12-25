import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔥 ALWAYS normalize email on frontend
      const res = await axios.post(
        `/api/auth/login`,
        {
          email: email.toLowerCase().trim(),
          password,
        }
      );

      // 🔐 Save auth
const token = res.data.token;
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(res.data.user));

// 🔥 CLAIM GUEST RESUME IF EXISTS
const resumeId = localStorage.getItem("resumeId");

if (resumeId) {
  try {
    await axios.post(
      "/api/resume/claim",
      { resumeId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("RESUME CLAIM FAILED 👉", err);
    // do NOT block login for this
  }
}

// ✅ NOW go to dashboard
navigate("/dashboard");


    } catch (err) {
      console.error(
        "LOGIN ERROR 👉",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue building your resume
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full input"
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
              placeholder="••••••••"
              className="mt-1 w-full input"
            />
          </div>

          <div className="text-right">
            <Link
              to="/reset-password"
              className="text-sm text-violet-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/build"
            className="text-violet-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
