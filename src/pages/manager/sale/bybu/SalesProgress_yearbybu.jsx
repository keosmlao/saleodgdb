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
    <div className="card shadow-sm border-0 p-2 bg-white rounded-2 ">
      <center>
        <h5 className=" text-danger fw-bold" style={{fontSize:'13px'}}>{title}</h5>
      </center>

      <div className="d-flex justify-content-center">
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
        <div className="d-flex justify-content-between">
          <span style={{fontSize:'10px'}}>🎯 ເປົ້າ</span>
          <span className="fw-bold text-warning" style={{fontSize:'10px'}}>{formatNumber(target)}</span>
        </div>
        <div className="progress bg-light" style={{ height: '10px' }}>
          <div className="progress-bar" style={{ width: '100%', backgroundColor: '#ffc107' }} />
        </div>
      </div>

      <div className="mb-2">
        <div className="d-flex justify-content-between">
          <span style={{fontSize:'10px'}}>📆 ຍອດຂາຍປະຈຸບັນ</span>
          <span className="fw-bold text-success" style={{fontSize:'10px'}}>
            {formatNumber(revenue)} ({percentRevenue.toFixed(1)}%)
          </span>
        </div>
        <div className="progress bg-light" style={{ height: '10px' }}>
          <div
            className="progress-bar"
            style={{ width: `${percentRevenue}%`, backgroundColor: '#28a745' }}
          />
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-between">
          <span style={{fontSize:'10px'}}>📅 ປີກ່ອນ</span>
          <span className="fw-bold text-danger" style={{fontSize:'10px'}}>
            {formatNumber(lastYear)} ({percentLastYear.toFixed(1)}%)
          </span>
        </div>
        <div className="progress bg-light" style={{ height: '10px' }}>
          <div
            className="progress-bar"
            style={{ width: `${percentLastYear}%`, backgroundColor: '#dc3545' }}
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
    <div className="row">
      <div className="col-sm-12 col-md-4">
        <ComparisonCard title="📅 ປຽບທຽບຍອດຂາຍປະຈຳເດືອນ" data={data.total_month} />
      </div>
      <div className="col-sm-12 col-md-4">
        <ComparisonCard title="📦 ປຽບທຽບຍອດຂາຍສະສົມ" data={data.total_avg} />
      </div>
      <div className="col-sm-12 col-md-4">
        <ComparisonCard title="📈 ປຽບທຽບຍອດຂາຍປະຈຳປີ" data={data.total_year} />
      </div>
    </div>
  );
}
