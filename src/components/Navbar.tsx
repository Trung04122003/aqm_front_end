// src/components/Navbar.tsx - CHRISTMAS 2025 EDITION 🎄

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import AlertBadge from "./AlertBadge";
import SearchBar from "./SearchBar";
import api from "../api/axios";

export default function ChristmasNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  // Generate snowflakes
  useEffect(() => {
    const flakes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5
    }));
    setSnowflakes(flakes);
  }, []);

  // Fetch unread alerts
  useEffect(() => {
    if (!user) return;
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get("/alerts/unread");
        setUnreadCount(res.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch unread alerts", err);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

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
      className="navbar navbar-expand-lg sticky-top position-relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #C41E3A 0%, #165B33 50%, #C41E3A 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        borderBottom: "3px solid #FFD700",
        zIndex: 1000
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
            pointerEvents: "none"
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear"
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
          style={{ color: "#FFFAFA", fontSize: "1.6rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
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

        {/* Right Side Actions */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              {/* Christmas Gift Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                style={{ cursor: "pointer", color: "#FFD700", fontSize: "24px" }}
              >
                🎁
              </motion.div>

              {/* Alerts Bell with Snow */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }}
                whileTap={{ scale: 0.9 }}
                className="position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/alerts")}
              >
                <FaBell size={22} style={{ color: "#FFD700" }} />
                <div className="position-absolute top-0 start-100 translate-middle">
                  <AlertBadge count={unreadCount} size="sm" variant="danger" />
                </div>
              </motion.div>

              {/* User Dropdown with Santa Hat */}
              <div className="position-relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center position-relative"
                    style={{
                      width: 40,
                      height: 40,
                      background: "linear-gradient(135deg, #FFD700, #FFA500)",
                      boxShadow: "0 4px 12px rgba(255, 215, 0, 0.5)",
                      border: "2px solid white"
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🎅</span>
                    <motion.div
                      className="position-absolute"
                      style={{ top: -10, right: -10, fontSize: "20px" }}
                      animate={{ rotate: [-10, 10, -10] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎄
                    </motion.div>
                  </div>
                  <div className="d-none d-md-block">
                    <div className="small fw-bold" style={{ lineHeight: 1.2, color: "#FFFAFA" }}>
                      {user.username || "User"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#FFD700" }}>
                      🔔 Merry Christmas!
                    </div>
                  </div>
                </motion.div>

                {/* ✅ FIX: Dropdown Menu với z-index cao */}
  {showUserMenu && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="position-absolute end-0 mt-2 card border-0 shadow-lg"
      style={{
        minWidth: 220,
        borderRadius: 16,
        zIndex: 9999, // ✅ CRITICAL: Cao hơn mọi element khác
        background: "linear-gradient(135deg, #FFFAFA, #E0F7FA)",
        border: "2px solid #FFD700"
      }}
      onMouseLeave={() => setShowUserMenu(false)}
    >
      <div className="card-body p-2">
        {/* ✅ Profile Link */}
        <Link
          to="/profile"
          className="dropdown-item rounded py-2 px-3 d-flex align-items-center gap-2"
          onClick={() => setShowUserMenu(false)}
          style={{ color: "#165B33" }}
        >
          <FaUser size={14} />
          🎁 Profile
        </Link>
        
        <hr className="my-2" style={{ borderColor: "#FFD700" }} />
        
        {/* Logout */}
        <button
          className="dropdown-item rounded py-2 px-3 d-flex align-items-center gap-2"
          onClick={handleLogout}
          style={{ color: "#C41E3A", fontWeight: "600" }}
        >
          <FaSignOutAlt size={14} />
          🎅 Logout
        </button>
      </div>
    </motion.div>
  )}
              </div>
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
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.5)"
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
        style={{ height: "3px", background: "linear-gradient(90deg, #FFD700, #C41E3A, #165B33, #FFD700, #C41E3A)" }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </nav>
  );
}