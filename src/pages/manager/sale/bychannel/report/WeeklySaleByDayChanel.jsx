import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import api from '../../../../../services/api';

export default function WeeklySalesChnanel() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/all/sales-by-day')
            .then(response => {
                const chartData = response.data.map(item => ({
                    day: item.day_name.trim(),
                    total: parseFloat(item.total_amount)
                }));
                setData(chartData);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError('ດຶງຂໍ້ມູນຜິດ');
            })
            .finally(() => setLoading(false));
    }, []);
    const formatCurrency = v => {
        const num = parseInt(Number(v).toFixed(0), 10);
        return num.toLocaleString('en-US') + ' ฿';
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="card shadow-sm mb-2">
            <div className="card-body">
                <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">📊 ຍອດຂາຍຕາມວັນ</h5>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" fontSize={10} />
                            <XAxis dataKey="day" fontSize={10} />
                            <YAxis />
                            <Tooltip formatter={formatCurrency} fontSize={10} />
                            <Bar dataKey="total" fill="#82ca9d" fontSize={10}>
                                <LabelList dataKey="total" position="top" formatter={formatCurrency} fontSize={10} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
