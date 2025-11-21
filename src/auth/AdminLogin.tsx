import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAuth();
  const [usernameOrEmail, setusernameOrEmail] = useState("");
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
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      setError(e?.response?.data || e?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient position-relative overflow-hidden">
      {/* BG */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #ff6b6b 0%, #d64ecf 100%)",
          opacity: 0.9,
        }}
      />

      {/* Orbs */}
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 380,
          height: 380,
          background: "rgba(255,255,255,0.1)",
          top: "-10%",
          left: "-6%",
        }}
        animate={{ y: [0, 30, 0], rotate: [0, 75, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          background: "rgba(255,255,255,0.08)",
          bottom: "-10%",
          right: "-7%",
        }}
        animate={{ y: [0, -35, 0], rotate: [0, -80, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card border-0 shadow-lg position-relative"
        style={{ width: "100%", maxWidth: 440, borderRadius: 20 }}
      >
        <div className="card-header bg-white text-center pt-5 pb-3 border-0">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #d64ecf 0%, #ff6b6b 100%)",
              boxShadow: "0 10px 30px rgba(255, 107, 107, 0.35)",
            }}
          >
            <FaUserShield size={38} color="#fff" />
          </div>

          <h3 className="fw-bold" style={{ color: "#2d3748" }}>
            Admin Portal
          </h3>
          <p className="text-muted small mb-0">Restricted Access Only</p>
        </div>

        <div className="card-body p-4 pt-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert alert-danger mb-3"
              style={{ borderRadius: 12 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={submit}>
            {/* usernameOrEmail */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">
                Admin username
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-0">
                  <FaUserShield className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 ps-2"
                  placeholder="Enter admin username"
                  value={usernameOrEmail}
                  onChange={(e) => setusernameOrEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">
                Password
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-0">
                  <FaLock className="text-muted" />
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-light border-0 ps-2"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="btn bg-light border-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* BTN */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn w-100 text-white fw-semibold py-3 border-0 shadow"
              style={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #d64ecf 100%)",
                borderRadius: 12,
                fontSize: 16,
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Verifying...
                </>
              ) : (
                "Login as Admin"
              )}
            </motion.button>
          </form>
        </div>

        <div className="card-footer text-center bg-light border-0 py-4">
          <p className="text-muted small mb-0">
            Return to{" "}
            <Link
              to="/login"
              className="fw-semibold"
              style={{ color: "#ff6b6b" }}
            >
              User Login
            </Link>
          </p>
        </div>
      </motion.div>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient position-relative overflow-hidden">
        {/* ... (paste the visual body you liked earlier) */}
        {/* For brevity, reuse the AdminLogin UI provided earlier by Claude */}
        {/* Ensure form submits to submit() */}
      </div>
    </div>
  );
};

export default AdminLogin;
