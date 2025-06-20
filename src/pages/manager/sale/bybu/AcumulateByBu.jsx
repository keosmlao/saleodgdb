import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import api from '../../../../services/api';

const AccumulatedByBuBarChart = ({ bu }) => {
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('chart');
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedZone, setSelectedZone] = useState('all');
    const [buList, setBuList] = useState([]);
    const [filter, setFilter] = useState('thisMonth');

    useEffect(() => {
        api.get('/all/bu-list')
            .then(res => setBuList(res.data))
            .catch(err => console.error('❌ Load BU list failed:', err));
    }, []);

    // Single unified data loading function
    const loadData = () => {
        const params = new URLSearchParams();
        if (bu !== 'ALL' && bu !== 'all') params.append('bu', bu);
        if (selectedZone !== 'all') params.append('area', selectedZone);
        if (selectedChannel !== 'all') params.append('channel', selectedChannel);

        api.get(`/all/accumulated?${params.toString()}`)
            .then(response => {
                console.log('📊 API Response:', response.data);
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
    };

    // Load data when any filter changes
    useEffect(() => {
        loadData();
    }, [bu, selectedZone, selectedChannel, filter]);

    const channelList = [
        { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
        { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
        { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
        { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
        { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
        { name: 'ບໍລິການ', display: 'ບໍລິການ' },
        { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
    ];

    const CustomTopLabel = ({ x, y, value }) => (
        <text
            x={x}
            y={y - 2}
            textAnchor="start"
            fill="#000"
            fontSize={10}
            style={{
                fontFamily: 'Noto Sans Lao',
                fontWeight: 'bold'
            }}
        >
            {value}
        </text>
    );

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

    const formatNumber = v => { const num = Math.round(Number(v)); return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿'; };

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

    const formatPercent = (num) => num ? `${parseFloat(num).toFixed(1)}%` : '0%';

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
        <div className="bg-white p-3 mb-2 rounded-md shadow-sm text-black font-[Noto_Sans_Lao]" >
            <div className="flex justify-between items-center mb-3 flex-wrap text-[12px]">
                <h5 className="text-red-600 font-bold mb-0 font-[Noto_Sans_Lao]">
                    📊 ຍອດສະສົມ (Accumulated Bar Chart)
                </h5>
                <div className="flex items-center gap-2 flex-wrap py-2 font-[Noto_Sans_Lao]">
                    <label className="font-bold ">📢 ຊອ່ງທາງ:</label>
                    <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
                        {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
                    </select>
                    <label className="font-bold">🌍 ຂອບເຂດ:</label>
                    <select
                        className="text-sm border rounded px-2 py-1 w-[130px]"
                        value={selectedZone} // Fixed: Use selectedZone instead of bu
                        onChange={(e) => setSelectedZone(e.target.value)} // Fixed: Update selectedZone
                    >
                        {[
                            { code: 'all', name_1: '🌍 ໂຊນທັງໝົດ' },
                            { code: '11', name_1: 'ZONE A' },
                            { code: '12', name_1: 'ZONE B' },
                            { code: '13', name_1: 'ZONE C' },
                            { code: '14', name_1: 'ZONE D' },
                            { code: '15', name_1: 'ZONE E' },
                            { code: '16', name_1: 'ZONE F' },
                        ].map((z) => (
                            <option key={z.code} value={z.code}>
                                {z.name_1}
                            </option>
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
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart data={data} layout="vertical" barGap={30}>
                        <CartesianGrid strokeDasharray="3 3" fontSize={9} />
                        <XAxis type="number" fontSize={9} tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                        <YAxis type="category" dataKey="monthLabel" fontSize={9} width={50} hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="accumulated_target" fill="#FFD580" name="🎯 ເປົ້າໝາຍ" fontSize={9}>
                            <LabelList dataKey="monthLabel" content={<CustomTopLabel />} fontSize={9} />
                            <LabelList dataKey="accumulated_target" content={CustomInsideLabel} fontSize={9} className='text-white font-bold' formatter={formatCurrencies} />
                        </Bar>
                        <Bar dataKey="accumulated_revenue" fill="#06ab9b" name="📆 ຍອດຂາຍ" fontSize={9}>
                            <LabelList dataKey="accumulated_revenue" content={CustomInsideLabel} fontSize={9} className='text-white font-bold' formatter={formatCurrencies} />
                            <LabelList dataKey="percent_vs_target" position={"right"} formatter={formatPercent} fontSize={9} className='text-white font-bold' />
                        </Bar>
                        <Bar dataKey="accumulated_last_year" fill="#EF5350" name="📅 ປີຜ່ານມາ" fontSize={9}>
                            <LabelList dataKey="accumulated_last_year" content={CustomInsideLabel} fontSize={9} className='text-white font-bold' formatter={formatCurrencies} />
                            <LabelList dataKey="percent_vs_last_year" position={"right"} formatter={formatPercent} fontSize={9} className='text-white font-bold' />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}

            {(viewMode === 'table' || viewMode === 'all') && (
                <div className="overflow-x-auto mt-2 ">
                    <table className="min-w-full border text-center text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1">ເດືອນ</th>
                                <th className="border px-2 py-1">🎯 ເປົ້າໝາຍ</th>
                                <th className="border px-2 py-1">📆 ຍອດຂາຍ</th>
                                <th className="border px-2 py-1">% ປຽບທຽບເປົ້າ</th>
                                <th className="border px-2 py-1">📅 ປີຜ່ານມາ</th>
                                <th className="border px-2 py-1">📊 % ປຽບທຽບປີຜ່ານມາ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td className="border px-2 py-1">{row.monthLabel}</td>
                                    <td className="border px-2 py-1">{formatNumber(row.accumulated_target)}</td>
                                    <td className="border px-2 py-1">{formatNumber(row.accumulated_revenue)}</td>
                                    <td className="border px-2 py-1">
                                        {row.percent_vs_target >= 100 ? '▲' : '🔻'} {row.percent_vs_target.toFixed(1)}%
                                    </td>
                                    <td className="border px-2 py-1">{formatNumber(row.accumulated_last_year)}</td>
                                    <td className="border px-2 py-1">
                                        {row.percent_vs_last_year >= 100 ? '▲' : '🔻'} {row.percent_vs_last_year.toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AccumulatedByBuBarChart;