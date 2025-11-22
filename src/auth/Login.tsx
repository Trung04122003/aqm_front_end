// src/auth/Login.tsx (FAIRY TALE WONDERLAND)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="position-relative"
        style={{
          width: "100%",
          maxWidth: 460,
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
            padding: "50px 32px 40px",
            borderBottom: "3px solid rgba(255, 255, 255, 0.8)"
          }}
        >
          {/* Floating Moon */}
          <motion.div
            className="position-absolute"
            style={{ top: 20, right: 30, fontSize: "30px" }}
            animate={{
              rotate: [0, 15, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌙
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
                width: 100,
                height: 100,
                background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                borderRadius: "50%",
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                border: "4px solid white"
              }}
            >
              <span style={{ fontSize: "50px" }}>🧚‍♀️</span>
              
              {/* Orbiting Stars */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  className="position-absolute"
                  style={{
                    fontSize: "20px",
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
                      transform: `rotate(${angle}deg) translateX(60px)`
                    }}
                  >
                    ⭐
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
            Welcome Back
          </h2>
          <p className="text-center mb-0" style={{ color: "#7c5ba4", fontSize: "15px" }}>
            Enter the magical AQM realm for now~~~ ✨
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: "40px 32px" }}>
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
            {/* Username/Email */}
            <div className="mb-3">
              <label 
                className="form-label d-flex align-items-center gap-2" 
                style={{ 
                  color: "#7c5ba4", 
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                <FaEnvelope /> Username or Email
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
                  placeholder="Enter your magical name"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
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
                  🌸
                </motion.div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label 
                  className="form-label mb-0 d-flex align-items-center gap-2" 
                  style={{ 
                    color: "#7c5ba4", 
                    fontWeight: "600",
                    fontSize: "14px"
                  }}
                >
                  <FaLock /> Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ 
                    color: "#a78bfa", 
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "600"
                  }}
                >
                  Forgot? 🌟
                </Link>
              </div>
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
                  placeholder="Enter secret spell"
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                  <span>Casting spell...</span>
                </>
              ) : (
                <>
                  <FaStar />
                  <span>Enter Wonderland</span>
                  <FaStar />
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
            New to our realm? 🧚‍♂️{" "}
            <Link
              to="/register"
              style={{ 
                color: "#9333ea", 
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Create Magic Account
            </Link>
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

export default Login;

// // src/pages/Login.tsx - REDESIGNED
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "./AuthProvider";
// import { motion } from "framer-motion";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// const Login: React.FC = () => {
//   const { login } = useAuth();
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await login(usernameOrEmail, password);
//     } catch (err: unknown) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const e: any = err;
//       const errorMsg =
//         e?.response?.data?.message ||
//         e?.message ||
//         "Login failed. Please check your credentials.";
//       setError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient position-relative overflow-hidden">
//       {/* Animated Background */}
//       <div
//         className="position-absolute w-100 h-100"
//         style={{
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           opacity: 0.9,
//         }}
//       />

//       {/* Floating Shapes */}
//       <motion.div
//         className="position-absolute rounded-circle"
//         style={{
//           width: 400,
//           height: 400,
//           background: "rgba(255,255,255,0.1)",
//           top: "-10%",
//           left: "-5%",
//         }}
//         animate={{ y: [0, 30, 0], rotate: [0, 90, 0] }}
//         transition={{ duration: 20, repeat: Infinity }}
//       />
//       <motion.div
//         className="position-absolute rounded-circle"
//         style={{
//           width: 300,
//           height: 300,
//           background: "rgba(255,255,255,0.08)",
//           bottom: "-10%",
//           right: "-5%",
//         }}
//         animate={{ y: [0, -40, 0], rotate: [0, -90, 0] }}
//         transition={{ duration: 15, repeat: Infinity }}
//       />

//       {/* Login Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
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
//         {/* Card Header */}
//         <div className="card-header border-0 bg-white text-center pt-5 pb-3">
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
//                     "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                   boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
//                 }}
//               >
//                 <svg width="40" height="40" fill="white" viewBox="0 0 16 16">
//                   <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
//                   <path
//                     fillRule="evenodd"
//                     d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </motion.div>

//           <h3 className="mb-2 fw-bold" style={{ color: "#2d3748" }}>
//             Welcome Back
//           </h3>
//           <p className="text-muted mb-0">Sign in to continue to AQM</p>
//         </div>

//         {/* Card Body */}
//         <div className="card-body p-4 pt-3">
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="alert alert-danger d-flex align-items-center mb-4"
//               style={{ borderRadius: 12 }}
//             >
//               <svg
//                 className="me-2"
//                 width="20"
//                 height="20"
//                 fill="currentColor"
//                 viewBox="0 0 16 16"
//               >
//                 <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
//               </svg>
//               <div className="small">{error}</div>
//             </motion.div>
//           )}

//           <form onSubmit={submit}>
//             {/* Username/Email Input */}
//             <div className="mb-3">
//               <label className="form-label small fw-semibold text-muted">
//                 Username or Email
//               </label>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text border-0 bg-light">
//                   <FaEnvelope className="text-muted" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control border-0 bg-light ps-2"
//                   placeholder="Enter username or email"
//                   value={usernameOrEmail}
//                   onChange={(e) => setUsernameOrEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                   style={{ fontSize: 15 }}
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <label className="form-label small fw-semibold text-muted mb-0">
//                   Password
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-decoration-none small"
//                   style={{ color: "#667eea" }}
//                 >
//                   Forgot?
//                 </Link>
//               </div>
//               <div
//                 className="input-group"
//                 style={{ borderRadius: 12, overflow: "hidden" }}
//               >
//                 <span className="input-group-text border-0 bg-light">
//                   <FaLock className="text-muted" />
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="form-control border-0 bg-light ps-2"
//                   placeholder="Enter password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={loading}
//                   style={{ fontSize: 15 }}
//                 />
//                 <button
//                   className="btn border-0 bg-light"
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={loading}
//                 >
//                   {showPassword ? (
//                     <FaEyeSlash className="text-muted" />
//                   ) : (
//                     <FaEye className="text-muted" />
//                   )}
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
//                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                 borderRadius: 12,
//                 fontSize: 16,
//               }}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </motion.button>
//           </form>
//         </div>

//         {/* Card Footer */}
//         <div className="card-footer border-0 bg-light text-center py-4">
//           <p className="mb-0 text-muted small">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="text-decoration-none fw-semibold"
//               style={{ color: "#667eea" }}
//             >
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;