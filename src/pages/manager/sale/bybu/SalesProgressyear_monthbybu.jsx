import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api'
export default function SalesComparisonProgressMonthbybu({bu}) {
  const [target, setTarget] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [lastYear, setLastYear] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    api
      .get(`/bu/saletotalbybu/${bu}`)
      .then((res) => {
        console.log('✅ API Response:', res.data);
        setTarget(Number(res.data.total_month.target) || 0);
        setRevenue(Number(res.data.total_month.revenue) || 0);
        setLastYear(Number(res.data.total_month.last_year) || 0);
      })
      .catch((err) => {
        console.error('❌ Error loading year summary:', err);
      })
      .finally(() => setLoading(false));
  }, [bu]);

  const formatNumber = (value) =>
    Number(value).toLocaleString('en-US', { minimumFractionDigits: 0 });

  const toPercent = (value) => (target > 0 ? (value / target) * 100 : 0);
  const percentRevenue = toPercent(revenue);
  const percentLastYear = toPercent(lastYear);

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

  if (loading) {
    return <div className="text-center py-5">⏳ Loading...</div>;
  }

  return (
    <div className="card shadow-sm border-0 p-4 bg-white rounded-4">
      <center>
        <h5 className="mb-4 text-danger fw-bold ">📈 ປຽບທຽບຍອດຂາຍປະຈຳເດືອນ</h5>
      </center>
      <div className="d-flex justify-content-center mb-4">
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
            {percentRevenue.toFixed(1)} %
          </text>
        </svg>
      </div>

      <div className="mb-2">
        <div className="d-flex justify-content-between">
          <span>🎯 ເປົ້ນຂາຍເດືອນນີ້ປີປະຈຸບັນ</span>
          <span className="fw-bold text-warning">{formatNumber(target)}</span>
        </div>
        <div className="progress bg-light" style={{ height: '10px' }}>
          <div className="progress-bar" style={{ width: '100%', backgroundColor: '#ffc107' }} />
        </div>
      </div>

      <div className="mb-2">
        <div className="d-flex justify-content-between">
          <span>📆 ຍອດຂາຍເດືອນນີ້ປີປະຈຸບັນ</span>
          <span className="fw-bold text-success">
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
          <span>📅 ຍອດຂາຍດືອນນີ້ປີກ່ອນ</span>
          <span className="fw-bold text-danger">
            {formatNumber(lastYear)}  ({percentLastYear.toFixed(1)}%)
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
}
