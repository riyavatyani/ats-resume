import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "../pages/Landing";
import ResumeForm from "../pages/ResumeForm";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Preview from "../pages/Preview";
import ResetPassword from "../pages/ResetPassword";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/build" element={<ResumeForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/preview"
        element={
          <PrivateRoute>
            <Preview />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
