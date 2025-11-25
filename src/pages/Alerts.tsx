// src/pages/Alerts.tsx (FIXED)
import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import AlertCard from "../components/AlertCard";

// ✅ FIXED: Match Backend AlertDto
type Alert = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string; // ✅ Direct string from BE
  triggeredAt: string;
  isRead: boolean;
  status?: string;
};

export default function Alerts() {
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
      
      // ✅ Backend returns AlertDto[] directly
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
      
      // Update local state
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isRead: true } : alert
        )
      );
      
      toast.success("Alert marked as read");
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, textDecoration: "none" }}
            >
              <span style={{ fontSize: "20px" }}>←</span>
            </motion.a>
            <div>
              <h2
                className="mb-1 fw-bold d-flex align-items-center gap-2"
                style={{ color: "#1e293b" }}
              >
                🔔 Air Quality Alerts
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="badge bg-danger rounded-pill"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </h2>
              <p className="text-muted mb-0">
                Real-time notifications when air quality exceeds your thresholds
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-success"
              style={{ borderRadius: 12 }}
              onClick={handleMarkAllAsRead}
            >
              ✓ Mark All as Read
            </motion.button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-3">
            <div className="d-flex gap-2">
              {(["all", "unread", "read"] as const).map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`btn ${filter === f ? "btn-primary" : "btn-light"}`}
                  style={{ borderRadius: 10, textTransform: "capitalize" }}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" && "All"}
                  {f === "unread" && `Unread (${unreadCount})`}
                  {f === "read" && `Read (${alerts.length - unreadCount})`}
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
            className="alert alert-danger"
            style={{ borderRadius: 12 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="d-inline-block mb-3"
            style={{ fontSize: "3rem" }}
          >
            🔔
          </motion.div>
          <div className="text-muted">Loading alerts...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm text-center py-5"
          style={{ borderRadius: 20 }}
        >
          <div style={{ fontSize: "5rem" }} className="mb-3">
            {filter === "unread" ? "✅" : "🔔"}
          </div>
          <h5 className="mb-2">
            {filter === "unread" ? "All caught up!" : "No alerts yet"}
          </h5>
          <p className="text-muted">
            {filter === "unread"
              ? "You have no unread alerts. Great job staying informed!"
              : "You'll receive alerts when air quality exceeds your thresholds."}
          </p>
        </motion.div>
      )}

      {/* Alerts List */}
      <AnimatePresence mode="popLayout">
        {!loading &&
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              id={alert.id}
              pollutant={alert.pollutant}
              value={alert.value}
              locationName={alert.locationName}
              triggeredAt={alert.triggeredAt}
              isRead={alert.isRead}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
      </AnimatePresence>
    </div>
  );
}