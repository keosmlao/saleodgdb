import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProvinceSalesComparison() {
  const [period, setPeriod] = useState('thisMonth');
  const [buList, setBuList] = useState([]);
  const [selectedBU, setSelectedBU] = useState('all');
  const [dataByPeriod, setDataByPeriod] = useState({
    thisMonth: [], lastMonth: [], fullYear: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = [{ code: 'all', name_1: '📦 All BU' }, ...res.data];
        setBuList(list);
      })
      .catch(err => console.error('Error loading BU list:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/all/province', {
      params: selectedBU !== 'all' ? { bu_code: selectedBU } : {}
    })
      .then(res => {
        const mapData = (items) =>
          items.map(item => ({
            province: item.province_name || 'ບໍ່ລະບຸ',
            sales: parseFloat(item.this_year || 0),
            lastYear: parseFloat(item.last_year || 0)
          }));
        setDataByPeriod({
          thisMonth: mapData(res.data.thisMonth),
          lastMonth: mapData(res.data.lastMonth),
          fullYear: mapData(res.data.fullyear)
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedBU]);

  if (loading) return <div className="text-center py-5 text-lg">⏳ Loading...</div>;

  return (
      <div className="bg-white p-2 shadow rounded-lg mb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mb-4">
          <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">  📊 ຍອດຂາຍຕາມແຂວງ ({period === 'thisMonth' ? 'ເດືອນນີ້' : period === 'lastMonth' ? 'ເດືອນກ່ອນ' : 'ທັງປີ'})</h5>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
                value={selectedBU}
                onChange={e => setSelectedBU(e.target.value)}
                className="text-[10px] w-full sm:w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {buList.map(bu => (
                  <option key={bu.code} value={bu.code}>
                    {bu.name_1}
                  </option>
              ))}
            </select>

            <select
                value={period}
                onChange={e => setPeriod(e.target.value)}
                className="text-[10px] w-full sm:w-40 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="thisMonth">ເດືອນນີ້</option>
              <option value="lastMonth">ເດືອນກ່ອນ</option>
              <option value="fullYear">ທັງປີ</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={800}>
          <BarChart data={dataByPeriod[period]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={v => v.toLocaleString()} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="province" width={120} tick={{ fontSize: 10 }} />
            <Tooltip formatter={v => parseFloat(v).toLocaleString() + ' ฿'} wrapperStyle={{ fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="sales" fill="#06ab9b" name="💰 ຍອດຂາຍ" />
            <Bar dataKey="lastYear" fill="#dc3545" name="📆 ປີຜ່ານມາ" />
          </BarChart>
        </ResponsiveContainer>
      </div>

  );
}
