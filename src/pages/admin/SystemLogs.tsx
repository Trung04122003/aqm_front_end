// src/pages/admin/SystemLogs.tsx - SECURITY CENTER: NOEL SECURE FORTRESS EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaInfoCircle, FaExclamationTriangle, FaTimesCircle, FaMoon, FaSun } from "react-icons/fa";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

type LogEntry = {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  user?: string;
};

// ❄️ Enhanced Snowflake with varied sizes
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

// 🎄 Christmas Particles (Security-themed: Shields, Locks, Gifts)
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

// ✨ Sparkle effect for theme toggle
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

// 🔒 Pulsing Shield
const PulsingShield = () => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
    }}
    transition={{ duration: 2, repeat: Infinity }}
    style={{ display: "inline-block" }}
  >
    <FaShieldAlt style={{ color: "#0ea5e9", fontSize: "1.5rem" }} />
  </motion.div>
);

export default function SystemLogs() {
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"ALL" | "INFO" | "WARNING" | "ERROR">("ALL");
  const [autoScroll, setAutoScroll] = useState(true);
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.get("/admin/logs");
      setLogs(res.data || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to fetch logs");
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

    setTheme((prev) => (prev === "dark" ? "xmas" : "dark"));
  };

  const getColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "#38bdf8";
      case "WARNING":
        return "#fbbf24";
      case "ERROR":
        return "#f87171";
      default:
        return "#94a3b8";
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case "INFO":
        return <FaInfoCircle />;
      case "WARNING":
        return <FaExclamationTriangle />;
      case "ERROR":
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getEmoji = (level: string) => {
    switch (level) {
      case "INFO":
        return "ℹ️";
      case "WARNING":
        return "⚠️";
      case "ERROR":
        return "🚨";
      default:
        return "📝";
    }
  };

  const filteredLogs = logs.filter(
    (l) => filter === "ALL" || l.level === filter
  );

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: backgroundStyle,
          padding: "1.5rem",
          transition: "background 0.5s ease",
        }}
      >
        {/* Enhanced Snowfall */}
        {[...Array(35)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.2} size={12 + Math.random() * 12} />
        ))}

        {/* Christmas Particles (only in xmas mode) */}
        {theme === "xmas" && (
          <>
            {[...Array(8)].map((_, i) => (
              <ChristmasParticle
                key={`gift-${i}`}
                delay={i * 2}
                emoji={["🛡️", "🎄", "⭐", "🔒", "🗝️", "🎁", "🔐", "🦌"][i % 8]}
              />
            ))}
          </>
        )}

        {/* Sparkle effects on theme toggle */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        {/* HEADER with Enhanced Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 position-relative"
          style={{ zIndex: 2 }}
        >
          <motion.h2
            className="fw-bold text-light d-flex align-items-center gap-3 mb-2"
            animate={{
              textShadow: [
                "0 0 15px rgba(14,165,233,0.5)",
                "0 0 25px rgba(14,165,233,0.7)",
                "0 0 15px rgba(14,165,233,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: "#0ea5e9" }}
          >
            <PulsingShield />
            {theme === "xmas" ? "Santa's Secure Fortress Center 🛡️" : "Security Center 🛡️"}
          </motion.h2>
          <p className="text-light text-opacity-75 mb-0" style={{ marginTop: -6 }}>
            {theme === "xmas" ? "Guarding the North Pole with Elf Security Protocols ❄️" : "Real-time activity feed from the North Pole CyberWatch Division ❄️"}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="row g-3 mb-4"
          style={{ zIndex: 2, position: "relative" }}
        >
          {[
            { level: "ALL", count: logs.length, color: "#0ea5e9", emoji: "📊" },
            {
              level: "INFO",
              count: logs.filter((l) => l.level === "INFO").length,
              color: "#38bdf8",
              emoji: "ℹ️",
            },
            {
              level: "WARNING",
              count: logs.filter((l) => l.level === "WARNING").length,
              color: "#fbbf24",
              emoji: "⚠️",
            },
            {
              level: "ERROR",
              count: logs.filter((l) => l.level === "ERROR").length,
              color: "#f87171",
              emoji: "🚨",
            },
          ].map((stat, i) => (
            <div key={i} className="col-md-3">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-3"
                style={{
                  borderRadius: 14,
                  background: `${stat.color}15`,
                  border: `2px solid ${stat.color}40`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 48,
                      height: 48,
                      background: `${stat.color}30`,
                      fontSize: "24px",
                    }}
                  >
                    {stat.emoji}
                  </div>
                  <div>
                    <div className="text-light small opacity-75">
                      {stat.level}
                    </div>
                    <div
                      className="h4 mb-0 fw-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.count}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* FILTER BAR with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex gap-2 mb-3 flex-wrap"
          style={{ zIndex: 2, position: "relative" }}
        >
          {["ALL", "INFO", "WARNING", "ERROR"].map((lvl) => (
            <motion.button
              key={lvl}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm px-4 py-2"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setFilter(lvl as any)}
              style={{
                borderRadius: 12,
                background: filter === lvl ? getColor(lvl) : "#1e293b",
                color: filter === lvl ? "#fff" : "#cbd5e1",
                border: `1px solid ${filter === lvl ? getColor(lvl) : " #334155"}`,
                fontWeight: 600,
                boxShadow:
                  filter === lvl ? `0 0 15px ${getColor(lvl)}50` : "none",
              }}
            >
              {getEmoji(lvl)} {lvl}
            </motion.button>
          ))}

          {/* Auto-scroll Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-sm px-4 py-2"
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              borderRadius: 12,
              background: autoScroll
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "#1e293b",
              border: "1px solid #334155",
              color: "white",
              fontWeight: 600,
            }}
          >
            {autoScroll ? "🔄 Auto-scroll ON" : "⏸️ Auto-scroll OFF"}
          </motion.button>

          {/* Enhanced Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="btn px-4 py-2 d-flex align-items-center gap-3 ms-auto"
            onClick={handleThemeToggle}
            style={{
              borderRadius: 50,
              background:
                theme === "xmas"
                  ? "linear-gradient(135deg, #C41E3A, #8B0000)"
                  : "linear-gradient(135deg, #0ea5e9, #0369a1)",
              border: "none",
              boxShadow: glow,
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            <motion.div
              animate={{ rotate: theme === "xmas" ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <FaShieldAlt size={22} /> : <FaInfoCircle size={22} />}
            </motion.div>
            <span>{theme === "dark" ? "Noel Secure Mode" : "Dark Mode"}</span>
            <motion.div
              animate={{ rotate: theme === "xmas" ? 0 : 360 }}
              transition={{ duration: 0.6 }}
            >
              {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* LOG LIST - Terminal Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: 16,
            border: "2px solid #334155",
            maxHeight: "68vh",
            overflowY: "auto",
            fontFamily: "'Courier New', monospace",
            position: "relative",
            zIndex: 2,
            boxShadow: "0 0 30px rgba(14,165,233,0.2)",
          }}
        >
          {/* Terminal Header */}
          <div
            className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom"
            style={{ borderColor: "#334155" }}
          >
            <div
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                background: "#ef4444",
              }}
            />
            <div
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                background: "#fbbf24",
              }}
            />
            <div
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                background: "#10b981",
              }}
            />
            <span className="ms-2 text-light small opacity-75">
              system.log - {filteredLogs.length} entries
            </span>
          </div>

          {/* Logs */}
          <AnimatePresence mode="popLayout">
            {filteredLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-5"
              >
                <div style={{ fontSize: "3rem" }}>🎄</div>
                <div className="text-light opacity-75 mt-2">
                  No logs found for {filter}
                </div>
              </motion.div>
            ) : (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: index * 0.03 }}
                  className="mb-2 p-3"
                  style={{
                    borderRadius: 12,
                    background: "rgba(30, 41, 59, 0.6)",
                    borderLeft: `4px solid ${getColor(log.level)}`,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center gap-2">
                      <motion.div
                        animate={{
                          scale: log.level === "ERROR" ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                          duration: 1,
                          repeat: log.level === "ERROR" ? Infinity : 0,
                        }}
                        style={{ color: getColor(log.level), fontSize: "1rem" }}
                      >
                        {getIcon(log.level)}
                      </motion.div>
                      <span
                        className="fw-semibold px-2 py-1"
                        style={{
                          color: getColor(log.level),
                          background: `${getColor(log.level)}20`,
                          borderRadius: 6,
                          fontSize: "0.85rem",
                        }}
                      >
                        {log.level}
                      </span>
                    </div>
                    <span className="text-muted small">
                      {new Date(log.timestamp).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="mt-2 text-light" style={{ fontSize: "0.95rem" }}>
                    {log.message}
                  </div>

                  {log.user && (
                    <div
                      className="mt-2 d-inline-flex align-items-center gap-1 px-2 py-1"
                      style={{
                        color: "#94a3b8",
                        background: "rgba(148,163,184,0.1)",
                        borderRadius: 6,
                        fontSize: "0.85rem",
                      }}
                    >
                      👤 {log.user}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
        </motion.div>

        {/* Decorative Corner Elements */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="position-fixed"
          style={{
            bottom: 20,
            right: 20,
            fontSize: "2rem",
            opacity: 0.3,
            zIndex: 1,
          }}
        >
          🎄
        </motion.div>
      </div>
    </AdminLayout>
  );
}