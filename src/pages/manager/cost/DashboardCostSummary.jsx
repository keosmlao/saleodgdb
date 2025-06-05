import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function DashboardCostSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cost/countcost')
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!summary) return <div className="text-center mt-5 text-danger">No data available.</div>;

  const { total, bygroupmain } = summary;
  const totalItems = Number(total[0].total_items);
  const zeroCostItems = Number(total[0].zero_cost_items);
  const percentZero = ((zeroCostItems / totalItems) * 100).toFixed(1);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-danger fw-bold">📊 ສະຖິຕິສິນຄ້າທີ່ຂາຍໃນປິ 2025 ບໍ່ມີຕົ້ນທຶນ</h4>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-primary shadow">
            <div className="card-body text-center">
              <h6 className="fw-bold text-primary">ລວມຈຳນວນສິນຄ້າ</h6>
              <h3>{totalItems.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-danger shadow">
            <div className="card-body text-center">
              <h6 className="fw-bold text-danger">ສິນຄ້າທີ່ຕົ້ນທຶນ = 0</h6>
              <h3>{zeroCostItems.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning shadow">
            <div className="card-body text-center">
              <h6 className="fw-bold text-warning">% ບໍ່ມີຕົ້ນທຶນ</h6>
              <h3>{percentZero}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Group Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead >
            <tr>
              <th style={{ backgroundColor: '#2D70F4', color: 'white' }}>🧾 ກຸ່ມຫຼັກ</th>
              <th className="text-center" style={{ backgroundColor: '#2D70F4', color: 'white' }}>ລວມສິນຄ້າ</th>
              <th className="text-center" style={{ backgroundColor: '#2D70F4', color: 'white' }}>ສິນຄ້າຕົ້ນທຶນ = 0</th>
              <th className="text-center" style={{ backgroundColor: '#2D70F4', color: 'white' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {bygroupmain.map((g, i) => {
              const total = Number(g.total_items);
              const zero = Number(g.zero_cost_items);
              const percent = ((zero / total) * 100).toFixed(1);

              return (
                <tr key={i}>
                  <td>{g.itemmaingroup}</td>
                  <td className="text-end">{total.toLocaleString()}</td>
                  <td className="text-end">{zero.toLocaleString()}</td>
                  <td>
                    <div className="progress" style={{ height: '20px' }}>
                      <div
                        className={`progress-bar ${percent > 50 ? 'bg-danger' : 'bg-warning'}`}
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                      >
                        {percent}%
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
