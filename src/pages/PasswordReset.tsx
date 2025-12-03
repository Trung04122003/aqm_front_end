import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";

export default function PasswordReset() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [validatingToken, setValidatingToken] = useState(false);
  const [message, setMessage] = useState("");

  // In real app, check URL params for token on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      validateToken(urlToken);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setValidatingToken(true);
    try {
      // Call API: POST /auth/validate-reset-token
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToValidate })
      });
      const data = await response.json();
      
      if (data.valid) {
        setToken(tokenToValidate);
        setEmail(data.email);
        setStep("reset");
        setMessage("Token validated! Enter your new password.");
      } else {
        setMessage(data.message || "Invalid or expired token");
        setStep("email");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Invalid token");
      setStep("email");
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call API: POST /auth/forgot-password
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setMessage("✨ Password reset email sent! Check your inbox.");
      setStep("reset");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Call API: POST /auth/reset-password
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      setMessage("✨ Password reset successful! Please login.");
      setTimeout(() => window.location.href = "/login", 2000);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Failed to reset password");
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

  if (validatingToken) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: "4rem" }}
        >
          🔮
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        fontFamily: "'Quicksand', 'Comic Sans MS', cursive"
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
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
          style={{
            position: "absolute",
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

      {/* Reset Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: 32,
          boxShadow: "0 20px 60px rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
            padding: "50px 32px 40px",
            borderBottom: "3px solid rgba(255, 255, 255, 0.8)"
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 20,
              right: 30,
              fontSize: "30px"
            }}
            animate={{
              rotate: [0, 15, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🔮
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 100,
                height: 100,
                background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                borderRadius: "50%",
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                border: "4px solid white"
              }}
            >
              <span style={{ fontSize: "50px" }}>🔑</span>
            </div>
          </motion.div>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "0.5rem",
              color: "#5a3d8a",
              fontWeight: "bold",
              fontSize: "32px",
              textShadow: "2px 2px 4px rgba(255, 255, 255, 0.5)"
            }}
          >
            {step === "email" ? "Reset Password" : "New Password"}
          </h2>
          <p style={{
            textAlign: "center",
            marginBottom: 0,
            color: "#7c5ba4",
            fontSize: "15px"
          }}>
            {step === "email" 
              ? "Enter your email to receive reset link ✨"
              : "Choose a strong new password 🌟"}
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: "40px 32px" }}>
          {message && (
            <div style={{
              padding: "12px",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #ffe5e5 0%, #ffd6d6 100%)",
              border: "2px solid #ffb3b3",
              borderRadius: 16,
              color: "#d63447",
              fontSize: "14px"
            }}>
              {message}
            </div>
          )}

          {step === "email" ? (
            <div onSubmit={handleSendEmail}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#7c5ba4",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  📧 Email Address
                </label>
                <input
                  type="email"
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                style={{
                  width: "100%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: loading
                    ? "linear-gradient(135deg, #ccc, #999)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "16px",
                  borderRadius: 16,
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
                }}
                onClick={handleSendEmail}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link ✨"}
              </motion.button>
            </div>
          ) : (
            <div onSubmit={handleResetPassword}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#7c5ba4",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <FaLock /> New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                      border: "2px solid #e0d4f7",
                      borderRadius: 16,
                      padding: "14px 50px 14px 20px",
                      fontSize: "15px",
                      color: "#5a3d8a"
                    }}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    style={{
                      position: "absolute",
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
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#7c5ba4",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <FaLock /> Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)",
                    border: "2px solid #e0d4f7",
                    borderRadius: 16,
                    padding: "14px 20px",
                    fontSize: "15px",
                    color: "#5a3d8a"
                  }}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                style={{
                  width: "100%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: loading
                    ? "linear-gradient(135deg, #ccc, #999)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "16px",
                  borderRadius: 16,
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
                }}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Resetting..." : <><FaStar /> Reset Password <FaStar /></>}
              </motion.button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 32px",
            background: "linear-gradient(135deg, #fef3e2 0%, #fce4ec 100%)",
            borderTop: "2px solid rgba(167, 139, 250, 0.2)"
          }}
        >
          <p style={{
            marginBottom: 0,
            color: "#7c5ba4",
            fontSize: "14px"
          }}>
            Remember your password? 🧚‍♂️{" "}
            <a
              href="/login"
              style={{
                color: "#9333ea",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Back to Login
            </a>
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes backgroundShift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}