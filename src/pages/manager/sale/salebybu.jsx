import SalesComparisonProgressyearbybu from './bybu/SalesProgress_yearbybu';
import TopCustomerListWithChartbybu from './bybu/selection/TopCustomerListbybu';
import TopSellingProductsbybu from './bybu/TopSellingProductsbybu';
import QuarterlyBarChartBU from './bybu/QuarterlyBarChartBU'
import MonthlySalesChartbybu from './bybu/MonthlySalesChartbybu'
import SaleByreabyBu from './bybu/salebyareabybu'
import TopCusAreabybu from './bybu/TopCusAreabybu'
import TopProductByBu from './bybu/TopProductbybu'
import ProvinceSalesBybu from './bybu/ProvinceSalesBybu'
import SalesMapbyBU from './bybu/SalesMapbyBU'
import AccumulatedByBuBarChart from './bybu/AcumulateByBu';
import TopSellProdcutByBuListWithChart from './bybu/TopSellProductByBu';
import TopCustomerListByBuWithChart from './bybu/TopCustomerListByBuWithChart';
import SalesChartTabsByBu from './bybu/ReportByTimeByBu';
import ChannelSummaryByBu from './bybu/CrossTheChannelByBu';
import TopSalespersonsByBu from './bybu/TopSalePersonByBu';
import TopItemBrandsByBU from './bybu/TopItemBrandByBu';
export default function SaleByBu({ bu }) {

    const buCode = parseInt(bu);

    if (!buCode) return <div className="text-danger p-4">❌ Invalid BU</div>;

    return (
        <>
            <div className="rounded-2xl overflow-hidden shadow-lg  border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4">
                    <h5 className="text-base font-bold tracking-wide font-[Noto_Sans_Lao]">📦 ລາຍງານຍອດຂາຍຕາມ BU: {buCode}</h5>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-blue-500  text-white px-4 py-4">
                    <SalesComparisonProgressyearbybu bu={buCode} />
                    <hr className="my-6 border-white/20" />

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="py-6">
                                <QuarterlyBarChartBU bu={buCode} />
                                <AccumulatedByBuBarChart bu={buCode} />
                                <TopCustomerListByBuWithChart bu={buCode} />
                                <ChannelSummaryByBu />
                                <div className='py-[8px]'>
                                    <TopCustomerListWithChartbybu bu={buCode} />
                                </div>
                                <div className='pb-[8px]'>
                                    <TopSellingProductsbybu bu={buCode} />
                                </div>
                                <TopCusAreabybu bu={buCode} />
                            </div>
                            <div className="py-6">
                                <MonthlySalesChartbybu bu={buCode} />
                                <TopSellProdcutByBuListWithChart bu={buCode} />
                                <SalesChartTabsByBu bu={buCode} />
                                <div className="py-[8px]">
                                    <TopItemBrandsByBU bu={buCode} />
                                </div>
                                <TopSalespersonsByBu bu={buCode} />
                                <div className="py-[16px]">
                                    <SaleByreabyBu bu={buCode} />
                                </div>
                                <TopProductByBu bu={bu} />
                            </div>
                        </div>

                        <div className="mt-10 space-y-8">
                            <ProvinceSalesBybu bu={buCode} />
                            <SalesMapbyBU bu={buCode} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
