// src/components/Navbar.tsx - CHRISTMAS 2025 EDITION WITH NOTIFICATIONS 🔔

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import AlertBadge from "./AlertBadge";
import SearchBar from "./SearchBar";
import api from "../api/axios";
import { toast } from "react-toastify";

type Alert = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string;
  triggeredAt: string;
  isRead: boolean;
};

export default function ChristmasNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [snowflakes, setSnowflakes] = useState<
    Array<{ id: number; left: number; delay: number; duration: number }>
  >([]);

  // Generate snowflakes
  useEffect(() => {
    const flakes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
    }));
    setSnowflakes(flakes);
  }, []);

  // Fetch unread alerts
  useEffect(() => {
    if (!user) return;
    fetchAlerts();
    // Poll every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts/unread");
      const alerts = Array.isArray(res.data) ? res.data : [];
      setRecentAlerts(alerts.slice(0, 3)); // Show only latest 3
      setUnreadCount(alerts.length);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setRecentAlerts((prev) => prev.filter((a) => a.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("🎅 Alert marked as read!");
    } catch (err) {
      console.error("Failed to mark as read:", err);
      toast.error("Failed to mark as read");
    }
  };

  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return ts;
    }
  };

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top position-relative"
      style={{
        background:
          "linear-gradient(90deg, #C41E3A 0%, #165B33 50%, #C41E3A 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderBottom: "3px solid #FFD700",
        zIndex: 1000,
      }}
    >
      {/* Falling Snowflakes */}
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="position-absolute"
          style={{
            left: `${flake.left}%`,
            top: -20,
            color: "white",
            fontSize: "20px",
            pointerEvents: "none",
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ❄️
        </motion.div>
      ))}

      <div className="container-fluid px-4">
        {/* Logo with Christmas Tree */}
        <Link
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          style={{
            color: "#FFFAFA",
            fontSize: "1.6rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "2rem" }}
          >
            🎄
          </motion.span>
          AQM Winter
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: "1.2rem" }}
          >
            ⛄
          </motion.span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="d-none d-lg-block mx-auto" style={{ maxWidth: 400 }}>
          <SearchBar
            placeholder="🔎 Search locations, sensors..."
            onSearch={handleSearch}
            suggestions={["Hanoi 🎅", "Ho Chi Minh City 🎄", "Da Nang ❄️"]}
          />
        </div>

        {/* ✅ RIGHT SIDE - Profile + Notifications + Logout */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              {/* Christmas Gift Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  cursor: "pointer",
                  color: "#FFD700",
                  fontSize: "24px",
                }}
              >
                🎁
              </motion.div>

              {/* ✅ INLINE NOTIFICATION PANEL */}
              <div className="position-relative">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }}
                  whileTap={{ scale: 0.9 }}
                  className="position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FaBell size={22} style={{ color: "#FFD700" }} />
                  {unreadCount > 0 && (
                    <div className="position-absolute top-0 start-100 translate-middle">
                      <AlertBadge count={unreadCount} size="sm" variant="danger" />
                    </div>
                  )}
                </motion.div>

                {/* ✅ NOTIFICATION PANEL (Inline, not dropdown) */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="position-absolute end-0 mt-2 shadow-lg"
                      style={{
                        width: 380,
                        maxHeight: 500,
                        background: "white",
                        borderRadius: 16,
                        border: "3px solid #FFD700",
                        zIndex: 2000,
                        overflow: "hidden",
                      }}
                    >
                      {/* Header */}
                      <div
                        className="p-3 text-white d-flex justify-content-between align-items-center"
                        style={{
                          background: "linear-gradient(135deg, #C41E3A, #165B33)",
                        }}
                      >
                        <div className="fw-bold">🔔 Notifications</div>
                        {unreadCount > 0 && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              background: "#FFD700",
                              color: "#C41E3A",
                              padding: "4px 10px",
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Notification List */}
                      <div style={{ maxHeight: 400, overflowY: "auto" }}>
                        {recentAlerts.length === 0 ? (
                          <div className="text-center py-5">
                            <div style={{ fontSize: "3rem" }}>🎄</div>
                            <div className="text-muted small">All caught up!</div>
                          </div>
                        ) : (
                          recentAlerts.map((alert) => (
                            <motion.div
                              key={alert.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-3 border-bottom"
                              style={{
                                background: "white",
                                borderLeft: "4px solid #C41E3A",
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="fw-semibold" style={{ color: "#C41E3A" }}>
                                  {alert.pollutant} Alert
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="btn btn-sm btn-success"
                                  style={{
                                    borderRadius: 8,
                                    padding: "2px 8px",
                                    fontSize: "0.75rem",
                                  }}
                                  onClick={() => handleMarkAsRead(alert.id)}
                                >
                                  ✓
                                </motion.button>
                              </div>
                              <div className="small text-muted mb-1">
                                📍 {alert.locationName}
                              </div>
                              <div className="small">
                                Value: <strong>{alert.value.toFixed(1)}</strong>
                              </div>
                              <div className="small text-muted">
                                {formatTime(alert.triggeredAt)}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div
                        className="p-2 text-center border-top"
                        style={{ background: "#f8f9fa" }}
                      >
                        <Link
                          to="/alerts"
                          className="text-decoration-none fw-semibold"
                          style={{ color: "#165B33" }}
                          onClick={() => setShowNotifications(false)}
                        >
                          View All Alerts →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ✅ PROFILE ICON */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/profile")}
              >
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    boxShadow: "0 4px 12px rgba(255, 215, 0, 0.5)",
                    border: "2px solid white",
                  }}
                >
                  <FaUser size={18} />
                </div>
                <div className="d-none d-md-block">
                  <div
                    className="small fw-bold"
                    style={{ lineHeight: 1.2, color: "#FFFAFA" }}
                  >
                    {user.username || "User"}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#FFD700" }}>
                    🎁 Profile
                  </div>
                </div>
              </motion.div>

              {/* ✅ LOGOUT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #C41E3A, #165B33)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(196, 30, 58, 0.3)",
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt size={14} />
                <span className="d-none d-md-inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                className="btn btn-light fw-bold px-4"
                to="/login"
                style={{
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #FFD700, #FFA500)",
                  color: "#165B33",
                  border: "2px solid white",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.5)",
                }}
              >
                🎄 Sign in
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="d-lg-none w-100 px-4 pb-3">
        <SearchBar placeholder="🔎 Search..." onSearch={handleSearch} />
      </div>

      {/* Twinkling Lights Border */}
      <motion.div
        className="position-absolute bottom-0 w-100"
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #FFD700, #C41E3A, #165B33, #FFD700, #C41E3A)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </nav>
  );
}