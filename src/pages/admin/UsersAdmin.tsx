// src/pages/admin/UsersAdmin.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaUserPlus, FaSearch } from "react-icons/fa";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api/axios";
import { toast } from "react-toastify";

type User = {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN" | "GUEST";
  status: "ACTIVE" | "SUSPENDED";
  createdAt?: string;
};

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real endpoint
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({
      username: "",
      email: "",
      fullName: "",
      role: "USER",
      status: "ACTIVE"
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      if (editing.id) {
        await api.put(`/admin/users/${editing.id}`, editing);
        toast.success("User updated successfully");
      } else {
        await api.post("/admin/users", editing);
        toast.success("User created successfully");
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error("Failed to save user");
      console.error(err);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="mb-1">User Management</h2>
        <p className="text-muted">Manage system users and permissions</p>
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: 16 }}
      >
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-end">
              <Button
                variant="primary"
                onClick={handleCreate}
                className="d-inline-flex align-items-center gap-2"
              >
                <FaUserPlus /> Create User
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
                  <th className="border-0 py-3">Username</th>
                  <th className="border-0 py-3">Full Name</th>
                  <th className="border-0 py-3">Email</th>
                  <th className="border-0 py-3">Role</th>
                  <th className="border-0 py-3">Status</th>
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <td className="px-4">{user.id}</td>
                      <td className="fw-semibold">{user.username}</td>
                      <td>{user.fullName}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <Badge
                          bg={
                            user.role === "ADMIN"
                              ? "danger"
                              : user.role === "USER"
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge
                          bg={user.status === "ACTIVE" ? "success" : "warning"}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="text-end px-4">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(user.id)}
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

      {/* Edit/Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
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
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={editing?.fullName || ""}
                onChange={(e) =>
                  setEditing({ ...editing!, fullName: e.target.value })
                }
                placeholder="Enter full name"
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
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editing?.role || "USER"}
                onChange={(e) =>
                  setEditing({
                    ...editing!,
                    role: e.target.value as User["role"]
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
                value={editing?.status || "ACTIVE"}
                onChange={(e) =>
                  setEditing({
                    ...editing!,
                    status: e.target.value as User["status"]
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
          <Button variant="primary" onClick={handleSave}>
            {editing?.id ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}