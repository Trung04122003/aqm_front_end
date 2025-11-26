import { useEffect, useState } from "react";

type LogEntry = {
  id: number;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR";
  message: string;
  user?: string;
};

export default function NorthPoleSecurityLogs() {
  const [, setLogs] = useState<LogEntry[]>([]);
  
  // Mock data - replace with: fetch("/api/admin/logs")
  useEffect(() => {
    setLogs([
      { id: 1, timestamp: new Date().toISOString(), level: "INFO", message: "System started", user: "santa_claus" },
      { id: 2, timestamp: new Date().toISOString(), level: "WARNING", message: "High PM2.5 detected", user: "rudolf_sensor" }
    ]);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #1a2332 100%)", padding: 32 }}>
      <h1 style={{ color: "#FFD700" }}>🛡️ NORTH POLE SECURITY LOGS</h1>
      {/* Add snowflakes, animated log entries with color-coded severity */}
    </div>
  );
}