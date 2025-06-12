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


export default function MonthlySalesChartbybu({bu}) {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState('chart');
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;

    api.get(`/bu/monthly/${bu}`)
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
  }, [bu]);

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
    <div className="bg-white rounded-lg shadow p-4 my-2">
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-black font-bold font-[Noto_Sans_Lao]">📊 ລາຍງານຍອດຂາຍລາຍເດືອນ</h5>
        <div className="flex gap-2">
          <button 
            onClick={handleExportPDF} 
            className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            📄 Export PDF
          </button>
          <button 
            onClick={handleExportExcel} 
            className="px-3 py-1 text-sm border border-green-500 text-green-500 rounded hover:bg-green-50"
          >
            📊 Export Excel
          </button>
          <select
            className="text-black text-sm border rounded bg-white"
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
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 mt-3">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th className="border border-gray-200 p-2 text-center">ເດືອນ</th>
                  <th className="border border-gray-200 p-2 text-center">🎯 ເປົ້າຂາຍ</th>
                  <th className="border border-gray-200 p-2 text-center">📆 ປີນີ້</th>
                  <th className="border border-gray-200 p-2 text-center">📅 ປີຜ່ານມາ</th>
                  <th className="border border-gray-200 p-2 text-center">% ບັນລຸເປົ້າໝາຍ</th>
                </tr>
              </thead>
              <tbody className='text-black'>
                {processedData.map((row, index) => (
                  <tr key={index} className={row.isCurrentMonth ? 'bg-yellow-100' : ''}>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {row.month}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.target)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.current)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center ${row.isCurrentMonth ? 'font-bold' : ''}`}>
                      {formatCurrency(row.lastYear)}
                    </td>
                    <td className={`border border-gray-200 p-2 text-center font-bold ${
                      row.percentAchieved >= 80 
                        ? 'text-green-600' 
                        : row.percentAchieved >= 50 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    } ${row.isCurrentMonth ? 'bg-yellow-100' : ''}`}>
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
