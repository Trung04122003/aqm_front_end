// src/pages/Support.tsx (ENHANCED - PHASE 4)
import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// Mock API
// const mockApi = {
//   get: async (url: string) => {
//     await new Promise(resolve => setTimeout(resolve, 600));

//     if (url === "/support/my") {
//       return {
//         data: [
//           {
//             id: 1,
//             subject: "Dashboard not loading data",
//             message: "The dashboard shows loading spinner but never displays data.",
//             status: "OPEN",
//             submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//             adminReply: null
//           },
//           {
//             id: 2,
//             subject: "Alert notifications not working",
//             message: "I set up alert thresholds but I'm not receiving any notifications.",
//             status: "IN_PROGRESS",
//             submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//             adminReply: "We're investigating this issue. Will update you soon."
//           },
//           {
//             id: 3,
//             subject: "How to export reports?",
//             message: "Is there a way to export air quality reports as PDF?",
//             status: "RESOLVED",
//             submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
//             adminReply: "Yes! Click the 'Download PDF' button in the Reports page after generating a report."
//           }
//         ]
//       };
//     }

//     return { data: [] };
//   },

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   post: async (_url: string, data: any) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return {
//       data: {
//         id: Date.now(),
//         ...data,
//         status: "OPEN",
//         submittedAt: new Date().toISOString(),
//         adminReply: null
//       }
//     };
//   }
// };

type Ticket = {
  id: number;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  submittedAt: string;
  adminReply: string | null;
};

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const config = { color: "#000", bg: "#fff", label: "Unknown", icon: "❓" };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card border-0 shadow-sm mb-3"
      style={{ borderRadius: 16, overflow: "hidden" }}
    >
      <div className="px-4 py-3" style={{ background: config.bg }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: "20px" }}>{config.icon}</span>
            <h6 className="mb-0 fw-bold" style={{ color: config.color }}>
              {ticket.subject}
            </h6>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge"
              style={{ background: config.color, fontSize: "0.75rem" }}
            >
              {config.label}
            </span>
            <span className="text-muted small">
              {formatTime(ticket.submittedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="mb-3">
          <div className="small text-muted mb-1">Your Message:</div>
          <p className="mb-0" style={{ color: "#475569" }}>
            {ticket.message}
          </p>
        </div>

        {ticket.adminReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-3"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      {/* Header with Back Button */}
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
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48, textDecoration: "none" }}
            >
              <span style={{ fontSize: "20px" }}>←</span>
            </motion.a>
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: "#1e293b" }}>
                💬 Support Center
              </h2>
              <p className="text-muted mb-0">
                Get help with your air quality monitoring system
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary d-flex align-items-center gap-2"
            style={{ borderRadius: 12 }}
            onClick={() => setShowForm(!showForm)}
          >
            <span>{showForm ? "❌" : "➕"}</span>
            <span>{showForm ? "Cancel" : "New Ticket"}</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "#eff6ff",
                    fontSize: "24px",
                  }}
                >
                  🆕
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#3b82f6" }}>
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
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "#fffbeb",
                    fontSize: "24px",
                  }}
                >
                  ⏳
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#f59e0b" }}>
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
              style={{ borderRadius: 16 }}
            >
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "#f0fdf4",
                    fontSize: "24px",
                  }}
                >
                  ✅
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold" style={{ color: "#10b981" }}>
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
            style={{ borderRadius: 16, overflow: "hidden" }}
          >
            <div
              className="p-3 text-white"
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              <h5 className="mb-0 fw-bold">📝 Submit New Ticket</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: 12 }}
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    style={{ borderRadius: 12, minHeight: 120 }}
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
                  style={{ borderRadius: 12 }}
                  disabled={submitting}
                >
                  {submitting ? "⏳ Submitting..." : "🚀 Submit Ticket"}
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
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="d-inline-block mb-3"
            style={{ fontSize: "3rem" }}
          >
            💬
          </motion.div>
          <div className="text-muted">Loading your tickets...</div>
        </div>
      )}

      {/* Tickets List */}
      {!loading && tickets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm text-center py-5"
          style={{ borderRadius: 20 }}
        >
          <div style={{ fontSize: "5rem" }} className="mb-3">
            💬
          </div>
          <h5 className="mb-2">No Support Tickets Yet</h5>
          <p className="text-muted mb-4">
            Click "New Ticket" to submit your first support request
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{ borderRadius: 12 }}
            onClick={() => setShowForm(true)}
          >
            ➕ Create First Ticket
          </motion.button>
        </motion.div>
      )}

      {!loading && tickets.length > 0 && (
        <div>
          <h5 className="mb-3 fw-semibold" style={{ color: "#475569" }}>
            Your Tickets ({tickets.length})
          </h5>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Help Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-0 shadow-sm mt-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-4">
          <h5 className="mb-3 fw-semibold">📚 Quick Help</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="d-flex gap-3">
                <span style={{ fontSize: "24px" }}>📖</span>
                <div>
                  <div className="fw-semibold mb-1">Documentation</div>
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
                  <div className="fw-semibold mb-1">FAQ</div>
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
                  <div className="fw-semibold mb-1">Email Support</div>
                  <p className="small text-muted mb-0">support@aqm.system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}