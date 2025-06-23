import TotalOverallByChannel from './TotalOverallByChannel';
import QuarterlyBarChartBUchannel from './QuarterlyBarChartBUchannel';
import MonthlySalesChartbybuchannel from './MonthlySalesChartbybuchannel';
import SaleByreabyBuChannel from './salebyareabybuchannel';
import TopCusAreabybuchannel from './TopCusAreabybuchannel';
import TopProductAreabybuchannel from './TopProductAreabybuchannel';
import ProvinceSalesBuChannel from './ProvinceSalesBuChannel';
import AccumulatedChanel from './AccumelatedChanel';
import TopSellProdcutChanel from './TopSellHign';
import TopShopSellHign from './TopShopHign';
import TabsReportTime from './TabReportTime';
import CrossTheChannel from "./CrossTheChannek";
import TopPopularProduct  from "./TopPopularProduct";
import TopCustomerBuyTen  from "./TopCustomerHignBuy";
import TopSalespersonsChanel  from "./TopSalespersonsChanel";
import TopSellingProductByChanel  from "./TopSellingProductByChanel";


export default function SaleByBuByChannel({ bu, department }) {
    const buCode = parseInt(bu);
    if (!buCode) return <div className="text-danger p-4">❌ Invalid BU</div>;
    return (
        <>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4">
                    <h5 className="text-base font-bold tracking-wide font-[Noto_Sans_Lao]">
                        📦 ລາຍງານຍອດຂາຍຕາມ BU Channel: {buCode}
                    </h5>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-black px-4 py-4">
                    <TotalOverallByChannel bu={buCode} department={department} />
                    <hr className="my-6 border-white/20" />

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="py-6">
                                <QuarterlyBarChartBUchannel bu={buCode} department={department} />
                                <div className="py-[8px]">
                                    <AccumulatedChanel bu={buCode} department={department} />
                                </div>
                                <div className="py-[8px]">
                                    {/* <TopCustByBuChannel bu={buCode} department={department} /> */}
                                    <TopShopSellHign bu={buCode} department={department} />
                                </div>
                                <div className="py-[8px]">
                                    <CrossTheChannel bu={buCode} department={department} />
                                </div>
                                <TopCustomerBuyTen bu={buCode}/>
                                <TopSellingProductByChanel bu={buCode} />
                                <TopCusAreabybuchannel bu={buCode} department={department} />
                            </div>
                            <div className="py-6">
                                <MonthlySalesChartbybuchannel bu={buCode} department={department} />
                                <div className="py-[16px]">
                                    <TopSellProdcutChanel bu={buCode} department={department} />
                                </div>
                                <div className="py-[8px]">
                                    <TabsReportTime />
                                </div>
                                <div className="py-[8px]">
                                    <TopPopularProduct bu={buCode} />
                                </div>
                                <TopSalespersonsChanel bu={buCode}/>
                                <div className="py-[8px]">
                                    <SaleByreabyBuChannel bu={buCode} department={department} />
                                </div>

                                <div className="py-[16px]">
                                    <TopProductAreabybuchannel bu={buCode} department={department} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-8">
                            <ProvinceSalesBuChannel bu={buCode} department={department} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
