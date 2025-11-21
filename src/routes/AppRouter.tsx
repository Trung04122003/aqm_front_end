// src/AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminLogin from "../auth/AdminLogin";
import AdminRegister from "../auth/AdminRegister";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import SensorsAdmin from "../pages/admin/SensorsAdmin";
import ThresholdsAdmin from "../pages/admin/ThresholdsAdmin";
import GuestNavbar from "../components/GuestNavbar";

export default function AppRouter() {
  return (
    <>
      <GuestNavbar />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* User-protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<Dashboard />} />
          {/* other user routes */}
        </Route>

        {/* Admin-protected */}
        <Route element={<AdminRoute />}>
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          <Route path="/admin/sensors" element={<SensorsAdmin />} />
          <Route path="/admin/thresholds" element={<ThresholdsAdmin />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}
