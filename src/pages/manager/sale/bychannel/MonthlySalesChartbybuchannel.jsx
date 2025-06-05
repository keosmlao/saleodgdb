import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LabelList, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api'


export default function MonthlySalesChartbybuchannel({bu,department}) {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState('chart');
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);

    api.get(`/channel/monthly?${query.toString()}`)
      .then((res) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const data = res.data.map((item) => {
          const month = monthNames[item.month - 1];
          const target = Number(item.target || 0);
          const current = Number(item.revenue || 0);
          const lastYear = Number(item.last_year || 0);
          const percentAchieved = target > 0 ? Math.round((current / target) * 100) : 0;

          let barColor = '#dc3545';
          if (percentAchieved >= 80) barColor = '#28a745';
          else if (percentAchieved >= 50) barColor = '#fd7e14';

          return {
            month,
            target,
            current,
            lastYear,
            percentAchieved,
            barColor,
            isCurrentMonth: item.month === currentMonth,
          };
        });

        setProcessedData(data);
      })
      .catch((err) => console.error('❌ API error:', err));
  }, [bu,department]);

  const formatCurrency = (val) => Number(val).toLocaleString('en-US') + ' ฿';

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

  return (
    <div className="card p-2 mt-2 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-danger fw-bold mb-0">📊 ລາຍງານຍອດຂາຍລາຍເດືອນ</h5>
        <div className="d-flex gap-2">
          <button onClick={handleExportPDF} className="btn btn-sm btn-outline-danger">📄 Export PDF</button>
          <button onClick={handleExportExcel} className="btn btn-sm btn-outline-success">📊 Export Excel</button>
          <select
            className="form-select form-select-sm w-auto"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="chart">📈 Chart</option>
            <option value="table">📋 Table</option>
          </select>
        </div>
      </div>

      <div ref={chartRef}>
        {viewMode === 'chart' ? (
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />

              <Bar dataKey="target" name="🎯 Target">
                {processedData.map((entry, index) => (
                  <Cell
                    key={`target-${index}`}
                    fill="#ffc107"
                    stroke={entry.isCurrentMonth ? '#40E0D0' : 'none'}
                    strokeWidth={entry.isCurrentMonth ? 2 : 0}
                  />
                ))}
              </Bar>

              <Bar dataKey="current" name="📆 This Year">
                {processedData.map((entry, index) => (
                  <Cell
                    key={`current-${index}`}
                    fill={entry.barColor}
                    stroke={entry.isCurrentMonth ? '#40E0D0' : 'none'}
                    strokeWidth={entry.isCurrentMonth ? 2 : 0}
                  />
                ))}
                <LabelList
                  dataKey="percentAchieved"
                  position="top"
                  formatter={(v) => `${v}%`}
                  style={{ fontSize: 12, fill: '#000', fontWeight: 'bold' }}
                />
              </Bar>

              <Bar dataKey="lastYear" name="📅 Last Year">
                {processedData.map((entry, index) => (
                  <Cell
                    key={`last-${index}`}
                    fill="#dc3545"
                    stroke={entry.isCurrentMonth ? '#40E0D0' : 'none'}
                    strokeWidth={entry.isCurrentMonth ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center align-middle mt-3">
              <thead className="table-light">
                <tr>
                  <th>ເດືອນ</th>
                  <th>🎯 ເປົ້າຂາຍ</th>
                  <th>📆 ປີນີ້</th>
                  <th>📅 ປີຜ່ານມາ</th>
                  <th>% ບັນລຸເປົ້າໝາຍ</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((row, index) => (
                  <tr key={index}>
                    <td className={row.isCurrentMonth ? 'bg-warning fw-bold' : ''}>{row.month}</td>
                    <td className={row.isCurrentMonth ? 'bg-warning fw-bold' : ''}>{formatCurrency(row.target)}</td>
                    <td className={row.isCurrentMonth ? 'bg-warning fw-bold' : ''}>{formatCurrency(row.current)}</td>
                    <td className={row.isCurrentMonth ? 'bg-warning fw-bold' : ''}>{formatCurrency(row.lastYear)}</td>
                    <td
                      className={[
                        row.percentAchieved >= 80
                          ? 'text-success fw-bold'
                          : row.percentAchieved >= 50
                          ? 'text-warning fw-bold'
                          : 'text-danger fw-bold',
                        row.isCurrentMonth ? 'bg-warning' : '',
                      ].join(' ')}
                    >
                      {row.percentAchieved}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
