import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import NavbarPM from '../../components/NavbarPM';
import api from '../../services/api';

const PAGE_SIZE = 10;

// Helper to format numbers consistently
const formatNumber = (val, digits = 2) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? '0.00' : parsed.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
};

// Reusable Table Component
const DataTable = ({ headers, data, loading, error, renderRow, onSort, sortKey, sortAsc }) => (
  <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 backdrop-blur-sm bg-white/70">
    <table className="min-w-full text-xs text-gray-700">
      <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md">
        <tr>
          {headers.map((h) => (
            <th
              key={h.key}
              title="Click to sort"
              className="py-2 px-3 text-left font-semibold uppercase tracking-wider cursor-pointer hover:bg-blue-800 transition-colors duration-200 rounded-tl-xl first:rounded-bl-none last:rounded-tr-xl last:rounded-br-none"
              onClick={() => onSort(h.key)}
            >
              {h.label}
              {sortKey === h.key && (sortAsc ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {loading ? (
          <tr><td colSpan={headers.length} className="px-3 py-4 text-center text-blue-600 font-medium animate-pulse">ກຳລັງໂຫຼດຂໍ້ມູນ...</td></tr>
        ) : error ? (
          <tr><td colSpan={headers.length} className="px-3 py-4 text-center text-red-600 font-medium">{error}</td></tr>
        ) : data.length > 0 ? (
          data.map(renderRow)
        ) : (
          <tr><td colSpan={headers.length} className="px-3 py-4 text-center text-gray-500">ບໍ່ມີຂໍ້ມູນສຳລັບຕົວກອງທີ່ເລືອກ.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

// Pagination Component
const Pagination = ({ page, totalPages, setPage }) => (
  <div className="flex justify-between items-center mt-6 pt-4 border-t border-blue-200">
    <button
      className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      onClick={() => setPage(Math.max(page - 1, 1))}
      disabled={page === 1}
    >
      ກັບຄືນ
    </button>
    <span className="text-base font-semibold text-blue-700">ໜ້າທີ {page} ຂອງ {totalPages}</span>
    <button
      className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
      onClick={() => setPage(Math.min(page + 1, totalPages))}
      disabled={page === totalPages}
    >
      ຕໍ່ໄປ
    </button>
  </div>
);

export default function BcgTables() {
  const [data, setData] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const roles = localStorage.getItem("role");

  // Filter states
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedGroupMain, setSelectedGroupMain] = useState(''); // Stores code
  const [selectedGroupSub, setSelectedGroupSub] = useState(''); // Stores code (e.g., 'PH2A')
  const [selectedGroupSub1, setSelectedGroupSub1] = useState(''); // Stores code (e.g., 'PH3X')
  const [selectedCategory, setSelectedCategory] = useState(''); // Stores name directly (e.g., 'Electronics')
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBcg, setSelectedBcg] = useState('');
  
  // Adjusted PH state: It will be derived from selected filters
  const [ph, setPh] = useState('00'); // Default PH to '00'

  // Dropdown lists
  const [groupMainList, setGroupMainList] = useState([]);
  const [groupSubList, setGroupSubList] = useState([]);
  const [groupSub1List, setGroupSub1List] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [bcgList, setBcgList] = useState([]);

  const [dividerLoading, setDividerLoading] = useState(false);

  // Helper to get name from code for API params
  const getGroupName = useCallback((list, code) => {
    const item = list.find(g => g.code === code);
    return item ? item.name_1 : '';
  }, []);

  // Effect to update PH and lists based on filter changes
  useEffect(() => {
    let currentPh = '00';
    let groupSubNameForApi = '';
    let groupSub1NameForApi = '';

    if (selectedCategory) {
      currentPh = selectedCategory; // Category name directly
      const sub1 = groupSub1List.find(g => getGroupName(groupSub1List, selectedGroupSub1) === selectedGroupSub1);
      if (sub1) groupSub1NameForApi = sub1.name_1;
      const sub = groupSubList.find(g => getGroupName(groupSubList, selectedGroupSub) === selectedGroupSub);
      if (sub) groupSubNameForApi = sub.name_1;

    } else if (selectedGroupSub1) {
      currentPh = selectedGroupSub1; // Group Sub 1 code
      groupSub1NameForApi = getGroupName(groupSub1List, selectedGroupSub1);
      const sub = groupSubList.find(g => getGroupName(groupSubList, selectedGroupSub) === selectedGroupSub);
      if (sub) groupSubNameForApi = sub.name_1;
      
    } else if (selectedGroupSub) {
      currentPh = selectedGroupSub; // Group Sub code
      groupSubNameForApi = getGroupName(groupSubList, selectedGroupSub);
      
    } else if (selectedGroupMain) {
      currentPh = selectedGroupMain; // Group Main code
    }
    
    setPh(currentPh);
  }, [selectedGroupMain, selectedGroupSub, selectedGroupSub1, selectedCategory, groupMainList, groupSubList, groupSub1List, getGroupName]);


  // Memoized function to build query parameters
  const buildQueryParams = useCallback(() => {
    const params = { year: selectedYear };
    if (selectedGroupMain) params.itemmaingroup = selectedGroupMain;
    
    const groupSubNameForApi = getGroupName(groupSubList, selectedGroupSub);
    if (groupSubNameForApi) params.group_sub = groupSubNameForApi;
    
    const groupSub1NameForApi = getGroupName(groupSub1List, selectedGroupSub1);
    if (groupSub1NameForApi) params.group_sub_1 = groupSub1NameForApi;
    
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (selectedBcg) params.bcg = selectedBcg;
    if (ph) params.ph = ph; // Ensure PH is always sent
    return params;
  }, [selectedYear, selectedGroupMain, selectedGroupSub, selectedGroupSub1, selectedCategory, searchQuery, selectedBcg, ph, groupSubList, groupSub1List, getGroupName]);

  // Data Fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildQueryParams();
      const res = await api.get('/bcg/bcg', { params });
      setData(res.data);
      setPage(1); // Reset to first page on new data fetch
      const uniqueBcg = [...new Set(res.data.map(item => item.bcg))].filter(Boolean);
      setBcgList(uniqueBcg);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      setData([]);
      setBcgList([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Depend on fetchData itself

  // Fetch Group Main List
  useEffect(() => {
    api.get(`/bcg/ic-group`)
      .then(res => setGroupMainList(res.data))
      .catch(err => console.error('Error loading group main:', err));
  }, []);

  // Fetch Group Sub List based on Group Main
  useEffect(() => {
    if (!selectedGroupMain) {
      setGroupSubList([]);
      setSelectedGroupSub('');
      setGroupSub1List([]);
      setSelectedGroupSub1('');
      setCategoryList([]);
      setSelectedCategory('');
      return;
    }
    api.get(`/bcg/ic-group-sub?main_group=${selectedGroupMain}`)
      .then(res => {
        setGroupSubList(res.data);
        setSelectedGroupSub(''); // Reset sub on main change
      })
      .catch(err => console.error('Error loading group sub:', err));
    setGroupSub1List([]);
    setSelectedGroupSub1('');
    setCategoryList([]);
    setSelectedCategory('');
  }, [selectedGroupMain]);

  // Fetch Group Sub 1 List based on Group Main and Group Sub
  useEffect(() => {
    if (!selectedGroupMain || !selectedGroupSub) {
      setGroupSub1List([]);
      setSelectedGroupSub1('');
      setCategoryList([]);
      setSelectedCategory('');
      return;
    }
    const groupSubName = getGroupName(groupSubList, selectedGroupSub);
    api.get(`/bcg/ic-group-sub2?main_group=${selectedGroupMain}&group_sub=${groupSubName}`)
      .then(res => {
        setGroupSub1List(res.data);
        setSelectedGroupSub1(''); // Reset sub1 on sub change
      })
      .catch(err => console.error('Error loading group sub1:', err));
    setCategoryList([]);
    setSelectedCategory('');
  }, [selectedGroupSub, selectedGroupMain, groupSubList, getGroupName]);

  // Fetch Category List based on Group Sub 1
  useEffect(() => {
    if (!selectedGroupSub1) {
      setCategoryList([]);
      setSelectedCategory('');
      return;
    }
    const groupSub1Name = getGroupName(groupSub1List, selectedGroupSub1);
    api.get(`/bcg/item-category?subgroup2=${groupSub1Name}`)
      .then(res => {
        const list = Array.isArray(res.data)
          ? (typeof res.data[0] === 'string' ? res.data : res.data.map(i => i.item_category_name))
          : [];
        setCategoryList(list);
        setSelectedCategory(''); // Reset category on sub1 change
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        setCategoryList([]);
        setSelectedCategory('');
      });
  }, [selectedGroupSub1, groupSub1List, getGroupName]);


  const handleSort = useCallback((key) => {
    setPage(1);
    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey]);

  const handleSetDivider = async (row, type) => {
    if (dividerLoading) return;
    setDividerLoading(true);

    const endpoint = type === 'rms' ? '/bcg/set-rmsdivider' : '/bcg/set-rgmdivider';

    try {
      const response = await api.post(endpoint, {
        item_brand: row.item_brand,
        ph: ph,
      });

      if (response.data.success) {
        console.log(`✅ Divider (${type}) updated successfully`);
        await fetchData();
      } else {
        console.error(`❌ Failed to update divider (${type})`);
      }
    } catch (error) {
      console.error(`🚨 Error setting divider (${type}):`, error);
    } finally {
      setDividerLoading(false);
    }
  };

  const handleClearDivider = async (type) => {
    const confirmMessage = type === 'rms' ? "ທ່ານແນ່ໃຈຈະລ້າງຕົວຫານ RMS ຫຼືບໍ?" : "ທ່ານແນ່ໃຈຈະລ້າງຕົວຫານ RGM ທັງໝົດບໍ?";
    if (!window.confirm(confirmMessage)) return;

    const endpoint = type === 'rms' ? '/bcg/clear-rmsdivider' : '/bcg/clear-rgmdivider';

    try {
      const response = await api.post(endpoint, { ph: ph });
      if (response.data.success) {
        console.log(`✅ Cleared ${type} dividers`);
        await fetchData();
      } else {
        console.error(`❌ Failed to clear ${type} dividers`);
      }
    } catch (err) {
      console.error(`🚨 Error clearing ${type} divider:`, err);
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let currentData = [...data];

    // Apply search query
    if (searchQuery) {
      currentData = currentData.filter(item =>
        item.item_brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply BCG filter
    if (selectedBcg) {
      currentData = currentData.filter(item => item.bcg === selectedBcg);
    }

    // Apply sorting
    if (sortKey) {
      currentData.sort((a, b) => {
        const valA = isNaN(a[sortKey]) ? a[sortKey] : Number(a[sortKey]);
        const valB = isNaN(b[sortKey]) ? b[sortKey] : Number(b[sortKey]);

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          if (valA < valB) return sortAsc ? -1 : 1;
          if (valA > valB) return sortAsc ? 1 : -1;
          return 0;
        }
      });
    }
    return currentData;
  }, [data, sortKey, sortAsc, searchQuery, selectedBcg]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return sortedAndFilteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedAndFilteredData, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedAndFilteredData.length / PAGE_SIZE));
  }, [sortedAndFilteredData]);

  // Determine current PH for display/actions
  const currentPHDisplay = useMemo(() => {
    if (selectedCategory) return `ໝວດ: ${selectedCategory}`;
    if (selectedGroupSub1) return `ກຸ່ມຍ່ອຍ 1: ${getGroupName(groupSub1List, selectedGroupSub1)}`;
    if (selectedGroupSub) return `ກຸ່ມຍ່ອຍ: ${getGroupName(groupSubList, selectedGroupSub)}`;
    if (selectedGroupMain) return `ກຸ່ມຫຼັກ: ${groupMainList.find(g => g.code === selectedGroupMain)?.name_1 || selectedGroupMain}`;
    return 'ທັງໝົດ';
  }, [selectedGroupMain, selectedGroupSub, selectedGroupSub1, selectedCategory, groupMainList, groupSubList, groupSub1List, getGroupName]);


  return (
    <>
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}

      <div className="p-8 bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen" style={{ fontFamily: "Lao font, sans-serif" }}>
        <h3 className=" font-extrabold text-center text-blue-900 mb-10 drop-shadow-lg animate-fade-in-down">
          Business Performance Dashboard
        </h3>

        {/* Filter Panel */}
        <div className="mb-10 p-8 bg-white rounded-2xl shadow-2xl border border-blue-200 transition-all duration-300 ease-in-out transform hover:scale-[1.005]">
          <h4 className="font-bold text-blue-800 text-center mb-6">ຕົວກອງ</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-7">
            {/* Year Select */}
            <div className="relative group">
              <label htmlFor="year-select" className="block text-sm font-semibold text-blue-800 mb-2">ປີ</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500"
              >
                {[2025, 2024, 2023, 2022, 2021].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Group Main Select */}
            <div className="relative group">
              <label htmlFor="group-main-select" className="block text-sm font-semibold text-blue-800 mb-2">ກຸ່ມຫຼັກ (PH1)</label>
              <select
                id="group-main-select"
                value={selectedGroupMain}
                onChange={e => {
                  setSelectedGroupMain(e.target.value);
                  setSelectedGroupSub(''); // Reset lower levels
                  setSelectedGroupSub1('');
                  setSelectedCategory('');
                }}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500"
              >
                <option value="">ທັງໝົດ</option>
                {groupMainList.map(g => <option key={g.code} value={g.code}>{g.code} - {g.name_1}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Group Sub Select */}
            <div className="relative group">
              <label htmlFor="group-sub-select" className="block text-sm font-semibold text-blue-800 mb-2">ກຸ່ມຍ່ອຍ (PH2)</label>
              <select
                id="group-sub-select"
                value={selectedGroupSub}
                onChange={e => {
                  setSelectedGroupSub(e.target.value);
                  setSelectedGroupSub1(''); // Reset lower levels
                  setSelectedCategory('');
                }}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={groupSubList.length === 0 && selectedGroupMain !== ''}
              >
                <option value="">ທັງໝົດ</option>
                {groupSubList.map(g => (
                  <option key={g.code} value={g.code}>
                    {g.code} - {g.name_1}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Group Sub 1 Select */}
            <div className="relative group">
              <label htmlFor="group-sub1-select" className="block text-sm font-semibold text-blue-800 mb-2">ກຸ່ມຍ່ອຍ 1 (PH3)</label>
              <select
                id="group-sub1-select"
                value={selectedGroupSub1}
                onChange={e => {
                  setSelectedGroupSub1(e.target.value);
                  setSelectedCategory(''); // Reset lower levels
                }}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={groupSub1List.length === 0 && selectedGroupSub !== ''}
              >
                <option value="">ທັງໝົດ</option>
                {groupSub1List.map(g => (
                  <option key={g.code} value={g.code}>
                    {g.code} - {g.name_1}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Category Select */}
            <div className="relative group">
              <label htmlFor="category-select" className="block text-sm font-semibold text-blue-800 mb-2">ໝວດ (PH4)</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={categoryList.length === 0 && selectedGroupSub1 !== ''}
              >
                <option value="">ທັງໝົດ</option>
                {categoryList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* BCG Select */}
            <div className="relative group">
              <label htmlFor="bcg-select" className="block text-sm font-semibold text-blue-800 mb-2">BCG</label>
              <select
                id="bcg-select"
                value={selectedBcg}
                onChange={e => setSelectedBcg(e.target.value)}
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 appearance-none transition duration-200 ease-in-out group-hover:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={bcgList.length === 0}
              >
                <option value="">ທັງໝົດ</option>
                {bcgList.map(bcg => (
                  <option key={bcg} value={bcg}>{bcg}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-700 top-7">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative group col-span-full md:col-span-2 lg:col-span-3 xl:col-span-1">
              <label htmlFor="search-input" className="block text-sm font-semibold text-blue-800 mb-2">ຄົ້ນຫາ ຫຍີ່ຫໍ້</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ຄົ້ນຫາ ຫຍີ່ຫໍ້..."
                className="w-full px-5 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ease-in-out group-hover:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* RMS Table */}
          <section className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200 transform transition-transform duration-300 hover:scale-[1.005]">
            <h4 className="font-bold text-blue-700 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-4xl text-green-500">📈</span> Relative Market Share (RMS) - PH: {currentPHDisplay}
              </div>
              <button
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm shadow-sm"
                onClick={() => handleClearDivider('rms')}
              >
                ລ້າງຕົວຫານ
              </button>
            </h4>

            <DataTable
              headers={[
                { key: 'item_brand', label: 'Brand' },
                { key: 'revernue', label: 'Revenue' },
                { key: 'market_share', label: 'Market Share (%)' },
                { key: 'rms', label: 'RMS' },
                { key: 'rms_mark', label: 'RMS Mark' },
                { key: 'diver', label: 'RMS ຕົວຫານ' },
              ]}
              data={paginatedData}
              loading={loading}
              error={error}
              sortKey={sortKey}
              sortAsc={sortAsc}
              onSort={handleSort}
              renderRow={(r, i) => (
                <tr key={i} className="even:bg-blue-50 odd:bg-white hover:bg-blue-100 transition-colors duration-150">
                  <td className="px-3 py-2 font-medium text-blue-900 whitespace-nowrap">{r.item_brand}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.revenue)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.market_share)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.rms)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.rms_maker === 'ຫຼາຍ' ? 'bg-green-100 text-green-800' :
                        r.rms_maker === 'ນ້ອຍ' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {r.rms_maker}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {r.rms_brand_devider === '' ? (
                      <button
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold"
                        onClick={() => handleSetDivider(r, 'rms')}
                        disabled={dividerLoading}
                      >
                        {dividerLoading ? 'ກຳລັງຕັ້ງ...' : 'ຕັ້ງເປັນຕົວຫານ'}
                      </button>
                    ) : (
                      r.rms_brand_devider
                    )}
                  </td>
                </tr>
              )}
            />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </section>

          {/* RGM Table */}
          <section className="bg-white rounded-2xl shadow-xl p-6 border border-blue-200 transform transition-transform duration-300 hover:scale-[1.005]">
            <h4 className="font-bold text-blue-700 mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3 text-4xl text-purple-500">💰</span> Relative Gross in Margin (RGM) - PH: {currentPHDisplay}
              </div>
              <button
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm shadow-sm"
                onClick={() => handleClearDivider('rgm')}
              >
                ລ້າງຕົວຫານ
              </button>
            </h4>

            <DataTable
              headers={[
                { key: 'item_brand', label: 'Brand' },
                { key: 'revernue', label: 'Revenue' },
                { key: 'cost', label: 'Cost' },
                { key: 'gm_amount', label: 'AmountGM ' },
                { key: 'gm_percent', label: ' %GM' },
                { key: 'rgm', label: 'RGM' },
                { key: 'rgm_mark', label: 'RGM Mark', },
                { key: 'diver', label: 'ຕົວຫານ', },
              ]}
              data={paginatedData}
              loading={loading}
              error={error}
              sortKey={sortKey}
              sortAsc={sortAsc}
              onSort={handleSort}
              renderRow={(r, i) => (
                <tr key={i} className="even:bg-blue-50 odd:bg-white hover:bg-blue-100 transition-colors duration-150">
                  <td className="px-3 py-2 font-medium text-blue-900 whitespace-nowrap">{r.item_brand}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.revernue)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.cost)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.gm_amount)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.gm_percent)}</td>
                  <td className="px-3 py-2 text-right">{formatNumber(r.rgm)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.rgm_maker === 'ຫຼາຍ' ? 'bg-green-100 text-green-800' :
                        r.rgm_maker === 'ນ້ອຍ' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {r.rgm_maker}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {r.rgm_brand_devider === '' ? (
                      <button
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold"
                        onClick={() => handleSetDivider(r, 'rgm')}
                        disabled={dividerLoading}
                      >
                        {dividerLoading ? 'ກຳລັງຕັ້ງ...' : 'ຕັ້ງເປັນຕົວຫານ'}
                      </button>
                    ) : (
                      r.rgm_brand_devider
                    )}
                  </td>
                </tr>
              )}
            />
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </section>
        </div>

        {/* BCG Table (Full Classification) */}
        <section className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-blue-200 transform transition-transform duration-300 hover:scale-[1.005]">
          <h4 className="font-bold text-blue-700 mb-6 flex items-center">
            <span className="mr-3 text-4xl text-orange-500">🌟</span> BCG Matrix Classification
          </h4>
          <DataTable
            headers={[
              { key: 'item_brand', label: 'Brand' },
              { key: 'revernue', label: 'Revenue' },
              { key: 'cost', label: 'Cost' },
              { key: 'gm_amount', label: 'GM Amount' },
              { key: 'gm_percent', label: 'GM %' },
              { key: 'rms_mark', label: 'RMS Mark' },
              { key: 'rgm_mark', label: 'RGM Mark' },
              { key: 'bcg', label: 'BCG' },
            ]}
            data={paginatedData}
            loading={loading}
            error={error}
            sortKey={sortKey}
            sortAsc={sortAsc}
            onSort={handleSort}
            renderRow={(r, i) => (
              <tr key={i} className="even:bg-blue-50 odd:bg-white hover:bg-blue-100 transition-colors duration-150">
                <td className="px-3 py-2 font-medium text-blue-900 whitespace-nowrap">{r.item_brand}</td>
                <td className="px-3 py-2 text-right">{formatNumber(r.revernue)}</td>
                <td className="px-3 py-2 text-right">{formatNumber(r.cost)}</td>
                <td className="px-3 py-2 text-right">{formatNumber(r.gm_amount)}</td>
                <td className="px-3 py-2 text-right">{formatNumber(r.gm_percent)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    r.rms_maker === 'ຫຼາຍ' ? 'bg-green-100 text-green-800' :
                      r.rms_maker === 'ນ້ອຍ' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {r.rms_maker}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    r.rgm_maker === 'ຫຼາຍ' ? 'bg-green-100 text-green-800' :
                      r.rgm_maker === 'ນ້ອຍ' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {r.rgm_maker}
                  </span>
                </td>
                <td className="px-3 py-2 font-bold uppercase text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    r.bcg === 'Stars' ? 'bg-purple-100 text-purple-800' :
                      r.bcg === 'Cash Cows' ? 'bg-teal-100 text-teal-800' :
                        r.bcg === 'Question Marks' ? 'bg-yellow-100 text-yellow-800' :
                          r.bcg === 'Dogs' ? 'bg-rose-100 text-rose-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {r.bcg}
                  </span>
                </td>
              </tr>
            )}
          />
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </section>
      </div>
    </>
  );
}