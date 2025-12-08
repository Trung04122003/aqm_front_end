// src/pages/admin/ThresholdsAdmin.tsx - THRESHOLDS COMMAND CENTER: NOEL DANGER ALERT EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSlidersH,
  FaUserAstronaut,
  FaThermometerHalf,
  FaMoon,
  FaSun,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Threshold = {
  id?: number;
  userId?: number;
  user?: { username: string };
  pm25Threshold?: number;
  pm10Threshold?: number;
  aqiThreshold?: number;
};

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

// 🎄 Christmas Particles (Danger-themed: Alerts, Warnings, Alarms)
const ChristmasParticle = ({ delay, emoji }: { delay: number; emoji: string }) => (
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

// ⚙️ Rotating Gear for danger vibe
const RotatingGear = () => (
  <motion.div
    animate={{ rotate: [0, 360] }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    style={{ display: "inline-block" }}
  >
    <FaSlidersH style={{ color: "#ef4444", fontSize: "1.5rem" }} />
  </motion.div>
);

export default function ThresholdsAdmin() {
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Threshold | null>(null);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/thresholds");
      setThresholds(res.data || []);
    } catch {
      toast.error("Failed to load calibration values");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({
      pm25Threshold: 35,
      pm10Threshold: 50,
      aqiThreshold: 100,
    });
    setShowModal(true);
  };

  const handleEdit = (threshold: Threshold) => {
    setEditing(threshold);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      if (editing.id) {
        await api.put(`/admin/thresholds/${editing.id}`, editing);
        toast.success(theme === "xmas" ? "🎄 Calibration updated!" : "Calibration updated!");
      } else {
        await api.post("/admin/thresholds", editing);
        toast.success(theme === "xmas" ? "🎁 Calibration created!" : "Calibration created!");
      }
      setShowModal(false);
      loadThresholds();
    } catch {
      toast.error("Failed to save calibration");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this calibration profile?")) return;

    try {
      await api.delete(`/admin/thresholds/${id}`);
      toast.success(theme === "xmas" ? "🎁 Calibration deleted!" : "Calibration deleted!");
      loadThresholds();
    } catch {
      toast.error("Failed to delete");
    }
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

  const getLevel = (value?: number, type?: "pm25" | "pm10" | "aqi") => {
    if (!value) return { color: "#10b981", label: "Low" };

    const limits = {
      pm25: { moderate: 35, high: 55 },
      pm10: { moderate: 50, high: 150 },
      aqi: { moderate: 100, high: 150 },
    };

    if (!type) return { color: "#10b981", label: "Low" };

    if (value >= limits[type].high)
      return { color: "#ef4444", label: "High" };
    if (value >= limits[type].moderate)
      return { color: "#f59e0b", label: "Moderate" };
    return { color: "#10b981", label: "Low" };
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
          padding: "1.5rem",
          transition: "background 0.5s ease",
        }}
      >
        {/* Enhanced Snowfall */}
        {[...Array(35)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.2} size={12 + Math.random() * 12} />
        ))}

        {/* Christmas Particles (only in xmas mode) */}
        {theme === "xmas" && (
          <>
            {[...Array(8)].map((_, i) => (
              <ChristmasParticle
                key={`gift-${i}`}
                delay={i * 2}
                emoji={["⚠️", "🎄", "⭐", "🚨", "📊", "🎁", "🔴", "🦌"][i % 8]}
              />
            ))}
          </>
        )}

        {/* Sparkle effects on theme toggle */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        {/* HEADER with Enhanced Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          style={{ position: "relative", zIndex: 2 }}
        >
          <div>
            <motion.h2
              className="mb-1 d-flex align-items-center gap-3"
              animate={{
                textShadow:
                  theme === "xmas"
                    ? [
                        "0 0 15px rgba(239,68,68,0.5)",
                        "0 0 25px rgba(239,68,68,0.7)",
                        "0 0 15px rgba(239,68,68,0.5)",
                      ]
                    : [
                        "0 0 15px rgba(14,165,233,0.5)",
                        "0 0 25px rgba(14,165,233,0.7)",
                        "0 0 15px rgba(14,165,233,0.5)",
                      ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: theme === "xmas" ? "#ef4444" : "#0ea5e9", fontWeight: 700 }}
            >
              <RotatingGear />
              {theme === "xmas" ? "Santa's Danger Threshold Command Center 🚨" : "Thresholds Command Center 🚨"}
            </motion.h2>
            <p className="text-light text-opacity-75 mb-4">
              {theme === "xmas" ? "Calibrating Naughty Air Warnings for the North Pole ❄️" : "Configure sensor thresholds for alert generation"}
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
              {theme === "dark" ? <FaExclamationTriangle size={22} /> : <FaSlidersH size={22} />}
            </motion.div>
            <span>{theme === "dark" ? "Noel Danger Mode" : "Dark Mode"}</span>
            <motion.div
              animate={{ rotate: theme === "xmas" ? 0 : 360 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* STATS */}
        <div className="row g-3 mb-4" style={{ position: "relative", zIndex: 2 }}>
          {/* TOTAL */}
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card border-0 shadow-sm"
              style={{
                borderRadius: 16,
                background: theme === "xmas" ? "linear-gradient(135deg,#ef4444 0%,#dc2626 100%)" : "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)",
              }}
            >
              <div className="card-body text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="h3 fw-bold">{thresholds.length}</div>
                    <small className="opacity-75">Calibration Profiles</small>
                  </div>
                  <FaSlidersH size={32} className="opacity-50" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* HIGH SENSITIVITY */}
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card border-0 shadow-sm"
              style={{
                borderRadius: 16,
                background: theme === "xmas" ? "linear-gradient(135deg,#f43f5e 0%,#be123c 100%)" : "linear-gradient(135deg,#f43f5e 0%,#be123c 100%)",
              }}
            >
              <div className="card-body text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="h3 fw-bold">
                      {thresholds.filter((t) => (t.aqiThreshold || 0) > 120).length}
                    </div>
                    <small className="opacity-75">High-Risk Sensors</small>
                  </div>
                  <FaGaugeHigh size={32} className="opacity-50" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* AVERAGE AQI */}
          <div className="col-md-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card border-0 shadow-sm"
              style={{
                borderRadius: 16,
                background: theme === "xmas" ? "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)" : "linear-gradient(135deg,#22c55e 0%,#15803d 100%)",
              }}
            >
              <div className="card-body text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="h3 fw-bold">
                      {Math.round(
                        thresholds.reduce((acc, t) => acc + (t.aqiThreshold || 0), 0) /
                          (thresholds.length || 1)
                      )}
                    </div>
                    <small className="opacity-75">Average AQI Threshold</small>
                  </div>
                  <FaThermometerHalf size={32} className="opacity-50" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ACTION BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: 16,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(6px)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="card-body p-3 d-flex justify-content-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
              onClick={handleCreate}
              style={{
                borderRadius: 12,
                background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                border: "none",
                color: "white",
                fontWeight: 600,
                boxShadow: glow,
              }}
            >
              <FaPlus /> New Calibration
            </motion.button>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="row g-4" style={{ position: "relative", zIndex: 2 }}>
          <AnimatePresence>
            {loading ? (
              <div className="col-12 text-center py-5">
                <div
                  className="spinner-border"
                  style={{ width: 60, height: 60, color: theme === "xmas" ? "#ef4444" : "#0ea5e9" }}
                />
              </div>
            ) : thresholds.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div style={{ fontSize: "4rem" }}>🚨</div>
                <h5 className="text-muted mt-3">No calibration profiles available</h5>
              </div>
            ) : (
              thresholds.map((threshold, index) => {
                const levelAqi = getLevel(threshold.aqiThreshold, "aqi");
                return (
                  <motion.div
                    key={threshold.id}
                    className="col-12 col-md-6 col-xl-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        borderRadius: 18,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {/* Candy Cane Top Border */}
                      <div
                        className="w-100"
                        style={{
                          height: 6,
                          background:
                            theme === "xmas"
                              ? "repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 10px, #fff 10px, #fff 20px)"
                              : "repeating-linear-gradient(90deg, #0ea5e9 0px, #0ea5e9 10px, #fff 10px, #fff 20px)",
                        }}
                      />

                      {/* HEADER */}
                      <div
                        className="p-3 text-white"
                        style={{
                          background: theme === "xmas" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#0ea5e9,#0369a1)",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <FaUserAstronaut />
                            <div>
                              <small className="opacity-75">User</small>
                              <div className="fw-bold">
                                {threshold.user?.username || `User ID: ${threshold.userId}`}
                              </div>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          >
                            <FaSlidersH size={24} className="opacity-50" />
                          </motion.div>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="card-body p-4">
                        {/* PM2.5 */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-2">PM 2.5</h6>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold text-light">
                              {threshold.pm25Threshold?.toFixed(1) ?? "N/A"} µg/m³
                            </span>
                            <span
                              className="badge px-2 py-1"
                              style={{
                                background: getLevel(threshold.pm25Threshold, "pm25").color,
                                color: "white",
                              }}
                            >
                              {getLevel(threshold.pm25Threshold, "pm25").label}
                            </span>
                          </div>
                          <div
                            className="progress"
                            style={{ height: 8, borderRadius: 4, background: "#1e293b" }}
                          >
                            <motion.div
                              className="progress-bar"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((threshold.pm25Threshold || 0) / 100) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              style={{
                                background: getLevel(threshold.pm25Threshold, "pm25").color,
                              }}
                            />
                          </div>
                        </div>

                        {/* PM10 */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-2">PM 10</h6>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold text-light">
                              {threshold.pm10Threshold?.toFixed(1) ?? "N/A"} µg/m³
                            </span>
                            <span
                              className="badge px-2 py-1"
                              style={{
                                background: getLevel(threshold.pm10Threshold, "pm10").color,
                                color: "white",
                              }}
                            >
                              {getLevel(threshold.pm10Threshold, "pm10").label}
                            </span>
                          </div>
                          <div
                            className="progress"
                            style={{ height: 8, borderRadius: 4, background: "#1e293b" }}
                          >
                            <motion.div
                              className="progress-bar"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((threshold.pm10Threshold || 0) / 200) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.1 }}
                              style={{
                                background: getLevel(threshold.pm10Threshold, "pm10").color,
                              }}
                            />
                          </div>
                        </div>

                        {/* AQI */}
                        <div className="mb-4">
                          <h6 className="text-muted mb-2">AQI</h6>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold text-light">
                              {threshold.aqiThreshold}
                            </span>
                            <span
                              className="badge px-2 py-1"
                              style={{
                                background: levelAqi.color,
                                color: "white",
                              }}
                            >
                              {levelAqi.label}
                            </span>
                          </div>
                          <div
                            className="progress"
                            style={{ height: 8, borderRadius: 4, background: "#1e293b" }}
                          >
                            <motion.div
                              className="progress-bar"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${((threshold.aqiThreshold || 0) / 200) * 100}%`,
                              }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                              style={{ background: levelAqi.color }}
                            />
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm flex-fill"
                            onClick={() => handleEdit(threshold)}
                            style={{
                              borderRadius: 10,
                              background: theme === "xmas" ? "rgba(239,68,68,0.2)" : "rgba(14,165,233,0.2)",
                              border: theme === "xmas" ? "1px solid #ef4444" : "1px solid #0ea5e9",
                              color: theme === "xmas" ? "#ef4444" : "#0ea5e9",
                            }}
                          >
                            <FaEdit className="me-1" /> Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-sm"
                            onClick={() => handleDelete(threshold.id)}
                            style={{
                              borderRadius: 10,
                              background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                              border: "none",
                              color: "white",
                            }}
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Christmas Footer */}
        {theme === "xmas" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-5"
            style={{ position: "relative", zIndex: 2 }}
          >
            <motion.h3
              className="fw-bold mb-2"
              animate={{
                color: ["#ef4444", "#FF6B6B", "#ef4444"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎅 Danger Thresholds: Keeping the North Pole Safe! 🚨
            </motion.h3>
            <p className="text-light mb-0">
              Noel Alert Calibration Lab - Powered by Elf Engineers ❄️
            </p>
          </motion.div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  background: "rgba(26, 35, 50, 0.98)",
                  color: "white",
                  border: theme === "xmas" ? "2px solid rgba(239,68,68,0.3)" : "2px solid rgba(14,165,233,0.3)",
                  borderRadius: 16,
                }}
              >
                {/* Candy Cane Border */}
                <div
                  className="position-absolute top-0 start-0 w-100"
                  style={{
                    height: 6,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background:
                      theme === "xmas"
                        ? "repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 15px, #fff 15px, #fff 30px)"
                        : "repeating-linear-gradient(90deg, #0ea5e9 0px, #0ea5e9 15px, #fff 15px, #fff 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title text-white">
                    {theme === "xmas" ? "🎄" : "🚨"} {editing?.id ? "Recalibrate Threshold" : "Create Calibration"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4">
                  {/* PM2.5 */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">PM 2.5 Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editing?.pm25Threshold || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, pm25Threshold: Number(e.target.value) })
                      }
                      placeholder="35"
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: theme === "xmas" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(14,165,233,0.3)",
                        color: "white",
                      }}
                    />
                  </div>

                  {/* PM10 */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">PM 10 Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editing?.pm10Threshold || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, pm10Threshold: Number(e.target.value) })
                      }
                      placeholder="50"
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: theme === "xmas" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(14,165,233,0.3)",
                        color: "white",
                      }}
                    />
                  </div>

                  {/* AQI */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">AQI Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editing?.aqiThreshold || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, aqiThreshold: Number(e.target.value) })
                      }
                      placeholder="100"
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: theme === "xmas" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(14,165,233,0.3)",
                        color: "white",
                      }}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    onClick={() => setShowModal(false)}
                    style={{
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "white",
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    onClick={handleSave}
                    style={{
                      borderRadius: 12,
                      background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                      border: "none",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {editing?.id ? "Save Changes" : "Create Calibration"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}