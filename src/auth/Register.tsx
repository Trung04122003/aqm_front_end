// src/auth/Register.tsx (FAIRY TALE WONDERLAND EDITION)
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  // Mock register function (replace with your actual auth logic)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const register = async (data: any) => {
    console.log("Registering:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Welcome to Wonderland! 🦄✨");
  };

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

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match! Please check again 🔮");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 magical characters ✨");
      return;
    }

    setLoading(true);

    try {
      await register({
        username,
        password,
        email,
        fullName,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5
  }));

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        fontFamily: "'Quicksand', 'Comic Sans MS', cursive"
      }}
    >
      {/* Animated Background */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(173, 216, 230, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 224, 0.3) 0%, transparent 50%)
          `,
          animation: "backgroundShift 15s ease infinite"
        }}
      />

      {/* Floating Sparkles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="position-absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: Math.random() > 0.5 ? "20px" : "12px",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))"
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {Math.random() > 0.5 ? "✨" : "⭐"}
        </motion.div>
      ))}

      {/* Floating Clouds */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="position-absolute"
          style={{
            fontSize: "60px",
            opacity: 0.6,
            top: `${20 + i * 25}%`,
          }}
          animate={{
            x: ["0vw", "100vw"]
          }}
          transition={{
            duration: 40 + i * 10,
            repeat: Infinity,
            ease: "linear",
            delay: i * 5
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: 520,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 32,
          boxShadow: "0 20px 60px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          overflow: "hidden"
        }}
      >
        {/* Decorative Header */}
        <div
          className="position-relative"
          style={{
            background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            padding: "40px 32px 30px",
            borderBottom: "3px solid rgba(255, 255, 255, 0.8)"
          }}
        >
          {/* Floating Stars */}
          <motion.div
            className="position-absolute"
            style={{ top: 20, right: 30, fontSize: "25px" }}
            animate={{
              rotate: [0, 15, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌟
          </motion.div>

          <motion.div
            className="position-absolute"
            style={{ top: 30, left: 30, fontSize: "20px" }}
            animate={{
              rotate: [0, -15, 0],
              y: [0, -8, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            ✨
          </motion.div>

          {/* Avatar with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-center mb-3"
          >
            <div
              className="d-inline-flex align-items-center justify-content-center position-relative"
              style={{
                width: 90,
                height: 90,
                background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                borderRadius: "50%",
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                border: "4px solid white"
              }}
            >
              <span style={{ fontSize: "45px" }}>🦄</span>
              
              {/* Orbiting Stars */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="position-absolute"
                  style={{
                    fontSize: "18px",
                    transformOrigin: "center"
                  }}
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(${angle}deg) translateX(55px)`
                    }}
                  >
                    💫
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <h2 
            className="text-center mb-2" 
            style={{ 
              color: "#5a3d8a",
              fontWeight: "bold",
              fontSize: "32px",
              textShadow: "2px 2px 4px rgba(255, 255, 255, 0.5)"
            }}
          >
            Join the Magic ✨
          </h2>
          <p className="text-center mb-0" style={{ color: "#7c5ba4", fontSize: "15px" }}>
            Create your magical AQM account now! 🌈
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: "32px" }}>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="alert mb-4 d-flex align-items-center"
                style={{
                  background: "linear-gradient(135deg, #ffe5e5 0%, #ffd6d6 100%)",
                  border: "2px solid #ffb3b3",
                  borderRadius: 16,
                  color: "#d63447",
                  fontSize: "14px"
                }}
              >
                <span className="me-2" style={{ fontSize: "20px" }}>🦋</span>
                <div>{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submit}>
            {/* Full Name */}
            <div className="mb-3">
              <label 
                className="form-label d-flex align-items-center gap-2" 
                style={{ 
                  color: "#7c5ba4", 
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                <span style={{ fontSize: "16px" }}>👤</span> Full Name
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  style={{
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a",
                    transition: "all 0.3s"
                  }}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a78bfa";
                    e.target.style.boxShadow = "0 0 0 4px rgba(167, 139, 250, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0d4f7";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <motion.div
                  className="position-absolute"
                  style={{ right: 15, top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎭
                </motion.div>
              </div>
            </div>

            {/* Username & Email Row */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label 
                  className="form-label d-flex align-items-center gap-2" 
                  style={{ 
                    color: "#7c5ba4", 
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  <span style={{ fontSize: "16px" }}>👤</span> Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="Choose username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="col-md-6">
                <label 
                  className="form-label d-flex align-items-center gap-2" 
                  style={{ 
                    color: "#7c5ba4", 
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  <span style={{ fontSize: "16px" }}>📧</span> Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  style={{
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label 
                className="form-label d-flex align-items-center gap-2" 
                style={{ 
                  color: "#7c5ba4", 
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                <span style={{ fontSize: "16px" }}>🔒</span> Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  style={{
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 50px 14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="Create secret spell"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="position-absolute"
                  style={{
                    right: 15,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#a78bfa",
                    cursor: "pointer",
                    fontSize: "18px"
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label 
                className="form-label d-flex align-items-center gap-2" 
                style={{ 
                  color: "#7c5ba4", 
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                <span style={{ fontSize: "16px" }}>🔒</span> Confirm Password
              </label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  style={{
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 50px 14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="Confirm your spell"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="position-absolute"
                  style={{
                    right: 15,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#a78bfa",
                    cursor: "pointer",
                    fontSize: "18px"
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.03, boxShadow: "0 15px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-100 border-0 d-flex align-items-center justify-content-center gap-2"
              type="submit"
              disabled={loading}
              style={{
                background: loading 
                  ? "linear-gradient(135deg, #ccc, #999)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "16px",
                borderRadius: 16,
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {!loading && (
                <motion.div
                  className="position-absolute w-100 h-100 top-0 start-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />
                  <span>Creating magic...</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "18px" }}>⭐</span>
                  <span>Join Wonderland</span>
                  <span style={{ fontSize: "18px" }}>⭐</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div
          className="text-center"
          style={{
            padding: "24px 32px",
            background: "linear-gradient(135deg, #fef3e2 0%, #fce4ec 100%)",
            borderTop: "2px solid rgba(167, 139, 250, 0.2)"
          }}
        >
          <p className="mb-0" style={{ color: "#7c5ba4", fontSize: "14px" }}>
            Already have an account? 🧚‍♂️{" "}
            <a
              href="/login"
              style={{ 
                color: "#9333ea", 
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Sign In Here
            </a>
          </p>
        </div>
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes backgroundShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        input::placeholder {
          color: rgba(124, 91, 164, 0.5);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Register;

// // src/pages/Register.tsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "./AuthProvider";
// import { motion } from "framer-motion";
// import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// const Register: React.FC = () => {
//   const { register } = useAuth();

//   const [fullName, setFullName] = useState("");
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await register({
//         username,
//         password,
//         email,
//         fullName,
//       });
//     } catch (err: unknown) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const e: any = err;
//       const msg =
//         e?.response?.data?.message ||
//         e?.response?.data ||
//         e?.message ||
//         "Registration failed";
//       setError(msg);
//     }
//   };

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative bg-gradient overflow-hidden">
//       {/* Background Gradient */}
//       <div
//         className="position-absolute w-100 h-100"
//         style={{
//           background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
//           opacity: 0.9,
//         }}
//       />

//       {/* Floating Orbs */}
//       <motion.div
//         className="position-absolute rounded-circle"
//         style={{
//           width: 380,
//           height: 380,
//           background: "rgba(255,255,255,0.12)",
//           top: "-12%",
//           left: "-6%",
//         }}
//         animate={{ y: [0, 30, 0], rotate: [0, 80, 0] }}
//         transition={{ duration: 20, repeat: Infinity }}
//       />
//       <motion.div
//         className="position-absolute rounded-circle"
//         style={{
//           width: 300,
//           height: 300,
//           background: "rgba(255,255,255,0.07)",
//           bottom: "-12%",
//           right: "-6%",
//         }}
//         animate={{ y: [0, -35, 0], rotate: [0, -90, 0] }}
//         transition={{ duration: 18, repeat: Infinity }}
//       />

//       {/* Register Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 25 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="card border-0 shadow-lg position-relative"
//         style={{
//           width: "100%",
//           maxWidth: 440,
//           borderRadius: 20,
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <div className="card-header bg-white text-center pt-5 pb-3 border-0">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//           >
//             <div className="mb-3">
//               <div
//                 className="d-inline-flex align-items-center justify-content-center rounded-circle"
//                 style={{
//                   width: 80,
//                   height: 80,
//                   background:
//                     "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
//                   boxShadow: "0 10px 30px rgba(118, 75, 162, 0.38)",
//                 }}
//               >
//                 <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
//                   <path d="M3 14s-1 0-1-1 1-4 6-4 6 4 6 4 0 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
//                 </svg>
//               </div>
//             </div>
//           </motion.div>

//           <h3 className="fw-bold" style={{ color: "#2d3748" }}>
//             Create Account
//           </h3>
//           <p className="text-muted mb-0 small">Join the AQM system today</p>
//         </div>

//         {/* Body */}
//         <div className="card-body p-4 pt-3">
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="alert alert-danger d-flex align-items-center mb-4"
//               style={{ borderRadius: 12 }}
//             >
//               <div className="small">{error}</div>
//             </motion.div>
//           )}

//           <form onSubmit={submit}>
//             {/* Full Name */}
//             <div className="mb-3">
//               <label className="form-label small fw-semibold text-muted">
//                 Full Name
//               </label>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text bg-light border-0">
//                   <FaUser className="text-muted" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control bg-light border-0 ps-2"
//                   placeholder="Your full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Username */}
//             <div className="mb-3">
//               <label className="form-label small fw-semibold text-muted">
//                 Username
//               </label>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text bg-light border-0">
//                   <FaUser className="text-muted" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control bg-light border-0 ps-2"
//                   placeholder="Choose a username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="mb-3">
//               <label className="form-label small fw-semibold text-muted">
//                 Email
//               </label>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text bg-light border-0">
//                   <FaEnvelope className="text-muted" />
//                 </span>
//                 <input
//                   type="email"
//                   className="form-control bg-light border-0 ps-2"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label className="form-label small fw-semibold text-muted">
//                 Password
//               </label>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text bg-light border-0">
//                   <FaLock className="text-muted" />
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control bg-light border-0 ps-2"
//                   placeholder="Choose a password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   className="btn bg-light border-0"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={loading}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               whileHover={{ scale: loading ? 1 : 1.02 }}
//               whileTap={{ scale: loading ? 1 : 0.98 }}
//               className="btn w-100 text-white fw-semibold py-3 border-0 shadow"
//               type="submit"
//               disabled={loading}
//               style={{
//                 background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
//                 borderRadius: 12,
//                 fontSize: 16,
//               }}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Creating account...
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </motion.button>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="card-footer bg-light border-0 text-center py-4">
//           <p className="mb-0 small text-muted">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-decoration-none fw-semibold"
//               style={{ color: "#667eea" }}
//             >
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;

// // // src/pages/Register.tsx
// // import React, { useState } from "react";
// // import AuthLayout from "../layouts/AuthLayout";
// // import { useAuth } from "../auth/AuthProvider";
// // import { useNavigate } from "react-router-dom";
// // import NavbarPublic from "../components/NavbarPublic";

// // <>
// //   <NavbarPublic />
// //   <div className="container mt-5">...</div>
// // </>

// // const Register: React.FC = () => {
// //   const { register } = useAuth();
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [msg, setMsg] = useState<string | null>(null);
// //   const [err, setErr] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();

// //   const submit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   setErr(null);
// //   setMsg(null);
// //   setLoading(true);
// //   try {
// //     const resp = await register({ username, email, password });
// //     // nếu backend trả message -> show briefly, rồi redirect
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     const successMsg = (resp as any)?.message || "Registration successful. Redirecting to login...";
// //     setMsg(successMsg);

// //     // small UX delay để user thấy thông báo, rồi chuyển hướng
// //     setTimeout(() => {
// //       navigate("/login");
// //     }, 900); // 900ms — đủ để đọc thông báo, không quá lâu

// //   } catch (err: unknown) {
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     const e: any = err;
// //     setErr(e?.response?.data?.message || e?.message || "Registration failed");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   return (
// //     <AuthLayout>
// //       <h3 className="mb-3">Register</h3>
// //       {msg && <div className="alert alert-success">{msg}</div>}
// //       {err && <div className="alert alert-danger">{err}</div>}

// //       <form onSubmit={submit}>
// //         <div className="mb-2">
// //           <label className="form-label">Username</label>
// //           <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
// //         </div>
// //         <div className="mb-2">
// //           <label className="form-label">Email</label>
// //           <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
// //         </div>
// //         <div className="mb-3">
// //           <label className="form-label">Password</label>
// //           <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
// //         </div>
// //         <div className="d-grid">
// //           <button className="btn btn-success" type="submit" disabled={loading}>
// //             {loading ? "Registering..." : "Register"}
// //           </button>
// //         </div>
// //       </form>
// //     </AuthLayout>
// //   );
// // };

// // export default Register;

// // // // src/pages/Register.tsx
// // // import React from "react";
// // // import { Link } from "react-router-dom";
// // // import AuthLayout from "../layouts/AuthLayout";

// // // const Register: React.FC = () => {
// // //   return (
// // //     <AuthLayout>
// // //       <h3 className="mb-3">Register</h3>
// // //       <p className="text-muted">Placeholder Register page.</p>
// // //       <div className="d-grid gap-2">
// // //         <button className="btn btn-success" type="button">Mock Register</button>
// // //       </div>

// // //       <hr />
// // //       <div className="text-center">
// // //         <Link to="/login">Have an account? Sign in</Link>
// // //       </div>
// // //     </AuthLayout>
// // //   );
// // // };

// // // export default Register;
