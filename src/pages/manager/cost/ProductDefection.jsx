import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';
import NavbarPM from '../../../components/NavbarPM';
export default function ProductDefection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
const roles = localStorage.getItem('role'); // Get user role from localStorage
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
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}
      <div className="container mx-auto mt-4">
        <h4 className="text-red-600 font-bold mb-3">🛑 Product Cost Defection Report</h4>

        <div className="mb-3">
          <input
            type="text"
            className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="🔍 Search by item code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {currentItems.map((group, index) => (
          <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-200" key={index}>
            <div className="bg-red-600 text-white px-4 py-2 border-b border-gray-200">
              <strong>{group.item_code}</strong> - {group.item_name}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-2 border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 border-2 border-gray-300">Cost Status</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border-2 border-gray-300">Total Sale Amount</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border-2 border-gray-300">Total Cost (VTE)</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border-2 border-gray-300">Total Cost (Pakse)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {group.rows.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 border-2 border-gray-300">{item.cost_status}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right border-2 border-gray-300">{Number(item.total_sale_amount).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right border-2 border-gray-300">{Number(item.total_cost_vte).toLocaleString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right border-2 border-gray-300">{Number(item.total_cost_pakse).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <button
              className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
            <button
              className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
