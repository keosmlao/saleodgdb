import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import api from '../../../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = ['#ffc107', '#28a745', '#dc3545'];

const formatCurrency = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0 B' : num.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ' ₭';
};

export default function SaleByreabyBu({ bu }) {
  const [filter, setFilter] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/bu/area/${bu}`);
        const raw = res.data;

        const keyMap = {
          month: 'thisMonth',
          quarter: 'lastMonth',
          year: 'fullyear'
        };

        const dataset = raw[keyMap[filter]] || [];

        const transformed = dataset.map(item => ({
          region: item.area_code,
          target: parseFloat(item.target_amount || 0),
          revenue: parseFloat(item.revenue || 0),
          lastYear: parseFloat(item.revenue_last_year || 0)
        }));

        setChartData(transformed);
      } catch (error) {
        console.error('❌ Failed to load sales data:', error);
      }
    };

    fetchData();
  }, [bu, filter]);

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-danger" style={{ fontSize: '12px' }}>
          📊 ສົມທຽບການຂາຍແຍກຕາມເຂດ
        </h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="month">ເດືອນນີ້</option>
            <option value="quarter">ເດືອນກ່ອນ</option>
            <option value="year">ປີນີ້</option>
          </select>
          <select
            className="form-select form-select-sm w-auto"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" fontSize={10} />
            <YAxis tickFormatter={(v) => v.toLocaleString()} fontSize={10} />
            <Tooltip formatter={(val) => formatCurrency(val)} />
            <Legend fontSize={10} />
            <Bar dataKey="target" name="🎯 Target" fill={COLORS[0]} />
            <Bar dataKey="revenue" name="📆 ປີນີ້" fill={COLORS[1]} />
            <Bar dataKey="lastYear" name="📅 ປີກ່ອນ" fill={COLORS[2]} />
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" fontSize={10} />
            <YAxis tickFormatter={(v) => v.toLocaleString()} fontSize={10} />
            <Tooltip formatter={(val) => formatCurrency(val)} />
            <Legend fontSize={10} />
            <Line type="monotone" dataKey="target" name="🎯 Target" stroke={COLORS[0]} strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" name="📆 ປີນີ້" stroke={COLORS[1]} strokeWidth={2} />
            <Line type="monotone" dataKey="lastYear" name="📅 ປີກ່ອນ" stroke={COLORS[2]} strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
