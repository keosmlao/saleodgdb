import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';
import DashboardCostSummary from './DashboardCostSummary';
import NavbarPM from '../../../components/NavbarPM';
export default function ProductSalesPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupMain, setGroupMain] = useState('');
  const [groupSub, setGroupSub] = useState('');
  const [groupSub2, setGroupSub2] = useState('');
  const [groupMainOptions, setGroupMainOptions] = useState([]);
  const [groupSubOptions, setGroupSubOptions] = useState([]);
  const [groupSub2Options, setGroupSub2Options] = useState([]);
  const [loading, setLoading] = useState(false);
  const limit = 30;
  const roles = localStorage.getItem('role'); // Get user role from localStorage
  useEffect(() => {
    api.get('/cost/groupmain')
      .then((res) => setGroupMainOptions(res.data.data || []))
      .catch((err) => console.error('Failed to load group main:', err));
  }, []);

  useEffect(() => {
    if (!groupMain) {
      setGroupSubOptions([]);
      return;
    }
    const selected = groupMainOptions.find(g => g.name_1 === groupMain);
    if (selected?.code) {
      api.get(`/cost/groupsub?main=${selected.code}`)
        .then((res) => setGroupSubOptions(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub:', err));
    }
  }, [groupMain, groupMainOptions]);

  useEffect(() => {
    if (!groupMain || !groupSub) {
      setGroupSub2Options([]);
      return;
    }
    const selectedMain = groupMainOptions.find(g => g.name_1 === groupMain);
    const selectedSub = groupSubOptions.find(g => g.name_1 === groupSub);
    if (selectedMain?.code && selectedSub?.code) {
      api.get(`/cost/groupsub2?main=${selectedMain.code}&sub=${selectedSub.code}`)
        .then((res) => setGroupSub2Options(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub2:', err));
    }
  }, [groupMain, groupSub, groupMainOptions, groupSubOptions]);

  const fetchData = (page) => {
    setLoading(true);
    api.get('/cost/salewithcost', {
      params: {
        page,
        limit,
        groupMain,
        groupSub,
        groupSub2,
      },
    })
      .then((res) => {
        setData(res.data.data);
        setFiltered(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData(1);
  }, [groupMain, groupSub, groupSub2]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    let result = data;
    if (search.trim()) {
      const keyword = search.toLowerCase();
      result = result.filter(item =>
        item.itemmaingroup?.toLowerCase().includes(keyword) ||
        item.itemsubgroup?.toLowerCase().includes(keyword) ||
        item.itemsubgroup2?.toLowerCase().includes(keyword) ||
        item.item_code?.toLowerCase().includes(keyword) ||
        item.item_name?.toLowerCase().includes(keyword)
      );
    }
    setFiltered(result);
  }, [search, data]);

  const maxPageButtons = 10;
  const pageRangeStart = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const pageRangeEnd = Math.min(pageRangeStart + maxPageButtons - 1, totalPages);

  return (
    <>
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}
      <DashboardCostSummary />
      <div className=" container   mx-auto mt-8 px-4 ">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-2xl font-bold text-gray-800 mb-6 font-['Noto_Sans_Lao']">ລາຍການຂາຍສິນຄ້າ</h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <select 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                value={groupMain} 
                onChange={(e) => {
                  setGroupMain(e.target.value);
                  setGroupSub('');
                  setGroupSub2('');
                }}
              >
                <option value="">-- Group Main --</option>
                {groupMainOptions.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                value={groupSub} 
                onChange={(e) => {
                  setGroupSub(e.target.value);
                  setGroupSub2('');
                }}
              >
                <option value="">-- Group Sub --</option>
                {groupSubOptions.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                value={groupSub2} 
                onChange={(e) => setGroupSub2(e.target.value)}
              >
                <option value="">-- Group Sub2 --</option>
                {groupSub2Options.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="ຄົ້ນຫາ..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th rowSpan="2" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">ລະຫັດ</th>
                      <th rowSpan="2" className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border border-gray-300">ຊື່ສິນຄ້າ</th>
                      <th rowSpan="2" className="px-6 py-4 text-right text-sm font-semibold text-gray-900 border border-gray-300">ຈຳນວນ(ຂາຍ)</th>
                      <th rowSpan="2" className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border border-gray-300">ຫົວໜ່ວຍ</th>
                      <th colSpan="2" className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border border-gray-300">ຂໍ້ມູນການຂາຍ</th>
                      <th colSpan="3" className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border border-gray-300">ມູນຄ່າ</th>
                    </tr>
                    <tr>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 border border-gray-300">ຄັ້ງທຳອິດທີ່ຂາຍ</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 border border-gray-300">ຂາຍລ້າສຸດ</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 border border-gray-300">ຂາຍລວມ</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 border border-gray-300">ຕົ້ນທືນ</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-500 border border-gray-300">GM</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((item) => (
                      <tr key={item.item_code} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-gray-900">{item.item_code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.item_name}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">{item.qty}</td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900">{item.unit_code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.first_sale}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.last_sale}</td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">{Number(item.sale_amount).toLocaleString()}</td>
                        <td className={`px-6 py-4 text-sm text-right ${Number(item.total_cost) === 0 ? 'text-red-500' : 'text-blue-600'}`}>
                          {Number(item.total_cost).toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 text-sm text-right ${item.gm <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {Number(item.gm).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <nav className="mt-4">
                <ul className="flex justify-center space-x-1">
                  <li>
                    <button 
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {pageRangeStart > 1 && (
                    <li>
                      <button 
                        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => setCurrentPage(pageRangeStart - 1)}
                      >
                        «
                      </button>
                    </li>
                  )}

                  {Array.from({ length: pageRangeEnd - pageRangeStart + 1 }, (_, i) => {
                    const pageNumber = pageRangeStart + i;
                    return (
                      <li key={pageNumber}>
                        <button 
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNumber 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}

                  {pageRangeEnd < totalPages && (
                    <li>
                      <button 
                        className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => setCurrentPage(pageRangeEnd + 1)}
                      >
                        »
                      </button>
                    </li>
                  )}

                  <li>
                    <button 
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
}
