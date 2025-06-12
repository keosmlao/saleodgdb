import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api'
const getColor = (value) => {
  if (value >= 2000000) return '#28a745';
  if (value >= 1500000) return '#ffc107';
  return '#dc3545';
};

const format = (val) => val.toLocaleString() + ' ฿';

export default function TopCustomersChart() {
  const [filter, setFilter] = useState('month');
  const [region, setRegion] = useState('A');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [apiData, setApiData] = useState({ month: {}, quarter: {}, year: {} });

  useEffect(() => {
    api.get('/all/top10-customers-by-area')
      .then(res => setApiData(res.data))
      .catch(err => console.error("Failed to fetch top customers", err));
  }, []);

  useEffect(() => {
    const raw = apiData?.[filter]?.[`ZONE ${region}`] || [];
    const sorted = [...raw].sort((a, b) => b.total - a.total);
    const top = sorted.slice(0, 10);
    const sum = top.reduce((s, i) => s + i.total, 0);
    const withPercent = top.map(i => ({
      ...i,
      percent: ((i.total / sum) * 100).toFixed(1)
    }));
    setChartData(withPercent);
    setTotal(sum);
  }, [filter, region, apiData]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `TopCustomers_${region}_${filter}`);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `TopCustomers_${region}_${filter}.xlsx`);
  };

  const getCompareData = () => {
    const zones   = ['A', 'B', 'C', 'D', 'E', 'F'];
    const storeNames = apiData?.[filter]?.['ZONE A']?.map(s => s.name) || [];
    return storeNames.map(name => {
      const entry = { name };
      zones.forEach(zone => {
        entry[zone] = apiData?.[filter]?.[`ZONE ${zone}`]?.find(s => s.name === name)?.total || 0;
      });
      return entry;
    });
  };

  const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
      {value}
    </text>
  );

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 overflow-x-auto mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-danger mb-0" style={{fontSize: '15px', fontWeight: 'bold' }}>📊 ຮ້ານຄ້າທີ່ມີຍອດຊື້ສູງສຸດ (Top 10)</h5>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm w-auto" style={{fontSize:'10px'}} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="month" style={{fontSize:'10px'}}>ເດືອນນີ້</option>
            <option value="quarter" style={{fontSize:'10px'}}>ໄຕມາດນີ້</option>
            <option value="year" style={{fontSize:'10px'}}>ປີນີ້</option>
          </select>

          {['bar', 'pie'].includes(chartType) && (
            <select className="form-select form-select-sm w-auto" value={region} onChange={(e) => setRegion(e.target.value)} style={{fontSize:'10px'}}>
              <option value="A" style={{fontSize:'10px'}}>ເຂດ A</option>
              <option value="B" style={{fontSize:'10px'}}>ເຂດ B</option>
              <option value="C"style={{fontSize:'10px'}} >ເຂດ C</option>
              <option value="D" style={{fontSize:'10px'}}>ເຂດ D</option>
              <option value="E" style={{fontSize:'10px'}}>ເຂດ E</option>
              <option value="F" style={{fontSize:'10px'}}>ເຂດ F</option>
            </select>
          )}

          <select className="form-select form-select-sm w-auto" value={chartType} onChange={(e) => setChartType(e.target.value)} style={{fontSize:'10px'}}>
            <option value="bar" style={{fontSize:'10px'}}>Bar</option>
            <option value="pie" style={{fontSize:'10px'}}>Pie</option>
            <option value="line" style={{fontSize:'10px'}}>Line</option>
            <option value="stacked" style={{fontSize:'10px'}}>Stacked Bar</option>
          </select>

          {/* <button className="btn btn-sm btn-outline-secondary" onClick={handleExport}>📤 Export Excel</button> */}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center text-muted py-4">ບໍ່ມີຂໍ້ມູນ</div>
      ) : (
        <>
          {chartType === 'bar' && (
            <ResponsiveContainer width="100%" height={430}>
              <BarChart data={chartData} layout="vertical"  >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(v) => v.toLocaleString()} fontSize={10}/>
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={(v) => format(v)} fontSize={10}/>
                <Bar dataKey="total" fill="#06ab9b" barSize={15}>
                  <LabelList dataKey="name" content={<CustomTopLabel />} position="left"  />
                  <LabelList dataKey="total" position="insideMiddle" formatter={(v) => v.toLocaleString()} style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType === 'pie' && (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie data={chartData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={150} label={({ name, percent }) => `${name} (${percent}%)`}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getColor(entry.total)} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => format(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartType === 'line' && (
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={getCompareData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => format(v)} />
                <Legend />
                <Line type="monotone" dataKey="A" stroke="#FF0000" />
                <Line type="monotone" dataKey="B" stroke="#00BFFF" />
                <Line type="monotone" dataKey="C" stroke="#28a745" />
                <Line type="monotone" dataKey="D" stroke="#FFC107" />
                <Line type="monotone" dataKey="E" stroke="#AA00FF" />
                <Line type="monotone" dataKey="F" stroke="#FF66CC" />
              </LineChart>
            </ResponsiveContainer>
          )}

          {chartType === 'stacked' && (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={getCompareData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => format(v)} />
                <Legend />
                <Bar dataKey="A" stackId="a" fill="#FF0000" />
                <Bar dataKey="B" stackId="a" fill="#00BFFF" />
                <Bar dataKey="C" stackId="a" fill="#28a745" />
                <Bar dataKey="D" stackId="a" fill="#FFC107" />
                <Bar dataKey="E" stackId="a" fill="#AA00FF" />
                <Bar dataKey="F" stackId="a" fill="#FF66CC" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {['bar', 'pie'].includes(chartType) && (
            <div className="text-end text-muted small mt-2">
              ລວມຍອດ: {total.toLocaleString()} ₭
            </div>
          )}
        </>
      )}
    </div>
  );
}
