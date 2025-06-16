import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell
} from 'recharts';
import api from '../../../../../services/api';

const HourlySalesChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [maxTotal, setMaxTotal] = useState(0);

    useEffect(() => {
        api.get('/all/sale-summary/hour-all')
            .then((res) => {
                const chartData = res.data.list
                    .map(item => ({
                        hour: `${item.hour}:00`,
                        hourRaw: parseInt(item.hour),
                        total: parseFloat(item.total_amount)
                    }))
                    .sort((a, b) => a.hourRaw - b.hourRaw);
                const max = Math.max(...chartData.map(item => item.total));
                setMaxTotal(max);
                setData(chartData);
            })
            .catch((err) => {
                console.error('Error fetching hour summary:', err);
                setError('ດຶງຂໍ້ມູນຜິດພາດ');
            })
            .finally(() => setLoading(false));
    }, []);

    const formatNumber = v => {
        const num = Math.round(Number(v));
        return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿';
    };


    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', border: '1px solid #ccc', padding: 8, borderRadius: 5 }}>
                    <p><strong>{label}</strong></p>
                    <p style={{ color: '#06ab9b' }}>ຍອດຂາຍ: {formatNumber(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };
    const CustomTopLabel = ({ x, y, value }) => (
        <text
            x={x}
            y={y - 2}
            textAnchor="start"
            fill="#000"
            fontSize={8}
            style={{
                fontFamily: 'Noto Sans Lao',
            }}      
        >
            {value}
        </text>
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className="card shadow-sm mb-2">
                <div className="card-body">
                    <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">📊 ຍອດຂາຍຕາມຊົ່ວໂມງ</h5>
                    {loading ? (
                        <p className="text-center text-secondary">⏳ ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
                    ) : error ? (
                        <p className="text-center text-danger">{error}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart
                                data={data}
                                layout="vertical"
                                barGap={500}
                                maxBarSize={10}
                                barCategoryGap={20}
                                barSize={10}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={formatNumber} fontSize={10} />
                                <YAxis dataKey="hour" type="category" width={60} fontSize={10} hide />

                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total">
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.total === maxTotal ? '#FF5733' : '#06ab9b'}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="hour"
                                        content={<CustomTopLabel />}
                                        formatter={formatNumber}
                                        style={{ fontSize: 10, fill: '#000' }}
                                    />

                                    <LabelList
                                        dataKey="total"
                                        content={({ x, y, value }) => (
                                            <text
                                                x={x + 5}   
                                                y={y + 8}
                                                fill="#000"
                                                fontSize={8}
                                                fontFamily="Noto Sans Lao"
                                            >
                                                {formatNumber(value)}
                                            </text>
                                        )}
                                    />


                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HourlySalesChart;
