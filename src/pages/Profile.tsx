// src/pages/Profile.tsx - CHRISTMAS PROFILE PAGE WITH EMAIL TOGGLE 🎅
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaBell,
} from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";

// Snowflake component
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "20px",
      pointerEvents: "none",
      zIndex: 1,
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

export default function ChristmasProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    emailAlertsEnabled: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        emailAlertsEnabled: user.emailAlertsEnabled,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/user/profile", formData);
      toast.success("🎅 Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating Snowflakes */}
        {[...Array(15)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.5} />
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="d-flex align-items-center gap-3 mb-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
                color: "white",
                border: "3px solid #FFD700",
                fontSize: "20px",
              }}
            >
              ←
            </motion.a>
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: "#C41E3A" }}>
                🎅 My Christmas Profile
              </h2>
              <p className="text-muted mb-0">Manage your account settings</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-lg"
          style={{
            borderRadius: 24,
            border: "3px solid #FFD700",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            className="p-4 text-white text-center"
            style={{
              background: "linear-gradient(135deg, #C41E3A, #165B33)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mb-3"
              style={{
                width: 100,
                height: 100,
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                border: "4px solid #FFD700",
              }}
            >
              🎅
            </motion.div>
            <h4 className="mb-0 fw-bold">{formData.username}</h4>
            <small className="opacity-75">{user?.role || "User"}</small>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            {/* Edit Toggle Button */}
            <div className="text-end mb-3">
              {!editing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-sm"
                  style={{
                    background: "linear-gradient(135deg, #165B33, #50C878)",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "8px 16px",
                  }}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="d-flex gap-2 justify-content-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-success"
                    style={{ borderRadius: 12 }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <FaSave className="me-2" />
                    {loading ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-secondary"
                    style={{ borderRadius: 12 }}
                    onClick={() => setEditing(false)}
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="mb-3">
              <label
                className="form-label fw-semibold d-flex align-items-center gap-2"
                style={{ color: "#C41E3A" }}
              >
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                style={{ borderRadius: 12, border: "2px solid #165B33" }}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-semibold d-flex align-items-center gap-2"
                style={{ color: "#C41E3A" }}
              >
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                className="form-control"
                style={{ borderRadius: 12, border: "2px solid #165B33" }}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!editing}
              />
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-semibold d-flex align-items-center gap-2"
                style={{ color: "#C41E3A" }}
              >
                <FaIdCard /> Username
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  borderRadius: 12,
                  border: "2px solid #165B33",
                  background: "#f8f9fa",
                }}
                value={formData.username}
                disabled
              />
              <small className="text-muted">Username cannot be changed</small>
            </div>

            {/* ✅ EMAIL ALERTS TOGGLE */}
            <div
              className="mb-3 p-3 rounded-3"
              style={{
                background: "rgba(22, 91, 51, 0.05)",
                border: "2px solid #165B33",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: formData.emailAlertsEnabled
                      ? "linear-gradient(135deg, #165B33, #50C878)"
                      : "linear-gradient(135deg, #6c757d, #495057)",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                >
                  {formData.emailAlertsEnabled ? "📧" : "🔕"}
                </div>
                <div className="flex-grow-1">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailAlertsToggle"
                      checked={formData.emailAlertsEnabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailAlertsEnabled: e.target.checked,
                        })
                      }
                      disabled={!editing}
                      style={{
                        cursor: editing ? "pointer" : "not-allowed",
                        width: "3rem",
                        height: "1.5rem",
                      }}
                    />
                    <label
                      className="form-check-label fw-semibold d-flex align-items-center gap-2"
                      htmlFor="emailAlertsToggle"
                      style={{
                        color: "#165B33",
                        cursor: editing ? "pointer" : "default",
                      }}
                    >
                      <FaBell />
                      Email Alert Notifications
                      {formData.emailAlertsEnabled && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="badge bg-success"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Active 🎅
                        </motion.span>
                      )}
                    </label>
                  </div>
                  <small className="text-muted">
                    {formData.emailAlertsEnabled
                      ? "✅ You will receive email notifications when air quality exceeds your thresholds"
                      : "🔕 Email notifications are currently disabled"}
                  </small>
                </div>
              </div>
            </div>

            {/* Info Box */}
            {formData.emailAlertsEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="alert d-flex align-items-center gap-2"
                style={{
                  background: "rgba(255, 215, 0, 0.1)",
                  border: "2px solid #FFD700",
                  borderRadius: 12,
                  color: "#165B33",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>💡</span>
                <div>
                  <strong>Tip:</strong> Go to{" "}
                  <a href="/thresholds" style={{ color: "#C41E3A" }}>
                    Alert Settings
                  </a>{" "}
                  to customize your notification thresholds.
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-5 py-4"
        >
          <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>
            🎅 Merry Christmas! 🎄
          </h4>
          <p style={{ color: "#165B33" }}>
            Keep your profile updated for the best experience! ❄️
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}