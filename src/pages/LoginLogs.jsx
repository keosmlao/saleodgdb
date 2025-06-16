import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Spin, Alert, Typography, Space, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title } = Typography;
const { Search } = Input;

export default function LoginLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [userFilter, setUserFilter] = useState('');
  const itemsPerPage = 10;
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

  // Filter logs by username
  const filteredLogs = useMemo(() => {
    return logs.filter(log =>
      log.username.toLowerCase().includes(userFilter.toLowerCase())
    );
  }, [logs, userFilter]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_text, _record, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: '👤 Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '🕒 Login Time',
      dataIndex: 'login_time',
      key: 'login_time',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: '📱 Device ID',
      dataIndex: 'device_id',
      key: 'device_id',
      render: (text) => text || 'N/A',
    },
    {
      title: '🌐 IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (text) => text || 'N/A',
    },
  ];

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [userFilter]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="backdrop-blur-lg w-full rounded-2xl p-6 shadow-xl mx-auto">
        <Space
          className="w-full justify-between items-center mb-6"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Title level={3} className="!text-white !mb-0">
            📜 ປະຫວັດການເຂົ້າລະບົບ
          </Title>
          <Button onClick={() => navigate(-1)} type="default">
            ⬅️ ກັບຄືນ
          </Button>
        </Space>

        <Search
          placeholder="ຄົ້ນຫາຜູ້ໃຊ້..."
          allowClear
          enterButton="Search"
          size="middle"
          className="mb-4 max-w-xs"
          onSearch={value => setUserFilter(value)}
          onChange={e => setUserFilter(e.target.value)}
          value={userFilter}
        />

        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" tip="ກຳລັງໂຫຼດ..." />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="bg-white rounded-lg overflow-hidde">
            <Table
              columns={columns}
              dataSource={filteredLogs}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: itemsPerPage,
                total: filteredLogs.length,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
              }}
              className="rounded-lg"
            />
          </div>
        ) : (
          <Alert
            type="error"
            message="ບໍ່ພົບຜູ້ໃຊ້ຕາມການຄົ້ນຫາ."
            className="text-center"
          />
        )}
      </div>
    </div>
  );
}
