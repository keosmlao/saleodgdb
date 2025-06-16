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
      console.log("response", res)
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
    <div className="py-4">
      <h4 className="font-bold text-primary">📡 User Status with Last Login</h4>
      <div className="overflow-x-auto border rounded-2xl mt-2">
        {usersStatus.length > 0 ? (
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Online</th>
                <th className="px-4 py-3">Last Login</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {usersStatus.map((user) => (
                <tr key={user.user_id || user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-500'
                        }`}
                    ></span>
                  </td>
                  <td className="px-4 py-3 text-white font-semibold">
                    👤 {user.username || 'Unknown'} ({user.status || 'offline'})
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${user.status === 'online' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {(user.status || 'OFFLINE').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-white">
                    {user.last_login ? formatDateTime(user.last_login) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted px-4 py-4">ไม่มีข้อมูลผู้ใช้.</p>
        )}
      </div>
    </div>
  );
}
