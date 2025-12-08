// src/pages/admin/SensorsAdmin.tsx - SENSOR NETWORK MONITORING: SATELLITE NOEL FUTURE EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaServer,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTools,
  FaCandyCane,
  FaSatelliteDish,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Sensor = {
  id?: number;
  serialNumber: string;
  sensorType: string;
  model: string;
  locationId: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  installationDate?: string;
};

type Location = {
  id: number;
  name: string;
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

// 🎄 Christmas Particles (Gifts, Bells, Stars, Satellites)
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

// 🦌 Rudolf Animation for festive touch
const RudolfNose = () => (
  <motion.div
    animate={{
      scale: [1, 1.3, 1],
      opacity: [1, 0.7, 1],
    }}
    transition={{ duration: 1.5, repeat: Infinity }}
    style={{
      display: "inline-block",
      fontSize: "1.5rem",
    }}
  >
    🔴
  </motion.div>
);

export default function SensorsAdmin() {
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadSensors();
    loadLocations();
  }, []);

  const loadSensors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/sensors");
      setSensors(res.data || []);
    } catch (err) {
      console.error("Failed to load sensors", err);
      toast.error("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  };

  const handleCreate = () => {
    setEditing({
      serialNumber: "",
      sensorType: "",
      model: "",
      locationId: locations[0]?.id || 1,
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const handleEdit = (sensor: Sensor) => {
    setEditing(sensor);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      if (editing.id) {
        await api.put(`/admin/sensors/${editing.id}`, editing);
        toast.success("🛰️ Sensor updated successfully!");
      } else {
        await api.post("/admin/sensors", editing);
        toast.success("🛰️ Sensor created successfully!");
      }
      setShowModal(false);
      loadSensors();
    } catch (err) {
      toast.error("Failed to save sensor");
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this sensor?")) return;

    try {
      await api.delete(`/admin/sensors/${id}`);
      toast.success("🛰️ Sensor deleted successfully!");
      loadSensors();
    } catch (err) {
      toast.error("Failed to delete sensor");
      console.error(err);
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

  const filteredSensors = sensors.filter((s) =>
    [s.serialNumber, s.model, s.sensorType]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FaCheckCircle style={{ color: "#10b981" }} />;
      case "INACTIVE":
        return <FaExclamationTriangle style={{ color: "#ef4444" }} />;
      case "MAINTENANCE":
        return <FaTools style={{ color: "#f59e0b" }} />;
      default:
        return null;
    }
  };

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const getCardColor = (base: string) =>
    theme === "dark" ? `${base}` : "#FFD700";

  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  const getStatusCandyBorder = (status: string) => {
    if (status === "ACTIVE")
      return "2px solid rgba(16,185,129,0.4)";
    if (status === "MAINTENANCE")
      return "2px solid rgba(245,158,11,0.4)";
    return "2px solid rgba(100,116,139,0.4)";
  };

  const getCardGradient = (status: string) => {
    if (status === "ACTIVE")
      return "linear-gradient(135deg, #0f766e, #10b981)";
    if (status === "MAINTENANCE")
      return "linear-gradient(135deg, #d97706, #f59e0b)";
    return "linear-gradient(135deg, #64748b, #475569)";
  };

  const getLocationName = (locationId: number) =>
    locations.find((l) => l.id === locationId)?.name || "Unknown";

  return (
    <AdminLayout>
      <div
        className="position-relative"
        style={{
          background: backgroundStyle,
          borderRadius: 20,
          paddingBottom: 40,
          minHeight: "100vh",
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
                emoji={["🦌", "🎄", "⭐", "🔔", "📡", "🎁", "🛰️", "🔭"][i % 8]}
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

        {/* Header with Enhanced Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 position-relative px-4 pt-4"
          style={{ zIndex: 3 }}
        >
          <motion.h1
            className="fw-bold d-flex align-items-center gap-3"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,215,0,0.5)",
                "0 0 35px rgba(255,215,0,0.7)",
                "0 0 20px rgba(255,215,0,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}
          >
            <FaSatelliteDish /> 
            {theme === "xmas" ? "SANTA'S SATELLITE SENSOR NETWORK" : "FUTURE SATELLITE SENSOR HUB"}
            {theme === "xmas" && <RudolfNose />}
          </motion.h1>
          <p style={{ color: "#94a3b8" }}>
            {theme === "xmas"
              ? "🎅 Monitoring air quality from orbit with Noel tech 🛰️"
              : "Advanced satellite-based sensor monitoring for future air quality infrastructure"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="row g-3 mb-4 position-relative px-4" style={{ zIndex: 3 }}>
          {[
            {
              label: "Total Sensors",
              value: sensors.length,
              color: "#f87171",
              icon: <FaSatelliteDish />,
            },
            {
              label: "Active",
              value: sensors.filter((s) => s.status === "ACTIVE").length,
              color: "#10b981",
              icon: <FaCheckCircle />,
            },
            {
              label: "Maintenance",
              value: sensors.filter((s) => s.status === "MAINTENANCE").length,
              color: "#f59e0b",
              icon: <FaTools />,
            },
            {
              label: "Inactive",
              value: sensors.filter((s) => s.status === "INACTIVE").length,
              color: "#94a3b8",
              icon: <FaExclamationTriangle />,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="col-md-3"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 text-center"
                style={{
                  borderRadius: 18,
                  border: `2px dashed ${getCardColor(stat.color)}`,
                  background: `${getCardColor(stat.color)}15`,
                  backdropFilter: "blur(6px)",
                  boxShadow: glow,
                }}
              >
                <div style={{ fontSize: "2rem", color: getCardColor(stat.color) }}>{stat.icon}</div>
                <div
                  className="fw-bold"
                  style={{
                    color: getCardColor(stat.color),
                    fontSize: "2rem",
                    marginTop: 6,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "#cbd5e1" }}>{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Search + Create + Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-sm mb-4 mx-4"
          style={{
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            zIndex: 3,
            position: "relative",
          }}
        >
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <div
                  className="input-group"
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="input-group-text border-0"
                    style={{ background: "transparent", color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}
                  >
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 text-light"
                    style={{
                      background: "transparent",
                      outline: "none",
                    }}
                    placeholder="Search sensors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 text-end d-flex justify-content-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreate}
                  className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    borderRadius: 12,
                    background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: glow,
                  }}
                >
                  <FaPlus /> Add Sensor
                </motion.button>
                {/* Enhanced Theme Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4 py-2 d-flex align-items-center gap-3"
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
                    {theme === "dark" ? <FaCandyCane size={22} /> : <FaSatelliteDish size={22} />}
                  </motion.div>
                  <span>{theme === "dark" ? "Noel Mode" : "Future Mode"}</span>
                  <motion.div
                    animate={{ rotate: theme === "xmas" ? 0 : 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sensor Grid */}
        <div className="row g-4 position-relative px-4" style={{ zIndex: 3 }}>
          <AnimatePresence>
            {loading ? (
              <div className="col-12 text-center py-5">
                <div
                  className="spinner-border"
                  style={{ width: 60, height: 60, color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}
                />
              </div>
            ) : filteredSensors.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div style={{ fontSize: "4rem", color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>🛰️</div>
                <h5 className="text-muted mt-3">No sensors found in orbit</h5>
              </div>
            ) : (
              filteredSensors.map((sensor, index) => (
                <motion.div
                  key={sensor.id}
                  className="col-12 col-md-6 col-xl-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="card h-100 text-light"
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(6px)",
                      border: getStatusCandyBorder(sensor.status),
                      boxShadow: glow,
                    }}
                  >
                    {/* Candy Cane Top Stripe */}
                    <div
                      className="w-100"
                      style={{
                        height: 6,
                        background:
                          sensor.status === "ACTIVE"
                            ? "repeating-linear-gradient(90deg, #10b981 0px, #10b981 10px, #fff 10px, #fff 20px)"
                            : sensor.status === "MAINTENANCE"
                            ? "repeating-linear-gradient(90deg, #f59e0b 0px, #f59e0b 10px, #fff 10px, #fff 20px)"
                            : "repeating-linear-gradient(90deg, #64748b 0px, #64748b 10px, #fff 10px, #fff 20px)",
                      }}
                    />

                    {/* Header */}
                    <div
                      className="p-3 text-white"
                      style={{
                        background: getCardGradient(sensor.status),
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="small opacity-75">Serial Number</div>
                          <div className="h5 fw-bold">
                            {sensor.serialNumber}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          {getStatusIcon(sensor.status)}
                        </motion.div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaServer className="text-secondary" />
                          <div>
                            <div className="small text-muted">Model</div>
                            <div className="fw-semibold">
                              {sensor.model || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaMapMarkerAlt className="text-secondary" />
                          <div>
                            <div className="small text-muted">Location</div>
                            <div className="fw-semibold">
                              {getLocationName(sensor.locationId)}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="small text-muted">Type:</div>
                          <span
                            className="badge px-2 py-1"
                            style={{
                              background: theme === "xmas" ? "rgba(255,215,0,0.2)" : "rgba(14,165,233,0.2)",
                              color: theme === "xmas" ? "#FFD700" : "#0ea5e9",
                            }}
                          >
                            {sensor.sensorType}
                          </span>
                        </div>
                      </div>

                      {sensor.installationDate && (
                        <div className="small text-muted mb-3">
                          Installed:{" "}
                          {new Date(sensor.installationDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-sm flex-fill"
                          onClick={() => handleEdit(sensor)}
                          style={{
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "white",
                          }}
                        >
                          <FaEdit className="me-1" /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-sm"
                          style={{
                            borderRadius: 10,
                            background: theme === "xmas" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                            border: "none",
                            color: "white",
                          }}
                          onClick={() => handleDelete(sensor.id)}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Christmas Footer */}
        {theme === "xmas" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-5 position-relative px-4"
            style={{ zIndex: 3 }}
          >
            <motion.h3
              className="fw-bold mb-2"
              animate={{
                color: ["#FFD700", "#FF6B6B", "#FFD700"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎅 Satellite Sensors Guiding Santa's Sleigh! 🛰️
            </motion.h3>
            <p className="text-light mb-0">
              Noel Orbit Control - Powered by Rudolf's Red Nose Tech ❄️
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
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  background: theme === "xmas" ? "rgba(26, 35, 50, 0.98)" : "rgba(10, 25, 41, 0.98)",
                  color: "white",
                  border: `2px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                  borderRadius: 16,
                  boxShadow: glow,
                }}
              >
                {/* Candy Cane Top Stripe */}
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
                    {theme === "xmas" ? "🎄" : "🛰️"} {editing?.id ? "Edit Satellite Sensor" : "Deploy New Satellite Sensor"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Serial Number
                      </label>
                      <input
                        className="form-control"
                        value={editing?.serialNumber || ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing!,
                            serialNumber: e.target.value,
                          })
                        }
                        placeholder="SN-001"
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Sensor Type
                      </label>
                      <input
                        className="form-control"
                        value={editing?.sensorType || ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing!,
                            sensorType: e.target.value,
                          })
                        }
                        placeholder="AirQuality"
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Model</label>
                      <input
                        className="form-control"
                        value={editing?.model || ""}
                        onChange={(e) =>
                          setEditing({ ...editing!, model: e.target.value })
                        }
                        placeholder="AQM-Pro"
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Location</label>
                      <select
                        className="form-select"
                        value={editing?.locationId || ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing!,
                            locationId: Number(e.target.value),
                          })
                        }
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      >
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id} style={{ background: "#1a2332" }}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={editing?.status || "ACTIVE"}
                        onChange={(e) =>
                          setEditing({
                            ...editing!,
                            status: e.target.value as Sensor["status"],
                          })
                        }
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      >
                        <option value="ACTIVE" style={{ background: "#1a2332" }}>Active</option>
                        <option value="INACTIVE" style={{ background: "#1a2332" }}>Inactive</option>
                        <option value="MAINTENANCE" style={{ background: "#1a2332" }}>Maintenance</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Installation Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={editing?.installationDate || ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing!,
                            installationDate: e.target.value,
                          })
                        }
                        style={{
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.1)",
                          border: `1px solid ${theme === "xmas" ? "rgba(239,68,68,0.3)" : "rgba(103,232,249,0.3)"}`,
                          color: "white",
                        }}
                      />
                    </div>
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
                    {editing?.id ? "Update Sensor" : "Deploy Sensor"}
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