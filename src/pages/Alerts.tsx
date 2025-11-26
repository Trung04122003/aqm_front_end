// src/pages/Alerts.tsx - CHRISTMAS 2025 EDITION 🔔

import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaCheckCircle, FaSnowflake } from "react-icons/fa";

type Alert = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string;
  triggeredAt: string;
  isRead: boolean;
  status?: string;
};

// Christmas Alert Card Component
const ChristmasAlertCard = ({ alert, onMarkAsRead }: { alert: Alert; onMarkAsRead: (id: number) => void }) => {
  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return ts;
    }
  };

  const getSeverity = () => {
    if (alert.pollutant === "PM2.5" && alert.value > 55) return { level: "danger", color: "#C41E3A", emoji: "🦌", bg: "rgba(196, 30, 58, 0.1)" };
    if (alert.pollutant === "PM10" && alert.value > 150) return { level: "danger", color: "#C41E3A", emoji: "🦌", bg: "rgba(196, 30, 58, 0.1)" };
    if (alert.pollutant === "AQI" && alert.value > 150) return { level: "danger", color: "#C41E3A", emoji: "⛄", bg: "rgba(196, 30, 58, 0.1)" };
    return { level: "warning", color: "#FFD700", emoji: "🧝", bg: "rgba(255, 215, 0, 0.1)" };
  };

  const severity = getSeverity();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01, boxShadow: "0 12px 32px rgba(196, 30, 58, 0.3)" }}
      className="card mb-3 position-relative overflow-hidden"
      style={{
        opacity: alert.isRead ? 0.7 : 1,
        border: `3px solid ${alert.isRead ? "#ddd" : severity.color}`,
        borderRadius: 20,
        background: alert.isRead ? "#f8f9fa" : severity.bg,
        transition: "all 0.3s"
      }}
    >
      {/* Christmas Ornament Background */}
      <div className="position-absolute" style={{ top: -20, right: -20, fontSize: "80px", opacity: 0.1 }}>
        🎄
      </div>

      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              background: `linear-gradient(135deg, ${severity.color}, ${severity.color}dd)`,
              fontSize: "32px",
              border: "3px solid #FFD700"
            }}
          >
            {severity.emoji}
          </motion.div>

          {/* Content */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="mb-1 fw-bold" style={{ color: severity.color }}>
                  🔔 {alert.pollutant} Alert
                  {!alert.isRead && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="badge ms-2"
                      style={{ 
                        background: "linear-gradient(135deg, #C41E3A, #165B33)", 
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: 12
                      }}
                    >
                      🎁 NEW
                    </motion.span>
                  )}
                </h5>
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaSnowflake size={12} style={{ color: "#87CEEB" }} />
                  <span>📍 {alert.locationName || "Unknown"}</span>
                  <span>•</span>
                  <span>🕒 {formatTime(alert.triggeredAt)}</span>
                </div>
              </div>
            </div>

            {/* Value Display */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.8)", border: `2px solid ${severity.color}` }}>
                <div className="small text-muted mb-1">Current Value</div>
                <div className="h4 mb-0 fw-bold" style={{ color: severity.color }}>
                  {alert.value.toFixed(1)} {alert.pollutant === "AQI" ? "" : "µg/m³"}
                </div>
              </div>
              
              <div className="flex-grow-1">
                <div className="small text-muted mb-2">Severity Level</div>
                <div className="progress" style={{ height: 10, borderRadius: 10, background: "#e9ecef" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((alert.value / 200) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="progress-bar"
                    style={{ 
                      background: `linear-gradient(90deg, ${severity.color}, #FFD700)`,
                      borderRadius: 10
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            {!alert.isRead && onMarkAsRead && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm d-inline-flex align-items-center gap-2"
                onClick={() => onMarkAsRead(alert.id)}
                style={{
                  background: "linear-gradient(135deg, #165B33, #50C878)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(22, 91, 51, 0.3)"
                }}
              >
                <FaCheckCircle />
                Mark as Read
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ChristmasAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/alerts");
      const alertData = Array.isArray(res.data) ? res.data : [];
      setAlerts(alertData);
    } catch (err) {
      console.error("Failed to load alerts:", err);
      setError("Failed to load alerts. Please try again.");
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isRead: true } : alert
        )
      );
      toast.success("🎅 Alert marked as read!");
    } catch (err) {
      console.error("Failed to mark as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = alerts.filter((a) => !a.isRead).map((a) => a.id);
    for (const id of unreadIds) {
      await handleMarkAsRead(id);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.isRead;
    if (filter === "read") return alert.isRead;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  // Snowflake component
  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: -20,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 1
      }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      ❄️
    </motion.div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)", padding: "2rem", position: "relative", overflow: "hidden" }}>
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: 50, 
                height: 50, 
                textDecoration: "none",
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
                color: "white",
                border: "3px solid #FFD700",
                fontSize: "20px"
              }}
            >
              ←
            </motion.a>
            <div>
              <h2 className="mb-1 fw-bold d-flex align-items-center gap-2" style={{ color: "#C41E3A" }}>
                🔔 Christmas Air Quality Alerts
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="badge rounded-pill"
                    style={{ background: "linear-gradient(135deg, #C41E3A, #165B33)", color: "white" }}
                  >
                    {unreadCount} 🎁
                  </motion.span>
                )}
              </h2>
              <p className="text-muted mb-0">
                🎅 Santa's watching your air quality! Real-time notifications for healthy holidays
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn d-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #165B33, #50C878)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontWeight: "bold",
                boxShadow: "0 4px 16px rgba(22, 91, 51, 0.3)"
              }}
              onClick={handleMarkAllAsRead}
            >
              <FaCheckCircle />
              Mark All as Read 🎄
            </motion.button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="card border-0 shadow-lg" style={{ borderRadius: 16, border: "3px solid #FFD700" }}>
          <div className="card-body p-3">
            <div className="d-flex gap-2">
              {(["all", "unread", "read"] as const).map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn"
                  style={{
                    background: filter === f 
                      ? "linear-gradient(135deg, #C41E3A, #165B33)" 
                      : "white",
                    color: filter === f ? "white" : "#165B33",
                    border: filter === f ? "none" : "2px solid #165B33",
                    borderRadius: 12,
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    padding: "10px 20px"
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" && "🎄 All"}
                  {f === "unread" && `🎁 Unread (${unreadCount})`}
                  {f === "read" && `✅ Read (${alerts.length - unreadCount})`}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="alert d-flex align-items-center gap-3"
            style={{ 
              background: "rgba(196, 30, 58, 0.1)", 
              border: "2px solid #C41E3A",
              borderRadius: 16,
              color: "#C41E3A"
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <div>{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="d-inline-block mb-3"
            style={{ fontSize: "4rem" }}
          >
            🎅
          </motion.div>
          <div style={{ color: "#C41E3A", fontSize: "1.2rem", fontWeight: "bold" }}>
            Santa is checking your alerts...
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-lg text-center py-5"
          style={{ borderRadius: 24, border: "3px solid #FFD700", background: "white" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "6rem" }}
            className="mb-3"
          >
            {filter === "unread" ? "🎅" : "🔔"}
          </motion.div>
          <h5 className="mb-2" style={{ color: "#165B33", fontWeight: "bold" }}>
            {filter === "unread" ? "All caught up! 🎄" : "No alerts yet ⛄"}
          </h5>
          <p style={{ color: "#6c757d" }}>
            {filter === "unread"
              ? "You have no unread alerts. Great job staying informed this Christmas!"
              : "You'll receive alerts when air quality exceeds your thresholds. 🎁"}
          </p>
        </motion.div>
      )}

      {/* Alerts List */}
      <AnimatePresence mode="popLayout">
        {!loading &&
          filteredAlerts.map((alert) => (
            <ChristmasAlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
      </AnimatePresence>

      {/* Christmas Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-5 py-4"
      >
        <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>
          🎅 Stay Safe This Holiday Season! 🎄
        </h4>
        <p style={{ color: "#165B33" }}>
          May your air be as pure as freshly fallen snow! ❄️⛄
        </p>
      </motion.div>
    </div>
  );
}