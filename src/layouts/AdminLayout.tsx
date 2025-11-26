// src/layouts/AdminLayout.tsx
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
  FaShieldAlt} from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const menuItems = [
    { path: "/admin", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/sensors", icon: <FaServer />, label: "Sensors" },
    { path: "/admin/alerts", icon: <FaBell />, label: "Alert Management" },
    { path: "/admin/thresholds", icon: <FaCog />, label: "Thresholds" },
    { path: "/admin/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/admin/logs", icon: <FaShieldAlt />, label: "Security Logs" }
  ];

  // ❄️ Little sparkle effect on sidebar
  const SnowSparkle = () => (
    <motion.div
      className="position-absolute"
      style={{
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.8)"
      }}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
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
              position: "relative"
            }}
          >
            {/* Sparkles */}
            {[...Array(10)].map((_, i) => (
              <SnowSparkle key={i} />
            ))}

            {/* LOGO */}
            <div className="p-4 border-bottom border-white border-opacity-10">
              <Link
                to="/admin"
                className="text-decoration-none d-flex align-items-center gap-2"
              >
                <motion.div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(4px)"
                  }}
                >
                  <FaGift className="text-warning" size={22} />
                </motion.div>

                <div>
                  <div
                    className="fw-bold"
                    style={{ fontSize: "1.25rem", color: "#FFD700" }}
                  >
                    North Pole HQ
                  </div>
                  <div className="text-light small opacity-75">
                    Control Center
                  </div>
                </div>
              </Link>
            </div>

            {/* NAVIGATION */}
            <nav className="p-3 mt-2">
              {menuItems.map((item) => (
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
                    transition: "0.2s",
                    fontWeight: 500
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          color: isActive ? "#FFD700" : "#ffffff"
                        }}
                      >
                        {item.icon}
                      </span>

                      <span
                        style={{
                          color: isActive ? "#FFD700" : "#ffffffc4"
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
                              "repeating-linear-gradient(45deg, #ff0000, #ff0000 5px, #ffffff 5px, #ffffff 10px)"
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* FOOTER */}
            <div className="position-absolute bottom-0 w-100 p-3 border-top border-white border-opacity-10">
              <button
                className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
                style={{
                  borderRadius: 10,
                  fontWeight: 600
                }}
              >
                <FaSignOutAlt />
                Return to Village
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? 280 : 0,
          transition: "margin-left 0.3s ease"
        }}
      >
        {/* TOP BAR */}
        <header
          className="border-bottom sticky-top d-flex align-items-center justify-content-between px-4 py-3 shadow-sm"
          style={{
            zIndex: 999,
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)"
          }}
        >
          <button
            className="btn btn-link p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: "white" }}
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* USER MENU */}
          <div className="position-relative">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="d-flex align-items-center gap-2 text-white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 42,
                  height: 42,
                  background: "linear-gradient(135deg, #FFD700, #ff9f1c)",
                  color: "#000",
                  fontWeight: 700
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="d-none d-md-block">
                <div className="fw-semibold small text-warning">
                  {user?.username || "Admin"}
                </div>
                <div className="text-light small">Santa Operator</div>
              </div>
            </motion.div>

            {/* DROPDOWN */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="position-absolute end-0 mt-2 card border-0 shadow-lg"
                style={{
                  minWidth: 200,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#13294b",
                  color: "white"
                }}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="card-body p-2">
                  <Link
                    to="/admin/profile"
                    className="dropdown-item text-white rounded py-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile Settings
                  </Link>

                  <hr className="my-1 text-white opacity-25" />

                  <button
                    className="dropdown-item py-2 text-danger fw-bold"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Return to Village
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 text-white" style={{ minHeight: "calc(100vh - 72px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
