import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const getColor = (value) => {
  if (value >= 2000000) return '#28a745';
  if (value >= 1000000) return '#ffc107';
  return '#dc3545';
};

const format = (val) => val.toLocaleString() + ' ₭';

export default function TopProductByBu({bu}) {
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get(`/bu/area-top-product/${bu}`) // ✅ your correct API
      .then((res) => {
        setAreaList(res.data || []);
        if (res.data.length > 0) setSelectedArea(res.data[0].code); // default ZONE A
      });
  }, [bu]);

  useEffect(() => {
    const area = areaList.find(a => a.code === selectedArea);
    const raw = area?.[timeFilter] || [];

    const sum = raw.reduce((acc, i) => acc + i.total_amount, 0);
    const transformed = raw.map((item) => ({
      name: item.item_name,
      total: item.total_amount,
      percent: ((item.total_amount / sum) * 100).toFixed(1)
    }));

    setChartData(transformed);
    setTotal(sum);
  }, [selectedArea, timeFilter, areaList]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Top_${timeFilter}_${selectedArea}`);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `TopProduct_${timeFilter}_${selectedArea}.xlsx`);
  };

  const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
      {value.length > 40 ? value.slice(0, 38) + '…' : value}
    </text>
  );

  return (
    <div className="card shadow-sm border-0 p-3 bg-white rounded-1 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-danger mb-0" style={{ fontSize: '12px' }}>
          📦 ສິນຄ້າຂາຍດີ - {areaList.find(a => a.code === selectedArea)?.name_1 || ''}
        </h5>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm w-auto" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="this_month">ເດືອນນີ້</option>
            <option value="last_month">ເດືອນກ່ອນ</option>
            <option value="fullyear">ປີນີ້</option>
          </select>
          <select className="form-select form-select-sm w-auto" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} style={{ fontSize: '10px' }}>
            {areaList.filter(a => a.code !== '00').map(a => (
              <option key={a.code} value={a.code}>{a.name_1}</option>
            ))}
          </select>
          <select className="form-select form-select-sm w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)} style={{ fontSize: '10px' }}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleExport} style={{ fontSize: '10px' }}>
            📤 Export Excel
          </button>
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
                <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={format} />
                <Bar dataKey="total" fill="#06ab9b" barSize={20}>
                  <LabelList dataKey="name" content={<CustomTopLabel />} position="left" />
                  <LabelList dataKey="total" position="insideRight" formatter={(v) => v.toLocaleString()} style={{ fill: '#fff', fontSize: 10 }} />
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
                  outerRadius={140}
                  label={({ name, percent }) => `${name.slice(0, 20)} (${percent}%)`}
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
        </>
      )}
    </div>
  );
}
