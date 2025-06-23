import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const COLORS = [
    '#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#fd7e14',
    '#ffc107', '#28a745', '#20c997', '#17a2b8', '#dc3545',
];

const format = (val) => Number(val).toLocaleString('en-US') + ' ฿';

const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
        {value}
    </text>
);

export default function TopSellingProductByChanel({ bu, department }) {
    const [filter, setFilter] = useState('year');
    const [chartType, setChartType] = useState('bar');
    const [channel, setChannel] = useState('all');
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('chart');
    const [selectedZone, setSelectedZone] = useState('all');

    const channelList = [
        { name: 'all', display: 'ຊ່ອງທາງທັງໝົດ' },
        { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
        { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
        { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
        { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
        { name: 'ບໍລິການ', display: 'ບໍລິການ' },
        { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
    ];

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedZone !== 'all') params.append('area', selectedZone);

        api.get(`/bu/top-productbybu/${bu}?${params.toString()}`)
            .then((res) => {
                const raw = res.data?.[filter] || [];
                const cleaned = raw.map((item) => ({
                    name: item.item_name,
                    total: Number(item.total_amount || 0),
                }));
                const sumTotal = cleaned.reduce((sum, p) => sum + p.total, 0);
                const withPercent = cleaned.map((p, i) => ({
                    ...p,
                    percent: sumTotal > 0 ? ((p.total / sumTotal) * 100).toFixed(1) : '0.0',
                    rank: i + 1,
                }));

                setData(withPercent);
            })
            .catch((err) => {
                console.error('API error:', err);
                setData([]);
            });
    }, [filter, bu, selectedZone, channel]);

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `TopProducts_${filter}`);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `TopProducts_${filter}.xlsx`);
    };

    return (
        <div className="bg-white shadow-sm text-black border-0 p-2 rounded mb-2 ">
            <h5 className="text-black font-bold text-[13px] font-[Noto_Sans_Lao]">🔥 ສິນຄ້າຂາຍດີ Top 10</h5>
            <div className="flex flex-wrap gap-2 mb-3 text-[12px] font-[Noto_Sans_Lao]">
                <div className="flex items-center gap-1">
                    <label className="font-bold ">🏪 ຊ່ອງທາງ:</label>
                    <select className="text-sm border rounded px-2 py-1 w-[130px]" value={channel} onChange={e => setChannel(e.target.value)}>
                        {channelList.map(c => <option key={c.name} value={c.name}>{c.display}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-1">
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
                </div>
                <div className="flex items-center gap-1">
                    <label className="font-bold ">📅 ໄລຍະເວລາ:</label>
                    <select className="text-sm border rounded px-2 py-1 w-[130px]" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="month">ເດືອນນີ້</option>
                        <option value="lastmonth">ເດືອນກອ່ນ</option>
                        <option value="year">ປີນີ້</option>
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

            {data.length === 0 ? (
                <div className="text-center text-muted">ບໍ່ມີຂໍ້ມູນສຳລັບເວລານີ້</div>
            ) : viewMode === 'chart' ? (
                chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height={430}>
                        <BarChart data={data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(v) => Number(v).toLocaleString()} fontSize={10} />
                            <YAxis type="category" dataKey="name" hide fontSize={10} />
                            <Tooltip formatter={(v) => format(v)} fontSize={10} />
                            <Bar dataKey="total" fill="#06ab9b" barSize={15}>
                                <LabelList dataKey="name" content={<CustomTopLabel />} position="left" fontSize={10} />
                                <LabelList fontSize={10}
                                    dataKey="total"
                                    position="insideMiddle"
                                    formatter={(v) => Number(v).toLocaleString()}
                                    style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ຊື່ສິນຄ້າ</th>
                                    <th className="border border-gray-300 px-4 py-2 text-right font-semibold">ຈຳນວນ</th>
                                    <th className="border border-gray-300 px-4 py-2 text-right font-semibold">ເປີເຊັນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    const total = data.reduce((sum, d) => sum + d.total, 0);
                                    const percentage = ((item.total / total) * 100).toFixed(1);
                                    return (
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                        >
                                            <td className="border border-gray-300 px-4 py-2 text-sm">
                                                {item.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-right text-sm font-medium">
                                                {format(item.total)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-right text-sm">
                                                {percentage}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ຊື່ສິນຄ້າ</th>
                                <th className="border border-gray-300 px-4 py-2 text-right font-semibold">ຈຳນວນ</th>
                                <th className="border border-gray-300 px-4 py-2 text-right font-semibold">ເປີເຊັນ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                const total = data.reduce((sum, d) => sum + d.total, 0);
                                const percentage = ((item.total / total) * 100).toFixed(1);
                                return (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="border border-gray-300 px-4 py-2 text-sm">
                                            {item.name}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-right text-sm font-medium">
                                            {format(item.total)}
                                        </td>
                                        <td className={`border border-gray-300 px-3 py-2 text-right font-medium ${percentage >= 100 ? 'text-green-600' : percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}