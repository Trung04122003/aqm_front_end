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
  FaUserShield
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

  const menuItems = [
    { path: "/admin", icon: <FaHome />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/sensors", icon: <FaServer />, label: "Sensors" },
    { path: "/admin/alerts", icon: <FaBell />, label: "Alert Management" },
    { path: "/admin/thresholds", icon: <FaCog />, label: "Thresholds" },
    { path: "/admin/reports", icon: <FaChartBar />, label: "Reports" }
  ];

  return (
    <div className="d-flex min-vh-100" style={{ background: "#f8fafc" }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="position-fixed h-100 shadow-sm"
            style={{
              width: 280,
              background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
              zIndex: 1000,
              overflowY: "auto"
            }}
          >
            {/* Logo */}
            <div className="p-4 border-bottom border-white border-opacity-10">
              <Link 
                to="/admin" 
                className="text-decoration-none d-flex align-items-center gap-2"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(255,255,255,0.1)"
                  }}
                >
                  <FaUserShield className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-white fw-bold" style={{ fontSize: "1.2rem" }}>
                    AQM Admin
                  </div>
                  <div className="text-white-50 small">Control Panel</div>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="p-3">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 text-decoration-none px-3 py-3 rounded mb-1 ${
                      isActive
                        ? "bg-white bg-opacity-10 text-white"
                        : "text-white text-opacity-75"
                    }`
                  }
                  style={{ transition: "all 0.2s" }}
                >
                  {({ isActive }) => (
                    <>
                      <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                      <span className="fw-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="position-absolute end-0 me-3"
                          style={{
                            width: 4,
                            height: 24,
                            borderRadius: 2,
                            background: "white"
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="position-absolute bottom-0 w-100 p-3 border-top border-white border-opacity-10">
              <button
                className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? 280 : 0,
          transition: "margin-left 0.3s"
        }}
      >
        {/* Top Bar */}
        <header
          className="bg-white border-bottom sticky-top d-flex align-items-center justify-content-between px-4 py-3 shadow-sm"
          style={{ zIndex: 999 }}
        >
          <button
            className="btn btn-link text-dark p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* User Menu */}
          <div className="position-relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="d-flex align-items-center gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div
                className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white"
                style={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #667eea, #764ba2)"
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="d-none d-md-block">
                <div className="fw-semibold small">{user?.username || "Admin"}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Administrator
                </div>
              </div>
            </motion.div>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="position-absolute end-0 mt-2 card border-0 shadow-lg"
                style={{ minWidth: 200, borderRadius: 12, zIndex: 1050 }}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="card-body p-2">
                  <Link
                    to="/admin/profile"
                    className="dropdown-item rounded py-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    className="dropdown-item rounded py-2 text-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4" style={{ minHeight: "calc(100vh - 72px)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}