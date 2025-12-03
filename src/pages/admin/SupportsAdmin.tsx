import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaReply,
  FaTrash} from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// ❄️ Snow animation
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.put(`/admin/support/${id}`, { status });
      toast.success("Status updated!");
      await loadTickets();
      await loadStats();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to update status");
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
        {[...Array(22)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.25} />
        ))}

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#FFD700",
                textShadow: "0 0 10px rgba(255,215,0,0.4)",
              }}
            >
              💬 Support Ticket Workshop 🎁
            </h2>
            <p className="text-light text-opacity-75">
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
                  className="card border-0 shadow-sm"
                  style={{
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 48,
                        height: 48,
                        background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                        fontSize: "24px",
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="fw-semibold text-warning">{stat.label}</div>
                      <div className="h4 mb-0 text-light">{stat.value}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="mb-4 d-flex gap-2">
            {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map((filter) => (
              <button
                key={filter}
                className={`btn ${statusFilter === filter ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Tickets Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(4px)",
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
                    <th className="border-0 py-3 px-4">ID</th>
                    <th className="border-0 py-3">User</th>
                    <th className="border-0 py-3">Subject</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Date</th>
                    <th className="border-0 py-3 text-end px-4">Actions</th>
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
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => {
                      const config = getStatusConfig(ticket.status);
                      return (
                        <motion.tr
                          key={ticket.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{
                            backgroundColor: "rgba(255,255,255,0.12)",
                          }}
                        >
                          <td className="px-4 fw-bold">{ticket.id}</td>
                          <td className="fw-bold">
                            <div>{ticket.username}</div>
                            <div className="small text-muted">{ticket.email}</div>
                          </td>
                          <td className="fw-bold">{ticket.subject}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: config.bg,
                                color: config.color,
                                border: `2px solid ${config.color}`,
                              }}
                            >
                              {config.label}
                            </span>
                          </td>
                          <td className="fw-bold">
                            {new Date(ticket.submittedAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="text-end px-4">
                            <button
                              className="btn btn-sm btn-outline-info me-2"
                              onClick={() => setReplyModal({ show: true, ticket })}
                            >
                              <FaReply /> Reply
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(ticket.id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal.show && replyModal.ticket && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setReplyModal({ show: false, ticket: null })}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{ background: "#1a2332", color: "white" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Reply to Ticket #{replyModal.ticket.id}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setReplyModal({ show: false, ticket: null })}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>User:</strong> {replyModal.ticket.username}
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {replyModal.ticket.subject}
                </div>
                <div className="mb-3">
                  <strong>Message:</strong>
                  <p className="mt-2">{replyModal.ticket.message}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label">Your Reply</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: 120 }}
                    placeholder="Enter your response..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setReplyModal({ show: false, ticket: null })}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleReply}
                  disabled={!reply.trim() || loading}
                >
                  {loading ? "Sending..." : "Send Reply 🎁"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}