// src/pages/Dashboard.tsx (ULTRA-BEAUTIFUL ENHANCED VERSION WITH LOCATION SELECTOR)
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { motion } from "framer-motion";
import {
  FaCloudSun,
  FaWind,
  FaTint,
  FaMapMarkerAlt,
  FaChartLine,
  FaLeaf,
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
import LocationSelector from "../components/LocationSelector"; // ✅ NEW: Import LocationSelector

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

// ✅ FIXED: Type definitions matching Backend
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

export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [aqi, setAqi] = useState<number>(0);
  const [pm25, setPm25] = useState<number>(0);
  const [pm10, setPm10] = useState<number>(0);
  const [history, setHistory] = useState<DataPoint[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true); // ✅ NEW: State for locations loading
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
    setLoadingLocations(true); // ✅ NEW: Start loading
    try {
      const res = await api.get("/locations");
      const locs = res.data || [];
      setLocations(locs);
      if (locs.length > 0) setSelected(locs[0].id);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load locations");
    } finally {
      setLoadingLocations(false); // ✅ NEW: End loading
    }
  };

  // ✅ FIXED: Load Air Quality Data
  const loadAirQualityData = async () => {
    setLoading(true);
    try {
      const res = await api.get<AirQualityResponse>(
        `/data?locationId=${selected}&range=24h`
      );

      // ✅ Direct access - no optional chaining hell
      const { current, history } = res.data;

      if (!current) {
        toast.error("No air quality data available");
        return;
      }

      setAqi(current.aqi);
      setPm25(current.pm25);
      setPm10(current.pm10);

      // ✅ Format history for charts
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

  // ✅ FIXED: Load Weather Data
  const loadWeather = async () => {
    try {
      const res = await api.get(`/weather?location=${selected}`);

      // Backend returns WeatherDataDto[]
      if (res.data && res.data.length > 0) {
        setWeather(res.data[0]); // Latest weather
      }
    } catch (e) {
      console.error("Failed to load weather:", e);
    }
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "#10b981", emoji: "😊" };
    if (aqi <= 100) return { label: "Moderate", color: "#f59e0b", emoji: "😐" };
    if (aqi <= 150)
      return {
        label: "Unhealthy for Sensitive",
        color: "#ef4444",
        emoji: "😷",
      };
    return { label: "Unhealthy", color: "#dc2626", emoji: "🤢" };
  };

  const status = getAQIStatus(aqi);
  const selectedLocation = locations.find((l) => l.id === selected);

  const lineChartData = {
    labels: history.map((h) => h.ts),
    datasets: [
      {
        label: "AQI",
        data: history.map((h) => h.value),
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Good Hours", "Moderate", "Unhealthy"],
    datasets: [
      {
        data: [16, 6, 2],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
          <div
            className="spinner-border text-primary"
            style={{ width: 60, height: 60 }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="position-relative rounded-4 p-5 mb-4 text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
        }}
      >
        <div
          className="position-absolute top-0 end-0 opacity-25"
          style={{ fontSize: "15rem" }}
        >
          {status.emoji}
        </div>

        <div className="row align-items-center position-relative">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaMapMarkerAlt />
                <span className="opacity-75">Current Location</span>
              </div>
              <h1 className="display-4 fw-bold mb-3">
                {selectedLocation?.name || "Select Location"}
              </h1>
              <p className="lead mb-4 opacity-90">
                Real-time air quality monitoring and forecasting system
              </p>
            </motion.div>
          </div>

          <div className="col-lg-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* ✅ NEW: Replace Form.Select with LocationSelector */}
              <LocationSelector
                locations={locations}
                selected={selected}
                onChange={setSelected}
                loading={loadingLocations}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
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
              background: `linear-gradient(135deg, ${status.color}15, ${status.color}05)`,
            }}
          >
            <div className="card-body p-5 text-center">
              <div className="mb-3" style={{ fontSize: "4rem" }}>
                {status.emoji}
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="display-1 fw-bold mb-2"
                style={{ color: status.color, fontSize: "5rem" }}
              >
                {aqi}
              </motion.div>

              <div className="h5 mb-4" style={{ color: status.color }}>
                {status.label}
              </div>

              <div className="row g-3 text-start">
                <div className="col-6">
                  <div
                    className="p-3 rounded-3"
                    style={{ background: "rgba(0,0,0,0.03)" }}
                  >
                    <div className="text-muted small mb-1">PM2.5</div>
                    <div className="h4 mb-0 fw-bold">{pm25.toFixed(1)}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded-3"
                    style={{ background: "rgba(0,0,0,0.03)" }}
                  >
                    <div className="text-muted small mb-1">PM10</div>
                    <div className="h4 mb-0 fw-bold">{pm10.toFixed(1)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-top">
                <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                  <FaLeaf className="text-success" />
                  <small>
                    Last updated: {new Date().toLocaleTimeString("vi-VN")}
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
            style={{ borderRadius: 24 }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <FaCloudSun size={28} className="text-warning" />
                <h5 className="mb-0">Weather Conditions</h5>
              </div>

              <div className="text-center mb-4">
                <div className="display-3 fw-bold mb-2">
                  {weather?.temperatureC?.toFixed(1) ?? "—"}°
                </div>
                <div className="text-muted">Temperature</div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-light">
                    <FaTint className="text-info" size={20} />
                    <div>
                      <div className="small text-muted">Humidity</div>
                      <div className="fw-bold">
                        {weather?.humidityPct?.toFixed(0) ?? "—"}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-light">
                    <FaWind className="text-primary" size={20} />
                    <div>
                      <div className="small text-muted">Wind</div>
                      <div className="fw-bold">
                        {weather?.windSpeedMps?.toFixed(1) ?? "—"} m/s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="col-12 col-lg-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-lg h-100"
            style={{ borderRadius: 24 }}
          >
            <div className="card-body p-4">
              <h5 className="mb-4">24h Distribution</h5>
              <Doughnut
                data={doughnutData}
                options={{
                  cutout: "70%",
                  plugins: { legend: { position: "bottom" } },
                }}
              />
              <div className="text-center mt-3">
                <div className="text-muted small">Average AQI Today</div>
                <div className="h3 fw-bold text-success">{aqi}</div>
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
        style={{ borderRadius: 24 }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <FaChartLine size={24} className="text-primary" />
            <h5 className="mb-0">24-Hour Trend</h5>
          </div>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
                x: { grid: { display: false } },
              },
            }}
          />
        </div>
      </motion.div>
    </MainLayout>
  );
}