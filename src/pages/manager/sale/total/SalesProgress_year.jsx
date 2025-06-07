import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaCalendarAlt, FaBoxOpen, FaLayerGroup, FaChartLine } from 'react-icons/fa';

const formatNumber = (value) =>
  Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

const ComparisonCard = ({ title, data, icon, color, barColor }) => {
  const target = Number(data.target || 0);
  const revenue = Number(data.revenue || 0);
  const lastYear = Number(data.last_year || 0);
  const toPercent = (value) => (target > 0 ? (value / target) * 100 : 0);
  const percentRevenue = toPercent(revenue);
  const percentLastYear = lastYear > 0 ? (revenue / lastYear) * 100 : 0;
  const salesTarget = target / revenue;
  const comparePastYear = (revenue / lastYear) * 100;
  return (
    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white mb-3 h-100 d-flex flex-column justify-content-center align-items-center">
      <h6 className="fw-bold text-center" style={{ color }}>{title}</h6>
      <div className="d-flex justify-content-center align-items-center" style={{ width: 160, height: 160 }}>
        <CircularProgressbarWithChildren
          value={percentRevenue}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#e0e0e0",
            strokeLinecap: "round",
            pathTransitionDuration: 1.5,
          })}
        >
          <div style={{ fontSize: 20, color, marginBottom: 4 }}>{icon}</div>
          <div style={{ fontSize: 30, fontWeight: 'bold' }}>{percentRevenue.toFixed(1)}%</div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="w-100 mt-2 small">
        <div className="d-flex justify-content-between">
          <span>🎯 ເປົ້າໝາຍ</span>
          <span className="fw-bold text-warning">{formatNumber(target)}</span>
        </div>
        <div className="progress rounded-pill" style={{ height: '8px' }}>
          <div className="progress-bar bg-warning" style={{ width: '100%' }}></div>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <span>📆 ຍອດຂາຍ</span>
          <span className="fw-bold text-info">{formatNumber(revenue)} </span>
        </div>
        <div className="progress rounded-pill" style={{ height: '8px' }}>
          <div className="progress-bar " style={{ width: `${percentRevenue}%`, backgroundColor: barColor }}></div>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <span>📅 ປີຜ່ານມາ</span>
          <span className="fw-bold text-danger">{formatNumber(lastYear)}</span>
        </div>
        <div className="progress rounded-pill" style={{ height: '8px' }}>
          <div className="progress-bar bg-danger" style={{ width: `${percentLastYear}%` }}></div>
        </div>
        <div className='pt-1 d-flex justify-content-between align-items-center'>
          <label className='text-success ' >ປຽບທຽບເປົ້າຂາຍ : ({percentRevenue.toFixed(1)}%)</label>
          <label className='text-danger'>ປຽບທຽບປີທີ່ຜ່ານມາ : {percentLastYear.toFixed(1)}%</label>
        </div>

      </div>
    </div>
  );
};

export default function SalesComparisonProgressAll() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ total_month: {}, total_avg: {}, total_year: {}, lastMonth: {} });
  const [bu, setBu] = useState('all');
  const [buList, setBuList] = useState([]);

  const fetchData = () => {
    setLoading(true);
    api.get(`/all/saletotal${bu !== 'all' ? `?bu=${bu}` : ''}`)
      .then(res => {
        setData({
          total_month: res.data.total_month || {},
          total_avg: res.data.total_avg || {},
          total_year: res.data.total_year || {},
          lastMonth: res.data.lastMonth || {},
        });
      })
      .catch(err => console.error('❌ Error loading data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/all/bu-list').then(res => setBuList(res.data)).catch(err => console.error(err));
  }, []);

  useEffect(() => { fetchData(); }, [bu]);

  return (
    <div className="py-3">
      <div className="d-flex justify-content-center mb-3">
        <select
          value={bu}
          onChange={(e) => setBu(e.target.value)}
          className="form-select w-auto custom-select-beauty"
        >
          <option value="all" disabled className="text-muted">🔎 ລວມບໍລິສັດ</option>
          {buList.map(item => (
            <option key={item.code} value={item.code}>
              {item.name_1}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-50">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-3 justify-content-center">
          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
            <ComparisonCard title="📅 ເດືອນນີ້" data={data.total_month} icon={<FaCalendarAlt />} color="#06ab9b" barColor="#06ab9b" />
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
            <ComparisonCard title="📦 ເດືອນກ່ອນ" data={data.lastMonth} icon={<FaBoxOpen />} color="#ffa500" barColor="#06ab9b" />
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
            <ComparisonCard title="📚 ສະສົມ" data={data.total_avg} icon={<FaLayerGroup />} color="#673ab7" barColor="#06ab9b" />
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-3">
            <ComparisonCard title="📈 ທັງປີ" data={data.total_year} icon={<FaChartLine />} color="#e53935" barColor="#06ab9b" />
          </div>
        </div>
      )}
    </div>
  );
}
