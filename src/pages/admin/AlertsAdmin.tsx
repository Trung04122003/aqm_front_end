// src/pages/admin/AlertsAdmin.tsx - EXTRA FESTIVE EDITION
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaSearch, FaBell, FaExclamationTriangle } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// TYPES
type Alert = {
  id: number;
  user: { username: string };
  location: { name: string };
  pollutant: string;
  value: number;
  triggeredAt: string;
  isRead: boolean;
};

// ❄️ Enhanced Snowflake
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: Math.random() * 14 + 10,
      opacity: 0.75,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      opacity: [0, 1, 1, 0],
      rotate: [0, 360],
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

// 🎄 Christmas Ornaments
const ChristmasOrnament = ({ delay, emoji }: { delay: number; emoji: string }) => (
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
      scale: [0.8, 1.3, 0.8],
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

// ✨ Delete Sparkle Effect
const DeleteSparkle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="position-fixed"
    style={{
      left: x,
      top: y,
      fontSize: "20px",
      pointerEvents: "none",
      zIndex: 9999,
    }}
    initial={{ scale: 1, opacity: 1 }}
    animate={{
      y: [0, -80],
      scale: [1, 2, 0],
      opacity: [1, 1, 0],
      rotate: [0, 360],
    }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    💥
  </motion.div>
);

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/alerts");
      const data = Array.isArray(res.data) ? res.data : [];
      setAlerts(data);
      if (data.length === 0) {
        toast.info("No alerts available");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to load alerts";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    if (!confirm("Delete this alert?")) return;

    // Trigger sparkle effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setSparkles([{ x, y, id: Date.now() }]);
    setTimeout(() => setSparkles([]), 1000);

    try {
      await api.delete(`/admin/alerts/${id}`);
      toast.success("🎁 Alert deleted!");
      loadAlerts();
    } catch {
      toast.error("Failed to delete alert");
    }
  };

  const filteredAlerts = useMemo(() => {
    if (!Array.isArray(alerts)) return [];
    return alerts
      .filter((a) => {
        if (filter === "read") return a.isRead;
        if (filter === "unread") return !a.isRead;
        return true;
      })
      .filter(
        (a) =>
          a.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.pollutant.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [alerts, filter, searchQuery]);

  // 🎄 Enhanced Severity with Christmas Icons
  const getSeverity = (value: number) => {
    if (value >= 150)
      return {
        icon: "🔴",
        label: "Critical",
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.15)",
        emoji: "🚨",
      };
    if (value >= 80)
      return {
        icon: "🟠",
        label: "Warning",
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
        emoji: "⚠️",
      };
    return {
      icon: "🌲",
      label: "Info",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.15)",
      emoji: "✅",
    };
  };

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: "linear-gradient(180deg, #0a1929 0%, #0f213b 100%)",
          padding: "1px",
        }}
      >
        {/* Snowfall */}
        {[...Array(28)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.25} />
        ))}

        {/* Christmas Ornaments */}
        {[...Array(5)].map((_, i) => (
          <ChristmasOrnament
            key={`ornament-${i}`}
            delay={i * 3.5}
            emoji={["🔔", "🎁", "⭐", "🎄", "🦌"][i]}
          />
        ))}

        {/* Delete Sparkles */}
        <AnimatePresence>
          {sparkles.map((s) => (
            <DeleteSparkle key={s.id} x={s.x} y={s.y} />
          ))}
        </AnimatePresence>

        <div className="container-fluid p-4 position-relative" style={{ zIndex: 2 }}>
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <motion.h2
              className="fw-bold mb-1 d-flex align-items-center gap-2"
              animate={{
                textShadow: [
                  "0 0 12px rgba(255,215,0,0.4)",
                  "0 0 24px rgba(255,215,0,0.6)",
                  "0 0 12px rgba(255,215,0,0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: "#FFD700" }}
            >
              <FaBell /> Naughty Air Quality List 📋
            </motion.h2>
            <p className="text-light text-opacity-75 mb-0">
              Monitoring violations of North Pole Atmospheric Protocols
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              {
                label: "Total Alerts",
                value: alerts.length,
                color: "#ef4444",
                icon: "🚨",
              },
              {
                label: "Unread",
                value: alerts.filter((a) => !a.isRead).length,
                color: "#f59e0b",
                icon: "📬",
              },
              {
                label: "Critical",
                value: alerts.filter((a) => a.value >= 150).length,
                color: "#dc2626",
                icon: "🔥",
              },
              {
                label: "Resolved",
                value: alerts.filter((a) => a.isRead).length,
                color: "#10b981",
                icon: "✅",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="col-md-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card border-0 h-100"
                  style={{
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}08)`,
                    border: `2px solid ${stat.color}40`,
                    boxShadow: `0 0 20px ${stat.color}30`,
                  }}
                >
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: `${stat.color}30`,
                        fontSize: "28px",
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="fw-semibold text-light small">
                        {stat.label}
                      </div>
                      <div
                        className="h3 mb-0 fw-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
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
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="input-group-text bg-transparent border-0">
                      <FaSearch className="text-warning" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent text-light border-0"
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ outline: "none" }}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 d-flex justify-content-end gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All", color: "#0ea5e9", icon: "📋" },
                    { value: "unread", label: "Unread", color: "#ef4444", icon: "🔔" },
                    { value: "read", label: "Read", color: "#10b981", icon: "✅" },
                  ].map((btn) => (
                    <motion.button
                      key={btn.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-sm px-3 py-2"
                      onClick={() => setFilter(btn.value as typeof filter)}
                      style={{
                        borderRadius: 10,
                        background:
                          filter === btn.value
                            ? `linear-gradient(135deg, ${btn.color}, ${btn.color}dd)`
                            : "rgba(255,255,255,0.1)",
                        border: `1px solid ${filter === btn.value ? btn.color : "rgba(255,255,255,0.2)"}`,
                        color: "white",
                        fontWeight: 600,
                        boxShadow:
                          filter === btn.value
                            ? `0 0 15px ${btn.color}50`
                            : "none",
                      }}
                    >
                      {btn.icon} {btn.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert d-flex align-items-center gap-2 mb-4"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid #ef4444",
                borderRadius: 12,
                color: "#ef4444",
              }}
            >
              <FaExclamationTriangle />
              <span>{error}</span>
              <button
                className="btn btn-link text-danger ms-auto"
                onClick={loadAlerts}
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Alerts Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#E6F7FF",
                  }}
                >
                  <tr>
                    <th className="border-0 py-3 px-4 fw-semibold">ID</th>
                    <th className="border-0 py-3 fw-semibold">User</th>
                    <th className="border-0 py-3 fw-semibold">Location</th>
                    <th className="border-0 py-3 fw-semibold">Pollutant</th>
                    <th className="border-0 py-3 fw-semibold">Value</th>
                    <th className="border-0 py-3 fw-semibold">Severity</th>
                    <th className="border-0 py-3 fw-semibold">Triggered</th>
                    <th className="border-0 py-3 text-end px-4 fw-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-5">
                        <div className="spinner-border text-warning" />
                      </td>
                    </tr>
                  ) : filteredAlerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-5 text-light opacity-75"
                      >
                        <div style={{ fontSize: "3rem" }}>🎄</div>
                        <div className="mt-2">No alerts found</div>
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((alert, index) => {
                      const severity = getSeverity(alert.value);
                      return (
                        <motion.tr
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                            scale: 1.01,
                          }}
                          style={{
                            cursor: "pointer",
                            color: "#E6F7FF",
                          }}
                        >
                          <td className="px-4 py-3">
                            <span
                              className="badge px-2 py-1"
                              style={{
                                background: "rgba(255,215,0,0.2)",
                                color: "#FFD700",
                                fontWeight: 600,
                              }}
                            >
                              #{alert.id}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: 32,
                                  height: 32,
                                  background: "rgba(14,165,233,0.3)",
                                  fontSize: "14px",
                                }}
                              >
                                👤
                              </div>
                              <span className="fw-semibold">
                                {alert.user.username}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2">
                              📍
                              <span>{alert.location.name}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className="badge px-3 py-1"
                              style={{
                                background: "rgba(251,191,36,0.2)",
                                color: "#fbbf24",
                                borderRadius: 8,
                                fontWeight: 600,
                              }}
                            >
                              {alert.pollutant}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className="fw-bold"
                              style={{ color: severity.color }}
                            >
                              {alert.value.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="d-inline-flex align-items-center gap-2 px-3 py-1"
                              style={{
                                background: severity.bg,
                                border: `1px solid ${severity.color}`,
                                borderRadius: 8,
                                color: severity.color,
                                fontWeight: 600,
                              }}
                            >
                              <span>{severity.emoji}</span>
                              <span>{severity.label}</span>
                            </motion.div>
                          </td>
                          <td className="py-3 text-light opacity-75">
                            {new Date(alert.triggeredAt).toLocaleString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="text-end px-4 py-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-sm"
                              style={{
                                background:
                                  "linear-gradient(135deg, #ef4444, #dc2626)",
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 12px",
                                color: "white",
                              }}
                              onClick={(e) => handleDelete(alert.id, e)}
                            >
                              <FaTrash />
                            </motion.button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <small className="text-light opacity-50">
              🎅 Monitoring {filteredAlerts.length} alert
              {filteredAlerts.length !== 1 ? "s" : ""} · North Pole Air Quality
              Command ❄️
            </small>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}