import { Tabs } from 'antd';
import HourlySalesChanel from './report/HourlySaleChartChanel';
import WeeklySalesChnanel from './report/WeeklySaleByDayChanel';
import WeeklySalesChanel from './report/WeeklySaleByChanel';
import TopMonthSaleChanel from './report/TopMontSaleChanel';
const TabsReportTime = ({ year, bu , department }) => {
    const items = [
        {
            key: '1',
            label: 'ເປິດບີນຕາມຊົ່ວໂມງ',
            children: <HourlySalesChanel bu={bu} />,
        },
        {
            key: '2',
            label: 'ເປິດບີນຕາມວັນ',
            children: <WeeklySalesChnanel year={year} />,
        },
        {
            key: '3',
            label: 'ເປິດບີນຕາມອາທິດ',
            children: <WeeklySalesChanel bu={bu} />,
        },
        {
            key: '4',
            label: '🏆 ເປິດບີນຕາມເດືອນ',
            children: <TopMonthSaleChanel year={year} bu={bu} />,
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

export default TabsReportTime;
