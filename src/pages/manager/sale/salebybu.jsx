import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import SalesComparisonProgressyearbybu from './bybu/SalesProgress_yearbybu';
import TopCustomerListWithChartbybu from './bybu/selection/TopCustomerListbybu';
import TopSellingProductsbybu from './bybu/selection/TopSellingProductsbybu';
import QuarterlyBarChartBU from './bybu/QuarterlyBarChartBU'
import MonthlySalesChartbybu from './bybu/MonthlySalesChartbybu'
import SaleByreabyBu from './bybu/salebyareabybu'
import TopCusAreabybu from './bybu/TopCusAreabybu'
import TopProductByBu from './bybu/TopProductbybu'
import ProvinceSalesBybu from './bybu/ProvinceSalesBybu'
import SalesMapbyBU from './bybu/SalesMapbyBU'
export default function SaleByBu({ bu }) {

    const buCode = parseInt(bu);

    if (!buCode) return <div className="text-danger p-4">❌ Invalid BU</div>;

    return (
        <>
            {/* <div className="card-body">
                <div className="card"> */}
                    <div className="card-header bg-primary text-white">
                        <h5 className="m-0" style={{ fontSize: '14px' }}>📦 ລາຍງານຍອດຂາຍຕາມ BU: {buCode}</h5>
                    </div>
                    <div className="card-body bg-success text-white">
                        <SalesComparisonProgressyearbybu bu={buCode} />
                        <hr className="border-light" />
                        <div className="mt-3 p-3 bg-light rounded shadow-sm">
                            <div className="row">
                                <div className="col-md-6">
                                    <TopCustomerListWithChartbybu bu={buCode} />
                                    <TopSellingProductsbybu bu={buCode} />
                                    <TopCusAreabybu bu={buCode} />
                                </div>
                                <div className="col-md-6">
                                    <QuarterlyBarChartBU bu={buCode} />
                                    <MonthlySalesChartbybu bu={buCode} />
                                    <SaleByreabyBu bu={buCode} />
                                    <TopProductByBu bu={bu} />
                                </div>
                            </div>
                            <ProvinceSalesBybu bu={buCode} />
                            <SalesMapbyBU bu={buCode} />
                        </div>
                    </div>
                {/* </div>
            </div> */}
        </>
    );
}
