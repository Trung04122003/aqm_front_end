// src/pages/Dashboard.tsx - ULTRA PREMIUM CHRISTMAS EDITION 🎄✨

import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import {
  FaSnowflake,
  FaGift,
  FaMapMarkerAlt,
  FaChartLine,
  FaCandyCane,
  FaSync,
  FaWind,
  FaExclamationCircle,
  FaTint,
  FaCompress,
  FaCloudRain,
  FaLeaf,
  FaSmog,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";
import api from "../api/axios";
import useAuth from "../auth/useAuth";
import { Line, Doughnut, Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  RadialLinearScale,
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
  BarElement,
  RadialLinearScale,
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

type AirQualityData = {
  id: number;
  locationId: number;
  pm25: number;
  pm10: number;
  aqi: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  timestampUtc: string;
};

type AirQualityResponse = {
  current: AirQualityData;
  history: AirQualityData[];
};

// Snowflake component
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "24px",
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

export default function ChristmasDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [currentData, setCurrentData] = useState<AirQualityData | null>(null);
  const [history, setHistory] = useState<AirQualityData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingNew, setFetchingNew] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");
  const { user } = useAuth();

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!selected) return;
    const interval = setInterval(
      () => {
        loadAirQualityData(false);
      },
      5 * 60 * 1000
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

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

  // Calculate trend when history changes
  useEffect(() => {
    if (history.length >= 2) {
      const recent = history.slice(-5);
      const avg = recent.reduce((sum, d) => sum + d.aqi, 0) / recent.length;
      const current = currentData?.aqi || 0;

      if (current > avg + 10) setTrend("up");
      else if (current < avg - 10) setTrend("down");
      else setTrend("stable");
    }
  }, [history, currentData]);

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

  const loadAirQualityData = async (showToast = true) => {
    if (!selected) return;

    setLoading(true);
    try {
      const res = await api.get<AirQualityResponse>(
        `/data?locationId=${selected}&range=24h`
      );

      const { current, history } = res.data;

      if (!current) {
        if (showToast) {
          toast.warning("No recent data available. Try fetching new data!");
        }
        setCurrentData(null);
        setHistory([]);
        return;
      }

      setCurrentData(current);
      setHistory(history || []);
      setLastUpdate(new Date());

      console.log("✅ Loaded data:", {
        current: current.aqi,
        historyCount: (history || []).length,
        firstPoint: history?.[0],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to load air quality:", e);
      if (showToast) {
        toast.error("Failed to load air quality data");
      }
      setCurrentData(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async () => {
    if (!selected) return;

    try {
      const res = await api.get(`/weather?location=${selected}`);
      if (res.data && res.data.length > 0) {
        setWeather(res.data[0]);
      }
    } catch (e) {
      console.error("Failed to load weather:", e);
    }
  };

  const handleRefresh = async () => {
    if (!selected) return;
    setRefreshing(true);
    try {
      await loadAirQualityData();
      await loadWeather();
      toast.success("✅ Data refreshed!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleFetchNew = async () => {
    if (!selected) return;

    setFetchingNew(true);
    try {
      toast.info("🌍 Fetching new data from OpenWeatherMap...");
      await api.post(`/aqi/fetch/${selected}`);

      setTimeout(async () => {
        await loadAirQualityData();
        setFetchingNew(false);
        toast.success("✅ Fresh data fetched successfully!");
      }, 3000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to fetch new data:", e);
      setFetchingNew(false);

      if (e.response?.status === 500) {
        toast.error(
          "❌ Server error. Please check if OpenWeatherMap API is configured."
        );
      } else {
        toast.error("❌ Failed to fetch new data. Please try again later.");
      }
    }
  };

  const handleFetchWeather = async () => {
    if (!selected) return;

    setRefreshing(true);
    try {
      toast.info("🌤️ Fetching fresh weather data...");
      await api.post(`/weather/fetch/${selected}`);

      // Wait a bit then reload weather
      setTimeout(async () => {
        await loadWeather();
        setRefreshing(false);
        toast.success("✅ Fresh weather data loaded!");
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to fetch weather:", e);
      setRefreshing(false);

      if (e.response?.status === 500) {
        toast.error("❌ Weather API error. Please try again later.");
      } else {
        toast.error("❌ Failed to fetch weather data.");
      }
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50)
      return {
        label: "Good - Santa Approved!",
        color: "#165B33",
        emoji: "🎅",
        bg: "rgba(22, 91, 51, 0.1)",
      };
    if (aqi <= 100)
      return {
        label: "Moderate - Elves Working",
        color: "#FFD700",
        emoji: "🧝",
        bg: "rgba(255, 215, 0, 0.1)",
      };
    if (aqi <= 150)
      return {
        label: "Unhealthy - Reindeer Alert",
        color: "#FFA500",
        emoji: "🦌",
        bg: "rgba(255, 165, 0, 0.1)",
      };
    if (aqi <= 200)
      return {
        label: "Unhealthy - High Alert",
        color: "#FF6347",
        emoji: "⚠️",
        bg: "rgba(255, 99, 71, 0.1)",
      };
    if (aqi <= 300)
      return {
        label: "Very Unhealthy",
        color: "#C41E3A",
        emoji: "😷",
        bg: "rgba(196, 30, 58, 0.1)",
      };
    return {
      label: "Hazardous - Blizzard Warning",
      color: "#8B0000",
      emoji: "☠️",
      bg: "rgba(139, 0, 0, 0.1)",
    };
  };

  const calculateDistribution = () => {
    if (!history || history.length === 0)
      return { good: 0, moderate: 0, unhealthy: 0, veryUnhealthy: 0 };
    return history.reduce(
      (acc, point) => {
        const aqi = point.aqi || 0;
        if (aqi <= 50) acc.good++;
        else if (aqi <= 100) acc.moderate++;
        else if (aqi <= 200) acc.unhealthy++;
        else acc.veryUnhealthy++;
        return acc;
      },
      { good: 0, moderate: 0, unhealthy: 0, veryUnhealthy: 0 }
    );
  };

  // ✅ Calculate average AQI (handle empty history)
  const calculateAverageAQI = () => {
    if (!history || history.length === 0) return 0;
    const sum = history.reduce((total, h) => total + (h.aqi || 0), 0);
    return Math.round(sum / history.length);
  };

  const distribution = calculateDistribution();
  const aqi = currentData?.aqi || 0;
  const pm25 = currentData?.pm25 || 0;
  const pm10 = currentData?.pm10 || 0;
  const averageAQI = calculateAverageAQI();
  const status = getAQIStatus(aqi);
  const selectedLocation = locations.find((l) => l.id === selected);

  // ✅ FIXED: Filter valid history data and format timestamps properly
  const validHistory = history.filter((h) => h.timestampUtc && h.aqi != null);

  // 📊 LINE CHART - 24H AQI Trend (FIXED)
  const lineChartData =
    validHistory.length > 0
      ? {
          labels: validHistory.map((h) => {
            try {
              const date = new Date(h.timestampUtc);
              return date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch {
              return "N/A";
            }
          }),
          datasets: [
            {
              label: "AQI - Christmas Tracking 🎄",
              data: validHistory.map((h) => h.aqi),
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
        }
      : null;

  // 🥧 DOUGHNUT CHART - Distribution (FIXED)
  const doughnutData =
    distribution.good +
      distribution.moderate +
      distribution.unhealthy +
      distribution.veryUnhealthy >
    0
      ? {
          labels: [
            "Good 🎅",
            "Moderate 🧝",
            "Unhealthy ⚠️",
            "Very Unhealthy 😷",
          ],
          datasets: [
            {
              data: [
                distribution.good,
                distribution.moderate,
                distribution.unhealthy,
                distribution.veryUnhealthy,
              ],
              backgroundColor: ["#165B33", "#FFD700", "#FFA500", "#C41E3A"],
              borderWidth: 3,
              borderColor: "#fff",
            },
          ],
        }
      : null;

  // 📊 BAR CHART - PM2.5 & PM10 Comparison (Last 6 hours) (FIXED)
  const recent6Hours = validHistory.slice(-6);
  const barChartData =
    recent6Hours.length > 0
      ? {
          labels: recent6Hours.map((h) => {
            try {
              return new Date(h.timestampUtc).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch {
              return "N/A";
            }
          }),
          datasets: [
            {
              label: "PM2.5 🎁",
              data: recent6Hours.map((h) => h.pm25 || 0),
              backgroundColor: "rgba(255, 215, 0, 0.7)",
              borderColor: "#FFD700",
              borderWidth: 2,
            },
            {
              label: "PM10 🎅",
              data: recent6Hours.map((h) => h.pm10 || 0),
              backgroundColor: "rgba(22, 91, 51, 0.7)",
              borderColor: "#165B33",
              borderWidth: 2,
            },
          ],
        }
      : null;

  // 🎯 RADAR CHART - Pollutants Overview (FIXED TYPE)
  const radarData = currentData
    ? {
        labels: ["PM2.5", "PM10", "NO₂", "SO₂", "CO", "O₃"],
        datasets: [
          {
            label: "Current Levels",
            data: [
              currentData.pm25 || 0,
              currentData.pm10 || 0,
              (currentData.no2 || 0) * 100,
              (currentData.so2 || 0) * 100,
              (currentData.co || 0) * 10,
              (currentData.o3 || 0) * 10,
            ] as number[], // ✅ FIXED: Explicit type annotation
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            borderColor: "#FFD700",
            borderWidth: 3,
            pointBackgroundColor: "#C41E3A",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#C41E3A",
          },
        ],
      }
    : null;

  // Loading State
  if (loading && !currentData) {
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
              Santa is preparing your dashboard...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <LocationSelector
        locations={locations}
        selected={selected}
        onChange={setSelected}
        loading={loadingLocations}
      />
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
        {[...Array(20)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.3} />
        ))}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-end gap-2 mb-3"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline-success d-flex align-items-center gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ borderWidth: 2, fontWeight: 600, borderRadius: 12 }}
          >
            <FaSync
              className={refreshing ? "spinner-border spinner-border-sm" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleFetchNew}
            disabled={fetchingNew}
            style={{ fontWeight: 600, borderRadius: 12 }}
          >
            <FaWind />
            {fetchingNew ? "Fetching..." : "Fetch New Data"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-info d-flex align-items-center gap-2"
            onClick={handleFetchWeather}
            disabled={refreshing}
            style={{ fontWeight: 600, borderRadius: 12 }}
          >
            <FaCloudRain />
            {refreshing ? "Fetching..." : "Fetch Weather"}
          </motion.button>
        </motion.div>

        {/* No Data Warning */}
        {!currentData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-warning d-flex align-items-center gap-3 mb-4"
            style={{ borderRadius: 16, border: "3px solid #FFD700" }}
          >
            <FaExclamationCircle size={24} />
            <div>
              <strong>No data available for this location!</strong>
              <p className="mb-0">
                Click "Fetch New Data" to get fresh air quality information.
              </p>
            </div>
          </motion.div>
        )}

        {/* Hero Section */}
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
          <motion.div
            className="position-absolute"
            style={{ top: 20, right: 30, fontSize: "60px" }}
            animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎄
          </motion.div>

          <div className="row align-items-center position-relative">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaMapMarkerAlt />
                <span className="opacity-75">🎅 Santa's Current Location</span>
              </div>
              <h1
                className="display-4 fw-bold mb-3"
                style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)" }}
              >
                ⛄ {selectedLocation?.name || "Select Location"} 🎄
              </h1>
              <p className="lead mb-2 opacity-90">
                🔔 Merry Christmas! Real-time air quality monitoring with
                festive cheer
              </p>
              {lastUpdate && (
                <div className="d-flex align-items-center gap-2 opacity-75">
                  <FaClock size={14} />
                  <small>
                    Last updated: {lastUpdate.toLocaleTimeString("vi-VN")}
                  </small>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="row g-4 mb-4">
          {/* Giant AQI Card */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
              style={{
                borderRadius: 24,
                background: status.bg,
                border: "3px solid #FFD700",
              }}
            >
              <div
                className="position-absolute"
                style={{
                  top: -50,
                  right: -50,
                  fontSize: "200px",
                  opacity: 0.05,
                }}
              >
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
                    textShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {aqi || "---"}
                </motion.div>

                <div
                  className="h5 mb-3"
                  style={{ color: status.color, fontWeight: "bold" }}
                >
                  {status.label}
                </div>

                {/* Trend Indicator */}
                <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
                  {trend === "up" && (
                    <>
                      <FaArrowUp style={{ color: "#FF6347" }} />
                      <span className="small" style={{ color: "#FF6347" }}>
                        Increasing
                      </span>
                    </>
                  )}
                  {trend === "down" && (
                    <>
                      <FaArrowDown style={{ color: "#10b981" }} />
                      <span className="small" style={{ color: "#10b981" }}>
                        Decreasing
                      </span>
                    </>
                  )}
                  {trend === "stable" && (
                    <>
                      <FaMinus style={{ color: "#FFD700" }} />
                      <span className="small" style={{ color: "#FFD700" }}>
                        Stable
                      </span>
                    </>
                  )}
                </div>

                <div className="row g-3 text-start">
                  <div className="col-6">
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <div className="text-muted small mb-1">🎁 PM2.5</div>
                      <div
                        className="h4 mb-0 fw-bold"
                        style={{ color: "#C41E3A" }}
                      >
                        {pm25 ? pm25.toFixed(1) : "---"}
                      </div>
                      <div className="text-muted small">µg/m³</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="p-3 rounded-3"
                      style={{
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <div className="text-muted small mb-1">🎅 PM10</div>
                      <div
                        className="h4 mb-0 fw-bold"
                        style={{ color: "#165B33" }}
                      >
                        {pm10 ? pm10.toFixed(1) : "---"}
                      </div>
                      <div className="text-muted small">µg/m³</div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 pt-4 border-top"
                  style={{ borderColor: "#FFD700 !important" }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <FaSnowflake style={{ color: "#87CEEB" }} />
                    <small style={{ color: status.color }}>
                      {currentData?.timestampUtc
                        ? `Data from: ${new Date(currentData.timestampUtc).toLocaleString("vi-VN")}`
                        : "No data available"}{" "}
                      🎄
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weather Card */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card border-0 shadow-lg h-100"
              style={{
                borderRadius: 24,
                border: "3px solid #FFD700",
                background: "linear-gradient(135deg, #FFFAFA 0%, #E0F7FA 100%)",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FaCandyCane size={28} style={{ color: "#C41E3A" }} />
                  <h5
                    className="mb-0"
                    style={{ color: "#165B33", fontWeight: "bold" }}
                  >
                    ⛄ Winter Conditions
                  </h5>
                </div>

                <div className="text-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ fontSize: "5rem" }}
                  >
                    ❄️
                  </motion.div>
                  <div
                    className="display-3 fw-bold mb-2"
                    style={{ color: "#165B33" }}
                  >
                    {weather?.temperatureC?.toFixed(1) ?? "---"}°
                  </div>
                  <div style={{ color: "#6c757d", fontWeight: "600" }}>
                    Perfect for building snowmen!
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div
                      className="d-flex align-items-center gap-2 p-3 rounded-3"
                      style={{
                        background: "rgba(196, 30, 58, 0.1)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <FaTint style={{ fontSize: "24px", color: "#0ea5e9" }} />
                      <div>
                        <div className="small text-muted">Humidity</div>
                        <div className="fw-bold" style={{ color: "#165B33" }}>
                          {weather?.humidityPct?.toFixed(0) ?? "---"}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="d-flex align-items-center gap-2 p-3 rounded-3"
                      style={{
                        background: "rgba(22, 91, 51, 0.1)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <FaWind style={{ fontSize: "24px", color: "#10b981" }} />
                      <div>
                        <div className="small text-muted">Wind</div>
                        <div className="fw-bold" style={{ color: "#C41E3A" }}>
                          {weather?.windSpeedMps?.toFixed(1) ?? "---"} m/s
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="d-flex align-items-center gap-2 p-3 rounded-3"
                      style={{
                        background: "rgba(255, 215, 0, 0.1)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <FaCompress
                        style={{ fontSize: "24px", color: "#FFD700" }}
                      />
                      <div>
                        <div className="small text-muted">Pressure</div>
                        <div className="fw-bold" style={{ color: "#165B33" }}>
                          {weather?.pressureHpa?.toFixed(0) ?? "---"} hPa
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="d-flex align-items-center gap-2 p-3 rounded-3"
                      style={{
                        background: "rgba(103, 232, 249, 0.1)",
                        border: "2px solid #FFD700",
                      }}
                    >
                      <FaCloudRain
                        style={{ fontSize: "24px", color: "#67e8f9" }}
                      />
                      <div>
                        <div className="small text-muted">Rain</div>
                        <div className="fw-bold" style={{ color: "#C41E3A" }}>
                          {weather?.precipProbabilityPct?.toFixed(0) ?? "---"}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Distribution Pie */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card border-0 shadow-lg h-100"
              style={{
                borderRadius: 24,
                border: "3px solid #FFD700",
                background: "white",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaGift size={24} style={{ color: "#C41E3A" }} />
                  <h5
                    className="mb-0"
                    style={{ color: "#165B33", fontWeight: "bold" }}
                  >
                    🎁 24h Distribution
                  </h5>
                </div>
                {doughnutData ? (
                  <>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        cutout: "70%",
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              font: { size: 11, weight: "bold" },
                              color: "#165B33",
                              padding: 10,
                            },
                          },
                        },
                      }}
                    />
                    <div className="text-center mt-3">
                      <div className="text-muted small">Average AQI (24h)</div>
                      <div className="h3 fw-bold" style={{ color: "#165B33" }}>
                        {averageAQI > 0 ? averageAQI : "---"} 🎄
                      </div>
                      <div className="small text-muted">
                        {validHistory.length} data points
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaExclamationCircle size={48} className="mb-3" />
                    <p>No history data available</p>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={handleFetchNew}
                    >
                      Fetch Data
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pollutants Detail Cards Row */}
        <div className="row g-4 mb-4">
          {[
            {
              label: "NO₂",
              value: currentData?.no2,
              icon: <FaSmog />,
              color: "#ff6b6b",
              unit: "mg/m³",
            },
            {
              label: "SO₂",
              value: currentData?.so2,
              icon: <FaFire />,
              color: "#fbbf24",
              unit: "mg/m³",
            },
            {
              label: "CO",
              value: currentData?.co,
              icon: <FaLeaf />,
              color: "#10b981",
              unit: "mg/m³",
            },
            {
              label: "O₃",
              value: currentData?.o3,
              icon: <FaWind />,
              color: "#67e8f9",
              unit: "mg/m³",
            },
          ].map((pollutant, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="card border-0 shadow"
                style={{
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${pollutant.color}15, ${pollutant.color}05)`,
                  border: `2px solid ${pollutant.color}30`,
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    style={{
                      fontSize: "2rem",
                      color: pollutant.color,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {pollutant.icon}
                  </div>
                  <div className="small text-muted mb-2">{pollutant.label}</div>
                  <div
                    className="h4 fw-bold mb-0"
                    style={{ color: pollutant.color }}
                  >
                    {pollutant.value ? pollutant.value.toFixed(3) : "---"}
                  </div>
                  <div className="small text-muted">{pollutant.unit}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          {/* 24H Trend Line Chart */}
          <div className="col-12 col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card border-0 shadow-lg"
              style={{
                borderRadius: 24,
                border: "3px solid #FFD700",
                background: "white",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <FaChartLine size={24} style={{ color: "#C41E3A" }} />
                    <h5
                      className="mb-0"
                      style={{ color: "#165B33", fontWeight: "bold" }}
                    >
                      📊 24-Hour AQI Trend
                    </h5>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ fontSize: "1.5rem" }}
                  >
                    🎄
                  </motion.div>
                </div>
                {lineChartData ? (
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
                            color: "#165B33",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          padding: 12,
                          titleColor: "#FFD700",
                          bodyColor: "#fff",
                          borderColor: "#FFD700",
                          borderWidth: 2,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(196, 30, 58, 0.1)" },
                          ticks: { color: "#165B33", font: { weight: "bold" } },
                          title: {
                            display: true,
                            text: "AQI Value",
                            color: "#165B33",
                            font: { size: 14, weight: "bold" },
                          },
                        },
                        x: {
                          grid: { display: false },
                          ticks: {
                            color: "#165B33",
                            font: { weight: "bold" },
                            maxRotation: 45,
                            minRotation: 45,
                          },
                          title: {
                            display: true,
                            text: "Time",
                            color: "#165B33",
                            font: { size: 14, weight: "bold" },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaExclamationCircle size={48} className="mb-3" />
                    <p>
                      No trend data available. Click "Fetch New Data" to get
                      started!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pollutants Radar Chart */}
          <div className="col-12 col-lg-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card border-0 shadow-lg h-100"
              style={{
                borderRadius: 24,
                border: "3px solid #FFD700",
                background: "white",
              }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <FaLeaf size={24} style={{ color: "#10b981" }} />
                  <h5
                    className="mb-0"
                    style={{ color: "#165B33", fontWeight: "bold" }}
                  >
                    🎯 Pollutants
                  </h5>
                </div>
                {radarData ? (
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        r: {
                          beginAtZero: true,
                          grid: { color: "rgba(255, 215, 0, 0.2)" },
                          angleLines: { color: "rgba(196, 30, 58, 0.2)" },
                          ticks: {
                            backdropColor: "transparent",
                            color: "#165B33",
                            font: { size: 10, weight: "bold" },
                          },
                          pointLabels: {
                            color: "#165B33",
                            font: { size: 12, weight: "bold" },
                          },
                        },
                      },
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaExclamationCircle size={48} className="mb-3" />
                    <p>No pollutant data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* PM Comparison Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card border-0 shadow-lg mb-4"
          style={{
            borderRadius: 24,
            border: "3px solid #FFD700",
            background: "white",
          }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <FaGift size={24} style={{ color: "#FFD700" }} />
              <h5
                className="mb-0"
                style={{ color: "#165B33", fontWeight: "bold" }}
              >
                🎁 PM2.5 vs PM10 (Last 6 Hours)
              </h5>
            </div>
            {recent6Hours.length > 0 ? (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        font: { size: 14, weight: "bold" },
                        color: "#165B33",
                        padding: 20,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(196, 30, 58, 0.1)" },
                      ticks: { color: "#165B33", font: { weight: "bold" } },
                      title: {
                        display: true,
                        text: "µg/m³",
                        color: "#165B33",
                        font: { size: 14, weight: "bold" },
                      },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: "#165B33", font: { weight: "bold" } },
                    },
                  },
                }}
              />
            ) : (
              <div className="text-center text-muted py-5">
                <FaExclamationCircle size={48} className="mb-3" />
                <p>No comparison data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Health Recommendations Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card border-0 shadow-lg mb-4"
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #E0F7FA 0%, #FFFAFA 100%)",
            border: "3px solid #FFD700",
          }}
        >
          <div className="card-body p-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: "3rem" }}
              >
                🎅
              </motion.div>
              <div>
                <h4
                  className="mb-1"
                  style={{ color: "#C41E3A", fontWeight: "bold" }}
                >
                  Santa's Health Advisory
                </h4>
                <p className="mb-0 text-muted">Based on current AQI: {aqi}</p>
              </div>
            </div>

            <div className="row g-4">
              {aqi <= 50 && (
                <div className="col-12">
                  <div
                    className="d-flex align-items-start gap-3 p-4 rounded-3"
                    style={{ background: "rgba(22, 91, 51, 0.1)" }}
                  >
                    <FaCheckCircle
                      size={32}
                      style={{ color: "#10b981", flexShrink: 0 }}
                    />
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: "#165B33" }}>
                        Excellent Air Quality! 🎉
                      </h6>
                      <p className="mb-2">
                        Perfect conditions for outdoor activities. Santa
                        approves!
                      </p>
                      <ul className="mb-0">
                        <li>Ideal for outdoor exercise and sports</li>
                        <li>Great day for walking or cycling</li>
                        <li>Children can play outside freely</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {aqi > 50 && aqi <= 100 && (
                <div className="col-12">
                  <div
                    className="d-flex align-items-start gap-3 p-4 rounded-3"
                    style={{ background: "rgba(255, 215, 0, 0.1)" }}
                  >
                    <FaExclamationCircle
                      size={32}
                      style={{ color: "#FFD700", flexShrink: 0 }}
                    />
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: "#B8860B" }}>
                        Moderate Air Quality
                      </h6>
                      <p className="mb-2">
                        Acceptable for most people, but sensitive groups should
                        take precautions.
                      </p>
                      <ul className="mb-0">
                        <li>
                          Unusually sensitive people may experience symptoms
                        </li>
                        <li>Consider reducing prolonged outdoor exertion</li>
                        <li>
                          Monitor symptoms if you have respiratory conditions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {aqi > 100 && (
                <div className="col-12">
                  <div
                    className="d-flex align-items-start gap-3 p-4 rounded-3"
                    style={{ background: "rgba(196, 30, 58, 0.1)" }}
                  >
                    <FaExclamationCircle
                      size={32}
                      style={{ color: "#C41E3A", flexShrink: 0 }}
                    />
                    <div>
                      <h6 className="fw-bold mb-2" style={{ color: "#C41E3A" }}>
                        Unhealthy Air Quality! ⚠️
                      </h6>
                      <p className="mb-2">
                        Everyone may begin to experience health effects. Take
                        precautions!
                      </p>
                      <ul className="mb-0">
                        <li>Avoid prolonged outdoor activities</li>
                        <li>Close windows and stay indoors</li>
                        <li>Use air purifiers if available</li>
                        <li>Wear N95 masks if you must go outside</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-4"
        >
          <h3
            style={{
              color: "#C41E3A",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            🎅 Merry Christmas 2025! 🎄
          </h3>
          <p style={{ color: "#165B33", fontSize: "1.1rem" }}>
            May your air be as clean as freshly fallen snow! ❄️⛄
          </p>
          <p className="text-muted small">
            Data updates every 5 minutes • Last update:{" "}
            {lastUpdate?.toLocaleString("vi-VN") || "Never"}
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
