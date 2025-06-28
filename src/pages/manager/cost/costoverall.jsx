import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import api from '../../../services/api';

const CostOverall = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get icon based on group name
  const getIconForGroup = (groupName) => {
    if (groupName.includes('ໄຟຟ້າ')) return "💡";
    if (groupName.includes('ແອ')) return "👔";
    if (groupName.includes('ປະປາ') || groupName.includes('ກໍ່ສ້າງ')) return "🔧";
    if (groupName.includes('ອາໄຫຼ່') || groupName.includes('ເຄື່ອງມື')) return "⚒️";
    return "📦";
  };

  // Function to generate trend (you can modify this based on your needs)
  const generateTrend = () => {
    const trends = ["+5.2%", "-2.1%", "+12.8%", "+8.7%", "+3.4%", "-1.5%"];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  // Function to create short name
  const createShortName = (fullName) => {
    if (fullName.includes('ໄຟຟ້າພາຍໃນບ້ານ')) return "ເຄື່ອງໃຊ້ໄຟຟ້າ";
    if (fullName === 'ແອ') return "ແອ";
    if (fullName.includes('ປະປາ') && fullName.includes('ກໍ່ສ້າງ')) return "ປະປາ & ກໍ່ສ້າງ";
    if (fullName.includes('ອາໄຫຼ່') && fullName.includes('ເຄື່ອງມື')) return "ອາໄຫຼ່ & ເຄື່ອງມື";
    return fullName.length > 15 ? fullName.substring(0, 15) + "..." : fullName;
  };

  // Fetch data from API using axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/cost/odgoverall', {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const result = response.data;
        
        if (result.success) {
          // Transform API data to match component structure
          const transformedData = {
            overall: {
              total_items: parseInt(result.overall.total_items),
              items_with_price: parseInt(result.overall.items_with_price),
              items_without_price: parseInt(result.overall.items_without_price)
            },
            categories: result.bygroupmain.map(item => ({
              name: item.group_main_name,
              shortName: createShortName(item.group_main_name),
              total: parseInt(item.total_items),
              with_price: parseInt(item.items_with_price),
              without_price: parseInt(item.items_without_price),
              icon: getIconForGroup(item.group_main_name),
              trend: generateTrend(),
              group_main: item.group_main
            }))
          };
          
          setData(transformedData);
        } else {
          throw new Error('API returned success: false');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        
        // Handle different types of errors
        let errorMessage = 'ເກີດຂໍ້ຜິດພາດບໍ່ຮູ້ສາເຫດ';
        
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'API ໃຊ້ເວລາດົນເກີນໄປ (Timeout)';
        } else if (err.response) {
          // Server responded with error status
          errorMessage = `Server Error: ${err.response.status} - ${err.response.statusText}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ Server ໄດ້';
        } else {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ເກີດຂໍ້ຜິດພາດ</h2>
          <p className="text-gray-600 mb-4">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້</p>
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ລອງໃໝ່
          </button>
        </div>
      </div>
    );
  }

  // If no data
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">ບໍ່ມີຂໍ້ມູນ</p>
        </div>
      </div>
    );
  }

  const categoryData = data.categories.map(cat => ({
    ...cat,
    price_percentage: Math.round((cat.with_price / cat.total) * 100),
    completion_rate: (cat.with_price / cat.total) * 100
  }));

  return (
    <div className=" bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cost Overview</h1>
                <p className="text-xs text-gray-500">ແດັສບອດສະຫຼຸບຄ່າໃຊ້ຈ່າຍ</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
              >
                ໂຫຼດໃໝ່
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-2 py-2">
        {/* Compact Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <div className="bg-white rounded-lg p-2 shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xs font-medium text-gray-500">ສິນຄ້າທັງໝົດ</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.overall.total_items.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xs font-medium text-gray-500">ມີ Lao Cost</h4>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{data.overall.items_with_price.toLocaleString()}</p>
            <p className="text-xs text-green-600 font-medium">
              {Math.round((data.overall.items_with_price / data.overall.total_items) * 100)}% ຂອງທັງໝົດ
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-xs font-medium text-gray-500">ບໍ່ມີ Lao Cost</h4>
              </div>

            </div>
            <p className="text-2xl font-bold text-gray-900">{data.overall.items_without_price.toLocaleString()}</p>
            <p className="text-xs text-red-600 font-medium">
              {Math.round((data.overall.items_without_price / data.overall.total_items) * 100)}% ຂອງທັງໝົດ
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xs font-medium text-gray-500">ສັດສ່ວນ</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">  {Math.round((data.overall.items_without_price / data.overall.total_items) * 100)} %</p>
            <p className="text-xs text-amber-600 font-medium">ອັດຕາ ບໍ່ມີ Lao Cost</p>
          </div>
        </div>

        {/* Compact Data Table */}
        <div className="mt-2 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-2 py-2 border-b border-gray-100">
            <h4 className="text-base font-semibold text-gray-900">ຕາຕະລາງຂໍ້ມູນ</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ປະເພດ
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ທັງໝົດ
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ມີລາຄາ
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ບໍ່ມີລາຄາ
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ອັດຕາ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryData.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{category.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.shortName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-sm font-medium text-gray-900">
                      {category.total.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">
                          {category.with_price.toLocaleString()}
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${(category.with_price / category.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-red-600">
                          {category.without_price.toLocaleString()}
                        </span>
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-red-500 h-1.5 rounded-full"
                            style={{ width: `${(category.without_price / category.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {category.price_percentage}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              category.price_percentage >= 50 ? 'bg-green-500' : 
                              category.price_percentage >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${category.price_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Summary Row */}
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td className="px-2 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">📊</span>
                      <span className="text-sm font-bold text-gray-900">ລວມທັງໝົດ</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-sm font-bold text-gray-900">
                    {data.overall.total_items.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-sm font-bold text-green-600">
                    {data.overall.items_with_price.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-sm font-bold text-red-600">
                    {data.overall.items_without_price.toLocaleString()}
                  </td>
                  <td className="px-2 py-2">
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round((data.overall.items_with_price / data.overall.total_items) * 100)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOverall;