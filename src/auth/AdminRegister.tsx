// src/auth/AdminRegister.tsx (MILITARY COMMAND CENTER VIBE)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUserShield, 
  FaEye, 
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdCard,
  FaCheckCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const AdminRegister: React.FC = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("⚠️ PASSWORDS DO NOT MATCH");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ PASSWORD MUST BE AT LEAST 6 CHARACTERS");
      return;
    }

    setLoading(true);
    try {
      await register({ username, password, email, fullName });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "REGISTRATION FAILED";
      setError(`⚠️ ${msg.toUpperCase()}`);
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
      {/* Animated Grid Background */}
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

      {/* Radar Sweep Effect */}
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
      <div className="position-absolute" style={{ top: 20, left: 20, width: 80, height: 80 }}>
        <div style={{ borderTop: "3px solid #ff0000", borderLeft: "3px solid #ff0000", width: "100%", height: "100%" }} />
      </div>
      <div className="position-absolute" style={{ top: 20, right: 20, width: 80, height: 80 }}>
        <div style={{ borderTop: "3px solid #ff0000", borderRight: "3px solid #ff0000", width: "100%", height: "100%" }} />
      </div>
      <div className="position-absolute" style={{ bottom: 20, left: 20, width: 80, height: 80 }}>
        <div style={{ borderBottom: "3px solid #ff0000", borderLeft: "3px solid #ff0000", width: "100%", height: "100%" }} />
      </div>
      <div className="position-absolute" style={{ bottom: 20, right: 20, width: 80, height: 80 }}>
        <div style={{ borderBottom: "3px solid #ff0000", borderRight: "3px solid #ff0000", width: "100%", height: "100%" }} />
      </div>

      {/* Registration Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: 700,
          background: "rgba(10, 14, 39, 0.95)",
          border: "2px solid #ff0000",
          borderRadius: 0,
          boxShadow: "0 0 50px rgba(255, 0, 0, 0.5), inset 0 0 50px rgba(255, 0, 0, 0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #ff0000 0%, #8b0000 100%)",
            padding: "20px 30px",
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

          <div className="d-flex align-items-center justify-content-between position-relative">
            <div className="d-flex align-items-center gap-3">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px #ff0000",
                    "0 0 40px #ff0000",
                    "0 0 20px #ff0000"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaUserShield size={40} color="#fff" />
              </motion.div>
              <div>
                <div style={{ 
                  color: "#fff", 
                  fontSize: "24px", 
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  textShadow: "0 0 10px #ff0000"
                }}>
                  ADMIN REGISTRATION
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "2px" }}>
                  CLASSIFIED ACCESS /// LEVEL ALPHA
                </div>
              </div>
            </div>
            
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                color: "#00ff00",
                fontSize: "12px",
                fontWeight: "bold",
                border: "1px solid #00ff00",
                padding: "5px 15px",
                borderRadius: 0,
                letterSpacing: "2px"
              }}
            >
              ONLINE
            </motion.div>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: "40px" }}>
          {/* System Status */}
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
              SYSTEM STATUS: OPERATIONAL /// CLEARANCE REQUIRED
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
            {/* Full Name */}
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
                <FaIdCard /> FULL NAME
              </label>
              <div className="position-relative">
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
                  placeholder="ENTER FULL NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  onFocus={(e) => e.target.style.boxShadow = "0 0 15px #00ff00"}
                  onBlur={(e) => e.target.style.boxShadow = "none"}
                />
              </div>
            </div>

            {/* Username & Email */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label style={{ 
                  color: "#00ff00", 
                  fontSize: "11px", 
                  letterSpacing: "2px",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaUser /> USERNAME
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
                    fontFamily: "inherit"
                  }}
                  placeholder="ADMIN_USERNAME"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label style={{ 
                  color: "#00ff00", 
                  fontSize: "11px", 
                  letterSpacing: "2px",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaEnvelope /> EMAIL
                </label>
                <input
                  type="email"
                  className="w-100"
                  style={{
                    background: "rgba(0, 255, 0, 0.05)",
                    border: "1px solid #00ff00",
                    color: "#00ff00",
                    padding: "12px 15px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                  placeholder="ADMIN@DOMAIN.MIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
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
                    cursor: "pointer",
                    padding: "5px"
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
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
                <FaLock /> CONFIRM PASSWORD
              </label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-100"
                  style={{
                    background: "rgba(0, 255, 0, 0.05)",
                    border: "1px solid #00ff00",
                    color: "#00ff00",
                    padding: "12px 45px 12px 15px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                  placeholder="RE-ENTER PASSWORD"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    cursor: "pointer",
                    padding: "5px"
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
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
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)"
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  REGISTER ADMIN CLEARANCE
                </>
              )}
            </motion.button>
          </form>

          {/* Security Warning */}
          <div 
            className="mt-4 p-3"
            style={{
              background: "rgba(255, 165, 0, 0.05)",
              border: "1px solid #ffa500",
              borderLeft: "4px solid #ffa500"
            }}
          >
            <div style={{ color: "#ffa500", fontSize: "11px", letterSpacing: "1px" }}>
              <strong>⚠️ SECURITY WARNING:</strong> ADMIN ACCOUNTS GRANT FULL SYSTEM ACCESS. 
              UNAUTHORIZED USE IS STRICTLY PROHIBITED AND WILL BE PROSECUTED.
            </div>
          </div>
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
              ALREADY HAVE CLEARANCE?{" "}
              <Link
                to="/admin-login"
                style={{ 
                  color: "#ff0000", 
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                ADMIN LOGIN
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

      {/* CSS Animation */}
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

export default AdminRegister;