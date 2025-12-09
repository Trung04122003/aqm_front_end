// src/pages/admin/AdminProfile.tsx - PROFILE FROZEN HEART: NOEL SECURITY EDITION
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaSnowflake,
  FaCandyCane,
  FaMoon,
  FaSun,
  FaHeart,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthProvider";

// ❄️ Enhanced Snowflake with varied sizes
const Snowflake = ({ delay, size = 18 }: { delay: number; size?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: `${size}px`,
      opacity: 0.8,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 50 - 25],
    }}
    transition={{
      duration: 9 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

// 🎄 Floating Christmas Icons (Security-themed: Shields, Locks, Hearts)
const ChristmasIcon = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -30,
      fontSize: `${20 + Math.random() * 15}px`,
      opacity: 0.7,
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 5px rgba(255,215,0,0.6))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360, 720],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 100 - 50],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

// ✨ Sparkle effect for theme toggle
const Sparkle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="position-fixed"
    style={{
      left: x,
      top: y,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "radial-gradient(circle, #FFD700, transparent)",
      pointerEvents: "none",
      zIndex: 9999,
    }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 3, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
);

// ✨ Success Confetti
const Confetti = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="position-fixed"
    style={{
      left: x,
      top: y,
      fontSize: "24px",
      pointerEvents: "none",
      zIndex: 9999,
    }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{
      y: [0, -100, 200],
      x: [0, Math.random() * 200 - 100],
      rotate: [0, 360, 720],
      opacity: [1, 1, 0],
      scale: [1, 1.5, 0],
    }}
    transition={{ duration: 2, ease: "easeOut" }}
  >
    {["🎉", "🎊", "⭐", "✨"][Math.floor(Math.random() * 4)]}
  </motion.div>
);

export default function AdminProfile() {
  useAuth();
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

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

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newConfetti = Array.from({ length: 15 }, (_, i) => ({
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 50,
      id: Date.now() + i,
    }));

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };

  // Theme toggle with sparkle effect
  const handleThemeToggle = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create sparkles
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      id: Date.now() + i,
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);

    setTheme((prev) => (prev === "dark" ? "xmas" : "dark"));
  };

  const handleSave = async (e: React.MouseEvent) => {
    setLoading(true);
    try {
      await api.put("/admin/profile", formData);
      toast.success(theme === "xmas" ? "🎅 Admin profile updated successfully!" : "Admin profile updated successfully!");
      setEditing(false);
      triggerConfetti(e);
      loadProfile();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.MouseEvent) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/profile/change-password", passwordData);
      toast.success(theme === "xmas" ? "🎄 Password changed successfully!" : "Password changed successfully!");
      triggerConfetti(e);
      setChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: backgroundStyle,
          padding: "2rem",
          transition: "background 0.5s ease",
        }}
      >
        {/* Enhanced Snowfall */}
        {[...Array(35)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.2} size={12 + Math.random() * 12} />
        ))}

        {/* Christmas Icons (only in xmas mode) */}
        {theme === "xmas" && (
          <>
            {[...Array(8)].map((_, i) => (
              <ChristmasIcon
                key={`xmas-${i}`}
                delay={i * 2}
                emoji={["🎁", "🔔", "⭐", "🎄", "🛡️", "🔒", "❤️", "🦌"][i % 8]}
              />
            ))}
          </>
        )}

        {/* Confetti on save */}
        <AnimatePresence>
          {confetti.map((c) => (
            <Confetti key={c.id} x={c.x} y={c.y} />
          ))}
        </AnimatePresence>

        {/* Sparkle effects on theme toggle */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        {/* Header with Enhanced Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div>
            <motion.h2
              className="fw-bold mb-1 d-flex align-items-center gap-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,220,100,0.5)",
                  "0 0 20px rgba(255,220,100,0.8)",
                  "0 0 10px rgba(255,220,100,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: theme === "xmas" ? "#FFD700" : "#0ea5e9" }}
            >
              <FaHeart style={{ color: "#0ea5e9" }} /> 
              {theme === "xmas" ? "Santa's Frozen Heart Profile ❄️" : "Profile Frozen Heart ❄️"}
            </motion.h2>
            <p className="text-light opacity-75 mb-0">
              {theme === "xmas" ? "Secure Your Elf Credentials in the Frozen Fortress ❄️" : "Manage your operator credentials & command privileges."}
            </p>
          </div>

          {/* Enhanced Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn px-4 py-3 d-flex align-items-center gap-3"
            onClick={handleThemeToggle}
            style={{
              borderRadius: 50,
              background:
                theme === "xmas"
                  ? "linear-gradient(135deg, #C41E3A, #8B0000)"
                  : "linear-gradient(135deg, #0ea5e9, #0369a1)",
              border: "none",
              boxShadow: glow,
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            <motion.div
              animate={{ rotate: theme === "xmas" ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <FaCandyCane size={22} /> : <FaSnowflake size={22} />}
            </motion.div>
            <span>{theme === "dark" ? "Frozen Heart Noel Mode" : "Dark Mode"}</span>
            <motion.div
              animate={{ rotate: theme === "xmas" ? 0 : 360 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Profile Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto position-relative"
          style={{
            maxWidth: 700,
            borderRadius: 20,
            backdropFilter: "blur(16px)",
            background: "rgba(255,255,255,0.08)",
            border: theme === "xmas" ? "2px solid #FFD700" : "2px solid #0ea5e9",
            padding: "2.5rem",
            boxShadow: glow,
          }}
        >
          {/* Candy Cane Top Border */}
          <div
            className="position-absolute top-0 start-0 w-100"
            style={{
              height: 6,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              background:
                theme === "xmas"
                  ? "repeating-linear-gradient(90deg, #C41E3A 0px, #C41E3A 15px, #fff 15px, #fff 30px)"
                  : "repeating-linear-gradient(90deg, #0ea5e9 0px, #0ea5e9 15px, #fff 15px, #fff 30px)",
            }}
          />

          {/* Floating Stars */}
          <motion.div
            className="position-absolute"
            style={{ top: 20, right: 20, fontSize: "2rem" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ⭐
          </motion.div>

          {/* Avatar Section */}
          <div className="text-center mb-4">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15, rotate: 15 }}
              style={{
                width: 130,
                height: 130,
                margin: "0 auto",
                borderRadius: "50%",
                border: theme === "xmas" ? "4px solid #FFD700" : "4px solid #0ea5e9",
                background: theme === "xmas" ? "linear-gradient(135deg, #C41E3A, #8B0000)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                cursor: "pointer",
                boxShadow: glow,
              }}
            >
              🎅
            </motion.div>
            <motion.h4
              className="fw-bold mt-3"
              style={{ color: theme === "xmas" ? "#FFD700" : "#0ea5e9" }}
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,220,100,0.5)",
                  "0 0 20px rgba(255,220,100,0.8)",
                  "0 0 10px rgba(255,220,100,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formData.username || "Santa's Helper"}
            </motion.h4>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1"
              style={{
                background: theme === "xmas" ? "rgba(255,215,0,0.2)" : "rgba(103,232,249,0.2)",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              <FaSnowflake className="text-info" />
              <span className="text-light small fw-semibold">System Operator</span>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="text-end mb-4">
            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.button
                  key="edit-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4 py-2"
                  style={{
                    borderRadius: 12,
                    background: theme === "xmas" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: glow,
                  }}
                  onClick={() => setEditing(true)}
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </motion.button>
              ) : (
                <motion.div
                  key="save-btns"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="d-flex gap-2 justify-content-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn px-4 py-2"
                    style={{
                      borderRadius: 12,
                      background: theme === "xmas" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                      border: "none",
                      color: "white",
                      fontWeight: 600,
                      boxShadow: glow,
                    }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <FaSave className="me-2" />
                    {loading ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary px-4 py-2"
                    style={{ borderRadius: 12, fontWeight: 600 }}
                    onClick={() => setEditing(false)}
                  >
                    <FaTimes className="me-2" />
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Section */}
          <div className="text-light">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-3"
            >
              <label className="fw-semibold mb-2 d-flex align-items-center gap-2">
                <FaUser className="text-warning" /> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={!editing}
                style={{
                  borderRadius: 12,
                  background: editing
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.08)",
                  color: "white",
                  border: editing
                    ? "2px solid rgba(255,215,0,0.5)"
                    : "1px solid rgba(255,255,255,0.2)",
                  padding: "12px 16px",
                }}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-3"
            >
              <label className="fw-semibold mb-2 d-flex align-items-center gap-2">
                <FaEnvelope className="text-info" /> Email
              </label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!editing}
                style={{
                  borderRadius: 12,
                  background: editing
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.08)",
                  color: "white",
                  border: editing
                    ? "2px solid rgba(14,165,233,0.5)"
                    : "1px solid rgba(255,255,255,0.2)",
                  padding: "12px 16px",
                }}
              />
            </motion.div>

            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <label className="fw-semibold mb-2 d-flex align-items-center gap-2">
                <FaIdCard className="text-success" /> Username
              </label>
              <input
                type="text"
                className="form-control"
                disabled
                value={formData.username}
                style={{
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "12px 16px",
                }}
              />
              <small className="text-muted d-block mt-1">
                🔒 Username cannot be changed
              </small>
            </motion.div>
          </div>

          {/* Password Section */}
          <hr className="border-light opacity-25 my-4" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-100 py-3"
            style={{
              borderRadius: 14,
              background: changingPassword
                ? "linear-gradient(135deg, #64748b, #475569)"
                : theme === "xmas" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
              border: "none",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: changingPassword
                ? "0 0 20px rgba(100,116,139,0.4)"
                : glow,
            }}
            onClick={() => setChangingPassword(!changingPassword)}
          >
            <FaLock className="me-2" />
            {changingPassword ? "Cancel Password Change" : "Change Password"}
          </motion.button>

          <AnimatePresence>
            {changingPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <input
                  type="password"
                  className="form-control mb-3"
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
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: theme === "xmas" ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(103,232,249,0.3)",
                    padding: "12px 16px",
                  }}
                />
                <input
                  type="password"
                  className="form-control mb-3"
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
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: theme === "xmas" ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(103,232,249,0.3)",
                    padding: "12px 16px",
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
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    border: theme === "xmas" ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(103,232,249,0.3)",
                    padding: "12px 16px",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn w-100 py-3"
                  style={{
                    borderRadius: 12,
                    background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: glow,
                  }}
                  disabled={loading}
                  onClick={handleChangePassword}
                >
                  {loading ? "Updating..." : "🎄 Confirm Password Change"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative Footer */}
          <motion.div
            className="text-center mt-4 pt-3 border-top border-secondary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <small className="text-light opacity-75">
              {theme === "xmas" ? "🎅 Secured by Frozen Heart Encryption ❄️" : "🎅 Secured by North Pole Encryption ❄️"}
            </small>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}