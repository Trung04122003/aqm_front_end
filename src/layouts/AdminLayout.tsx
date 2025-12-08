// src/layouts/AdminLayout.tsx - FIXED VERSION

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaServer,
  FaBell,
  FaCog,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGift,
  FaShieldAlt,
  FaLifeRing,
  FaMapMarkerAlt, // ✅ Icon cho Locations
} from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  // ✅ FIXED: Thêm Locations vào menu chính, đặt ngay dưới Dashboard
  const menuItems = [
    { path: "/admin", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/locations", icon: <FaMapMarkerAlt />, label: "Manage Locations" }, // ✅ NEW
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/sensors", icon: <FaServer />, label: "Sensors" },
    { path: "/admin/alerts", icon: <FaBell />, label: "Alert Management" },
    { path: "/admin/thresholds", icon: <FaCog />, label: "Thresholds" },
    { path: "/admin/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/admin/supports", icon: <FaLifeRing />, label: "Support Tickets" },
    { path: "/admin/logs", icon: <FaShieldAlt />, label: "Security Logs" },
  ];

  // ❄️ Sidebar Sparkle effect
  const SnowSparkle = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.8)",
        pointerEvents: "none",
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.4, 1.2, 0.4],
        y: [0, -20, -40]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  // 🎄 Floating Ornament
  const FloatingOrnament = ({ emoji, delay = 0 }: { emoji: string; delay?: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        right: 10,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 1,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );

  return (
    <div className="d-flex min-vh-100" style={{ background: "#0a1524" }}>
      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="position-fixed h-100 shadow-lg"
            style={{
              width: 280,
              background: "linear-gradient(180deg, #0c1a33 0%, #13294b 100%)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              zIndex: 1000,
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Sparkles */}
            {[...Array(15)].map((_, i) => (
              <SnowSparkle key={`sparkle-${i}`} delay={i * 0.2} />
            ))}

            {/* LOGO */}
            <div className="p-4 border-bottom border-white border-opacity-10 position-relative">
              <Link
                to="/admin"
                className="text-decoration-none d-flex align-items-center gap-2"
              >
                <motion.div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,107,107,0.2))",
                    backdropFilter: "blur(4px)",
                    border: "2px solid rgba(255,215,0,0.3)",
                    boxShadow: "0 0 20px rgba(255,215,0,0.3)",
                  }}
                >
                  <FaGift className="text-warning" size={26} />
                </motion.div>
                <div>
                  <motion.div
                    className="fw-bold"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255,215,0,0.5)",
                        "0 0 20px rgba(255,215,0,0.8)",
                        "0 0 10px rgba(255,215,0,0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: "1.3rem", color: "#FFD700" }}
                  >
                    North Pole HQ
                  </motion.div>
                  <div className="text-light small opacity-75">
                    Control Center
                  </div>
                </div>
              </Link>
             
              {/* Decorative Stars */}
              <motion.div
                className="position-absolute"
                style={{ top: 15, right: 15, fontSize: "12px" }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                ⭐
              </motion.div>
            </div>

            {/* NAVIGATION */}
            <nav className="p-3 mt-2">
              {menuItems.map((item, index) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 text-decoration-none px-3 py-3 rounded position-relative mb-1 ${
                      isActive
                        ? "text-white"
                        : "text-white text-opacity-75"
                    }`
                  }
                  style={{
                    transition: "all 0.2s",
                    fontWeight: 500,
                  }}
                >
                  {({ isActive }) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="d-flex align-items-center gap-3 w-100 position-relative"
                      whileHover={{ x: 5 }}
                    >
                      {/* Background Glow on Active */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBackground"
                          className="position-absolute w-100 h-100"
                          style={{
                            background: "linear-gradient(90deg, rgba(255,215,0,0.15), transparent)",
                            borderRadius: 8,
                            left: 0,
                            top: 0,
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <motion.span
                        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.6 }}
                        style={{
                          fontSize: "1.3rem",
                          color: isActive ? "#FFD700" : "#ffffff",
                          filter: isActive ? "drop-shadow(0 0 5px rgba(255,215,0,0.8))" : "none",
                        }}
                      >
                        {item.icon}
                      </motion.span>
                      <span
                        style={{
                          color: isActive ? "#FFD700" : "#ffffffc4",
                        }}
                      >
                        {item.label}
                      </span>
                      {/* Candy Cane Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="position-absolute end-0 me-2"
                          style={{
                            width: 6,
                            height: 26,
                            borderRadius: 4,
                            background:
                              "repeating-linear-gradient(45deg, #ff0000, #ff0000 5px, #ffffff 5px, #ffffff 10px)",
                          }}
                        />
                      )}
                      {/* Floating Ornament on Hover */}
                      {isActive && index % 2 === 0 && (
                        <FloatingOrnament emoji="🎄" delay={index * 0.1} />
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Christmas Decoration Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-3 py-2 mx-3 mt-2"
              style={{
                background: "rgba(255,215,0,0.1)",
                borderRadius: 12,
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "2rem" }}
                >
                  🎅
                </motion.div>
                <div className="text-warning small fw-semibold mt-1">
                  Ho Ho Ho!
                </div>
                <div className="text-light small opacity-75">
                  Merry Christmas!
                </div>
              </div>
            </motion.div>

            {/* FOOTER */}
            <div className="position-absolute bottom-1 w-100 p-3 border-top border-white border-opacity-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
                style={{
                  borderRadius: 10,
                  fontWeight: 600,
                  borderWidth: 2,
                }}
              >
                <FaSignOutAlt />
                Return to Village
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? 280 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* TOP BAR */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-bottom sticky-top d-flex align-items-center justify-content-between px-4 py-3 shadow-sm"
          style={{
            zIndex: 999,
            background: "rgba(10, 21, 36, 0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-link p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: "white" }}
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>

          {/* Breadcrumb or Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="d-none d-md-flex align-items-center gap-2"
          >
            <span className="text-light opacity-75 small">
              🎄 North Pole Command Center
            </span>
          </motion.div>

          {/* USER MENU */}
          <div className="position-relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="d-flex align-items-center gap-2 text-white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(255,215,0,0.4)",
                    "0 0 15px rgba(255,215,0,0.6)",
                    "0 0 0 rgba(255,215,0,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg, #FFD700, #ff9f1c)",
                  color: "#000",
                  fontWeight: 700,
                  border: "2px solid rgba(255,215,0,0.5)",
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </motion.div>
              <div className="d-none d-md-block">
                <div className="fw-semibold small text-warning">
                  {user?.username || "Admin"}
                </div>
                <div className="text-light small opacity-75">Santa Operator</div>
              </div>
            </motion.div>

            {/* DROPDOWN */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="position-absolute end-0 mt-2 card border-0 shadow-lg"
                  style={{
                    minWidth: 220,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "rgba(19, 41, 75, 0.98)",
                    color: "white",
                    border: "1px solid rgba(255,215,0,0.2)",
                  }}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="card-body p-2">
                    <Link
                      to="/admin/profile"
                      className="dropdown-item text-white rounded py-2 px-3 d-flex align-items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                      style={{ transition: "background 0.2s" }}
                    >
                      👤 Profile Settings
                    </Link>
                    <hr className="my-1 text-white opacity-25" />
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="dropdown-item py-2 px-3 text-danger fw-bold d-flex align-items-center gap-2"
                      onClick={handleLogout}
                      style={{
                        background: "transparent",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <FaSignOutAlt />
                      Return to Village
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* PAGE CONTENT */}
        <main className="p-4 text-white" style={{ minHeight: "calc(100vh - 72px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}