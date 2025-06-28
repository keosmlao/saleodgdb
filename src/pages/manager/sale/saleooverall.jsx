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
            <div className="bg-white rounded-lg shadow">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <SalesProgressyear />
                    <hr className="border-gray-200 my-4" />
                    <div className="mt-3 p-2 rounded-lg shadow-sm bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg shadow-sm p-4"><QuarterlyBarChart /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><MonthlySalesChart /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><AccumulatedBarChart /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><ChartTab /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><ChannelSummary /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><ProvinceSalesComparison /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><TopCustomerList /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><TopSellingProducts /></div>
                            <div className="bg-white rounded-lg shadow-sm p-4"><TopSalespersons /></div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <SalesMap />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
