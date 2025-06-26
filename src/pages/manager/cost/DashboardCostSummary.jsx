import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Keep if other components still rely on it, otherwise remove.
import api from '../../../services/api';

export default function DashboardCostSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state for better handling

  useEffect(() => {
    api.get('/cost/countcost')
      .then((res) => {
        // Ensure data is structured correctly before setting state
        // Assuming total is an array with at least one element
        if (res.data && res.data.total && res.data.total.length > 0) {
          setSummary(res.data);
          setError(null); // Clear any previous errors
        } else {
          setError("No valid data received from the API.");
        }
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setError("Failed to load data. Please try again later."); // User-friendly error message
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate percentages and format numbers only if summary data is available
  const totalItems = summary ? Number(summary.total[0]?.total_items) : 0;
  const zeroCostItems = summary ? Number(summary.total[0]?.zero_cost_items) : 0;
  const percentZero = totalItems > 0 ? ((zeroCostItems / totalItems) * 100).toFixed(1) : '0.0';

  return (
    <div className="container mx-auto font-['Noto_Sans_Lao'] bg-gray-50 mt-10 ">
      <h2 className="text-3xl font-extrabold text-red-700 text-center">
        📊 ສະຖິຕິສິນຄ້າທີ່ຂາຍໃນປີ 2024-2025 ບໍ່ມີຕົ້ນທຶນ
      </h2>
      <hr className=" border-t-2 border-red-200" />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500" role="status">
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
      {!loading && !error && summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {[
              { label: 'ລວມຈຳນວນສິນຄ້າ', value: totalItems.toLocaleString(), bgColor: 'bg-white', borderColor: 'border-blue-200', textColor: 'text-blue-600', icon: '📦' },
              { label: 'ສິນຄ້າທີ່ຕົ້ນທຶນ = 0', value: zeroCostItems.toLocaleString(), bgColor: 'bg-white', borderColor: 'border-red-200', textColor: 'text-red-600', icon: '🚫' },
              { label: '% ບໍ່ມີຕົ້ນທຶນ', value: `${percentZero}%`, bgColor: 'bg-white', borderColor: 'border-orange-200', textColor: 'text-orange-600', icon: '⚠️' },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`border-2 ${card.borderColor} ${card.bgColor} rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out`}
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h6 className="text-sm font-medium text-gray-500 mb-2">{card.label}</h6>
                <h5 className={`text-2xl font-extrabold ${card.textColor}`}>
                  {card.value}
                </h5>
              </div>
            ))}
          </div>

          {/* Group Table */}
          <div className="bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-red-700 text-center p-6 border-b-2 border-red-200">
              📋 ຕາຕະລາງສິນຄ້າທີ່ບໍ່ມີຕົ້ນທຶນຕາມກຸ່ມຫຼັກ
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="bg-red-600 text-white shadow-md">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider rounded-l-lg">
                      🧾 ກຸ່ມຫຼັກ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      ລວມສິນຄ້າ
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      ສິນຄ້າຕົ້ນທຶນ = 0
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-r-lg">
                      ຕົວຊີ້ວັດ (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {summary.bygroupmain && summary.bygroupmain.length > 0 ? (
                    summary.bygroupmain.map((g, i) => {
                      const total = Number(g.total_items);
                      const zero = Number(g.zero_cost_items);
                      const percent = total > 0 ? ((zero / total) * 100).toFixed(1) : '0.0';

                      let progressColor = 'bg-red-500'; // Default for higher percentages of zero cost
                      if (parseFloat(percent) <= 10) progressColor = 'bg-green-500'; // Good: low zero cost
                      else if (parseFloat(percent) <= 30) progressColor = 'bg-yellow-500'; // Medium: moderate zero cost

                      return (
                        <tr key={i} className="bg-white border-b border-gray-100 hover:bg-red-50 transition duration-150 ease-in-out shadow-sm rounded-lg">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-l-lg">
                            {g.itemmaingroup}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <span className="font-semibold text-blue-700">{total.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                            <span className="font-semibold text-red-700">{zero.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap rounded-r-lg">
                            <div className="flex items-center space-x-2">
                              <div className="flex-grow bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                  className={`${progressColor} h-6 rounded-full transition-all duration-500 ease-out`}
                                  style={{ width: `${Math.min(100, parseFloat(percent))}%` }}
                                >
                                  {/* No text inside the bar */}
                                </div>
                              </div>
                              <span className="text-sm font-bold text-gray-800 w-16 text-right">
                                {percent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-2 py-2 text-center text-gray-500 bg-white rounded-lg">
                        ບໍ່ມີຂໍ້ມູນກຸ່ມຫຼັກໃຫ້ສະແດງ.
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