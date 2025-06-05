import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function GmDashboard() {
  const [data, setData] = useState({
    total: { sale: 0, cost: 0, gm: 0, allsale: 0, sale_no_cost: 0 },
    bygroupmain: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cost/summarygm')
      .then(res => {
        const raw = res.data;
        const formatted = {
          total: {
            sale: Number(raw?.total?.[0]?.total_sale_with_cost || 0),
            cost: Number(raw?.total?.[0]?.total_cost || 0),
            gm: Number(raw?.total?.[0]?.total_gm_with_cost || 0),
            allsale: Number(raw?.total?.[0]?.total_sale_all || 0),
            sale_no_cost: Number(raw?.total?.[0]?.sale_no_cost || 0)
          },
          bygroupmain: (raw.bygroup || []).map(item => ({
            ...item,
            total_sale_all: Number(item.total_sale_all || 0),
            total_sale_with_cost: Number(item.total_sale_with_cost || 0),
            total_cost: Number(item.total_cost || 0),
            total_gm_with_cost: Number(item.total_gm_with_cost || 0),
            sale_no_cost: Number(item.sale_no_cost || 0),
          }))
        };
        setData(formatted);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const gmPercent = data.total.sale > 0
    ? ((data.total.gm / data.total.sale) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="container mt-4">
      <h4 className="text-primary fw-bold mb-4">📊 ສະຫຼຸບລາຍການຂາຍລວມ</h4>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card text-bg-dark h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">ຍອດຂາຍທັງໝົດ</h6>
                  <h5 className="fw-bold text-warning">{data.total.allsale.toLocaleString()} B</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">ຍອດຂາຍທີ່ບໍ່ມີຕົ້ນທຶນ</h6>
                  <h5 className="fw-bold text-info">{data.total.sale_no_cost.toLocaleString()} B</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-secondary h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">% ກຳໄລຂັ້ນຕົ້ນ-ສະເພາະສິນຄ້າມີຕົ້ນທຶນ (GM%)</h6>
                  <h5 className="fw-bold text-secondary">{gmPercent} %</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-primary h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">ຍອດຂາຍທີ່ມີຕົ້ນທຶນ</h6>
                  <h5 className="fw-bold text-primary">{data.total.sale.toLocaleString()} B</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-danger h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">ຕົ້ນທຶນ(ສະເພາະສິນຄ້າມີຕົ້ນທຶນ)</h6>
                  <h5 className="fw-bold text-danger">{data.total.cost.toLocaleString()} B</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success h-100 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title">ກຳໄລຂັ້ນຕົ້ນ (GM)</h6>
                  <h5 className="fw-bold text-success">{data.total.gm.toLocaleString()} B</h5>
                </div>
              </div>
            </div>
          </div>

          {/* GM Table by Product Group */}
          <div className="mt-5">
            <h5 className="text-center fw-bold text-primary mb-4">📋 ຕາຕະລາງກຳໄລຕາມກຸ່ມສິນຄ້າ(ສະເພາະທີ່ມີຕົ້ນທຶນ)</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>ກຸ່ມສິນຄ້າ</th>
                    <th>ຍອດຂາຍທັງໝົດ</th>
                    <th>ຕົ້ນທຶນ</th>
                    <th>ກຳໄລ (GM)</th>
                    <th>% GM</th>
                    <th>Indicator</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bygroupmain.map((item, idx) => {
                    const sale = item.total_sale_with_cost;
                    const gm = item.total_gm_with_cost;
                    const gmPercent = sale > 0 ? ((gm / sale) * 100).toFixed(2) : 0;

                    let progressClass = "bg-success";
                    if (gmPercent < 10) progressClass = "bg-danger";
                    else if (gmPercent < 25) progressClass = "bg-warning";

                    return (
                      <tr key={idx}>
                        <td className="text-start">{item.itemmaingroup}</td>
                        <td>{item.total_sale_with_cost.toLocaleString()}</td>
                        <td>{item.total_cost.toLocaleString()}</td>
                        <td>{gm.toLocaleString()}</td>
                        <td>{gmPercent} %</td>
                        <td>
                          <div className="progress" style={{ height: '20px' }}>
                            <div
                              className={`progress-bar ${progressClass}`}
                              role="progressbar"
                              style={{ width: `${gmPercent}%` }}
                              aria-valuenow={gmPercent}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {gmPercent}%
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
        </>
      )}
    </div>
  );
}
