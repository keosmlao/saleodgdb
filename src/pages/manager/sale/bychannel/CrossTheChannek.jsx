import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, Legend } from 'recharts';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const formatNumber = v => {
    const num = parseInt(Number(v).toFixed(0), 10);
    return num.toLocaleString('en-US') + ' ฿';
};
const CustomTopLabel = ({ x, y, value }) => <text x={x} y={y - 2} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>{value}</text>;

const channelList = [
    { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
];

const CustomInsideLabel = (props) => {
    const { x, y, width, height, value } = props;

    if (width < 80) return null;

    return (
        <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
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

export default function CrossTheChannel({ bu , department }) {
    const [filter, setFilter] = useState('thisMonth');
    const [viewMode, setViewMode] = useState('chart');
    const [data, setData] = useState([]);
    const [zone, setZone] = useState('all');
    const [selectedChannel, setSelectedChannel] = useState('all');
    console.log("log bu", bu)
    console.log("log filter", filter)
    console.log("data data", data)

    useEffect(() => {
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (zone && zone !== 'all') params.append('zone', zone);
        if (bu) params.append('bu', bu);
        if (selectedChannel && selectedChannel !== 'all') params.append('channel', selectedChannel);
        api.get(`/all/channel-summary?${params.toString()}`)
            .then(res => {
                const raw = res.data?.list || [];
                setData(raw.map((item, index) => ({
                    channel: item.channel_name || 'Unknown',
                    total2025: Number(item.total_2025 || 0),
                    total2024: Number(item.total_2024 || 0),
                    color: COLORS[index % COLORS.length],
                })));
            })
            .catch(err => { console.error('❌ Load channel summary failed:', err); setData([]); });
    }, [filter, zone, bu, selectedChannel]);

    return (
        <div className="bg-white p-3 text-black  shadow-sm  font-[Noto_Sans_Lao]">
            <h5 className="font-bold mb-2 text-[15px] font-[Noto_Sans_Lao]">📊 ສະຫຼູບຊອ່ງທາງ</h5>
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
                    <label className="font-bold ">📅 ໄລຍະເວລາ:</label>
                    <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="thisMonth">ເດືອນນີ້</option>
                        <option value="lastMonth">ເດືອນກອ່ນ</option>
                        <option value="accumulated">ຍອດສະສົມ</option>
                        <option value="fullYear">ທັງໝົດໃນປີ</option>
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
 
            {(viewMode === 'chart' || viewMode === 'all') && (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data} layout="vertical" barGap={30}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={formatNumber} />
                        <YAxis type="category" dataKey="channel" hide />
                        <Tooltip formatter={formatNumber} />
                        <Legend />
                        <Bar dataKey="total2025" fill='#06ab9b' name="📆 ຍອດຂາຍ" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2025-${index}`} fill="#06ab9b" />
                            ))}
                            <LabelList dataKey="channel" content={<CustomTopLabel />} />
                            <LabelList
                                dataKey="total2025"
                                position="right"
                                formatter={formatNumber}
                                content={CustomInsideLabel}
                                style={{
                                    fontSize: 10,
                                    fill: '#000',
                                    fontFamily: 'Noto Sans Lao',
                                    textDecoration: 'none',
                                }}
                            />
                        </Bar>
                        <Bar dataKey="total2024" fill="#DE5E57" name="📅 ປີຜ່ານມາ" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2024-${index}`} fill="#DE5E57" />
                            ))}
                            <LabelList
                                dataKey="total2024"
                                position="right"
                                formatter={formatNumber}
                                content={CustomInsideLabel}
                                style={{
                                    fontSize: 10,
                                    fill: '#000',
                                    fontFamily: 'Noto Sans Lao',
                                    textDecoration: 'none',
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

            )}

            {(viewMode === 'table' || viewMode === 'all') && (
                <div className="overflow-x-auto">
                    <table className="min-w-[500px] w-full border text-center text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">Channel</th>
                                <th className="border px-2 py-1">📆 2025</th>
                                <th className="border px-2 py-1">📅 2024</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="3" className="px-2 py-1">No Data</td></tr>
                            ) : (
                                data.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-2 py-1">{row.channel}</td>
                                        <td className="border px-2 py-1">{formatNumber(row.total2025)}</td>
                                        <td className="border px-2 py-1">{formatNumber(row.total2024)}</td>
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
