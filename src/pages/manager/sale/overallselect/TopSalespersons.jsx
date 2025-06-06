import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend, Cell } from 'recharts';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US') + ' ฿';
const formatNumber = (num) => Number(num || 0).toLocaleString();

export default function TopSalespersons() {
  const [filter, setFilter] = useState('thisMonth');
  const [bu, setBu] = useState('all');
  const [channel, setChannel] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [data, setData] = useState([]);
  const [buList, setBuList] = useState([{ code: 'all', name_1: 'ALL BU' }]);
  const channelList = [
    { name: 'all', display: 'ຊ່ອງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = res.data || [];
        setBuList([{ code: 'all', name_1: 'ALL BU' }, ...list]);
      })
      .catch(err => console.error('❌ Load BU list failed:', err));
  }, []);

  useEffect(() => {
    api.get(`/all/top-salespersons?filter=${filter}&bu=${bu}&channel=${channel}`)
      .then(res => {
        const raw = res.data?.list || [];
        const totalSum = raw.reduce((sum, c) => sum + Number(c.total_2025 || 0), 0);
        setData(raw.map((item, index) => ({
          salename: item.salename || 'Unknown',
          total2025: Number(item.total_2025 || 0),
          total2024: Number(item.total_2024 || 0),
          percent: totalSum > 0 ? ((item.total_2025 / totalSum) * 100).toFixed(1) : 0,
          color: COLORS[index % COLORS.length],
        })));
      })
      .catch(err => { console.error('❌ Load API failed:', err); setData([]); });
  }, [filter, bu, channel]);

  return (
    <div className="card p-3 rounded-4 shadow-sm">
      <h5 className="fw-bold mb-3 text-primary" style={{ fontSize: '15px' }}>🏆10 ອັນດັບພະນັກງານຂາຍຍອດນິຍົມ</h5>
      <div className="d-flex gap-2 mb-3">
        <select className="form-select w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="thisMonth">ເດືອນນີ້</option>
          <option value="lastMonth">ເດືອນກອ່ນ</option>
          <option value="accumulated">ຍອດສະສົມ</option>
          <option value="fullYear">ທັງໝົດໃນປີ</option>
        </select>
        <select className="form-select w-auto" value={bu} onChange={e => setBu(e.target.value)}>
          {buList.map(b => <option key={b.code} value={b.code}>{b.name_1}</option>)}
        </select>
        <select className="form-select w-auto" value={channel} onChange={e => setChannel(e.target.value)}>
          {channelList.map(c => <option key={c.name} value={c.name}>{c.display}</option>)}
        </select>
        <select className="form-select w-auto" value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value="table">Table</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {chartType === 'table' && (
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr><th>Salesperson</th><th>2025</th><th>2024</th><th>% Share</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="4">No Data</td></tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.salename}</td>
                    <td>{formatNumber(row.total2025)}</td>
                    <td>{formatNumber(row.total2024)}</td>
                    <td>{row.percent}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {chartType === 'bar' && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" barGap={10}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="salename" tick={{ fontSize: 12 }} />
            <Tooltip formatter={format} />
            <Legend />
            <Bar dataKey="total2025" name="2025" barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-2025-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="total2025" position="insideRight" formatter={formatNumber} style={{ fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total2024" name="2024" fill="#FF9933" barSize={20}>
              <LabelList dataKey="total2024" position="insideRight" formatter={formatNumber} style={{ fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
