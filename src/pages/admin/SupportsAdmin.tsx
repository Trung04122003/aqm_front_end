// src/pages/admin/SupportsAdmin.tsx - HELP DESK: NOEL GIFT DISTRIBUTION EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReply, FaTrash, FaMoon, FaSun, FaGift } from "react-icons/fa";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// ❄️ Enhanced Snowflake with varied sizes
const Snowflake = ({ delay, size = 18 }: { delay: number; size?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: `${size}px`,
      opacity: 0.8,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
    }}
    animate={{
      y: ["0vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 50 - 25],
    }}
    transition={{
      duration: 9 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

// 🎄 Christmas Particles (Gift-themed: Gifts, Kids, Elves)
const ChristmasParticle = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -30,
      fontSize: `${20 + Math.random() * 15}px`,
      opacity: 0.7,
      pointerEvents: "none",
      zIndex: 1,
      filter: "drop-shadow(0 0 5px rgba(255,215,0,0.6))",
    }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360, 720],
      opacity: [0, 1, 1, 0],
      x: [0, Math.random() * 100 - 50],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
  </motion.div>
);

// ✨ Sparkle effect for theme toggle
const Sparkle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    className="position-fixed"
    style={{
      left: x,
      top: y,
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "radial-gradient(circle, #FFD700, transparent)",
      pointerEvents: "none",
      zIndex: 9999,
    }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 3, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
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
  const [theme, setTheme] = useState<"dark" | "xmas">("xmas"); // Default to xmas
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [replyModal, setReplyModal] = useState<{ show: boolean; ticket: SupportTicket | null }>({
    show: false,
    ticket: null,
  });
  const [reply, setReply] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sparkles, setSparkles] = useState<Array<{ x: number; y: number; id: number }>>([]);

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
      toast.success(theme === "xmas" ? "🎁 Reply sent successfully!" : "Reply sent successfully!");
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
      toast.success(theme === "xmas" ? "🎁 Ticket deleted!" : "Ticket deleted!");
      await loadTickets();
      await loadStats();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  // Theme toggle with sparkle effect
  const handleThemeToggle = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create sparkles
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      id: Date.now() + i,
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);

    setTheme((prev) => (prev === "dark" ? "xmas" : "dark"));
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

  const backgroundStyle =
    theme === "dark"
      ? "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)"
      : "linear-gradient(180deg, #1a0f00 0%, #4b2600 100%)";

  const getCardColor = (base: string) =>
    theme === "dark" ? `${base}` : "#FFD700";

  const glow = theme === "xmas" ? "0 0 25px rgba(255,215,0,0.5)" : "0 0 15px rgba(103,232,249,0.2)";

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: backgroundStyle,
          padding: "1px",
          transition: "background 0.5s ease",
        }}
      >
        {/* Enhanced Snowfall */}
        {[...Array(35)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.2} size={12 + Math.random() * 12} />
        ))}

        {/* Christmas Particles (only in xmas mode) */}
        {theme === "xmas" && (
          <>
            {[...Array(8)].map((_, i) => (
              <ChristmasParticle
                key={`gift-${i}`}
                delay={i * 2}
                emoji={["🎁", "👦", "👧", "🎄", "🧒", "🎅", "👨‍👩‍👧", "🔔"][i % 8]}
              />
            ))}
          </>
        )}

        {/* Sparkle effects on theme toggle */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </AnimatePresence>

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          {/* Header with Enhanced Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          >
            <div>
              <motion.h2
                className="fw-bold mb-1"
                animate={{
                  textShadow:
                    theme === "xmas"
                      ? [
                          "0 0 18px rgba(255,215,0,0.4)",
                          "0 0 30px rgba(255,215,0,0.6)",
                          "0 0 18px rgba(255,215,0,0.4)",
                        ]
                      : [
                          "0 0 14px rgba(180,230,255,0.3)",
                          "0 0 20px rgba(180,230,255,0.5)",
                          "0 0 14px rgba(180,230,255,0.3)",
                        ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(90deg, #b3eaff, #e0f7ff)"
                      : "none",
                  WebkitBackgroundClip: theme === "dark" ? "text" : "unset",
                  WebkitTextFillColor:
                    theme === "dark" ? "transparent" : "inherit",
                  color: theme === "xmas" ? "#FFD700" : "#ffffff",
                }}
              >
                {theme === "xmas" ? "🎅 Santa's Help Desk: Gift Distribution Center 🎧" : "Help Desk 🎧"}
              </motion.h2>
              <p className="text-light text-opacity-75 mb-0">
                {theme === "xmas" ? "Delivering Joy and Solutions to Good Little Users ❄️" : "Help users resolve their holiday concerns"}
              </p>
            </div>

            {/* Enhanced Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn px-4 py-3 d-flex align-items-center gap-3"
              onClick={handleThemeToggle}
              style={{
                borderRadius: 50,
                background:
                  theme === "xmas"
                    ? "linear-gradient(135deg, #C41E3A, #8B0000)"
                    : "linear-gradient(135deg, #0ea5e9, #0369a1)",
                border: "none",
                boxShadow: glow,
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              <motion.div
                animate={{ rotate: theme === "xmas" ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {theme === "dark" ? <FaGift size={22} /> : <FaReply size={22} />}
              </motion.div>
              <span>{theme === "dark" ? "Gift Distribution Mode" : "Dark Mode"}</span>
              <motion.div
                animate={{ rotate: theme === "xmas" ? 0 : 360 }}
                transition={{ duration: 0.6 }}
              >
                {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: "Total Tickets", value: stats.total, color: "#FFD700", icon: "📬" },
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
                    border: `2px solid ${getCardColor(stat.color)}40`,
                    boxShadow: `0 0 20px ${getCardColor(stat.color)}30`,
                  }}
                >
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 56,
                        height: 56,
                        background: `${getCardColor(stat.color)}30`,
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
                      ? theme === "xmas" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #0ea5e9, #0369a1)"
                      : "rgba(255,255,255,0.1)",
                  border:
                    statusFilter === filter
                      ? "none"
                      : "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                  boxShadow:
                    statusFilter === filter
                      ? glow
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
                                background: theme === "xmas" ? "rgba(255,215,0,0.2)" : "rgba(103,232,249,0.2)",
                                color: theme === "xmas" ? "#FFD700" : "#67e8f9",
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
                                    theme === "xmas"
                                      ? "linear-gradient(135deg, #10b981, #059669)"
                                      : "linear-gradient(135deg, #0ea5e9, #0369a1)",
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
                                    theme === "xmas"
                                      ? "linear-gradient(135deg, #ef4444, #dc2626)"
                                      : "linear-gradient(135deg, #0ea5e9, #0369a1)",
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
                  border: theme === "xmas" ? "2px solid rgba(255,215,0,0.3)" : "2px solid rgba(103,232,249,0.3)",
                  borderRadius: 16,
                  boxShadow: glow,
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
                      theme === "xmas"
                        ? "repeating-linear-gradient(90deg, #C41E3A 0px, #C41E3A 15px, #fff 15px, #fff 30px)"
                        : "repeating-linear-gradient(90deg, #0ea5e9 0px, #0ea5e9 15px, #fff 15px, #fff 30px)",
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
                        border: theme === "xmas" ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(103,232,249,0.3)",
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
                      background: theme === "xmas" ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #0ea5e9, #0369a1)",
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