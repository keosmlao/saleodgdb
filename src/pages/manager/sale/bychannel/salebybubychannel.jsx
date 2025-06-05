import React from 'react';
import TotalOverallByChannel from './TotalOverallByChannel';

import TopCustByBuChannel from './TopCustbybuchannel';
import TopSellingProductsbybuchannel from './TopSellingProductsbybuchannel';
import QuarterlyBarChartBUchannel from './QuarterlyBarChartBUchannel';
import MonthlySalesChartbybuchannel from './MonthlySalesChartbybuchannel';
import SaleByreabyBuChannel from './salebyareabybuchannel';
import TopCusAreabybuchannel from './TopCusAreabybuchannel';
import TopProductAreabybuchannel from './TopProductAreabybuchannel';
import ProvinceSalesBuChannel from './ProvinceSalesBuChannel';



export default function SaleByBuByChannel({ bu, department }) {
    const buCode = parseInt(bu);
    if (!buCode) return <div className="text-danger p-4">❌ Invalid BU</div>;
    return (
        <>
            <div className="card-header bg-primary text-white">
                <h5 className="m-0" style={{ fontSize: '14px' }}>📦 ລາຍງານຍອດຂາຍຕາມ BU: {buCode}-{department}</h5>
            </div>
            <div className="card-body bg-success text-white">
                <TotalOverallByChannel bu={buCode} department={department} />
                <hr className="border-light" />
                <div className="mt-3 p-3 bg-light rounded shadow-sm">
                    <div className="row">
                        <div className="col-md-6">
                            <TopCustByBuChannel bu={buCode} department={department} />
                            <TopSellingProductsbybuchannel bu={buCode} department={department} />
                            <TopCusAreabybuchannel bu={buCode} department={department} />
                        </div>
                        <div className="col-md-6">
                            <QuarterlyBarChartBUchannel bu={buCode} department={department} />
                            <MonthlySalesChartbybuchannel bu={buCode} department={department} />
                            <SaleByreabyBuChannel bu={buCode} department={department} />
                            <TopProductAreabybuchannel bu={buCode} department={department} />
                        </div>
                    </div>
                    <ProvinceSalesBuChannel bu={buCode} department={department} />
                    {/* <ProvinceSalesBybu bu={buCode} />
                    <SalesMapbyBU bu={buCode} /> */}
                </div>
            </div>
        </>
    );
}
