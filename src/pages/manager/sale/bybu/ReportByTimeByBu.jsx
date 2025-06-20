import { Tabs } from 'antd';
import HourlySalesChartByBu from './component/OpenHours';
import WeeklySalesByDayChartByBu from './component/OpenWeelyDay';
import WeeklySalesChartByBu from './component/OpenWeeklySaleChart';
import TopMonthSaleChartByBu from './component/TopMonthSale';
const SalesChartTabsByBu = ({ year, bu }) => {
    const items = [
        {
            key: '1',
            label: 'ເປິດບີນຕາມຊົ່ວໂມງ',
            children: <HourlySalesChartByBu bu={bu} />,
        },
        {
            key: '2',
            label: 'ເປິດບີນຕາມວັນ',
            children: <WeeklySalesByDayChartByBu year={year} />,
        },
        {
            key: '3',
            label: 'ເປິດບີນຕາມອາທິດ',
            children: <WeeklySalesChartByBu bu={bu} />,
        },
        {
            key: '4',
            label: '🏆 ເປິດບີນຕາມເດືອນ',
            children: <TopMonthSaleChartByBu year={year} bu={bu} />,
        },
    ];


    return (
        <div className="bg-white p-[2px] text-black shadow-sm">
            <h4 className="font-bold text-[16px]  p-4 font-[Noto_Sans_Lao]">
                📊 ລາຍງານຍອດຂາຍຕາມເວລາ
            </h4>
            <div className='px-4'>
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default SalesChartTabsByBu;
