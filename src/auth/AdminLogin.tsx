// src/auth/AdminLogin.tsx (MILITARY COMMAND CENTER VIBE)
import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(usernameOrEmail, password);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(`⚠️ ${(err?.response?.data || err?.message || "ACCESS DENIED").toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{ 
        background: "#0a0e27",
        fontFamily: "'Share Tech Mono', 'Courier New', monospace"
      }}
    >
      {/* Animated Grid */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite"
        }}
      />

      {/* Radar Sweep */}
      <motion.div
        className="position-absolute"
        style={{
          width: 800,
          height: 800,
          background: "conic-gradient(from 0deg, transparent 0%, rgba(255,0,0,0.3) 10%, transparent 20%)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none"
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Corner Brackets */}
      {[
        { top: 20, left: 20, border: "borderTop: 3px solid #ff0000; borderLeft: 3px solid #ff0000" },
        { top: 20, right: 20, border: "borderTop: 3px solid #ff0000; borderRight: 3px solid #ff0000" },
        { bottom: 20, left: 20, border: "borderBottom: 3px solid #ff0000; borderLeft: 3px solid #ff0000" },
        { bottom: 20, right: 20, border: "borderBottom: 3px solid #ff0000; borderRight: 3px solid #ff0000" }
      ].map((corner, i) => (
        <div key={i} className="position-absolute" style={{ ...corner, width: 80, height: 80 }}>
          <div style={{ 
            borderTop: corner.top ? "3px solid #ff0000" : "none",
            borderBottom: corner.bottom ? "3px solid #ff0000" : "none",
            borderLeft: corner.left ? "3px solid #ff0000" : "none",
            borderRight: corner.right ? "3px solid #ff0000" : "none",
            width: "100%", 
            height: "100%" 
          }} />
        </div>
      ))}

      {/* Login Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: 550,
          background: "rgba(10, 14, 39, 0.95)",
          border: "2px solid #ff0000",
          boxShadow: "0 0 50px rgba(255, 0, 0, 0.5), inset 0 0 50px rgba(255, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          position: "relative"
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #ff0000 0%, #8b0000 100%)",
            padding: "25px 30px",
            borderBottom: "2px solid #ff0000",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <motion.div
            className="position-absolute top-0 start-0 h-100"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="text-center position-relative">
            <motion.div
              animate={{ 
                boxShadow: ["0 0 20px #ff0000", "0 0 40px #ff0000", "0 0 20px #ff0000"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: 80,
                height: 80,
                background: "rgba(0, 0, 0, 0.3)",
                border: "2px solid #ff0000"
              }}
            >
              <FaShieldAlt size={45} color="#fff" />
            </motion.div>

            <div style={{ 
              color: "#fff", 
              fontSize: "28px", 
              fontWeight: "bold",
              letterSpacing: "4px",
              textShadow: "0 0 10px #ff0000",
              marginBottom: "5px"
            }}>
              ADMIN ACCESS
            </div>
            <div style={{ 
              color: "rgba(255,255,255,0.7)", 
              fontSize: "11px", 
              letterSpacing: "2px" 
            }}>
              RESTRICTED AREA /// AUTHORIZED PERSONNEL ONLY
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "40px" }}>
          {/* Status Indicator */}
          <div 
            className="mb-4 p-3"
            style={{
              background: "rgba(0, 255, 0, 0.05)",
              border: "1px solid #00ff00",
              borderLeft: "4px solid #00ff00"
            }}
          >
            <div className="d-flex align-items-center gap-2" style={{ color: "#00ff00", fontSize: "12px" }}>
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ●
              </motion.div>
              SECURITY SYSTEM: ONLINE /// AWAITING CREDENTIALS
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3"
              style={{
                background: "rgba(255, 0, 0, 0.1)",
                border: "1px solid #ff0000",
                borderLeft: "4px solid #ff0000",
                color: "#ff0000",
                fontSize: "12px",
                letterSpacing: "1px"
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={submit}>
            {/* Username */}
            <div className="mb-3">
              <label style={{ 
                color: "#00ff00", 
                fontSize: "11px", 
                letterSpacing: "2px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaUserShield /> ADMIN USERNAME
              </label>
              <input
                type="text"
                className="w-100"
                style={{
                  background: "rgba(0, 255, 0, 0.05)",
                  border: "1px solid #00ff00",
                  color: "#00ff00",
                  padding: "12px 15px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "all 0.3s"
                }}
                placeholder="ENTER ADMIN USERNAME"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                disabled={loading}
                onFocus={(e) => e.target.style.boxShadow = "0 0 15px #00ff00"}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label style={{ 
                color: "#00ff00", 
                fontSize: "11px", 
                letterSpacing: "2px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <FaLock /> PASSWORD
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-100"
                  style={{
                    background: "rgba(0, 255, 0, 0.05)",
                    border: "1px solid #00ff00",
                    color: "#00ff00",
                    padding: "12px 45px 12px 15px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                  placeholder="ENTER SECURE PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#00ff00",
                    cursor: "pointer"
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-100"
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#555" : "linear-gradient(90deg, #ff0000, #8b0000)",
                border: "2px solid #ff0000",
                color: "#fff",
                padding: "15px",
                fontSize: "14px",
                fontWeight: "bold",
                letterSpacing: "3px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)"
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  VERIFYING...
                </>
              ) : (
                <>
                  <FaShieldAlt className="me-2" />
                  AUTHENTICATE
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "2px solid #ff0000",
            padding: "20px 40px",
            background: "rgba(0, 0, 0, 0.3)"
          }}
        >
          <div className="text-center">
            <div style={{ color: "#00ff00", fontSize: "11px", letterSpacing: "2px", marginBottom: "10px" }}>
              NEED ADMIN CLEARANCE?{" "}
              <Link
                to="/admin-register"
                style={{ 
                  color: "#ff0000", 
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                REQUEST ACCESS
              </Link>
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
              <Link
                to="/login"
                style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              >
                ← RETURN TO USER PORTAL
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        input::placeholder {
          color: rgba(0, 255, 0, 0.4);
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;