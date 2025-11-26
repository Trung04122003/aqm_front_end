// src/components/Sidebar.tsx - CHRISTMAS 2025 ULTIMATE EDITION 🎄 (Grok + Claude Fusion)

import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Snowflake component (from Grok - JS animated for better control)
  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: -20,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 1
      }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      ❄️
    </motion.div>
  );

  return (
    <aside 
      className="app-sidebar position-relative overflow-hidden"
      style={{ 
        width: 280,
        height: "100vh", 
        padding: "2rem 1rem",
        background: "linear-gradient(180deg, rgba(255, 250, 250, 0.95) 0%, rgba(224, 247, 250, 0.95) 100%)",
        borderRight: "3px solid #FFD700",
        boxShadow: "4px 0 20px rgba(196, 30, 58, 0.15)"
      }}
    >
      {/* Floating Snowflakes (Grok style) */}
      {[...Array(8)].map((_, i) => (
        <Snowflake key={i} delay={i * 0.5} />
      ))}

      {/* Christmas Ornament Background (Claude pseudo-elements) */}
      <div className="position-absolute" style={{ top: -20, right: -20, fontSize: "80px", opacity: 0.1 }}>
        🎄
      </div>
      <div className="position-absolute" style={{ bottom: -20, left: -20, fontSize: "100px", opacity: 0.08 }}>
        🎄
      </div>

      {/* Logo Section (Claude enhanced with Grok motion) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5 position-relative"
        style={{ zIndex: 1 }}
      >
        <motion.div
          className="d-inline-block mb-2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: "4rem" }}
        >
          🎄
        </motion.div>
        <div 
          style={{ 
            fontSize: "1.5rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #C41E3A 0%, #165B33 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)"
          }}
        >
          AQM Winter
        </div>
        <div style={{ fontSize: "0.85rem", color: "#165B33", fontWeight: 600, marginTop: "0.25rem" }}>
          🎅 Christmas 2025 Edition
        </div>
      </motion.div>

      {/* Navigation (Grok base with Claude hover effects) */}
      <nav className="nav flex-column gap-2 position-relative" style={{ zIndex: 1 }}>
        {[
          { to: "/", label: "Dashboard", icon: "🏠" },
          { to: "/forecast", label: "Forecast", icon: "🔮" },
          { to: "/alerts", label: "Alerts", icon: "🔔" },
          { to: "/reports", label: "Reports", icon: "📊" },
          { to: "/support", label: "Support", icon: "💬" }
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink 
              to={item.to} 
              className="nav-link d-flex align-items-center gap-3 position-relative overflow-hidden"
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                fontWeight: "600",
                fontSize: "1rem",
                textDecoration: "none",
                color: "#165B33",
                transition: "all 0.3s ease"
              }}
            >
              <span className="nav-icon" style={{ fontSize: "1.3rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Christmas Decoration Footer (Claude with Grok motion) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="position-absolute bottom-0 w-100 text-center pb-4"
        style={{ borderTop: "2px dashed #FFD700", paddingTop: "2rem", marginTop: "2rem" }}
      >
        <div style={{ fontSize: "0.9rem", color: "#165B33", fontWeight: 600, marginBottom: "1rem" }}>
          🎁 Season's Greetings! 🎁
        </div>
        <motion.div
          className="d-flex justify-content-center gap-3"
          style={{ fontSize: "2rem" }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🎄 ⛄ 🎅
        </motion.div>
      </motion.div>
    </aside>
  );
}