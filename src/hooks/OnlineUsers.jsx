import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '../services/api';  // axios instance for REST API

const SOCKET_SERVER_URL = 'http://119.59.124.56:5000';

export default function OnlineUsers({ user_id, username }) {
  const [usersStatus, setUsersStatus] = useState([]);
  console.log("user status", usersStatus)

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });

    if (user_id && username) {
      socket.emit('user-online', { user_id, username });
    }

    socket.on('update-online-users', fetchUsersStatus);
    fetchUsersStatus();

    return () => socket.disconnect();
  }, [user_id, username]);

  const fetchUsersStatus = async () => {
    try {
      const res = await api.get('/all-users-status');
      console.log("response" , res )
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setUsersStatus(data);
    } catch (err) {
      console.error('Error fetching users status:', err);
      setUsersStatus([]);  // กำหนดเป็นอาร์เรย์ว่าง ป้องกัน map error
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className=" py-4">
      <h4 className="fw-bold text-primary">📡 User Status with Last Login</h4>
      <div className="border rounded-2xl ">
        <div className="">
          {usersStatus.length > 0 ? (
            <ul className="list-group list-group-flush">
              {usersStatus.map((user) => (
                <li key={user.user_id || user.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            user.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-500'
                        }`}
                    ></div>
                    <span className="fw-semibold">
                      👤 {user.username || 'Unknown'} ({user.status || 'offline'})
                    </span>
                    <span className={`badge rounded-pill ${user.status === 'online' ? 'bg-success' : 'bg-secondary'}`}>
                      {(user.status || 'OFFLINE').toUpperCase()}
                    </span>
                  </div>
                  <small className="text-muted">
                    Last Login: {user.last_login ? formatDateTime(user.last_login) : 'N/A'}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">ไม่มีข้อมูลผู้ใช้.</p>
          )}
        </div>
      </div>
    </div>
  );
}
