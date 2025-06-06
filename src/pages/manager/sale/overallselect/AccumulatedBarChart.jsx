import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import api from '../../../../services/api';

const AccumulatedBarChart = () => {
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('chart');
    const [bu, setBu] = useState('ALL');
    const [buList, setBuList] = useState([]);

    useEffect(() => {
        // ดึง BU list จาก backend หรือ static list
        api.get('/all/bu-list') // สมมติว่ามี endpoint ดึง BU list
            .then(res => setBuList(res.data))
            .catch(err => console.error('❌ Load BU list failed:', err));
    }, []);

    useEffect(() => {
        api.get(`/all/accumulated${bu !== 'ALL' ? `?bu=${bu}` : ''}`)
            .then(response => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const processedData = response.data.map(item => {
                    const target = parseFloat(item.accumulated_target);
                    const revenue = parseFloat(item.accumulated_revenue);
                    const lastYear = parseFloat(item.accumulated_last_year);
                    return {
                        ...item,
                        monthLabel: monthNames[item.month - 1],
                        accumulated_target: target,
                        accumulated_revenue: revenue,
                        accumulated_last_year: lastYear,
                        percent_vs_target: target > 0 ? (revenue / target) * 100 : 0,
                        percent_vs_last_year: lastYear > 0 ? (revenue / lastYear) * 100 : 0,
                    };
                });
                setData(processedData);
            })
            .catch(error => {
                console.error('❌ Error fetching accumulated data:', error);
            });
    }, [bu]);

    // const formatNumber = (num) => Number(num || 0).toLocaleString();
    const formatNumber = v => { const num = Math.round(Number(v)); return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿'; };
    console.log("yrt da som ", data)
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
                    <p>🎯 ເປົ້າໝາຍ: {formatNumber(data.accumulated_target)}</p>
                    <p>📆 ຍອດຂາຍ: {formatNumber(data.accumulated_revenue)}</p>
                    <p>📅 ປີຜ່ານມາ: {formatNumber(data.accumulated_last_year)}</p>
                    <p style={{ color: data.percent_vs_target >= 100 ? 'green' : 'red' }}>
                        {data.percent_vs_target >= 100 ? '▲' : '🔻'} % ບັນລຸ: {data.percent_vs_target.toFixed(1)}%
                    </p>
                    <p style={{ color: data.percent_vs_last_year >= 100 ? 'green' : 'red' }}>
                        {data.percent_vs_last_year >= 100 ? '▲' : '🔻'} % ປຽບທຽບປີຜ່ານມາ: {data.percent_vs_last_year.toFixed(1)}%
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <div className="card mb-2 rounded-1 shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-danger fw-bold mb-0" style={{ fontSize: '15px' }}>
                            📊 ຍອດສະສົມ (Accumulated Bar Chart)
                        </h5>
                        <div className="d-flex gap-2">
                            <select className="form-select form-select-sm w-auto" value={bu} onChange={(e) => setBu(e.target.value)}>
                                <option value="ALL">ALL BU</option>
                                {buList.map((b, i) => (
                                    <option key={i} value={b.code}>{b.name_1}</option>
                                ))}
                            </select>
                            <select className="form-select form-select-sm w-auto" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                                <option value="chart">📈 Chart</option>
                                <option value="table">📋 Table</option>
                            </select>
                        </div>
                    </div>

                    {viewMode === 'chart' ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data} layout="vertical" barGap={30}  >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" fontSize={9} tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                                <YAxis type="category" dataKey="monthLabel" fontSize={9} width={50} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="accumulated_target" fill="#FFD580" name="ເປົ້າໝາຍ" fontSize={9} />
                                <Bar dataKey="accumulated_revenue" fill="#06ab9b" name="ຍອດຂາຍ" fontSize={9}>
                                    <LabelList dataKey="percent_vs_target" position="right" formatter={(value) => `${value.toFixed(1)}%`} fontSize={9} />
                                </Bar>
                                <Bar dataKey="accumulated_last_year" fill="#EF5350" name="ປີຜ່ານມາ" fontSize={9}>
                                    <LabelList dataKey="percent_vs_last_year" position="right" formatter={(value) => `${value.toFixed(1)}%`} fontSize={9} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    ) : (
                        <div className="table-responsive mt-2">
                            <table className="table table-bordered table-striped text-center align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ເດືອນ</th>
                                        <th>🎯 ເປົ້າໝາຍ</th>
                                        <th>📆 ຍອດຂາຍ</th>
                                        <th>% ປຽບທຽບເປົ້າ</th>
                                        <th>📅 ປີຜ່ານມາ</th>
                                        <th>📊 % ປຽບທຽບປີຜ່ານມາ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.monthLabel}</td>
                                            <td>{formatNumber(row.accumulated_target)}</td>
                                            <td>{formatNumber(row.accumulated_revenue)}</td>
                                            <td>
                                                {row.percent_vs_target >= 100 ? '▲' : '🔻'} {row.percent_vs_target.toFixed(1)}%
                                            </td>
                                            <td>{formatNumber(row.accumulated_last_year)}</td>
                                            <td>
                                                {row.percent_vs_last_year >= 100 ? '▲' : '🔻'} {row.percent_vs_last_year.toFixed(1)}%
                                            </td>
                                        </tr>

                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccumulatedBarChart;
