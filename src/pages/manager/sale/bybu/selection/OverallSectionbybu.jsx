import React, { useState } from 'react';
import MonthlySalesChart from '../../overallselect/MonthlySalesChart'
import QuarterlyBarChart from '../../overallselect/QuarterlyBarChart'
import SummaryCardsNewCustomer from '../../overallselect/SummaryCardsNewCustomer'
import TopCustomerListWithChartbybu from './TopCustomerListbybu'
import TopSellingProductsbybu from './TopSellingProductsbybu'
import SalesRegionComparison from '../../overallselect/SalesRegionComparison'
import TopCustomersByRegion from '../../Region/TopCustomersByRegion'
import TopProductsByRegionChart from '../../Region/TopProductsByRegionChart'
import ProvinceSalesComparison from '../../Region/ProvinceSalesComparison'
import SalesMap from '../../Region/SalesMap'
export default function OverallSectionbybu({bu}) {
    const [showDetail, setShowDetail] = useState(false);

    return (
        <div className="">
            <button
                className="btn btn-link p-0 text-decoration-none text-primary ms-3 mt-3"
                onClick={() => setShowDetail(!showDetail)}
            >
                {showDetail ? 'ປິດລາຍລະອຽດ' : 'ລາຍລະອຽດເພີ່ມເຕີມ'}
            </button>
            {showDetail && (
                <div className="mt-3 p-3 bg-light rounded shadow-sm">
                    {/* 👇 Your detail content here */}
                    <div className="row">
                        <div className="col-sm-6">
                            <TopCustomerListWithChartbybu bu={bu}/>
                            <TopSellingProductsbybu bu={bu}/>
                            <TopCustomersByRegion/>
                            <TopProductsByRegionChart/>
                        </div>
                        <div className="col-sm-6">
                            <QuarterlyBarChart />
                            <MonthlySalesChart />
                            <SummaryCardsNewCustomer/>
                            <SalesRegionComparison/>

                        </div>
                    </div>
                    <ProvinceSalesComparison/>
                    <SalesMap/>
                </div>
            )}
        </div>
    );
}
