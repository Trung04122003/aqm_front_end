// src/pages/admin/SensorsAdmin.tsx - RUDOLF'S SENSOR NETWORK EXTRA FESTIVE EDITION
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

// ❄️ Enhanced Snowflake
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "14px",
      pointerEvents: "none",
      zIndex: 1,
      color: "#e0f7fa",
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      opacity: [0, 1, 1, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 12 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

// 🎄 Christmas Particles
const ChristmasParticle = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -30,
      fontSize: "28px",
      opacity: 0.6,
      pointerEvents: "none",
      zIndex: 1,
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360, 720],
      opacity: [0, 0.8, 0.8, 0],
    }}
    transition={{
      duration: 18 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

// 🦌 Rudolf Animation
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
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        toast.success("🎄 Sensor updated successfully!");
      } else {
        await api.post("/admin/sensors", editing);
        toast.success("🎁 Sensor created successfully!");
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
      toast.success("🎁 Sensor deleted successfully!");
      loadSensors();
    } catch (err) {
      toast.error("Failed to delete sensor");
      console.error(err);
    }
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
          background: "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)",
          borderRadius: 20,
          paddingBottom: 40,
          minHeight: "100vh",
        }}
      >
        {/* Snowfall */}
        {Array.from({ length: 28 }).map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.35} />
        ))}

        {/* Christmas Particles */}
        {[...Array(6)].map((_, i) => (
          <ChristmasParticle
            key={`xmas-${i}`}
            delay={i * 3}
            emoji={["🦌", "🎄", "⭐", "🔔", "📡", "🎁"][i]}
          />
        ))}

        {/* Header */}
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
            style={{ color: "#FFD700" }}
          >
            <FaCandyCane /> RUDOLF'S SENSOR NETWORK <RudolfNose />
          </motion.h1>
          <p style={{ color: "#94a3b8" }}>
            🎅 Candy Cane Engineering Division — Monitoring Santa's air quality
            infrastructure
          </p>
        </motion.div>

        {/* Stats */}
        <div className="row g-3 mb-4 position-relative px-4" style={{ zIndex: 3 }}>
          {[
            {
              label: "Total Sensors",
              value: sensors.length,
              color: "#f87171",
              icon: "📡",
            },
            {
              label: "Active",
              value: sensors.filter((s) => s.status === "ACTIVE").length,
              color: "#10b981",
              icon: "🟢",
            },
            {
              label: "Maintenance",
              value: sensors.filter((s) => s.status === "MAINTENANCE").length,
              color: "#f59e0b",
              icon: "🛠️",
            },
            {
              label: "Inactive",
              value: sensors.filter((s) => s.status === "INACTIVE").length,
              color: "#94a3b8",
              icon: "⚪",
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
                  border: `2px dashed ${stat.color}`,
                  background: `${stat.color}15`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{stat.icon}</div>
                <div
                  className="fw-bold"
                  style={{
                    color: stat.color,
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

        {/* Search + Create */}
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
                    style={{ background: "transparent", color: "#FFD700" }}
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
              <div className="col-12 col-md-6 text-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreate}
                  className="btn d-inline-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    boxShadow: "0 0 20px rgba(239,68,68,0.4)",
                  }}
                >
                  <FaPlus /> Add Sensor
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
                  style={{ width: 60, height: 60, color: "#FFD700" }}
                />
              </div>
            ) : filteredSensors.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div style={{ fontSize: "4rem" }}>📡</div>
                <h5 className="text-muted mt-3">No sensors found</h5>
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
                              background: "rgba(14,165,233,0.2)",
                              color: "#0ea5e9",
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
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
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
                  background: "rgba(26, 35, 50, 0.98)",
                  color: "white",
                  border: "2px solid rgba(239,68,68,0.3)",
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
                      "repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 15px, #fff 15px, #fff 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title text-white">
                    🎄 {editing?.id ? "Edit Sensor" : "Create New Sensor"}
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                          border: "1px solid rgba(239,68,68,0.3)",
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
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      border: "none",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {editing?.id ? "Update Sensor" : "Create Sensor"}
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