import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = ['#ffc107', '#06ab9b', '#dc3545'];

const formatCurrency = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0 ₭' : num.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ' ₭';
};

export default function SalesRegionComparison() {
  const [filter, setFilter] = useState('month');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/all/area?filter=${filter}`);
        const dataset = res.data.list || [];

        const transformed = dataset.map(item => ({
          region: item.area_name || item.area_code,
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
  }, [filter]);

  const totalTarget = chartData.reduce((sum, item) => sum + item.target, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalLastYear = chartData.reduce((sum, item) => sum + item.lastYear, 0);

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-danger" style={{ fontSize: '15px' }}>📊 ສົມທຽບການຂາຍແຍກຕາມເຂດ</h5>
        <select
          className="form-select form-select-sm w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ fontSize: '10px' }}
        >
          <option value="month">ເດືອນນີ້</option>
          <option value="lastMonth">ເດືອນກ່ອນ</option>
          <option value="year">ປີນີ້</option>
          <option value="accumulated">ສະສົມ</option>
        </select>
      </div>

      {/* 🔥 Summary */}
      <div className="row text-center mb-3">
        <div className="col">
          <h6 className="text-warning fw-bold">🎯 ເປົ້າ</h6>
          <p className="mb-0">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="col">
          <h6 className="text-info fw-bold">📆 ປີນີ້</h6>
          <p className="mb-0">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="col">
          <h6 className="text-danger fw-bold">📅 ປີກ່ອນ</h6>
          <p className="mb-0">{formatCurrency(totalLastYear)}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          barCategoryGap="20%"
          barGap={2}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" fontSize={10} padding={{ left: 10, right: 10 }} />
          <YAxis tickFormatter={(v) => v.toLocaleString()} fontSize={10} />
          <Tooltip formatter={(val) => formatCurrency(val)} fontSize={10} />
          <Legend />
          <Bar dataKey="target" name="🎯 Target" fill={COLORS[0]} fontSize={10} />
          <Bar dataKey="revenue" name="📆 ປີນີ້" fill={COLORS[1]} fontSize={10} />
          <Bar dataKey="lastYear" name="📅 ປີກ່ອນ" fill={COLORS[2]} fontSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
