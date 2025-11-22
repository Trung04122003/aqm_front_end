// src/pages/admin/ThresholdsAdmin.tsx (ULTRA BEAUTIFUL)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaBell,
  FaExclamationTriangle,
  FaUser,
  FaChartLine
} from "react-icons/fa";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Threshold = {
  id?: number;
  userId?: number;
  user?: { username: string };
  pm25Threshold?: number;
  pm10Threshold?: number;
  aqiThreshold?: number;
};

export default function ThresholdsAdmin() {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Threshold | null>(null);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/thresholds");
      setThresholds(res.data || []);
    } catch (err) {
      console.error("Failed to load thresholds", err);
      toast.error("Failed to load thresholds");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({
      pm25Threshold: 35,
      pm10Threshold: 50,
      aqiThreshold: 100
    });
    setShowModal(true);
  };

  const handleEdit = (threshold: Threshold) => {
    setEditing(threshold);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      if (editing.id) {
        await api.put(`/admin/thresholds/${editing.id}`, editing);
        toast.success("Threshold updated successfully");
      } else {
        await api.post("/admin/thresholds", editing);
        toast.success("Threshold created successfully");
      }
      setShowModal(false);
      loadThresholds();
    } catch (err) {
      toast.error("Failed to save threshold");
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this threshold?")) return;

    try {
      await api.delete(`/admin/thresholds/${id}`);
      toast.success("Threshold deleted successfully");
      loadThresholds();
    } catch (err) {
      toast.error("Failed to delete threshold");
      console.error(err);
    }
  };

  const getThresholdLevel = ({ value, type }: { value?: number; type: "pm25" | "pm10" | "aqi"; }) => {
    if (!value) return { level: "low", color: "#10b981" };
    
    const limits = {
      pm25: { moderate: 35, high: 55 },
      pm10: { moderate: 50, high: 150 },
      aqi: { moderate: 100, high: 150 }
    };

    if (value >= limits[type].high) return { level: "high", color: "#ef4444" };
    if (value >= limits[type].moderate) return { level: "moderate", color: "#f59e0b" };
    return { level: "low", color: "#10b981" };
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-1 d-flex align-items-center gap-2">
            <FaBell className="text-warning" />
            Alert Thresholds Management
          </h2>
          <p className="text-muted">Configure alert thresholds for users</p>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">{thresholds.length}</div>
                  <div className="small opacity-75">Total Thresholds</div>
                </div>
                <FaBell size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">
                    {thresholds.filter(t => (t.aqiThreshold || 0) > 100).length}
                  </div>
                  <div className="small opacity-75">High Sensitivity</div>
                </div>
                <FaExclamationTriangle size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">
                    {Math.round(thresholds.reduce((acc, t) => acc + (t.aqiThreshold || 0), 0) / (thresholds.length || 1))}
                  </div>
                  <div className="small opacity-75">Avg AQI Threshold</div>
                </div>
                <FaChartLine size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={handleCreate}
              className="d-inline-flex align-items-center gap-2 px-4"
              style={{ borderRadius: 12 }}
            >
              <FaPlus /> Create Threshold
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Thresholds Grid */}
      <div className="row g-4">
        <AnimatePresence>
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" style={{ width: 60, height: 60 }} />
            </div>
          ) : thresholds.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: "4rem" }}>🔔</div>
              <h5 className="text-muted mt-3">No thresholds configured</h5>
              <Button 
                variant="primary" 
                className="mt-3"
                onClick={handleCreate}
              >
                Create First Threshold
              </Button>
            </div>
          ) : (
            thresholds.map((threshold, index) => {
              const pm25Level = getThresholdLevel({ value: threshold.pm25Threshold, type: "pm25" });
              const pm10Level = getThresholdLevel({ value: threshold.pm10Threshold, type: "pm10" });
              const aqiLevel = getThresholdLevel({ value: threshold.aqiThreshold, type: "aqi" });

              return (
                <motion.div
                  key={threshold.id}
                  className="col-12 col-md-6 col-xl-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: 16, overflow: "hidden" }}
                  >
                    {/* Card Header */}
                    <div 
                      className="p-3 text-white"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #d97706)"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <FaUser />
                          <div>
                            <div className="small opacity-75">User</div>
                            <div className="fw-bold">
                              {threshold.user?.username || `ID: ${threshold.userId}`}
                            </div>
                          </div>
                        </div>
                        <FaBell size={24} className="opacity-50" />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4">
                      <div className="mb-4">
                        <h6 className="text-muted mb-3">Alert Thresholds</h6>
                        
                        {/* PM2.5 */}
                        <div className="mb-3 p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">PM2.5</span>
                            <Badge 
                              style={{ 
                                background: pm25Level.color,
                                fontSize: "0.9rem"
                              }}
                            >
                              {threshold.pm25Threshold?.toFixed(1) || "N/A"} µg/m³
                            </Badge>
                          </div>
                          <div 
                            className="progress" 
                            style={{ height: 6, borderRadius: 3 }}
                          >
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${Math.min((threshold.pm25Threshold || 0) / 100 * 100, 100)}%`,
                                background: pm25Level.color
                              }}
                            />
                          </div>
                        </div>

                        {/* PM10 */}
                        <div className="mb-3 p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">PM10</span>
                            <Badge 
                              style={{ 
                                background: pm10Level.color,
                                fontSize: "0.9rem"
                              }}
                            >
                              {threshold.pm10Threshold?.toFixed(1) || "N/A"} µg/m³
                            </Badge>
                          </div>
                          <div 
                            className="progress" 
                            style={{ height: 6, borderRadius: 3 }}
                          >
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${Math.min((threshold.pm10Threshold || 0) / 200 * 100, 100)}%`,
                                background: pm10Level.color
                              }}
                            />
                          </div>
                        </div>

                        {/* AQI */}
                        <div className="p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">AQI</span>
                            <Badge 
                              style={{ 
                                background: aqiLevel.color,
                                fontSize: "0.9rem"
                              }}
                            >
                              {threshold.aqiThreshold?.toFixed(0) || "N/A"}
                            </Badge>
                          </div>
                          <div 
                            className="progress" 
                            style={{ height: 6, borderRadius: 3 }}
                          >
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${Math.min((threshold.aqiThreshold || 0) / 300 * 100, 100)}%`,
                                background: aqiLevel.color
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="flex-fill"
                          onClick={() => handleEdit(threshold)}
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(threshold.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
      >
        <Modal.Header 
          closeButton 
          className="border-0 pb-0"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
        >
          <Modal.Title className="text-white">
            <FaBell className="me-2" />
            {editing?.id ? "Edit Threshold" : "Create New Threshold"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                PM2.5 Threshold
                <Badge bg="info" className="small">µg/m³</Badge>
              </Form.Label>
              <Form.Control
                type="number"
                value={editing?.pm25Threshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, pm25Threshold: Number(e.target.value) })
                }
                placeholder="35.0"
                style={{ borderRadius: 12 }}
              />
              <Form.Text className="text-muted">
                WHO guideline: 15 µg/m³, EPA standard: 35 µg/m³
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                PM10 Threshold
                <Badge bg="info" className="small">µg/m³</Badge>
              </Form.Label>
              <Form.Control
                type="number"
                value={editing?.pm10Threshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, pm10Threshold: Number(e.target.value) })
                }
                placeholder="50.0"
                style={{ borderRadius: 12 }}
              />
              <Form.Text className="text-muted">
                WHO guideline: 45 µg/m³, EPA standard: 150 µg/m³
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                AQI Threshold
                <Badge bg="info" className="small">Index</Badge>
              </Form.Label>
              <Form.Control
                type="number"
                value={editing?.aqiThreshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, aqiThreshold: Number(e.target.value) })
                }
                placeholder="100"
                style={{ borderRadius: 12 }}
              />
              <Form.Text className="text-muted">
                0-50: Good, 51-100: Moderate, 101-150: Unhealthy for Sensitive
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            style={{ borderRadius: 12 }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            style={{ borderRadius: 12 }}
          >
            {editing?.id ? "Update Threshold" : "Create Threshold"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}