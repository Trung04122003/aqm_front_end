// src/pages/admin/AlertsAdmin.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaSearch
} from "react-icons/fa";
import { Badge, Button } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// TYPES
type Alert = {
  id: number;
  user: { username: string };
  location: { name: string };
  pollutant: string;
  value: number;
  triggeredAt: string;
  isRead: boolean;
};

// ❄️ Snowflake effect
const Snowflake = ({ delay }: { delay: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${Math.random() * 100}%`,
      top: -20,
      fontSize: Math.random() * 14 + 10,
      opacity: 0.7,
      color: "#E6F7FF",
      pointerEvents: "none",
      zIndex: 1
    }}
    animate={{
      y: ["0vh", "110vh"],
      opacity: [0, 1, 1, 0],
      rotate: [0, 360]
    }}
    transition={{
      duration: 9 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    ❄️
  </motion.div>
);

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Thêm state error
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/alerts"); // Đổi thành /admin/alerts nếu BE dùng /api prefix
      // Force array: Nếu res.data không array, fallback []
      const data = Array.isArray(res.data) ? res.data : [];
      setAlerts(data);
      if (data.length === 0) {
        toast.info("No alerts available");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to load alerts";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this alert?")) return;

    try {
      await api.delete(`/admin/alerts/${id}`); // Đổi prefix nếu cần
      toast.success("Alert deleted");
      loadAlerts();
    } catch {
      toast.error("Failed to delete alert");
    }
  };

  // Use useMemo để optimize filtering
  const filteredAlerts = useMemo(() => {
    // Safe guard: Nếu alerts không array (dù khó xảy ra sau fix), return []
    if (!Array.isArray(alerts)) return [];

    return alerts
      .filter((a) => {
        if (filter === "read") return a.isRead;
        if (filter === "unread") return !a.isRead;
        return true;
      })
      .filter(
        (a) =>
          a.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.pollutant.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [alerts, filter, searchQuery]);

  // 🎄 Severity Icon
  const getSeverity = (value: number) => {
    if (value >= 150)
      return (
        <span>
          🔴 <span className="text-danger fw-bold">Critical</span>
        </span>
      );
    if (value >= 80)
      return (
        <span>
          🟠 <span className="text-warning fw-bold">Warning</span>
        </span>
      );
    return (
      <span>
        🌲 <span className="text-success fw-bold">Info</span>
      </span>
    );
  };

  return (
    <AdminLayout>
      <div
        className="min-vh-100 position-relative"
        style={{
          background: "linear-gradient(180deg, #0a1929 0%, #0f213b 100%)",
          padding: "1px"
        }}
      >
        {/* Snowfall */}
        {[...Array(20)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.3} />
        ))}

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h2
              className="fw-bold mb-1"
              style={{
                color: "#FFD700",
                textShadow: "0 0 12px rgba(255,215,0,0.4)"
              }}
            >
              🚨 Naughty Air Quality List 📋
            </h2>
            <p className="text-light text-opacity-75">
              Monitoring violations of North Pole Atmospheric Protocols
            </p>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(6px)"
            }}
          >
            <div className="card-body p-3">
              <div className="row g-3 align-items-center">
                <div className="col-12 col-md-6">
                  <div
                    className="input-group"
                    style={{ borderRadius: 12, overflow: "hidden" }}
                  >
                    <span className="input-group-text bg-dark border-0">
                      <FaSearch className="text-light" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-0"
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 d-flex justify-content-end gap-2">
                  <Button
                    variant={filter === "all" ? "warning" : "outline-light"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "unread" ? "danger" : "outline-light"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === "read" ? "success" : "outline-light"}
                    size="sm"
                    onClick={() => setFilter("read")}
                  >
                    Read
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hiển thị error nếu có */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert alert-danger mb-4"
            >
              ⚠️ {error} <Button variant="link" onClick={loadAlerts}>Retry</Button>
            </motion.div>
          )}

          {/* Alerts Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(4px)",
              overflow: "hidden"
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0 text-light">
                <thead
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#E6F7FF"
                  }}
                >
                  <tr>
                    <th className="border-0 py-3 px-4">ID</th>
                    <th className="border-0 py-3">User</th>
                    <th className="border-0 py-3">Location</th>
                    <th className="border-0 py-3">Pollutant</th>
                    <th className="border-0 py-3">Value</th>
                    <th className="border-0 py-3">Severity</th>
                    <th className="border-0 py-3">Triggered</th>
                    <th className="border-0 py-3 text-end px-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-5">
                        <div className="spinner-border text-warning" />
                      </td>
                    </tr>
                  ) : filteredAlerts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-5 text-light opacity-75"
                      >
                        No alerts found
                      </td>
                    </tr>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <motion.tr
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{
                          backgroundColor: "rgba(255,255,255,0.12)"
                        }}
                      >
                        <td className="px-4">{alert.id}</td>
                        <td className="fw-semibold">{alert.user.username}</td>
                        <td>{alert.location.name}</td>
                        <td>
                          <Badge bg="warning">{alert.pollutant}</Badge>
                        </td>
                        <td className="fw-semibold">
                          {alert.value.toFixed(1)}
                        </td>

                        <td>{getSeverity(alert.value)}</td>

                        <td className="text-light opacity-75">
                          {new Date(alert.triggeredAt).toLocaleString("vi-VN")}
                        </td>

                        <td className="text-end px-4">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(alert.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}