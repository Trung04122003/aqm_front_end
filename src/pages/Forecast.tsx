// src/pages/Forecast.tsx - CHRISTMAS 2025 EDITION

import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";

type Location = { id: number; name: string };
type Forecast = {
  id: number;
  timestampUtc: string;
  predictedPm25?: number;
  predictedPm10?: number;
  predictedAqi?: number;
  modelVersion?: string;
};

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { label: "Good - Santa Approved!", color: "#165B33", emoji: "🎅", bg: "rgba(22, 91, 51, 0.1)" };
  if (aqi <= 100) return { label: "Moderate", color: "#FFD700", emoji: "🧝", bg: "rgba(255, 215, 0, 0.1)" };
  if (aqi <= 150) return { label: "Unhealthy", color: "#FFA500", emoji: "🦌", bg: "rgba(255, 165, 0, 0.1)" };
  return { label: "Very Unhealthy", color: "#C41E3A", emoji: "⛄", bg: "rgba(196, 30, 58, 0.1)" };
};

const ChristmasForecastCard = ({ forecast, index }: { forecast: Forecast; index: number }) => {
  const aqi = forecast.predictedAqi ?? 0;
  const status = getAQIStatus(aqi);
  
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return `In ${diffHours}h`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(196, 30, 58, 0.3)" }}
      className="card border-0 shadow-lg h-100"
      style={{ borderRadius: 24, overflow: "hidden", border: "3px solid #FFD700" }}
    >
      {/* Header with Gradient */}
      <div className="p-4 text-white position-relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${status.color}, ${status.color}dd)` }}>
        <motion.div
          className="position-absolute"
          style={{ top: -20, right: -20, fontSize: "100px", opacity: 0.15 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎄
        </motion.div>
        <div className="d-flex justify-content-between align-items-center position-relative">
          <div>
            <div className="small opacity-75 mb-1">🔮 Forecast</div>
            <div className="h5 mb-0 fw-bold">{formatTime(forecast.timestampUtc)}</div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "40px" }}
          >
            {status.emoji}
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-4" style={{ background: status.bg }}>
        <div className="text-center mb-4">
          <motion.div
            className="display-3 fw-bold mb-2"
            style={{ color: status.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          >
            {Math.round(aqi)}
          </motion.div>
          <div className="badge px-3 py-2" style={{ background: status.bg, color: status.color, fontSize: "0.9rem", fontWeight: 600, border: `2px solid ${status.color}`, borderRadius: 12 }}>
            {status.label}
          </div>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <div className="p-3 rounded-3 text-center" style={{ background: "white", border: "2px solid #FFD700" }}>
              <div className="h5 mb-1 fw-bold" style={{ color: "#C41E3A" }}>
                {forecast.predictedPm25?.toFixed(1) ?? "---"}
              </div>
              <div className="small text-muted">PM2.5 µg/m³</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3 rounded-3 text-center" style={{ background: "white", border: "2px solid #FFD700" }}>
              <div className="h5 mb-1 fw-bold" style={{ color: "#165B33" }}>
                {forecast.predictedPm10?.toFixed(1) ?? "---"}
              </div>
              <div className="small text-muted">PM10 µg/m³</div>
            </div>
          </div>
        </div>

        {forecast.modelVersion && (
          <div className="text-center mt-3 pt-3 border-top">
            <span className="badge bg-light text-muted" style={{ fontSize: "0.75rem" }}>
              🤖 {forecast.modelVersion}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Snowflake Effect
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{ left: `${Math.random() * 100}%`, top: -20, fontSize: "20px", pointerEvents: "none", zIndex: 1 }}
    animate={{ y: ["0vh", "110vh"], rotate: [0, 360], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: "linear" }}
  >
    ❄️
  </motion.div>
);

export default function ChristmasForecast() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (selected) loadForecasts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
      if (res.data.length > 0) setSelected(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const loadForecasts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/forecast?location=${selected}`);
      setForecasts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)", padding: "2rem", position: "relative", overflow: "hidden" }}>
      {[...Array(15)].map((_, i) => <Snowflake key={i} delay={i * 0.5} />)}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <motion.a href="/" whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} className="btn rounded-circle" style={{ width: 50, height: 50, background: "linear-gradient(135deg, #C41E3A, #165B33)", color: "white", border: "3px solid #FFD700", fontSize: "20px" }}>←</motion.a>
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: "#C41E3A" }}>🔮 Christmas Air Quality Forecast</h2>
              <p className="text-muted mb-0">🎅 Santa's AI-powered predictions for the next 48 hours</p>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16, border: "3px solid #FFD700" }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: "24px" }}>📍</span>
              <select className="form-select border-0" style={{ maxWidth: 300, borderRadius: 12, background: "linear-gradient(135deg, #FFFAFA, #E0F7FA)" }} value={selected ?? ""} onChange={(e) => setSelected(Number(e.target.value))}>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>🎄 {loc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="d-inline-block mb-3" style={{ fontSize: "4rem" }}>🔮</motion.div>
          <div style={{ color: "#C41E3A", fontWeight: "bold" }}>Loading forecast data...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && forecasts.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: "5rem" }}>📊</div>
          <h5 className="text-muted">No forecast data available</h5>
        </div>
      )}

      {/* Forecast Cards */}
      {!loading && forecasts.length > 0 && (
        <>
          {/* Stats Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16, border: "2px solid #FFD700" }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#165B33" }}>
                    {Math.round(forecasts.reduce((acc, f) => acc + (f.predictedAqi ?? 0), 0) / forecasts.length)}
                  </div>
                  <div className="text-muted">Average AQI 🎄</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16, border: "2px solid #FFD700" }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#C41E3A" }}>
                    {forecasts[0]?.predictedPm25?.toFixed(1) ?? "---"}
                  </div>
                  <div className="text-muted">Next Hour PM2.5 ⛄</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16, border: "2px solid #FFD700" }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#FFD700" }}>
                    {forecasts.filter((f) => (f.predictedAqi ?? 0) > 100).length}
                  </div>
                  <div className="text-muted">Unhealthy Hours 🦌</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Forecast Grid */}
          <div className="row g-4">
            {forecasts.map((forecast, index) => (
              <div key={forecast.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ChristmasForecastCard forecast={forecast} index={index} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-5 py-4">
        <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>🎅 Ho Ho Ho! Stay Informed! 🎄</h4>
        <p style={{ color: "#165B33" }}>May your holidays be merry and your air quality excellent! ❄️</p>
      </motion.div>
    </div>
  );
}