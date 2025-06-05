import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';

const formatCurrency = (value) => parseFloat(value).toLocaleString() + '  ฿';

export default function ProvinceSalesBuChannel({bu, department}) {
  const [period, setPeriod] = useState('thisMonth');
  const [dataByPeriod, setDataByPeriod] = useState({
    thisMonth: [],
    lastMonth: [],
    fullYear: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();
    if (bu) query.append('bu', bu);
    if (department) query.append('department', department);


    api.get(`/channel/province?${query.toString()}`)
      .then((res) => {
        const mapData = (items) =>
          items.map(item => ({
            province: item.province_name || 'ບໍ່ລະບຸ',
            sales: parseFloat(item.this_year || 0),
            lastYear: parseFloat(item.last_year || 0)
          }));

        setDataByPeriod({
          thisMonth: mapData(res.data.thisMonth),
          lastMonth: mapData(res.data.lastMonth),
          fullYear: mapData(res.data.fullyear)
        });
      })
      .catch((error) => {
        console.error('❌ Error fetching province sales data:', error);
      })
      .finally(() => setLoading(false));
  }, [bu, department]);

  const handleExport = () => {
    const exportData = dataByPeriod[period].map(({ province, sales, lastYear }) => ({
      Province: province,
      'Sales (B)': sales,
      'Last Year (B)': lastYear
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Sales_${period}`);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `ProvinceSales_${period}.xlsx`);
  };

  if (loading) return <div className="text-center py-5">⏳ Loading...</div>;

  return (
    <div className="card shadow-sm border-0 p-2 bg-white rounded-1 mb-2">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="fw-bold text-danger mb-0"style={{fontSize:'12px'}}>
          📊 ຍອດຂາຍຕາມແຂວງ ({period === 'thisMonth' ? 'ເດືອນນີ້' : period === 'lastMonth' ? 'ເດືອນກ່ອນ' : 'ທັງປີ'})
        </h5>

        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="thisMonth">ເດືອນນີ້</option>
            <option value="lastMonth">ເດືອນກ່ອນ</option>
            <option value="fullYear">ທັງປີ</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={dataByPeriod[period]} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="province" angle={-15} textAnchor="end" height={90} fontSize={10}/>
          <YAxis tickFormatter={(v) => v.toLocaleString()} fontSize={10}/>
          <Tooltip formatter={(v) => formatCurrency(v)} fontSize={10}/>
          <Legend />
          <Bar dataKey="sales" fill="#28a745" name="💰 Sales" fontSize={10}/>
          <Bar dataKey="lastYear" fill="#ffc107" name="📆 Last Year" fontSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
