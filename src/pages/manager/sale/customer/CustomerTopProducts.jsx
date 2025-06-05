import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
import { Spinner } from 'react-bootstrap';
import { FaBox, FaChartBar, FaMoneyBillAlt, FaShoppingCart } from 'react-icons/fa';

export default function CustomerTopProducts({ bu }) {
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [areaName, setAreaName] = useState('');
  const [province, setProvince] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  useEffect(() => {
    api.get('/bu/sale-areas')
      .then((res) => setAreas(res.data))
      .catch((err) => console.error('Failed to load areas:', err));
  }, []);

  useEffect(() => {
    console.log('Selected Area ID:', selectedAreaId);
    console.log('Selected Area Name:', areaName);
    if (selectedAreaId) {
      api.get(`/bu/provinces_area?area_id=${selectedAreaId}`)
        .then((res) => setProvinces(res.data))
        .catch((err) => console.error('Failed to load provinces:', err));
      fetchData();
    } else {
      setProvinces([]);
      setProvince('');
    }
  }, [selectedAreaId]);

  useEffect(() => {
    if (areaName && bu) {
      fetchData();
    }
  }, [areaName, page, province]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bu/customer-top-products', {
        params: {
          bu_code: bu,
          area_name: areaName,
          province,
          page,
          limit,
        },
      });

      setData(res.data.data);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="mb-4 fw-bold text-danger">📊 ລາຍງານລູກຄ້າ</h4>

      <div className="row g-2 mb-4">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedAreaId}
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedAreaId(selectedId);

              // ✅ Find selected area by matching string IDs
              const selected = areas.find((a) => a.code.toString() === selectedId);

              // ✅ Store area name
              setAreaName(selected?.name_1 || '');

              // Reset province + page
              setProvince('');
              setPage(1);
            }}
          >
            <option value="">-- ເລືອກເຂດ --</option>
            {areas.map((area) => (
              <option key={area.code} value={area.code}>
                {area.name_1}
              </option>
            ))}
          </select>
        </div>


        <div className="col-md-3">
          <select
            className="form-select"
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setPage(1);
            }}
            disabled={!provinces.length}
          >
            <option value="">-- ເລືອກແຂວງ --</option>
            {provinces.map((prov, i) => (
              <option key={i} value={prov.code}>
                {prov.name_1}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <input className="form-control" value={bu} disabled />
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : data.length === 0 ? (
        <div className="alert alert-warning text-center">ບໍ່ພົບຂໍ້ມູນ</div>
      ) : (
        data.map((cust, index) => (
          <div key={index} className="card mb-2 border-0 shadow rounded-4 overflow-hidden">
            <div className="p-3 text-white" style={{ background: 'linear-gradient(to right, #e53935, #fbc02d)' }}>
              <h5 className="mb-0">
                <FaShoppingCart /> {cust.cust_name} ({cust.customer_code})
              </h5>
              <small>📍 {cust.area_name}, {cust.province_name} | 🗓 ຊື້ຫຼ້າສຸດ: {cust.last_buy}</small>
            </div>

            <div className="card-body bg-white">
              <h6 className="fw-bold text-warning">
                <FaMoneyBillAlt className="me-1" /> ຍອດລວມ: <span className="text-dark">{cust.total_amount.toLocaleString()} ₭</span>
              </h6>
              <div className="row mt-3">
                <div className="col-md-6 mb-3">
                  <h6 className="text-danger fw-bold mb-3 border-bottom pb-1">
                    <FaChartBar className="me-2" /> Top 10 ມູນຄ່າສິນຄ້າ
                  </h6>
                  {cust.top10product_amount?.map((item, i) => {
                    const percent = (item.total_amount / cust.total_amount) * 100;
                    return (
                      <div key={i} className="bg-light p-2 rounded-3 shadow-sm mb-2">
                        <div className="d-flex justify-content-between">
                          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            <FaBox className="me-2 text-danger" />
                            {item.item_name}
                          </span>
                          <span className="text-danger" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            {item.total_amount.toLocaleString()} B
                          </span>
                        </div>
                        <div className="progress mt-1" style={{ height: '14px' }}>
                          <div className="progress-bar bg-danger" style={{ width: `${percent.toFixed(1)}%` }}>
                            {percent.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-1">
                    <FaBox className="me-2" /> Top 10 ຈຳນວນສິນຄ້າ
                  </h6>
                  {cust.top10product_qty?.map((item, i) => {
                    const maxQty = Math.max(...cust.top10product_qty.map(p => p.qty));
                    const percent = (item.qty / maxQty) * 100;
                    return (
                      <div key={i} className="bg-light p-2 rounded-3 shadow-sm mb-2">
                        <div className="d-flex justify-content-between">
                          <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            <FaBox className="me-2 text-primary" />
                            {item.item_name}
                          </span>
                          <span className="text-primary" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                            {item.qty}
                          </span>
                        </div>
                        <div className="progress mt-1" style={{ height: '14px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${percent.toFixed(1)}%` }}>
                            {percent.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="d-flex justify-content-between my-4">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ⬅ ກ່ອນໜ້າ
        </button>
        <span className="fw-bold">Page {page}</span>
        <button className="btn btn-outline-secondary" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
          ຖັດໄປ ➡
        </button>
      </div>
    </div>
  );
}
