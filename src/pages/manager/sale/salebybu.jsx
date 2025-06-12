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
            <div className="rounded-2xl overflow-hidden shadow-lg  border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4">
                    <h5 className="text-base font-bold tracking-wide font-[Noto_Sans_Lao]">📦 ລາຍງານຍອດຂາຍຕາມ BU: {buCode}</h5>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-blue-500  text-white px-4 py-4">
                    <SalesComparisonProgressyearbybu bu={buCode} />
                    <hr className="my-6 border-white/20" />

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <TopCustomerListWithChartbybu bu={buCode} />
                                <TopSellingProductsbybu bu={buCode} />
                                <TopCusAreabybu bu={buCode} />
                            </div>
                            <div className="space-y-6">
                                <QuarterlyBarChartBU bu={buCode} />
                                <MonthlySalesChartbybu bu={buCode} />
                                <SaleByreabyBu bu={buCode} />
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
                {/* </div>
            </div> */}
        </>
    );
}
