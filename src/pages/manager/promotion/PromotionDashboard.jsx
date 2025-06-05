import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function PromotionDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [productRedeem, setProductRedeem] = useState([]);

  // Promotion pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Product redeem pagination
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const productPageSize = 5;

  // Sorting config
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    api.get('/promotion/total')
      .then(res => {
        setSummary(res.data.total[0]);
        setPromotions(res.data.total_by_pro);
        setProductRedeem(res.data.product_redeem);
      })
      .catch(err => console.error('❌ Error loading dashboard data:', err));
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const sortedPromotions = React.useMemo(() => {
    const sorted = [...promotions];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return sorted;
  }, [promotions, sortConfig]);

  // Promotion paginated
  const paginatedData = sortedPromotions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(promotions.length / pageSize);

  // Product redeem paginated
  const productPaginatedData = productRedeem.slice(
    (productCurrentPage - 1) * productPageSize,
    productCurrentPage * productPageSize
  );
  const productTotalPages = Math.ceil(productRedeem.length / productPageSize);

  return (
    <div className="container mt-4">
      <h4 className="fw-bold text-primary mb-4">📊 ສະຫຼຸບໂປໂມຊັ່ນ 2025</h4>

      {/* Summary Cards */}
      {summary && (
        <div className="row g-4 mb-4">
          <StatCard title="ໂປທັງໝົດ" value={summary.total_promotions_2025} color="info" />
          <StatCard title="ສິ້ນສຸດແລ້ວ" value={summary.completed_promotions} color="danger" />
          <StatCard title="ກຳລັງດຳເນີນ" value={summary.active_promotions} color="success" />
          <StatCard title="ລູກຄ້າທີ່ຮ່ວມ" value={summary.total_participating_customers} color="warning" />
          <StatCard title="ລູກຄ້າແລກຂອງ" value={summary.total_redeem_customers} color="primary" />
          <StatCard title="ຂອງລາງວັນທີ່ແລກ" value={summary.total_redeem_lucky} color="secondary" />
        </div>
      )}

      {/* Promotion Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th onClick={() => handleSort('pro_code')} style={{ cursor: 'pointer' }}>ລະຫັດ</th>
              <th onClick={() => handleSort('pro_name')} style={{ cursor: 'pointer' }}>ຊື່ໂປໂມຊັ່ນ</th>
              <th onClick={() => handleSort('from_date')} style={{ cursor: 'pointer' }}>ວັນເລີ່ມ</th>
              <th onClick={() => handleSort('to_date')} style={{ cursor: 'pointer' }}>ວັນສິ້ນສຸດ</th>
              <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>ສະຖານະ</th>
              <th>ຄະແນນ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((pro, index) => (
              <tr key={index}>
                <td className="text-center">{pro.pro_code}</td>
                <td>{pro.pro_name}</td>
                <td className="text-center">{new Date(pro.from_date).toLocaleDateString()}</td>
                <td className="text-center">{new Date(pro.to_date).toLocaleDateString()}</td>
                <td className={`text-center ${pro.status === 'ສິ້ນສຸດແລ້ວ' ? 'text-danger' : 'text-success'}`}>
                  {pro.status}
                </td>
                <td className="text-end">
                  ສະສົມ: {parseFloat(pro.get_point).toFixed(2)}<br />
                  ແລກຂອງ: {parseFloat(pro.redeem).toFixed(2)}<br />
                  ຍັງເຫຼືອ: {parseFloat(pro.bl_point).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Promotion Pagination */}
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Product Redeem Table */}
      <h5 className="fw-bold mt-4 mb-3 text-secondary">🎁 ລາຍການຂອງທີ່ແລກຫຼາຍສຸດ</h5>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>ລະຫັດ</th>
              <th>ຊື່ສິນຄ້າ</th>
              <th>ຈຳນວນ</th>
              <th>ຄະແນນທັງໝົດ</th>
              <th>ຄະແນນ/ໜ່ວຍ</th>
              <th>ຫົວໜ່ວຍ</th>
            </tr>
          </thead>
          <tbody>
            {productPaginatedData.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item.item_code}</td>
                <td>{item.name_1}</td>
                <td className="text-end">{item.qty}</td>
                <td className="text-end">{item.redeem_point}</td>
                <td className="text-end">{item.point_avg}</td>
                <td className="text-center">{item.unit_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Redeem Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {Array.from({ length: productTotalPages }, (_, i) => (
              <li key={i} className={`page-item ${i + 1 === productCurrentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setProductCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="col-md-4">
      <div className={`card border-${color} shadow-sm`}>
        <div className={`card-body text-${color} text-center`}>
          <h6 className="card-title fw-bold">{title}</h6>
          <h2 className="fw-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}
