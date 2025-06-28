import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Keep if other components rely on it, otherwise consider removing
import api from '../../../services/api';
import Navbar from '../../../components/Navbar'; // Assuming this is for 'Manager'
import NavbarPM from '../../../components/NavbarPM'; // Assuming this is for other roles
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Keep for icons

export default function LaoCostZero() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [groupMain, setGroupMain] = useState('');
  const [groupSub, setGroupSub] = useState('');
  const [groupSub2, setGroupSub2] = useState('');
  const [groupMainOptions, setGroupMainOptions] = useState([]);
  const [groupSubOptions, setGroupSubOptions] = useState([]);
  const [groupSub2Options, setGroupSub2Options] = useState([]);
  const limit = 30;
  const roles = localStorage.getItem('role'); // Get user role from localStorage

  // --- Data Fetching for Dropdowns ---
  useEffect(() => {
    api.get('/cost/groupmain')
      .then((res) => setGroupMainOptions(res.data.data || []))
      .catch((err) => console.error('Failed to load group main:', err));
  }, []);

  useEffect(() => {
    setGroupSubOptions([]); // Clear sub-options when main changes
    setGroupSub2Options([]); // Clear sub2-options when main changes
    setGroupSub('');
    setGroupSub2('');
    if (!groupMain) return;

    const selected = groupMainOptions.find(g => g.name_1 === groupMain);
    if (selected?.code) {
      api.get(`/cost/groupsub?main=${selected.code}`)
        .then((res) => setGroupSubOptions(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub:', err));
    }
  }, [groupMain, groupMainOptions]);

  useEffect(() => {
    setGroupSub2Options([]); // Clear sub2-options when sub changes
    setGroupSub2('');
    if (!groupMain || !groupSub) return;

    const selectedMain = groupMainOptions.find(g => g.name_1 === groupMain);
    const selectedSub = groupSubOptions.find(g => g.name_1 === groupSub);
    if (selectedMain?.code && selectedSub?.code) {
      api.get(`/cost/groupsub2?main=${selectedMain.code}&sub=${selectedSub.code}`)
        .then((res) => setGroupSub2Options(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub2:', err));
    }
  }, [groupSub, groupMain, groupMainOptions, groupSubOptions]);

  // --- Main Data Fetching ---
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
      .catch((err) => {
        console.error("Error fetching data:", err);
        setData([]); // Clear data on error
        setFiltered([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  };

  // Trigger data fetch when filters or current page change
  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 when filters change
    fetchData(1);
  }, [groupMain, groupSub, groupSub2]);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // --- Search Functionality ---
  useEffect(() => {
    const keyword = search.toLowerCase().trim();
    if (keyword) {
      const result = data.filter(item =>
        item.itemmaingroup?.toLowerCase().includes(keyword) ||
        item.itemsubgroup?.toLowerCase().includes(keyword) ||
        item.itemsubgroup2?.toLowerCase().includes(keyword) ||
        item.item_code?.toLowerCase().includes(keyword) ||
        item.item_name?.toLowerCase().includes(keyword)
      );
      setFiltered(result);
    } else {
      setFiltered(data); // If search is empty, show all data
    }
    // No need to reset currentPage here, search only filters current data
  }, [search, data]);

  // --- Export to Excel ---
  const exportToExcel = () => {
    setLoading(true); // Indicate loading for export
    api.get('/cost/salewithcost-zero', {
      params: {
        export: 1, // API should return all data for export when this flag is set
        groupMain,
        groupSub,
        groupSub2,
      }
    })
      .then((res) => {
        const allData = res.data.data || [];

        if (!allData.length) {
          alert("ບໍ່ພົບຂໍ້ມູນສຳລັບ Export.");
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(allData.map(item => ({
          'Group Main': item.itemmaingroup || '-',
          'Group Sub': item.itemsubgroup || '-',
          'Group Sub2': item.itemsubgroup2 || '-',
          'ລະຫັດສິນຄ້າ': item.item_code || '-',
          'ຊື່ສິນຄ້າ': item.item_name || '-',
          'ຈຳນວນ (ຂາຍ)': item.qty || 0,
          'ຫົວໜ່ວຍ': item.unit_code || '-',
          'ຄັ້ງທຳອິດທີ່ຂາຍ': item.first_sale || '-',
          'ຂາຍລ້າສຸດ': item.last_sale || '-',
          'ມູນຄ່າຂາຍ': item.sale_amount || 0,
          'ຕົ້ນທຶນ': item.total_cost || 0,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'CostZeroItems');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `CostZeroItems_${new Date().toLocaleDateString()}.xlsx`);
      })
      .catch((err) => {
        console.error('Export failed:', err);
        alert('ການ Export ລົ້ມເຫຼວ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.');
      })
      .finally(() => setLoading(false)); // End loading for export
  };

  // --- Pagination Logic ---
  const maxPageButtons = 5; // Reduced for cleaner look
  const getPaginationRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      {/* Dynamic Navbar based on role */}
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}

      <div className="container mx-auto px-4 py-8 font-['Noto_Sans_Lao']">
        <h2 className="text-3xl font-extrabold text-red-700 mb-6 text-center md:text-left">
          <i className="bi bi-exclamation-triangle-fill mr-3"></i>
          ລາຍການຂາຍສິນຄ້າທີ່ມີຕົ້ນທຶນ (Lao Cost) ເປັນ 0
        </h2>

        {/* Filters and Export Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Group Main Filter */}
            <div>
              <label htmlFor="groupMain" className="block text-sm font-medium text-gray-700 mb-1">ກຸ່ມສິນຄ້າຫຼັກ</label>
              <select
                id="groupMain"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out py-2 px-3"
                value={groupMain}
                onChange={(e) => setGroupMain(e.target.value)}
              >
                <option value="">-- ເລືອກກຸ່ມຫຼັກ --</option>
                {groupMainOptions.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
            </div>

            {/* Group Sub Filter */}
            <div>
              <label htmlFor="groupSub" className="block text-sm font-medium text-gray-700 mb-1">ກຸ່ມສິນຄ້າຮອງ</label>
              <select
                id="groupSub"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out py-2 px-3"
                value={groupSub}
                onChange={(e) => setGroupSub(e.target.value)}
                disabled={!groupMain}
              >
                <option value="">-- ເລືອກກຸ່ມຮອງ --</option>
                {groupSubOptions.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
            </div>

            {/* Group Sub2 Filter */}
            <div>
              <label htmlFor="groupSub2" className="block text-sm font-medium text-gray-700 mb-1">ກຸ່ມສິນຄ້າຮອງ 2</label>
              <select
                id="groupSub2"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out py-2 px-3"
                value={groupSub2}
                onChange={(e) => setGroupSub2(e.target.value)}
                disabled={!groupSub}
              >
                <option value="">-- ເລືອກກຸ່ມຮອງ 2 --</option>
                {groupSub2Options.map((g) => (
                  <option key={g.code} value={g.name_1}>{g.name_1}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">ຄົ້ນຫາ</label>
              <input
                id="search"
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out py-2 px-3"
                placeholder="ລະຫັດ, ຊື່, ກຸ່ມ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-center md:justify-end">
            <button
              className="inline-flex items-center gap-2 px-5 py-2 text-md font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out shadow-md"
              onClick={exportToExcel}
              disabled={loading} // Disable during any loading state
            >
              <i className="bi bi-file-earmark-arrow-down-fill text-xl"></i>
              {loading ? 'ກຳລັງ Export...' : 'Export ຂໍ້ມູນທັງໝົດ'}
            </button>
          </div>
        </div>

        {/* Data Display Section */}
        {loading && !filtered.length && ( // Only show full-page loader if no data is present yet
          <div className="flex flex-col items-center justify-center my-12 py-12 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-xl text-gray-700">ກຳລັງໂຫຼດຂໍ້ມູນ, ກະລຸນາລໍຖ້າ...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-600">
            <i className="bi bi-info-circle-fill text-5xl mb-4 text-blue-500"></i>
            <p className="text-lg">ບໍ່ພົບຂໍ້ມູນລາຍການສິນຄ້າທີ່ມີຕົ້ນທຶນເປັນ 0 ຕາມເງື່ອນໄຂທີ່ເລືອກ.</p>
          </div>
        )}

        {/* Table View */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ລະຫັດສິນຄ້າ</th>
                  <th rowSpan={2} className="px-4 py-3 text-left align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຊື່ສິນຄ້າ</th>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຈຳນວນຂາຍ</th>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຫົວໜ່ວຍ</th>
                  <th colSpan={2} className="px-4 py-3 text-center border-b border-r border-gray-700 font-semibold text-sm tracking-wider">ຂໍ້ມູນການຂາຍ</th>
                  <th colSpan={2} className="px-4 py-3 text-center border-b border-gray-700 font-semibold text-sm tracking-wider">ມູນຄ່າ</th>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຄັ້ງທຳອິດ</th>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຂາຍລ້າສຸດ</th>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຂາຍລວມ</th>
                  <th className="px-4 py-2 text-center font-semibold text-xs tracking-wider">ຕົ້ນທຶນ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.item_code} className="hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">{item.item_code}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.item_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{item.qty?.toLocaleString() || '0'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{item.unit_code}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{item.first_sale || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-center">{item.last_sale || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{Number(item.sale_amount).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-bold text-right">{Number(item.total_cost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <nav className="mt-8 flex justify-center">
            <ul className="flex items-center space-x-1 bg-white p-3 rounded-lg shadow-md">
              <li>
                <button
                  className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i> ກ່ອນໜ້າ
                </button>
              </li>

              {getPaginationRange().map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${currentPage === pageNumber
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

              <li>
                <button
                  className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  ຖັດໄປ <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}