// src/components/ForecastCard.tsx
import { motion } from "framer-motion";

type Props = {
  timestamp: string;
  predictedPm25?: number;
  predictedPm10?: number;
  predictedAqi?: number;
  modelVersion?: string;
};

function aqiColor(aqi: number) {
  if (aqi <= 50) return "#4caf50";
  if (aqi <= 100) return "#ffb300";
  if (aqi <= 150) return "#ff9800";
  if (aqi <= 200) return "#f44336";
  return "#9c27b0";
}

function aqiLabel(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  return "Very Unhealthy";
}

export default function ForecastCard({
  timestamp,
  predictedPm25,
  predictedPm10,
  predictedAqi,
  modelVersion
}: Props) {
  const aqi = predictedAqi ?? 0;
  const color = aqiColor(aqi);
  const label = aqiLabel(aqi);

  // Format timestamp
  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString("vi-VN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return ts;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="card card-aqm p-3"
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="text-muted small">Forecast</div>
          <div className="fw-semibold">{formatTime(timestamp)}</div>
        </div>
        <div 
          className="badge rounded-pill px-2 py-1"
          style={{ 
            backgroundColor: color,
            color: "white",
            fontSize: "0.7rem"
          }}
        >
          {label}
        </div>
      </div>

      <div className="text-center mb-3">
        <div 
          className="display-4 fw-bold mb-1" 
          style={{ color, lineHeight: 1 }}
        >
          {aqi}
        </div>
        <div className="text-muted small">AQI</div>
      </div>

      <div className="row g-2 text-center">
        <div className="col-6">
          <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
            {predictedPm25?.toFixed(1) ?? "—"}
          </div>
          <div className="text-muted small">PM2.5</div>
        </div>
        <div className="col-6">
          <div className="fw-semibold" style={{ fontSize: "1.1rem" }}>
            {predictedPm10?.toFixed(1) ?? "—"}
          </div>
          <div className="text-muted small">PM10</div>
        </div>
      </div>

      {modelVersion && (
        <div className="text-center mt-2 pt-2 border-top">
          <span className="badge bg-light text-muted" style={{ fontSize: "0.65rem" }}>
            Model: {modelVersion}
          </span>
        </div>
      )}
    </motion.div>
  );
}