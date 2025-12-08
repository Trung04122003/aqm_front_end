// src/pages/admin/UsersAdmin.tsx - RETRO CHRISTMAS TIME MACHINE EDITION 🕰️🎄

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserPlus,
  FaSearch,
  FaCrown,
  FaUserShield,
  FaTrash,
  FaEdit,
  FaSnowflake,
  FaMoon,
  FaSun,
  FaClock,
} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// TYPES
type User = {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER" | "GUEST";
  status: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

// ❄️ Snowflake
const Snowflake = ({ delay = 0, size = 18 }: { delay?: number; size?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: `${size}px`,
      pointerEvents: "none",
      zIndex: 1,
      color: "rgba(255,255,255,0.7)",
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

// 🎄 Christmas Particles
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

// 🕰️ Vintage TV Scan Lines (Retro mode only)
const TVScanLines = () => (
  <div
    className="position-fixed w-100 h-100"
    style={{
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 3,
      background: `
        repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        )
      `,
      opacity: 0.5,
    }}
  />
);

// 📼 VHS Glitch Effect
const VHSGlitch = () => (
  <motion.div
    className="position-fixed w-100 h-100"
    style={{
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 4,
      mixBlendMode: "screen",
    }}
    animate={{
      opacity: [0, 0.05, 0, 0.1, 0],
    }}
    transition={{
      duration: 0.1,
      repeat: Infinity,
      repeatDelay: Math.random() * 5 + 2,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "2px",
        background: "rgba(255, 0, 0, 0.5)",
        position: "absolute",
        top: `${Math.random() * 100}%`,
      }}
    />
  </motion.div>
);

export default function UsersAdmin() {
  const [theme, setTheme] = useState<"modern" | "retro">("modern");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = users.filter((u) =>
    `${u.username} ${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing({
      username: "",
      fullName: "",
      email: "",
      role: "USER",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const saveUser = async () => {
    if (!editing) return;

    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/admin/users/${editing.id}`, editing);
        toast.success("🎄 User updated!");
      } else {
        await api.post("/admin/users", editing);
        toast.success("🎁 User created!");
      }
      setShowModal(false);
      loadUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this user?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("🎁 User deleted!");
      loadUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Theme toggle with sparkle effect
  const handleThemeToggle = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create sparkles
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      id: Date.now() + i,
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);

    setTheme((prev) => (prev === "modern" ? "retro" : "modern"));
  };

  const backgroundStyle =
    theme === "modern"
      ? "linear-gradient(180deg, #0a1929 0%, #0f172a 100%)"
      : "linear-gradient(180deg, #2d1810 0%, #1a0d06 100%)";

  const glow = theme === "retro" 
    ? "0 0 30px rgba(255,165,0,0.6), 0 0 50px rgba(255,69,0,0.4)" 
    : "0 0 20px rgba(103,232,249,0.3)";

  const primaryColor = theme === "retro" ? "#FFA500" : "#67e8f9";

  const roleBadge = (role: User["role"]) => {
    if (role === "ADMIN")
      return (
        <span
          className="badge px-3 py-1 d-inline-flex align-items-center gap-1"
          style={{
            background: theme === "retro" 
              ? "linear-gradient(135deg, #FF6347, #FF4500)"
              : "linear-gradient(135deg, #ff6b6b, #c92a2a)",
            borderRadius: 10,
            color: "white",
            boxShadow: theme === "retro" ? "0 0 10px rgba(255,99,71,0.5)" : "none",
          }}
        >
          <FaCrown /> Admin
        </span>
      );
    if (role === "USER")
      return (
        <span
          className="badge px-3 py-1 d-inline-flex align-items-center gap-1"
          style={{
            background: theme === "retro"
              ? "linear-gradient(135deg, #FFA500, #FF8C00)"
              : "linear-gradient(135deg, #0ea5e9, #0369a1)",
            borderRadius: 10,
            color: "white",
            boxShadow: theme === "retro" ? "0 0 10px rgba(255,165,0,0.5)" : "none",
          }}
        >
          <FaUserShield /> User
        </span>
      );
    return (
      <span
        className="badge px-3 py-1"
        style={{
          background: "rgba(148,163,184,0.3)",
          borderRadius: 10,
          color: "#94a3b8",
        }}
      >
        Guest
      </span>
    );
  };

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          paddingBottom: "40px",
          background: backgroundStyle,
          transition: "background 0.5s ease",
          marginLeft: -16,
          marginRight: -16,
          marginTop: -16,
        }}
      >
        {/* Retro Effects */}
        {theme === "retro" && (
          <>
            <TVScanLines />
            <VHSGlitch />
          </>
        )}

        {/* Snowflakes */}
        {[...Array(30)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.3} size={12 + Math.random() * 10} />
        ))}

        {/* Christmas Particles */}
        {theme === "retro" ? (
          [...Array(8)].map((_, i) => (
            <ChristmasParticle
              key={`xmas-${i}`}
              delay={i * 2}
              emoji={["🕯️", "🔔", "🎄", "⭐", "🎁", "🕰️", "📼", "🎅"][i]}
            />
          ))
        ) : (
          [...Array(6)].map((_, i) => (
            <ChristmasParticle
              key={`xmas-${i}`}
              delay={i * 3}
              emoji={["👥", "🎄", "⭐", "🎁", "❄️", "🔔"][i]}
            />
          ))
        )}

        {/* Sparkle effects */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        <div className="container-fluid p-4 position-relative" style={{ zIndex: 5 }}>
          {/* Header with Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          >
            <div>
              <motion.h2
                className="fw-bold mb-1 d-flex align-items-center gap-2"
                animate={{
                  textShadow:
                    theme === "retro"
                      ? [
                          "0 0 20px rgba(255,165,0,0.5)",
                          "0 0 35px rgba(255,165,0,0.7)",
                          "0 0 20px rgba(255,165,0,0.5)",
                        ]
                      : [
                          "0 0 12px rgba(173,230,255,0.4)",
                          "0 0 24px rgba(173,230,255,0.6)",
                          "0 0 12px rgba(173,230,255,0.4)",
                        ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: primaryColor }}
              >
                <FaSnowflake />
                {theme === "retro" 
                  ? "🎅 Santa's Vintage User Registry 🕰️"
                  : "North Pole User Command Center"
                }
              </motion.h2>
              <p className="text-light opacity-75 mb-0">
                {theme === "retro"
                  ? "Managing elves & operators since 1950s - Classic Edition 🎄"
                  : "Monitor & manage all registered elves, operators, and administrators."
                }
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
                background:
                  theme === "retro"
                    ? "linear-gradient(135deg, #FF6347, #FF4500)"
                    : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                border: "none",
                boxShadow: glow,
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              <motion.div
                animate={{ rotate: theme === "retro" ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {theme === "modern" ? <FaClock size={22} /> : <FaSnowflake size={22} />}
              </motion.div>
              <span>{theme === "modern" ? "Retro Mode" : "Modern Mode"}</span>
              <motion.div
                animate={{ rotate: theme === "retro" ? 0 : 360 }}
                transition={{ duration: 0.6 }}
              >
                {theme === "modern" ? <FaSun size={18} /> : <FaMoon size={18} />}
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              {
                label: "Total Users",
                value: users.length,
                icon: "👥",
                color: primaryColor,
              },
              {
                label: "Admins",
                value: users.filter((u) => u.role === "ADMIN").length,
                icon: "👑",
                color: "#ff6b6b",
              },
              {
                label: "Active",
                value: users.filter((u) => u.status === "ACTIVE").length,
                icon: "✅",
                color: "#10b981",
              },
              {
                label: "Suspended",
                value: users.filter((u) => u.status === "SUSPENDED").length,
                icon: "⏸️",
                color: "#f59e0b",
              },
            ].map((stat, i) => (
              <div key={i} className="col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card border-0 h-100"
                  style={{
                    borderRadius: 18,
                    background:
                      theme === "retro"
                        ? `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`
                        : `${stat.color}15`,
                    border: `2px solid ${stat.color}${theme === "retro" ? "60" : "40"}`,
                    backdropFilter: "blur(6px)",
                    boxShadow: theme === "retro" ? `0 0 20px ${stat.color}30` : "none",
                  }}
                >
                  {/* Retro border effect */}
                  {theme === "retro" && (
                    <div
                      className="position-absolute top-0 start-0 w-100"
                      style={{
                        height: 4,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        background: `repeating-linear-gradient(90deg, ${stat.color} 0px, ${stat.color} 10px, #fff 10px, #fff 20px)`,
                      }}
                    />
                  )}

                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 56,
                          height: 56,
                          background: `${stat.color}30`,
                          border: `2px solid ${stat.color}`,
                          fontSize: "28px",
                          boxShadow: theme === "retro" ? `0 0 15px ${stat.color}50` : "none",
                        }}
                      >
                        {stat.icon}
                      </motion.div>
                      <div>
                        <div className="text-light small opacity-75">
                          {stat.label}
                        </div>
                        <div
                          className="h3 mb-0 fw-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 shadow-sm"
            style={{
              borderRadius: 14,
              backdropFilter: "blur(12px)",
              background:
                theme === "retro"
                  ? "rgba(255,165,0,0.08)"
                  : "rgba(255,255,255,0.07)",
              border: `1px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: theme === "retro" ? "0 0 20px rgba(255,165,0,0.2)" : "none",
            }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className="input-group"
                  style={{
                    background:
                      theme === "retro"
                        ? "rgba(255,165,0,0.1)"
                        : "rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: theme === "retro" ? "1px solid rgba(255,165,0,0.3)" : "none",
                  }}
                >
                  <span
                    className="input-group-text bg-transparent border-0"
                    style={{ color: primaryColor }}
                  >
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control bg-transparent border-0 text-light"
                    placeholder={
                      theme === "retro"
                        ? "Search vintage records..."
                        : "Search elves & admins..."
                    }
                    style={{ outline: "none" }}
                  />
                </div>
              </div>
              <div className="col-md-6 text-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn px-4 py-2 d-inline-flex align-items-center gap-2"
                  style={{
                    background:
                      theme === "retro"
                        ? "linear-gradient(135deg, #FFA500, #FF8C00)"
                        : "linear-gradient(135deg, #74c0fc, #4dabf7)",
                    border: "none",
                    borderRadius: 10,
                    color: "white",
                    fontWeight: 600,
                    boxShadow:
                      theme === "retro"
                        ? "0 0 25px rgba(255,165,0,0.5)"
                        : "0 0 20px rgba(116,192,252,0.4)",
                  }}
                  onClick={openCreate}
                >
                  <FaUserPlus /> {theme === "retro" ? "Register User" : "Add User"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Table Panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="shadow-sm"
            style={{
              borderRadius: 14,
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              background:
                theme === "retro"
                  ? "rgba(255,165,0,0.06)"
                  : "rgba(255,255,255,0.06)",
              border: `1px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: theme === "retro" ? "0 0 30px rgba(255,165,0,0.2)" : "none",
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover text-light mb-0">
                <thead>
                  <tr
                    style={{
                      background:
                        theme === "retro"
                          ? "rgba(255,165,0,0.12)"
                          : "rgba(255,255,255,0.08)",
                      letterSpacing: "0.5px",
                      fontWeight: 600,
                      color: primaryColor,
                    }}
                  >
                    <th className="px-3 py-3 border-0" style={{ color: primaryColor }}>
                      {theme === "retro" ? "📼 ID" : "ID"}
                    </th>
                    <th className="border-0" style={{ color: primaryColor }}>Username</th>
                    <th className="border-0" style={{ color: primaryColor }}>Full Name</th>
                    <th className="border-0" style={{ color: primaryColor }}>Email</th>
                    <th className="border-0" style={{ color: primaryColor }}>Role</th>
                    <th className="border-0" style={{ color: primaryColor }}>Status</th>
                    <th className="text-end px-3 border-0" style={{ color: primaryColor }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        <div
                          className="spinner-border"
                          style={{ color: primaryColor }}
                        ></div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-light opacity-75">
                        <div style={{ fontSize: "3rem" }}>
                          {theme === "retro" ? "🕰️" : "🎄"}
                        </div>
                        <div className="mt-2">No users found.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((u, index) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor:
                            theme === "retro"
                              ? "rgba(255,165,0,0.1)"
                              : "rgba(255,255,255,0.08)",
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="px-3">
                          <span
                            className="badge px-2 py-1"
                            style={{
                              background:
                                theme === "retro"
                                  ? "rgba(255,165,0,0.3)"
                                  : "rgba(103,232,249,0.2)",
                              color: primaryColor,
                              boxShadow:
                                theme === "retro"
                                  ? "0 0 10px rgba(255,165,0,0.3)"
                                  : "none",
                            }}
                          >
                            #{u.id}
                          </span>
                        </td>
                        <td className="fw-semibold">{u.username}</td>
                        <td>{u.fullName}</td>
                        <td className="opacity-75">{u.email}</td>
                        <td>{roleBadge(u.role)}</td>
                        <td>
                          <span
                            className="badge px-3 py-1"
                            style={{
                              background:
                                u.status === "ACTIVE"
                                  ? "rgba(16,185,129,0.2)"
                                  : "rgba(245,158,11,0.2)",
                              color: u.status === "ACTIVE" ? "#10b981" : "#f59e0b",
                              borderRadius: 10,
                              boxShadow:
                                theme === "retro"
                                  ? u.status === "ACTIVE"
                                    ? "0 0 10px rgba(16,185,129,0.3)"
                                    : "0 0 10px rgba(245,158,11,0.3)"
                                  : "none",
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="text-end px-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm me-2"
                            style={{
                              borderRadius: 8,
                              background:
                                theme === "retro"
                                  ? "rgba(255,165,0,0.2)"
                                  : "rgba(14,165,233,0.2)",
                              border: `1px solid ${theme === "retro" ? "#FFA500" : "#0ea5e9"}`,
                              color: theme === "retro" ? "#FFA500" : "#0ea5e9",
                            }}
                            onClick={() => {
                              setEditing(u);
                              setShowModal(true);
                            }}
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm"
                            style={{
                              borderRadius: 8,
                              background: "linear-gradient(135deg, #ef4444, #dc2626)",
                              border: "none",
                              color: "white",
                            }}
                            disabled={deletingId === u.id}
                            onClick={() => deleteUser(u.id)}
                          >
                            {deletingId === u.id ? "..." : <FaTrash />}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-5"
          >
            {theme === "retro" ? (
              <>
                <motion.h4
                  className="fw-bold mb-2"
                  animate={{
                    color: ["#FFA500", "#FF6347", "#FFA500"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🕰️ Vintage Christmas User Registry - Est. 1950 🎄
                </motion.h4>
                <p className="text-light mb-0 opacity-75">
                  Managing {filteredData.length} user{filteredData.length !== 1 ? "s" : ""} · 
                  Classic Edition · Powered by Vacuum Tubes 📼
                </p>
              </>
            ) : (
              <small className="text-light opacity-50">
                🎅 Managing {filteredData.length} user{filteredData.length !== 1 ? "s" : ""} · 
                North Pole Command Center ❄️
              </small>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            style={{ 
              background: "rgba(0,0,0,0.8)", 
              backdropFilter: "blur(8px)",
              zIndex: 9999,
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  background:
                    theme === "retro"
                      ? "rgba(58, 35, 10, 0.98)"
                      : "rgba(26, 35, 50, 0.98)",
                  color: "white",
                  border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.4)" : "rgba(103,232,249,0.3)"}`,
                  borderRadius: 20,
                  boxShadow:
                    theme === "retro"
                      ? "0 0 40px rgba(255,165,0,0.4)"
                      : "0 0 20px rgba(103,232,249,0.2)",
                }}
              >
                {/* Decorative Border */}
                <div
                  className="position-absolute top-0 start-0 w-100"
                  style={{
                    height: 6,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    background:
                      theme === "retro"
                        ? "repeating-linear-gradient(90deg, #FFA500 0px, #FFA500 15px, #FF6347 15px, #FF6347 30px)"
                        : "repeating-linear-gradient(90deg, #67e8f9 0px, #67e8f9 15px, #0ea5e9 15px, #0ea5e9 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    {theme === "retro" && "🕰️ "}
                    {editing?.id ? "Edit User" : "Create User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      className="form-control"
                      value={editing?.username || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, username: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                        color: "white",
                        padding: "12px 16px",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      value={editing?.fullName || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, fullName: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                        color: "white",
                        padding: "12px 16px",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editing?.email || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, email: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                        color: "white",
                        padding: "12px 16px",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={editing?.role}
                      onChange={(e) =>
                        setEditing({
                          ...editing!,
                          role: e.target.value as User["role"],
                        })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                        color: "white",
                        padding: "12px 16px",
                      }}
                    >
                      <option value="USER" style={{ background: "#1a2332" }}>User</option>
                      <option value="ADMIN" style={{ background: "#1a2332" }}>Admin</option>
                      <option value="GUEST" style={{ background: "#1a2332" }}>Guest</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={editing?.status}
                      onChange={(e) =>
                        setEditing({
                          ...editing!,
                          status: e.target.value as User["status"],
                        })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: `2px solid ${theme === "retro" ? "rgba(255,165,0,0.3)" : "rgba(103,232,249,0.3)"}`,
                        color: "white",
                        padding: "12px 16px",
                      }}
                    >
                      <option value="ACTIVE" style={{ background: "#1a2332" }}>Active</option>
                      <option value="SUSPENDED" style={{ background: "#1a2332" }}>Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-3"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      borderRadius: 12,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn px-4 py-3"
                    disabled={saving}
                    onClick={saveUser}
                    style={{
                      background:
                        theme === "retro"
                          ? "linear-gradient(135deg, #FFA500, #FF8C00)"
                          : "linear-gradient(135deg, #74c0fc, #4dabf7)",
                      border: "none",
                      borderRadius: 12,
                      color: "white",
                      fontWeight: 600,
                      boxShadow:
                        theme === "retro"
                          ? "0 0 25px rgba(255,165,0,0.5)"
                          : "0 0 20px rgba(116,192,252,0.4)",
                    }}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editing?.id ? "✅ Update" : "🎁 Create"}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}