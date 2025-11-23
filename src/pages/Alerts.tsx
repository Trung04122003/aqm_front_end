// src/pages/Alerts.tsx (ENHANCED - PHASE 4)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock API
const mockApi = {
  get: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (url === "/alerts") {
      return {
        data: [
          {
            id: 1,
            pollutant: "PM2.5",
            value: 87.5,
            location: { id: 1, name: "Hanoi Central" },
            triggeredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: 2,
            pollutant: "AQI",
            value: 152,
            location: { id: 1, name: "Hanoi Central" },
            triggeredAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: 3,
            pollutant: "PM10",
            value: 125,
            location: { id: 2, name: "District 1" },
            triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            isRead: true
          }
        ]
      };
    }
    
    if (url === "/alerts/unread") {
      return {
        data: [
          {
            id: 1,
            pollutant: "PM2.5",
            value: 87.5,
            location: { id: 1, name: "Hanoi Central" },
            triggeredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            isRead: false
          },
          {
            id: 2,
            pollutant: "AQI",
            value: 152,
            location: { id: 1, name: "Hanoi Central" },
            triggeredAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            isRead: false
          }
        ]
      };
    }
    
    return { data: [] };
  },
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  put: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: { success: true } };
  }
};

type Alert = {
  id: number;
  pollutant: string;
  value: number;
  location: { id: number; name: string };
  triggeredAt: string;
  isRead: boolean;
};

const AlertCard = ({ 
  alert, 
  onMarkAsRead 
}: { 
  alert: Alert; 
  onMarkAsRead: (id: number) => void;
}) => {
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getSeverity = () => {
    if (alert.pollutant === "PM2.5" && alert.value > 55) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    if (alert.pollutant === "PM10" && alert.value > 150) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    if (alert.pollutant === "AQI" && alert.value > 150) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    return { level: "warning", color: "#f59e0b", emoji: "⚠️" };
  };

  const severity = getSeverity();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01 }}
      className={`card border-0 shadow-sm mb-3 ${!alert.isRead ? 'border-start border-4' : ''}`}
      style={{ 
        borderRadius: 16,
        borderLeftColor: !alert.isRead ? severity.color : undefined,
        opacity: alert.isRead ? 0.7 : 1,
        transition: "opacity 0.3s"
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          {/* Icon */}
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ 
              width: 56, 
              height: 56,
              background: `${severity.color}15`,
              fontSize: "28px"
            }}
          >
            {severity.emoji}
          </div>

          {/* Content */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>
                  {alert.pollutant} Alert
                  {!alert.isRead && (
                    <span 
                      className="badge ms-2"
                      style={{ 
                        background: severity.color,
                        fontSize: "0.65rem",
                        padding: "4px 8px"
                      }}
                    >
                      NEW
                    </span>
                  )}
                </h6>
                <div className="small text-muted">
                  📍 {alert.location.name} • {formatTime(alert.triggeredAt)}
                </div>
              </div>
              
              {alert.isRead && (
                <span className="badge bg-success" style={{ fontSize: "0.7rem" }}>
                  ✓ Read
                </span>
              )}
            </div>

            {/* Value Display */}
            <div 
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-3"
              style={{ 
                background: `${severity.color}10`,
                border: `1px solid ${severity.color}30`
              }}
            >
              <span className="text-muted small">Current value:</span>
              <span 
                className="fw-bold"
                style={{ 
                  color: severity.color,
                  fontSize: "1.1rem"
                }}
              >
                {alert.value.toFixed(1)}
              </span>
              <span className="text-muted small">
                {alert.pollutant === "AQI" ? "" : "µg/m³"}
              </span>
            </div>

            {/* Action Button */}
            {!alert.isRead && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-sm btn-outline-success"
                style={{ borderRadius: 8 }}
                onClick={() => onMarkAsRead(alert.id)}
              >
                ✓ Mark as Read
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
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
      const res = await mockApi.get("/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await mockApi.put(`/alerts/${id}/read`);
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === id ? { ...alert, isRead: true } : alert
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = alerts.filter(a => !a.isRead).map(a => a.id);
    for (const id of unreadIds) {
      await handleMarkAsRead(id);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "unread") return !alert.isRead;
    if (filter === "read") return alert.isRead;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

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
              <h2 className="mb-1 fw-bold d-flex align-items-center gap-2" style={{ color: "#1e293b" }}>
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
                  className={`btn ${filter === f ? 'btn-primary' : 'btn-light'}`}
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
        {!loading && filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}