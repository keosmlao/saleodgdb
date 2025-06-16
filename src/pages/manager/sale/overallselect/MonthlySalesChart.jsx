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

export default function MonthlySalesChart() {
  const chartRef = useRef();
  const [viewMode, setViewMode] = useState('chart');
  const [processedData, setProcessedData] = useState([]);
  const [buList, setBuList] = useState([]);
  const [selectedBu, setSelectedBu] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  console.log("select zone monthly", selectedZone);
  console.log("data", processedData);


  const channelList = [
    { name: 'all', display: '🌐 ຊອ່ງທາງທັງໝົດ' },
    { name: 'ຂາຍສົ່ງ', display: 'ຂາຍສົ່ງ' },
    { name: 'ຂາຍໜ້າຮ້ານ', display: 'ຂາຍໜ້າຮ້ານ' },
    { name: 'ຂາຍໂຄງການ', display: 'ຂາຍໂຄງການ' },
    { name: 'ຂາຍຊ່າງ', display: 'ຂາຍຊ່າງ' },
    { name: 'ບໍລິການ', display: 'ບໍລິການ' },
    { name: 'ອື່ນໆ', display: 'ອື່ນໆ' },
  ];

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...res.data]);
      })
      .catch(err => console.error('❌ Error fetching BU list:', err));
  }, []);

  useEffect(() => {
    api.get('/all/bu-list')
      .then(res => {
        setBuList([{ code: 'all', name_1: '📦 ທຸກ BU' }, ...res.data]);
      })
      .catch(err => console.error('❌ Error fetching BU list:', err));
  }, []);

  const loadData = () => {
    const params = new URLSearchParams();
    if (selectedBu !== 'all') params.append('bu', selectedBu);
    if (selectedZone !== 'all') params.append('area', selectedZone); // 🔥 Update เป็น 'area'
    if (selectedChannel !== 'all') params.append('channel', selectedChannel); // 🔥 เพิ่ม 'channel'
    api.get(`/all/monthly?${params.toString()}`) // 🔥 เรียก API /quarterly
      .then(res => {
        const processed = Array.isArray(res.data)
          ? res.data.map(item => {
            const target = Number(item.target || 0);
            const revenue = Number(item.revenue || 0);
            const lastYear = Number(item.last_year || 0);
            const percentAchieved = target > 0 ? Number(((revenue / target) * 100).toFixed(1)) : 0;
            const compareLastYear = lastYear > 0 ? Number(((revenue / lastYear) * 100).toFixed(1)) : 0;
            return {
              quarter: item.quarter,
              target,
              current: revenue,
              lastYear,
              percentAchieved,
              compareLastYear,
            };
          })
          : [];

        setProcessedData(processed);
      })
      .catch(err => console.error('Error loading API:', err));
  };

  useEffect(() => {
    if (selectedBu && selectedZone && selectedChannel) {
      loadData();
    }
  }, [selectedBu, selectedZone, selectedChannel]);

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
          <p><strong>Month:</strong> {label}</p>
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
      <text x={x} y={y - 10} fontSize={8} textAnchor="middle">
        <tspan fill={color}>{icon}</tspan> {value}%
      </text>
    );
  };
  const CustomCompair = ({ x, y, value }) => {
    const icon = value >= 100 ? '▲' : '🔻';
    const color = value >= 100 ? 'green' : 'red';
    return (
      <text x={x} y={y - 0} fontSize={8} textAnchor="middle">
        <tspan fill={color}>{icon}</tspan> {value}%
      </text>
    );
  }
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

  return (
      <div className="bg-white p-3 mb-2 rounded-md shadow-sm font-[Noto_Sans_Lao]" style={{height:"600px"}}>
        <div className="flex justify-between items-center mb-3 flex-wrap">
          <h5 className="text-red-600 font-bold mb-0 text-[15px] font-[Noto_Sans_Lao]"> 📊 ລາຍງານຍອດຂາຍລາຍເດືອນ</h5>
          <div className="flex items-center gap-2 flex-wrap text-[12px] font-[Noto_Sans_Lao]">
            <label className="font-bold ">🔍 BU:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedBu} onChange={e => setSelectedBu(e.target.value)}>
              {buList.map(bu => <option key={bu.code} value={bu.code}>{bu.name_1}</option>)}
            </select>

            <label className="font-bold ">📢 ຊອ່ງທາງ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedChannel} onChange={e => setSelectedChannel(e.target.value)}>
              {channelList.map(ch => <option key={ch.name} value={ch.name}>{ch.display}</option>)}
            </select>

            <label className="font-bold ">🌍 ຂອບເຂດ:</label>
            <select className="text-sm border rounded px-2 py-1 w-[130px]" value={selectedZone} onChange={e => setSelectedZone(e.target.value)}>
              {[
                { code: 'all', name_1: 'ທຸກ ZONE' },
                { code: '11', name_1: 'ZONE A' },
                { code: '12', name_1: 'ZONE B' },
                { code: '13', name_1: 'ZONE C' },
                { code: '14', name_1: 'ZONE D' },
                { code: '15', name_1: 'ZONE E' },
                { code: '16', name_1: 'ZONE F' },
              ].map(z => (
                  <option key={z.code} value={z.code}>{z.name_1}</option>
              ))}
            </select>

            <div className="ml-2 inline-flex rounded overflow-hidden border text-sm">
              <button className={`px-3 py-1 ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('all')}>ທັງໝົດ</button>
              <button className={`px-3 py-1 ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-r'}`} onClick={() => setViewMode('chart')}>Chart</button>
              <button className={`px-3 py-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`} onClick={() => setViewMode('table')}>ຕາຕະລາງ</button>
            </div>
          </div>
        </div>

        <div ref={chartRef}>
          {(viewMode === 'all' || viewMode === 'chart') && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={8} />
                <YAxis tickFormatter={v => Number(v).toLocaleString()} fontSize={9} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="target" name="🎯 ເປົ້າໝາຍ" fill="#FFD580" isAnimationActive animationDuration={1500} animationBegin={0}>
                  <LabelList dataKey="target" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
                <Bar dataKey="current" name="📆 ຍອດຂາຍ" fill="#06ab9b" isAnimationActive animationDuration={1500} animationBegin={300}>
                  <LabelList dataKey="percentAchieved" fontSize={8} content={CustomLabel} />
                  <LabelList fill="#000" dataKey="compareLastYear" position="insideTop" content={CustomCompair} fontSize={8} />
                </Bar>
                <Bar dataKey="lastYear" name="📅 ປີຜ່ານມາ" fill="#EF5350" isAnimationActive animationDuration={1500} animationBegin={600} >
                  <LabelList dataKey="lastYear" position="top" formatter={formatCurrencies} style={{ fontSize: 8 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {(viewMode === 'all' || viewMode === 'table') && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border text-center text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">ເດືອນ</th>
                    <th className="border px-2 py-1">🎯 ເປົ້າໝາຍ</th>
                    <th className="border px-2 py-1">📆 ຍອດຂາຍ</th>
                    <th className="border px-2 py-1">% ປຽບທຽບເປົ້າ</th>
                    <th className="border px-2 py-1">📅 ປີຜ່ານມາ</th>
                    <th className="border px-2 py-1">📊 % ປຽບທຽບປີຜ່ານມາ</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((row, i) => {
                    const percent = row.percentAchieved;
                    const compare = row.compareLastYear;
                    return (
                      <tr key={i}>
                        <td className="border px-2 py-1">{row.month}</td>
                        <td className="border px-2 py-1">{formatCurrency(row.target)}</td>
                        <td className="border px-2 py-1">{formatCurrency(row.current)}</td>
                        <td className="border px-2 py-1">
                          {percent > 0 ? (
                            <>
                              <span className={`font-bold ${percent >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                                {percent >= 100 ? '▲' : '🔻'}
                              </span> {percent}%
                            </>
                          ) : '-'}
                        </td>
                        <td className="border px-2 py-1">{formatCurrency(row.lastYear)}</td>
                        <td className="border px-2 py-1">
                          {compare > 0 ? (
                            <>
                              <span className={`font-bold ${compare >= 100 ? 'text-green-600' : 'text-red-600'}`}>
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
