// src/pages/admin/SupportsAdmin.tsx - EXTRA FESTIVE EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReply, FaTrash } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// ❄️ Snowflake
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: Math.random() * 14 + 10,
      opacity: 0.75,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      opacity: [0, 1, 1, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 9 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

// 🎄 Christmas Particles
const ChristmasParticle = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -30,
      fontSize: "26px",
      opacity: 0.6,
      pointerEvents: "none",
      zIndex: 1,
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360, 720],
      opacity: [0, 0.8, 0.8, 0],
    }}
    transition={{
      duration: 20 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

type SupportTicket = {
  id: number;
  username: string;
  email: string;
  subject: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  adminReply: string | null;
  submittedAt: string;
};

export default function SupportsAdmin() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [replyModal, setReplyModal] = useState<{ show: boolean; ticket: SupportTicket | null }>({
    show: false,
    ticket: null,
  });
  const [reply, setReply] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    loadTickets();
    loadStats();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/support");
      setTickets(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load tickets:", err);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/support/count");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleReply = async () => {
    if (!replyModal.ticket || !reply.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/support/${replyModal.ticket.id}`, {
        status: "RESOLVED",
        adminReply: reply,
      });
      toast.success("🎁 Reply sent successfully!");
      setReplyModal({ show: false, ticket: null });
      setReply("");
      await loadTickets();
      await loadStats();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Reply failed:", err);
      toast.error(err?.response?.data || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ticket?")) return;

    try {
      await api.delete(`/admin/support/${id}`);
      toast.success("🎁 Ticket deleted!");
      await loadTickets();
      await loadStats();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "#C41E3A", bg: "rgba(196, 30, 58, 0.1)", label: "Pending 🎅", icon: "🎁" };
      case "IN_PROGRESS":
        return { color: "#FFD700", bg: "rgba(255, 215, 0, 0.1)", label: "In Progress ⛄", icon: "🦌" };
      case "RESOLVED":
        return { color: "#165B33", bg: "rgba(22, 91, 51, 0.1)", label: "Resolved 🎄", icon: "✅" };
      default:
        return { color: "#000", bg: "#fff", label: "Unknown", icon: "❓" };
    }
  };

  const filteredTickets = statusFilter === "ALL"
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: "linear-gradient(180deg,#0a1929 0%, #102540 100%)",
          padding: "1px",
        }}
      >
        {/* Snowfall */}
        {[...Array(30)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.25} />
        ))}

        {/* Christmas Particles */}
        {[...Array(6)].map((_, i) => (
          <ChristmasParticle
            key={`xmas-${i}`}
            delay={i * 3}
            emoji={["💬", "🎁", "⭐", "🎄", "🔔", "📮"][i]}
          />
        ))}

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <motion.h2
              className="fw-bold mb-1"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,215,0,0.4)",
                  "0 0 20px rgba(255,215,0,0.6)",
                  "0 0 10px rgba(255,215,0,0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: "#FFD700" }}
            >
              💬 Support Ticket Workshop 🎁
            </motion.h2>
            <p className="text-light text-opacity-75 mb-0">
              Help users resolve their holiday concerns
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total", value: stats.total, color: "#FFD700", icon: "📬" },
              { label: "Pending", value: stats.pending, color: "#C41E3A", icon: "🎅" },
              { label: "In Progress", value: stats.inProgress, color: "#FFD700", icon: "🦌" },
              { label: "Resolved", value: stats.resolved, color: "#165B33", icon: "🎄" },
            ].map((stat, i) => (
              <div className="col-md-3" key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="card border-0 shadow-sm"
                  style={{
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(6px)",
                    border: `2px solid ${stat.color}40`,
                    boxShadow: `0 0 20px ${stat.color}30`,
                  }}
                >
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: `${stat.color}30`,
                        fontSize: "28px",
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="fw-semibold text-warning small">
                        {stat.label}
                      </div>
                      <div className="h4 mb-0 text-light fw-bold">{stat.value}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 d-flex gap-2 flex-wrap"
          >
            {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn px-4 py-2"
                onClick={() => setStatusFilter(filter)}
                style={{
                  borderRadius: 12,
                  background:
                    statusFilter === filter
                      ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                      : "rgba(255,255,255,0.1)",
                  border:
                    statusFilter === filter
                      ? "none"
                      : "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                  boxShadow:
                    statusFilter === filter
                      ? "0 0 20px rgba(251,191,36,0.4)"
                      : "none",
                }}
              >
                {filter.replace("_", " ")}
              </motion.button>
            ))}
          </motion.div>

          {/* Tickets Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(4px)",
              overflow: "hidden",
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0 text-light">
                <thead
                  style={{
                    background: "rgba(255,255,255,0.14)",
                    color: "#FFFFFF",
                  }}
                >
                  <tr>
                    <th className="border-0 py-3 px-4 fw-semibold">ID</th>
                    <th className="border-0 py-3 fw-semibold">User</th>
                    <th className="border-0 py-3 fw-semibold">Subject</th>
                    <th className="border-0 py-3 fw-semibold">Status</th>
                    <th className="border-0 py-3 fw-semibold">Date</th>
                    <th className="border-0 py-3 text-end px-4 fw-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="spinner-border text-warning" />
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-light">
                        <div style={{ fontSize: "3rem" }}>🎄</div>
                        <div className="mt-2">No tickets found</div>
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket, index) => {
                      const config = getStatusConfig(ticket.status);
                      return (
                        <motion.tr
                          key={ticket.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                          }}
                        >
                          <td className="px-4 fw-bold">
                            <span
                              className="badge px-2 py-1"
                              style={{
                                background: "rgba(255,215,0,0.2)",
                                color: "#FFD700",
                              }}
                            >
                              #{ticket.id}
                            </span>
                          </td>
                          <td className="fw-bold">
                            <div className="d-flex flex-column">
                              <span>{ticket.username}</span>
                              <small className="text-muted opacity-75">
                                {ticket.email}
                              </small>
                            </div>
                          </td>
                          <td className="fw-bold">{ticket.subject}</td>
                          <td>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="d-inline-flex align-items-center gap-2 px-3 py-1"
                              style={{
                                background: config.bg,
                                color: config.color,
                                border: `2px solid ${config.color}`,
                                borderRadius: 10,
                                fontWeight: 600,
                              }}
                            >
                              <span>{config.icon}</span>
                              <span>{config.label}</span>
                            </motion.div>
                          </td>
                          <td className="fw-bold">
                            {new Date(ticket.submittedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="btn btn-sm"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #0ea5e9, #0369a1)",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 12px",
                                  color: "white",
                                }}
                                onClick={() =>
                                  setReplyModal({ show: true, ticket })
                                }
                              >
                                <FaReply /> Reply
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="btn btn-sm"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #ef4444, #dc2626)",
                                  border: "none",
                                  borderRadius: 8,
                                  padding: "6px 12px",
                                  color: "white",
                                }}
                                onClick={() => handleDelete(ticket.id)}
                              >
                                <FaTrash />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <small className="text-light opacity-50">
              🎅 {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""} · 
              Support Workshop Division ❄️
            </small>
          </motion.div>
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyModal.show && replyModal.ticket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setReplyModal({ show: false, ticket: null })}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  background: "rgba(26, 35, 50, 0.98)",
                  color: "white",
                  border: "2px solid rgba(14,165,233,0.3)",
                  borderRadius: 16,
                  boxShadow: "0 0 40px rgba(14,165,233,0.3)",
                }}
              >
                {/* Candy Cane Border */}
                <div
                  className="position-absolute top-0 start-0 w-100"
                  style={{
                    height: 6,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background:
                      "repeating-linear-gradient(90deg, #0ea5e9 0px, #0ea5e9 15px, #fff 15px, #fff 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title">
                    Reply to Ticket #{replyModal.ticket.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setReplyModal({ show: false, ticket: null })}
                  />
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <strong>User:</strong> {replyModal.ticket.username}
                  </div>
                  <div className="mb-3">
                    <strong>Subject:</strong> {replyModal.ticket.subject}
                  </div>
                  <div className="mb-3">
                    <strong>Message:</strong>
                    <p
                      className="mt-2 p-3"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {replyModal.ticket.message}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Reply</label>
                    <textarea
                      className="form-control"
                      style={{
                        minHeight: 150,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(14,165,233,0.3)",
                        borderRadius: 12,
                        color: "white",
                      }}
                      placeholder="Enter your response..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    onClick={() => setReplyModal({ show: false, ticket: null })}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    onClick={handleReply}
                    disabled={!reply.trim() || loading}
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {loading ? "Sending..." : "Send Reply 🎁"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}