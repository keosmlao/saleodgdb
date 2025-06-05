import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api'
const getColor = (value) => {
  if (value >= 2000000) return '#28a745';
  if (value >= 1000000) return '#ffc107';
  return '#dc3545';
};

const format = (val) => val.toLocaleString() + ' ฿';

export default function TopProductsByZoneChart() {
  const [zone, setZone] = useState('all');
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api
      .get(`/all/top10-product-by-area`)
      .then((res) => {
        const data = res.data?.[period]?.[zone] || [];
        const sum = data.reduce((acc, item) => acc + item.total, 0);
        const withPercent = data.map((item) => ({
          ...item,
          percent: ((item.total / sum) * 100).toFixed(1),
        }));
        setChartData(withPercent);
        setTotal(sum);
      });
  }, [zone, period]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Top_${period}_${zone}`);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `Top_${period}_${zone}.xlsx`);
  };

  const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
      {value}
    </text>
  );

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-danger mb-0" style={{ fontSize: '15px', fontWeight: 'bold' }}>📦 ສິນຄ້າຂາຍດີແບ່ງຕາມໂຊນ</h5>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm w-auto" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="month" style={{ fontSize: '10px' }}>ເດືອນ</option>
            <option value="quarter" style={{ fontSize: '10px' }}>ໄຕມາດ</option>
            <option value="year" style={{ fontSize: '10px' }}>ປີ</option>
          </select>
          <select className="form-select form-select-sm w-auto" value={zone} onChange={(e) => setZone(e.target.value)} style={{ fontSize: '10px' }}>
            {[
              { name: 'ALL ZONE', code: 'all' },
              { name: 'ZONE A', code: 11 },
              { name: 'ZONE B', code: 12 },
              { name: 'ZONE C', code: 13 },
              { name: 'ZONE D', code: 14 },
              { name: 'ZONE E', code: 15 },
              { name: 'ZONE F', code: 16 }
            ].map((z) => (
              <option key={z.code} value={z.code}>{z.name}</option>
            ))}
          </select>

          <select className="form-select form-select-sm w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="bar" style={{ fontSize: '10px' }}>Bar</option>
            <option value="pie" style={{ fontSize: '10px' }}>Pie</option>
          </select>
          {/* <button className="btn btn-sm btn-outline-secondary" onClick={handleExport}>📤 Export Excel</button> */}
        </div>
      </div>

      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={430}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={v => v.toLocaleString()} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={format} />
            <Bar dataKey="total" fill="#06ab9b" barSize={20}>
              <LabelList dataKey="name" content={<CustomTopLabel />} position="left" />
              <LabelList dataKey="total" position="insideMiddle" formatter={(v) => v.toLocaleString()} style={{ fill: '#fff', fontSize: 10 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartType === 'pie' && (
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, percent }) => `${name} (${percent}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.total)} />
              ))}
            </Pie>
            <Tooltip formatter={format} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="text-end text-muted small mt-2">
        ລວມຍອດ: {total.toLocaleString()} ₭
      </div>
    </div>
  );
}
