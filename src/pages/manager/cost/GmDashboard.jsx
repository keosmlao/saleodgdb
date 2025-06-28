import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Keep if necessary, otherwise remove.
import api from '../../../services/api';

export default function GmDashboard() {
  const [data, setData] = useState({
    total: { sale: 0, cost: 0, gm: 0, allsale: 0, sale_no_cost: 0 },
    bygroupmain: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format currency
  const formatTHB = (amount) =>
    parseFloat(amount || 0).toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

  useEffect(() => {
    // Fetch data from the API
    api.get('/cost/summarygm')
      .then(res => {
        const raw = res.data;
        // Format and set the data
        const formatted = {
          total: {
            sale: parseFloat(raw?.total?.total_sale_with_cost) || 0,
            cost: parseFloat(raw?.total?.total_cost) || 0,
            gm: parseFloat(raw?.total?.total_gm_with_cost) || 0,
            allsale: parseFloat(raw?.total?.total_sale_all) || 0,
            sale_no_cost: parseFloat(raw?.total?.sale_no_cost) || 0
          },
          bygroupmain: (raw.bygroup || []).map(item => ({
            ...item,
            total_sale_all: parseFloat(item.total_sale_all) || 0,
            total_cost: parseFloat(item.total_cost) || 0,
            total_gm: parseFloat(item.total_gm) || 0
          }))
        };
        setData(formatted);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Calculate overall GM percentage (still needed for the card)
  const gmPercent = data.total.sale > 0
    ? ((data.total.gm / data.total.sale) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="container mx-auto mt-8 p-4 font-['Noto_Sans_Lao'] bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
        📊 ສະຫຼຸບລາຍການຂາຍລວມ (GM Dashboard 2025)
      </h2>
      <hr className="mb-8 border-t-2 border-blue-200" />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" role="status">
            <span className="sr-only">ກຳລັງໂຫຼດ...</span>
          </div>
          <p className="ml-4 text-gray-600 text-lg">ກຳລັງໂຫຼດຂໍ້ມູນ, ກະລຸນາລໍຖ້າ...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md mb-6" role="alert">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 112 0v4a1 1 0 11-2 0V6zm0 8a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
            </svg>
            <strong className="font-bold mr-2">ເກີດຂໍ້ຜິດພາດ!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Summary Cards (unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'ຍອດຂາຍທັງໝົດ', value: data.total.allsale, bgColor: 'bg-white', borderColor: 'border-blue-200', textColor: 'text-blue-600', icon: '💰' },
              { label: 'ຍອດຂາຍທີ່ບໍ່ມີຕົ້ນທຶນ', value: data.total.sale_no_cost, bgColor: 'bg-white', borderColor: 'border-yellow-200', textColor: 'text-yellow-600', icon: '🛍️' },
              { label: '% ກຳໄລຂັ້ນຕົ້ນ (GM%)', value: `${gmPercent} %`, bgColor: 'bg-white', borderColor: 'border-green-200', textColor: 'text-green-600', icon: '📈' },
              { label: 'ຍອດຂາຍທີ່ມີຕົ້ນທຶນ', value: data.total.sale, bgColor: 'bg-blue-600', borderColor: 'border-blue-600', textColor: 'text-white', icon: '💸' },
              { label: 'ຕົ້ນທຶນ (ສະເພາະສິນຄ້າມີຕົ້ນທຶນ)', value: data.total.cost, bgColor: 'bg-red-600', borderColor: 'border-red-600', textColor: 'text-white', icon: ' расходы' },
              { label: 'ກຳໄລຂັ້ນຕົ້ນ (GM)', value: data.total.gm, bgColor: 'bg-green-600', borderColor: 'border-green-600', textColor: 'text-white', icon: '💵' },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`border-2 ${card.borderColor} ${card.bgColor} rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out`}
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h6 className="text-sm font-medium text-gray-500 mb-2">{card.label}</h6>
                <h5 className={`text-2xl font-extrabold ${card.textColor}`}>
                  {typeof card.value === 'number' ? formatTHB(card.value) : card.value}
                </h5>
              </div>
            ))}
          </div>

          {/* GM Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-blue-700 mb-5 text-center">
              📋 ຕາຕະລາງກຳໄລຕາມກຸ່ມສິນຄ້າ
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="bg-blue-600 text-white shadow-md">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg">
                      ກຸ່ມສິນຄ້າ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      ຍອດຂາຍທັງໝົດ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      ຕົ້ນທຶນ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      ກຳໄລ (GM)
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-r-lg">
                      ຕົວຊີ້ວັດ (Indicator)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.bygroupmain.length > 0 ? (
                    data.bygroupmain.map(item => {
                      const gmPercentGroup = item.total_sale_all > 0
                        ? ((item.total_gm / item.total_sale_all) * 100).toFixed(2)
                        : '0.00';

                      let progressColor = 'bg-green-500';
                      if (parseFloat(gmPercentGroup) < 10) progressColor = 'bg-red-500';
                      else if (parseFloat(gmPercentGroup) < 25) progressColor = 'bg-yellow-500';

                      return (
                        <tr key={item.bu_code} className="bg-white border-b border-gray-100 hover:bg-blue-50 transition duration-150 ease-in-out shadow-sm rounded-lg">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-lg">
                            {item.bu_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <span className="font-semibold text-blue-700">{formatTHB(item.total_sale_all)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <span className="font-semibold text-red-700">{formatTHB(item.total_cost)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <span className="font-semibold text-green-700">{formatTHB(item.total_gm)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap rounded-r-lg">
                            {/* Flex container to align progress bar and text */}
                            <div className="flex items-center space-x-2">
                              {/* Progress bar */}
                              <div className="flex-grow bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                  className={`${progressColor} h-6 rounded-full transition-all duration-500 ease-out`}
                                  style={{ width: `${Math.min(100, parseFloat(gmPercentGroup))}%` }}
                                >
                                  {/* Removed text from inside the bar */}
                                </div>
                              </div>
                              {/* Percentage text outside the bar */}
                              <span className="text-sm font-bold text-gray-800 w-16 text-right"> {/* Adjusted width for alignment */}
                                {gmPercentGroup}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500 bg-white rounded-lg">
                        ບໍ່ມີຂໍ້ມູນກຸ່ມສິນຄ້າໃຫ້ສະແດງ.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}