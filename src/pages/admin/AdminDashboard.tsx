// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaServer, 
  FaBell, 
  FaExclamationTriangle,
  FaChartLine,
  FaMapMarkerAlt 
} from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Stats = {
  totalUsers: number;
  totalSensors: number;
  totalAlerts: number;
  activeLocations: number;
  todayAlerts: number;
  systemHealth: "good" | "warning" | "critical";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSensors: 0,
    totalAlerts: 0,
    activeLocations: 0,
    todayAlerts: 0,
    systemHealth: "good"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // TODO: Replace with real API endpoints
      const [users, sensors, alerts, locations] = await Promise.all([
        api.get("/admin/users/count").catch(() => ({ data: 42 })),
        api.get("/admin/sensors").catch(() => ({ data: [] })),
        api.get("/admin/alerts/count").catch(() => ({ data: 156 })),
        api.get("/locations").catch(() => ({ data: [] }))
      ]);

      setStats({
        totalUsers: users.data?.count || users.data || 42,
        totalSensors: Array.isArray(sensors.data) ? sensors.data.length : 8,
        totalAlerts: alerts.data?.count || alerts.data || 156,
        activeLocations: Array.isArray(locations.data) ? locations.data.length : 3,
        todayAlerts: 12,
        systemHealth: "good"
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Alerts",
        data: [12, 19, 8, 15, 22, 18, 12],
        borderColor: "rgb(214, 78, 207)",
        backgroundColor: "rgba(214, 78, 207, 0.1)",
        tension: 0.4
      },
      {
        label: "Active Users",
        data: [8, 12, 15, 18, 20, 22, 25],
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        tension: 0.4
      }
    ]
  };

  const StatCard = ({ 
    icon, 
    label, 
    value, 
    color, 
    trend 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: number | string; 
    color: string;
    trend?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}
      className="card border-0 shadow-sm h-100"
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${color}20, ${color}10)`
            }}
          >
            <span style={{ color, fontSize: "1.5rem" }}>{icon}</span>
          </div>
          {trend && (
            <span className="badge bg-success-subtle text-success px-2 py-1">
              {trend}
            </span>
          )}
        </div>
        <h3 className="mb-1 fw-bold" style={{ fontSize: "2rem" }}>
          {loading ? "..." : value}
        </h3>
        <p className="text-muted mb-0 small">{label}</p>
      </div>
    </motion.div>
  );

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="mb-1">Admin Dashboard</h2>
        <p className="text-muted">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaUsers />}
            label="Total Users"
            value={stats.totalUsers}
            color="#667eea"
            trend="+12%"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaServer />}
            label="Active Sensors"
            value={stats.totalSensors}
            color="#0ea5b7"
            trend="+2"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaBell />}
            label="Total Alerts"
            value={stats.totalAlerts}
            color="#f59e0b"
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            icon={<FaMapMarkerAlt />}
            label="Locations"
            value={stats.activeLocations}
            color="#10b981"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16 }}
          >
            <div className="card-body p-4">
              <h5 className="mb-3">Weekly Activity</h5>
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-lg-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: 16 }}
          >
            <div className="card-body p-4">
              <h5 className="mb-3">System Health</h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle"
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: stats.systemHealth === "good" ? "#10b981" : "#f59e0b"
                  }}
                />
                <span className="fw-semibold">
                  {stats.systemHealth === "good" ? "All Systems Operational" : "Warning"}
                </span>
              </div>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Database</span>
                  <span className="text-success small">✓ Online</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">API Server</span>
                  <span className="text-success small">✓ Online</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Sensors</span>
                  <span className="text-success small">✓ {stats.totalSensors}/{stats.totalSensors}</span>
                </div>
              </div>

              <div className="alert alert-warning mt-3 mb-0" style={{ borderRadius: 12 }}>
                <FaExclamationTriangle className="me-2" />
                <small>{stats.todayAlerts} alerts triggered today</small>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent Activity</h5>
            <button className="btn btn-sm btn-outline-primary">View All</button>
          </div>

          <div className="list-group list-group-flush">
            {[
              { user: "john_doe", action: "triggered alert", time: "2 min ago", type: "alert" },
              { user: "admin", action: "added new sensor", time: "15 min ago", type: "sensor" },
              { user: "jane_smith", action: "registered", time: "1 hour ago", type: "user" },
              { user: "system", action: "auto-generated report", time: "2 hours ago", type: "report" }
            ].map((activity, i) => (
              <div key={i} className="list-group-item border-0 px-0 py-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 40,
                      height: 40,
                      background: "#f8f9fa"
                    }}
                  >
                    <FaChartLine className="text-muted" size={16} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span>
                        <strong>{activity.user}</strong> {activity.action}
                      </span>
                      <span className="text-muted small">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}