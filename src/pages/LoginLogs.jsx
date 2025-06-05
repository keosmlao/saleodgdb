import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Spinner, Table, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export default function LoginLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/login-logs')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setLogs(data);
      })
      .catch((err) => {
        console.error('❌ Failed to load logs:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h3 className="text-danger fw-bold">📜 ປະຫວັດການເຂົ້າລະບົບ</h3>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
            ⬅️ ກັບຄືນ
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="danger" />
          <div className="text-secondary mt-2">ກຳລັງໂຫຼດ...</div>
        </div>
      ) : logs.length > 0 ? (
        <div className="table-responsive shadow rounded border border-danger">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-danger text-center">
              <tr>
                <th>#</th>
                <th>👤 Username</th>
                <th>🕒 Login Time</th>
                <th>📱 Device ID</th>
                <th>🌐 IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={log.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{log.username}</td>
                  <td>{new Date(log.login_time).toLocaleString()}</td>
                  <td>{log.device_id || 'N/A'}</td>
                  <td>{log.ip_address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="danger" className="text-center">
          ບໍ່ມີຂໍ້ມູນປະຫວັດການເຂົ້າລະບົບ.
        </Alert>
      )}
    </Container>
  );
}
