import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const ComparisonCard = ({ title, data }) => {
  const formatNumber = (value) =>
    Number(value).toLocaleString('en-US', { minimumFractionDigits: 0 });

  const target = Number(data.target || 0);
  const revenue = Number(data.revenue || 0);
  const lastYear = Number(data.last_year || 0);

  const toPercent = (value) => (target > 0 ? (value / target) * 100 : 0);
  const percentRevenue = toPercent(revenue);
  const percentLastYear =
    title.includes('ປີ') && lastYear > 0
      ? (revenue / lastYear) * 100
      : toPercent(lastYear);

  const renderCircleLayer = (percent, radius, color) => {
    const stroke = 8;
    const r = radius;
    const c = 2 * Math.PI * r;
    const dash = (percent / 100) * c;

    return (
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="transparent"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 100 100)"
      />
    );
  };

  return (
      <div className="shadow-sm border-0 p-2 bg-white rounded-lg">
          <div className="text-center">
              <h5 className="text-black font-bold text-xs font-[Noto_Sans_Lao]">{title}</h5>
          </div>

          <div className="flex justify-center">
              <svg width="200" height="200">
                  {renderCircleLayer(100, 60, '#ffc107')}
                  {renderCircleLayer(percentRevenue, 50, '#28a745')}
                  {renderCircleLayer(percentLastYear, 40, '#dc3545')}
                  <text
                      x="100"
                      y="100"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="14"
                      fontWeight="bold"
                  >
                      {percentRevenue.toFixed(1)}%
                  </text>
              </svg>
          </div>

          <div className="mb-2">
              <div className="flex justify-between">
                  <span className="text-xs">🎯 ເປົ້າ</span>
                  <span className="font-bold text-yellow-500 text-xs">{formatNumber(target)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '100%'}}/>
              </div>
          </div>

          <div className="mb-2">
              <div className="flex justify-between">
                  <span className="text-xs">📆 ຍອດຂາຍປະຈຸບັນ</span>
                  <span className="font-bold text-green-500 text-xs">
        {formatNumber(revenue)} ({percentRevenue.toFixed(1)}%)
      </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{width: `${percentRevenue}%`}}
                  />
              </div>
          </div>

          <div>
              <div className="flex justify-between">
                  <span className="text-xs">📅 ປີກ່ອນ</span>
                  <span className="font-bold text-red-600 text-xs">
        {formatNumber(lastYear)} ({percentLastYear.toFixed(1)}%)
      </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                      className="bg-red-600 h-2.5 rounded-full"
                      style={{width: `${percentLastYear}%`}}
                  />
              </div>
          </div>
      </div>
  );
};

export default function SalesComparisonProgressAllBU({bu}) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        total_month: {},
        total_avg: {},
        total_year: {},
    });

    useEffect(() => {
        api
            .get(`/bu/saletotalbybu/${bu}`)
            .then((res) => {
                setData({
                    total_month: res.data.total_month || {},
                    total_avg: res.data.total_avg || {},
                    total_year: res.data.total_year || {},
                });
            })
            .catch((err) => console.error('❌ Error loading data:', err))
            .finally(() => setLoading(false));
    }, [bu]);

    if (loading) return <div className="text-center py-5">⏳ Loading...</div>;

    return (
        <div className="grid lg:grid-cols-3 grid">
            <div className="w-full sm:w-full  px-4">
                <ComparisonCard title="📅 ປຽບທຽບຍອດຂາຍປະຈຳເດືອນ" data={data.total_month}/>
            </div>
            <div className="w-full sm:w-full  px-4">
                <ComparisonCard title="📦 ປຽບທຽບຍອດຂາຍສະສົມ" data={data.total_avg}/>
            </div>
            <div className="w-full sm:w-full  px-4">
                <ComparisonCard title="📈 ປຽບທຽບຍອດຂາຍປະຈຳປີ" data={data.total_year}/>
            </div>
        </div>
    );
}
