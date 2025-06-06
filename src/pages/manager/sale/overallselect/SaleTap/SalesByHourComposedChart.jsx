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

    const formatCurrency = v => {
        const num = parseInt(Number(v).toFixed(0), 10);
        return num.toLocaleString('en-US') + ' ກີບ';
    };


    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', border: '1px solid #ccc', padding: 8, borderRadius: 5 }}>
                    <p><strong>{label}</strong></p>
                    <p style={{ color: '#06ab9b' }}>ຍອດຂາຍ: {formatCurrency(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div className="card shadow-sm mb-2">
                <div className="card-body">
                    {loading ? (
                        <p className="text-center text-secondary">⏳ ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
                    ) : error ? (
                        <p className="text-center text-danger">{error}</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart
                                data={data}
                                layout="vertical"
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={formatCurrency} fontSize={10} />
                                <YAxis dataKey="hour" type="category" width={80} fontSize={10} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total">
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.total === maxTotal ? '#FF5733' : '#06ab9b'}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="total"
                                        position="right"
                                        formatter={value => `${value.toLocaleString()} B`}
                                        style={{ fontSize: 10, fill: '#000' }}
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
