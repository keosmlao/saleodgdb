import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Keep if other components rely on it, otherwise consider removing
import api from '../../../services/api'; // Assuming this API service is correctly configured
import Navbar from '../../../components/Navbar'; // Assuming this is for 'Manager' role
import NavbarPM from '../../../components/NavbarPM'; // Assuming this is for other roles
import * as XLSX from 'xlsx'; // Library for Excel operations
import { saveAs } from 'file-saver'; // Library for saving files
import 'bootstrap-icons/font/bootstrap-icons.css'; // For icons

export default function SaleUnderLaoCost() {
  // State variables for data, filtering, pagination, and loading
  const [data, setData] = useState([]); // Stores the raw data fetched from the API
  const [filtered, setFiltered] = useState([]); // Stores data after applying search filter
  const [search, setSearch] = useState(''); // Search input value
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // Indicates if data is currently being loaded
  
  // State variables for group filters
  const [groupMain, setGroupMain] = useState('');
  const [groupSub, setGroupSub] = useState('');
  const [groupSub2, setGroupSub2] = useState('');

  // State variables for dropdown options
  const [groupMainOptions, setGroupMainOptions] = useState([]);
  const [groupSubOptions, setGroupSubOptions] = useState([]);
  const [groupSub2Options, setGroupSub2Options] = useState([]);

  const limit = 30; // Number of items per page
  const roles = localStorage.getItem('role'); // Get user role from localStorage for Navbar selection

  // --- useEffect for fetching Group Main options ---
  useEffect(() => {
    api.get('/cost/groupmain')
      .then((res) => setGroupMainOptions(res.data.data || []))
      .catch((err) => console.error('Failed to load group main options:', err));
  }, []); // Runs once on component mount

  // --- useEffect for fetching Group Sub options based on Group Main selection ---
  useEffect(() => {
    // Clear sub and sub2 options and selections when groupMain changes
    setGroupSubOptions([]);
    setGroupSub2Options([]);
    setGroupSub('');
    setGroupSub2('');

    if (!groupMain) return; // Do not fetch if no main group is selected

    const selected = groupMainOptions.find(g => g.name_1 === groupMain);
    if (selected?.code) {
      api.get(`/cost/groupsub?main=${selected.code}`)
        .then((res) => setGroupSubOptions(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub options:', err));
    }
  }, [groupMain, groupMainOptions]); // Re-runs when groupMain or groupMainOptions change

  // --- useEffect for fetching Group Sub2 options based on Group Sub selection ---
  useEffect(() => {
    // Clear sub2 options and selection when groupSub changes
    setGroupSub2Options([]);
    setGroupSub2('');

    if (!groupMain || !groupSub) return; // Do not fetch if main or sub group is not selected

    const selectedMain = groupMainOptions.find(g => g.name_1 === groupMain);
    const selectedSub = groupSubOptions.find(g => g.name_1 === groupSub);
    
    if (selectedMain?.code && selectedSub?.code) {
      api.get(`/cost/groupsub2?main=${selectedMain.code}&sub=${selectedSub.code}`)
        .then((res) => setGroupSub2Options(res.data.data || []))
        .catch((err) => console.error('Failed to load group sub2 options:', err));
    }
  }, [groupSub, groupMain, groupMainOptions, groupSubOptions]); // Re-runs when groupSub, groupMain, or their options change

  // --- Function to fetch main data ---
  const fetchData = (page) => {
    setLoading(true); // Set loading to true before API call
    api.get('/cost/salewithcost-under', { // API endpoint for sale under cost data
      params: {
        page,
        limit,
        groupMain,
        groupSub,
        groupSub2,
      },
    })
      .then((res) => {
        setData(res.data.data); // Store raw data
        setFiltered(res.data.data); // Initialize filtered data with raw data
        setTotalPages(res.data.totalPages); // Set total pages for pagination
      })
      .catch((err) => {
        console.error("Error fetching main data:", err);
        setData([]); // Clear data on error
        setFiltered([]);
        setTotalPages(1); // Reset total pages on error
      })
      .finally(() => setLoading(false)); // Set loading to false after API call (success or error)
  };

  // --- useEffect to trigger data fetch on filter changes (resets to page 1) ---
  useEffect(() => {
    setCurrentPage(1); // Always reset to the first page when filters change
    fetchData(1);
  }, [groupMain, groupSub, groupSub2]); // Re-runs when any group filter changes

  // --- useEffect to trigger data fetch on page changes ---
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]); // Re-runs when currentPage changes

  // --- useEffect for search functionality (filters client-side data) ---
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
      setFiltered(data); // If search is empty, show all data for the current page
    }
  }, [search, data]); // Re-runs when search input or raw data changes

  // --- Function to export filtered data to Excel ---
  const exportToExcel = () => {
    setLoading(true); // Indicate loading for export operation
    api.get('/cost/salewithcost-under', { // Use the same endpoint as main fetch, with export flag
      params: {
        export: 1, // Flag to indicate a full export is requested (API should return all data, not paginated)
        groupMain,
        groupSub,
        groupSub2,
      }
    })
      .then((res) => {
        const allData = res.data.data || []; // Assuming API returns data in res.data.data for export as well

        if (!allData.length) {
          alert("ບໍ່ພົບຂໍ້ມູນສຳລັບ Export."); // User-friendly alert if no data to export
          return;
        }

        // Map data to a format suitable for Excel, with user-friendly column names
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
          'GM': item.gm || 0, // Include GM in export
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SaleUnderCost'); // Sheet name
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `SaleUnderCostItems_${new Date().toLocaleDateString()}.xlsx`); // Filename with date
      })
      .catch((err) => {
        console.error('Export failed:', err);
        alert('ການ Export ລົ້ມເຫຼວ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.'); // User-friendly error message
      })
      .finally(() => setLoading(false)); // End loading after export
  };

  // --- Pagination Logic ---
  const maxPageButtons = 5; // Number of page buttons to display at once
  const getPaginationRange = () => {
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    // Adjust start if not enough pages to fill maxPageButtons from the end
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <>
      {/* Conditional Navbar rendering based on user role */}
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}

      <div className="container mx-auto px-4 py-8 font-['Noto_Sans_Lao']">
        <h2 className="text-3xl font-extrabold text-red-700 mb-6 text-center md:text-left">
          <i className="bi bi-currency-dollar-fill mr-3"></i>
          ລາຍການຂາຍສິນຄ້າທີ່ມີລາຄາຂາຍຕ່ຳກວ່າຕົ້ນທຶນ
        </h2>

        {/* Filter and Export Section */}
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
              disabled={loading} 
            >
              <i className="bi bi-file-earmark-arrow-down-fill text-xl"></i>
              {loading ? 'ກຳລັງ Export...' : 'Export ຂໍ້ມູນທັງໝົດ'}
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Loading, No Data, or Table */}
        {loading && !filtered.length ? ( // Show full-page loader only if no data is present yet
          <div className="flex flex-col items-center justify-center my-12 py-12 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-xl text-gray-700">ກຳລັງໂຫຼດຂໍ້ມູນ, ກະລຸນາລໍຖ້າ...</p>
          </div>
        ) : !loading && filtered.length === 0 ? ( // Show no data message if not loading and no data
          <div className="bg-white p-8 rounded-lg shadow-lg text-center text-gray-600">
            <i className="bi bi-info-circle-fill text-5xl mb-4 text-blue-500"></i>
            <p className="text-lg">ບໍ່ພົບຂໍ້ມູນລາຍການສິນຄ້າທີ່ມີລາຄາຂາຍຕ່ຳກວ່າຕົ້ນທຶນ ຕາມເງື່ອນໄຂທີ່ເລືອກ.</p>
          </div>
        ) : ( // Show table if data is available and not in full-page loading state
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ລະຫັດສິນຄ້າ</th>
                  <th rowSpan={2} className="px-4 py-3 text-left align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຊື່ສິນຄ້າ</th>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຈຳນວນຂາຍ</th>
                  <th rowSpan={2} className="px-4 py-3 text-center align-middle border-r border-gray-700 font-semibold text-sm tracking-wider">ຫົວໜ່ວຍ</th>
                  <th colSpan={2} className="px-4 py-3 text-center border-b border-r border-gray-700 font-semibold text-sm tracking-wider">ຂໍ້ມູນການຂາຍ</th>
                  <th colSpan={3} className="px-4 py-3 text-center border-b border-gray-700 font-semibold text-sm tracking-wider">ມູນຄ່າ</th>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຄັ້ງທຳອິດ</th>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຂາຍລ້າສຸດ</th>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຂາຍລວມ</th>
                  <th className="px-4 py-2 text-center border-r border-gray-700 font-semibold text-xs tracking-wider">ຕົ້ນທຶນ</th>
                  <th className="px-4 py-2 text-center font-semibold text-xs tracking-wider">GM</th>
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium text-right">{Number(item.total_cost).toLocaleString()}</td>
                    {/* Conditional styling for GM column */}
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold text-right 
                                   ${item.gm && item.gm < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Number(item.gm).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
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

              {/* Render pagination buttons based on range */}
              {getPaginationRange().map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    className={`px-4 py-2 text-sm rounded-lg transition-colors duration-150 ease-in-out ${currentPage === pageNumber
                        ? 'bg-blue-600 text-white shadow' // Highlight current page
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
