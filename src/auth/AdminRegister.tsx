// src/pages/auth/AdminRegister.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const AdminRegister: React.FC = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, password, email, fullName });
      // After register, go to admin login
      // NOTE: server may create role USER by default; admin creation might need DB seed or backend support
      // We'll redirect to admin login for manual admin account testing.
      // navigate handled inside register
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const msg = e?.response?.data?.message || e?.message || "Register failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{ background: "#0b0710" }}
    >
      {/* Dark background gradient */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,6,18,0.9), rgba(8,2,15,0.9))",
        }}
      />

      {/* Floating red/purple orbs */}
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,80,120,0.12), transparent 30%)",
          top: "-10%",
          left: "-8%",
        }}
        animate={{ y: [0, 35, 0], rotate: [0, 70, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
      />
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle at 70% 70%, rgba(153,50,255,0.08), transparent 30%)",
          bottom: "-12%",
          right: "-6%",
        }}
        animate={{ y: [0, -40, 0], rotate: [0, -80, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card border-0 shadow-lg position-relative"
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          overflow: "hidden",
          background: "linear-gradient(180deg, #0f0b12, #120615)",
        }}
      >
        <div
          style={{
            padding: "36px 32px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                background: "linear-gradient(135deg,#d64ecf,#ff6b6b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 28px rgba(214,78,207,0.18)",
              }}
            >
              <FaUserShield size={30} color="#fff" />
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#fff" }}>Admin Register</h4>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                Create an admin account (dev only)
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label small text-muted">Full name</label>
              <input
                className="form-control bg-dark text-white border-0"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">Username</label>
              <input
                className="form-control bg-dark text-white border-0"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">Email</label>
              <input
                type="email"
                className="form-control bg-dark text-white border-0"
                placeholder="admin@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-dark text-white border-0"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-danger flex-fill"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
              <Link to="/admin-login" className="btn btn-outline-light">
                Admin Login
              </Link>
            </div>
          </form>
        </div>

        <div
          style={{
            padding: 16,
            borderTop: "1px solid rgba(255,255,255,0.03)",
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <small>Admin creation should be limited to dev or super-admin.</small>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegister;
