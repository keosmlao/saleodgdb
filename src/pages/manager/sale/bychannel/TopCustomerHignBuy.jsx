import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = [
    '#007bff', '#6610f2', '#6f42c1', '#fd7e14', '#28a745',
    '#20c997', '#17a2b8', '#dc3545', '#ffc107', '#6c757d',
];

const format = (val) => Number(val).toLocaleString('en-US') + ' ₭';

const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
        {value}
    </text>
);

export default function TopCustomerBuyTen({ bu , department }) {
    const [filter, setFilter] = useState('year'); // month | lastmonth | year
    const [chartType, setChartType] = useState('bar');
    const [data, setData] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('all');
    const [selectedZone, setSelectedZone] = useState('all');
    const [viewMode, setViewMode] = useState('chart');

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
        api
            .get(`/bu/top-customersbybu/${bu}?filter=${filter}&channel=${selectedChannel}&zone=${selectedZone}`)
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
    }, [filter, bu, selectedChannel, selectedZone]);

    return (
        <div className="shadow-sm border-0 p-2 bg-white text-black rounded-lg mb-2 ">
            <h5 className="text-black font-[Noto_Sans_Lao] font-bold text-xs mb-0">🏆 ລູກຄ້າຊື້ສູງສຸດ 10 ລາຍ</h5>
            <div className="flex items-center gap-2 flex-wrap  text-[12px] font-[Noto_Sans_Lao] py-2">
                <label className="font-bold ">📢 ຊອ່ງທາງ:</label>
                <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
                    {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
                </select>

                <label className="font-bold ">🌍 ຂອບເຂດ:</label>
                <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
                    {[
                        { code: 'all', name_1: 'ທຸກ ZONE' },
                        { code: '11', name_1: 'ZONE A' },
                        { code: '12', name_1: 'ZONE B' },
                        { code: '13', name_1: 'ZONE C' },
                        { code: '14', name_1: 'ZONE D' },
                        { code: '15', name_1: 'ZONE E' },
                        { code: '16', name_1: 'ZONE F' },
                    ].map(z => (
                        <option key={z.code} value={z.code}>{z.name_1}</option>
                    ))}
                </select>
                <div className="flex items-center gap-1">
                    <label className="font-bold ">📅 ໄລຍະເວລາ:</label>
                    <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="month">ເດືອນນີ້</option>
                        <option value="lastmonth">ເດືອນກອ່ນ</option>
                        <option value="year">ປີນີ້</option>
                    </select>
                </div>

                <div className="ml-2 inline-flex rounded overflow-hidden border text-sm">
                    <label className="font-bold ">📊 ຮູບແບບ:</label>
                    <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
                    <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
                    <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
                </div>
            </div>


            {data.length === 0 ? (
                <div className="text-center text-black">ບໍ່ມີຂໍ້ມູນສຳລັບເວລານີ້</div>
            ) : chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => Number(v).toLocaleString()} />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip formatter={(v) => format(v)} />
                        <Bar dataKey="total" fill="#06ab9b" barSize={15}>
                            <LabelList dataKey="name" content={<CustomTopLabel />} position="left" />
                            <LabelList
                                dataKey="total"
                                position="insideMiddle"
                                formatter={(v) => Number(v).toLocaleString()}
                                style={{ fill: '#fff', fontSize: 6, fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie fontSize={8}
                            data={data}
                            dataKey="total"
                            nameKey="name"
                            outerRadius={140}
                            label={({ name, percent }) => `${name}: ${percent}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fontSize={8} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(v) => format(v)}
                            contentStyle={{ fontSize: '10px', padding: '5px' }}
                        />

                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: '6px' }}
                        />

                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
