import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function LaoCostZero() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const [groupMain, setGroupMain] = useState('');
  const [groupSub, setGroupSub] = useState('');
  const [groupSub2, setGroupSub2] = useState('');
  const [groupMainOptions, setGroupMainOptions] = useState([]);
  const [groupSubOptions, setGroupSubOptions] = useState([]);
  const [groupSub2Options, setGroupSub2Options] = useState([]);
  const limit = 30;

  useEffect(() => {
    api.get('/cost/groupmain')
      .then((res) => setGroupMainOptions(res.data.data || []))
      .catch((err) => console.error('Failed to load group main:', err));
  }, []);

  useEffect(() => {
    if (!groupMain) return setGroupSubOptions([]);
    const selected = groupMainOptions.find(g => g.name_1 === groupMain);
    if (selected?.code) {
      api.get(`/cost/groupsub?main=${selected.code}`)
        .then((res) => setGroupSubOptions(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub:', err));
    }
  }, [groupMain]);

  useEffect(() => {
    if (!groupMain || !groupSub) return setGroupSub2Options([]);
    const selectedMain = groupMainOptions.find(g => g.name_1 === groupMain);
    const selectedSub = groupSubOptions.find(g => g.name_1 === groupSub);
    if (selectedMain?.code && selectedSub?.code) {
      api.get(`/cost/groupsub2?main=${selectedMain.code}&sub=${selectedSub.code}`)
        .then((res) => setGroupSub2Options(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub2:', err));
    }
  }, [groupSub]);

  const fetchData = (page) => {
    setLoading(true);
    api.get('/cost/salewithcost-zero', {
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

  const exportToExcel = () => {
    api.get('/sales/salewithcost-zero', {
      params: {
        export: 1,
        groupMain,
        groupSub,
        groupSub2,
      }
    })
      .then((res) => {
        const allData = res.data;
        const worksheet = XLSX.utils.json_to_sheet(allData.map(item => ({
          'Group Main': item.itemmaingroup,
          'Group Sub': item.itemsubgroup,
          'Group Sub2': item.itemsubgroup2,
          'Item Code': item.item_code,
          'Item Name': item.item_name,
          'Qty': item.qty,
          'Unit': item.unit_code,
          'ມູນຄ່າຂາຍ': item.sale_amount,
          'ຕົ້ນທືນ': item.total_cost,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'CostZero');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'AllCostZeroItems.xlsx');
      })
      .catch((err) => console.error('Export failed:', err));
  };

  const maxPageButtons = 10;
  const pageRangeStart = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const pageRangeEnd = Math.min(pageRangeStart + maxPageButtons - 1, totalPages);

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-4 px-4 font-['Noto_Sans_Lao']">
        <h4 className="mb-3 text-red-600 font-bold">ລາຍການຂາຍສິນຄ້າທີ່ມີ lao cost = 0</h4>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
          <div>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          </div>

          <div>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          </div>

          <div>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={groupSub2} 
              onChange={(e) => setGroupSub2(e.target.value)}
            >
              <option value="">-- Group Sub2 --</option>
              {groupSub2Options.map((g) => (
                <option key={g.code} value={g.name_1}>{g.name_1}</option>
              ))}
            </select>
          </div>

          <div>
            <input 
              type="text" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ຄົ້ນຫາ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-3">
          <button
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
            onClick={exportToExcel}
          >
            <i className="bi bi-download"></i> Export All to Excel
          </button>
        </div>

        {/* Loading Spinner or Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center my-4">
            <div className="w-8 h-8 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-2 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th rowSpan={2} className="px-4 py-2 text-center align-middle border border-gray-600">ລະຫັດ</th>
                    <th rowSpan={2} className="px-4 py-2 text-center align-middle border border-gray-600">ຊື່ສິນຄ້າ</th>
                    <th rowSpan={2} className="px-4 py-2 text-center align-middle border border-gray-600">ຈຳນວນ(ຂາຍ)</th>
                    <th rowSpan={2} className="px-4 py-2 text-center align-middle border border-gray-600">ຫົວໜ່ວຍ</th>
                    <th colSpan={2} className="px-4 py-2 text-center border border-gray-600">ຂໍ້ມູນການຂາຍ</th>
                    <th colSpan={2} className="px-4 py-2 text-center border border-gray-600">ມູນຄ່າ</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 border border-gray-600">ຄັ້ງທຳອິດທີ່ຂາຍ</th>
                    <th className="px-4 py-2 border border-gray-600">ຂາຍລ້າສຸດ</th>
                    <th className="px-4 py-2 text-center border border-gray-600">ຂາຍລວມ</th>
                    <th className="px-4 py-2 text-center border border-gray-600">ຕົ້ນທືນ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((item) => (
                    <tr key={item.item_code} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{item.item_code}</td>
                      <td className="px-4 py-2">{item.item_name}</td>
                      <td className="px-4 py-2 text-right">{item.qty}</td>
                      <td className="px-4 py-2">{item.unit_code}</td>
                      <td className="px-4 py-2">{item.first_sale}</td>
                      <td className="px-4 py-2">{item.last_sale}</td>
                      <td className="px-4 py-2 text-right">{Number(item.sale_amount).toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{Number(item.total_cost).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && (
          <nav className="mt-4">
            <ul className="flex justify-center space-x-1">
              <li>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {pageRangeStart > 1 && (
                <li>
                  <button 
                    className="px-3 py-1 text-sm bg-white text-gray-700 rounded-md hover:bg-gray-50"
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
                      className={`px-3 py-1 text-sm rounded-md ${
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
                    className="px-3 py-1 text-sm bg-white text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={() => setCurrentPage(pageRangeEnd + 1)}
                  >
                    »
                  </button>
                </li>
              )}

              <li>
                <button 
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
