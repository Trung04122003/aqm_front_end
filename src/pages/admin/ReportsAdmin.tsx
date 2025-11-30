// src/pages/admin/ReportsAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaTrash, FaCalendarAlt, FaGift } from "react-icons/fa";
import { Badge, Button, Modal, Form } from "react-bootstrap";
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

// 🎁 Gift bounce animation for fun
const GiftBounce = () => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="d-inline-block"
  >
    <FaGift className="text-warning" size={20} />
  </motion.div>
);

// ✅ FIXED: Match backend ReportDto structure
type Report = {
  id: number;
  username: string; // ✅ Direct username string
  locationName: string; // ✅ Direct location name string
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
  const [locations, setLocations] = useState([]);

  const [newReport, setNewReport] = useState({
    locationId: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    loadReports();
    loadLocations();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token exists:", !!token);

      const res = await api.get("/admin/reports");

      // ✅ FIX: Ensure array format
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

    try {
      console.log("🎅 Generating report with:", newReport);

      // ✅ FIX: Use ADMIN endpoint
      const res = await api.post("/admin/reports/generate", {
        locationId: Number(newReport.locationId),
        fromDate: newReport.fromDate,
        toDate: newReport.toDate,
      });

      console.log("✅ Report generated:", res.data);
      toast.success("🎁 Report generated successfully!");

      setShowModal(false);
      setNewReport({ locationId: "", fromDate: "", toDate: "" });

      // ✅ Reload reports table
      await loadReports();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Generate error:", err);
      const errorMsg =
        err?.response?.data || err?.message || "Failed to generate report";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;

    try {
      await api.delete(`/admin/reports/${id}`);
      toast.success("🎁 Report deleted successfully!");
      await loadReports(); // ✅ Reload table after delete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Delete failed:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to delete";
      toast.error(errorMsg);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const res = await api.get(`/admin/reports/${id}/download`, {
        responseType: "blob", // ✅ CRITICAL: Must be blob
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("📄 Report downloaded!");
    } catch (err) {
      console.error("❌ Download error:", err);
      toast.error("Failed to download report");
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
        {[...Array(22)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.25} />
        ))}

        <div
          className="container-fluid p-4 position-relative"
          style={{ zIndex: 2 }}
        >
          {/* ⭐ HEADER */}
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
              Santa’s official air-quality analysis reports
            </p>
          </motion.div>

          {/* ⭐ ACTION BAR */}
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

              <Button
                variant="warning"
                onClick={() => setShowModal(true)}
                className="d-inline-flex align-items-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <FaCalendarAlt /> Generate Report
              </Button>
            </div>
          </motion.div>

          {/* ⭐ REPORTS TABLE */}
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
                    color: "#FFFFFF", // ⭐ FIXED: Thay màu chữ đậm hơn (white full)
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
                        <td className="px-4 fw-bold">{report.id}</td>{" "}
                        {/* ⭐ FIXED: fw-bold để đậm */}
                        <td className="fw-bold">{report.username}</td>{" "}
                        {/* ⭐ FIXED: fw-bold để đậm */}
                        <td className="fw-bold">{report.locationName}</td>{" "}
                        {/* ⭐ FIXED: fw-bold để đậm */}
                        <td className="fw-bold">
                          {new Date(report.fromDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(report.toDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {report.avgAqi.toFixed(0)}
                          </Badge>
                        </td>
                        <td className="fw-bold">
                          {new Date(report.generatedAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="text-end px-4">
                          <Button
                            size="sm"
                            variant="outline-success"
                            className="me-2"
                            onClick={() => handleDownload(report.id)}
                          >
                            <FaDownload />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(report.id)}
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

          {/* ⭐ MODAL */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Generate Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    value={newReport.locationId}
                    onChange={(e) =>
                      setNewReport({ ...newReport, locationId: e.target.value })
                    }
                  >
                    <option value="">Select location</option>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {locations.map((loc: any) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newReport.fromDate}
                    onChange={(e) =>
                      setNewReport({ ...newReport, fromDate: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newReport.toDate}
                    onChange={(e) =>
                      setNewReport({ ...newReport, toDate: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="warning"
                onClick={handleGenerate}
                disabled={
                  !newReport.locationId ||
                  !newReport.fromDate ||
                  !newReport.toDate
                }
              >
                Generate 🎁
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </AdminLayout>
  );
}