// src/components/AlertCard.tsx (FIXED)
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";

type Props = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string; // ✅ FIXED: Direct string, not nested object
  triggeredAt: string;
  isRead: boolean;
  onMarkAsRead?: (id: number) => void;
};

export default function AlertCard({
  id,
  pollutant,
  value,
  locationName,
  triggeredAt,
  isRead,
  onMarkAsRead
}: Props) {
 
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
    if (pollutant === "PM2.5" && value > 55) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    if (pollutant === "PM10" && value > 150) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    if (pollutant === "AQI" && value > 150) return { level: "danger", color: "#ef4444", emoji: "🚨" };
    return { level: "warning", color: "#f59e0b", emoji: "⚠️" };
  };

  const severity = getSeverity();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01 }}
      className={`card card-aqm p-3 mb-2 ${!isRead ? "border-start border-3 border-danger" : ""}`}
      style={{
        opacity: isRead ? 0.7 : 1,
        transition: "opacity 0.3s",
        borderLeftColor: !isRead ? severity.color : undefined
      }}
    >
      <div className="d-flex align-items-start gap-3">
        {/* Icon */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 48,
            height: 48,
            backgroundColor: `${severity.color}15`,
            fontSize: "24px"
          }}
        >
          {severity.emoji}
        </div>
        
        {/* Content */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div className="fw-semibold">
              {pollutant} Alert
              {!isRead && (
                <span className="badge bg-danger ms-2" style={{ fontSize: "0.65rem" }}>
                  NEW
                </span>
              )}
            </div>
            <div className="text-muted small">{formatTime(triggeredAt)}</div>
          </div>
          
          {/* ✅ FIXED: locationName is now a direct string */}
          <div className="text-muted small mb-2">
            <span className="me-2">📍 {locationName || "Unknown"}</span>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Current value:</span>
            <span
              className={`badge ${severity.level === "danger" ? "bg-danger" : "bg-warning"} px-2 py-1`}
              style={{ fontSize: "0.85rem" }}
            >
              {value.toFixed(1)} {pollutant === "AQI" ? "" : "µg/m³"}
            </span>
          </div>
          
          {!isRead && onMarkAsRead && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm btn-outline-success mt-2"
              onClick={() => onMarkAsRead(id)}
            >
              <FaBell size={12} className="me-1" />
              Mark as Read
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}