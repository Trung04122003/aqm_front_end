// src/pages/admin/SensorsAdmin.tsx (ULTRA BEAUTIFUL)
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaServer,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTools
} from "react-icons/fa";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type Sensor = {
  id?: number;
  serialNumber: string;
  sensorType: string;
  model: string;
  locationId: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  installationDate?: string;
};

type Location = {
  id: number;
  name: string;
};

export default function SensorsAdmin() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSensors();
    loadLocations();
  }, []);

  const loadSensors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/sensors");
      setSensors(res.data || []);
    } catch (err) {
      console.error("Failed to load sensors", err);
      toast.error("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await api.get("/locations");
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  };

  const handleCreate = () => {
    setEditing({
      serialNumber: "",
      sensorType: "",
      model: "",
      locationId: locations[0]?.id || 1,
      status: "ACTIVE"
    });
    setShowModal(true);
  };

  const handleEdit = (sensor: Sensor) => {
    setEditing(sensor);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      if (editing.id) {
        await api.put(`/admin/sensors/${editing.id}`, editing);
        toast.success("Sensor updated successfully");
      } else {
        await api.post("/admin/sensors", editing);
        toast.success("Sensor created successfully");
      }
      setShowModal(false);
      loadSensors();
    } catch (err) {
      toast.error("Failed to save sensor");
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this sensor?")) return;

    try {
      await api.delete(`/admin/sensors/${id}`);
      toast.success("Sensor deleted successfully");
      loadSensors();
    } catch (err) {
      toast.error("Failed to delete sensor");
      console.error(err);
    }
  };

  const filteredSensors = sensors.filter(
    (s) =>
      s.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sensorType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FaCheckCircle className="text-success" />;
      case "INACTIVE":
        return <FaExclamationTriangle className="text-danger" />;
      case "MAINTENANCE":
        return <FaTools className="text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variants: any = {
      ACTIVE: "success",
      INACTIVE: "danger",
      MAINTENANCE: "warning"
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getLocationName = (locationId: number) => {
    return locations.find(l => l.id === locationId)?.name || "Unknown";
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
            <FaServer className="text-primary" />
            Sensor Management
          </h2>
          <p className="text-muted">Monitor and manage air quality sensors</p>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">{sensors.length}</div>
                  <div className="small opacity-75">Total Sensors</div>
                </div>
                <FaServer size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">
                    {sensors.filter(s => s.status === "ACTIVE").length}
                  </div>
                  <div className="small opacity-75">Active</div>
                </div>
                <FaCheckCircle size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">
                    {sensors.filter(s => s.status === "MAINTENANCE").length}
                  </div>
                  <div className="small opacity-75">Maintenance</div>
                </div>
                <FaTools size={32} className="opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card border-0 shadow-sm"
            style={{ borderRadius: 16, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}
          >
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="h3 fw-bold mb-1">
                    {sensors.filter(s => s.status === "INACTIVE").length}
                  </div>
                  <div className="small opacity-75">Inactive</div>
                </div>
                <FaExclamationTriangle size={32} className="opacity-50" />
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
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group" style={{ borderRadius: 12, overflow: "hidden" }}>
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search sensors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-end">
              <Button
                variant="primary"
                onClick={handleCreate}
                className="d-inline-flex align-items-center gap-2 px-4"
                style={{ borderRadius: 12 }}
              >
                <FaPlus /> Create Sensor
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sensors Grid */}
      <div className="row g-4">
        <AnimatePresence>
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" style={{ width: 60, height: 60 }} />
            </div>
          ) : filteredSensors.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: "4rem" }}>📡</div>
              <h5 className="text-muted mt-3">No sensors found</h5>
            </div>
          ) : (
            filteredSensors.map((sensor, index) => (
              <motion.div
                key={sensor.id}
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
                      background: sensor.status === "ACTIVE" 
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : sensor.status === "MAINTENANCE"
                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                        : "linear-gradient(135deg, #6b7280, #4b5563)"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="small opacity-75 mb-1">Serial Number</div>
                        <div className="h5 fw-bold mb-0">{sensor.serialNumber}</div>
                      </div>
                      {getStatusIcon(sensor.status)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaServer className="text-muted" />
                        <div>
                          <div className="small text-muted">Model</div>
                          <div className="fw-semibold">{sensor.model || "N/A"}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-muted" />
                        <div>
                          <div className="small text-muted">Location</div>
                          <div className="fw-semibold">{getLocationName(sensor.locationId)}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="small text-muted">Type:</div>
                        <Badge bg="info">{sensor.sensorType}</Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      {getStatusBadge(sensor.status)}
                    </div>

                    {sensor.installationDate && (
                      <div className="small text-muted mb-3">
                        Installed: {new Date(sensor.installationDate).toLocaleDateString("vi-VN")}
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="flex-fill"
                        onClick={() => handleEdit(sensor)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(sensor.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header 
          closeButton 
          className="border-0 pb-0"
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
        >
          <Modal.Title className="text-white">
            <FaServer className="me-2" />
            {editing?.id ? "Edit Sensor" : "Create New Sensor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Serial Number</Form.Label>
                  <Form.Control
                    value={editing?.serialNumber || ""}
                    onChange={(e) =>
                      setEditing({ ...editing!, serialNumber: e.target.value })
                    }
                    placeholder="SN-001"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Sensor Type</Form.Label>
                  <Form.Control
                    value={editing?.sensorType || ""}
                    onChange={(e) =>
                      setEditing({ ...editing!, sensorType: e.target.value })
                    }
                    placeholder="AirQuality"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Model</Form.Label>
                  <Form.Control
                    value={editing?.model || ""}
                    onChange={(e) =>
                      setEditing({ ...editing!, model: e.target.value })
                    }
                    placeholder="AQM-Pro"
                    style={{ borderRadius: 12 }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Select
                    value={editing?.locationId || ""}
                    onChange={(e) =>
                      setEditing({ ...editing!, locationId: Number(e.target.value) })
                    }
                    style={{ borderRadius: 12 }}
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    value={editing?.status || "ACTIVE"}
                    onChange={(e) =>
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setEditing({ ...editing!, status: e.target.value as any })
                    }
                    style={{ borderRadius: 12 }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Installation Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editing?.installationDate || ""}
                    onChange={(e) =>
                      setEditing({ ...editing!, installationDate: e.target.value })
                    }
                    style={{ borderRadius: 12 }}
                  />
                </Form.Group>
              </div>
            </div>
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
            {editing?.id ? "Update Sensor" : "Create Sensor"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}