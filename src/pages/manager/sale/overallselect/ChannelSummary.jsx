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
    const [chartType, setChartType] = useState('bar');
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
        <div className="card p-3 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3 text-primary" style={{ fontSize: '15px' }}>📊 ສະຫຼູບຊອ່ງທາງ</h5>
            <div className="d-flex gap-2 mb-3">
                <select className="form-select w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="thisMonth">ເດືອນນີ້</option>
                    <option value="lastMonth">ເດືອນຜ່ານມາ</option>
                    <option value="accumulated">ສະສົມ</option>
                    <option value="fullYear">ປີນີ້</option>
                </select>
                <select className="form-select w-auto" value={chartType} onChange={e => setChartType(e.target.value)}>
                    <option value="table">Table</option>
                    <option value="bar">Bar Chart</option>
                </select>
            </div>

            {chartType === 'bar' && (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        barGap={30}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={formatNumber} />
                        <YAxis
                            type="category"
                            dataKey="channel"
                            tick={{ fontSize: 12, fill: '#333', fontFamily: 'Noto Sans Lao' }}
                        />
                        <Tooltip formatter={formatNumber} />
                        <Legend />

                        <Bar dataKey="total2025" name="2025" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2025-${index}`} fill={'#FF6B6B'} />
                            ))}
                            <LabelList
                                dataKey="total2025"
                                position="right"
                                formatter={formatNumber}
                                style={{
                                    fontSize: 10,
                                    fill: '#000',
                                    textDecoration: 'none',
                                    fontFamily: 'Arial, sans-serif'
                                }}
                            />
                        </Bar>

                        <Bar dataKey="total2024" name="2024" barSize={30}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-2024-${index}`} fill={'#FFA726'} />
                            ))}
                            <LabelList
                                dataKey="total2024"
                                position="right"
                                formatter={formatNumber}
                                style={{
                                    fontSize: 10,
                                    fill: '#000',
                                    textDecoration: 'none',
                                    fontFamily: 'Arial, sans-serif'
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}

            {chartType === 'table' && (
                <div className="table-responsive">
                    <table className="table table-bordered text-center">
                        <thead className="table-light">
                            <tr><th>Channel</th><th>📆 2025</th><th>📅 2024</th></tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="3">No Data</td></tr>
                            ) : (
                                data.map((row, idx) => (
                                    <tr key={idx}><td>{row.channel}</td><td>{formatNumber(row.total2025)}</td><td>{formatNumber(row.total2024)}</td></tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
