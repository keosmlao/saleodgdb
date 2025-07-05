import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function ProvinceSalesComparison() {
  const [period, setPeriod] = useState('thisMonth');
  const [buList, setBuList] = useState([]);
  const [selectedBU, setSelectedBU] = useState('all');
  const [dataByPeriod, setDataByPeriod] = useState({
    thisMonth: [], lastMonth: [], fullYear: []
  });
  const formatNumber = v => {
    const num = Math.round(Number(v));
    return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿';
  };

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = [{ code: 'all', name_1: '📦 All BU' }, ...res.data];
        setBuList(list);
      })
      .catch(err => console.error('Error loading BU list:', err));
  }, []);

  useEffect(() => {
    const params = {};
    if (selectedBU !== 'all') params.bu_code = selectedBU;

    api.get('/all/province', { params })
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
      .catch(err => console.error(err));
  }, [selectedBU]);


  return (
    <div className="bg-white p-2 rounded-lg mb-2 font-[Noto_Sans_Lao]">
      <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">  📊 ຍອດຂາຍຕາມແຂວງ</h5>
      <div className="flex flex-wrap gap-2 mb-3 items-center text-[12px] font-[Noto_Sans_Lao]">
        <label className="font-bold text-[14px]">🔍 BU:</label>
        <select
          value={selectedBU}
          onChange={e => setSelectedBU(e.target.value)}
          className="text-sm border rounded px-2 py-1 w-[130px]"
        >
          {buList.map(bu => (
            <option key={bu.code} value={bu.code}>
              {bu.name_1}
            </option>
          ))}
        </select>
        <label className="font-bold ">📅 ໄລຍະເວລາ:</label>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="text-sm border rounded px-2 py-1 w-[130px]"
        >
          <option value="thisMonth">ເດືອນນີ້</option>
          <option value="lastMonth">ເດືອນກ່ອນ</option>
          <option value="fullYear">ທັງປີ</option>
        </select>
      </div>


      <ResponsiveContainer width="100%" height={800}>
        <BarChart data={dataByPeriod[period]} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={v => v.toLocaleString()} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="province" width={120} tick={{ fontSize: 10 }} />
          <Tooltip formatter={v => parseFloat(v).toLocaleString() + ' ฿'} wrapperStyle={{ fontSize: '10px' }} />
          <Legend />
          <Bar dataKey="sales" fill="#06ab9b" name="💰 ຍອດຂາຍ" barSize={20}>

          </Bar>
          <Bar dataKey="lastYear" fill="#dc3545" name="📆 ປີຜ່ານມາ" barSize={20}>

          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

  );
}
