import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function DashboardCostSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cost/countcost')
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!summary) return <div className="text-center mt-5 text-danger">No data available.</div>;

  const { total, bygroupmain } = summary;
  const totalItems = Number(total[0].total_items);
  const zeroCostItems = Number(total[0].zero_cost_items);
  const percentZero = ((zeroCostItems / totalItems) * 100).toFixed(1);

  return (
    <div className="container mx-auto mt-4 font-['Noto_Sans_Lao']">
      <h4 className="mb-4 text-red-600 font-bold">📊 ສະຖິຕິສິນຄ້າທີ່ຂາຍໃນປິ 2025 ບໍ່ມີຕົ້ນທຶນ</h4>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border border-blue-500 rounded-lg shadow-sm">
          <div className="p-4 text-center">
            <h6 className="font-bold text-blue-500">ລວມຈຳນວນສິນຄ້າ</h6>
            <h3 className="text-xl">{totalItems.toLocaleString()}</h3>
          </div>
        </div>
        <div className="border border-red-500 rounded-lg shadow-sm">
          <div className="p-4 text-center">
            <h6 className="font-bold text-red-500">ສິນຄ້າທີ່ຕົ້ນທຶນ = 0</h6>
            <h3 className="text-xl">{zeroCostItems.toLocaleString()}</h3>
          </div>
        </div>
        <div className="border border-yellow-500 rounded-lg shadow-sm">
          <div className="p-4 text-center">
            <h6 className="font-bold text-yellow-500">% ບໍ່ມີຕົ້ນທຶນ</h6>
            <h3 className="text-xl">{percentZero}%</h3>
          </div>
        </div>
      </div>

      {/* Group Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-[#2D70F4] text-white">🧾 ກຸ່ມຫຼັກ</th>
              <th className="px-4 py-2 bg-[#2D70F4] text-white text-center">ລວມສິນຄ້າ</th>
              <th className="px-4 py-2 bg-[#2D70F4] text-white text-center">ສິນຄ້າຕົ້ນທຶນ = 0</th>
              <th className="px-4 py-2 bg-[#2D70F4] text-white text-center">%</th>
            </tr>
          </thead>
          <tbody>
            {bygroupmain.map((g, i) => {
              const total = Number(g.total_items);
              const zero = Number(g.zero_cost_items);
              const percent = ((zero / total) * 100).toFixed(1);

              return (
                <tr key={i} className="even:bg-gray-50">
                  <td className="px-4 py-2 border">{g.itemmaingroup}</td>
                  <td className="px-4 py-2 border text-right">{total.toLocaleString()}</td>
                  <td className="px-4 py-2 border text-right">{zero.toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className={`h-5 rounded-full text-white text-sm flex items-center justify-center ${
                          percent > 50 ? 'bg-red-600' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      >
                        {percent}%
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
