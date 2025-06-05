import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../../services/api';

const COLORS = [
  '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14',
  '#ffc107', '#28a745', '#20c997', '#17a2b8', '#dc3545',
];

const format = (val) => Number(val).toLocaleString('en-US') + ' ₭';

const CustomTopLabel = ({ x, y, value }) => (
  <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
    {value}
  </text>
);

export default function TopSellingProductsbybu({ bu }) {
  const [filter, setFilter] = useState('year'); // 'month' | 'lastmonth' | 'year'
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'pie'
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/bu/top-productbybu/${bu}`)
      .then((res) => {
        const raw = res.data?.[filter] || [];

        const cleaned = raw.map((item) => ({
          name: item.item_name,
          total: Number(item.total_amount || 0),
        }));

        const sumTotal = cleaned.reduce((sum, p) => sum + p.total, 0);

        const withPercent = cleaned.map((p, i) => ({
          ...p,
          percent: ((p.total / sumTotal) * 100).toFixed(1),
          rank: i + 1,
        }));

        setData(withPercent);
      })
      .catch((err) => {
        console.error('API error:', err);
        setData([]);
      });
  }, [filter, bu]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `TopProducts_${filter}`);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `TopProducts_${filter}.xlsx`);
  };

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-danger fw-bold mb-0" style={{fontSize:'13px'}}>🔥 ສິນຄ້າຂາຍດີ Top 10</h5>
        <div>
          <select className="form-select form-select-sm d-inline w-auto me-2" value={filter} onChange={(e) => setFilter(e.target.value)} style={{fontSize:'10px'}}>
            <option value="month" style={{fontSize:'10px'}}>ເດືອນນີ້</option>
            <option value="lastmonth" style={{fontSize:'10px'}}>ເດືອນກ່ອນ</option>
            <option value="year" style={{fontSize:'10px'}}>ປີນີ້</option>
          </select>
          <select className="form-select form-select-sm d-inline w-auto me-2" value={chartType} onChange={(e) => setChartType(e.target.value)} style={{fontSize:'10px'}}>
            <option value="bar" style={{fontSize:'10px'}}>BarChart</option>
            <option value="pie" style={{fontSize:'10px'}}>PieChart</option>
          </select>
          {/* <button className="btn btn-sm btn-outline-primary" onClick={handleExport}>📤 Export Excel</button> */}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-muted">ບໍ່ມີຂໍ້ມູນສຳລັບເວລານີ້</div>
      ) : chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={430}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => Number(v).toLocaleString()} fontSize={10}/>
            <YAxis type="category" dataKey="name" hide fontSize={10} />
            <Tooltip formatter={(v) => format(v)} fontSize={10}/>
            <Bar dataKey="total" fill="#06ab9b" barSize={15}>
              <LabelList dataKey="name" content={<CustomTopLabel />} position="left"fontSize={10} />
              <LabelList fontSize={10}
                dataKey="total"
                position="insideMiddle"
                formatter={(v) => Number(v).toLocaleString()}
                style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie fontSize={8}
              data={data}
              dataKey="total"
              nameKey="name"
              outerRadius={140}
              label={({ name, percent }) => `${name}: ${percent}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fontSize={8} />
              ))}
            </Pie>
            <Tooltip 
  formatter={(v) => format(v)}
  contentStyle={{ fontSize: '10px' }} // ✅ Set font size for tooltip box
/>
<Legend
  layout="vertical"
  verticalAlign="middle"
  align="right"
  wrapperStyle={{ fontSize: '10px' }} // ✅ Set font size for legend
/>

          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
