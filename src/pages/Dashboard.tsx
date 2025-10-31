import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AQICard from "../components/AQICard";
import ChartWrapper from "../components/ChartWrapper";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../api/axios";
import { Form } from "react-bootstrap";

type Location = { id: number; name: string; latitude?: number; longitude?: number };
type DataPoint = { ts: string; value: number };

export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [aqi, setAqi] = useState<number>(0);
  const [pm25, setPm25] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/locations");
        setLocations(res.data || []);
        if ((res.data || []).length > 0) setSelected(res.data[0].id);
      } catch (e) {
        console.error("Failed to load locations", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    (async () => {
      try {
        const r1 = await api.get(`/data?locationId=${selected}&range=24h`);
        // expected: { current: { aqi: number, pm25: number }, history: [{ts, value}] }
        const payload = r1.data || {};
        setAqi(payload?.current?.aqi ?? 0);
        setPm25(payload?.current?.pm25 ?? undefined);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hist: DataPoint[] = (payload.history || []).map((p: any) => ({ ts: p.ts || p.time || "", value: p.value ?? p.aqi ?? 0 }));
        setHistory(hist);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  if (!locations.length) return <MainLayout><LoadingSpinner text="Loading locations..." /></MainLayout>;

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Dashboard</h3>
        <div style={{ minWidth: 220 }}>
          <Form.Select value={selected ?? undefined} onChange={(e) => setSelected(Number(e.target.value))}>
            {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </Form.Select>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-xl-4">
          <AQICard aqi={aqi} pm25={pm25} locationName={locations.find(l => l.id === selected)?.name} />
        </div>

        <div className="col-12 col-md-6 col-xl-2">
          <StatCard label="Stations" value={locations.length} help="Active sensors" />
        </div>

        <div className="col-12 col-md-6 col-xl-2">
          <StatCard label="Alerts (24h)" value={"0"} help="Triggered alerts" />
        </div>

        <div className="col-12 col-md-6 col-xl-2">
          <StatCard label="Forecast model" value={"v1.0"} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          {loading ? <LoadingSpinner /> : <ChartWrapper data={history} height={300} />}
        </div>
        <div className="col-12 col-lg-4">
          <div className="card card-aqm p-3">
            <h6>Recent readings</h6>
            <ul className="list-unstyled mt-2">
              {history.slice(0,6).map((h, i) => <li key={i} className="py-2 border-bottom">{h.ts} — {h.value}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}


// src/pages/Dashboard.tsx
// import React from "react";
// import MainLayout from "../layouts/MainLayout";

// const Dashboard: React.FC = () => {
//   return (
//     <MainLayout>
//       <h2>Dashboard</h2>
//       <p>Welcome — this is a placeholder dashboard. Hook real data later.</p>
//       <div className="card">
//         <div className="card-body">
//           <strong>Demo AQI:</strong> 42 (Good)
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default Dashboard;
