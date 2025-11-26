// src/pages/admin/UsersAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaSearch,
  FaCrown,
  FaUserShield,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

// TYPES
type User = {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER" | "GUEST";
  status: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

// ❄ Snowflake animation
const Snowflake = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${10 + Math.random() * 80}%`,
      top: -20,
      fontSize: "12px",
      pointerEvents: "none",
      zIndex: 1,
      color: "rgba(255,255,255,0.55)",
    }}
    animate={{
      y: ["-2vh", "105vh"],
      rotate: [0, 360],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 10 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    ❄️
  </motion.div>
);

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = users.filter((u) =>
    `${u.username} ${u.fullName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing({
      username: "",
      fullName: "",
      email: "",
      role: "USER",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const saveUser = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/admin/users/${editing.id}`, editing);
        toast.success("User updated");
      } else {
        await api.post("/admin/users", editing);
        toast.success("User created");
      }
      setShowModal(false);
      loadUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      loadUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const roleBadge = (role: User["role"]) => {
    if (role === "ADMIN")
      return (
        <Badge
          bg=""
          className="px-3 py-1 text-light"
          style={{
            background: "linear-gradient(135deg, #ff6b6b, #c92a2a)",
            borderRadius: 10,
          }}
        >
          <FaCrown className="me-1" /> Admin
        </Badge>
      );
    if (role === "USER")
      return (
        <Badge bg="primary" className="px-3 py-1" style={{ borderRadius: 10 }}>
          <FaUserShield className="me-1" /> User
        </Badge>
      );
    return (
      <Badge bg="secondary" className="px-3 py-1" style={{ borderRadius: 10 }}>
        Guest
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100%",
          paddingBottom: "40px",
        }}
      >
        {/* Snowflakes */}
        {[...Array(20)].map((_, i) => (
          <Snowflake key={i} delay={i * 0.5} />
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-2"
          style={{
            zIndex: 2,
            position: "relative",
          }}
        >
          <h2
            className="fw-bold mb-1"
            style={{
              color: "white",
              textShadow: "0px 0px 12px rgba(173,230,255,0.4)",
            }}
          >
            ❄ North Pole User Command Center
          </h2>
          <p className="text-light opacity-75">
            Monitor & manage all registered elves, operators, and administrators.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 shadow-sm"
          style={{
            borderRadius: 14,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div
                className="input-group"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                }}
              >
                <span className="input-group-text bg-transparent border-0 text-light">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control bg-transparent border-0 text-light"
                  placeholder="Search elves & admins..."
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <Button
                className="px-3 d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #74c0fc, #4dabf7)",
                  border: "none",
                  borderRadius: 10,
                }}
                onClick={openCreate}
              >
                <FaUserPlus /> Add User
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Table Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="shadow-sm"
          style={{
            borderRadius: 14,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-light mb-0">
              <thead>
                <tr
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    letterSpacing: "0.5px",
                    fontWeight: 500,
                  }}
                >
                  <th className="px-3 py-3">ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border text-info"></div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-light opacity-75">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((u) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="px-3">{u.id}</td>
                      <td className="fw-semibold">{u.username}</td>
                      <td>{u.fullName}</td>
                      <td className="opacity-75">{u.email}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td>
                        <Badge
                          bg={u.status === "ACTIVE" ? "success" : "warning"}
                          className="px-3 py-1"
                          style={{ borderRadius: 10 }}
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="text-end px-3">
                        <Button
                          size="sm"
                          variant="outline-info"
                          className="me-2"
                          style={{ borderRadius: 8 }}
                          onClick={() => {
                            setEditing(u);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline-danger"
                          style={{ borderRadius: 8 }}
                          disabled={deletingId === u.id}
                          onClick={() => deleteUser(u.id)}
                        >
                          {deletingId === u.id ? "..." : <FaTrash />}
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal */}
        <Modal
          centered
          show={showModal}
          onHide={() => setShowModal(false)}
          contentClassName="glass-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {editing?.id ? "Edit User" : "Create User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  value={editing?.username || ""}
                  onChange={(e) =>
                    setEditing({ ...editing!, username: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={editing?.fullName || ""}
                  onChange={(e) =>
                    setEditing({ ...editing!, fullName: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editing?.email || ""}
                  onChange={(e) =>
                    setEditing({ ...editing!, email: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={editing?.role}
                  onChange={(e) =>
                    setEditing({
                      ...editing!,
                      role: e.target.value as User["role"],
                    })
                  }
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="GUEST">Guest</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editing?.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing!,
                      status: e.target.value as User["status"],
                    })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" disabled={saving} onClick={saveUser}>
              {saving ? "Saving..." : editing?.id ? "Update" : "Create"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
}
