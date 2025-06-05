import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = ['#007bff', '#28a745', '#dc3545'];

const data = [
  { name: 'ສະມາຊິກ LINE OA', value: 125 },
  { name: 'ສະມາຊິກເວັບໄຊ', value: 3 },
  { name: 'ບໍ່ເປັນສະມາຊິກ', value: 14 },
];

const formatNumber = (val) => val.toLocaleString();

export default function MemberChartsSwitcher() {
  const [chartType, setChartType] = useState('bar'); // bar | pie

  return (
    <div className="container py-4">
      <h4 className="text-center mb-4 text-danger fw-bold">
        📊 ສະຖິຕິປະເພດສະມາຊິກ
      </h4>

      {/* Dropdown Selector */}
      <div className="mb-4 d-flex justify-content-center">
        <select
          className="form-select w-auto"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">📈 Bar Chart</option>
          <option value="pie">🍩 Pie Chart</option>
        </select>
      </div>

      {/* Chart Area */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatNumber} />
            <Bar dataKey="value" fill="#dc3545">
              <LabelList dataKey="value" position="top" formatter={formatNumber} />
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${formatNumber(value)}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatNumber} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
