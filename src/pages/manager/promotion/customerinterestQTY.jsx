import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    LabelList, ResponsiveContainer
} from 'recharts';

const CustomTopLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} textAnchor="start" fill="#000" fontSize={10} style={{ fontFamily: 'Noto Sans Lao' }}>
        {value}
    </text>
);

export default function CustomerinterestQTY() {
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    useEffect(() => {
        axios.get('https://www.odienmall.com/pmt_top_reward/101')
            .then((res) => {
                const rawList = res.data.data_list;

                const chartData = rawList.map(item => ({
                    name: item.item_name?.trim() || 'ไม่มีชื่อ',
                    value: parseInt(item.product_redeem) || 0
                }));

                // กราฟ Top 10
                const top10 = [...chartData]
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10);

                setData(top10);
                setTableData(chartData);
            })
            .catch(err => console.error('❌ API error:', err));
    }, []);

    const totalPages = Math.ceil(tableData.length / pageSize);
    const paginatedData = tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="text-primary mb-4 text-center">📊 ສິນຄ້າທີ່ມີການແລກລາງວັນຫຼາຍທີ່ສຸດ</h5>
                    <div className="row">
                        <div className="col border-end ps-3">
                            <h5 className="text-center mb-3">📊 Top 10 ສິນຄ້າທີ່ມີການແລກລາງວັນຫຼາຍທີ່ສຸດ</h5>
                            <ResponsiveContainer width="100%" height={430}>
                                <BarChart data={data} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        type="number"
                                        domain={[0, 'dataMax']}
                                        tickFormatter={(v) => v.toLocaleString()}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        hide={true} // ✅ ซ่อนชื่อที่แกน
                                    />
                                    <Tooltip formatter={(v) => `${v} ครั้ง`} />
                                    <Bar dataKey="value" fill="#D3E2FD" barSize={20}>
                                        <LabelList dataKey="name" content={<CustomTopLabel />} style={{ margin: 5 }} />
                                        <LabelList
                                            dataKey="value"
                                            position="insideMiddle"
                                            formatter={(v) => v.toLocaleString()}
                                            style={{ fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col">
                            {/* <hr className="my-4" />*/}
                            <h5 className="text-center mb-3">📋 ສິນຄ້າທີ່ມີການແລກລາງວັນທັງໝົດ</h5>
                            <table className="table table-bordered table-striped m-0 p-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>ชื่อสินค้า</th>
                                        <th>จำนวนแลก</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                            <td className="text-truncate" style={{ maxWidth: '250px' }}>
                                                {item.name}
                                            </td>
                                            <td>{item.value.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div
                                className="d-flex justify-content-center align-items-center mt-2"
                                style={{ height: '35px', backgroundColor: '#D3E2FD' }} // หรือกำหนดความสูงที่ต้องการ
                            >
                                <nav>
                                    <ul className="pagination pagination-sm mb-0">
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <li
                                                key={idx}
                                                className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                                            >
                                                <button className="page-link" onClick={() => setCurrentPage(idx + 1)} style={{ fontSize: '10px' }}>
                                                    {idx + 1}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
