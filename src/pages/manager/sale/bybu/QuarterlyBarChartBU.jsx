import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, LabelList
} from 'recharts';
import axios from 'axios';
import api from '../../../../services/api'
export default function QuarterlyBarChartBU({bu}) {
  const [data, setData] = useState([]);

  useEffect(() => {


    api.get(`/bu/quarterly/${bu}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          const processed = res.data.map((item) => {
            const target = Number(item.target || 0);
            const revenue = Number(item.revenue || 0);
            const lastYear = Number(item.last_year || 0);
            const percentAchieved = target > 0 ? Math.round((revenue / target) * 100) : 0;

            let barColor = '#dc3545'; // red
            if (percentAchieved >= 80) barColor = '#28a745'; // green
            else if (percentAchieved >= 50) barColor = '#fd7e14'; // orange

            return {
              quarter: `Q${item.quarter}`,
              target,
              current: revenue,
              lastYear,
              percentAchieved,
              barColor,
            };
          });
          setData(processed);
        }
      })
      .catch((err) => console.error('Error loading API:', err));
  }, [bu]);

  const format = (v) => Number(v).toLocaleString('en-US') + ' ฿';

  return (
    <div className="card p-2">
      <h5 className="text-danger fw-bold mb-3">📊 ສະຫຼຸບຍອດຂາຍລາຍໄຕມາດ</h5>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis tickFormatter={(v) => Number(v).toLocaleString('en-US')} />
          <Tooltip formatter={(v) => format(v)} />
          <Legend />

          <Bar dataKey="target" name="🎯 ເປົ້າຂາຍ">
            {data.map((q, i) => <Cell key={`target-${i}`} fill="#ffc107" />)}
          </Bar>

          <Bar dataKey="current" name="📆 ປີນີ້">
            {data.map((q, i) => <Cell key={`current-${i}`} fill={q.barColor} />)}
            <LabelList
              dataKey="percentAchieved"
              position="top"
              formatter={(v) => `${v}%`}
              style={{ fontSize: 12, fill: '#000', fontWeight: 'bold' }}
            />
          </Bar>

          <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ">
            {data.map((q, i) => <Cell key={`last-${i}`} fill="#dc3545" />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
