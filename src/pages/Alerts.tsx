// src/pages/Alerts.tsx - REAL-TIME EDITION 🔔
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaSnowflake, FaSync } from "react-icons/fa";
import { useRealtimeAlerts } from "../hooks/useRealtimeAlerts";

// Import Alert type from hook
import type { Alert } from "../hooks/useRealtimeAlerts";
import api from "../api/axios";
import { toast } from "react-toastify";

// Christmas Alert Card Component
const ChristmasAlertCard = ({
  alert,
  onMarkAsRead,
}: {
  alert: Alert;
  onMarkAsRead: (id: number) => void;
}) => {
  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return ts;
    }
  };

  const getSeverity = () => {
    if (alert.pollutant === "PM2.5" && alert.value > 55)
      return {
        level: "danger",
        color: "#C41E3A",
        emoji: "🦌",
        bg: "rgba(196, 30, 58, 0.1)",
      };
    if (alert.pollutant === "PM10" && alert.value > 150)
      return {
        level: "danger",
        color: "#C41E3A",
        emoji: "🦌",
        bg: "rgba(196, 30, 58, 0.1)",
      };
    if (alert.pollutant === "AQI" && alert.value > 150)
      return {
        level: "danger",
        color: "#C41E3A",
        emoji: "⛄",
        bg: "rgba(196, 30, 58, 0.1)",
      };
    return {
      level: "warning",
      color: "#FFD700",
      emoji: "🧝",
      bg: "rgba(255, 215, 0, 0.1)",
    };
  };

  const severity = getSeverity();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 12px 32px rgba(196, 30, 58, 0.3)",
      }}
      className="card mb-3 position-relative overflow-hidden"
      style={{
        opacity: alert.isRead ? 0.7 : 1,
        border: `3px solid ${alert.isRead ? "#ddd" : severity.color}`,
        borderRadius: 20,
        background: alert.isRead ? "#f8f9fa" : severity.bg,
        transition: "all 0.3s",
      }}
    >
      <div
        className="position-absolute"
        style={{ top: -20, right: -20, fontSize: "80px", opacity: 0.1 }}
      >
        🎄
      </div>

      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              background: `linear-gradient(135deg, ${severity.color}, ${severity.color}dd)`,
              fontSize: "32px",
              border: "3px solid #FFD700",
            }}
          >
            {severity.emoji}
          </motion.div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="mb-1 fw-bold" style={{ color: severity.color }}>
                  🔔 {alert.pollutant} Alert
                  {!alert.isRead && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="badge ms-2"
                      style={{
                        background: "linear-gradient(135deg, #C41E3A, #165B33)",
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: 12,
                      }}
                    >
                      🎁 NEW
                    </motion.span>
                  )}
                </h5>
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaSnowflake size={12} style={{ color: "#87CEEB" }} />
                  <span>📍 {alert.locationName || "Unknown"}</span>
                  <span>•</span>
                  <span>🕐 {formatTime(alert.triggeredAt)}</span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                className="p-3 rounded-3"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: `2px solid ${severity.color}`,
                }}
              >
                <div className="small text-muted mb-1">Current Value</div>
                <div
                  className="h4 mb-0 fw-bold"
                  style={{ color: severity.color }}
                >
                  {alert.value.toFixed(1)}{" "}
                  {alert.pollutant === "AQI" ? "" : "µg/m³"}
                </div>
              </div>

              <div className="flex-grow-1">
                <div className="small text-muted mb-2">Severity Level</div>
                <div
                  className="progress"
                  style={{
                    height: 10,
                    borderRadius: 10,
                    background: "#e9ecef",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((alert.value / 200) * 100, 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="progress-bar"
                    style={{
                      background: `linear-gradient(90deg, ${severity.color}, #FFD700)`,
                      borderRadius: 10,
                    }}
                  />
                </div>
              </div>
            </div>

            {!alert.isRead && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm d-inline-flex align-items-center gap-2"
                onClick={() => onMarkAsRead(alert.id)}
                style={{
                  background: "linear-gradient(135deg, #165B33, #50C878)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(22, 91, 51, 0.3)",
                }}
              >
                <FaCheckCircle />
                Mark as Read
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ChristmasAlerts() {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  // ✅ USE REAL-TIME HOOK
  const {
    alerts,
    unreadCount,
    loading,
    error,
    markAsRead,
    handleMarkAllAsRead,
    triggerCheck,
  } = useRealtimeAlerts(true, 30000); // Auto-refresh every 30s

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.isRead;
    if (filter === "read") return alert.isRead;
    return true;
  });

  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: -20,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 1,
      }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      ❄️
    </motion.div>
  );

  const handleMarkAllReadFixed = async () => {
    if (unreadCount === 0) return;

    try {
      await handleMarkAllAsRead();

      // Wait and reload
      setTimeout(async () => {
        await fetchAlerts();
        console.log("✅ Alerts reloaded after mark all read");
      }, 1500);
    } catch (error) {
      console.error("Mark all error:", error);
    }
  };

  const handleAISummary = async () => {
    if (alerts.length === 0) {
      toast.warning("Không có cảnh báo để tóm tắt");
      return;
    }

    setAiLoading(true);

    try {
      console.log("🤖 Calling AI Summary API...");

      const payload = {
        alerts: alerts.slice(0, 10).map((alert) => ({
          id: alert.id,
          pollutant: alert.pollutant || "Unknown",
          value: alert.value || 0,
          locationName: alert.locationName || "Unknown",
          triggeredAt: alert.triggeredAt || new Date().toISOString(),
          isRead: alert.isRead || false,
        })),
        timePeriod: "gần đây",
      };

      const response = await api.post("/ai/summarize-alerts", payload);

      console.log("✅ AI Response received:", response.data);

      // ✅ FIX: Check response structure properly
      if (response.data) {
        // Build full summary from all fields
        const fullSummary = `
${response.data.summary || ""}

📊 **Xu hướng:**
${response.data.trend || "Không có dữ liệu"}

🔍 **Phát hiện chính:**
${response.data.keyFindings || "Không có dữ liệu"}

💡 **Khuyến nghị:**
${response.data.recommendations || "Không có dữ liệu"}
      `.trim();

        setAiSummary(fullSummary);
        setShowAiModal(true); // ✅ Show modal

        console.log("✅ Modal should show now");
        toast.success("✅ Claude đã phân tích xong!");
      } else {
        console.error("❌ Invalid response structure");
        toast.error("❌ Phản hồi không hợp lệ");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ AI Error:", error);
      toast.error(`❌ Lỗi: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const AISummaryButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn d-flex align-items-center gap-2"
      onClick={handleAISummary}
      disabled={aiLoading || alerts.length === 0}
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        border: "none",
        borderRadius: 12,
        padding: "12px 24px",
        fontWeight: "bold",
        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
      }}
    >
      {aiLoading ? (
        <>
          <div className="spinner-border spinner-border-sm" />
          Claude đang tóm tắt...
        </>
      ) : (
        <>🧠 Claude Tóm tắt</>
      )}
    </motion.button>
  );

  const AISummaryModal = () => {
    console.log("🎨 AISummaryModal render:", {
      showAiModal,
      aiSummary: !!aiSummary,
    });

    return (
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              zIndex: 9999,
              backdropFilter: "blur(5px)",
            }}
            onClick={() => {
              console.log("🚪 Closing modal");
              setShowAiModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="card border-0 shadow-lg"
              style={{
                maxWidth: "700px",
                width: "90%",
                borderRadius: 24,
                border: "3px solid #667eea",
              }}
              onClick={(e) => {
                console.log("🛑 Stop propagation");
                e.stopPropagation();
              }}
            >
              {/* Header */}
              <div
                className="p-3 text-white d-flex align-items-center justify-content-between"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  borderRadius: "21px 21px 0 0",
                }}
              >
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  🧠 Claude Tóm tắt cảnh báo
                </h5>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => setShowAiModal(false)}
                  style={{ borderRadius: 8 }}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div
                className="card-body p-4"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {/* Stats */}
                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: "rgba(102, 126, 234, 0.1)",
                    border: "2px solid rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span
                      className="badge"
                      style={{
                        background: "#667eea",
                        color: "white",
                        padding: "6px 12px",
                      }}
                    >
                      📊 Tổng số: {alerts.length} cảnh báo
                    </span>
                    <span
                      className="badge"
                      style={{
                        background: "#764ba2",
                        color: "white",
                        padding: "6px 12px",
                      }}
                    >
                      🔔 Chưa đọc: {unreadCount}
                    </span>
                  </div>
                </div>

                {/* AI Summary Content */}
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                    color: "#475569",
                  }}
                >
                  {aiSummary || "Đang tải..."}
                </div>

                {/* Disclaimer */}
                <div
                  className="mt-4 p-3 rounded-3"
                  style={{
                    background: "rgba(255, 215, 0, 0.1)",
                    border: "2px dashed #FFD700",
                  }}
                >
                  <div className="small text-muted">
                    💡 <strong>Lưu ý:</strong> Đây là tóm tắt từ Claude AI để hỗ
                    trợ hiểu biết. Vui lòng kiểm tra chi tiết từng cảnh báo.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[...Array(15)].map((_, i) => (
        <Snowflake key={i} delay={i * 0.5} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 50,
                height: 50,
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
                color: "white",
                border: "3px solid #FFD700",
                fontSize: "20px",
              }}
            >
              ←
            </motion.a>
            <div>
              <h2
                className="mb-1 fw-bold d-flex align-items-center gap-2"
                style={{ color: "#C41E3A" }}
              >
                🔔 Christmas Air Quality Alerts
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="badge rounded-pill"
                    style={{
                      background: "linear-gradient(135deg, #C41E3A, #165B33)",
                      color: "white",
                    }}
                  >
                    {unreadCount} 🎁
                  </motion.span>
                )}
              </h2>
              <p className="text-muted mb-0">
                🎅 Real-time monitoring - Updates every 30 seconds
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            {/* ✅ MANUAL CHECK BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn d-flex align-items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 24px",
                fontWeight: "bold",
              }}
              onClick={triggerCheck}
            >
              <FaSync />
              Check Now
            </motion.button>

            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #165B33, #50C878)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontWeight: "bold",
                }}
                onClick={handleMarkAllReadFixed}
              >
                <FaCheckCircle />
                Mark All Read 🎄
              </motion.button>
            )}
            <AISummaryButton />
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className="card border-0 shadow-lg"
          style={{ borderRadius: 16, border: "3px solid #FFD700" }}
        >
          <div className="card-body p-3">
            <div className="d-flex gap-2">
              {(["all", "unread", "read"] as const).map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn"
                  style={{
                    background:
                      filter === f
                        ? "linear-gradient(135deg, #C41E3A, #165B33)"
                        : "white",
                    color: filter === f ? "white" : "#165B33",
                    border: filter === f ? "none" : "2px solid #165B33",
                    borderRadius: 12,
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" && "🎄 All"}
                  {f === "unread" && `🎁 Unread (${unreadCount})`}
                  {f === "read" && `✅ Read (${alerts.length - unreadCount})`}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert"
          style={{
            background: "rgba(196, 30, 58, 0.1)",
            border: "2px solid #C41E3A",
            borderRadius: 16,
            color: "#C41E3A",
          }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {loading && (
        <div className="text-center py-5">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "4rem" }}
          >
            🎅
          </motion.div>
          <div
            style={{ color: "#C41E3A", fontSize: "1.2rem", fontWeight: "bold" }}
          >
            Santa is checking your alerts...
          </div>
        </div>
      )}

      {!loading && filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-lg text-center py-5"
          style={{ borderRadius: 24, border: "3px solid #FFD700" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "6rem" }}
          >
            {filter === "unread" ? "🎅" : "🔔"}
          </motion.div>
          <h5 className="mb-2" style={{ color: "#165B33", fontWeight: "bold" }}>
            {filter === "unread" ? "All caught up! 🎄" : "No alerts yet ⛄"}
          </h5>
          <p style={{ color: "#6c757d" }}>
            {filter === "unread"
              ? "You have no unread alerts. Great job staying informed!"
              : "You'll receive alerts when air quality exceeds your thresholds. 🎁"}
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {!loading &&
          filteredAlerts.map((alert) => (
            <ChristmasAlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={markAsRead}
            />
          ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-5 py-4"
      >
        <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>
          🎅 Stay Safe This Holiday Season! 🎄
        </h4>
        <p style={{ color: "#165B33" }}>
          Real-time monitoring • Auto-refresh every 30s ❄️⛄
        </p>
      </motion.div>
      <AISummaryModal />
    </div>
  );
}
function fetchAlerts() {
  throw new Error("Function not implemented.");
}
