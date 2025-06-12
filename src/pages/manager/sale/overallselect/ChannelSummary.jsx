import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell, Legend } from 'recharts';
import api from '../../../../services/api';

const COLORS = ['#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745', '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d'];
const format = (val) => Number(val).toLocaleString('en-US') + ' ฿';
// const formatNumber = (num) => Number(num || 0).toLocaleString();
const formatNumber = v => {
    const num = parseInt(Number(v).toFixed(0), 10);
    return num.toLocaleString('en-US') + ' ฿';
};
const CustomTopLabel = ({ x, y, value }) => <text x={x} y={y - 2} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>{value}</text>;

export default function ChannelSummary() {
    const [filter, setFilter] = useState('thisMonth');
    const [viewMode, setViewMode] = useState('chart');
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get(`/all/channel-summary?filter=${filter}`)
            .then(res => {
                const raw = res.data?.list || [];
                setData(raw.map((item, index) => ({
                    channel: item.channel_name || 'Unknown',
                    total2025: Number(item.total_2025 || 0),
                    total2024: Number(item.total_2024 || 0),
                    color: COLORS[index % COLORS.length], // 👈 Assign color per channel
                })));
            })
            .catch(err => { console.error('❌ Load channel summary failed:', err); setData([]); });
    }, [filter]);

    return (
        <div className="bg-white p-3 rounded-2xl shadow-sm">
            <h5 className="font-bold mb-2 text-[15px] font-[Noto_Sans_Lao]">📊 ສະຫຼູບຊອ່ງທາງ</h5>
            <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1">
                    <label className="font-bold text-[14px]">📅 ໄລຍະເວລາ:</label>
                    <select className="text-sm border font-[Noto_Sans_Lao] rounded px-2 py-1 w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="thisMonth">ເດືອນນີ້</option>
                        <option value="lastMonth">ເດືອນຜ່ານມາ</option>
                        <option value="accumulated">ສະສົມ</option>
                        <option value="fullYear">ປີນີ້</option>
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
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data} layout="vertical" barGap={30}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={formatNumber} />
                        <YAxis
                            type="category"
                            dataKey="channel"
                            tick={{ fontSize: 12, fill: '#333', fontFamily: 'Noto Sans Lao' }}
                        />
                        <Tooltip formatter={formatNumber} />
                        <Legend />

                        <Bar dataKey="total2025" name="📆 2025" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2025-${index}`} fill={'#FF6B6B'} />
                            ))}
                            <LabelList
                                dataKey="total2025"
                                position="right"
                                formatter={formatNumber}
                                style={{ fontSize: 10, fill: '#000', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}
                            />
                        </Bar>

                        <Bar dataKey="total2024" name="📅 2024" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2024-${index}`} fill={'#FFA726'} />
                            ))}
                            <LabelList
                                dataKey="total2024"
                                position="right"
                                formatter={formatNumber}
                                style={{ fontSize: 10, fill: '#000', textDecoration: 'none', fontFamily: 'Arial, sans-serif' }}
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
