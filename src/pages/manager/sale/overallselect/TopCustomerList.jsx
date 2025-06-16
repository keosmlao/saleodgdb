import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
const formatNumber = v => {
  const num = parseInt(Number(v).toFixed(0), 10);
  return num.toLocaleString('en-US') + ' ฿';
};
const formatPercent = (num) => num ? `${parseFloat(num).toFixed(1)}%` : '0%';
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

  const SmartInsideLabel = ({ barKey }) => (props) => {
    const { x, y, width, height, value } = props;

    // Only show if bar is wide enough
    if (width < 60) return null;

    return (
      <text
        x={x + width - 8}
        y={y + height / 2}
        textAnchor="end"
        dominantBaseline="middle"
        style={{
          fontSize: '8px',
          fill: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '600',
        }}
      >
        {formatNumber(value)}
      </text>
    );
  };

  useEffect(() => {
    api.get(`/all/top-customers?filter=${filter}&area=${zone}&bu=${bu}`)
      .then(res => {
        const raw = res.data?.list || [];
        const totalSum = raw.reduce((sum, c) => sum + Number(c.total_2025 || 0), 0);
        setData(raw.map((item, index) => {
          const total = Number(item.total_2025 || 0);
          const total_24 = Number(item.total_2024 || 0);
          const target = Number(item.target || 0);
          const percentcompare = total_24 > 0 ? (total / total_24) * 100 : 0;
          return {
            name: item.cust_name || 'ไม่ทราบ',
            total, total_24, target,
            percentcompare: percentcompare.toFixed(1),
            color: COLORS[index % COLORS.length]
          };
        }));
      })
      .catch(err => { console.error('❌ Load API failed:', err); setData([]); });
  }, [filter, zone, bu]);


  return (
    <div className="bg-white p-2 mb-2 rounded-sm shadow-sm font-[Noto_Sans_Lao]" style={{ height: "700px" }}>
      <div className="flex justify-between items-center mb-3 flex-wrap text-[12px]">
        <h5 className="text-red-600 font-bold font-[Noto_Sans_Lao] text-[12px]">
          🏆 ຮ້ານຄ້າທີ່ມີຍອດຊື້ສູງສຸດ (Top 10)
        </h5>
        <div className="flex items-center gap-2 flex-wrap">

          <div className="flex items-center gap-1">
            <label className="font-bold">🔍 BU:</label>
            <select
              className="text-sm border rounded px-2 py-1 w-[130px]"
              value={bu}
              onChange={(e) => setBu(e.target.value)}
            >
              {buList.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name_1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <label className="font-bold">🌍 ຂອບເຂດ:</label>
            <select
              className="text-sm border rounded px-2 py-1 w-[130px]"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              {[
                { code: 'all', name_1: 'ທຸກ ZONE' },
                { code: 11, name_1: 'ZONE A' },
                { code: 12, name_1: 'ZONE B' },
                { code: 13, name_1: 'ZONE C' },
                { code: 14, name_1: 'ZONE D' },
                { code: 15, name_1: 'ZONE E' },
                { code: 16, name_1: 'ZONE F' },
              ].map((z) => (
                <option key={z.code} value={z.code}>
                  {z.name_1}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <label className="font-bold">📅 ໄລຍະເວລາ:</label>
            <select
              className="text-sm border rounded px-2 py-1 w-[130px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="month">ເດືອນນີ້</option>
              <option value="lastMonth">ເດືອນຜ່ານມາ</option>
              <option value="accumulated">ສະສົມ</option>
              <option value="year">ປີນີ້</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <label className="font-bold">📊 ຮູບແບບ:</label>
            <div className="ml-2 inline-flex rounded overflow-hidden border text-[12px]">
              <button
                className={`px-3 py-1 ${viewMode === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border-r'
                  }`}
                onClick={() => setViewMode('all')}
              >
                ທັງໝົດ
              </button>
              <button
                className={`px-3 py-1 ${viewMode === 'chart'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border-r'
                  }`}
                onClick={() => setViewMode('chart')}
              >
                Chart
              </button>
              <button
                className={`px-3 py-1 ${viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600'
                  }`}
                onClick={() => setViewMode('table')}
              >
                ຕາຕະລາງ
              </button>
            </div>
          </div>

        </div>
      </div>


      {(viewMode === 'chart' || viewMode === 'all') && (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical" barGap={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={(val, name, props) => {
              const item = data.find(d => d.name === props.payload.name);
              return [`${format(val)} (Compare: ${formatPercent(item?.percentcompare)})`, name];
            }} fontSize={9} />
            <Legend />
            <Bar dataKey="total" name="📆 ປີນີ້" fill="#06ab9b" barSize={10}>
              <LabelList dataKey="name" content={<CustomTopLabel />} />
              <LabelList dataKey="percentcompare" position="right" formatter={formatPercent} style={{ fontSize: 10 }} />
              <LabelList dataKey="total" content={SmartInsideLabel({ barKey: 'total' })} position="insideRight" formatter={formatNumber} style={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total_24" name="📅 ປີຜ່ານມາ" fill="#DE5E57" barSize={10} >
              <LabelList dataKey="total_24" position="insideRight" content={SmartInsideLabel({ barKey: 'total' })} formatter={formatNumber} style={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {(viewMode === 'pie') && (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" outerRadius={140} label={({ name, percent }) => `${name}: ${percent}%`}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(val, name, props) => {
              const item = data.find(d => d.name === props.payload.name);
              return [`${format(val)} (Compare: ${formatPercent(item?.percentcompare)})`, name];
            }} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      )}

      {(viewMode === 'table' || viewMode === 'all') && (
        <div className="overflow-x-auto mt-3">
          <table className="min-w-[700px] w-full border text-center text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">ຮ້ານຄ້າ</th>
                <th className="border px-2 py-1">📆 ປີນີ້</th>
                <th className="border px-2 py-1">📅 ປີກ່ອນ</th>
                <th className="border px-2 py-1">% ຍອດຂາຍ/ທຽບປີກ່ອນ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1 text-left font-[Noto_Sans_Lao]">{row.name}</td>
                  <td className="border px-2 py-1">{formatNumber(row.total)}</td>
                  <td className="border px-2 py-1">{formatNumber(row.total_24)}</td>
                  <td className="border px-2 py-1">{formatPercent(row.percentcompare)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
