import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../../services/api';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {CalendarOutlined, InboxOutlined, LineChartOutlined} from "@ant-design/icons";
import {Col, Row} from "react-bootstrap";
import {Select, Space, Spin} from "antd";

const { Option } = Select;

const formatNumber = (value) =>
  Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

const ComparisonCard = ({ title, data, icon, color, barColor }) => {
  const target = Number(data.target || 0);
  const revenue = Number(data.revenue || 0);
  const lastYear = Number(data.last_year || 0);
  const toPercent = (value) => (target > 0 ? (value / target) * 100 : 0);
  const percentRevenue = toPercent(revenue);
  const percentLastYear = lastYear > 0 ? (revenue / lastYear) * 100 : 0;
  return (
      <div className="bg-white shadow-sm border-0 p-3 rounded-2xl mb-3 h-full flex flex-col justify-center items-center">
      <h6 className="font-bold text-center" style={{ color }}>{title}</h6>
        <div className="flex justify-center items-center w-[160px] h-[160px]">
        <CircularProgressbarWithChildren
          value={percentRevenue}
          styles={buildStyles({
            pathColor: color,
            trailColor: "#e0e0e0",
            strokeLinecap: "round",
            pathTransitionDuration: 1.5,
          })}
        >
          <div style={{ fontSize: 20, color, marginBottom: 4 }}>{icon}</div>
          <div style={{ fontSize: 30, fontWeight: 'bold' }}>{percentRevenue.toFixed(1)}%</div>
        </CircularProgressbarWithChildren>
      </div>
        <div className="w-full mt-2 text-sm">
        <div className="flex justify-between mt-1">
          <span>🎯 ເປົ້າໝາຍ</span>
          <span className="fw-bold text-warning">{formatNumber(target)}</span>
        </div>
        <div className="w-full h-2 bg-gray-200" >
          <div className="h-full w-full bg-amber-400" ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span>📆 ຍອດຂາຍ</span>
          <span className="font-bold text-blue-500">{formatNumber(revenue)} </span>
        </div>
        <div className="w-full h-2 bg-gray-200" >
          <div
              className="h-full bg-blue-600"
              style={{ width: `${percentLastYear}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span>📅 ປີຜ່ານມາ</span>
          <span className="font-bold text-red-600">{formatNumber(lastYear)}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 ">
          <div
              className="h-full bg-red-600"
              style={{ width: `${percentLastYear}%` }}
          ></div>
        </div>

        <div className='pt-1 flex justify-between items-center'>
          <label className='text-green-600 text-sm ' >ປຽບທຽບເປົ້າຂາຍ : ({percentRevenue.toFixed(1)}%)</label>
          <label className='text-red-600 text-sm'>ປຽບທຽບປີທີ່ຜ່ານມາ : {percentLastYear.toFixed(1)}%</label>
        </div>

      </div>
    </div>
  );
};

function LayersOutlined() {
  return null;
}

export default function SalesComparisonProgressAll() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_month: {},
    total_avg: {},
    total_year: {},
    lastMonth: {}
  });
  const [bu, setBu] = useState('all');
  const [buList, setBuList] = useState([]);

  const fetchData = () => {
    setLoading(true);
    api.get(`/all/saletotal${bu !== 'all' ? `?bu=${bu}` : ''}`)
        .then(res => {
          setData({
            total_month: res.data.total_month || {},
            total_avg: res.data.total_avg || {},
            total_year: res.data.total_year || {},
            lastMonth: res.data.lastMonth || {},
          });
        })
        .catch(err => console.error('❌ Error loading data:', err))
        .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/all/bu-list')
        .then(res => setBuList(res.data || []))
        .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchData();
  }, [bu]);

  const cardData = [
    {
      title: '📅 ເດືອນນີ້',
      data: data.total_month,
      icon: <CalendarOutlined />,
      color: '#52c41a'
    },
    {
      title: '📦 ເດືອນກ່ອນ',
      data: data.lastMonth,
      icon: <InboxOutlined />,
      color: '#fa8c16'
    },
    {
      title: '📚 ສະສົມ',
      data: data.total_avg,
      icon: <LayersOutlined />,
      color: '#722ed1'
    },
    {
      title: '📈 ທັງປີ',
      data: data.total_year,
      icon: <LineChartOutlined />,
      color: '#f5222d'
    }
  ];

  return (
      <div className="p-6 bg-gray-100 w-full font-[ui-sans-serif]">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 shadow-xl">
          <div className={"text-center text-white"}>
              <h1>ພາບລວມບໍລິສັດ</h1>
          </div>
          <Row justify="center" align="middle">
            <Col>
              <Space direction="vertical" align="center" size="middle">
                <h2 className="text-white text-2xl font-semibold text-center m-0">
                  📊 Sales Comparison Dashboard
                </h2>
                <Select
                    value={bu}
                    onChange={setBu}
                    className="min-w-[280px]"
                    size="large"
                    placeholder="Select Business Unit"
                >
                  <Option value="all">
                    <Space>
                      🏢 <span>ລວມບໍລິສັດທັງໝົດ</span>
                    </Space>
                  </Option>
                  {buList.map(item => (
                      <Option key={item.code} value={item.code}>
                        <Space>
                          🏭 <span>{item.name_1}</span>
                        </Space>
                      </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Cards Section */}
        <Spin spinning={loading} size="large" tip="Loading sales data...">
          <div className={"grid grid-cols-2 justify-between gap-4 lg:grid-cols-4"}>
            {cardData.map((card, index) => (
                <div >
                  <ComparisonCard
                      title={card.title}
                      data={card.data}
                      icon={card.icon}
                      color={card.color}

                  />
                </div>
            ))}
          </div>
        </Spin>
      </div>
  );
  }