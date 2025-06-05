import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
const monthMap = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar',
  '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep',
  '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

const format = (val) => parseFloat(val).toLocaleString() + ' ฿';

export default function SummaryCardsNewCustomer() {
  const [monthly, setMonthly] = useState([]);
  const [quarterly, setQuarterly] = useState([]);
  const [total, setTotal] = useState({ count_cust_code: 0, total: 0 });

  useEffect(() => {
    api.get('/all/newcustomer') // 🔁 Replace with real endpoint
      .then(res => {
        const monthData = res.data.bymonth.map(item => ({
          month: monthMap[item.month_part],
          count: item.count_customer,
          purchase: parseFloat(item.total_amount),
        }));

        const quarterData = res.data.byq.map(item => ({
          quarter: item.quarter,
          count: item.count_customer,
          purchase: parseFloat(item.total_amount),
        }));

        setMonthly(monthData);
        setQuarterly(quarterData);
        setTotal({
          count_cust_code: res.data.total.count_cust_code,
          total: parseFloat(res.data.total.total),
        });
      });
  }, []);

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'short' });

  return (
    <div className=" py-4">
      <div className="row g-4">

        {/* Monthly */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white " style={{fontSize: '15px', fontWeight: 'bold' }}>
              📅 ລູກຄ້າໃໝ່ລາຍເດືອນ
            </div>
            <div className="card-body p-3">
              <div className="row row-cols-2 row-cols-md-4 g-3">
                {monthly.map((item, idx) => {
                  const isCurrent = item.month === currentMonth;
                  return (
                    <div className="col" key={idx}>
                      <div className={`rounded p-2 text-center ${isCurrent ? 'bg-warning' : 'border'}`}>
                        <h6 className="mb-1" style={{fontSize:'10px'}}>{item.month}</h6>
                        <div className="fw-bold " style={{fontSize:'10px'}}>{item.count} ລາຍ</div>
                        <div className="text-muted small" style={{fontSize:'10px'}}>🛒 {format(item.purchase)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quarterly */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white"  style={{fontSize: '15px', fontWeight: 'bold'}}>
              📊 ລູກຄ້າໃໝ່ລາຍໄຕມາດ
            </div>
            <div className="card-body d-flex justify-content-around text-center">
              {quarterly.map((q, idx) => (
                <div key={idx} className="p-2">
                  <h6 className="fw-bold"  style={{fontSize:'10px'}}>{q.quarter}</h6>
                  <div className=" text-success fw-bold"  style={{fontSize:'10px'}}>{q.count} ລາຍ</div>
                  <div className="text-muted small"  style={{fontSize:'10px'}}>🛒 {format(q.purchase)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="col-12 col-md-6 mx-auto">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-header bg-success text-white"  style={{fontSize: '15px', fontWeight: 'bold'}}>
              🧑‍💼 ລູກຄ້າໃໝ່ລວມປະຈຳປີ
            </div>
            <div className="card-body">
              <div className="fw-bold text-success"  style={{fontSize:'10px'}}>{total.count_cust_code} ລາຍ</div>
              <div className="text-muted"  style={{fontSize:'10px'}}>🛒 {format(total.total)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
