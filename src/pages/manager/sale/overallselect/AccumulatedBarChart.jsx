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

    const formatNumber = (num) => Number(num || 0).toLocaleString();

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
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="monthLabel" fontSize={9} />
                                <YAxis fontSize={9} tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                                <Tooltip fontSize={9} contentStyle={{ fontSize: '10px' }} formatter={(value, name, props) => {
                                    const { payload } = props;
                                    const percentVsTarget = payload.percent_vs_target?.toFixed(2) + '%' || 'N/A';
                                    const percentVsLastYear = payload.percent_vs_last_year?.toFixed(2) + '%' || 'N/A';
                                    const formattedValue = new Intl.NumberFormat().format(value);
                                    let additionalInfo = '';
                                    if (name === 'ຍອດຂາຍ') {
                                        additionalInfo = ` (vs Target: ${percentVsTarget}, vs Last Year: ${percentVsLastYear})`;
                                    }
                                    return [`${formattedValue}`, name + additionalInfo];
                                }} />
                                <Legend />
                                <Bar dataKey="accumulated_target" fill="#FFD580" name="ເປົ້າໝາຍ" fontSize={9} />
                                <Bar dataKey="accumulated_revenue" fill="#06ab9b" name="ຍອດຂາຍ" fontSize={9}>
                                    <LabelList dataKey="percent_vs_target" position="top" formatter={(value) => `${value.toFixed(1)}%`} fontSize={9} />
                                </Bar>
                                <Bar dataKey="accumulated_last_year" fill="#EF5350" name="ປີຜ່ານມາ" fontSize={9}>
                                    <LabelList dataKey="percent_vs_last_year" position="top" formatter={(value) => `${value.toFixed(1)}%`} fontSize={9} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="table-responsive mt-2">
                            <table className="table table-bordered table-striped text-center align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ເດືອນ</th>
                                        <th>🎯 ເປົ້າຂາຍ</th>
                                        <th>📆 ປີນີ້</th>
                                        <th>📅 ປີຜ່ານມາ</th>
                                        <th>% vs Target</th>
                                        <th>% vs Last Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.monthLabel}</td>
                                            <td>{formatNumber(row.accumulated_target)}</td>
                                            <td>{formatNumber(row.accumulated_revenue)}</td>
                                            <td>{formatNumber(row.accumulated_last_year)}</td>
                                            <td className={row.percent_vs_target >= 100 ? 'text-success fw-bold' : row.percent_vs_target >= 50 ? 'text-warning fw-bold' : 'text-danger fw-bold'}>
                                                {row.percent_vs_target.toFixed(1)}%
                                            </td>
                                            <td className={row.percent_vs_last_year >= 100 ? 'text-success fw-bold' : row.percent_vs_last_year >= 50 ? 'text-warning fw-bold' : 'text-danger fw-bold'}>
                                                {row.percent_vs_last_year.toFixed(1)}%
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
