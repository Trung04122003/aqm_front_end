// src/pages/admin/ReportsAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaDownload, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { Badge, Button, Modal, Form } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Report = {
  id: number;
  user: { username: string };
  location: { name: string };
  fromDate: string;
  toDate: string;
  avgPm25: number;
  avgPm10: number;
  avgAqi: number;
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
    toDate: ""
  });

  useEffect(() => {
    loadReports();
    loadLocations();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!newReport.locationId || !newReport.fromDate || !newReport.toDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await api.post("/admin/reports/generate", newReport);
      toast.success("Report generated successfully");
      setShowModal(false);
      loadReports();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to generate report");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this report?")) return;
    
    try {
      await api.delete(`/admin/reports/${id}`);
      toast.success("Report deleted");
      loadReports();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const res = await api.get(`/admin/reports/${id}/download`, { 
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Report downloaded");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to download report");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="mb-1">Reports Management</h2>
        <p className="text-muted">Generate and manage air quality reports</p>
      </div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <FaFileAlt size={24} className="text-primary" />
            <div>
              <div className="fw-semibold">Total Reports</div>
              <div className="text-muted small">{reports.length} reports generated</div>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="d-inline-flex align-items-center gap-2"
          >
            <FaCalendarAlt /> Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Reports Table */}
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
                  <th className="border-0 py-3">Period</th>
                  <th className="border-0 py-3">Avg AQI</th>
                  <th className="border-0 py-3">Generated At</th>
                  <th className="border-0 py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <td className="px-4">{report.id}</td>
                      <td className="fw-semibold">{report.user.username}</td>
                      <td>{report.location.name}</td>
                      <td className="text-muted small">
                        {new Date(report.fromDate).toLocaleDateString('vi-VN')} - {new Date(report.toDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <Badge bg="info">{report.avgAqi.toFixed(0)}</Badge>
                      </td>
                      <td className="text-muted small">
                        {new Date(report.generatedAt).toLocaleString('vi-VN')}
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
        </div>
      </motion.div>

      {/* Generate Report Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Generate New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Select
                value={newReport.locationId}
                onChange={(e) => setNewReport({...newReport, locationId: e.target.value})}
              >
                <option value="">Select location</option>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {locations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                value={newReport.fromDate}
                onChange={(e) => setNewReport({...newReport, fromDate: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                value={newReport.toDate}
                onChange={(e) => setNewReport({...newReport, toDate: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGenerate}>
            Generate
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}