// src/pages/admin/ReportsAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

// 🎁 Gift bounce animation
const GiftBounce = () => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="d-inline-block"
  >
    <FaGift className="text-warning" size={20} />
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

  // ✅ EXPORT FUNCTIONS
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
              📊 Workshop Analytics 🎁
            </h2>
            <p className="text-light text-opacity-75">
              Santa's official air-quality analysis reports
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm mb-4"
            style={{
              borderRadius: 16,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <GiftBounce />
                <div>
                  <div className="fw-semibold text-warning">Total Reports</div>
                  <div className="text-light small opacity-75">
                    {reports.length} generated
                  </div>
                </div>
              </div>
              <button
                className="btn btn-warning d-inline-flex align-items-center gap-2"
                style={{ fontWeight: 600 }}
                onClick={() => setShowModal(true)}
              >
                <FaCalendarAlt /> Generate Report
              </button>
            </div>
          </motion.div>

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
                    <th className="border-0 py-3">Location</th>
                    <th className="border-0 py-3">Period</th>
                    <th className="border-0 py-3">Avg AQI</th>
                    <th className="border-0 py-3">Generated</th>
                    <th className="border-0 py-3 text-end px-4">Actions</th>
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
                        No reports available
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{
                          backgroundColor: "rgba(255,255,255,0.12)",
                        }}
                      >
                        <td className="px-4 fw-bold">{report.id}</td>
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
                          <span className="badge bg-warning text-dark">
                            {report.avgAqi.toFixed(0)}
                          </span>
                        </td>
                        <td className="fw-bold">
                          {new Date(report.generatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="text-end px-4">
                          <div className="d-inline-block position-relative me-2">
                            <button
                              className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === report.id ? null : report.id
                                )
                              }
                            >
                              <FaDownload /> Export <FaChevronDown size={10} />
                            </button>

                            {openDropdown === report.id && (
                              <div
                                className="position-absolute top-100 end-0 mt-1"
                                style={{
                                  background: "#1a2332",
                                  borderRadius: 12,
                                  padding: "0.5rem",
                                  minWidth: 180,
                                  zIndex: 1000,
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                                }}
                              >
                                <button
                                  className="btn btn-sm w-100 text-start text-light mb-1 d-flex align-items-center gap-2"
                                  onClick={() => handleExport(report.id, "pdf")}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <FaFilePdf className="text-danger" /> PDF
                                  Report
                                </button>
                                <button
                                  className="btn btn-sm w-100 text-start text-light mb-1 d-flex align-items-center gap-2"
                                  onClick={() => handleExport(report.id, "csv")}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <FaFileCsv className="text-success" /> CSV
                                  Data
                                </button>
                                <button
                                  className="btn btn-sm w-100 text-start text-light mb-1 d-flex align-items-center gap-2"
                                  onClick={() =>
                                    handleExport(report.id, "excel")
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <FaFileExcel className="text-success" /> Excel
                                  Workbook
                                </button>
                                <button
                                  className="btn btn-sm w-100 text-start text-light mb-1 d-flex align-items-center gap-2"
                                  onClick={() =>
                                    handleExport(report.id, "html")
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <FaFileCode className="text-info" /> HTML
                                  Interactive
                                </button>
                                <button
                                  className="btn btn-sm w-100 text-start text-light d-flex align-items-center gap-2"
                                  onClick={() =>
                                    handleExport(report.id, "json")
                                  }
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                  }}
                                >
                                  <FaFileAlt className="text-warning" /> JSON
                                  Data
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(report.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {showModal && (
            <div
              className="modal d-block"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowModal(false)}
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
                    <h5 className="modal-title">Generate Report</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <select
                        className="form-select"
                        value={newReport.locationId}
                        onChange={(e) =>
                          setNewReport({
                            ...newReport,
                            locationId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">From Date</label>
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
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newReport.toDate}
                        onChange={(e) =>
                          setNewReport({ ...newReport, toDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={handleGenerate}
                      disabled={
                        !newReport.locationId ||
                        !newReport.fromDate ||
                        !newReport.toDate ||
                        loading
                      }
                    >
                      {loading ? "Generating..." : "Generate 🎁"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
