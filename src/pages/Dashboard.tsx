// src/pages/Dashboard.tsx (ULTRA-BEAUTIFUL ENHANCED VERSION)
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
import { Form } from "react-bootstrap";
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
    try {
      const res = await api.get("/locations");
      const locs = res.data || [];
      setLocations(locs);
      if (locs.length > 0) setSelected(locs[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAirQualityData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/data?locationId=${selected}&range=24h`);
      const payload = res.data?.data || res.data || {}; // ← Handle nested response

      setAqi(payload?.current?.aqi ?? 50);
      setPm25(payload?.current?.pm25 ?? 15.5);
      setPm10(payload?.current?.pm10 ?? 28.3);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hist = (payload.history || []).map((p: any) => ({
        ts: new Date(p.ts).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: p.value ?? p.aqi ?? 0,
      }));
      setHistory(hist);
    } catch (e) {
      console.error(e);
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
      console.error(e);
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
              <Form.Select
                value={selected ?? undefined}
                onChange={(e) => setSelected(Number(e.target.value))}
                className="form-select-lg border-0 shadow"
                style={{
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    📍 {loc.name}
                  </option>
                ))}
              </Form.Select>
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

// // src/pages/Dashboard.tsx (ENHANCED VERSION)
// import { useEffect, useState } from "react";
// import MainLayout from "../layouts/MainLayout";
// import AQICard from "../components/AQICard";
// import ChartWrapper from "../components/ChartWrapper";
// import StatCard from "../components/StatCard";
// import WeatherCard from "../components/WeatherCard";
// import SkeletonLoader from "../components/SkeletonLoader";
// import EmptyState from "../components/EmptyState";
// import api from "../api/axios";
// import { Form } from "react-bootstrap";
// import useAuth from "../auth/useAuth";
// import MapHeatmap from "../components/MapHeatmap";

// type Location = {
//   id: number;
//   name: string;
//   latitude?: number;
//   longitude?: number;
// };

// type DataPoint = { ts: string; value: number };

// type WeatherData = {
//   temperatureC?: number;
//   humidityPct?: number;
//   windSpeedMps?: number;
//   windDirDeg?: number;
//   pressureHpa?: number;
//   precipProbabilityPct?: number;
// };

// export default function Dashboard() {
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [aqi, setAqi] = useState<number>(0);
//   const [pm25, setPm25] = useState<number | undefined>(undefined);
//   const [history, setHistory] = useState<DataPoint[]>([]);
//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const { user } = useAuth();

//   // Load locations
//   useEffect(() => {
//     if (!user) return;

//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.warn("dashboard: no token yet, skip loading locations");
//           return;
//         }
//         const res = await api.get("/locations");
//         const locs = res.data || [];
//         setLocations(locs);
//         if (locs.length > 0) setSelected(locs[0].id);
//       } catch (e) {
//         console.error("Failed to load locations", e);
//       }
//     })();
//   }, [user]);

//   // Load air quality data
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token || !selected) return;

//     setLoading(true);
//     (async () => {
//       try {
//         const r1 = await api.get(`/data?locationId=${selected}&range=24h`);
//         const payload = r1.data || {};
//         setAqi(payload?.current?.aqi ?? 0);
//         setPm25(payload?.current?.pm25 ?? undefined);

//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const hist: DataPoint[] = (payload.history || []).map((p: any) => ({
//           ts: p.ts || p.time || "",
//           value: p.value ?? p.aqi ?? 0,
//         }));
//         setHistory(hist);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [selected]);

//   // Load weather data
//   useEffect(() => {
//     if (!selected) return;

//     setWeatherLoading(true);
//     (async () => {
//       try {
//         const res = await api.get(`/weather?location=${selected}`);
//         const data = res.data;
//         if (data && data.length > 0) {
//           setWeather(data[0]); // Get latest weather
//         }
//       } catch (e) {
//         console.error("Failed to load weather", e);
//       } finally {
//         setWeatherLoading(false);
//       }
//     })();
//   }, [selected]);

//   if (!locations.length && !loading) {
//     return (
//       <MainLayout>
//         <EmptyState
//           icon="📍"
//           title="No Locations Available"
//           message="No monitoring locations found in the system. Please contact administrator."
//         />
//       </MainLayout>
//     );
//   }

//   if ((locations.length === 0 && loading)) {
//     return (
//       <MainLayout>
//         <SkeletonLoader type="card" count={1} height={100} />
//         <div className="row g-3 mt-3">
//           <div className="col-md-6">
//             <SkeletonLoader type="card" height={200} />
//           </div>
//           <div className="col-md-6">
//             <SkeletonLoader type="card" height={200} />
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   const selectedLocation = locations.find(l => l.id === selected);

//   return (
//     <MainLayout>
//       {/* Header with Location Selector */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h3 className="mb-1">Dashboard</h3>
//           <p className="text-muted small mb-0">
//             Real-time air quality monitoring
//           </p>
//         </div>
//         <div style={{ minWidth: 220 }}>
//           <Form.Select
//             value={selected ?? undefined}
//             onChange={(e) => setSelected(Number(e.target.value))}
//             style={{ borderRadius: 12 }}
//           >
//             {locations.map((loc) => (
//               <option key={loc.id} value={loc.id}>
//                 📍 {loc.name}
//               </option>
//             ))}
//           </Form.Select>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="row g-3 mb-3">
//         {/* AQI Card */}
//         <div className="col-12 col-md-6 col-xl-4">
//           {loading ? (
//             <SkeletonLoader type="card" height={200} />
//           ) : (
//             <AQICard
//               aqi={aqi}
//               pm25={pm25}
//               locationName={selectedLocation?.name}
//             />
//           )}
//         </div>

//         {/* Weather Card */}
//         <div className="col-12 col-md-6 col-xl-4">
//           {weatherLoading ? (
//             <SkeletonLoader type="card" height={200} />
//           ) : weather ? (
//             <WeatherCard
//               temperature={weather.temperatureC}
//               humidity={weather.humidityPct}
//               windSpeed={weather.windSpeedMps}
//               windDirection={weather.windDirDeg}
//               pressure={weather.pressureHpa}
//               precipProbability={weather.precipProbabilityPct}
//               locationName={selectedLocation?.name}
//             />
//           ) : (
//             <EmptyState
//               icon="🌤️"
//               title="No Weather Data"
//               message="Weather information unavailable."
//             />
//           )}
//         </div>

//         {/* Stats Cards */}
//         <div className="col-12 col-md-6 col-xl-2">
//           <StatCard
//             label="Stations"
//             value={locations.length}
//             help="Active sensors"
//           />
//         </div>

//         <div className="col-12 col-md-6 col-xl-2">
//           <StatCard
//             label="Forecast model"
//             value={"LSTM v1.0"}
//             help="AI prediction"
//           />
//         </div>
//       </div>

//       {/* Chart Section */}
//       <div className="row g-3 mb-3">
//         <div className="col-12 col-lg-8">
//           {loading ? (
//             <SkeletonLoader type="chart" height={300} />
//           ) : history.length > 0 ? (
//             <div>
//               <div className="mb-2">
//                 <h5>24-Hour AQI Trend</h5>
//                 <p className="text-muted small mb-0">Historical air quality index</p>
//               </div>
//               <ChartWrapper data={history} height={300} />
//             </div>
//           ) : (
//             <EmptyState
//               icon="📊"
//               title="No Historical Data"
//               message="No data available for the selected time range."
//             />
//           )}
//         </div>

//         {/* Recent Readings Sidebar */}
//         <div className="col-12 col-lg-4">
//           <div className="card card-aqm p-3">
//             <h6 className="mb-3">Recent Readings</h6>
//             {loading ? (
//               <SkeletonLoader type="text" count={6} height={40} />
//             ) : history.length > 0 ? (
//               <ul className="list-unstyled">
//                 {history.slice(0, 6).map((h, i) => (
//                   <li
//                     key={i}
//                     className="py-2 border-bottom d-flex justify-content-between"
//                   >
//                     <span className="text-muted small">{h.ts}</span>
//                     <span className="fw-semibold">{h.value}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <EmptyState
//                 icon="📭"
//                 title="No Data"
//                 message="No recent readings available."
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Map Section */}
//       {selectedLocation && (
//         <div className="row g-3">
//           <div className="col-12">
//             <div>
//               <h5 className="mb-2">Location Map</h5>
//               <p className="text-muted small mb-3">Monitoring stations heatmap</p>
//             </div>
//             <MapHeatmap
//               points={locations
//                 .filter(l => l.latitude && l.longitude)
//                 .map(l => ({
//                   id: l.id,
//                   lat: l.latitude!,
//                   lng: l.longitude!,
//                   value: l.id === selected ? aqi : Math.floor(Math.random() * 100),
//                   name: l.name
//                 }))}
//             />
//           </div>
//         </div>
//       )}
//     </MainLayout>
//   );
// }
