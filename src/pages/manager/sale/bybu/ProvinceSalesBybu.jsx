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

export default function ProvinceSalesBybu({ bu }) {
  const [period, setPeriod] = useState('thisMonth');
  const [dataByPeriod, setDataByPeriod] = useState({
    thisMonth: [],
    lastMonth: [],
    fullYear: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/bu/province/${bu}`)
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
  }, [bu]);

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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-2 text-black">
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <h5 className="font-bold text-red-600 text-xs mb-0">
          📊 ຍອດຂາຍຕາມແຂວງ ({period === 'thisMonth' ? 'ເດືອນນີ້' : period === 'lastMonth' ? 'ເດືອນກ່ອນ' : 'ທັງປີ'})
        </h5>

        <div className="flex gap-2">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="thisMonth">ເດືອນນີ້</option>
            <option value="lastMonth">ເດືອນກ່ອນ</option>
            <option value="fullYear">ທັງປີ</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={800}>
        <BarChart data={dataByPeriod[period]} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={v => v.toLocaleString()} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="province" width={120} tick={{ fontSize: 10 }} />
          <Tooltip formatter={v => parseFloat(v).toLocaleString() + ' ฿'} wrapperStyle={{ fontSize: '10px' }} />
          <Legend />
          <Bar dataKey="sales" fill="#06ab9b" name="💰 ຍອດຂາຍ" barSize={20}>

          </Bar>
          <Bar dataKey="lastYear" fill="#dc3545" name="📆 ປີຜ່ານມາ" barSize={20}>

          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
