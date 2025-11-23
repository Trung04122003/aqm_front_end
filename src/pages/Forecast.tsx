// src/pages/Forecast.tsx (ENHANCED - PHASE 4)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock API (replace with real axios calls)
const mockApi = {
  get: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (url === "/locations") {
      return { 
        data: [
          { id: 1, name: "Hanoi", latitude: 21.0285, longitude: 105.8542 },
          { id: 2, name: "Ho Chi Minh", latitude: 10.8231, longitude: 106.6297 },
          { id: 3, name: "Da Nang", latitude: 16.0544, longitude: 108.2022 }
        ]
      };
    }
    
    // Mock forecast data
    const hours = [3, 6, 9, 12, 24, 48];
    return {
      data: hours.map((h, i) => ({
        id: i + 1,
        timestampUtc: new Date(Date.now() + h * 60 * 60 * 1000).toISOString(),
        predictedPm25: 15 + Math.random() * 30,
        predictedPm10: 25 + Math.random() * 40,
        predictedAqi: 50 + Math.random() * 80,
        modelVersion: "LSTM-v1.3"
      }))
    };
  }
};

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
  if (aqi <= 50) return { label: "Good", color: "#10b981", emoji: "😊", bg: "rgba(16, 185, 129, 0.1)" };
  if (aqi <= 100) return { label: "Moderate", color: "#f59e0b", emoji: "😐", bg: "rgba(245, 158, 11, 0.1)" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "#ef4444", emoji: "😷", bg: "rgba(239, 68, 68, 0.1)" };
  return { label: "Unhealthy", color: "#dc2626", emoji: "🤢", bg: "rgba(220, 38, 38, 0.1)" };
};

const ForecastCard = ({ forecast, index }: { forecast: Forecast; index: number }) => {
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
      whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
      className="card border-0 shadow-sm h-100"
      style={{ 
        borderRadius: 20,
        overflow: "hidden",
        background: "white"
      }}
    >
      {/* Header */}
      <div 
        className="p-3 text-white"
        style={{
          background: `linear-gradient(135deg, ${status.color}, ${status.color}dd)`
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="small opacity-75">Forecast</div>
            <div className="fw-bold">{formatTime(forecast.timestampUtc)}</div>
          </div>
          <div style={{ fontSize: "28px" }}>{status.emoji}</div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-4">
        {/* AQI Display */}
        <div className="text-center mb-4">
          <motion.div 
            className="display-3 fw-bold mb-2" 
            style={{ color: status.color, lineHeight: 1 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          >
            {Math.round(aqi)}
          </motion.div>
          <div 
            className="badge px-3 py-2"
            style={{ 
              background: status.bg,
              color: status.color,
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            {status.label}
          </div>
        </div>

        {/* Pollutant Details */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div 
              className="p-3 rounded-3 text-center"
              style={{ background: "#f8f9fa" }}
            >
              <div className="h5 mb-1 fw-bold" style={{ color: "#667eea" }}>
                {forecast.predictedPm25?.toFixed(1) ?? "—"}
              </div>
              <div className="small text-muted">PM2.5 µg/m³</div>
            </div>
          </div>
          <div className="col-6">
            <div 
              className="p-3 rounded-3 text-center"
              style={{ background: "#f8f9fa" }}
            >
              <div className="h5 mb-1 fw-bold" style={{ color: "#764ba2" }}>
                {forecast.predictedPm10?.toFixed(1) ?? "—"}
              </div>
              <div className="small text-muted">PM10 µg/m³</div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        {forecast.modelVersion && (
          <div className="text-center pt-3 border-top">
            <span 
              className="badge bg-light text-muted"
              style={{ fontSize: "0.7rem" }}
            >
              🤖 {forecast.modelVersion}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Forecast() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (selected) loadForecasts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const loadLocations = async () => {
    try {
      const res = await mockApi.get("/locations");
      setLocations(res.data || []);
      if (res.data.length > 0) setSelected(res.data[0].id);
    } catch (err) {
      console.error(err);
      setError("Failed to load locations");
    }
  };

  const loadForecasts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockApi.get(`/forecast?location=${selected}`);
      setForecasts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load forecast data");
    } finally {
      setLoading(false);
    }
  };

  const selectedLocation = locations.find(l => l.id === selected);

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
              <h2 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>
                🔮 Air Quality Forecast
              </h2>
              <p className="text-muted mb-0">
                AI-powered predictions for the next 48 hours
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="badge bg-primary px-3 py-2"
            style={{ fontSize: "0.9rem", cursor: "pointer" }}
            onClick={loadForecasts}
          >
            🔄 Refresh
          </motion.div>
        </div>

        {/* Location Selector */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">📍 Location:</span>
              <select
                className="form-select border-0 bg-light"
                style={{ maxWidth: 300, borderRadius: 12 }}
                value={selected ?? ""}
                onChange={(e) => setSelected(Number(e.target.value))}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
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
            className="alert alert-danger mb-4"
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
            🔮
          </motion.div>
          <div className="text-muted">Loading forecast data...</div>
        </div>
      )}

      {/* Forecast Cards Grid */}
      {!loading && forecasts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-5"
        >
          <div style={{ fontSize: "5rem" }} className="mb-3">📊</div>
          <h5 className="text-muted">No forecast data available</h5>
          <p className="text-muted small">
            Forecast data for {selectedLocation?.name} is not available yet.
          </p>
        </motion.div>
      )}

      {!loading && forecasts.length > 0 && (
        <>
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="row g-3 mb-4"
          >
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#10b981" }}>
                    {Math.round(forecasts.reduce((acc, f) => acc + (f.predictedAqi ?? 0), 0) / forecasts.length)}
                  </div>
                  <div className="text-muted">Average AQI</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#667eea" }}>
                    {forecasts[0]?.predictedPm25?.toFixed(1) ?? "—"}
                  </div>
                  <div className="text-muted">Next Hour PM2.5</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
                <div className="card-body p-4 text-center">
                  <div className="h3 fw-bold mb-1" style={{ color: "#f59e0b" }}>
                    {forecasts.filter(f => (f.predictedAqi ?? 0) > 100).length}
                  </div>
                  <div className="text-muted">Unhealthy Hours</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Forecast Cards */}
          <div className="row g-4">
            {forecasts.map((forecast, index) => (
              <div key={forecast.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ForecastCard forecast={forecast} index={index} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}