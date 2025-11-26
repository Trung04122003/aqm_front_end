// src/pages/Dashboard.tsx - CHRISTMAS 2025 EDITION 🎄

import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import {
  FaSnowflake,
  FaGift,
  FaMapMarkerAlt,
  FaChartLine,
  FaCandyCane
} from "react-icons/fa";
import api from "../api/axios";
import useAuth from "../auth/useAuth";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { toast } from "react-toastify";
import LocationSelector from "../components/LocationSelector";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Location = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

type AirQualityResponse = {
  current: {
    aqi: number;
    pm25: number;
    pm10: number;
    no2?: number;
    co?: number;
    o3?: number;
    so2?: number;
    timestamp?: string;
  };
  history: Array<{
    ts: string;
    value: number;
  }>;
};

type DataPoint = { ts: string; value: number };

// Snowflake component
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "24px",
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

export default function ChristmasDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [aqi, setAqi] = useState<number>(0);
  const [pm25, setPm25] = useState<number>(0);
  const [pm10, setPm10] = useState<number>(0);
  const [history, setHistory] = useState<DataPoint[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    loadLocations();
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    loadAirQualityData();
    loadWeather();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const loadLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await api.get("/locations");
      const locs = res.data || [];
      setLocations(locs);
      if (locs.length > 0) setSelected(locs[0].id);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  const loadAirQualityData = async () => {
    setLoading(true);
    try {
      const res = await api.get<AirQualityResponse>(
        `/data?locationId=${selected}&range=24h`
      );
      const { current, history } = res.data;
      if (!current) {
        toast.error("No air quality data available");
        return;
      }
      setAqi(current.aqi);
      setPm25(current.pm25);
      setPm10(current.pm10);
      const formattedHistory = history.map((point) => ({
        ts: new Date(point.ts).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: point.value,
      }));
      setHistory(formattedHistory);
    } catch (e) {
      console.error("Failed to load air quality:", e);
      toast.error("Failed to load air quality data");
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async () => {
    try {
      const res = await api.get(`/weather?location=${selected}`);
      if (res.data && res.data.length > 0) {
        setWeather(res.data[0]);
      }
    } catch (e) {
      console.error("Failed to load weather:", e);
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Good - Santa Approved!", color: "#165B33", emoji: "🎅", bg: "rgba(22, 91, 51, 0.1)" };
    if (aqi <= 100) return { label: "Moderate - Elves Working", color: "#FFD700", emoji: "🧝", bg: "rgba(255, 215, 0, 0.1)" };
    if (aqi <= 150) return { label: "Unhealthy - Reindeer Alert", color: "#FFA500", emoji: "🦌", bg: "rgba(255, 165, 0, 0.1)" };
    return { label: "Very Unhealthy - Blizzard Warning", color: "#C41E3A", emoji: "⛄", bg: "rgba(196, 30, 58, 0.1)" };
  };

  const status = getAQIStatus(aqi);
  const selectedLocation = locations.find((l) => l.id === selected);

  const lineChartData = {
    labels: history.map((h) => h.ts),
    datasets: [
      {
        label: "AQI - Christmas Tracking 🎄",
        data: history.map((h) => h.value),
        borderColor: "#C41E3A",
        backgroundColor: "rgba(196, 30, 58, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#FFD700",
        pointBorderColor: "#C41E3A",
        pointBorderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ["Good Hours 🎅", "Moderate 🧝", "Unhealthy 🦌"],
    datasets: [
      {
        data: [16, 6, 2],
        backgroundColor: ["#165B33", "#FFD700", "#C41E3A"],
        borderWidth: 3,
        borderColor: "#fff",
      },
    ],
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative" style={{ background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 100%)" }}>
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
            <div style={{ color: "#C41E3A", fontSize: "1.5rem", fontWeight: "bold" }}>
              Santa is preparing your dashboard...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* ✅ NEW: Replace Form.Select with LocationSelector */}
      <LocationSelector
        locations={locations}
        selected={selected}
        onChange={setSelected}
        loading={loadingLocations}
      />
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)", padding: "2rem", position: "relative", overflow: "hidden" }}>
        {/* Floating Snowflakes */}
        {[...Array(20)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.3} />
        ))}

        {/* Christmas Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="position-relative rounded-4 p-5 mb-4 text-white overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #C41E3A 0%, #165B33 100%)",
            boxShadow: "0 20px 60px rgba(196, 30, 58, 0.4)",
            border: "3px solid #FFD700",
          }}
        >
          {/* Christmas Ornaments */}
          <motion.div
            className="position-absolute"
            style={{ top: 20, right: 30, fontSize: "60px" }}
            animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎄
          </motion.div>
          <motion.div
            className="position-absolute"
            style={{ top: 40, left: 50, fontSize: "40px" }}
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🎁
          </motion.div>

          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FaMapMarkerAlt />
                  <span className="opacity-75">🎅 Santa's Current Location</span>
                </div>
                <h1 className="display-4 fw-bold mb-3" style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)" }}>
                  ⛄ {selectedLocation?.name || "Select Location"} 🎄
                </h1>
                <p className="lead mb-4 opacity-90">
                  🔔 Merry Christmas! Real-time air quality monitoring with festive cheer
                </p>
              </motion.div>
            </div>
            <div className="col-lg-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="row g-4 mb-4">
          {/* Giant AQI Christmas Card */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(196, 30, 58, 0.4)" }}
              className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
              style={{
                borderRadius: 24,
                background: status.bg,
                border: "3px solid #FFD700",
              }}
            >
              {/* Christmas Tree Background */}
              <div className="position-absolute" style={{ top: -50, right: -50, fontSize: "200px", opacity: 0.05 }}>
                🎄
              </div>

              <div className="card-body p-5 text-center position-relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-3"
                  style={{ fontSize: "5rem" }}
                >
                  {status.emoji}
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="display-1 fw-bold mb-2"
                  style={{ 
                    color: status.color, 
                    fontSize: "6rem",
                    textShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {aqi}
                </motion.div>

                <div className="h5 mb-4" style={{ color: status.color, fontWeight: "bold" }}>
                  {status.label}
                </div>

                <div className="row g-3 text-start">
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.7)", border: "2px solid #FFD700" }}>
                      <div className="text-muted small mb-1">🎁 PM2.5</div>
                      <div className="h4 mb-0 fw-bold" style={{ color: "#C41E3A" }}>{pm25.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.7)", border: "2px solid #FFD700" }}>
                      <div className="text-muted small mb-1">🎅 PM10</div>
                      <div className="h4 mb-0 fw-bold" style={{ color: "#165B33" }}>{pm10.toFixed(1)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-top" style={{ borderColor: "#FFD700 !important" }}>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <FaSnowflake style={{ color: "#87CEEB" }} />
                    <small style={{ color: status.color }}>
                      Last updated: {new Date().toLocaleTimeString("vi-VN")} 🎄
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weather Christmas Card */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: 24, border: "3px solid #FFD700", background: "linear-gradient(135deg, #FFFAFA 0%, #E0F7FA 100%)" }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FaCandyCane size={28} style={{ color: "#C41E3A" }} />
                  <h5 className="mb-0" style={{ color: "#165B33", fontWeight: "bold" }}>⛄ Winter Conditions</h5>
                </div>
                
                <div className="text-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: "5rem" }}
                  >
                    ❄️
                  </motion.div>
                  <div className="display-3 fw-bold mb-2" style={{ color: "#165B33" }}>
                    {weather?.temperatureC?.toFixed(1) ?? "---"}°
                  </div>
                  <div style={{ color: "#6c757d", fontWeight: "600" }}>Perfect for building snowmen!</div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: "rgba(196, 30, 58, 0.1)", border: "2px solid #FFD700" }}>
                      <span style={{ fontSize: "24px" }}>💧</span>
                      <div>
                        <div className="small text-muted">Humidity</div>
                        <div className="fw-bold" style={{ color: "#165B33" }}>
                          {weather?.humidityPct?.toFixed(0) ?? "---"}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: "rgba(22, 91, 51, 0.1)", border: "2px solid #FFD700" }}>
                      <span style={{ fontSize: "24px" }}>🌬️</span>
                      <div>
                        <div className="small text-muted">Wind</div>
                        <div className="fw-bold" style={{ color: "#C41E3A" }}>
                          {weather?.windSpeedMps?.toFixed(1) ?? "---"} m/s
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 24h Distribution Pie Chart */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card border-0 shadow-lg h-100"
              style={{ borderRadius: 24, border: "3px solid #FFD700", background: "white" }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaGift size={24} style={{ color: "#C41E3A" }} />
                  <h5 className="mb-0" style={{ color: "#165B33", fontWeight: "bold" }}>🎁 24h Distribution</h5>
                </div>
                <Doughnut
                  data={doughnutData}
                  options={{
                    cutout: "70%",
                    plugins: { 
                      legend: { 
                        position: "bottom",
                        labels: {
                          font: { size: 12, weight: "bold" },
                          color: "#165B33"
                        }
                      }
                    },
                  }}
                />
                <div className="text-center mt-3">
                  <div className="text-muted small">Average AQI Today</div>
                  <div className="h3 fw-bold" style={{ color: "#165B33" }}>{aqi} 🎄</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card border-0 shadow-lg mb-4"
          style={{ borderRadius: 24, border: "3px solid #FFD700", background: "white" }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FaChartLine size={24} style={{ color: "#C41E3A" }} />
              <h5 className="mb-0" style={{ color: "#165B33", fontWeight: "bold" }}>📊 24-Hour Christmas Trend</h5>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ marginLeft: "auto", fontSize: "1.5rem" }}
              >
                🎄
              </motion.div>
            </div>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { 
                    display: true,
                    labels: {
                      font: { size: 14, weight: "bold" },
                      color: "#165B33"
                    }
                  },
                },
                scales: {
                  y: { 
                    beginAtZero: true, 
                    grid: { color: "rgba(196, 30, 58, 0.1)" },
                    ticks: { color: "#165B33", font: { weight: "bold" } }
                  },
                  x: { 
                    grid: { display: false },
                    ticks: { color: "#165B33", font: { weight: "bold" } }
                  },
                },
              }}
            />
          </div>
        </motion.div>

        {/* Christmas Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <h3 style={{ color: "#C41E3A", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)" }}>
            🎅 Merry Christmas 2025! 🎄
          </h3>
          <p style={{ color: "#165B33", fontSize: "1.1rem" }}>
            May your air be as clean as freshly fallen snow! ❄️⛄
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}