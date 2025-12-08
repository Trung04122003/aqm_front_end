// src/routes/AppRouter.tsx (UPDATED WITH PASSWORD RESET)
import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AdminLogin from "../auth/AdminLogin";
import AdminRegister from "../auth/AdminRegister";
import Dashboard from "../pages/Dashboard";
import Forecast from "../pages/Forecast";
import Alerts from "../pages/Alerts";
import Reports from "../pages/Reports";
import Support from "../pages/Support";
import PasswordReset from "../pages/PasswordReset"; // ✅ NEW
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersAdmin from "../pages/admin/UsersAdmin";
import SensorsAdmin from "../pages/admin/SensorsAdmin";
import ThresholdsAdmin from "../pages/admin/ThresholdsAdmin";
import AlertsAdmin from "../pages/admin/AlertsAdmin";
import ReportsAdmin from "../pages/admin/ReportsAdmin";
import SupportsAdmin from "../pages/admin/SupportsAdmin"; // ✅ NEW
import SystemLogs from "../pages/admin/SystemLogs";
import Profile from "../pages/Profile";
import AdminProfile from "../pages/admin/AdminProfile";
import ThresholdSettings from "../pages/ThresholdSettings";
import LocationsAdmin from "../pages/admin/LocationsAdmin";

export default function AppRouter() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/forgot-password" element={<PasswordReset />} /> {/* ✅ NEW */}
      <Route path="/reset-password" element={<PasswordReset />} /> {/* ✅ NEW */}

      {/* ==================== USER PROTECTED ROUTES ==================== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<Support />} />
        <Route path="/thresholds" element={<ThresholdSettings />} />
      </Route>

      {/* ==================== ADMIN PROTECTED ROUTES ==================== */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<UsersAdmin />} />
        <Route path="/admin/sensors" element={<SensorsAdmin />} />
        <Route path="/admin/thresholds" element={<ThresholdsAdmin />} />
        <Route path="/admin/alerts" element={<AlertsAdmin />} />
        <Route path="/admin/reports" element={<ReportsAdmin />} />
        <Route path="/admin/supports" element={<SupportsAdmin />} /> {/* ✅ NEW */}
        <Route path="/admin/locations" element={<LocationsAdmin />} />
        <Route path="/admin/logs" element={<SystemLogs />} />
      </Route>

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}