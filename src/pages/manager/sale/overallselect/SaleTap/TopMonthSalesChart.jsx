import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import api from '../../../../../services/api';

const TopMonthSaleChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/all/sale-summary/month')
      .then((res) => {
        const data = res.data.list.map(item => ({
          month: `ເດືອນ ${item.month}`,
          monthRaw: parseInt(item.month),
          total: parseFloat(item.total_amount)
        }));

        setChartData(data);
      })
      .catch((err) => {
        console.error('Error fetching monthly sales:', err);
        setError('ດຶງຂໍ້ມູນຜິດພາດ');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = v => {
    const num = Math.round(Number(v));
    return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿';
  };

  return (
    <div className="card shadow-sm mb-2">
      <div className="card-body">
        <h5 className="font-bold mb-3 text-[15px] font-[Noto_Sans_Lao]">📊 ຍອດຂາຍຕາມເດືອນ</h5>
        {loading ? (
          <p className="text-center text-secondary">⏳ ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
            >
              <CartesianGrid strokeDasharray="3 3" fontSize={9} />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis tickFormatter={formatCurrency} fontSize={9} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'ຍອດຂາຍ']} fontSize={9} />
              <Bar dataKey="total" fill="#4CAF50" fontSize={9}>
                <LabelList dataKey="total" position="top" formatter={formatCurrency} fontSize={9} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopMonthSaleChart;
