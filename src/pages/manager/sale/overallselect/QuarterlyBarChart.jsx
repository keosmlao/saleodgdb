import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from 'recharts';
import api from '../../../../services/api';

export default function QuarterlyBarChart() {
  const [data, setData] = useState([]);
  const [selectedBU, setSelectedBU] = useState('all');
  const [buList, setBuList] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [viewMode, setViewMode] = useState('chart');
  console.log("select zone", selectedZone)

  const channelList = [
    { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];
  console.log("log data", data)
  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...res.data]))
      .catch(err => console.error('Error loading BU list:', err));
  }, []);

  const loadData = () => {
    const params = new URLSearchParams();
    if (selectedBU !== 'all') params.append('bu', selectedBU);
    if (selectedZone !== 'all') params.append('area', selectedZone); // 🔥 Update เป็น 'area'
    if (selectedChannel !== 'all') params.append('channel', selectedChannel); // 🔥 เพิ่ม 'channel'
    console.log("**********", params)

    api.get(`/all/quarterly?${params.toString()}`) // 🔥 เรียก API /quarterly
      .then(res => {
        const processed = (res.data || []).map(item => {
          const target = Number(item.target || 0);
          const revenue = Number(item.revenue || 0);
          const lastYear = Number(item.last_year || 0);
          const percentAchieved = target > 0 ? (revenue / target) * 100 : 0;
          const compareLastYear = lastYear > 0 ? (revenue / lastYear) * 100 : 0;
          return {
            quarter: item.quarter,
            target,
            current: revenue,
            lastYear,
            percentAchieved,
            compareLastYear,
          };
        });
        setData(processed);
      })
      .catch(err => console.error('Error loading API:', err));
  };

  useEffect(() => {
    loadData();
  }, [selectedBU, selectedZone, selectedChannel]);

  const formatCurrency = v => {
    const num = parseInt(Number(v).toFixed(0), 10);
    return num.toLocaleString('en-US') + ' ฿';
  };

  const formatCurrencies = (v) => {
    const num = Math.round(Number(v));

    if (num >= 1_000_000) {
      return '฿' + (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1_000) {
      return '฿' + (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
      return '฿' + num.toLocaleString('en-US');
    }
  };



  const formatPercent = v => `${v.toFixed(1)}%`;

  const CustomLabel = ({ x, y, value }) => (
    <text x={x} y={y - 5} fill={value >= 100 ? 'green' : 'red'} fontSize={6} textAnchor="middle">
      {value >= 100 ? '🔺' : '🔻'} {value.toFixed(1)}%
    </text>
  );
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          fontSize: '12px',
          borderRadius: '5px',
          boxShadow: '0 0 4px rgba(0,0,0,0.2)'
        }}>
          <p><strong>Quarter:</strong> {label}</p>
          <p>🎯 ເປົ້າໝາຍ: {formatCurrency(data.target)}</p>
          <p>📆 ຍອດຂາຍ: {formatCurrency(data.current)}</p>
          <p>📅 ປີຜ່ານມາ: {formatCurrency(data.lastYear)}</p>
          <p style={{ color: data.percentAchieved >= 100 ? 'green' : 'red' }}>
            {data.percentAchieved >= 100 ? '▲' : '🔻'} % ບັນລຸ: {data.percentAchieved.toFixed(1)}%
          </p>
          <p style={{ color: data.compareLastYear >= 100 ? 'green' : 'red' }}>
            {data.compareLastYear >= 100 ? '▲' : '🔻'} % ປຽບທຽບປີຜ່ານມາ: {data.compareLastYear.toFixed(1)}%
          </p>
        </div>
      );
    }

    return null;
  };


  return (
    <div className="card p-3 mb-2 rounded-1 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h5 className="text-danger fw-bold mb-2" style={{ fontSize: '15px' }}>📊 ສະຫຼຸບຍອດຂາຍລາຍໄຕມາດ</h5>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <label className="fw-bold" style={{ fontSize: '14px' }}>🔍 BU:</label>
          <select className="form-select form-select-sm" style={{ width: '130px' }} value={selectedBU} onChange={e => setSelectedBU(e.target.value)}>
            {buList.map(bu => <option key={bu.code} value={bu.code}>{bu.name_1}</option>)}
          </select>

          <label className="fw-bold" style={{ fontSize: '14px' }}>📢 ຊອ່ງທາງ:</label>
          <select className="form-select form-select-sm" style={{ width: '130px' }} value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
            {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
          </select>

          <label className="fw-bold" style={{ fontSize: '14px' }}>🌍 ຂອບເຂດ:</label>
          <select className="form-select form-select-sm" style={{ width: '130px' }} value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
            {[{ code: 'all', name_1: 'ທຸກ ZONE' }, { code: '11', name_1: 'ZONE A' }, { code: '12', name_1: 'ZONE B' }, { code: '13', name_1: 'ZONE C' },
            { code: '14', name_1: 'ZONE D' }, { code: '15', name_1: 'ZONE E' }, { code: '16', name_1: 'ZONE F' }]
              .map(z => <option key={z.code} value={z.code}>{z.name_1}</option>)}
          </select>

          <div className="btn-group ms-2" role="group">
            <button className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
            <button className={`btn btn-sm ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('chart')}>Chart</button>
            <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
          </div>
        </div>
      </div>

      {/* BarChart และ Table เหมือนเดิม */}
      {(viewMode === 'all' || viewMode === 'chart') && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" fontSize={10} />
            <YAxis tickFormatter={v => v.toLocaleString('en-US')} fontSize={10} />
            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={{ fontSize: '12px' }} payload={[
              { value: '🎯 ເປົ້າໝາຍ', type: 'square', color: '#FFD580' },
              { value: '📆 ຍອດຂາຍ', type: 'square', color: '#06ab9b' },
              { value: '📅 ປີຜ່ານມາ', type: 'square', color: '#EF5350' },
            ]} />
            <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#FFD580">
              <LabelList dataKey="target" position="top" formatter={formatCurrencies} style={{ fontSize: 7 }} />
            </Bar>
            <Bar dataKey="current" name="📆 ຍອດຂາຍ" fill="#06ab9b">
              <LabelList
                dataKey="current"
                position="insideTop"
                formatter={formatCurrencies}
                style={{ fontSize: 7 }}
                fill="#000"
              />

              <LabelList dataKey="percentAchieved" content={CustomLabel} />
              <LabelList dataKey="compareLastYear" fill="#000" position="centerTop" formatter={v => `${v.toFixed(1)}%`} style={{ fontSize: 7 }} />
            </Bar>
            <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ" fill="#EF5350" >
              <LabelList dataKey="lastYear" position="top" formatter={formatCurrencies} style={{ fontSize: 7 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {(viewMode === 'all' || viewMode === 'table') && (
        <div className="table-responsive mt-3">
          {/* Table Content */}
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ໃຕມາດ</th>
                <th className='text-center'>🎯 ເປົ້າໝາຍ</th>
                <th className='text-center'>📆 ຍອດຂາຍ</th>
                <th className='text-center'>% ປຽບທຽບເປົ້າ</th>
                <th className='text-center'>📅 ປີຜ່ານມາ</th>
                <th className='text-center'>📊 % ປຽບທຽບປີຜ່ານມາ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.quarter}</td>
                  <td className='text-end'>{formatCurrency(row.target)}</td>
                  <td className='text-end'>{formatCurrency(row.current)}</td>
                  <td className='text-center'>
                    {row.percentAchieved > 0 ? (
                      <span className={`fw-bold ${row.percentAchieved >= 100 ? 'text-success' : 'text-danger'}`}>
                        {row.percentAchieved >= 100 ? '▲' : '🔻'} {formatPercent(row.percentAchieved)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className='text-end'>{formatCurrency(row.lastYear)}</td>
                  <td className='text-center'>
                    {row.compareLastYear > 0 ? (
                      <span className={`fw-bold ${row.compareLastYear >= 100 ? 'text-success' : 'text-danger'}`}>
                        {row.compareLastYear >= 100 ? '▲' : '🔻'} {formatPercent(row.compareLastYear)}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
