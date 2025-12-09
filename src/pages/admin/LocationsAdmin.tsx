// src/pages/admin/LocationsAdmin.tsx - EXTRA FESTIVE EDITION

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaMapMarkerAlt, 
  FaGlobeAmericas,
  FaSnowflake,
  FaGift,
  FaMoon,
  FaSun
} from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-toastify";
import AdminLayout from "../../layouts/AdminLayout";

type Location = {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
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

// 🎄 Christmas Particles (Gifts, Bells, Stars)
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

export default function LocationsAdmin() {
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing({
      name: "",
      latitude: 0,
      longitude: 0,
      timezone: "",
    });
    setShowModal(true);
  };

  const handleEdit = (location: Location) => {
    setEditing(location);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) {
      toast.error("Please enter location name");
      return;
    }

    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/admin/locations/${editing.id}`, editing);
        toast.success("🎄 Location updated!");
      } else {
        await api.post("/admin/locations", editing);
        toast.success("🎁 Location created!");
      }
      setShowModal(false);
      loadLocations();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this location?")) return;

    try {
      await api.delete(`/admin/locations/${id}`);
      toast.success("🎁 Location deleted!");
      loadLocations();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Delete failed");
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

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: backgroundStyle,
          transition: "background 0.5s ease",
          padding: "1px",
          marginLeft: -16,
          marginRight: -16,
          marginTop: -16,
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
                emoji={["🎁", "🔔", "⭐", "🎄"][i % 4]}
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

        <div className="container-fluid p-4 position-relative" style={{ zIndex: 2 }}>
          {/* Header with Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          >
            <div>
              <motion.h2
                className="fw-bold mb-1 d-flex align-items-center gap-2"
                animate={{
                  textShadow:
                    theme === "xmas"
                      ? [
                          "0 0 18px rgba(255,215,0,0.4)",
                          "0 0 30px rgba(255,215,0,0.6)",
                          "0 0 18px rgba(255,215,0,0.4)",
                        ]
                      : [
                          "0 0 14px rgba(180,230,255,0.3)",
                          "0 0 20px rgba(180,230,255,0.5)",
                          "0 0 14px rgba(180,230,255,0.3)",
                        ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(90deg, #b3eaff, #e0f7ff)"
                      : "none",
                  WebkitBackgroundClip: theme === "dark" ? "text" : "unset",
                  WebkitTextFillColor:
                    theme === "dark" ? "transparent" : "inherit",
                  color: theme === "xmas" ? "#FFD700" : "#ffffff",
                }}
              >
                <FaGlobeAmericas />
                {theme === "xmas"
                  ? "🎅 Santa's Location Registry"
                  : "🧊 Global Location Manager"}
              </motion.h2>
              <p className="text-light text-opacity-75 mb-0">
                {theme === "xmas"
                  ? "Tracking all monitoring zones around the world ❄️"
                  : "Manage geographic data points for sensor deployment"}
              </p>
            </div>

            <div className="d-flex gap-2">
              {/* Theme Toggle Button */}
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
                  {theme === "dark" ? <FaGift size={22} /> : <FaSnowflake size={22} />}
                </motion.div>
                <span>{theme === "dark" ? "Christmas Mode" : "Arctic Mode"}</span>
                <motion.div
                  animate={{ rotate: theme === "xmas" ? 0 : 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                </motion.div>
              </motion.button>

              {/* Add Location Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn px-4 py-3 d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  border: "none",
                  borderRadius: 50,
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                }}
                onClick={openCreate}
              >
                <FaPlus /> Add Location
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card border-0 h-100"
                style={{
                  borderRadius: 18,
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgba(103,232,249,0.15), rgba(103,232,249,0.05))"
                      : "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,215,0,0.08))",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.3)",
                        border: `2px solid ${theme === "xmas" ? "#FFD700" : "#67e8f9"}`,
                      }}
                    >
                      <FaGlobeAmericas
                        size={28}
                        style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                        {loading ? "..." : locations.length}
                      </h3>
                      <p className="text-light mb-0 small">Total Locations</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card border-0 h-100"
                style={{
                  borderRadius: 18,
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))"
                      : "linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,107,107,0.08))",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: theme === "xmas" ? "rgba(255,107,107,0.3)" : "rgba(16,185,129,0.3)",
                        border: `2px solid ${theme === "xmas" ? "#FF6B6B" : "#10b981"}`,
                      }}
                    >
                      <FaMapMarkerAlt
                        size={28}
                        style={{ color: theme === "xmas" ? "#FF6B6B" : "#10b981" }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: theme === "xmas" ? "#FF6B6B" : "#10b981" }}>
                        {loading ? "..." : locations.filter(l => l.timezone).length}
                      </h3>
                      <p className="text-light mb-0 small">With Timezone</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card border-0 h-100"
                style={{
                  borderRadius: 18,
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))"
                      : "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.08))",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: theme === "xmas" ? "rgba(139,92,246,0.3)" : "rgba(251,191,36,0.3)",
                        border: `2px solid ${theme === "xmas" ? "#8b5cf6" : "#fbbf24"}`,
                      }}
                    >
                      <span style={{ fontSize: "28px" }}>
                        {theme === "xmas" ? "🎄" : "📍"}
                      </span>
                    </motion.div>
                    <div>
                      <h3 className="fw-bold mb-0" style={{ color: theme === "xmas" ? "#8b5cf6" : "#fbbf24" }}>
                        Active
                      </h3>
                      <p className="text-light mb-0 small">System Status</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Locations Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 18,
              background:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255, 215, 0, 0.08)",
              boxShadow: glow,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-4" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                {theme === "xmas" ? "🎁 Registered Locations" : "📍 Location Registry"}
              </h5>

              {loading ? (
                <div className="text-center py-5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="spinner-border"
                    style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}
                  />
                  <p className="text-light mt-3">Loading locations...</p>
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-5">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaMapMarkerAlt size={48} className="mb-3 opacity-50" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }} />
                  </motion.div>
                  <p className="text-light opacity-75 mb-0">No locations found. Add your first location!</p>
                </div>
              ) : (
                <div className="row g-3">
                  {locations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      className="col-md-6 col-lg-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="card border-0 h-100"
                        style={{
                          borderRadius: 12,
                          background:
                            theme === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,215,0,0.12)",
                          backdropFilter: "blur(6px)",
                          border: `1px solid ${theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.2)"}`,
                          boxShadow: theme === "xmas" ? "0 0 15px rgba(255,215,0,0.2)" : "0 0 15px rgba(103,232,249,0.1)",
                        }}
                      >
                        {/* Candy Cane Border (xmas only) */}
                        {theme === "xmas" && (
                          <div
                            className="position-absolute top-0 start-0 w-100"
                            style={{
                              height: 4,
                              borderTopLeftRadius: 12,
                              borderTopRightRadius: 12,
                              background:
                                "repeating-linear-gradient(90deg, #C41E3A 0px, #C41E3A 10px, #fff 10px, #fff 20px)",
                            }}
                          />
                        )}

                        <div className="card-body p-3">
                          <div className="d-flex align-items-start justify-content-between mb-2">
                            <div className="d-flex align-items-center gap-2">
                              <motion.div
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: 40,
                                  height: 40,
                                  background: theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.2)",
                                  color: theme === "xmas" ? "#FFD700" : "#67e8f9",
                                }}
                              >
                                <FaMapMarkerAlt size={18} />
                              </motion.div>
                              <div>
                                <div className="fw-bold text-light">{location.name}</div>
                                <div className="small text-muted">ID: {location.id}</div>
                              </div>
                            </div>
                          </div>

                          <div className="small text-light opacity-75 mb-2">
                            📍 Lat: {location.latitude?.toFixed(4)}, Lng: {location.longitude?.toFixed(4)}
                          </div>

                          {location.timezone && (
                            <div className="small text-light opacity-75 mb-3">
                              🕐 {location.timezone}
                            </div>
                          )}

                          <div className="d-flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-sm flex-fill"
                              style={{
                                background: theme === "xmas" ? "rgba(255,215,0,0.2)" : "rgba(14,165,233,0.2)",
                                border: `1px solid ${theme === "xmas" ? "#FFD700" : "#0ea5e9"}`,
                                color: theme === "xmas" ? "#FFD700" : "#0ea5e9",
                                borderRadius: 8,
                              }}
                              onClick={() => handleEdit(location)}
                            >
                              <FaEdit /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-sm flex-fill"
                              style={{
                                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                border: "none",
                                color: "white",
                                borderRadius: 8,
                              }}
                              onClick={() => handleDelete(location.id)}
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </div>

                        {/* Floating ornament */}
                        {theme === "xmas" && (
                          <motion.div
                            className="position-absolute"
                            style={{ bottom: -5, right: -5, fontSize: 40, opacity: 0.15 }}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            🎁
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Christmas Footer */}
          {theme === "xmas" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-5"
            >
              <motion.h4
                className="fw-bold mb-2"
                animate={{
                  color: ["#FFD700", "#FF6B6B", "#FFD700"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎅 Managing Locations Around The World! 🌍
              </motion.h4>
              <p className="text-light mb-0">
                North Pole Location Registry - Ho Ho Ho! ❄️
              </p>
            </motion.div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal d-block"
              style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", zIndex: 9999 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="modal-content"
                  style={{
                    background: theme === "dark" ? "rgba(26, 35, 50, 0.98)" : "rgba(58, 35, 10, 0.98)",
                    color: "white",
                    border: `2px solid ${theme === "xmas" ? "rgba(255,215,0,0.4)" : "rgba(103,232,249,0.3)"}`,
                    borderRadius: 20,
                    boxShadow: glow,
                  }}
                >
                  {/* Decorative Border */}
                  <div
                    className="position-absolute top-0 start-0 w-100"
                    style={{
                      height: 6,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      background:
                        theme === "xmas"
                          ? "repeating-linear-gradient(90deg, #FFD700 0px, #FFD700 15px, #FF6B6B 15px, #FF6B6B 30px)"
                          : "repeating-linear-gradient(90deg, #67e8f9 0px, #67e8f9 15px, #0ea5e9 15px, #0ea5e9 30px)",
                    }}
                  />

                  <div className="modal-header border-0 pt-4">
                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                      {editing?.id ? (
                        <>
                          <FaEdit style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }} />
                          {theme === "xmas" ? "🎄 Edit Location" : "📍 Edit Location"}
                        </>
                      ) : (
                        <>
                          <FaPlus style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }} />
                          {theme === "xmas" ? "🌍 Create New Location" : "📍 Add Location"}
                        </>
                      )}
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowModal(false)}
                    />
                  </div>

                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <FaMapMarkerAlt className="me-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }} />
                        Location Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editing?.name || ""}
                        onChange={(e) =>
                          setEditing({ ...editing!, name: e.target.value })
                        }
                        placeholder="e.g., Da Nang City"
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `2px solid ${theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                          padding: "12px 16px",
                        }}
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          📍 Latitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={editing?.latitude || ""}
                          onChange={(e) =>
                            setEditing({
                              ...editing!,
                              latitude: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="16.0544"
                          style={{
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.1)",
                            border: `2px solid ${theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                            color: "white",
                            padding: "12px 16px",
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          📍 Longitude
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          className="form-control"
                          value={editing?.longitude || ""}
                          onChange={(e) =>
                            setEditing({
                              ...editing!,
                              longitude: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="108.2022"
                          style={{
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.1)",
                            border: `2px solid ${theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                            color: "white",
                            padding: "12px 16px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        🕐 Timezone (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editing?.timezone || ""}
                        onChange={(e) =>
                          setEditing({ ...editing!, timezone: e.target.value })
                        }
                        placeholder="Asia/Ho_Chi_Minh"
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `2px solid ${theme === "xmas" ? "rgba(255,215,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                          padding: "12px 16px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-0 pb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn px-4 py-3"
                      onClick={() => setShowModal(false)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: 12,
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn px-4 py-3"
                      disabled={saving}
                      onClick={handleSave}
                      style={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        border: "none",
                        borderRadius: 12,
                        color: "white",
                        fontWeight: 600,
                        boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                      }}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          {editing?.id ? "✅ Update" : "🎁 Create"}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}