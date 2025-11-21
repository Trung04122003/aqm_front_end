// src/pages/Register.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Register: React.FC = () => {
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
      await register({
        username,
        password,
        email,
        fullName,
      });
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e: any = err;
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative bg-gradient overflow-hidden">
      {/* Background Gradient */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
          opacity: 0.9,
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 380,
          height: 380,
          background: "rgba(255,255,255,0.12)",
          top: "-12%",
          left: "-6%",
        }}
        animate={{ y: [0, 30, 0], rotate: [0, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          background: "rgba(255,255,255,0.07)",
          bottom: "-12%",
          right: "-6%",
        }}
        animate={{ y: [0, -35, 0], rotate: [0, -90, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
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
        {/* Header */}
        <div className="card-header bg-white text-center pt-5 pb-3 border-0">
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
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  boxShadow: "0 10px 30px rgba(118, 75, 162, 0.38)",
                }}
              >
                <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 4 6 4 0 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <h3 className="fw-bold" style={{ color: "#2d3748" }}>
            Create Account
          </h3>
          <p className="text-muted mb-0 small">Join the AQM system today</p>
        </div>

        {/* Body */}
        <div className="card-body p-4 pt-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="alert alert-danger d-flex align-items-center mb-4"
              style={{ borderRadius: 12 }}
            >
              <div className="small">{error}</div>
            </motion.div>
          )}

          <form onSubmit={submit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">
                Full Name
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-0">
                  <FaUser className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 ps-2"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">
                Username
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-0">
                  <FaUser className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0 ps-2"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">
                Email
              </label>
              <div
                className="input-group"
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-0">
                  <FaEnvelope className="text-muted" />
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-0 ps-2"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
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
                  placeholder="Choose a password"
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn w-100 text-white fw-semibold py-3 border-0 shadow"
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                borderRadius: 12,
                fontSize: 16,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="card-footer bg-light border-0 text-center py-4">
          <p className="mb-0 small text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#667eea" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

// // src/pages/Register.tsx
// import React, { useState } from "react";
// import AuthLayout from "../layouts/AuthLayout";
// import { useAuth } from "../auth/AuthProvider";
// import { useNavigate } from "react-router-dom";
// import NavbarPublic from "../components/NavbarPublic";

// <>
//   <NavbarPublic />
//   <div className="container mt-5">...</div>
// </>

// const Register: React.FC = () => {
//   const { register } = useAuth();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState<string | null>(null);
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const submit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setErr(null);
//   setMsg(null);
//   setLoading(true);
//   try {
//     const resp = await register({ username, email, password });
//     // nếu backend trả message -> show briefly, rồi redirect
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const successMsg = (resp as any)?.message || "Registration successful. Redirecting to login...";
//     setMsg(successMsg);

//     // small UX delay để user thấy thông báo, rồi chuyển hướng
//     setTimeout(() => {
//       navigate("/login");
//     }, 900); // 900ms — đủ để đọc thông báo, không quá lâu

//   } catch (err: unknown) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const e: any = err;
//     setErr(e?.response?.data?.message || e?.message || "Registration failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <AuthLayout>
//       <h3 className="mb-3">Register</h3>
//       {msg && <div className="alert alert-success">{msg}</div>}
//       {err && <div className="alert alert-danger">{err}</div>}

//       <form onSubmit={submit}>
//         <div className="mb-2">
//           <label className="form-label">Username</label>
//           <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div className="mb-2">
//           <label className="form-label">Email</label>
//           <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Password</label>
//           <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div className="d-grid">
//           <button className="btn btn-success" type="submit" disabled={loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </div>
//       </form>
//     </AuthLayout>
//   );
// };

// export default Register;

// // // src/pages/Register.tsx
// // import React from "react";
// // import { Link } from "react-router-dom";
// // import AuthLayout from "../layouts/AuthLayout";

// // const Register: React.FC = () => {
// //   return (
// //     <AuthLayout>
// //       <h3 className="mb-3">Register</h3>
// //       <p className="text-muted">Placeholder Register page.</p>
// //       <div className="d-grid gap-2">
// //         <button className="btn btn-success" type="button">Mock Register</button>
// //       </div>

// //       <hr />
// //       <div className="text-center">
// //         <Link to="/login">Have an account? Sign in</Link>
// //       </div>
// //     </AuthLayout>
// //   );
// // };

// // export default Register;
