import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US') + ' ฿';
const formatNumber = v => {
  const num = parseInt(Number(v).toFixed(0), 10);
  return num.toLocaleString('en-US') + ' ฿';
};
const CustomTopLabel = ({ x, y, value }) => <text x={x} y={y - 2} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>{value}</text>;

export default function TopCustomerListWithChart() {
  const [filter, setFilter] = useState('accumulated');
  const [viewMode, setViewMode] = useState('chart');
  const [data, setData] = useState([]);
  const [zone, setZone] = useState('all');
  const [bu, setBu] = useState('all');
  const [buList, setBuList] = useState([{ code: 'all', name_1: '📦 ທຸກ BU' }]);

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = res.data || [];
        setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...list]);
      })
      .catch(err => console.error('❌ Load BU list failed:', err));
  }, []);

  useEffect(() => {
    api.get(`/all/top-products?filter=${filter}&zone=${zone}&bu=${bu}`)
      .then(res => {
        const raw = res.data?.list || [];
        const totalSum = raw.reduce((sum, c) => sum + Number(c.total_2025 || 0), 0);
        setData(raw.map((item, index) => ({
          name: item.item_name || 'ບໍຮູ້ຊື່', total: Number(item.total_2025 || 0), total_24: Number(item.total_2024 || 0), target: Number(item.target || 0),
          percent: totalSum > 0 ? ((item.total_2025 / totalSum) * 100).toFixed(1) : 0, color: COLORS[index % COLORS.length]
        })));
      })
      .catch(err => { console.error('❌ Load API failed:', err); setData([]); });
  }, [filter, zone, bu]);

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" barGap={30}>
            <CartesianGrid strokeDasharray="3 3" fontSize={9} />
            <XAxis type="number" tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" hide fontSize={9} />
            <Tooltip formatter={formatNumber} fontSize={9} />
            <Legend />
            <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#f1c40f" barSize={10} fontSize={9} />
            <Bar dataKey="total" name="📆 ປີນີ້" fill="#06ab9b" barSize={10} fontSize={9}>
              <LabelList dataKey="name" content={<CustomTopLabel />} fontSize={9} />
              <LabelList dataKey="total" position="insideRight" formatter={formatNumber} style={{ fill: '#fff', fontSize: 9, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total_24" name="📅 ປີກ່ອນ" fill="#DE5E57" barSize={10} fontSize={9}>
              <LabelList dataKey="total_24" position="insideRight" formatter={formatNumber} style={{ fill: '#fff', fontSize: 9, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" outerRadius={140} label={({ name, percent }) => `${name}: ${percent}%`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={format} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const renderTable = () => (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-[700px] w-full border text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1 w-[30%]">ຮ້ານຄ້າ</th>
            <th className="border px-2 py-1">🎯 ເປົ້າຂາຍ</th>
            <th className="border px-2 py-1">📆 ຍອດຂາຍ</th>
            <th className="border px-2 py-1">📅 ປີຜ່ານມາ</th>
            <th className="border px-2 py-1">📊 % ປຽບທຽບປີຜ່ານມາ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-left font-[Noto_Sans_Lao]">{row.name}</td>
              <td className="border px-2 py-1">{formatNumber(row.target)}</td>
              <td className="border px-2 py-1">{formatNumber(row.total)}</td>
              <td className="border px-2 py-1">{formatNumber(row.total_24)}</td>
              <td className="border px-2 py-1">
                {row.percent >= 100 ? '▲' : '🔻'} {row.percent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white p-3 mb-2 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-3 flex-wrap">
        <h5 className="text-red-600 font-bold mb-0 text-[15px] font-[Noto_Sans_Lao]">🏆 ສີນຄ້າຍອດຊື້ສູງສຸດ (Top 10)</h5>
        <div className="flex items-center gap-2 pt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <label className="font-bold text-[14px]">🔍 BU:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={bu} onChange={(e) => setBu(e.target.value)}>
              {buList.map(b => <option key={b.code} value={b.code}>{b.name_1}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <label className="font-bold text-[14px]">🌍 ຂອບເຂດ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={zone} onChange={(e) => setZone(e.target.value)}>
              {[{ code: 'all', name_1: 'ໂຊນທັງໝົດ' }, { code: 11, name_1: 'ZONE A' }, { code: 12, name_1: 'ZONE B' }, { code: 13, name_1: 'ZONE C' },
              { code: 14, name_1: 'ZONE D' }, { code: 15, name_1: 'ZONE E' }, { code: 16, name_1: 'ZONE F' }]
                .map(z => <option key={z.code} value={z.code}>{z.name_1}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <label className="font-bold text-[14px]">📅 ໄລຍະເວລາ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="month">ເດືອນນີ້</option>
              <option value="lastMonth">ເດືອນຜ່ານມາ</option>
              <option value="accumulated">ສະສົມ</option>
              <option value="year">ປີນີ້</option>
            </select>
          </div>

          <div className="ml-2 inline-flex rounded overflow-hidden border text-sm">
            <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>

      {(viewMode === 'chart' || viewMode === 'all') && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" barGap={30}>
            <CartesianGrid strokeDasharray="3 3" fontSize={9} />
            <XAxis type="number" tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" hide fontSize={9} />
            <Tooltip formatter={formatNumber} fontSize={9} />
            <Legend />
            <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#f1c40f" barSize={10} fontSize={9} />
            <Bar dataKey="total" name="📆 ປີນີ້" fill="#06ab9b" barSize={10} fontSize={9}>
              <LabelList dataKey="name" content={<CustomTopLabel />} fontSize={9} />
              <LabelList dataKey="total" position="insideRight" formatter={formatNumber} style={{ fill: '#000', fontSize: 9, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total_24" name="📅 ປີກ່ອນ" fill="#DE5E57" barSize={10} fontSize={9}>
              <LabelList dataKey="total_24" position="insideRight" formatter={formatNumber} style={{ fill: '#000', fontSize: 9, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {viewMode === 'pie' && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" outerRadius={140} label={({ name, percent }) => `${name}: ${percent}%`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={format} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      )}

      {(viewMode === 'table' || viewMode === 'all') && (
        <div className="overflow-x-auto mt-3">
          <table className="min-w-[700px] w-full border text-center text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 w-[30%]">ຮ້ານຄ້າ</th>
                <th className="border px-2 py-1">🎯 ເປົ້າຂາຍ</th>
                <th className="border px-2 py-1">📆 ຍອດຂາຍ</th>
                <th className="border px-2 py-1">📅 ປີຜ່ານມາ</th>
                <th className="border px-2 py-1">📊 % ປຽບທຽບປີຜ່ານມາ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-left font-[Noto_Sans_Lao]">{row.name}</td>
                  <td className="border px-2 py-1">{formatNumber(row.target)}</td>
                  <td className="border px-2 py-1">{formatNumber(row.total)}</td>
                  <td className="border px-2 py-1">{formatNumber(row.total_24)}</td>
                  <td className="border px-2 py-1">
                    {row.percent >= 100 ? '▲' : '🔻'} {row.percent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
