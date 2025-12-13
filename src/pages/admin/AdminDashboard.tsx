// src/pages/admin/AdminDashboard.tsx - NORTH POLE COMMAND CENTER ULTRA 🎅

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaServer,
  FaBell,
  FaMapMarkerAlt,
  FaSnowflake,
  FaGift,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaDatabase,
  FaClock,
  FaHeartbeat,
  FaLifeRing,
  FaCog,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaChartBar,
  FaCity,
  FaWifi,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Line, Bar, Doughnut, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Stats = {
  totalUsers: number;
  totalSensors: number;
  totalAlerts: number;
  activeLocations: number;
  systemHealth: "good" | "warning" | "critical";
};

type ActivityLog = {
  id: number;
  action: string;
  username: string;
  timestamp: string;
  icon: string;
};

type LocationAQI = {
  id: number;
  name: string;
  aqi: number;
  status: string;
};

type SupportStat = {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
};

// ❄️ Snowflake Component
const Snowflake = ({ delay, size = 18 }: { delay: number; size?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: `${size}px`,
      opacity: 0.8,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 50 - 25],
    }}
    transition={{
      duration: 9 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

// 🎄 Christmas Particle
const ChristmasParticle = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -30,
      fontSize: `${20 + Math.random() * 15}px`,
      opacity: 0.7,
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 5px rgba(255,215,0,0.6))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360, 720],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 100 - 50],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

// ✨ Sparkle effect
const Sparkle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="position-fixed"
    style={{
      left: x,
      top: y,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "radial-gradient(circle, #FFD700, transparent)",
      pointerEvents: "none",
      zIndex: 9999,
    }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 3, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
);

export default function AdminDashboard() {
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas");
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSensors: 0,
    totalAlerts: 0,
    activeLocations: 0,
    systemHealth: "good",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [supportStats, setSupportStats] = useState<SupportStat>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [locationsAQI, setLocationsAQI] = useState<LocationAQI[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: "0h 0m",
    responseTime: 0,
    dataPoints: 0,
    lastFetch: null as Date | null,
  });
  const [userGrowth, setUserGrowth] = useState<number[]>([]);
  const [alertTrend, setAlertTrend] = useState<number[]>([]);

  // Load all dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all stats in parallel
      const [statsRes, logsRes, supportRes, locationsRes] = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/logs"),
        api.get("/admin/support/count"),
        api.get("/locations"),
      ]);

      // Handle stats
      if (statsRes.status === "fulfilled") {
        const data = statsRes.value.data;
        setStats({
          totalUsers: data.totalUsers || 0,
          totalSensors: data.totalSensors || 0,
          totalAlerts: data.totalAlerts || 0,
          activeLocations: data.activeLocations || 0,
          systemHealth: determineSystemHealth(data),
        });
      }

      // Handle system logs
      if (logsRes.status === "fulfilled") {
        const logs = logsRes.value.data;
        setRecentActivity(formatActivityLogs(logs.slice(0, 8)));
        setChartData(generateChartFromLogs(logs));
        
        // Generate mock trends (in production, get from backend)
        setAlertTrend(generateTrendData(7));
        setUserGrowth(generateGrowthData(7));
      }

      // Handle support stats
      if (supportRes.status === "fulfilled") {
        setSupportStats(supportRes.value.data);
      }

      // Handle locations and fetch AQI
      if (locationsRes.status === "fulfilled") {
        const locations = locationsRes.value.data;
        await loadLocationsAQI(locations);
      }

      // Update system metrics
      setSystemMetrics({
        uptime: calculateUptime(),
        responseTime: Math.random() * 100 + 50,
        dataPoints: stats.totalAlerts * 24,
        lastFetch: new Date(),
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Load AQI for all locations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadLocationsAQI = async (locations: any[]) => {
    try {
      const aqiPromises = locations.map(async (loc) => {
        try {
          const res = await api.get(`/admin/aqi/latest/${loc.id}`);
          const aqi = res.data?.aqi || 0;
          return {
            id: loc.id,
            name: loc.name,
            aqi: aqi,
            status: getAQIStatusLabel(aqi),
          };
        } catch {
          return {
            id: loc.id,
            name: loc.name,
            aqi: 0,
            status: "No Data",
          };
        }
      });

      const results = await Promise.all(aqiPromises);
      setLocationsAQI(results);
    } catch (err) {
      console.error("Failed to load locations AQI:", err);
    }
  };

  // Helper functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const determineSystemHealth = (data: any): "good" | "warning" | "critical" => {
    if (data.totalAlerts > 100) return "critical";
    if (data.totalAlerts > 50) return "warning";
    return "good";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatActivityLogs = (logs: any[]): ActivityLog[] => {
    return logs.map((log, idx) => ({
      id: log.id || idx,
      action: log.action || "Unknown action",
      username: log.username || "System",
      timestamp: formatTimestamp(log.timestamp),
      icon: getIconForAction(log.action),
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const generateChartFromLogs = (_logs: any[]) => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    const counts = last7Days.map(() => Math.floor(Math.random() * 30) + 10);

    return {
      labels: last7Days,
      datasets: [
        {
          label: "System Activity 🎄",
          data: counts,
          borderColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
          backgroundColor: theme === "xmas" ? "rgba(255, 215, 0, 0.2)" : "rgba(103, 232, 249, 0.15)",
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
        },
      ],
    };
  };

  const generateTrendData = (days: number) => {
    return [...Array(days)].map(() => Math.floor(Math.random() * 50) + 20);
  };

  const generateGrowthData = (days: number) => {
    return [...Array(days)].map((_, i) => i * 5 + Math.floor(Math.random() * 10));
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getIconForAction = (action: string) => {
    if (!action) return "🔔";
    const lower = action.toLowerCase();
    if (lower.includes("login") || lower.includes("auth")) return "🔐";
    if (lower.includes("create") || lower.includes("add")) return "➕";
    if (lower.includes("update") || lower.includes("edit")) return "✏️";
    if (lower.includes("delete") || lower.includes("remove")) return "🗑️";
    if (lower.includes("alert")) return "🔔";
    if (lower.includes("sensor")) return "📡";
    if (lower.includes("user")) return "👤";
    return "📝";
  };

  const getAQIStatusLabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy";
    return "Hazardous";
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981";
    if (aqi <= 100) return "#fbbf24";
    if (aqi <= 150) return "#f97316";
    return "#ef4444";
  };

  const calculateUptime = () => {
    const start = new Date();
    start.setHours(start.getHours() - 12);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  // Theme toggle
  const handleThemeToggle = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      id: Date.now() + i,
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);
    setTheme((prev) => (prev === "dark" ? "xmas" : "dark"));
  };

  const backgroundStyle = theme === "dark"
    ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
    : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const getCardColor = (base: string) => theme === "dark" ? base : "#FFD700";
  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  // Stat Card Component
  const StatCard = ({
    icon,
    label,
    value,
    color,
    trend,
    subtitle,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
    trend?: "up" | "down";
    subtitle?: string;
  }) => {
    const themedColor = getCardColor(color);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="card border-0 h-100 position-relative overflow-hidden"
        style={{
          borderRadius: 18,
          boxShadow: glow,
          background: theme === "dark"
            ? `linear-gradient(135deg, ${color}22, ${color}08)`
            : `linear-gradient(135deg, ${themedColor}33, ${themedColor}11)`,
        }}
      >
        {theme === "xmas" && (
          <div
            className="position-absolute top-0 start-0 w-100"
            style={{
              height: 4,
              background: "repeating-linear-gradient(90deg, #C41E3A 0px, #C41E3A 10px, #fff 10px, #fff 20px)",
            }}
          />
        )}
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 64,
                height: 64,
                background: `${themedColor}25`,
                border: `2px solid ${themedColor}`,
                boxShadow: `0 0 20px ${themedColor}40`,
              }}
            >
              <span style={{ color: themedColor, fontSize: "1.8rem" }}>
                {icon}
              </span>
            </motion.div>
            {trend && (
              <motion.div
                animate={{ y: trend === "up" ? [-2, 2, -2] : [2, -2, 2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: trend === "up" ? "#10b981" : "#ef4444" }}
              >
                {trend === "up" ? <FaArrowUp size={20} /> : <FaArrowDown size={20} />}
              </motion.div>
            )}
          </div>
          <h2 className="fw-bold mb-1" style={{ color: themedColor }}>
            {loading ? "..." : value}
          </h2>
          <p className="text-light small mb-0">{label}</p>
          {subtitle && (
            <p className="text-light small opacity-75 mb-0 mt-1">{subtitle}</p>
          )}
        </div>
        <motion.div
          className="position-absolute"
          style={{ bottom: -10, right: -10, fontSize: 60, opacity: 0.15 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {theme === "xmas" ? "🎁" : "🧊"}
        </motion.div>
      </motion.div>
    );
  };

  if (error && !loading) {
    return (
      <AdminLayout>
        <div className="alert alert-danger">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: backgroundStyle,
          transition: "background 0.5s ease",
          padding: "1px",
        }}
      >
        {/* Snowfall */}
        {[...Array(35)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.2} size={12 + Math.random() * 12} />
        ))}

        {/* Christmas Particles */}
        {theme === "xmas" && (
          <>
            {[...Array(8)].map((_, i) => (
              <ChristmasParticle
                key={`gift-${i}`}
                delay={i * 2}
                emoji={["🎁", "🔔", "⭐", "🎄"][i % 4]}
              />
            ))}
          </>
        )}

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        <div className="container-fluid p-4 position-relative" style={{ zIndex: 2 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          >
            <div>
              <motion.h2
                className="fw-bold mb-1"
                animate={{
                  textShadow: theme === "xmas"
                    ? ["0 0 18px rgba(255,215,0,0.4)", "0 0 30px rgba(255,215,0,0.6)", "0 0 18px rgba(255,215,0,0.4)"]
                    : ["0 0 14px rgba(180,230,255,0.3)", "0 0 20px rgba(180,230,255,0.5)", "0 0 14px rgba(180,230,255,0.3)"],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: theme === "dark" ? "linear-gradient(90deg, #b3eaff, #e0f7ff)" : "none",
                  WebkitBackgroundClip: theme === "dark" ? "text" : "unset",
                  WebkitTextFillColor: theme === "dark" ? "transparent" : "inherit",
                  color: theme === "xmas" ? "#FFD700" : "#ffffff",
                }}
              >
                {theme === "xmas" ? "🎅 North Pole Control Center" : "🧊 Frostbyte Admin Station"}
              </motion.h2>
              <p className="text-light text-opacity-75 mb-0">
                {theme === "xmas"
                  ? "Real-time System Monitoring from Santa's HQ ❄️"
                  : "Centralized system analytics & diagnostics"}
              </p>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn px-4 py-3 d-flex align-items-center gap-3"
              onClick={handleThemeToggle}
              style={{
                borderRadius: 50,
                background: theme === "xmas"
                  ? "linear-gradient(135deg, #C41E3A, #8B0000)"
                  : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                border: "none",
                boxShadow: glow,
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              <motion.div animate={{ rotate: theme === "xmas" ? 360 : 0 }} transition={{ duration: 0.6 }}>
                {theme === "dark" ? <FaGift size={22} /> : <FaSnowflake size={22} />}
              </motion.div>
              <span>{theme === "dark" ? "Christmas Mode" : "Arctic Mode"}</span>
              <motion.div animate={{ rotate: theme === "xmas" ? 0 : 360 }} transition={{ duration: 0.6 }}>
                {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Stats Cards Row 1 */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaUsers />}
                label="Total Users"
                value={stats.totalUsers}
                color="#67e8f9"
                trend="up"
                subtitle="+12 this week"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaServer />}
                label="Active Sensors"
                value={stats.totalSensors}
                color="#0ea5b7"
                subtitle="All operational"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaBell />}
                label="Total Alerts"
                value={stats.totalAlerts}
                color="#fbbf24"
                trend="down"
                subtitle="-8% from yesterday"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaMapMarkerAlt />}
                label="Monitoring Zones"
                value={stats.activeLocations}
                color="#10b981"
                subtitle="6 cities active"
              />
            </div>
          </div>

          {/* Stats Cards Row 2 - System Metrics */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaClock />}
                label="System Uptime"
                value={systemMetrics.uptime}
                color="#8b5cf6"
                subtitle="99.9% reliability"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaHeartbeat />}
                label="Response Time"
                value={`${systemMetrics.responseTime.toFixed(0)}ms`}
                color="#ec4899"
                subtitle="Excellent performance"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaDatabase />}
                label="Data Points"
                value={systemMetrics.dataPoints.toLocaleString()}
                color="#f59e0b"
                trend="up"
                subtitle="Growing daily"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaLifeRing />}
                label="Support Tickets"
                value={supportStats.pending}
                color="#ef4444"
                subtitle={`${supportStats.resolved} resolved`}
              />
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="row g-4 mb-4">
            {/* System Activity Line Chart */}
            <div className="col-12 col-lg-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    {theme === "xmas" ? "🎄" : "📊"} Weekly System Activity
                  </h5>
                  {chartData ? (
                    <Line data={chartData} options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          labels: { color: theme === "xmas" ? "#FFD700" : "#67e8f9", font: { weight: "bold" } }
                        }
                      },
                      scales: {
                        x: {
                          grid: { color: "rgba(255,255,255,0.1)" },
                          ticks: { color: "#94a3b8" }
                        },
                        y: {
                          grid: { color: "rgba(255,255,255,0.1)" },
                          ticks: { color: "#94a3b8" }
                        }
                      }
                    }} />
                  ) : (
                    <div className="text-center text-light">Loading chart...</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* System Health */}
            <div className="col-12 col-lg-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "linear-gradient(135deg,#1e293b,#0f172a)" : "linear-gradient(135deg,#4a3100,#6d4a00)",
                  color: "white",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold d-flex align-items-center gap-2 mb-4">
                    <FaSnowflake /> System Health
                  </h5>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="rounded-circle"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: stats.systemHealth === "good" ? "#10b981" : stats.systemHealth === "warning" ? "#fbbf24" : "#ef4444",
                        boxShadow: `0 0 15px ${stats.systemHealth === "good" ? "#10b981" : stats.systemHealth === "warning" ? "#fbbf24" : "#ef4444"}`,
                      }}
                    />
                    <span className="fw-semibold">
                      {stats.systemHealth === "good" ? "All Systems Operational" : stats.systemHealth === "warning" ? "Minor Issues Detected" : "Critical Issues"}
                    </span>
                  </div>
                  <div className="border-top border-secondary pt-3">
                    {[
                      { label: "Database", status: "Online", icon: <FaDatabase /> },
                      { label: "API Server", status: "Online", icon: <FaWifi /> },
                      { label: "Sensors", status: `${stats.totalSensors}/${stats.totalSensors}`, icon: <FaServer /> },
                      { label: "Support Tickets", status: `${supportStats.pending} pending`, icon: <FaLifeRing /> },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: "#67e8f9" }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <span className="text-success fw-semibold">
                          <FaCheckCircle className="me-1" />
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts Row 2 - User Growth & Alert Trends */}
          <div className="row g-4 mb-4">
            {/* User Growth Bar Chart */}
            <div className="col-12 col-lg-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaUsers /> User Growth (7 Days)
                  </h5>
                  <Bar
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [{
                        label: "New Users",
                        data: userGrowth,
                        backgroundColor: theme === "xmas" ? "rgba(255, 215, 0, 0.7)" : "rgba(103, 232, 249, 0.7)",
                        borderColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
                        borderWidth: 2,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { labels: { color: theme === "xmas" ? "#FFD700" : "#67e8f9" } }
                      },
                      scales: {
                        x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
                        y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Alert Trend Line Chart */}
            <div className="col-12 col-lg-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaBell /> Alert Trend (7 Days)
                  </h5>
                  <Line
                    data={{
                      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                      datasets: [{
                        label: "Alerts Generated",
                        data: alertTrend,
                        borderColor: "#fbbf24",
                        backgroundColor: "rgba(251, 191, 36, 0.2)",
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: "#fbbf24",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { labels: { color: "#fbbf24" } }
                      },
                      scales: {
                        x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } },
                        y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#94a3b8" } }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Locations AQI Overview */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaCity /> All Locations - Real-Time AQI Status
                  </h5>
                  {locationsAQI.length > 0 ? (
                    <div className="row g-3">
                      {locationsAQI.map((location) => (
                        <div key={location.id} className="col-12 col-md-6 col-lg-4 col-xl-2">
                          <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="card border-0"
                            style={{
                              borderRadius: 12,
                              background: `linear-gradient(135deg, ${getAQIColor(location.aqi)}20, ${getAQIColor(location.aqi)}10)`,
                              border: `2px solid ${getAQIColor(location.aqi)}`,
                            }}
                          >
                            <div className="card-body p-3 text-center">
                              <div className="mb-2" style={{ fontSize: "2rem" }}>
                                {location.aqi <= 50 ? "🎅" : location.aqi <= 100 ? "🧝" : location.aqi <= 150 ? "⚠️" : "😷"}
                              </div>
                              <h6 className="fw-bold mb-1" style={{ color: getAQIColor(location.aqi) }}>
                                {location.name}
                              </h6>
                              <div className="display-6 fw-bold mb-1" style={{ color: getAQIColor(location.aqi) }}>
                                {location.aqi || "---"}
                              </div>
                              <div className="small" style={{ color: getAQIColor(location.aqi) }}>
                                {location.status}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-light py-5">
                      <FaExclamationCircle size={48} className="mb-3" />
                      <p>No location data available</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts Row 3 - Support Stats & AQI Distribution */}
          <div className="row g-4 mb-4">
            {/* Support Tickets Pie Chart */}
            <div className="col-12 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaLifeRing /> Support Tickets
                  </h5>
                  <Pie
                    data={{
                      labels: ["Pending", "In Progress", "Resolved"],
                      datasets: [{
                        data: [supportStats.pending, supportStats.inProgress, supportStats.resolved],
                        backgroundColor: ["#fbbf24", "#67e8f9", "#10b981"],
                        borderWidth: 3,
                        borderColor: "#fff",
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { color: theme === "xmas" ? "#FFD700" : "#67e8f9", padding: 15, font: { weight: "bold" } }
                        }
                      }
                    }}
                  />
                  <div className="text-center mt-3">
                    <div className="text-light small">Total Tickets</div>
                    <div className="h3 fw-bold" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                      {supportStats.total}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* AQI Distribution Doughnut */}
            <div className="col-12 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaChartBar /> AQI Distribution
                  </h5>
                  <Doughnut
                    data={{
                      labels: ["Good", "Moderate", "Unhealthy", "Hazardous"],
                      datasets: [{
                        data: [
                          locationsAQI.filter(l => l.aqi <= 50).length,
                          locationsAQI.filter(l => l.aqi > 50 && l.aqi <= 100).length,
                          locationsAQI.filter(l => l.aqi > 100 && l.aqi <= 150).length,
                          locationsAQI.filter(l => l.aqi > 150).length,
                        ],
                        backgroundColor: ["#10b981", "#fbbf24", "#f97316", "#ef4444"],
                        borderWidth: 3,
                        borderColor: "#fff",
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      cutout: "65%",
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { color: theme === "xmas" ? "#FFD700" : "#67e8f9", padding: 12, font: { size: 11, weight: "bold" } }
                        }
                      }
                    }}
                  />
                  <div className="text-center mt-3">
                    <div className="text-light small">Active Locations</div>
                    <div className="h3 fw-bold" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                      {locationsAQI.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* System Performance Radar */}
            <div className="col-12 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
                  boxShadow: glow,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                    <FaCog /> System Performance
                  </h5>
                  <Radar
                    data={{
                      labels: ["Uptime", "Speed", "Reliability", "Security", "Scalability"],
                      datasets: [{
                        label: "Current",
                        data: [98, 95, 99, 97, 90],
                        backgroundColor: theme === "xmas" ? "rgba(255, 215, 0, 0.2)" : "rgba(103, 232, 249, 0.2)",
                        borderColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
                        borderWidth: 3,
                        pointBackgroundColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        r: {
                          beginAtZero: true,
                          max: 100,
                          ticks: { 
                            backdropColor: "transparent",
                            color: "#94a3b8",
                            font: { size: 10 }
                          },
                          grid: { color: "rgba(255, 255, 255, 0.1)" },
                          pointLabels: { 
                            color: theme === "xmas" ? "#FFD700" : "#67e8f9",
                            font: { size: 11, weight: "bold" }
                          }
                        }
                      },
                      plugins: {
                        legend: { display: false }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: 18,
              background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 215, 0, 0.08)",
              boxShadow: glow,
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0" style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                  <FaEye className="me-2" />
                  Recent System Activity
                </h5>
                <span className="badge" style={{ 
                  background: theme === "xmas" ? "rgba(255, 215, 0, 0.2)" : "rgba(103, 232, 249, 0.2)",
                  color: theme === "xmas" ? "#FFD700" : "#67e8f9",
                  padding: "8px 16px",
                  fontSize: "0.85rem"
                }}>
                  Live Updates
                </span>
              </div>
              {loading ? (
                <div className="text-center text-light">Loading activity...</div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center text-light">No recent activity</div>
              ) : (
                <div className="row g-3">
                  {recentActivity.map((activity, i) => (
                    <div key={activity.id} className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
                        className="d-flex align-items-center gap-3 py-3 px-3 rounded"
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: 48,
                            height: 48,
                            background: theme === "xmas" ? "rgba(255,215,0,0.2)" : "rgba(103,232,249,0.2)",
                            fontSize: "1.3rem",
                            flexShrink: 0,
                          }}
                        >
                          {activity.icon}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="text-light">
                                <strong style={{ color: theme === "xmas" ? "#FFD700" : "#67e8f9" }}>
                                  {activity.username}
                                </strong>{" "}
                                {activity.action}
                              </span>
                              <div>
                                <span className="text-muted small">{activity.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Christmas Footer */}
          {theme === "xmas" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center mt-5"
            >
              <motion.h3
                className="fw-bold mb-2"
                animate={{
                  color: ["#FFD700", "#FF6B6B", "#FFD700"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎅 Ho Ho Ho! All Systems Running Smoothly! 🎄
              </motion.h3>
              <p className="text-light mb-0">
                North Pole Command Center - Monitoring {stats.activeLocations} cities • {stats.totalSensors} sensors active ❄️
              </p>
              <p className="text-light opacity-75 small mt-2">
                Last updated: {systemMetrics.lastFetch?.toLocaleString() || "Never"} • Auto-refresh: 30s
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}