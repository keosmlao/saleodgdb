import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../../services/api';

const COLORS = [
  '#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745',
  '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d',
];

const format = (val) => Number(val).toLocaleString('en-US') + ' ₭';

const CustomTopLabel = ({ x, y, value }) => (
  <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
    {value}
  </text>
);

export default function TopCustomerListWithChartbybu({ bu }) {
  const [filter, setFilter] = useState('year'); // month | lastmonth | year
  const [chartType, setChartType] = useState('bar');
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get(`/bu/top-customersbybu/${bu}`)
      .then((res) => {
        const raw = res.data?.[filter] || [];

        const cleaned = raw.map((item) => ({
          name: item.cust_name,
          total: Number(item.total_amount || 0),
        }));

        const totalSum = cleaned.reduce((sum, c) => sum + c.total, 0);
        const withPercent = cleaned.map((c) => ({
          ...c,
          percent: ((c.total / totalSum) * 100).toFixed(1),
        }));

        setData(withPercent);
      })
      .catch((err) => {
        console.error('❌ Load API failed:', err);
        setData([]);
      });
  }, [filter, bu]);

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-danger fw-bold mb-0" style={{ fontSize: '13px' }}>🏆 ລູກຄ້າຊື້ສູງສຸດ 10 ລາຍ</h5>
        <div>
          <select
            className="form-select form-select-sm d-inline w-auto me-2" style={{ fontSize: '10px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="month" style={{ fontSize: '10px' }}>ເດືອນນີ້</option>
            <option value="lastmonth" style={{ fontSize: '10px' }}>ເດືອນກ່ອນ</option>
            <option value="year" style={{ fontSize: '10px' }}>ປີນີ້</option>
          </select>
          <select
            className="form-select form-select-sm d-inline w-auto" style={{ fontSize: '10px' }}
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="bar" style={{ fontSize: '10px' }}>BarChart</option>
            <option value="pie" style={{ fontSize: '10px' }}>PieChart</option>
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center text-muted">ບໍ່ມີຂໍ້ມູນສຳລັບເວລານີ້</div>
      ) : chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={430}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => Number(v).toLocaleString()} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip formatter={(v) => format(v)} />
            <Bar dataKey="total" fill="#06ab9b" barSize={15}>
              <LabelList dataKey="name" content={<CustomTopLabel />} position="left" />
              <LabelList
                dataKey="total"
                position="insideMiddle"
                formatter={(v) => Number(v).toLocaleString()}
                style={{ fill: '#fff', fontSize: 6, fontWeight: 'bold' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
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
              contentStyle={{ fontSize: '10px', padding: '5px' }}
            />

            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: '6px' }}
            />

          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
