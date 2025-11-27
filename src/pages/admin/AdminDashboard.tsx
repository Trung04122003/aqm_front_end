// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaServer,
  FaBell,
  FaExclamationTriangle,
  FaChartLine,
  FaMapMarkerAlt,
  FaSnowflake,
  FaGift,
  FaMoon,
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
  Legend,
} from "chart.js";
import React from "react";

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

// ❄️ Snowflake effect (subtle)
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: "18px",
      opacity: 0.7,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
    }}
    animate={{
      y: ["0vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 9 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

export default function AdminDashboard() {
  const [theme, setTheme] = useState<"dark" | "xmas">("dark");

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSensors: 0,
    totalAlerts: 0,
    activeLocations: 0,
    todayAlerts: 0,
    systemHealth: "good",
  });
  // ⭐ Santa Voice state
  const [santaVoice] = useState(localStorage.getItem("santaVoice") !== "off");

  // 2️⃣ ⭐⭐ DÁN ĐÚNG ĐOẠN NÀY Ở ĐÂY
  React.useEffect(() => {
    if (santaVoice) {
      const audio = new Audio("/audio/santa.mp3");
      audio.volume = 0.7;
      audio.play().catch(() => {});
    }
  }, [santaVoice]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, sensors, alerts, locations] = await Promise.all([
        api.get("/admin/users/count").catch(() => ({ data: 42 })),
        api.get("/admin/sensors").catch(() => ({ data: [] })),
        api.get("/admin/alerts/count").catch(() => ({ data: 156 })),
        api.get("/locations").catch(() => ({ data: [] })),
      ]);

      setStats({
        totalUsers: users.data?.count || users.data,
        totalSensors: sensors.data?.length || 0,
        totalAlerts: alerts.data?.count || alerts.data,
        activeLocations: locations.data?.length || 0,
        todayAlerts: 12,
        systemHealth: "good",
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Theme-based background
  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #2c1f00 0%, #4b3400 100%)";

  // Stats card UI per theme
  const getCardColor = (base: string) =>
    theme === "dark" ? `${base}` : "#FFD700";

  // Xmas subtle glow
  const glow = theme === "xmas" ? "0 0 20px rgba(255,215,0,0.4)" : "none";

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Alerts",
        data: [12, 19, 8, 15, 22, 18, 12],
        borderColor: theme === "xmas" ? "#FFD700" : "#67e8f9",
        backgroundColor:
          theme === "xmas"
            ? "rgba(255, 215, 0, 0.15)"
            : "rgba(103, 232, 249, 0.15)",
        tension: 0.4,
      },
    ],
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
  }) => {
    const themedColor = getCardColor(color);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        className="card border-0 h-100 position-relative"
        style={{
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: glow,
          background:
            theme === "dark"
              ? `linear-gradient(135deg, ${color}22, ${color}08)`
              : `linear-gradient(135deg, ${themedColor}33, ${themedColor}11)`,
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 56,
                height: 56,
                background: `${themedColor}20`,
                border: `1.5px solid ${themedColor}`,
              }}
            >
              <span style={{ color: themedColor, fontSize: "1.5rem" }}>
                {icon}
              </span>
            </div>
          </div>

          <h3 className="fw-bold" style={{ color: themedColor }}>
            {loading ? "..." : value}
          </h3>
          <p className="text-muted small">{label}</p>
        </div>

        <div
          className="position-absolute"
          style={{ bottom: -6, right: -6, fontSize: 48, opacity: 0.15 }}
        >
          🎄
        </div>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      {/* Background with theme */}
      <div
        className="min-vh-100 position-relative"
        style={{
          background: backgroundStyle,
          transition: "0.4s ease",
          padding: "1px",
        }}
      >
        {/* Snow only in Xmas */}
        {theme === "xmas" &&
          [...Array(20)].map((_, i) => <Snowflake key={i} delay={i * 0.3} />)}

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h2
                className="fw-bold mb-1"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(90deg, #b3eaff, #e0f7ff)"
                      : "none",
                  WebkitBackgroundClip: theme === "dark" ? "text" : "unset",
                  WebkitTextFillColor:
                    theme === "dark" ? "transparent" : "inherit",
                  color: theme === "xmas" ? "#FFD700" : "#ffffff",
                  textShadow:
                    theme === "xmas"
                      ? "0 0 18px rgba(255,215,0,0.4)"
                      : "0 0 14px rgba(180,230,255,0.3)",
                }}
              >
                {theme === "xmas"
                  ? "🎅 North Pole Control Center"
                  : "🧊 Frostbyte Admin Station"}
              </h2>

              <p className="text-light text-opacity-75">
                {theme === "xmas"
                  ? "Real-time Air Quality Monitoring from Santa’s HQ ❄️"
                  : "Centralized system analytics & diagnostics"}
              </p>
            </div>

            {/* THEME SWITCH */}
            <button
              className="btn btn-outline-light px-3 py-2 d-flex align-items-center gap-2"
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "xmas" : "dark"))
              }
              style={{
                borderRadius: 14,
                boxShadow:
                  theme === "xmas"
                    ? "0 0 20px rgba(255,215,0,0.4)"
                    : "0 0 14px rgba(180,230,255,0.2)",
                border:
                  theme === "dark"
                    ? "1px solid rgba(180,230,255,0.4)"
                    : "1px solid #FFD700",
              }}
            >
              {theme === "dark" ? (
                <>
                  <FaGift /> Xmas Mode
                </>
              ) : (
                <>
                  <FaMoon /> Dark Mode
                </>
              )}
            </button>
          </motion.div>

          {/* Stats */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaUsers />}
                label="Total Users"
                value={stats.totalUsers}
                color="#67e8f9"
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaServer />}
                label="Active Sensors"
                value={stats.totalSensors}
                color="#0ea5b7"
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaBell />}
                label="Total Alerts"
                value={stats.totalAlerts}
                color="#fbbf24"
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                icon={<FaMapMarkerAlt />}
                label="Monitoring Zones"
                value={stats.activeLocations}
                color="#10b981"
              />
            </div>
          </div>

          {/* Charts & Health */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-8">
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: 18,
                  background:
                    theme === "dark" ? "#ffffff" : "rgba(255, 215, 0, 0.15)",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">
                    {theme === "xmas"
                      ? "🎄 Weekly Activity"
                      : "Weekly Activity"}
                  </h5>
                  <Line data={chartData} />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: 18,
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg,#1e293b,#0f172a)"
                      : "linear-gradient(135deg,#4a3100,#6d4a00)",
                  color: "white",
                  boxShadow: glow,
                }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                    <FaSnowflake /> System Health
                  </h5>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="rounded-circle"
                      style={{
                        width: 14,
                        height: 14,
                        backgroundColor: "#10b981",
                      }}
                    />
                    All Systems Operational
                  </div>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Database</span>
                      <span className="text-success fw-semibold">✓ Online</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>API Server</span>
                      <span className="text-success fw-semibold">✓ Online</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Sensors</span>
                      <span className="text-success fw-semibold">
                        ✓ {stats.totalSensors}/{stats.totalSensors}
                      </span>
                    </div>
                  </div>

                  <div
                    className="alert mt-3"
                    style={{
                      borderRadius: 12,
                      background:
                        theme === "dark"
                          ? "rgba(251, 191, 36, 0.15)"
                          : "rgba(255, 215, 0, 0.25)",
                      color: "#fbbf24",
                      border: "1px solid #fbbf24",
                    }}
                  >
                    <FaExclamationTriangle className="me-2" />
                    {stats.todayAlerts} alerts today
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 18,
              background:
                theme === "dark" ? "#ffffff" : "rgba(255, 215, 0, 0.15)",
              boxShadow: glow,
            }}
          >
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-3">Recent Activity</h5>

              {[
                {
                  user: "john_doe",
                  action: "triggered alert",
                  time: "2 min ago",
                },
                {
                  user: "admin",
                  action: "added new sensor",
                  time: "15 min ago",
                },
                {
                  user: "jane_smith",
                  action: "registered",
                  time: "1 hour ago",
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-3 py-3 border-bottom"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 40,
                      height: 40,
                      background: "#f1f5f9",
                    }}
                  >
                    <FaChartLine className="text-muted" size={16} />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span>
                        <strong>{a.user}</strong> {a.action}
                      </span>
                      <span className="text-muted small">{a.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Xmas Footer */}
          {theme === "xmas" && (
            <div className="text-center mt-5">
              <h4 className="text-warning fw-bold">
                🎅 Ho Ho Ho! Keep Our Air Clean This Christmas! 🎄
              </h4>
              <p className="text-light">
                North Pole Control Center - Powered by Santa’s Elves ❄️
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
