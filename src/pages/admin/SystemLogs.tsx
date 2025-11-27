import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import AdminLayout from "../../layouts/AdminLayout";

type LogEntry = {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  user?: string;
};

export default function FrostbyteSecurityTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"ALL" | "INFO" | "WARNING" | "ERROR">("ALL");

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const res = await api.get("/admin/logs");
      setLogs(res.data || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to fetch logs");
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case "INFO": return "#38bdf8";
      case "WARNING": return "#fbbf24";
      case "ERROR": return "#f87171";
      default: return "#94a3b8";
    }
  };

  return (
    <AdminLayout>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="fw-bold text-light d-flex align-items-center gap-2">
          🛡️ Frostbyte Security Terminal
        </h2>
        <p className="text-light text-opacity-75" style={{ marginTop: -6 }}>
          Real-time activity feed from the North Pole CyberWatch Division.
        </p>
      </motion.div>

      {/* FILTER BAR */}
      <div className="d-flex gap-2 mb-3">
        {["ALL", "INFO", "WARNING", "ERROR"].map((lvl) => (
          <button
            key={lvl}
            className="btn btn-sm"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setFilter(lvl as any)}
            style={{
              borderRadius: 12,
              background: filter === lvl ? getColor(lvl) : "#1e293b",
              color: filter === lvl ? "#fff" : "#cbd5e1",
              border: "1px solid #334155",
              padding: "6px 16px",
              fontWeight: 600
            }}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* LOG LIST */}
      <div 
        className="p-3"
        style={{
          background: "rgba(15, 23, 42, 0.7)",
          borderRadius: 16,
          border: "1px solid #334155",
          maxHeight: "72vh",
          overflowY: "auto",
        }}
      >
        {logs
          .filter(l => filter === "ALL" || l.level === filter)
          .map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 mb-2"
              style={{
                borderRadius: 12,
                background: "rgba(30, 41, 59, 0.7)",
                borderLeft: `4px solid ${getColor(log.level)}`,
              }}
            >
              <div className="d-flex justify-content-between">
                <span style={{ color: getColor(log.level), fontWeight: 600 }}>
                  {log.level}
                </span>
                <span className="text-muted small">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="mt-1 text-light">
                {log.message}
              </div>

              {log.user && (
                <div className="small mt-1" style={{ color: "#94a3b8" }}>
                  👤 {log.user}
                </div>
              )}
            </motion.div>
        ))}
      </div>

    </AdminLayout>
  );
}
