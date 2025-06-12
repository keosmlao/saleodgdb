import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend, Cell } from 'recharts';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US') + ' ฿';
const formatNumber = (num) => Number(num || 0).toLocaleString();

export default function TopItemBrands() {
  const [filter, setFilter] = useState('thisMonth');
  const [bu, setBu] = useState('all');
  const [channel, setChannel] = useState('all');
  const [viewMode, setViewMode] = useState('chart');
  const [data, setData] = useState([]);
  const [buList, setBuList] = useState([{ code: 'all', name_1: '📦 ທຸກ BU' }]);
  const [channelList, setChannelList] = useState([
    { name: 'all', display: 'ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ]);

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        const list = res.data || [];
        setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...list]);
      })
      .catch(err => console.error('❌ Load BU list failed:', err));
  }, []);

  useEffect(() => {
    api.get(`/all/top-item-brands?filter=${filter}&bu=${bu}&channel=${channel}`)
      .then(res => {
        const raw = res.data?.list || [];
        const totalSum = raw.reduce((sum, c) => sum + Number(c.total_2025 || 0), 0);
        setData(raw.map((item, index) => ({
          brand: item.item_brand || 'Unknown',
          total2025: Number(item.total_2025 || 0),
          total2024: Number(item.total_2024 || 0),
          percent: totalSum > 0 ? ((item.total_2025 / totalSum) * 100).toFixed(1) : 0,
          color: COLORS[index % COLORS.length],
        })));
      })
      .catch(err => { console.error('❌ Load API failed:', err); setData([]); });
  }, [filter, bu, channel]);

  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm">
      <h5 className="font-bold mb-2 text-[15px] font-[Noto_Sans_Lao]">🏆 10 ອັນດັບແບຮນສີນຄ້າຍອດນິຍົມ</h5>
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-1">
          <label className="font-bold text-[14px]">🔍 BU:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={bu} onChange={e => setBu(e.target.value)}>
            {buList.map(b => <option key={b.code} value={b.code}>{b.name_1}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold text-[14px]">📅 ໄລຍະເວລາ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="thisMonth">ເດືອນນີ້</option>
            <option value="lastMonth">ເດືອນຜ່ານມາ</option>
            <option value="accumulated">ສະສົມ</option>
            <option value="fullYear">ປີນີ້</option>
          </select>
        </div>



        <div className="flex items-center gap-1">
          <label className="font-bold text-[14px]">🏪 ຊ່ອງທາງ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={channel} onChange={e => setChannel(e.target.value)}>
            {channelList.map(c => <option key={c.name} value={c.name}>{c.display}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <label className="font-bold text-[14px]">📊 ຮູບແບບ:</label>
          <div className="ml-2 inline-flex rounded overflow-hidden border text-sm">
            <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>
      {(viewMode === 'chart' || viewMode === 'all') && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" barGap={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatNumber} />
            <YAxis type="category" dataKey="brand" fontSize={10} />
            <Tooltip formatter={format} />
            <Legend />
            <Bar dataKey="total2025" name="📆 2025" barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-2025-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="total2025" position="right" formatter={formatNumber} style={{ fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="total2024" name="📅 2024" fill="#FF9933" barSize={20}>
              <LabelList dataKey="total2024" position="right" formatter={formatNumber} style={{ fontSize: 10, fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {(viewMode === 'table' || viewMode === 'all') && (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full border text-center text-sm">
            <thead className="bg-gray-100">
              <tr><th className="border px-2 py-1">Brand</th><th className="border px-2 py-1">2025</th><th className="border px-2 py-1">2024</th><th className="border px-2 py-1">% Share</th></tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="4" className="px-2 py-1">No Data</td></tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{row.brand}</td>
                    <td className="border px-2 py-1">{formatNumber(row.total2025)}</td>
                    <td className="border px-2 py-1">{formatNumber(row.total2024)}</td>
                    <td className="border px-2 py-1">{row.percent}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}


    </div>

  );
}
