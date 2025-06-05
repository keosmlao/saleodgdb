import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';
import DashboardCostSummary from './DashboardCostSummary';

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
      <Navbar />
      <DashboardCostSummary />
      <div className="container mt-4">
        <h4 className="mb-3 text-danger fw-bold">ລາຍການຂາຍສິນຄ້າ</h4>

        <div className="row mb-3">
          <div className="col-md-3 mb-2">
            <select className="form-select" value={groupMain} onChange={(e) => {
              setGroupMain(e.target.value);
              setGroupSub('');
              setGroupSub2('');
            }}>
              <option value="">-- Group Main --</option>
              {groupMainOptions.map((g) => (
                <option key={g.code} value={g.name_1}>{g.name_1}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <select className="form-select" value={groupSub} onChange={(e) => {
              setGroupSub(e.target.value);
              setGroupSub2('');
            }}>
              <option value="">-- Group Sub --</option>
              {groupSubOptions.map((g) => (
                <option key={g.code} value={g.name_1}>{g.name_1}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <select className="form-select" value={groupSub2} onChange={(e) => setGroupSub2(e.target.value)}>
              <option value="">-- Group Sub2 --</option>
              {groupSub2Options.map((g) => (
                <option key={g.code} value={g.name_1}>{g.name_1}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-2">
            <input type="text" className="form-control" placeholder="ຄົ້ນຫາ..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-sm">
                <thead className="table-dark">
                  <tr>
                    <th rowSpan="2" className="align-middle text-center">ລະຫັດ</th>

                    <th rowSpan="2" className="align-middle text-center">ຊື່ສິນຄ້າ</th>
                    <th rowSpan="2" className="align-middle text-center">ຈຳນວນ(ຂາຍ)</th>
                    <th rowSpan="2" className="align-middle text-center">ຫົວໜ່ວຍ</th>
                    <th colSpan="2" class="text-center">ຂໍ້ມູນການຂາຍ</th>
                    <th colSpan="3" class="text-center">ມູນຄ່າ</th>
                  </tr>
                  <tr>
                    <th>ຄັ້ງທຳອິດທີ່ຂາຍ</th>
                    <th>ຂາຍລ້າສຸດ</th>
                    <th class="text-center">ຂາຍລວມ</th>
                    <th class="text-center">ຕົ້ນທືນ</th>
                    <th class="text-center">GM</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.item_code}>
                      <td>{item.item_code}</td>
                      <td>{item.item_name}</td>
                      <td className='text-end'>{item.qty}</td>
                      <td>{item.unit_code}</td>
                      <td>{item.first_sale}</td>
                      <td>{item.last_sale}</td>
                      <td className="text-end">{Number(item.sale_amount).toLocaleString()}</td>
                      <td
                        className="text-end"
                        style={{ color: Number(item.total_cost) === 0 ? '#e74c3c' : '#0963a6' }}
                      >
                        {Number(item.total_cost).toLocaleString()}
                      </td>

                      {/* <td className="text-end" >{Number(item.total_cost).toLocaleString()}</td> */}
                      <td className="text-end" style={{ color: item.gm <= 0 ? '#e74c3c' : '#138d75' }}>
                        {Number(item.gm).toLocaleString()}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav>
              <ul className="pagination pagination-sm justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>
                    Previous
                  </button>
                </li>

                {pageRangeStart > 1 && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => setCurrentPage(pageRangeStart - 1)}>«</button>
                  </li>
                )}

                {Array.from({ length: pageRangeEnd - pageRangeStart + 1 }, (_, i) => {
                  const pageNumber = pageRangeStart + i;
                  return (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(pageNumber)}>{pageNumber}</button>
                    </li>
                  );
                })}

                {pageRangeEnd < totalPages && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => setCurrentPage(pageRangeEnd + 1)}>»</button>
                  </li>
                )}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>

          </>
        )}
      </div>
    </>
  );
}
