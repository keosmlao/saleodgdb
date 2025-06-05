import Navbar from '../../../components/Navbar';
import MonthlySalesChart from './overallselect/MonthlySalesChart'
import QuarterlyBarChart from './overallselect/QuarterlyBarChart'
import SummaryCardsNewCustomer from './overallselect/SummaryCardsNewCustomer'
import TopCustomerList from './overallselect/TopCustomerList'
import TopSellingProducts from './overallselect/TopSellingProducts'
import SalesRegionComparison from './overallselect/SalesRegionComparison'
import TopCustomersByRegion from './Region/TopCustomersByRegion'
import TopProductsByRegionChart from './Region/TopProductsByRegionChart'
import ProvinceSalesComparison from './Region/ProvinceSalesComparison'
import SalesMap from './Region/SalesMap'
import SalesProgressyear from './total/SalesProgress_year'
import AccumulatedBarChart from './overallselect/AccumulatedBarChart'
import SalesByHourComposedChart from './overallselect/SaleTap/SalesByHourComposedChart'
import ChartTab from './overallselect/SalesChartTabs';
import ChannelSummary from './overallselect/ChannelSummary';
import TopItemBrands from './overallselect/TopItemBrands';
import TopSalespersons from './overallselect/TopSalespersons';
export default function Saloverall() {
    return (
        <>
            <Navbar />
            <div className="card">
                <div className="card-header">
                    <center>
                        <h4 className=" fw-bold text-dark text-center" style={{ fontSize: '16px' }}>ພາບລວມບໍລິສັດ</h4>
                    </center>

                </div>
                <div className="card-body  bg-info-gradient">
                    <SalesProgressyear />
                    <hr />
                    <div className="mt-3 p-2 rounded shadow-sm">
                        {/* 👇 Your detail content here */}
                        <div className="row">
                            <div className="col-sm-6">
                                <QuarterlyBarChart />
                                <AccumulatedBarChart />
                                <TopCustomerList />
                                <ChannelSummary />
                                <TopSalespersons />
                            </div>
                            <div className="col-sm-6">
                                <MonthlySalesChart />
                                <TopSellingProducts />
                                <ChartTab />
                                <TopItemBrands />


                            </div>
                        </div>
                        <ProvinceSalesComparison />
                        <SalesMap />
                    </div>
                </div>
            </div>
        </>
    )

}
