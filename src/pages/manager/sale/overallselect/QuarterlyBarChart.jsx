import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from 'recharts';
import api from '../../../../services/api';

export default function QuarterlyBarChart() {
  const [data, setData] = useState([]);
  const [selectedBU, setSelectedBU] = useState('all');
  const [buList, setBuList] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [viewMode, setViewMode] = useState('chart');
  console.log("select zone", selectedZone)

  const channelList = [
    { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];
  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...res.data]))
      .catch(err => console.error('Error loading BU list:', err));
  }, []);

  const loadData = () => {
    const params = new URLSearchParams();
    if (selectedBU !== 'all') params.append('bu', selectedBU);
    if (selectedZone !== 'all') params.append('area', selectedZone);
    if (selectedChannel !== 'all') params.append('channel', selectedChannel);

    api.get(`/all/quarterly?${params.toString()}`)
      .then(res => {
        const processed = (res.data || []).map(item => {
          const target = Number(item.target || 0);
          const revenue = Number(item.revenue || 0);
          const lastYear = Number(item.last_year || 0);
          const percentAchieved = target > 0 ? (revenue / target) * 100 : 0;
          const compareLastYear = lastYear > 0 ? (revenue / lastYear) * 100 : 0;
          return {
            quarter: item.quarter,
            target,
            current: revenue,
            lastYear,
            percentAchieved,
            compareLastYear,
          };
        });
        setData(processed);
      })
      .catch(err => console.error('Error loading API:', err));
  };

  useEffect(() => {
    loadData();
  }, [selectedBU, selectedZone, selectedChannel]);

  const formatCurrency = v => {
    const num = parseInt(Number(v).toFixed(0), 10);
    return num.toLocaleString('en-US') + ' ฿';
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

  const formatPercent = v => `${v.toFixed(1)}%`;

  const CustomCompareLastYearLabel = ({ x, y, width, value }) => (
    <text
      x={x + width / 2}
      y={y - 15}
      fill={value >= 100 ? 'green' : 'red'}
      fontSize={8}
      textAnchor="middle"
    >
      {value >= 100 ? '▲' : '🔻'}  {value.toFixed(1)}%
    </text>
  );

  const CustomPercentAchievedLabel = ({ x, y, width, value }) => (
    <text
      x={x + width / 2}
      y={y - 25}
      fill={value >= 100 ? 'green' : 'red'}
      fontSize={8}
      textAnchor="middle"
    >
      {value >= 100 ? '▲' : '🔻'}  {value.toFixed(1)}%
    </text>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
          <div className="bg-white border border-gray-300 p-2 text-xs rounded-md shadow-sm">
          <p><strong>Quarter:</strong> {label}</p>
          <p>🎯 ເປົ້າໝາຍ: {formatCurrency(data.target)}</p>
          <p>📆 ຍອດຂາຍ: {formatCurrency(data.current)}</p>
          <p>📅 ປີຜ່ານມາ: {formatCurrency(data.lastYear)}</p>
          <p style={{ color: data.percentAchieved >= 100 ? 'green' : 'red' }}>
            {data.percentAchieved >= 100 ? '▲' : '🔻'} % ບັນລຸ: {data.percentAchieved.toFixed(1)}%
          </p>
          <p style={{ color: data.compareLastYear >= 100 ? 'green' : 'red' }}>
            {data.compareLastYear >= 100 ? '▲' : '🔻'} % ປຽບທຽບປີຜ່ານມາ: {data.compareLastYear.toFixed(1)}%
          </p>
        </div>
      );
    }

    return null;
  };

  return (
      <div className="bg-white p-3 mb-2 rounded-sm shadow-sm">
        <div className="flex justify-between items-center mb-3 flex-wrap">
          <h5 className="text-red-600 font-bold mb-2 text-[15px] font-[Noto_Sans_Lao]">
            📊 ສະຫຼຸບຍອດຂາຍລາຍໄຕມາດ
          </h5>
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <label className="font-bold text-[14px]">🔍 BU:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedBU} onChange={e => setSelectedBU(e.target.value)}>
              {buList.map(bu => <option key={bu.code} value={bu.code}>{bu.name_1}</option>)}
            </select>

            <label className="font-bold text-[14px]">📢 ຊອ່ງທາງ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
              {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
            </select>

            <label className="font-bold text-[14px]">🌍 ຂອບເຂດ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
              {[{ code: 'all', name_1: 'ທຸກ ZONE' }, { code: '11', name_1: 'ZONE A' }, { code: '12', name_1: 'ZONE B' }, { code: '13', name_1: 'ZONE C' }, { code: '14', name_1: 'ZONE D' }, { code: '15', name_1: 'ZONE E' }, { code: '16', name_1: 'ZONE F' }].map(z => (
                  <option key={z.code} value={z.code}>{z.name_1}</option>
              ))}
            </select>

            <div className="ml-2 flex space-x-1" role="group">
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <button className={`text-sm px-3 py-1 rounded ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button className={`text-sm px-3 py-1 rounded ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`} onClick={() => setViewMode('chart')}>Chart</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <button className={`text-sm px-3 py-1 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
            </div>
          </div>
        </div>

        {/* Chart section */}
        {(viewMode === 'all' || viewMode === 'chart') && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 30, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" fontSize={10} />
                <YAxis tickFormatter={v => v.toLocaleString('en-US')} fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} payload={[
                  { value: '🎯 ເປົ້າໝາຍ', type: 'square', color: '#FFD580' },
                  { value: '📆 ຍອດຂາຍ', type: 'square', color: '#06ab9b' },
                  { value: '📅 ປີຜ່ານມາ', type: 'square', color: '#EF5350' },
                ]} />
                <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#FFD580">
                  <LabelList dataKey="target" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
                <Bar dataKey="current" name="📆 ຍອດຂາຍ" fill="#06ab9b">
                  <LabelList dataKey="current" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} fill="#000" />
                  <LabelList dataKey="percentAchieved" content={CustomPercentAchievedLabel} />
                  <LabelList dataKey="compareLastYear" content={CustomCompareLastYearLabel} />
                </Bar>
                <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ" fill="#EF5350">
                  <LabelList dataKey="lastYear" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        )}

        {(viewMode === 'all' || viewMode === 'table') && (
            <div className="overflow-auto mt-3">
              <table className="table-auto w-full text-sm border border-collapse">
                <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">ໃຕມາດ</th>
                  <th className="border px-2 py-1 text-center">🎯 ເປົ້າໝາຍ</th>
                  <th className="border px-2 py-1 text-center">📆 ຍອດຂາຍ</th>
                  <th className="border px-2 py-1 text-center">% ປຽບທຽບເປົ້າ</th>
                  <th className="border px-2 py-1 text-center">📅 ປີຜ່ານມາ</th>
                  <th className="border px-2 py-1 text-center">📊 % ປຽບທຽບປີຜ່ານມາ</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{row.quarter}</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(row.target)}</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(row.current)}</td>
                      <td className="border px-2 py-1 text-center">
                        {row.percentAchieved > 0 ? (
                            <span className={`font-bold ${row.percentAchieved >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.percentAchieved >= 100 ? '▲' : '🔻'} {formatPercent(row.percentAchieved)}
                  </span>
                        ) : '-'}
                      </td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(row.lastYear)}</td>
                      <td className="border px-2 py-1 text-center">
                        {row.compareLastYear > 0 ? (
                            <span className={`font-bold ${row.compareLastYear >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.compareLastYear >= 100 ? '▲' : '🔻'} {formatPercent(row.compareLastYear)}
                  </span>
                        ) : '-'}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
}