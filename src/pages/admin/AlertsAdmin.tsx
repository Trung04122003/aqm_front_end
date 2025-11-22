// src/pages/admin/AlertsAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaSearch } from "react-icons/fa";
import { Badge, Button } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Alert = {
  id: number;
  user: { username: string };
  location: { name: string };
  pollutant: string;
  value: number;
  triggeredAt: string;
  isRead: boolean;
};

export default function AlertsAdmin() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this alert?")) return;
    
    try {
      await api.delete(`/admin/alerts/${id}`);
      toast.success("Alert deleted");
      loadAlerts();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to delete alert");
    }
  };

  const filteredAlerts = alerts
    .filter(a => {
      if (filter === "read") return a.isRead;
      if (filter === "unread") return !a.isRead;
      return true;
    })
    .filter(a => 
      a.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.pollutant.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="mb-1">Alert Management</h2>
        <p className="text-muted">Monitor and manage system alerts</p>
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant={filter === "all" ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "unread" ? "warning" : "outline-secondary"}
                  size="sm"
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </Button>
                <Button
                  variant={filter === "read" ? "success" : "outline-secondary"}
                  size="sm"
                  onClick={() => setFilter("read")}
                >
                  Read
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 px-4">ID</th>
                  <th className="border-0 py-3">User</th>
                  <th className="border-0 py-3">Location</th>
                  <th className="border-0 py-3">Pollutant</th>
                  <th className="border-0 py-3">Value</th>
                  <th className="border-0 py-3">Triggered At</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      No alerts found
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <motion.tr
                      key={alert.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <td className="px-4">{alert.id}</td>
                      <td className="fw-semibold">{alert.user.username}</td>
                      <td>{alert.location.name}</td>
                      <td>
                        <Badge bg="warning">{alert.pollutant}</Badge>
                      </td>
                      <td className="fw-semibold">{alert.value.toFixed(1)}</td>
                      <td className="text-muted">
                        {new Date(alert.triggeredAt).toLocaleString('vi-VN')}
                      </td>
                      <td>
                        <Badge bg={alert.isRead ? "success" : "danger"}>
                          {alert.isRead ? "Read" : "Unread"}
                        </Badge>
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
        </div>
      </motion.div>
    </AdminLayout>
  );
}