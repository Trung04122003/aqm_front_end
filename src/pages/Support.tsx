// src/pages/Support.tsx - CHRISTMAS 2025 EDITION 🎁

import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaSnowflake } from "react-icons/fa";

type Ticket = {
  id: number;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  submittedAt: string;
  adminReply: string | null;
};

// Christmas Ticket Card Component
const ChristmasTicketCard = ({ ticket }: { ticket: Ticket }) => {
  const [, setAiSuggestedReply] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTicketForAI, setSelectedTicketForAI] = useState<number | null>(null);
  const [, setShowAiModal] = useState(false);
  const getConfig = () => {
    switch (ticket.status) {
      case "OPEN":
        return { color: "#C41E3A", bg: "rgba(196, 30, 58, 0.1)", label: "Open 🎁", icon: "🎅" };
      case "IN_PROGRESS":
        return { color: "#FFD700", bg: "rgba(255, 215, 0, 0.1)", label: "In Progress ⛄", icon: "🦌" };
      case "RESOLVED":
        return { color: "#165B33", bg: "rgba(22, 91, 51, 0.1)", label: "Resolved 🎄", icon: "✅" };
      default:
        return { color: "#000", bg: "#fff", label: "Unknown ❓", icon: "❓" };
    }
  };

  const config = getConfig();

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAISuggestReply = async (ticket: any) => {
  setAiLoading(true);
  setSelectedTicketForAI(ticket.id);
  
  try {
    console.log("🤖 Requesting AI suggestion for ticket:", ticket.id);
    
    const response = await api.post("/ai/support-faqs", {
      ticketId: ticket.id,
      userMessage: ticket.message,
      subject: ticket.subject,
      userName: ticket.user?.username || "User",
      previousReplies: ticket.adminReply || "",
    });

    console.log("✅ AI Response:", response.data);

    if (response.data && response.data.success) {
      setAiSuggestedReply(response.data.suggestedReply);
      setShowAiModal(true);
      toast.success("✅ Claude đã tạo câu trả lời gợi ý!");
    } else {
      toast.error("❌ Claude không thể tạo gợi ý");
    }
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ AI Error:", error);
    toast.error(`❌ Lỗi: ${error.message}`);
  } finally {
    setAiLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01, boxShadow: "0 12px 32px rgba(196, 30, 58, 0.3)" }}
      className="card mb-3 position-relative overflow-hidden"
      style={{
        border: `3px solid ${config.color}`,
        borderRadius: 20,
        background: config.bg,
        transition: "all 0.3s"
      }}
    >
      {/* Christmas Ornament Background */}
      <div className="position-absolute" style={{ top: -20, right: -20, fontSize: "80px", opacity: 0.1 }}>
        🎄
      </div>

      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 60,
              height: 60,
              background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
              fontSize: "32px",
              border: "3px solid #FFD700"
            }}
          >
            {config.icon}
          </motion.div>

          {/* Content */}
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h5 className="mb-1 fw-bold" style={{ color: config.color }}>
                  {ticket.subject}
                </h5>
                <div className="text-muted small d-flex align-items-center gap-2">
                  <FaSnowflake size={12} style={{ color: "#87CEEB" }} />
                  <span>🕒 {formatTime(ticket.submittedAt)}</span>
                </div>
              </div>
              <motion.span
                className="badge"
                style={{ 
                  background: "linear-gradient(135deg, #C41E3A, #165B33)", 
                  color: "white",
                  fontSize: "0.8rem",
                  padding: "6px 12px",
                  borderRadius: 12
                }}
              >
                {config.label}
              </motion.span>
            </div>

            {/* Message */}
            <div className="mb-3">
              <div className="small text-muted mb-1">Your Message:</div>
              <p className="mb-0" style={{ color: "#475569" }}>
                {ticket.message}
              </p>
            </div>

            {/* Admin Reply */}
            {ticket.adminReply && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-3"
                style={{ 
                  background: "rgba(255, 255, 255, 0.8)", 
                  border: `2px solid ${config.color}`
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: "18px" }}>👨‍💼</span>
                  <span className="small fw-semibold text-muted">
                    Admin Response:
                  </span>
                </div>
                <p className="mb-0 small" style={{ color: "#475569" }}>
                  {ticket.adminReply}
                </p>
              </motion.div>
            )}
            {!ticket.adminReply && ticket.status !== "RESOLVED" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-sm d-inline-flex align-items-center gap-2 mt-2"
                onClick={() => handleAISuggestReply(ticket)}
                disabled={aiLoading && selectedTicketForAI === ticket.id}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontWeight: "600",
                }}
              >
                {aiLoading && selectedTicketForAI === ticket.id ? (
                  <>
                    <div className="spinner-border spinner-border-sm" />
                    Claude đang suy nghĩ...
                  </>
                ) : (
                  <>
                    🧠 Claude gợi ý trả lời
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [aiSuggestedReply] = useState<string>("");
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);
  const [selectedTicketForAI] = useState<number | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/support/my");
      setTickets(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };  

const handleUseAISuggestion = () => {
  if (!selectedTicketForAI) return;
  
  // Find the ticket and update its reply
  const ticket = tickets.find(t => t.id === selectedTicketForAI);
  if (ticket) {
    // If you have a form, set the reply field
    // For now, we'll just copy to clipboard
    navigator.clipboard.writeText(aiSuggestedReply);
    toast.success("✅ Đã copy câu trả lời vào clipboard!");
  }
  
  setShowAiModal(false);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/support", { subject, message });
      setTickets((prev) => [res.data, ...prev]);
      setSubject("");
      setMessage("");
      setShowForm(false);
      toast.success("Ticket submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  // Snowflake component
  const Snowflake = ({ delay }: { delay: number }) => (
    <motion.div
      className="position-absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: -20,
        fontSize: "20px",
        pointerEvents: "none",
        zIndex: 1
      }}
      animate={{
        y: ["0vh", "110vh"],
        rotate: [0, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      ❄️
    </motion.div>
  );

  const AISuggestionModal = () => (
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
        onClick={() => setShowAiModal(false)}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="card border-0 shadow-lg"
          style={{
            maxWidth: "800px",
            width: "90%",
            borderRadius: 24,
            border: "3px solid #667eea",
          }}
          onClick={(e) => e.stopPropagation()}
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
              🧠 Claude AI - Câu trả lời gợi ý
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
          <div className="card-body p-4" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Warning Banner */}
            <div
              className="p-3 rounded-3 mb-3"
              style={{
                background: "rgba(255, 165, 0, 0.1)",
                border: "2px solid rgba(255, 165, 0, 0.3)",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "24px" }}>⚠️</span>
                <div>
                  <div className="fw-bold mb-1" style={{ color: "#ff8c00" }}>
                    Đây là câu trả lời GỢI Ý từ AI
                  </div>
                  <div className="small text-muted">
                    Vui lòng xem xét và chỉnh sửa trước khi gửi cho người dùng
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggested Reply */}
            <div
              className="p-4 rounded-3 mb-3"
              style={{
                background: "rgba(102, 126, 234, 0.05)",
                border: "2px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <div className="small text-muted mb-2">📝 Nội dung gợi ý:</div>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  color: "#475569",
                }}
              >
                {aiSuggestedReply}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn flex-grow-1"
                onClick={handleUseAISuggestion}
                style={{
                  background: "linear-gradient(135deg, #165B33, #50C878)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px",
                  fontWeight: "bold",
                }}
              >
                📋 Copy câu trả lời
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn"
                onClick={() => setShowAiModal(false)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 24px",
                  fontWeight: "bold",
                }}
              >
                Đóng
              </motion.button>
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
                💡 <strong>Lưu ý:</strong> Claude AI chỉ gợi ý câu trả lời dựa trên nội dung ticket. 
                Admin cần kiểm tra và điều chỉnh cho phù hợp với chính sách hỗ trợ của hệ thống.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 50%, #FFFAFA 100%)", padding: "2rem", position: "relative", overflow: "hidden" }}>
      {/* Floating Snowflakes */}
      {[...Array(15)].map((_, i) => (
        <Snowflake key={i} delay={i * 0.5} />
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-3">
            <motion.a
              href="/"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: 50, 
                height: 50, 
                textDecoration: "none",
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
                color: "white",
                border: "3px solid #FFD700",
                fontSize: "20px"
              }}
            >
              ←
            </motion.a>
            <div>
              <h2 className="mb-1 fw-bold d-flex align-items-center gap-2" style={{ color: "#C41E3A" }}>
                💬 Christmas Support Center
              </h2>
              <p className="text-muted mb-0">
                🎅 Get holiday help with your air quality monitoring system!
              </p>
            </div>
          </div>

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
              boxShadow: "0 4px 16px rgba(22, 91, 51, 0.3)"
            }}
            onClick={() => setShowForm(!showForm)}
          >
            <span>{showForm ? "❌" : "➕"}</span>
            <span>{showForm ? "Cancel" : "New Ticket 🎁"}</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: 16, border: "3px solid #FFD700" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #C41E3A, #165B33)",
                    fontSize: "24px",
                    color: "white"
                  }}
                >
                  🎁
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#C41E3A" }}>
                    {openCount}
                  </div>
                  <div className="small text-muted">Open Tickets</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: 16, border: "3px solid #FFD700" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    fontSize: "24px",
                    color: "#165B33"
                  }}
                >
                  ⛄
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#FFD700" }}>
                    {inProgressCount}
                  </div>
                  <div className="small text-muted">In Progress</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: 16, border: "3px solid #FFD700" }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #165B33, #50C878)",
                    fontSize: "24px",
                    color: "white"
                  }}
                >
                  🎄
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#165B33" }}>
                    {resolvedCount}
                  </div>
                  <div className="small text-muted">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Ticket Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 16, overflow: "hidden", border: "3px solid #FFD700" }}
          >
            <div
              className="p-3 text-white"
              style={{
                background: "linear-gradient(135deg, #C41E3A, #165B33)",
              }}
            >
              <h5 className="mb-0 fw-bold">📝 Submit New Holiday Ticket 🎅</h5>
            </div>
            <div className="card-body p-4" style={{ background: "white" }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#C41E3A" }}>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: 12, border: "2px solid #165B33" }}
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: "#C41E3A" }}>Message</label>
                  <textarea
                    className="form-control"
                    style={{ borderRadius: 12, minHeight: 120, border: "2px solid #165B33" }}
                    placeholder="Provide detailed information about your issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary"
                  style={{ 
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #C41E3A, #165B33)",
                    border: "none",
                    color: "white"
                  }}
                  disabled={submitting}
                >
                  {submitting ? "⏳ Submitting..." : "🚀 Submit Ticket 🎁"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="d-inline-block mb-3"
            style={{ fontSize: "4rem" }}
          >
            🎅
          </motion.div>
          <div style={{ color: "#C41E3A", fontSize: "1.2rem", fontWeight: "bold" }}>
            Santa is checking your tickets...
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && tickets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm text-center py-5"
          style={{ borderRadius: 20, border: "3px solid #FFD700", background: "white" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "6rem" }}
            className="mb-3"
          >
            💬
          </motion.div>
          <h5 className="mb-2" style={{ color: "#165B33", fontWeight: "bold" }}>
            No Support Tickets Yet 🎄
          </h5>
          <p className="text-muted mb-4">
            Click "New Ticket" to submit your first holiday request
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{ 
              borderRadius: 12,
              background: "linear-gradient(135deg, #C41E3A, #165B33)",
              border: "none",
              color: "white"
            }}
            onClick={() => setShowForm(true)}
          >
            ➕ Create First Ticket 🎁
          </motion.button>
        </motion.div>
      )}

      {/* Tickets List */}
      {!loading && tickets.length > 0 && (
        <div>
          <h5 className="mb-3 fw-semibold d-flex align-items-center gap-2" style={{ color: "#C41E3A" }}>
            Your Holiday Tickets ({tickets.length}) 🎅
          </h5>
          {tickets.map((ticket) => (
            <ChristmasTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Help Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-0 shadow-sm mt-4"
        style={{ borderRadius: 16, border: "3px solid #FFD700", background: "white" }}
      >
        <div className="card-body p-4">
          <h5 className="mb-3 fw-semibold" style={{ color: "#C41E3A" }}>📚 Quick Holiday Help 🎄</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="d-flex gap-3">
                <span style={{ fontSize: "24px" }}>📖</span>
                <div>
                  <div className="fw-semibold mb-1" style={{ color: "#165B33" }}>Documentation</div>
                  <p className="small text-muted mb-0">
                    Learn how to use all features
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-3">
                <span style={{ fontSize: "24px" }}>❓</span>
                <div>
                  <div className="fw-semibold mb-1" style={{ color: "#165B33" }}>FAQ</div>
                  <p className="small text-muted mb-0">
                    Common questions answered
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-3">
                <span style={{ fontSize: "24px" }}>📧</span>
                <div>
                  <div className="fw-semibold mb-1" style={{ color: "#165B33" }}>Email Support</div>
                  <p className="small text-muted mb-0">support@aqm.system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Christmas Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-5 py-4"
      >
        <h4 style={{ color: "#C41E3A", fontWeight: "bold" }}>
          🎅 Merry Christmas Support! 🎄
        </h4>
        <p style={{ color: "#165B33" }}>
          May your issues be resolved as quickly as Santa delivers gifts! ❄️⛄
        </p>
      </motion.div>
      <AISuggestionModal />
    </div>
  );
}