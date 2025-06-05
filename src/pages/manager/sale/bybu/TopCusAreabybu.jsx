import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const getColor = (value) => {
  if (value >= 1000000) return '#28a745';  // Green
  if (value >= 500000) return '#ffc107';   // Yellow
  return '#dc3545';                        // Red
};

const format = (val) => val.toLocaleString() + ' ₭';

export default function TopCusByAreaName({bu}) {
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get(`/bu/area-top-customers/${bu}`)
      .then(res => {
        const data = res.data || [];
        setAreaList(data);
        if (data.length > 1) setSelectedArea(data[1]?.code || '');
      })
      .catch(err => console.error("❌ Failed to fetch area data", err));
  }, [bu]);

  useEffect(() => {
    const area = areaList.find(a => a.code === selectedArea);
    const raw = area?.[timeFilter] || [];

    const sum = raw.reduce((s, i) => s + i.total_amount, 0);
    const transformed = raw.map(i => ({
      ...i,
      percent: ((i.total_amount / sum) * 100).toFixed(1)
    }));

    setChartData(transformed);
    setTotal(sum);
  }, [selectedArea, timeFilter, areaList]);

  const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10}>
      {value.length > 20 ? value.slice(0, 18) + '…' : value}
    </text>
  );

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-danger mb-0" style={{ fontSize: '12px' }}>
          📊 ລູກຄ້າ Top 10 - {areaList.find(a => a.code === selectedArea)?.name_1 || ''}
        </h5>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm w-auto" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ fontSize: '10px' }}>
            {areaList.filter(a => a.code !== '00').map((a) => (
              <option key={a.code} value={a.code}>{a.name_1}</option>
            ))}
          </select>
          <select className="form-select form-select-sm w-auto" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="this_month">ເດືອນນີ້</option>
            <option value="last_month">ເດືອນກ່ອນ</option>
            <option value="fullyear">ປີນີ້</option>
          </select>
          <select className="form-select form-select-sm w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center text-muted py-4">ບໍ່ມີຂໍ້ມູນ</div>
      ) : (
        <>
          {chartType === 'bar' && (
            <ResponsiveContainer width="100%" height={430}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(v) => v.toLocaleString()} fontSize={10} />
                <YAxis type="category" dataKey="customername" hide />
                <Tooltip formatter={(v) => format(v)} />
                <Bar dataKey="total_amount" fill="#06ab9b" barSize={15}>
                  <LabelList dataKey="customername" content={<CustomTopLabel />} position="left" />
                  <LabelList dataKey="total_amount" position="insideRight" formatter={(v) => v.toLocaleString()} style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === 'pie' && (
            <ResponsiveContainer width="100%" height={430}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total_amount"
                  nameKey="customername"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  label={({ customername, percent }) => `${customername} (${percent}%)`}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getColor(entry.total_amount)} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => format(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="text-end text-muted small mt-2">
            ລວມຍອດ: {total.toLocaleString()} ₭
          </div>
        </>
      )}
    </div>
  );
}
