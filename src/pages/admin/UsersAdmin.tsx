// src/pages/admin/UsersAdmin.tsx - NORTH POLE USER COMMAND CENTER EXTRA FESTIVE EDITION
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserPlus,
  FaSearch,
  FaCrown,
  FaUserShield,
  FaTrash,
  FaEdit,
  FaSnowflake,
} from "react-icons/fa";
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

// ❄️ Snowflake
const Snowflake = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="position-absolute"
    style={{
      left: `${10 + Math.random() * 80}%`,
      top: -20,
      fontSize: `${12 + Math.random() * 8}px`,
      pointerEvents: "none",
      zIndex: 1,
      color: "rgba(255,255,255,0.65)",
      filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
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
      duration: 18 + Math.random() * 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {emoji}
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
        toast.success("🎄 User updated!");
      } else {
        await api.post("/admin/users", editing);
        toast.success("🎁 User created!");
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
      toast.success("🎁 User deleted!");
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
        <span
          className="badge px-3 py-1 d-inline-flex align-items-center gap-1"
          style={{
            background: "linear-gradient(135deg, #ff6b6b, #c92a2a)",
            borderRadius: 10,
            color: "white",
          }}
        >
          <FaCrown /> Admin
        </span>
      );
    if (role === "USER")
      return (
        <span
          className="badge px-3 py-1 d-inline-flex align-items-center gap-1"
          style={{
            background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
            borderRadius: 10,
            color: "white",
          }}
        >
          <FaUserShield /> User
        </span>
      );
    return (
      <span
        className="badge px-3 py-1"
        style={{
          background: "rgba(148,163,184,0.3)",
          borderRadius: 10,
          color: "#94a3b8",
        }}
      >
        Guest
      </span>
    );
  };

  return (
    <AdminLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100%",
          paddingBottom: "40px",
          background: "linear-gradient(180deg, #0a1929 0%, #0f172a 100%)",
        }}
      >
        {/* Snowflakes */}
        {[...Array(28)].map((_, i) => (
          <Snowflake key={`snow-${i}`} delay={i * 0.4} />
        ))}

        {/* Christmas Particles */}
        {[...Array(6)].map((_, i) => (
          <ChristmasParticle
            key={`xmas-${i}`}
            delay={i * 3}
            emoji={["👥", "🎄", "⭐", "🎁", "❄️", "🔔"][i]}
          />
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
          <motion.h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            animate={{
              textShadow: [
                "0px 0px 12px rgba(173,230,255,0.4)",
                "0px 0px 24px rgba(173,230,255,0.6)",
                "0px 0px 12px rgba(173,230,255,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: "white" }}
          >
            <FaSnowflake className="text-info" />
            North Pole User Command Center
          </motion.h2>
          <p className="text-light opacity-75 mb-0">
            Monitor & manage all registered elves, operators, and administrators.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4 px-2" style={{ position: "relative", zIndex: 2 }}>
          {[
            {
              label: "Total Users",
              value: users.length,
              color: "#67e8f9",
              icon: "👥",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "ADMIN").length,
              color: "#ff6b6b",
              icon: "👑",
            },
            {
              label: "Active",
              value: users.filter((u) => u.status === "ACTIVE").length,
              color: "#10b981",
              icon: "✅",
            },
            {
              label: "Suspended",
              value: users.filter((u) => u.status === "SUSPENDED").length,
              color: "#f59e0b",
              icon: "⏸️",
            },
          ].map((stat, i) => (
            <div key={i} className="col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-3"
                style={{
                  borderRadius: 16,
                  background: `${stat.color}15`,
                  border: `2px solid ${stat.color}40`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 52,
                      height: 52,
                      background: `${stat.color}30`,
                      fontSize: "26px",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-light small opacity-75">
                      {stat.label}
                    </div>
                    <div
                      className="h3 mb-0 fw-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 shadow-sm mx-2"
          style={{
            borderRadius: 14,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div
                className="input-group"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  overflow: "hidden",
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
                  style={{ outline: "none" }}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn px-4 py-2 d-inline-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #74c0fc, #4dabf7)",
                  border: "none",
                  borderRadius: 10,
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 0 20px rgba(116,192,252,0.4)",
                }}
                onClick={openCreate}
              >
                <FaUserPlus /> Add User
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Table Panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="shadow-sm mx-2"
          style={{
            borderRadius: 14,
            overflow: "hidden",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            position: "relative",
            zIndex: 2,
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
                  <th className="px-3 py-3 border-0">ID</th>
                  <th className="border-0">Username</th>
                  <th className="border-0">Full Name</th>
                  <th className="border-0">Email</th>
                  <th className="border-0">Role</th>
                  <th className="border-0">Status</th>
                  <th className="text-end px-3 border-0">Actions</th>
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
                      <div style={{ fontSize: "3rem" }}>🎄</div>
                      <div className="mt-2">No users found.</div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="px-3">
                        <span
                          className="badge px-2 py-1"
                          style={{
                            background: "rgba(103,232,249,0.2)",
                            color: "#67e8f9",
                          }}
                        >
                          #{u.id}
                        </span>
                      </td>
                      <td className="fw-semibold">{u.username}</td>
                      <td>{u.fullName}</td>
                      <td className="opacity-75">{u.email}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td>
                        <span
                          className="badge px-3 py-1"
                          style={{
                            background:
                              u.status === "ACTIVE"
                                ? "rgba(16,185,129,0.2)"
                                : "rgba(245,158,11,0.2)",
                            color: u.status === "ACTIVE" ? "#10b981" : "#f59e0b",
                            borderRadius: 10,
                          }}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="text-end px-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-sm me-2"
                          style={{
                            borderRadius: 8,
                            background: "rgba(14,165,233,0.2)",
                            border: "1px solid #0ea5e9",
                            color: "#0ea5e9",
                          }}
                          onClick={() => {
                            setEditing(u);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-sm"
                          style={{
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            border: "none",
                            color: "white",
                          }}
                          disabled={deletingId === u.id}
                          onClick={() => deleteUser(u.id)}
                        >
                          {deletingId === u.id ? "..." : <FaTrash />}
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
            🎅 Managing {filteredData.length} user{filteredData.length !== 1 ? "s" : ""} · 
            North Pole Command Center ❄️
          </small>
        </motion.div>
      </div>

      {/* Modal */}
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
                  border: "2px solid rgba(103,232,249,0.3)",
                  borderRadius: 16,
                }}
              >
                {/* Candy Cane Border */}
                <div
                  className="position-absolute top-0 start-0 w-100"
                  style={{
                    height: 6,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    background:
                      "repeating-linear-gradient(90deg, #67e8f9 0px, #67e8f9 15px, #fff 15px, #fff 30px)",
                  }}
                />

                <div className="modal-header border-0 pt-4">
                  <h5 className="modal-title fw-bold">
                    {editing?.id ? "Edit User" : "Create User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      className="form-control"
                      value={editing?.username || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, username: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        color: "white",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      className="form-control"
                      value={editing?.fullName || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, fullName: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        color: "white",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editing?.email || ""}
                      onChange={(e) =>
                        setEditing({ ...editing!, email: e.target.value })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        color: "white",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={editing?.role}
                      onChange={(e) =>
                        setEditing({
                          ...editing!,
                          role: e.target.value as User["role"],
                        })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        color: "white",
                      }}
                    >
                      <option value="USER" style={{ background: "#1a2332" }}>User</option>
                      <option value="ADMIN" style={{ background: "#1a2332" }}>Admin</option>
                      <option value="GUEST" style={{ background: "#1a2332" }}>Guest</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      className="form-select"
                      value={editing?.status}
                      onChange={(e) =>
                        setEditing({
                          ...editing!,
                          status: e.target.value as User["status"],
                        })
                      }
                      style={{
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        color: "white",
                      }}
                    >
                      <option value="ACTIVE" style={{ background: "#1a2332" }}>Active</option>
                      <option value="SUSPENDED" style={{ background: "#1a2332" }}>Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-0 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn px-4 py-2"
                    disabled={saving}
                    onClick={saveUser}
                    style={{
                      background: "linear-gradient(135deg, #74c0fc, #4dabf7)",
                      border: "none",
                      borderRadius: 10,
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    {saving ? "Saving..." : editing?.id ? "Update" : "Create"}
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