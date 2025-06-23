import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const format = (val) => val.toLocaleString() + ' ₭';
const formatCurrency = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0 ₭' : num.toLocaleString(undefined, { minimumFractionDigits: 0 }) + ' ₭';
};

const CustomTopLabel = ({ x, y, value }) => (
  <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10}>
    {value.length > 20 ? value.slice(0, 18) + '…' : value}
  </text>
);

const getColor = (value) => {
  if (value >= 1000000) return '#28a745';  // Green
  if (value >= 500000) return '#ffc107';   // Yellow
  return '#dc3545';                        // Red
};

export default function TopCusByAreaName({ bu , department}) {
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [chartData, setChartData] = useState([]);
  const [channel, setChannel] = useState('all');
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('chart');

  useEffect(() => {
    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);
    api.get(`/channel/area-top-customers?${query.toString()}`)
      .then(res => {
        const data = res.data || [];
        setAreaList(data);
        if (data.length > 1) setSelectedArea(data[1]?.code || '');
      })
      .catch(err => console.error("❌ Failed to fetch area data", err));
  }, [bu, department]);

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

  const channelList = [
    { name: 'all', display: 'ຊ່ອງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];

  return (
    <div className="bg-white shadow-sm border-0 p-2 rounded text-black">
      <h5 className="font-bold text-red-500 text-[12px] mb-0">
        📊 ລູກຄ້າ Top 10 - {areaList.find(a => a.code === selectedArea)?.name_1 || ''}
      </h5>
      <div className="flex flex-wrap gap-2 mb-3 text-[12px] font-[Noto_Sans_Lao]">
        <div className="flex items-center gap-1">
          <label className="font-bold">🏪 ຊ່ອງທາງ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={channel} onChange={e => setChannel(e.target.value)}>
            {channelList.map(c => <option key={c.name} value={c.name}>{c.display}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold">🌍 ຂອບເຂດ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedArea} onChange={e => setSelectedArea(e.target.value)}>
            {[{ code: 'all', name_1: 'ທຸກ ZONE' }, { code: '11', name_1: 'ZONE A' }, { code: '12', name_1: 'ZONE B' }, { code: '13', name_1: 'ZONE C' }, { code: '14', name_1: 'ZONE D' }, { code: '15', name_1: 'ZONE E' }, { code: '16', name_1: 'ZONE F' }].map(z => (
              <option key={z.code} value={z.code}>{z.name_1}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold">📅 ໄລຍະເວລາ:</label>
          <select className="text-sm border rounded px-2 py-1 w-[130px]" value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
            <option value="this_month">ເດືອນນີ້</option>
            <option value="last_month">ເດືອນກ່ອນ</option>
            <option value="fullyear">ປີນີ້</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label className="font-bold">📊 ຮູບແບບ:</label>
          <div className="ml-2 inline-flex rounded overflow-hidden border">
            <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center text-gray-500 py-4">ບໍ່ມີຂໍ້ມູນ</div>
      ) : (
        <>
          {(viewMode === 'chart' || viewMode === 'all') && (
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

          {(viewMode === 'table' || viewMode === 'all') && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-3 py-2 border">ລຳດັບ</th>
                    <th className="px-3 py-2 border">ລູກຄ້າ</th>
                    <th className="px-3 py-2 border">ຈຳນວນ</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-1 border">{i + 1}</td>
                      <td className="px-3 py-1 border">{row.customername}</td>
                      <td className="px-3 py-1 border text-right text-green-600">{formatCurrency(row.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
