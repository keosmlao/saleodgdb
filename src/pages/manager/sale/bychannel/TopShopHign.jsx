import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ฿';
const formatNumber = v => {
    const num = parseInt(Number(v).toFixed(0), 10);
    return num.toLocaleString('en-US') + ' ฿';
};
const formatPercent = (num) => num ? `${parseFloat(num).toFixed(1)}%` : '0%';
const CustomTopLabel = ({ x, y, value }) => <text x={x} y={y - 2} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>{value}</text>;

export default function TopShopSellHign({ bu, department }) {
    const [filter, setFilter] = useState('year');
    const [viewMode, setViewMode] = useState('chart');
    const [data, setData] = useState([]);
    const [zone, setZone] = useState('all');
    const [selectedChannel, setSelectedChannel] = useState('all');
    console.log("TOP SHOP", data)

    const channelList = [
        { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
        { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
        { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
        { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
        { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
        { name: 'ບໍລິການ', display: 'ບໍລິການ' },
        { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
    ];

    const SmartInsideLabel = ({ barKey }) => (props) => {
        const { x, y, width, height, value } = props;

        // Only show if bar is wide enough
        if (width < 60) return null;

        return (
            <text
                x={x + width - 8}
                y={y + height / 2}
                textAnchor="end"
                dominantBaseline="middle"
                style={{
                    fontSize: '8px',
                    fill: '#fff',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '600',
                }}
            >
                {formatNumber(value)}
            </text>
        );
    };

    useEffect(() => {
        const query = new URLSearchParams();
        if (bu) query.append('bu', bu);
        if (department) query.append('department', department);
        if (zone) query.append('area', zone);
        if (filter) query.append('filter', filter);

        api
            .get(`/channel/top-customersbybubychannel?${query.toString()}`)
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
    }, [filter, bu, department, zone]);
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '8px',
                    fontSize: '12px',
                    borderRadius: '5px',
                    boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                    fontFamily: 'Noto Sans Lao'
                }}>
                    <p><strong>{data.name}</strong></p>
                    <p>ຍອດລວມ: {formatNumber(data.total)}</p>
                    <p>📊 ຄິດເປັນ %: {parseFloat(data.percent).toFixed(1)}%</p>
                </div>
            );
        }

        return null;
    };
    return (
        <div className="bg-white text-black p-2 mb-2 rounded-sm shadow-sm font-[Noto_Sans_Lao]" >
            <div className="flex justify-between items-center mb-3 flex-wrap text-[12px]">
                <h5 className="text-red-600 font-bold font-[Noto_Sans_Lao] text-[12px]">
                    🏆 ຮ້ານຄ້າທີ່ມີຍອດຊື້ສູງສຸດ (Top 10)
                </h5>
                <div className="flex items-center gap-2 pt-2 flex-wrap text-[12px]">
                    <div className="flex items-center gap-1">
                        <label className="font-bold ">📢 ຊອ່ງທາງ:</label>
                        <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
                            {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
                        </select>
                        <label className="font-bold">🌍 ຂອບເຂດ:</label>
                        <select
                            className="text-[12px] border rounded px-2 py-1 w-[130px]"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                        >
                            {[
                                { code: 'all', name_1: 'ໂຊນທັງໝົດ' },
                                { code: 11, name_1: 'ZONE A' },
                                { code: 12, name_1: 'ZONE B' },
                                { code: 13, name_1: 'ZONE C' },
                                { code: 14, name_1: 'ZONE D' },
                                { code: 15, name_1: 'ZONE E' },
                                { code: 16, name_1: 'ZONE F' },
                            ].map((z) => (
                                <option key={z.code} value={z.code}>
                                    {z.name_1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <label className="font-bold">📅 ໄລຍະເວລາ:</label>
                        <select
                            className="text-[12px] border rounded px-2 py-1 w-[130px]"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="month" style={{ fontSize: '10px' }}>ເດືອນນີ້</option>
                            <option value="lastmonth" style={{ fontSize: '10px' }}>ເດືອນກ່ອນ</option>
                            <option value="year" style={{ fontSize: '10px' }}>ປີນີ້</option>
                        </select>
                    </div>

                    <div className="ml-2 inline-flex rounded overflow-hidden border text-[12px]">
                        <button
                            className={`px-3 py-1 ${viewMode === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border-r'
                                }`}
                            onClick={() => setViewMode('all')}
                        >
                            ທັງໝົດ
                        </button>
                        <button
                            className={`px-3 py-1 ${viewMode === 'chart'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border-r'
                                }`}
                            onClick={() => setViewMode('chart')}
                        >
                            Chart
                        </button>
                        <button
                            className={`px-3 py-1 ${viewMode === 'table'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600'
                                }`}
                            onClick={() => setViewMode('table')}
                        >
                            ຕາຕະລາງ
                        </button>
                    </div>
                </div>
            </div>


            {(viewMode === 'chart' || viewMode === 'all') && (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data} layout="vertical" barGap={30}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={formatNumber} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="total" name="📆 ປີນີ້" fill="#06ab9b" barSize={10}>
                            <LabelList dataKey="name" content={<CustomTopLabel />} />
                            <LabelList dataKey="percent" position="right" formatter={formatPercent} style={{ fontSize: 10 }} />
                            <LabelList dataKey="total" content={SmartInsideLabel({ barKey: 'total' })} position="insideRight" formatter={formatNumber} style={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
                        </Bar>
                        <Bar dataKey="total_24" name="📅 ປີຜ່ານມາ" fill="#DE5E57" barSize={10} >
                            <LabelList dataKey="total_24" position="insideRight" content={SmartInsideLabel({ barKey: 'total' })} formatter={formatNumber} style={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}

            {(viewMode === 'pie') && (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie data={data} dataKey="total" nameKey="name" outerRadius={140} label={({ name, percent }) => `${name}: ${percent}%`}>
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(val, name, props) => {
                            const item = data.find(d => d.name === props.payload.name);
                            return [`${format(val)} (Compare: ${formatPercent(item?.percentcompare)})`, name];
                        }} />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                </ResponsiveContainer>
            )}

            {(viewMode === 'table' || viewMode === 'all') && (
                <div className="overflow-x-auto mt-3">
                    <table className="min-w-[700px] w-full border text-center text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ຮ້ານຄ້າ</th>
                                <th className="border px-2 py-1">📆 ປີນີ້</th>
                                <th className="border px-2 py-1">📅 ປີກ່ອນ</th>
                                <th className="border px-2 py-1">% ຍອດຂາຍ/ທຽບປີກ່ອນ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td className="border px-2 py-1 text-left font-[Noto_Sans_Lao]">{row.name}</td>
                                    <td className="border px-2 py-1">{formatNumber(row.total)}</td>
                                    <td className="border px-2 py-1">{formatNumber(row.total_24)}</td>
                                    <td className="border px-2 py-1">{formatPercent(row.percentcompare)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
