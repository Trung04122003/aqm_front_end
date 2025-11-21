// src/pages/Dashboard.tsx (ENHANCED VERSION)
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AQICard from "../components/AQICard";
import ChartWrapper from "../components/ChartWrapper";
import StatCard from "../components/StatCard";
import WeatherCard from "../components/WeatherCard";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import api from "../api/axios";
import { Form } from "react-bootstrap";
import useAuth from "../auth/useAuth";
import MapHeatmap from "../components/MapHeatmap";

type Location = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

type DataPoint = { ts: string; value: number };

type WeatherData = {
  temperatureC?: number;
  humidityPct?: number;
  windSpeedMps?: number;
  windDirDeg?: number;
  pressureHpa?: number;
  precipProbabilityPct?: number;
};

export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [aqi, setAqi] = useState<number>(0);
  const [pm25, setPm25] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const { user } = useAuth();

  // Load locations
  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("dashboard: no token yet, skip loading locations");
          return;
        }
        const res = await api.get("/locations");
        const locs = res.data || [];
        setLocations(locs);
        if (locs.length > 0) setSelected(locs[0].id);
      } catch (e) {
        console.error("Failed to load locations", e);
      }
    })();
  }, [user]);

  // Load air quality data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !selected) return;

    setLoading(true);
    (async () => {
      try {
        const r1 = await api.get(`/data?locationId=${selected}&range=24h`);
        const payload = r1.data || {};
        setAqi(payload?.current?.aqi ?? 0);
        setPm25(payload?.current?.pm25 ?? undefined);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hist: DataPoint[] = (payload.history || []).map((p: any) => ({
          ts: p.ts || p.time || "",
          value: p.value ?? p.aqi ?? 0,
        }));
        setHistory(hist);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  // Load weather data
  useEffect(() => {
    if (!selected) return;

    setWeatherLoading(true);
    (async () => {
      try {
        const res = await api.get(`/weather?location=${selected}`);
        const data = res.data;
        if (data && data.length > 0) {
          setWeather(data[0]); // Get latest weather
        }
      } catch (e) {
        console.error("Failed to load weather", e);
      } finally {
        setWeatherLoading(false);
      }
    })();
  }, [selected]);

  if (!locations.length && !loading) {
    return (
      <MainLayout>
        <EmptyState
          icon="📍"
          title="No Locations Available"
          message="No monitoring locations found in the system. Please contact administrator."
        />
      </MainLayout>
    );
  }

  if ((locations.length === 0 && loading)) {
    return (
      <MainLayout>
        <SkeletonLoader type="card" count={1} height={100} />
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <SkeletonLoader type="card" height={200} />
          </div>
          <div className="col-md-6">
            <SkeletonLoader type="card" height={200} />
          </div>
        </div>
      </MainLayout>
    );
  }

  const selectedLocation = locations.find(l => l.id === selected);

  return (
    <MainLayout>
      {/* Header with Location Selector */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Dashboard</h3>
          <p className="text-muted small mb-0">
            Real-time air quality monitoring
          </p>
        </div>
        <div style={{ minWidth: 220 }}>
          <Form.Select
            value={selected ?? undefined}
            onChange={(e) => setSelected(Number(e.target.value))}
            style={{ borderRadius: 12 }}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                📍 {loc.name}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-3 mb-3">
        {/* AQI Card */}
        <div className="col-12 col-md-6 col-xl-4">
          {loading ? (
            <SkeletonLoader type="card" height={200} />
          ) : (
            <AQICard
              aqi={aqi}
              pm25={pm25}
              locationName={selectedLocation?.name}
            />
          )}
        </div>

        {/* Weather Card */}
        <div className="col-12 col-md-6 col-xl-4">
          {weatherLoading ? (
            <SkeletonLoader type="card" height={200} />
          ) : weather ? (
            <WeatherCard
              temperature={weather.temperatureC}
              humidity={weather.humidityPct}
              windSpeed={weather.windSpeedMps}
              windDirection={weather.windDirDeg}
              pressure={weather.pressureHpa}
              precipProbability={weather.precipProbabilityPct}
              locationName={selectedLocation?.name}
            />
          ) : (
            <EmptyState
              icon="🌤️"
              title="No Weather Data"
              message="Weather information unavailable."
            />
          )}
        </div>

        {/* Stats Cards */}
        <div className="col-12 col-md-6 col-xl-2">
          <StatCard
            label="Stations"
            value={locations.length}
            help="Active sensors"
          />
        </div>

        <div className="col-12 col-md-6 col-xl-2">
          <StatCard 
            label="Forecast model" 
            value={"LSTM v1.0"}
            help="AI prediction"
          />
        </div>
      </div>

      {/* Chart Section */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-8">
          {loading ? (
            <SkeletonLoader type="chart" height={300} />
          ) : history.length > 0 ? (
            <div>
              <div className="mb-2">
                <h5>24-Hour AQI Trend</h5>
                <p className="text-muted small mb-0">Historical air quality index</p>
              </div>
              <ChartWrapper data={history} height={300} />
            </div>
          ) : (
            <EmptyState
              icon="📊"
              title="No Historical Data"
              message="No data available for the selected time range."
            />
          )}
        </div>

        {/* Recent Readings Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card card-aqm p-3">
            <h6 className="mb-3">Recent Readings</h6>
            {loading ? (
              <SkeletonLoader type="text" count={6} height={40} />
            ) : history.length > 0 ? (
              <ul className="list-unstyled">
                {history.slice(0, 6).map((h, i) => (
                  <li 
                    key={i} 
                    className="py-2 border-bottom d-flex justify-content-between"
                  >
                    <span className="text-muted small">{h.ts}</span>
                    <span className="fw-semibold">{h.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon="📭"
                title="No Data"
                message="No recent readings available."
              />
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      {selectedLocation && (
        <div className="row g-3">
          <div className="col-12">
            <div>
              <h5 className="mb-2">Location Map</h5>
              <p className="text-muted small mb-3">Monitoring stations heatmap</p>
            </div>
            <MapHeatmap
              points={locations
                .filter(l => l.latitude && l.longitude)
                .map(l => ({
                  id: l.id,
                  lat: l.latitude!,
                  lng: l.longitude!,
                  value: l.id === selected ? aqi : Math.floor(Math.random() * 100),
                  name: l.name
                }))}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}

// import { useEffect, useState } from "react";
// import MainLayout from "../layouts/MainLayout";
// import AQICard from "../components/AQICard";
// import ChartWrapper from "../components/ChartWrapper";
// import StatCard from "../components/StatCard";
// import LoadingSpinner from "../components/LoadingSpinner";
// import api from "../api/axios";
// import { Form } from "react-bootstrap";
// import useAuth from "../auth/useAuth";
// import MapHeatmap from "../components/MapHeatmap";

// // animation
// import { motion } from "framer-motion";
// import "./dashboard-pastel.css";

// type Location = {
//   id: number;
//   name: string;
//   latitude?: number;
//   longitude?: number;
// };

// type DataPoint = { ts: string; value: number };

// export default function Dashboard() {
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [aqi, setAqi] = useState<number>(0);
//   const [pm25, setPm25] = useState<number | undefined>(undefined);
//   const [history, setHistory] = useState<DataPoint[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { user, loading: authLoading } = useAuth();

//   useEffect(() => {
//     if (authLoading || !user) return;
//   }, [user, authLoading]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await api.get("/locations");
//         setLocations(res.data || []);
//         if ((res.data || []).length > 0) setSelected(res.data[0].id);
//       } catch (e) {
//         console.error("Failed to load locations", e);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!selected) return;

//     (async () => {
//       setLoading(true);
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

//   if (!locations.length)
//     return (
//       <MainLayout>
//         <LoadingSpinner text="Loading locations..." />
//       </MainLayout>
//     );

//   return (
//     <MainLayout>
//       {/* Background gradient + floating pastel blobs */}
//       <div className="pastel-bg"></div>

//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="pastel-title">Dashboard</h2>

//           <Form.Select
//             className="pastel-select"
//             value={selected ?? undefined}
//             onChange={(e) => setSelected(Number(e.target.value))}
//           >
//             {locations.map((loc) => (
//               <option key={loc.id} value={loc.id}>
//                 {loc.name}
//               </option>
//             ))}
//           </Form.Select>
//         </div>

//         {/* Stats section */}
//         <div className="row g-4 mb-4">
//           <div className="col-12 col-md-6 col-xl-4">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.15 }}
//               className="glass-card"
//             >
//               <AQICard
//                 aqi={aqi}
//                 pm25={pm25}
//                 locationName={locations.find((l) => l.id === selected)?.name}
//               />
//             </motion.div>
//           </div>

//           <div className="col-6 col-md-3 col-xl-2">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.20 }}
//               className="glass-card"
//             >
//               <StatCard label="Stations" value={locations.length} help="Active sensors" />
//             </motion.div>
//           </div>

//           <div className="col-6 col-md-3 col-xl-2">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.25 }}
//               className="glass-card"
//             >
//               <StatCard label="Alerts (24h)" value={"0"} help="Triggered alerts" />
//             </motion.div>
//           </div>

//           <div className="col-12 col-md-3 col-xl-2">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.30 }}
//               className="glass-card"
//             >
//               <StatCard label="Forecast model" value={"v1.0"} />
//             </motion.div>
//           </div>
//         </div>

//         {/* Chart + History */}
//         <div className="row g-4">
//           <div className="col-12 col-lg-8">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.35 }}
//               className="glass-card p-3"
//             >
//               {loading ? <LoadingSpinner /> : <ChartWrapper data={history} height={300} />}
//             </motion.div>
//           </div>

//           <div className="col-12 col-lg-4">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.45 }}
//               className="glass-card p-3"
//             >
//               <h6 className="pastel-subtitle">Recent readings</h6>
//               <ul className="list-unstyled mt-2">
//                 {history.slice(0, 6).map((h, i) => (
//                   <li key={i} className="py-2 border-bottom pastel-history-item">
//                     {h.ts} — {h.value}
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* heatmap actor */}
//       <MapHeatmap
//         points={[
//           { id: 1, lat: 21.028, lng: 105.834, value: 120 },
//           { id: 2, lat: 21.03, lng: 105.84, value: 40 },
//         ]}
//       />
//     </MainLayout>
//   );
// }


// // import { useEffect, useState } from "react";
// // import MainLayout from "../layouts/MainLayout";
// // import AQICard from "../components/AQICard";
// // import ChartWrapper from "../components/ChartWrapper";
// // import StatCard from "../components/StatCard";
// // import LoadingSpinner from "../components/LoadingSpinner";
// // import api from "../api/axios";
// // import { Form } from "react-bootstrap";
// // import useAuth from "../auth/useAuth";
// // import MapHeatmap from "../components/MapHeatmap";

// // type Location = {
// //   id: number;
// //   name: string;
// //   latitude?: number;
// //   longitude?: number;
// // };
// // type DataPoint = { ts: string; value: number };

// // export default function Dashboard() {
// //   const [locations, setLocations] = useState<Location[]>([]);
// //   const [selected, setSelected] = useState<number | null>(null);
// //   const [aqi, setAqi] = useState<number>(0);
// //   const [pm25, setPm25] = useState<number | undefined>(undefined);
// //   const [history, setHistory] = useState<DataPoint[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const { user, loading: authLoading } = useAuth();

// //   useEffect(() => {
// //     if (authLoading) return; // wait auth init
// //     if (!user) return; // don't load when not logged in

// //     // now safe to call API
// //     (async () => {
// //       // fetch locations...
// //     })();
// //   }, [user, authLoading]);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) {
// //           console.warn("dashboard: no token yet, skip loading locations");
// //           return;
// //         }
// //         const res = await api.get("/locations");
// //         setLocations(res.data || []);
// //         if ((res.data || []).length > 0) setSelected(res.data[0].id);
// //       } catch (e) {
// //         console.error("Failed to load locations", e);
// //       }
// //     })();
// //   }, []);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) return; // skip until auth restored
// //     // call API...
// //     if (!selected) return;
// //     setLoading(true);
// //     (async () => {
// //       try {
// //         const r1 = await api.get(`/data?locationId=${selected}&range=24h`);
// //         // expected: { current: { aqi: number, pm25: number }, history: [{ts, value}] }
// //         const payload = r1.data || {};
// //         setAqi(payload?.current?.aqi ?? 0);
// //         setPm25(payload?.current?.pm25 ?? undefined);
// //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //         const hist: DataPoint[] = (payload.history || []).map((p: any) => ({
// //           ts: p.ts || p.time || "",
// //           value: p.value ?? p.aqi ?? 0,
// //         }));
// //         setHistory(hist);
// //       } catch (e) {
// //         console.error(e);
// //       } finally {
// //         setLoading(false);
// //       }
// //     })();
// //   }, [selected]);

// //   if (!locations.length)
// //     return (
// //       <MainLayout>
// //         <LoadingSpinner text="Loading locations..." />
// //       </MainLayout>
// //     );

// //   return (
// //     <MainLayout>
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <h3 className="mb-0">Dashboard</h3>
// //         <div style={{ minWidth: 220 }}>
// //           <Form.Select
// //             value={selected ?? undefined}
// //             onChange={(e) => setSelected(Number(e.target.value))}
// //           >
// //             {locations.map((loc) => (
// //               <option key={loc.id} value={loc.id}>
// //                 {loc.name}
// //               </option>
// //             ))}
// //           </Form.Select>
// //         </div>
// //       </div>

// //       <div className="row g-3 mb-3">
// //         <div className="col-12 col-md-6 col-xl-4">
// //           <AQICard
// //             aqi={aqi}
// //             pm25={pm25}
// //             locationName={locations.find((l) => l.id === selected)?.name}
// //           />
// //         </div>

// //         <div className="col-12 col-md-6 col-xl-2">
// //           <StatCard
// //             label="Stations"
// //             value={locations.length}
// //             help="Active sensors"
// //           />
// //         </div>

// //         <div className="col-12 col-md-6 col-xl-2">
// //           <StatCard label="Alerts (24h)" value={"0"} help="Triggered alerts" />
// //         </div>

// //         <div className="col-12 col-md-6 col-xl-2">
// //           <StatCard label="Forecast model" value={"v1.0"} />
// //         </div>
// //       </div>

// //       <div className="row g-3">
// //         <div className="col-12 col-lg-8">
// //           {loading ? (
// //             <LoadingSpinner />
// //           ) : (
// //             <ChartWrapper data={history} height={300} />
// //           )}
// //         </div>
// //         <div className="col-12 col-lg-4">
// //           <div className="card card-aqm p-3">
// //             <h6>Recent readings</h6>
// //             <ul className="list-unstyled mt-2">
// //               {history.slice(0, 6).map((h, i) => (
// //                 <li key={i} className="py-2 border-bottom">
// //                   {h.ts} — {h.value}
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       </div>
// //     </MainLayout>
// //   );

// //   <MapHeatmap
// //     points={[
// //       { id: 1, lat: 21.028, lng: 105.834, value: 120 },
// //       { id: 2, lat: 21.03, lng: 105.84, value: 40 },
// //     ]}
// //   />;
// // }

