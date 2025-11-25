// src/pages/Reports.tsx (ENHANCED - PHASE 4)
import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

type Location = { id: number; name: string };
type Report = {
  id?: number;
  locationId: number;
  locationName: string;
  fromDate: string;
  toDate: string;
  avgPm25: number;
  avgPm10: number;
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  goodDays: number; // ✅ NOW EXISTS IN BE
  moderateDays: number; // ✅ NOW EXISTS IN BE
  unhealthyDays: number; // ✅ NOW EXISTS IN BE
  totalDataPoints: number; // ✅ NOW EXISTS IN BE
  generatedAt?: string;
};

const StatCard = ({
  icon,
  label,
  value,
  color,
  suffix = "",
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
  suffix?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
    className="card border-0 shadow-sm h-100"
    style={{ borderRadius: 16 }}
  >
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 48,
            height: 48,
            background: `${color}15`,
            fontSize: "24px",
          }}
        >
          {icon}
        </div>
      </div>
      <div className="h3 fw-bold mb-1" style={{ color }}>
        {value}
        {suffix}
      </div>
      <div className="text-muted small">{label}</div>
    </div>
  </motion.div>
);

export default function Reports() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
    // Set default dates (last 30 days)
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    setToDate(today.toISOString().split("T")[0]);
    setFromDate(lastMonth.toISOString().split("T")[0]);
  }, []);

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
      if (res.data.length > 0) setSelectedLocation(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED: API Call
  const handleGenerate = async () => {
    if (!selectedLocation || !fromDate || !toDate) {
      setError("Please select all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get<Report>(
        `/reports?locationId=${selectedLocation}&from=${fromDate}&to=${toDate}`
      );

      // ✅ Backend now returns complete ReportDto with all fields
      setReport(res.data);
    } catch (err) {
      console.error("Failed to generate report:", err);
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const totalDays = report
    ? report.goodDays + report.moderateDays + report.unhealthyDays
    : 0;

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
                📊 Air Quality Reports
              </h2>
              <p className="text-muted mb-0">
                Generate comprehensive air quality analysis
              </p>
            </div>
          </div>

          {report && (
            <>
              {/* Air Quality Distribution */}
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: 16 }}
              >
                <div className="card-body p-4">
                  <h5 className="mb-4">📊 Air Quality Distribution</h5>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div
                          className="h2 fw-bold mb-0"
                          style={{ color: "#10b981" }}
                        >
                          {report.goodDays}
                        </div>
                        <div className="small text-muted">Good Days</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {totalDays > 0
                            ? `${((report.goodDays / totalDays) * 100).toFixed(0)}% of period`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="text-center">
                        <div
                          className="h2 fw-bold mb-0"
                          style={{ color: "#f59e0b" }}
                        >
                          {report.moderateDays}
                        </div>
                        <div className="small text-muted">Moderate Days</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {totalDays > 0
                            ? `${((report.moderateDays / totalDays) * 100).toFixed(0)}% of period`
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="text-center">
                        <div
                          className="h2 fw-bold mb-0"
                          style={{ color: "#ef4444" }}
                        >
                          {report.unhealthyDays}
                        </div>
                        <div className="small text-muted">Unhealthy Days</div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {totalDays > 0
                            ? `${((report.unhealthyDays / totalDays) * 100).toFixed(0)}% of period`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div
                      className="d-flex"
                      style={{
                        height: 24,
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(report.goodDays / totalDays) * 100}%`,
                          background: "#10b981",
                        }}
                      />
                      <div
                        style={{
                          width: `${(report.moderateDays / totalDays) * 100}%`,
                          background: "#f59e0b",
                        }}
                      />
                      <div
                        style={{
                          width: `${(report.unhealthyDays / totalDays) * 100}%`,
                          background: "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary with ALL stats */}
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: 16 }}
              >
                <div className="card-body p-4">
                  <h5 className="mb-3">📝 Summary</h5>
                  <p className="text-muted mb-2">
                    During the period from{" "}
                    <strong>
                      {new Date(report.fromDate).toLocaleDateString()}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {new Date(report.toDate).toLocaleDateString()}
                    </strong>
                    , the air quality in <strong>{report.locationName}</strong>{" "}
                    averaged an AQI of{" "}
                    <strong>{report.avgAqi.toFixed(0)}</strong>, which is
                    considered{" "}
                    <strong>
                      {report.avgAqi > 100
                        ? "Moderate to Unhealthy"
                        : "Good to Moderate"}
                    </strong>
                    .
                  </p>
                  <p className="text-muted mb-0">
                    The location experienced{" "}
                    <strong>{report.goodDays} good days</strong>,
                    <strong> {report.moderateDays} moderate days</strong>, and
                    <strong> {report.unhealthyDays} unhealthy days</strong>.
                    Peak pollution reached an AQI of{" "}
                    <strong>{report.maxAqi}</strong>, with a minimum of{" "}
                    <strong>{report.minAqi}</strong>.
                  </p>
                  <p className="text-muted small mt-2 mb-0">
                    <em>
                      Analysis based on {report.totalDataPoints} data points
                    </em>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Report Generator Form */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">
                  📍 Location
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: 12 }}
                  value={selectedLocation ?? ""}
                  onChange={(e) => setSelectedLocation(Number(e.target.value))}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">
                  📅 From Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  style={{ borderRadius: 12 }}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold text-muted">
                  📅 To Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  style={{ borderRadius: 12 }}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-primary w-100"
                  style={{ borderRadius: 12, padding: "12px" }}
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? (
                    <span>⏳ Generating...</span>
                  ) : (
                    <span>🔍 Generate Report</span>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="alert alert-danger"
            style={{ borderRadius: 12 }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="d-inline-block mb-3"
            style={{ fontSize: "4rem" }}
          >
            📊
          </motion.div>
          <div className="text-muted">Generating your report...</div>
        </div>
      )}

      {/* Report Display */}
      {!loading && report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Report Header */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 16 }}
          >
            <div
              className="card-body p-4 text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <h4 className="mb-2 fw-bold">Air Quality Report</h4>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span>📍 {report.locationName}</span>
                <span>•</span>
                <span>
                  📅 {new Date(report.fromDate).toLocaleDateString()} -{" "}
                  {new Date(report.toDate).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>📊 {report.totalDataPoints} data points</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <StatCard
                icon="🌫️"
                label="Average PM2.5"
                value={report.avgPm25.toFixed(1)}
                suffix=" µg/m³"
                color="#667eea"
              />
            </div>
            <div className="col-md-3">
              <StatCard
                icon="💨"
                label="Average PM10"
                value={report.avgPm10.toFixed(1)}
                suffix=" µg/m³"
                color="#764ba2"
              />
            </div>
            <div className="col-md-3">
              <StatCard
                icon="📈"
                label="Average AQI"
                value={report.avgAqi}
                color={report.avgAqi > 100 ? "#ef4444" : "#10b981"}
              />
            </div>
            <div className="col-md-3">
              <StatCard
                icon="⚠️"
                label="Max AQI Recorded"
                value={report.maxAqi}
                color="#f59e0b"
              />
            </div>
          </div>

          {/* Air Quality Distribution */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: 16 }}
          >
            <div className="card-body p-4">
              <h5 className="mb-4">📊 Air Quality Distribution</h5>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 100,
                        height: 100,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <div className="text-white">
                        <div className="h2 fw-bold mb-0">{report.goodDays}</div>
                        <div className="small">days</div>
                      </div>
                    </div>
                    <div className="fw-semibold" style={{ color: "#10b981" }}>
                      😊 Good
                    </div>
                    <div className="text-muted small">
                      {((report.goodDays / totalDays) * 100).toFixed(0)}% of
                      period
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 100,
                        height: 100,
                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                        boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      <div className="text-white">
                        <div className="h2 fw-bold mb-0">
                          {report.moderateDays}
                        </div>
                        <div className="small">days</div>
                      </div>
                    </div>
                    <div className="fw-semibold" style={{ color: "#f59e0b" }}>
                      😐 Moderate
                    </div>
                    <div className="text-muted small">
                      {((report.moderateDays / totalDays) * 100).toFixed(0)}% of
                      period
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="text-center">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 100,
                        height: 100,
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      <div className="text-white">
                        <div className="h2 fw-bold mb-0">
                          {report.unhealthyDays}
                        </div>
                        <div className="small">days</div>
                      </div>
                    </div>
                    <div className="fw-semibold" style={{ color: "#ef4444" }}>
                      😷 Unhealthy
                    </div>
                    <div className="text-muted small">
                      {((report.unhealthyDays / totalDays) * 100).toFixed(0)}%
                      of period
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div
                  className="d-flex"
                  style={{ height: 24, borderRadius: 12, overflow: "hidden" }}
                >
                  <div
                    style={{
                      width: `${(report.goodDays / totalDays) * 100}%`,
                      background: "#10b981",
                    }}
                  />
                  <div
                    style={{
                      width: `${(report.moderateDays / totalDays) * 100}%`,
                      background: "#f59e0b",
                    }}
                  />
                  <div
                    style={{
                      width: `${(report.unhealthyDays / totalDays) * 100}%`,
                      background: "#ef4444",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body p-4">
              <h5 className="mb-3">📝 Summary</h5>
              <p className="text-muted mb-2">
                During the period from{" "}
                <strong>
                  {new Date(report.fromDate).toLocaleDateString()}
                </strong>{" "}
                to{" "}
                <strong>{new Date(report.toDate).toLocaleDateString()}</strong>,
                the air quality in <strong>{report.locationName}</strong>{" "}
                averaged an AQI of <strong>{report.avgAqi}</strong>, which is
                considered{" "}
                <strong>
                  {report.avgAqi > 100
                    ? "Moderate to Unhealthy"
                    : "Good to Moderate"}
                </strong>
                .
              </p>
              <p className="text-muted mb-0">
                The location experienced{" "}
                <strong>{report.goodDays} good days</strong>,
                <strong> {report.moderateDays} moderate days</strong>, and
                <strong> {report.unhealthyDays} unhealthy days</strong>. Peak
                pollution reached an AQI of <strong>{report.maxAqi}</strong>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !report && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-0 shadow-sm text-center py-5"
          style={{ borderRadius: 20 }}
        >
          <div style={{ fontSize: "5rem" }} className="mb-3">
            📊
          </div>
          <h5 className="mb-2">No Report Generated Yet</h5>
          <p className="text-muted">
            Select a location and date range, then click "Generate Report"
          </p>
        </motion.div>
      )}
    </div>
  );
}
