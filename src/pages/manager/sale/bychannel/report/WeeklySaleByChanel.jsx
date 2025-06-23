import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import api from '../../../../../services/api';

export default function WeeklySalesChanel() {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get('/all/sale-summary/weeks-in-month')
            .then((response) => {
                const chartData = response.data.list.map(item => ({
                    week: item.week_in_month,
                    total: parseFloat(item.total_amount),
                }));
                setData(chartData);
            })
            .catch((error) => {
                console.error('Error fetching weekly sales data:', error);
            });
    }, []);
    const formatCurrency = v => {
        const num = parseInt(Number(v).toFixed(0), 10);
        return num.toLocaleString('en-US') + ' ກີບ';
    };


    return (
        <div className="card shadow-sm mb-2">
            <div className="card-body">
                <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">📊 ຍອດຂາຍຕາມອາທິດ</h5>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
                        <Tooltip formatter={formatCurrency} fontSize={10} />
                        <Bar dataKey="total" fill="#4CAF50" barSize={30} fontSize={10}>
                            <LabelList dataKey="total" position="top" formatter={formatCurrency} fontSize={10} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
