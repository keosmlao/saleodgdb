import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer, Cell,
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../../services/api';

const getColor = (value) => {
  if (value >= 2000000) return '#28a745';
  if (value >= 1000000) return '#ffc107';
  return '#dc3545';
};

const format = (val) => val.toLocaleString() + ' ₭';

const CustomTopLabel = ({ x, y, value }) => (
  <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
    {value.length > 40 ? value.slice(0, 38) + '…' : value}
  </text>
);

const formatCurrency = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0 ₭' : num.toLocaleString() + ' ₭';
};

const channelList = [
  { name: 'all', display: 'ຊ່ອງທາງທັງໝົດ' },
  { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
  { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
  { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
  { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
  { name: 'ບໍລິການ', display: 'ບໍລິການ' },
  { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
];

export default function TopProductAreabybuchannel({ bu, department }) {
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [timeFilter, setTimeFilter] = useState('this_month');
  const [chartData, setChartData] = useState([]);
  const [total, setTotal] = useState(0);
  const [channel, setChannel] = useState('all');
  const [viewMode, setViewMode] = useState('chart');

  console.log("zone", areaList)

  useEffect(() => {
    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);

    api.get(`/channel/area-top-product?${query.toString()}`)
      .then((res) => {
        setAreaList(res.data || []);
        if (res.data.length > 0) setSelectedArea(res.data[0].code);
      });
  }, [bu, department]);

  useEffect(() => {
    const area = areaList.find(a => a.code === selectedArea);
    const raw = area?.[timeFilter]?.filter(r => channel === 'all' || r.channel === channel) || [];

    const sum = raw.reduce((acc, i) => acc + i.total_amount, 0);
    const transformed = raw.map((item) => ({
      name: item.item_name,
      total: item.total_amount,
      percent: ((item.total_amount / sum) * 100).toFixed(1)
    }));

    setChartData(transformed);
    setTotal(sum);
  }, [selectedArea, timeFilter, channel, areaList]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Top_${timeFilter}_${selectedArea}`);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `TopProduct_${timeFilter}_${selectedArea}.xlsx`);
  };

  return (
    <div className="bg-white shadow-sm border-0 p-2 rounded text-black">
      <h5 className="font-bold text-red-500 text-[12px]">
        📦 ສິນຄ້າຂາຍດີ - {areaList.find(a => a.code === selectedArea)?.name_1 || ''}
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
            {areaList.map(z => (
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
        <div className="text-center text-muted py-4">ບໍ່ມີຂໍ້ມູນ</div>
      ) : (
        <>
          {(viewMode === 'chart' || viewMode === 'all') && (
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

          {(viewMode === 'table' || viewMode === 'all') && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-3 py-2 border">#</th>
                    <th className="px-3 py-2 border">ລາຍການ</th>
                    <th className="px-3 py-2 border">ຍອດຂາຍ</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-1 border">{i + 1}</td>
                      <td className="px-3 py-1 border">{row.name}</td>
                      <td className="px-3 py-1 border text-right text-green-600">{formatCurrency(row.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-end text-muted text-xs mt-2">
            ລວມຍອດ: {total.toLocaleString()} ₭
          </div>
        </>
      )}
    </div>
  );
}
