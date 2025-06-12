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
                <div className="card-body  bg-info-gradient">
                    <SalesProgressyear />
                    <hr />
                    <div className="mt-3 p-2 rounded shadow-sm">
                        {/* 👇 Your detail content here */}
                        <div className="row equal-height-row">
                            <div className="col-sm-6">
                                <div className="dashboard-card"><QuarterlyBarChart /></div>
                                <div className="dashboard-card"><AccumulatedBarChart /></div>
                                <div className="dashboard-card"><TopCustomerList /></div>
                                <div className="dashboard-card"><ChannelSummary /></div>
                                <div className="dashboard-card"><TopSalespersons /></div>
                            </div>
                            <div className="col-sm-6">
                                <div className="dashboard-card"><MonthlySalesChart /></div>
                                <div className="dashboard-card"><TopSellingProducts /></div>
                                <div className="dashboard-card"><ChartTab /></div>
                                <div className="dashboard-card"><TopItemBrands /></div>
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
