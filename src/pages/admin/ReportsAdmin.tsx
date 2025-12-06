// src/pages/admin/ReportsAdmin.tsx - EXTRA FESTIVE EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDownload,
  FaTrash,
  FaCalendarAlt,
  FaGift,
  FaFilePdf,
  FaFileCsv,
  FaFileExcel,
  FaFileCode,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";
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

// 🎁 Gift bounce animation
const GiftBounce = () => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="d-inline-block"
  >
    <FaGift className="text-warning" size={24} />
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

type Report = {
  id: number;
  username: string;
  locationName: string;
  fromDate: string;
  toDate: string;
  avgAqi: number;
  avgPm25: number;
  avgPm10: number;
  maxAqi?: number;
  minAqi?: number;
  goodDays: number;
  moderateDays: number;
  unhealthyDays: number;
  totalDataPoints: number;
  generatedAt: string;
};

export default function ReportsAdmin() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [locations, setLocations] = useState<any[]>([]);
  const [newReport, setNewReport] = useState({
    locationId: "",
    fromDate: "",
    toDate: "",
  });
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    loadReports();
    loadLocations();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports");
      const reportData = Array.isArray(res.data) ? res.data : [];
      setReports(reportData);
    } catch (err) {
      console.error("❌ Failed to load reports:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch {
      /* empty */
    }
  };

  const handleGenerate = async () => {
    if (!newReport.locationId || !newReport.fromDate || !newReport.toDate) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/reports/generate", {
        locationId: Number(newReport.locationId),
        fromDate: newReport.fromDate,
        toDate: newReport.toDate,
      });
      toast.success("🎁 Report generated successfully!");
      setShowModal(false);
      setNewReport({ locationId: "", fromDate: "", toDate: "" });
      await loadReports();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Generate error:", err);
      const errorMsg =
        err?.response?.data || err?.message || "Failed to generate report";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;

    try {
      await api.delete(`/admin/reports/${id}`);
      toast.success("🎁 Report deleted successfully!");
      await loadReports();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to delete";
      toast.error(errorMsg);
    }
  };

  const handleExport = async (id: number, format: string) => {
    try {
      const formatConfig: Record<
        string,
        { endpoint: string; filename: string; icon: string }
      > = {
        pdf: {
          endpoint: `/admin/reports/${id}/download`,
          filename: `report_${id}.pdf`,
          icon: "📄",
        },
        csv: {
          endpoint: `/admin/reports/${id}/export/csv`,
          filename: `report_${id}.csv`,
          icon: "📊",
        },
        excel: {
          endpoint: `/admin/reports/${id}/export/excel`,
          filename: `report_${id}.xlsx`,
          icon: "📗",
        },
        html: {
          endpoint: `/admin/reports/${id}/export/html`,
          filename: `report_${id}.html`,
          icon: "🌐",
        },
        json: {
          endpoint: `/admin/reports/${id}/export/json`,
          filename: `report_${id}.json`,
          icon: "📋",
        },
      };

      const config = formatConfig[format];
      if (!config) {
        toast.error("Invalid format");
        return;
      }

      const res = await api.get(config.endpoint, {
        responseType: format === "json" ? "json" : "blob",
      });

      if (format === "json") {
        const jsonString = JSON.stringify(res.data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", config.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", config.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success(`${config.icon} ${format.toUpperCase()} downloaded!`);
      setOpenDropdown(null);
    } catch (err) {
      console.error(`❌ ${format.toUpperCase()} Export error:`, err);
      toast.error(`Failed to export ${format.toUpperCase()}`);
    }
  };

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
            emoji={["🎁", "📊", "⭐", "🎄", "📈", "🔔"][i]}
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
              📊 Workshop Analytics 🎁
            </motion.h2>
            <p className="text-light text-opacity-75 mb-0">
              Santa's official air-quality analysis reports
            </p>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(6px)",
              border: "2px solid rgba(255,215,0,0.3)",
              boxShadow: "0 0 30px rgba(255,215,0,0.2)",
            }}
          >
            <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <GiftBounce />
                <div>
                  <div className="fw-semibold text-warning fs-5">
                    Total Reports
                  </div>
                  <div className="text-light small opacity-75">
                    {reports.length} generated
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn d-inline-flex align-items-center gap-2 px-4 py-3"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 600,
                  color: "white",
                  boxShadow: "0 0 20px rgba(251,191,36,0.4)",
                }}
                onClick={() => setShowModal(true)}
              >
                <FaCalendarAlt /> Generate Report
              </motion.button>
            </div>
          </motion.div>

          {/* Reports Table */}
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
                    <th className="border-0 py-3 fw-semibold">Location</th>
                    <th className="border-0 py-3 fw-semibold">Period</th>
                    <th className="border-0 py-3 fw-semibold">Avg AQI</th>
                    <th className="border-0 py-3 fw-semibold">Generated</th>
                    <th className="border-0 py-3 text-end px-4 fw-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5">
                        <div className="spinner-border text-warning" />
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-light">
                        <div style={{ fontSize: "3rem" }}>📊</div>
                        <div className="mt-2">No reports available</div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report, index) => (
                      <motion.tr
                        key={report.id}
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
                            #{report.id}
                          </span>
                        </td>
                        <td className="fw-bold">{report.username}</td>
                        <td className="fw-bold">{report.locationName}</td>
                        <td className="fw-bold">
                          {new Date(report.fromDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(report.toDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td>
                          <span
                            className="badge px-3 py-1"
                            style={{
                              background: "rgba(251,191,36,0.2)",
                              color: "#fbbf24",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                            }}
                          >
                            {report.avgAqi.toFixed(0)}
                          </span>
                        </td>
                        <td className="fw-bold">
                          {new Date(report.generatedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="text-end px-4">
                          <div className="d-inline-block position-relative me-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-sm d-inline-flex align-items-center gap-2 px-3 py-2"
                              style={{
                                background:
                                  "linear-gradient(135deg, #10b981, #059669)",
                                border: "none",
                                borderRadius: 10,
                                color: "white",
                                fontWeight: 600,
                              }}
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === report.id ? null : report.id
                                )
                              }
                            >
                              <FaDownload /> Export <FaChevronDown size={10} />
                            </motion.button>

                            {/* Export Dropdown */}
                            <AnimatePresence>
                              {openDropdown === report.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  className="position-absolute top-100 end-0 mt-2"
                                  style={{
                                    background: "rgba(26, 35, 50, 0.98)",
                                    borderRadius: 12,
                                    padding: "0.5rem",
                                    minWidth: 200,
                                    zIndex: 1000,
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                  }}
                                >
                                  {[
                                    { format: "pdf", icon: FaFilePdf, color: "#ef4444", label: "PDF Report" },
                                    { format: "csv", icon: FaFileCsv, color: "#10b981", label: "CSV Data" },
                                    { format: "excel", icon: FaFileExcel, color: "#10b981", label: "Excel" },
                                    { format: "html", icon: FaFileCode, color: "#0ea5e9", label: "HTML" },
                                    { format: "json", icon: FaFileAlt, color: "#fbbf24", label: "JSON" },
                                  ].map((item) => (
                                    <motion.button
                                      key={item.format}
                                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                                      className="btn btn-sm w-100 text-start text-light d-flex align-items-center gap-2 mb-1"
                                      onClick={() =>
                                        handleExport(report.id, item.format)
                                      }
                                      style={{
                                        background: "transparent",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                      }}
                                    >
                                      <item.icon style={{ color: item.color }} />
                                      {item.label}
                                    </motion.button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

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
                            onClick={() => handleDelete(report.id)}
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
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
              🎅 {reports.length} reports generated · Workshop Analytics Division ❄️
            </small>
          </motion.div>
        </div>
      </div>

      {/* Generate Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal d-block"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowModal(false)}
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
                  border: "2px solid rgba(255,215,0,0.3)",
                  borderRadius: 16,
                  boxShadow: "0 0 40px rgba(255,215,0,0.3)",
                }}
              >
                {/* Candy Cane Top Border */}
                <div
                  className="position-absolute top-0 start-0 w-100"
                  style={{
                    height: 6,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background:
                      "repeating-linear-gradient(90deg, #C41E3A 0px, #C41E3A 15px, #fff 15px, #fff 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <FaGift className="text-warning" /> Generate Report
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <select
                      className="form-select"
                      value={newReport.locationId}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          locationId: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,215,0,0.3)",
                        borderRadius: 10,
                      }}
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id} style={{ background: "#1a2332" }}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">From Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newReport.fromDate}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          fromDate: e.target.value,
                        })
                      }
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,215,0,0.3)",
                        borderRadius: 10,
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">To Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newReport.toDate}
                      onChange={(e) =>
                        setNewReport({ ...newReport, toDate: e.target.value })
                      }
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,215,0,0.3)",
                        borderRadius: 10,
                      }}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                    }}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                      fontWeight: 600,
                    }}
                    onClick={handleGenerate}
                    disabled={
                      !newReport.locationId ||
                      !newReport.fromDate ||
                      !newReport.toDate ||
                      loading
                    }
                  >
                    {loading ? "Generating..." : "Generate 🎁"}
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