// src/pages/admin/ThresholdsAdmin.tsx — NORTH POLE CALIBRATION LAB ❄️⚙️
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSlidersH,
  FaUserAstronaut,
  FaThermometerHalf
} from "react-icons/fa";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaGaugeHigh } from "react-icons/fa6";

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
    } catch {
      toast.error("Failed to load calibration values");
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
        toast.success("Calibration updated");
      } else {
        await api.post("/admin/thresholds", editing);
        toast.success("Calibration created");
      }
      setShowModal(false);
      loadThresholds();
    } catch {
      toast.error("Failed to save calibration");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this calibration profile?")) return;

    try {
      await api.delete(`/admin/thresholds/${id}`);
      toast.success("Calibration deleted");
      loadThresholds();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getLevel = (value?: number, type?: "pm25" | "pm10" | "aqi") => {
    if (!value) return { color: "#10b981", label: "Low" };
    const limits = {
      pm25: { moderate: 35, high: 55 },
      pm10: { moderate: 50, high: 150 },
      aqi: { moderate: 100, high: 150 }
    };
    if (!type) return { color: "#10b981", label: "Low" };

    if (value >= limits[type].high) return { color: "#ef4444", label: "High" };
    if (value >= limits[type].moderate) return { color: "#f59e0b", label: "Moderate" };
    return { color: "#10b981", label: "Low" };
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2
          className="mb-1 d-flex align-items-center gap-2"
          style={{ color: "#0ea5e9", fontWeight: 700 }}
        >
          ❄️ North Pole Calibration Lab
        </h2>
        <p className="text-light text-opacity-75">Configure sensor thresholds for alert generation</p>
      </motion.div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {/* TOTAL */}
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)"
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold">{thresholds.length}</div>
                  <small className="opacity-75">Calibration Profiles</small>
                </div>
                <FaSlidersH size={32} className="opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* HIGH SENSITIVITY */}
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg,#f43f5e 0%,#be123c 100%)"
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold">
                    {thresholds.filter((t) => (t.aqiThreshold || 0) > 120).length}
                  </div>
                  <small className="opacity-75">High-Risk Sensors</small>
                </div>
                <FaGaugeHigh size={32} className="opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* AVERAGE AQI */}
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg,#22c55e 0%,#15803d 100%)"
            }}
          >
            <div className="card-body text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold">
                    {Math.round(
                      thresholds.reduce((acc, t) => acc + (t.aqiThreshold || 0), 0) /
                        (thresholds.length || 1)
                    )}
                  </div>
                  <small className="opacity-75">Average AQI Threshold</small>
                </div>
                <FaThermometerHalf size={32} className="opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-3 d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={handleCreate}
            className="d-inline-flex align-items-center gap-2 px-4"
            style={{ borderRadius: 12 }}
          >
            <FaPlus /> New Calibration
          </Button>
        </div>
      </motion.div>

      {/* GRID */}
      <div className="row g-4">
        <AnimatePresence>
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" style={{ width: 60, height: 60 }} />
            </div>
          ) : thresholds.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: "4rem" }}>❄️</div>
              <h5 className="text-muted mt-3">No calibration profiles available</h5>
            </div>
          ) : (
            thresholds.map((threshold, index) => {
              const levelAqi = getLevel(threshold.aqiThreshold, "aqi");

              return (
                <motion.div
                  key={threshold.id}
                  className="col-12 col-md-6 col-xl-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "linear-gradient(180deg,#f8fafc,#ffffff)"
                    }}
                  >
                    {/* HEADER */}
                    <div
                      className="p-3 text-white"
                      style={{
                        background: "linear-gradient(135deg,#0ea5e9,#0369a1)"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <FaUserAstronaut />
                          <div>
                            <small className="opacity-75">User</small>
                            <div className="fw-bold">
                              {threshold.user?.username || `User ID: ${threshold.userId}`}
                            </div>
                          </div>
                        </div>
                        <FaSlidersH size={24} className="opacity-50" />
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="card-body p-4">
                      {/* PM2.5 */}
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">PM 2.5</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">
                            {threshold.pm25Threshold?.toFixed(1) ?? "N/A"} µg/m³
                          </span>
                          <Badge
                            style={{
                              background: getLevel(threshold.pm25Threshold, "pm25").color
                            }}
                          >
                            {getLevel(threshold.pm25Threshold, "pm25").label}
                          </Badge>
                        </div>
                      </div>

                      {/* PM10 */}
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">PM 10</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">
                            {threshold.pm10Threshold?.toFixed(1) ?? "N/A"} µg/m³
                          </span>
                          <Badge
                            style={{
                              background: getLevel(threshold.pm10Threshold, "pm10").color
                            }}
                          >
                            {getLevel(threshold.pm10Threshold, "pm10").label}
                          </Badge>
                        </div>
                      </div>

                      {/* AQI */}
                      <div className="mb-4">
                        <h6 className="text-muted mb-2">AQI</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold">{threshold.aqiThreshold}</span>
                          <Badge style={{ background: levelAqi.color }}>
                            {levelAqi.label}
                          </Badge>
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

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ background: "linear-gradient(135deg,#0ea5e9,#0369a1)" }}
        >
          <Modal.Title className="text-white">
            {editing?.id ? "Recalibrate Threshold" : "Create Calibration"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form>
            {/* PM2.5 */}
            <Form.Group className="mb-3">
              <Form.Label>PM 2.5 Threshold</Form.Label>
              <Form.Control
                type="number"
                value={editing?.pm25Threshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, pm25Threshold: Number(e.target.value) })
                }
                placeholder="35"
                style={{ borderRadius: 12 }}
              />
            </Form.Group>

            {/* PM10 */}
            <Form.Group className="mb-3">
              <Form.Label>PM 10 Threshold</Form.Label>
              <Form.Control
                type="number"
                value={editing?.pm10Threshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, pm10Threshold: Number(e.target.value) })
                }
                placeholder="50"
                style={{ borderRadius: 12 }}
              />
            </Form.Group>

            {/* AQI */}
            <Form.Group className="mb-3">
              <Form.Label>AQI Threshold</Form.Label>
              <Form.Control
                type="number"
                value={editing?.aqiThreshold || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, aqiThreshold: Number(e.target.value) })
                }
                placeholder="100"
                style={{ borderRadius: 12 }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
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
            {editing?.id ? "Save Changes" : "Create Calibration"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
