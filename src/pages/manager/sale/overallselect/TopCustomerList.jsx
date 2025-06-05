import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
const formatNumber = (num) => Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const formatPercent = (num) => num ? `${parseFloat(num).toFixed(1)}%` : '0%';
const CustomTopLabel = ({ x, y, value }) => <text x={x} y={y - 2} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>{value}</text>;

export default function TopCustomerListWithChart() {
  const [filter, setFilter] = useState('accumulated');
  const [chartType, setChartType] = useState('bar');
  const [data, setData] = useState([]);
  const [zone, setZone] = useState('all');
  const [bu, setBu] = useState('all');
  const [buList, setBuList] = useState([{ code: 'all', name_1: 'ທຸກ BU' }]);

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = res.data || [];
        setBuList([{ code: 'all', name_1: 'ທຸກ BU' }, ...list]);
      })
      .catch(err => console.error('❌ Load BU list failed:', err));
  }, []);

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
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-danger fw-bold mb-0" style={{ fontSize: '15px', fontFamily: 'Noto Sans Lao' }}>🏆 ຮ້ານຄ້າທີ່ມີຍອດຊື້ສູງສຸດ (Top 10)</h5>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm w-auto" value={zone} onChange={(e) => setZone(e.target.value)}>
            {[{ code: 'all', name_1: 'ທຸກ ZONE' }, { code: 11, name_1: 'ZONE A' }, { code: 12, name_1: 'ZONE B' }, { code: 13, name_1: 'ZONE C' },
            { code: 14, name_1: 'ZONE D' }, { code: 15, name_1: 'ZONE E' }, { code: 16, name_1: 'ZONE F' }]
              .map(z => <option key={z.code} value={z.code}>{z.name_1}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto" value={bu} onChange={(e) => setBu(e.target.value)}>
            {buList.map(b => <option key={b.code} value={b.code}>{b.name_1}</option>)}
          </select>
          <select className="form-select form-select-sm w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="month">ເດືອນນີ້</option><option value="lastMonth">ເດືອນຜ່ານມາ</option><option value="accumulated">ສະສົມ</option><option value="year">ປີນີ້</option>
          </select>
          <select className="form-select form-select-sm w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">BarChart</option><option value="pie">PieChart</option><option value="table">Table</option>
          </select>
        </div>
      </div>
      {chartType === 'bar' && (
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
              <LabelList dataKey="total" position="insideRight" formatter={formatNumber} style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total_24" name="📅 ປີຜ່ານມາ" fill="#DE5E57" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      )}
      {chartType === 'pie' && (
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
      {chartType === 'table' && (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>ຮ້ານຄ້າ</th
                ><th>📆 ປີນີ້</th>
                {/* <th>🎯 Target</th> */}
                <th>📅 ປີກ່ອນ</th>
                <th>% ຍອດຂາຍ/ທຽບປີກ່ອນ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className='text-start' style={{ fontFamily: 'Noto Sans Lao' }}>{row.name}</td>
                  <td>{formatNumber(row.total)}</td>
                  {/* <td>{formatNumber(row.target)}</td> */}
                  <td>{formatNumber(row.total_24)}</td>
                  <td>{formatPercent(row.percentcompare)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
