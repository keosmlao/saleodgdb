// import React, { useState } from 'react';
// import MonthlySalesChart from './overallselect/MonthlySalesChart'
// import QuarterlyBarChart from './overallselect/QuarterlyBarChart'
// import SummaryCardsNewCustomer from './overallselect/SummaryCardsNewCustomer'
// import TopCustomerList from './overallselect/TopCustomerList'
// import TopSellingProducts from './overallselect/TopSellingProducts'
// import SalesRegionComparison from './overallselect/SalesRegionComparison'
// import TopCustomersByRegion from './Region/TopCustomersByRegion'
// import TopProductsByRegionChart from './Region/TopProductsByRegionChart'
// import ProvinceSalesComparison from './Region/ProvinceSalesComparison'
// import SalesMap from './Region/SalesMap'
// export default function OverallSection({ bu }) {
//     const [showDetail, setShowDetail] = useState(false);

//     return (
//         <div className="">
//             <button
//                 className="btn border-0 bg-transparent ms-3 mt-3 px-2 py-1 text-primary fw-semibold position-relative"
//                 onClick={() => setShowDetail(!showDetail)}
//                 style={{
//                     fontSize: '0.95rem',
//                     transition: 'color 0.3s ease',
//                 }}
//             >
//                 <span className="d-inline-block position-relative">
//                     {showDetail ? '🔽 ປິດລາຍລະອຽດ' : '🔍 ລາຍລະອຽດເພີ່ມເຕີມ'}
//                     <span
//                         className="position-absolute start-0 bottom-0 w-100"
//                         style={{
//                             height: '2px',
//                             background: 'linear-gradient(to right, #0d6efd, #6ea8fe)',
//                             borderRadius: '1px',
//                             transition: 'width 0.3s',
//                         }}
//                     />
//                 </span>
//             </button>

//             {showDetail && (
//                 <div className="mt-3 p-3 bg-light rounded shadow-sm">
//                     {/* 👇 Your detail content here */}
//                     <div className="row">
//                         <div className="col-sm-6">
//                             <TopCustomerList />
//                             <TopSellingProducts />
//                             <TopCustomersByRegion />
//                             <TopProductsByRegionChart />
//                         </div>
//                         <div className="col-sm-6">
//                             <QuarterlyBarChart />
//                             <MonthlySalesChart />
//                             <SummaryCardsNewCustomer />
//                             <SalesRegionComparison />

//                         </div>
//                     </div>
//                     <ProvinceSalesComparison />
//                     <SalesMap />
//                 </div>
//             )}
//         </div>
//     );
// }
