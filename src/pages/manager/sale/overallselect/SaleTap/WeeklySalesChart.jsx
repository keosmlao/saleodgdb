import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import api from '../../../../../services/api';

export default function WeeklySalesChart() {
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

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => new Intl.NumberFormat().format(value)} />
          <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} fontSize={10} />
          <Bar dataKey="total" fill="#4CAF50" barSize={30} fontSize={10}>
            <LabelList dataKey="total" position="top" formatter={(value) => new Intl.NumberFormat().format(value)} fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
