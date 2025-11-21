// src/pages/Login.tsx - REDESIGNED
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const { login } = useAuth();
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
      await login(usernameOrEmail, password);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const errorMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient position-relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          opacity: 0.9,
        }}
      />

      {/* Floating Shapes */}
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 400,
          height: 400,
          background: "rgba(255,255,255,0.1)",
          top: "-10%",
          left: "-5%",
        }}
        animate={{ y: [0, 30, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          background: "rgba(255,255,255,0.08)",
          bottom: "-10%",
          right: "-5%",
        }}
        animate={{ y: [0, -40, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card border-0 shadow-lg position-relative"
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div className="card-header border-0 bg-white text-center pt-5 pb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 80,
                  height: 80,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                }}
              >
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <h3 className="mb-2 fw-bold" style={{ color: "#2d3748" }}>
            Welcome Back
          </h3>
          <p className="text-muted mb-0">Sign in to continue to AQM</p>
        </div>

        {/* Card Body */}
        <div className="card-body p-4 pt-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert alert-danger d-flex align-items-center mb-4"
              style={{ borderRadius: 12 }}
            >
              <svg
                className="me-2"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <div className="small">{error}</div>
            </motion.div>
          )}

          <form onSubmit={submit}>
            {/* Username/Email Input */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">
                Username or Email
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text border-0 bg-light">
                  <FaEnvelope className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light ps-2"
                  placeholder="Enter username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{ fontSize: 15 }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-semibold text-muted mb-0">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-decoration-none small"
                  style={{ color: "#667eea" }}
                >
                  Forgot?
                </Link>
              </div>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text border-0 bg-light">
                  <FaLock className="text-muted" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-0 bg-light ps-2"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ fontSize: 15 }}
                />
                <button
                  className="btn border-0 bg-light"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-muted" />
                  ) : (
                    <FaEye className="text-muted" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn w-100 text-white fw-semibold py-3 border-0 shadow"
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 12,
                fontSize: 16,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>

        {/* Card Footer */}
        <div className="card-footer border-0 bg-light text-center py-4">
          <p className="mb-0 text-muted small">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-decoration-none fw-semibold"
              style={{ color: "#667eea" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

// // src/pages/Login.tsx
// import React, { useState } from "react";
// import AuthLayout from "../layouts/AuthLayout";
// import { useAuth } from "../auth/AuthProvider";
// import NavbarPublic from "../components/NavbarPublic";

// <>
//   <NavbarPublic />
//   <div className="container mt-5">...</div>
// </>

// const Login: React.FC = () => {
//   const { login } = useAuth();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await login({username, password });
//       // on success navigate happens inside login()
//     } catch (err: unknown) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const e: any = err;
//       setError(e?.response?.data?.message || e?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       <h3 className="mb-3">Sign in</h3>
//       {error && <div className="alert alert-danger">{error}</div>}
//       <form onSubmit={submit}>
//         <div className="mb-2">
//           <label className="form-label">Username</label>
//           <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Password</label>
//           <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>

//         <div className="d-grid">
//           <button className="btn btn-primary" type="submit" disabled={loading}>
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </div>
//       </form>
//     </AuthLayout>
//   );
// };

// export default Login;
