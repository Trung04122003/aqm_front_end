import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

type Sensor = { id?: number; name: string; lat: number; lng: number; description?: string };

export default function SensorsAdmin() {
  const [list, setList] = useState<Sensor[]>([]);
  const [, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/admin/thresholds"); // adjust endpoint
      setList(res.data || []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing({ name: "", lat: 21.0, lng: 105.8 }); setShow(true); };
  const openEdit = (s: Sensor) => { setEditing(s); setShow(true); };

  const save = async () => {
    if (!editing) return;
    if (editing.id) await api.put(`/admin/thresholds/${editing.id}`, editing);
    else await api.post(`/admin/thresholds`, editing);
    setShow(false);
    load();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete Alert Threshold?")) return;
    await api.delete(`/admin/thresholds/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Alert Thresholds</h4>
        <Button onClick={openCreate}>Create Alert Threshold</Button>
      </div>
      <Table striped hover>
        <thead><tr><th>ID</th><th>Name</th><th>Lat</th><th>Lng</th><th></th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.name}</td><td>{s.lat}</td><td>{s.lng}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => openEdit(s)}>Edit</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => remove(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>{editing?.id ? "Edit Alert Threshold" : "Create Alert Threshold"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editing?.name || ""} onChange={(e) => setEditing({...editing!, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Latitude</Form.Label>
              <Form.Control type="number" value={editing?.lat} onChange={(e) => setEditing({...editing!, lat: Number(e.target.value)})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Longitude</Form.Label>
              <Form.Control type="number" value={editing?.lng} onChange={(e) => setEditing({...editing!, lng: Number(e.target.value)})} />
            </Form.Group>
            <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} value={editing?.description || ""} onChange={(e)=>setEditing({...editing!, description:e.target.value})} /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
