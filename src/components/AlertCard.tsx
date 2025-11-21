// src/components/AlertCard.tsx
import { motion } from "framer-motion";
import { FaBell, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  id: number;
  pollutant: string;
  value: number;
  locationName?: string;
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
    if (pollutant === "PM2.5" && value > 150) return "danger";
    if (pollutant === "PM10" && value > 250) return "danger";
    if (pollutant === "AQI" && value > 150) return "danger";
    return "warning";
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
        transition: "opacity 0.3s"
      }}
    >
      <div className="d-flex align-items-start gap-3">
        {/* Icon */}
        <div 
          className={`rounded-circle d-flex align-items-center justify-content-center`}
          style={{ 
            width: 48, 
            height: 48,
            backgroundColor: severity === "danger" ? "rgba(244, 67, 54, 0.1)" : "rgba(255, 179, 0, 0.1)"
          }}
        >
          {isRead ? (
            <FaCheckCircle size={22} className="text-success" />
          ) : (
            <FaExclamationTriangle 
              size={22} 
              className={severity === "danger" ? "text-danger" : "text-warning"} 
            />
          )}
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

          <div className="text-muted small mb-2">
            {locationName && (
              <span className="me-2">📍 {locationName}</span>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Current value:</span>
            <span 
              className={`badge ${severity === "danger" ? "bg-danger" : "bg-warning"} px-2 py-1`}
              style={{ fontSize: "0.85rem" }}
            >
              {value.toFixed(1)} µg/m³
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