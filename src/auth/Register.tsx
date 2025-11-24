// src/auth/Register.tsx (FAIRY TALE WONDERLAND EDITION)
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";

const Register = () => {
  // Mock register function (replace with your actual auth logic)
  
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