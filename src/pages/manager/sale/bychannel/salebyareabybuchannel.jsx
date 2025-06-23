import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import api from '../../../../services/api';

const COLORS = ['#ffc107', '#28a745', '#dc3545'];

const formatCurrency = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0 B' : num.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ' ₭';
};

export default function SaleByreabyBuChannel({ bu, department }) {
  const [filter, setFilter] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [channel, setChannel] = useState('all');
  const [viewMode, setViewMode] = useState('chart');
  const [selectedZone, setSelectedZone] = useState('all');
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

    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);
    const fetchData = async () => {
      try {
        const res = await api.get(`/channel/area?${query.toString()}`)
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
  }, [bu, department, filter]);

  return (
    <div className="bg-white shadow-sm border-0 p-2 rounded text-black">
      <h5 className="font-bold text-black text-[12px] font-['Noto_Sans_Lao']">
        📊 ສົມທຽບການຂາຍແຍກຕາມເຂດ
      </h5>
      <div className="flex flex-wrap gap-2 mb-3 text-[12px] font-[Noto_Sans_Lao]">
        <div className="flex items-center gap-1">
          <label className="font-bold ">🏪 ຊ່ອງທາງ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={channel} onChange={e => setChannel(e.target.value)}>
            {channelList.map(c => <option key={c.name} value={c.name}>{c.display}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold ">🌍 ຂອບເຂດ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
            {[
              { code: 'all', name_1: 'ທຸກ ZONE' },
              { code: '11', name_1: 'ZONE A' },
              { code: '12', name_1: 'ZONE B' },
              { code: '13', name_1: 'ZONE C' },
              { code: '14', name_1: 'ZONE D' },
              { code: '15', name_1: 'ZONE E' },
              { code: '16', name_1: 'ZONE F' },
            ].map(z => (
              <option key={z.code} value={z.code}>{z.name_1}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold ">📅 ໄລຍະເວລາ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="month">ເດືອນນີ້</option>
            <option value="lastMonth">ເດືອນກອ່ນ</option>
            <option value="year">ປີນີ້</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <label className="font-bold ">📊 ຮູບແບບ:</label>
          <div className="ml-2 inline-flex rounded overflow-hidden border ">
            <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>


      {viewMode === 'chart' ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="region"
              fontSize={11}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={{ stroke: '#ccc' }}
            />
            <YAxis
              tickFormatter={(v) => (v / 1000000).toFixed(0) + 'M'}
              fontSize={11}
              tick={{ fill: '#666' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={{ stroke: '#ccc' }}
            />
            <Tooltip formatter={(val) => formatCurrency(val)} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill={COLORS[0]} />
            <Bar dataKey="revenue" name="📆 ປີນີ້" fill={COLORS[1]} />
            <Bar dataKey="lastYear" name="📅 ປີກ່ອນ" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold">ເຂດ</th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">🎯 ເປົ້າໝາຍ</th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">📆 ປີນີ້</th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">📅 ປີກ່ອນ</th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold">% ບັນລຸ</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, index) => {
              const achievement = item.target && item.target !== 0
                ? Math.round((item.revenue / item.target) * 100)
                : 0;


              return (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-3 py-2 font-medium">
                    {item.region}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {formatCurrency(item.target)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-medium text-green-600">
                    {formatCurrency(item.revenue)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-600">
                    {formatCurrency(item.lastYear)}
                  </td>
                  <td className={`border border-gray-300 px-3 py-2 text-right font-medium ${achievement >= 100 ? 'text-green-600' : achievement >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {achievement}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      )}
    </div>
  );
}
