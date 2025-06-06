import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
import { color } from 'chart.js/helpers';

export default function MonthlySalesChart() {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState('chart');
  const [processedData, setProcessedData] = useState([]);
  const [buList, setBuList] = useState([]);
  const [selectedBu, setSelectedBu] = useState('all');

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        setBuList([{ code: 'all', name_1: 'ທຸກ BU' }, ...res.data]);
      })
      .catch(err => console.error('❌ Error fetching BU list:', err));
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const url = `/all/monthly${selectedBu !== 'all' ? `?bu=${selectedBu}` : ''}`;
    api.get(url)
      .then(res => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = res.data.map(item => {
          const month = monthNames[item.month - 1];
          const target = parseFloat(item.target || 0);
          const current = parseFloat(item.revenue || 0);
          const lastYear = parseFloat(item.last_year || 0);
          const percentAchieved = target > 0 ? Math.round((current / target) * 100) : 0;
          const compareLastYear = lastYear > 0 ? Math.round((current / lastYear) * 100) : 0;
          return {
            month,
            target,
            current,
            lastYear,
            percentAchieved,
            compareLastYear,
            isCurrentMonth: item.month === currentMonth,
          };
        });
        setProcessedData(data);
      })
      .catch(err => console.error('❌ Error fetching monthly data:', err));
  }, [selectedBu]);

  const formatCurrency = v => {
    const num = Math.round(Number(v));
    return num.toLocaleString('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + ' ฿';
  };



  const handleExportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, imgHeight);
    pdf.save('monthly-sales-report.pdf');
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Sales');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'monthly-sales-report.xlsx');
  };
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


  const CustomLabel = ({ x, y, value }) => {
    const icon = value >= 100 ? '▲' : '🔻';
    const color = value >= 100 ? 'green' : 'red';
    return (
      <text x={x} y={y - 5} fontSize={10} textAnchor="middle">
        <tspan fill={color}>{icon}</tspan> {value}%
      </text>
    );
  };

  return (
    <div className="card p-2 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-danger fw-bold mb-0" style={{ fontSize: '15px' }}>
          📊 ລາຍງານຍອດຂາຍລາຍເດືອນ
        </h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm w-auto"
            value={selectedBu}
            onChange={e => setSelectedBu(e.target.value)}
          >
            {buList.map(bu => (
              <option key={bu.code} value={bu.code}>{bu.name_1}</option>
            ))}
          </select>
          <select
            className="form-select form-select-sm w-auto"
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
          >
            <option value="chart">📈 Chart</option>
            <option value="table">📋 Table</option>
          </select>
        </div>
      </div>

      <div ref={chartRef}>
        {viewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={9} />
              <YAxis tickFormatter={v => Number(v).toLocaleString()} fontSize={9} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#FFD580" isAnimationActive animationDuration={1500} animationBegin={0} />
              <Bar dataKey="current" name="📆 ຍອດຂາຍ" fill="#06ab9b" isAnimationActive animationDuration={1500} animationBegin={300}>
                <LabelList dataKey="percentAchieved" content={CustomLabel} />
                <LabelList fill="#000" dataKey="compareLastYear" position="insideTop" formatter={v => `${v}%`} fontSize={8} />
              </Bar>
              <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ" fill="#EF5350" isAnimationActive animationDuration={1500} animationBegin={600} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>ເດືອນ</th>
                  <th>🎯 ເປົ້າໝາຍ</th>
                  <th>📆 ຍອດຂາຍ</th>
                  <th>% ປຽບທຽບເປົ້າ</th>
                  <th>📅 ປີຜ່ານມາ</th>
                  <th>📊 % ປຽບທຽບປີຜ່ານມາ</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((row, i) => {
                  const percent = row.percentAchieved;
                  const compare = row.compareLastYear;

                  return (
                    <tr key={i}>
                      <td>{row.month}</td>
                      <td>{formatCurrency(row.target)}</td>
                      <td>{formatCurrency(row.current)}</td>
                      <td>
                        {percent > 0 ? (
                          <>
                            <span style={{ color: percent >= 100 ? 'green' : 'red' }}>
                              {percent >= 100 ? '▲' : '🔻'}
                            </span> {percent}%
                          </>
                        ) : '-'}
                      </td>
                      <td>{formatCurrency(row.lastYear)}</td>
                      <td>
                        {compare > 0 ? (
                          <>
                            <span style={{ color: compare >= 100 ? 'green' : 'red' }}>
                              {compare >= 100 ? '▲' : '🔻'}
                            </span> {compare}%
                          </>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
