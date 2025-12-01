// src/components/NotificationCenter.tsx
// Optional: Bell icon dropdown for quick alert view

import { useState, useEffect } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { toast } from "react-toastify";

type Alert = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string;
  triggeredAt: string;
  isRead: boolean;
};

export default function NotificationCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading] = useState(false);

  useEffect(() => {
    loadAlerts();
    // Poll every 30 seconds for new alerts
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await api.get("/alerts/unread");
      const data = Array.isArray(res.data) ? res.data : [];
      setAlerts(data.slice(0, 5)); // Show only latest 5
      setUnreadCount(data.length);
    } catch (err) {
      console.error("Failed to load alerts:", err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/alerts/${id}/read`);
      setAlerts(prev => prev.filter(a => a.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success("Alert marked as read");
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

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

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        className="position-relative p-2"
        style={{ border: "none", background: "transparent" }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaBell size={24} style={{ color: unreadCount > 0 ? "#C41E3A" : "#6c757d" }} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="position-absolute top-0 start-100 translate-middle"
              >
                <Badge
                  pill
                  bg="danger"
                  style={{
                    fontSize: "0.7rem",
                    padding: "4px 8px",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: "350px",
          maxHeight: "400px",
          overflowY: "auto",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <Dropdown.Header className="d-flex justify-content-between align-items-center">
          <strong>🔔 Notifications</strong>
          {unreadCount > 0 && (
            <Badge bg="danger" pill>
              {unreadCount}
            </Badge>
          )}
        </Dropdown.Header>
        <Dropdown.Divider />

        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary" />
          </div>
        ) : alerts.length === 0 ? (
          <Dropdown.ItemText className="text-center text-muted py-3">
            🎄 All caught up!
          </Dropdown.ItemText>
        ) : (
          alerts.map((alert) => (
            <Dropdown.Item
              key={alert.id}
              className="d-flex justify-content-between align-items-start p-3"
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div className="flex-grow-1">
                <div className="fw-semibold mb-1" style={{ color: "#C41E3A" }}>
                  {alert.pollutant} Alert
                </div>
                <div className="small text-muted mb-1">
                  📍 {alert.locationName}
                </div>
                <div className="small">
                  Value: <strong>{alert.value.toFixed(1)}</strong>
                </div>
                <div className="small text-muted">
                  {formatTime(alert.triggeredAt)}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-sm btn-outline-success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(alert.id);
                }}
              >
                ✓
              </motion.button>
            </Dropdown.Item>
          ))
        )}

        <Dropdown.Divider />
        <Dropdown.Item
          href="/alerts"
          className="text-center"
          style={{ color: "#165B33", fontWeight: "600" }}
        >
          View All Alerts →
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}