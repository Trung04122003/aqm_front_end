// src/pages/ThresholdSettings.tsx - CHRISTMAS USER THRESHOLD SETTINGS 🎅

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSave, FaBell } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { toast } from "react-toastify";

type Threshold = {
  id?: number;
  pm25Threshold: number;
  pm10Threshold: number;
  aqiThreshold: number;
};

// Snowflake component
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "20px",
      pointerEvents: "none",
      zIndex: 1,
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

export default function ThresholdSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState<Threshold>({
    pm25Threshold: 35,
    pm10Threshold: 50,
    aqiThreshold: 100,
  });

  useEffect(() => {
    loadThreshold();
  }, []);

  const loadThreshold = async () => {
    setLoading(true);
    try {
      const res = await api.get("/thresholds");
      if (res.data) {
        setThreshold(res.data);
      }
    } catch (err) {
      console.error("Failed to load threshold:", err);
      // If no threshold exists, use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/thresholds", threshold);
      toast.success("🎅 Alert thresholds saved successfully!");
    } catch (err) {
      console.error("Failed to save threshold:", err);
      toast.error("Failed to save thresholds");
    } finally {
      setSaving(false);
    }
  };

  const getLevel = (value: number, type: "pm25" | "pm10" | "aqi") => {
    const limits = {
      pm25: { moderate: 35, high: 55 },
      pm10: { moderate: 50, high: 150 },
      aqi: { moderate: 100, high: 150 },
    };

    if (value >= limits[type].high)
      return { color: "#C41E3A", label: "High", emoji: "🦌" };
    if (value >= limits[type].moderate)
      return { color: "#FFD700", label: "Moderate", emoji: "🧝" };
    return { color: "#165B33", label: "Low", emoji: "🎅" };
  };

  const pm25Level = getLevel(threshold.pm25Threshold, "pm25");
  const pm10Level = getLevel(threshold.pm10Threshold, "pm10");
  const aqiLevel = getLevel(threshold.aqiThreshold, "aqi");

  if (loading) {
    return (
      <MainLayout>
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
          style={{
            background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 100%)",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <Snowflake key={i} delay={i * 0.5} />
          ))}
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: "4rem", marginBottom: "1rem" }}
            >
              🎅
            </motion.div>
            <div
              style={{
                color: "#C41E3A",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              Loading your settings...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          <div className="d-flex align-items-center gap-3 mb-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
                color: "white",
                border: "3px solid #FFD700",
                fontSize: "20px",
              }}
            >
              ←
            </motion.a>
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: "#C41E3A" }}>
                🔔 Alert Threshold Settings
              </h2>
              <p className="text-muted mb-0">
                Set custom thresholds for air quality alerts 🎅
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: 16,
            border: "3px solid #FFD700",
            background: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <FaBell size={24} style={{ color: "#C41E3A" }} />
              <h5 className="mb-0" style={{ color: "#165B33" }}>
                How it works 🎄
              </h5>
            </div>
            <p className="text-muted mb-0">
              You will receive <strong>real-time alerts</strong> when air
              quality measurements exceed your custom thresholds. Set your
              preferred values below to stay informed about air quality changes
              in your area.
            </p>
          </div>
        </motion.div>

        {/* Threshold Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card border-0 shadow-lg"
          style={{
            borderRadius: 24,
            border: "3px solid #FFD700",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            className="p-4 text-white text-center"
            style={{
              background: "linear-gradient(135deg, #C41E3A, #165B33)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: "3rem" }}
            >
              ⚙️
            </motion.div>
            <h4 className="mt-3 mb-0 fw-bold">Configure Your Alerts</h4>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            {/* PM2.5 Threshold */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-semibold mb-0">
                  PM2.5 Threshold (µg/m³)
                </label>
                <span
                  className="badge px-3 py-2"
                  style={{
                    background: pm25Level.color,
                    color: "white",
                    borderRadius: 12,
                  }}
                >
                  {pm25Level.emoji} {pm25Level.label}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                step="5"
                value={threshold.pm25Threshold}
                onChange={(e) =>
                  setThreshold({
                    ...threshold,
                    pm25Threshold: Number(e.target.value),
                  })
                }
                style={{
                  accentColor: pm25Level.color,
                }}
              />
              <div className="d-flex justify-content-between small text-muted mt-1">
                <span>0</span>
                <span className="fw-bold" style={{ color: pm25Level.color }}>
                  {threshold.pm25Threshold} µg/m³
                </span>
                <span>100</span>
              </div>
              <div className="small text-muted mt-2">
                Recommended: <strong>35 µg/m³</strong> (WHO standard)
              </div>
            </div>

            {/* PM10 Threshold */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-semibold mb-0">
                  PM10 Threshold (µg/m³)
                </label>
                <span
                  className="badge px-3 py-2"
                  style={{
                    background: pm10Level.color,
                    color: "white",
                    borderRadius: 12,
                  }}
                >
                  {pm10Level.emoji} {pm10Level.label}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="200"
                step="10"
                value={threshold.pm10Threshold}
                onChange={(e) =>
                  setThreshold({
                    ...threshold,
                    pm10Threshold: Number(e.target.value),
                  })
                }
                style={{
                  accentColor: pm10Level.color,
                }}
              />
              <div className="d-flex justify-content-between small text-muted mt-1">
                <span>0</span>
                <span className="fw-bold" style={{ color: pm10Level.color }}>
                  {threshold.pm10Threshold} µg/m³
                </span>
                <span>200</span>
              </div>
              <div className="small text-muted mt-2">
                Recommended: <strong>50 µg/m³</strong> (WHO standard)
              </div>
            </div>

            {/* AQI Threshold */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-semibold mb-0">
                  AQI Threshold
                </label>
                <span
                  className="badge px-3 py-2"
                  style={{
                    background: aqiLevel.color,
                    color: "white",
                    borderRadius: 12,
                  }}
                >
                  {aqiLevel.emoji} {aqiLevel.label}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="200"
                step="10"
                value={threshold.aqiThreshold}
                onChange={(e) =>
                  setThreshold({
                    ...threshold,
                    aqiThreshold: Number(e.target.value),
                  })
                }
                style={{
                  accentColor: aqiLevel.color,
                }}
              />
              <div className="d-flex justify-content-between small text-muted mt-1">
                <span>0</span>
                <span className="fw-bold" style={{ color: aqiLevel.color }}>
                  {threshold.aqiThreshold}
                </span>
                <span>200</span>
              </div>
              <div className="small text-muted mt-2">
                Recommended: <strong>100</strong> (Moderate level)
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: "linear-gradient(135deg, #165B33, #50C878)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner-border spinner-border-sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Settings 🎅</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* AQI Reference Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card border-0 shadow-sm mt-4"
          style={{
            borderRadius: 16,
            border: "3px solid #FFD700",
            maxWidth: 800,
            margin: "2rem auto 0",
          }}
        >
          <div className="card-body p-4">
            <h5 className="mb-3 fw-semibold" style={{ color: "#C41E3A" }}>
              📊 AQI Reference Guide 🎄
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#165B33",
                    }}
                  />
                  <div>
                    <div className="fw-semibold small">0-50: Good</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Air quality is satisfactory
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#FFD700",
                    }}
                  />
                  <div>
                    <div className="fw-semibold small">51-100: Moderate</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Acceptable for most people
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#C41E3A",
                    }}
                  />
                  <div>
                    <div className="fw-semibold small">101+: Unhealthy</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Health effects for sensitive groups
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-5 py-4"
        >
          <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>
            🎅 Stay Alert, Stay Safe! 🎄
          </h4>
          <p style={{ color: "#165B33" }}>
            Your health is our priority this Christmas season! ❄️⛄
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}