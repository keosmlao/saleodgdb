import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

const ComparisonCard = ({ title, data, icon, color = '#28a745' }) => {
  const formatNumber = (value) =>
    Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

  const target = Number(data?.target || 0);
  const revenue = Number(data?.revenue || 0);
  const lastYear = Number(data?.last_year || 0);

  const toPercent = (value) => (target > 0 ? (value / target) * 100 : 0);

  const percentRevenue = toPercent(revenue);
  const percentLastYear = lastYear > 0 ? (revenue / lastYear) * 100 : 0;

  return (
    <div className="bg-white shadow-sm border-0 p-3 rounded-2xl mb-3 h-full flex flex-col justify-center items-center font-['Noto_Sans_Lao']">
      <h6 className="font-bold text-center text-black mb-2">{title}</h6>
      <div className="flex justify-center items-center w-[160px] h-[160px]">
        <CircularProgressbarWithChildren
          value={percentRevenue}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#e0e0e0",
            strokeLinecap: "round",
            pathTransitionDuration: 1.5,
          })}>
          <div style={{ fontSize: 20, color, marginBottom: 4 }}>{icon}</div>
          <div className='text-black' style={{ fontSize: 30, fontWeight: 'bold' }}>
            {percentRevenue.toFixed(1)}%
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="w-full mt-2 text-sm space-y-2 text-black">
        <div>
          <div className="flex justify-between">
            <span>🎯 ເປົ້າໝາຍ</span>
            <span className="font-bold text-yellow-600">{formatNumber(target)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div className="h-full bg-amber-400 rounded-full w-full" />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <span>📆 ຍອດຂາຍ</span>
            <span className="font-bold text-blue-500">{formatNumber(revenue)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{ width: `${Math.min(percentRevenue, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <span>📅 ປີຜ່ານມາ</span>
            <span className="font-bold text-red-600">{formatNumber(lastYear)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${Math.min(percentLastYear, 100)}%` }}
            />
          </div>
        </div>
        <div className='pt-1 flex justify-between items-center'>
          <label className='text-green-600 text-sm'>
            ປຽບທຽບເປົ້າຂາຍ: ({percentRevenue.toFixed(1)}%)
          </label>
          <label className='text-red-600 text-sm'>
            ປຽບທຽບປີທີ່ຜ່ານມາ: {percentLastYear.toFixed(1)}%
          </label>
        </div>
      </div>
    </div>
  );
};

export default function TotalOverallByChannel({ bu, department }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_month: {},
    total_avg: {},
    total_year: {},
    lastMonth: {}
  });

  console.log("data total overall", data)

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);

    api
      .get(`/channel/saletotalbybuchannel?${query.toString()}`)
      .then((res) => {
        console.log('API Response:', res.data);
        setData({
          total_month: res.data.total_month || {},
          lastMonth: res.data.lastMonth || {},
          total_avg: res.data.total_avg || {},
          total_year: res.data.total_year || {},
        });
      })
      .catch((err) => console.error('❌ Error loading data:', err))
      .finally(() => setLoading(false));
  }, [bu, department]);

  if (loading) return <div className="text-center py-5">⏳ Loading...</div>;

  return (
    <div className="grid lg:grid-cols-4">
      <div className="w-full sm:w-full px-2">
        <ComparisonCard
          title="📅 ປຽບທຽບຍອດຂາຍປະຈຳເດືອນ"
          color='#52c41a'
          data={data.total_month}
        />
      </div>
      <div className="w-full sm:w-full px-2 ">
        <ComparisonCard title="📅 ເດືອນກອ່ນ" color='#fa8c16' data={data.lastMonth} />
      </div>
      <div className="w-full sm:w-full px-2">
        <ComparisonCard
          title="📦 ປຽບທຽບຍອດຂາຍສະສົມ"
          color='#722ed1'
          data={data.total_avg}
        />
      </div>
      <div className="w-full sm:w-full px-2">
        <ComparisonCard
          title="📈 ປຽບທຽບຍອດຂາຍປະຈຳປີ"
          color='#f5222d'
          data={data.total_year}
        />
      </div>
    </div>
  );
}