// src/pages/admin/AdminProfile.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaLock,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthProvider";

// ❄ Snowflake drifting like other pages
const Snowflake = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${10 + Math.random() * 80}%`,
      top: -20,
      fontSize: "12px",
      pointerEvents: "none",
      color: "rgba(255,255,255,0.6)",
      zIndex: 1,
    }}
    animate={{
      y: ["-2vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 12 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

export default function AdminProfile() {
  useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/admin/profile");
      setFormData({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        username: res.data.username || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/admin/profile", formData);
      toast.success("🎅 Admin profile updated successfully!");
      setEditing(false);
      loadProfile();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/profile/change-password", passwordData);
      toast.success("🎄 Password changed successfully!");
      setChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        {[...Array(18)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.4} />
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-2"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h2
            className="fw-bold mb-1"
            style={{
              color: "white",
              textShadow: "0px 0px 10px rgba(255,220,100,0.5)",
            }}
          >
            ⭐ North Pole Operator Profile
          </h2>
          <p className="text-light opacity-75">
            Manage your operator credentials & command privileges.
          </p>
        </motion.div>

        {/* Profile Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="shadow-sm mx-auto"
          style={{
            maxWidth: 650,
            borderRadius: 18,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            position: "relative",
            padding: "2rem",
          }}
        >
          {/* Avatar Section */}
          <div className="text-center mb-4">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: 110,
                height: 110,
                margin: "0 auto",
                borderRadius: "50%",
                border: "4px solid #FFD700",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "#fffbe6",
              }}
            >
              🎅
            </motion.div>

            <h4 className="fw-bold text-light mt-3">{formData.username}</h4>
            <span className="text-info opacity-75">System Operator</span>
          </div>

          {/* Edit Controls */}
          <div className="text-end mb-3">
            {!editing ? (
              <button
                className="btn btn-sm btn-info"
                style={{ borderRadius: 10 }}
                onClick={() => setEditing(true)}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>
            ) : (
              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-sm btn-success"
                  style={{ borderRadius: 10 }}
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FaSave className="me-2" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ borderRadius: 10 }}
                  onClick={() => setEditing(false)}
                >
                  <FaTimes className="me-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="text-light">
            <label className="fw-semibold mt-3 d-flex align-items-center gap-2">
              <FaUser /> Full Name
            </label>
            <input
              type="text"
              className="form-control mb-3"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              disabled={!editing}
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            />

            <label className="fw-semibold d-flex align-items-center gap-2">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              className="form-control mb-3"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!editing}
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            />

            <label className="fw-semibold d-flex align-items-center gap-2">
              <FaIdCard /> Username
            </label>
            <input
              type="text"
              className="form-control mb-2"
              disabled
              value={formData.username}
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.05)",
                color: "white",
              }}
            />
            <small className="opacity-50">Username cannot be changed</small>
          </div>

          {/* Password Section */}
          <hr className="border-light opacity-25 my-4" />

          <button
            className="btn btn-warning w-100"
            style={{
              borderRadius: 12,
              fontWeight: 600,
            }}
            onClick={() => setChangingPassword(!changingPassword)}
          >
            <FaLock className="me-2" />
            {changingPassword ? "Cancel" : "Change Password"}
          </button>

          {changingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3"
            >
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />

              <button
                className="btn btn-danger w-100"
                style={{ borderRadius: 12, fontWeight: 600 }}
                disabled={loading}
                onClick={handleChangePassword}
              >
                {loading ? "Updating..." : "Confirm Password Change"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
