import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api'


export default function MonthlySalesChartbybu({ bu }) {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState('chart');
  const [processedData, setProcessedData] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [filter, setFilter] = useState('thisMonth');

  const loadData = () => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.append('filter', filter);
    if (bu !== 'all') params.append('bu', bu);
    if (selectedZone !== 'all') params.append('area', selectedZone);
    if (selectedChannel !== 'all') params.append('channel', selectedChannel);
<<<<<<< HEAD
    api.get(`/all/monthly?${params.toString()}`) // 🔥 เรียก API /quarterly
=======
    api.get(`/bu/monthly/${bu}`)
>>>>>>> 1a8f5bc (fix-api-path)
      .then(res => {
        const processed = Array.isArray(res.data)
          ? res.data.map(item => {
            const target = Number(item.target || 0);
            const revenue = Number(item.revenue || 0);
            const lastYear = Number(item.last_year || 0);
            const percentAchieved = target > 0 ? Number(((revenue / target) * 100).toFixed(1)) : 0;
            const compareLastYear = lastYear > 0 ? Number(((revenue / lastYear) * 100).toFixed(1)) : 0;
            return {
              quarter: item.quarter,
              target,
              current: revenue,
              lastYear,
              percentAchieved,
              compareLastYear,
            };
          })
          : [];

        setProcessedData(processed);
      })
      .catch(err => console.error('Error loading API:', err));
  };

  useEffect(() => {
    loadData();
  }, [selectedZone, selectedChannel, bu, filter]);

  const formatCurrency = (val) => Number(val).toLocaleString('en-US') + ' ฿';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          fontSize: '12px',
          borderRadius: '5px',
          boxShadow: '0 0 4px rgba(0,0,0,0.2)'
        }}>
          <p><strong>Month:</strong> {label}</p>
          <p>🎯 ເປົ້າໝາຍ: {formatCurrency(data.target)}</p>
          <p>📆 ຍອດຂາຍ: {formatCurrency(data.current)}</p>
          <p>📅 ປີຜ່ານມາ: {formatCurrency(data.lastYear)}</p>
          <p style={{ color: data.percentAchieved >= 100 ? 'green' : 'red' }}>
            {data.percentAchieved >= 100 ? '▲' : '🔻'} % ບັນລຸ: {data.percentAchieved?.toFixed(1)}%
          </p>
          <p style={{ color: data.compareLastYear >= 100 ? 'green' : 'red' }}>
            {data.compareLastYear >= 100 ? '▲' : '🔻'} % ປຽບທຽບປີຜ່ານມາ: {data.compareLastYear.toFixed(1)}%
          </p>
        </div>
      );
    }

    return null;
  };
  const formatCurrencies = (v) => {
    const num = Math.round(Number(v));

    if (num >= 1_000_000) {
      return '฿' + (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1_000) {
      return '฿' + (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return '฿' + num.toLocaleString('en-US');
    }
  };
  const CustomLabel = ({ x, y, value }) => {
    const icon = value >= 100 ? '▲' : '🔻';
    const color = value >= 100 ? 'green' : 'red';
    const formattedValue = parseFloat(value).toFixed(1); 

    return (
      <text x={x} y={y - 10} fontSize={8} textAnchor="middle">
        <tspan fill={color}>{icon}</tspan> {formattedValue}%
      </text>
    );
  };

  const CustomCompair = ({ x, y, value }) => {
    const icon = value >= 100 ? '▲' : '🔻';
    const color = value >= 100 ? 'green' : 'red';
    const formattedValue = parseFloat(value).toFixed(1);
    return (
      <text x={x} y={y - 0} fontSize={8} textAnchor="middle">
        <tspan fill={color}>{icon}</tspan> {formattedValue}%
      </text>
    );
  }

  const channelList = [
    { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];
  return (
    <div className="bg-white text-black p-3 mb-2 rounded-md shadow-sm font-[Noto_Sans_Lao]" >
      <div className="flex items-center mb-3 flex-wrap">
        <h5 className="text-red-600 font-bold mb-0 text-[15px] font-[Noto_Sans_Lao]"> 📊 ລາຍງານຍອດຂາຍລາຍເດືອນ</h5>
        <div className="flex items-center gap-2 flex-wrap  text-[12px] font-[Noto_Sans_Lao] py-2">
          <label className="font-bold ">📢 ຊອ່ງທາງ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
            {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
          </select>

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
          <div className="flex items-center gap-1">
            <label className="font-bold">📅 ໄລຍະເວລາ:</label>
            <select
              className="text-[12px] border rounded px-2 py-1 w-[130px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="month">ເດືອນນີ້</option>
              <option value="lastMonth">ເດືອນຜ່ານມາ</option>
              <option value="accumulated">ສະສົມ</option>
              <option value="year">ປີນີ້</option>
            </select>
          </div>

          <div className="ml-2 inline-flex rounded overflow-hidden border ">
            <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>

      <div ref={chartRef}>
        {viewMode === 'chart' ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedData} key={processedData.length}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={8} />
                <YAxis tickFormatter={v => Number(v).toLocaleString()} fontSize={9} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#FFD580" isAnimationActive animationDuration={1500} animationBegin={0}>
                  <LabelList dataKey="target" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
                <Bar dataKey="current" name="📆 ຍອດຂາຍ" fill="#06ab9b" isAnimationActive animationDuration={1500} animationBegin={300}>
                  <LabelList dataKey="percentAchieved" fontSize={8} content={CustomLabel} />
                  <LabelList fill="#000" dataKey="compareLastYear" position="insideTop" content={CustomCompair} fontSize={8} />
                </Bar>
                <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ" fill="#EF5350" isAnimationActive animationDuration={1500} animationBegin={600} >
                  <LabelList dataKey="lastYear" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 mt-3">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th className="border border-gray-200 p-2 text-center">ເດືອນ</th>
                  <th className="border border-gray-200 p-2 text-center">🎯 ເປົ້າຂາຍ</th>
                  <th className="border border-gray-200 p-2 text-center">📆 ປີນີ້</th>
                  <th className="border border-gray-200 p-2 text-center">📅 ປີຜ່ານມາ</th>
                  <th className="border border-gray-200 p-2 text-center">% ບັນລຸເປົ້າໝາຍ</th>
                </tr>
              </thead>
              <tbody className='text-black'>
                {processedData.map((row, index) => (
                  <tr key={index} className={row.isCurrentMonth ? 'bg-yellow-100' : ''}>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {row.month}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.target)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.current)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.lastYear)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center font-bold ${row.percentAchieved >= 80
                      ? 'text-green-600'
                      : row.percentAchieved >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                      } ${row.isCurrentMonth ? 'bg-yellow-100' : ''}`}>
                      {row.percentAchieved}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
