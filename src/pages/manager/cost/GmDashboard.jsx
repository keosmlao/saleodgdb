import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function GmDashboard() {
  const [data, setData] = useState({
    total: { sale: 0, cost: 0, gm: 0, allsale: 0, sale_no_cost: 0 },
    bygroupmain: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cost/summarygm')
      .then(res => {
        const raw = res.data;
        const formatted = {
          total: {
            sale: Number(raw?.total?.[0]?.total_sale_with_cost || 0),
            cost: Number(raw?.total?.[0]?.total_cost || 0),
            gm: Number(raw?.total?.[0]?.total_gm_with_cost || 0),
            allsale: Number(raw?.total?.[0]?.total_sale_all || 0),
            sale_no_cost: Number(raw?.total?.[0]?.sale_no_cost || 0)
          },
          bygroupmain: (raw.bygroup || []).map(item => ({
            ...item,
            total_sale_all: Number(item.total_sale_all || 0),
            total_sale_with_cost: Number(item.total_sale_with_cost || 0),
            total_cost: Number(item.total_cost || 0),
            total_gm_with_cost: Number(item.total_gm_with_cost || 0),
            sale_no_cost: Number(item.sale_no_cost || 0),
          }))
        };
        setData(formatted);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const gmPercent = data.total.sale > 0
    ? ((data.total.gm / data.total.sale) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="container mx-auto mt-4 font-['Noto_Sans_Lao']">
      <h4 className="text-blue-600 font-bold mb-4">📊 ສະຫຼຸບລາຍການຂາຍລວມ</h4>

      {loading ? (
        <div className="flex justify-center my-5">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="bg-gray-900 text-white rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm ">ຍອດຂາຍທັງໝົດ</h6>
                <h5 className="font-bold text-yellow-400">{data.total.allsale.toLocaleString()} B</h5>
              </div>
            </div>
            <div className="border border-blue-400 rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm">ຍອດຂາຍທີ່ບໍ່ມີຕົ້ນທຶນ</h6>
                <h5 className="font-bold text-blue-400">{data.total.sale_no_cost.toLocaleString()} B</h5>
              </div>
            </div>
            <div className="border border-gray-500 rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm">% ກຳໄລຂັ້ນຕົ້ນ-ສະເພາະສິນຄ້າມີຕົ້ນທຶນ (GM%)</h6>
                <h5 className="font-bold text-gray-500">{gmPercent} %</h5>
              </div>
            </div>
            <div className="border border-blue-600 rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm">ຍອດຂາຍທີ່ມີຕົ້ນທຶນ</h6>
                <h5 className="font-bold text-blue-600">{data.total.sale.toLocaleString()} B</h5>
              </div>
            </div>
            <div className="border border-red-600 rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm">ຕົ້ນທຶນ(ສະເພາະສິນຄ້າມີຕົ້ນທຶນ)</h6>
                <h5 className="font-bold text-red-600">{data.total.cost.toLocaleString()} B</h5>
              </div>
            </div>
            <div className="border border-green-600 rounded-lg shadow-sm h-full">
              <div className="p-4 text-center">
                <h6 className="text-sm">ກຳໄລຂັ້ນຕົ້ນ (GM)</h6>
                <h5 className="font-bold text-green-600">{data.total.gm.toLocaleString()} B</h5>
              </div>
            </div>
          </div>

          {/* GM Table by Product Group */}
          <div className="mt-8">
            <h5 className="text-center font-bold text-blue-600 mb-4">📋 ຕາຕະລາງກຳໄລຕາມກຸ່ມສິນຄ້າ(ສະເພາະທີ່ມີຕົ້ນທຶນ)</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 border">ກຸ່ມສິນຄ້າ</th>
                    <th className="px-4 py-2 border">ຍອດຂາຍທັງໝົດ</th>
                    <th className="px-4 py-2 border">ຕົ້ນທຶນ</th>
                    <th className="px-4 py-2 border">ກຳໄລ (GM)</th>
                    <th className="px-4 py-2 border">% GM</th>
                    <th className="px-4 py-2 border">Indicator</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bygroupmain.map((item, idx) => {
                    const sale = item.total_sale_with_cost;
                    const gm = item.total_gm_with_cost;
                    const gmPercent = sale > 0 ? ((gm / sale) * 100).toFixed(2) : 0;

                    let progressColor = "bg-green-600";
                    if (gmPercent < 10) progressColor = "bg-red-600";
                    else if (gmPercent < 25) progressColor = "bg-yellow-500";

                    return (
                      <tr key={idx} className="even:bg-gray-50">
                        <td className="px-4 py-2 border text-left">{item.itemmaingroup}</td>
                        <td className="px-4 py-2 border text-center">{item.total_sale_with_cost.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-center">{item.total_cost.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-center">{gm.toLocaleString()}</td>
                        <td className="px-4 py-2 border text-center">{gmPercent} %</td>
                        <td className="px-4 py-2 border">
                          <div className="w-full bg-gray-200 rounded-full h-5">
                            <div
                              className={`${progressColor} h-5 rounded-full text-white text-sm flex items-center justify-center`}
                              style={{ width: `${gmPercent}%` }}
                            >
                              {gmPercent}%
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
        </>
      )}
    </div>
  );
}
