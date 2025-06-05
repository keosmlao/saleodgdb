import React from 'react';
import { Tabs } from 'antd';
import HourlySalesChart from './SaleTap/SalesByHourComposedChart';
import TopMonthSaleChart from './SaleTap/TopMonthSalesChart';
import WeeklySalesByDay from './SaleTap/WeeklySalesByDay';
import WeeklySalesChart from './SaleTap/WeeklySalesChart';
const SalesChartTabs = ({ year }) => {
  const items = [
    {
      key: '1',
      label: 'ເປິດບີນຕາມຊົ່ວໂມງ',
      children: <HourlySalesChart />,
    },
    {
      key: '2',
      label: 'ເປິດບີນຕາມວັນ',
      children: <WeeklySalesByDay year={year} />,
    },
        {
      key: '3',
      label: 'ເປິດບີນຕາມອາທິດ',
      children: <WeeklySalesChart />,
    },
    {
      key: '4',
      label: '🏆 ເປິດບີນຕາມເດືອນ',
      children: <TopMonthSaleChart year={year} />,
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default SalesChartTabs;
