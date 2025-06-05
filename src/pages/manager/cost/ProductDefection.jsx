import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';

export default function ProductDefection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch and group data
  useEffect(() => {
    api.get('/cost/item-cost-status')
      .then(res => {
        const raw = res.data;
        const grouped = raw.reduce((acc, curr) => {
          if (!acc[curr.item_code]) {
            acc[curr.item_code] = {
              item_name: curr.item_name,
              rows: []
            };
          }
          acc[curr.item_code].rows.push(curr);
          return acc;
        }, {});

        const result = Object.entries(grouped).map(([item_code, data]) => ({
          item_code,
          item_name: data.item_name,
          rows: data.rows
        }));

        setProducts(result);
        setFilteredProducts(result);
      })
      .catch(err => console.error('Failed to fetch product defection data:', err));
  }, []);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      item =>
        item.item_code.toLowerCase().includes(term) ||
        item.item_name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // reset page when searching
  }, [searchTerm, products]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4 className="text-danger fw-bold mb-3">🛑 Product Cost Defection Report</h4>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by item code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {currentItems.map((group, index) => (
          <div className="card mb-4" key={index}>
            <div className="card-header bg-danger text-white">
              <strong>{group.item_code}</strong> - {group.item_name}
            </div>
            <div className="card-body p-0">
              <table className="table table-bordered table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cost Status</th>
                    <th className="text-end">Total Sale Amount</th>
                    <th className="text-end">Total Cost (VTE)</th>
                    <th className="text-end">Total Cost (Pakse)</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((item, i) => (
                    <tr key={i}>
                      <td>{item.cost_status}</td>
                      <td className="text-end">{Number(item.total_sale_amount).toLocaleString()}</td>
                      <td className="text-end">{Number(item.total_cost_vte).toLocaleString()}</td>
                      <td className="text-end">{Number(item.total_cost_pakse).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div>
            <button
              className="btn btn-outline-danger btn-sm me-2"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
