// import Navbar from '../../components/Navbar';
// import SalesProgressyear from './total/SalesProgress_year'

// import OverallSection from './OverallSection'
// import SalesComparisonProgressAveragebybu from './bybu/SalesProgress_averagebybu'
// import SalesComparisonProgressyearbybu from './bybu/SalesProgress_yearbybu'
// import SalesComparisonProgressMonthbybu from './bybu/SalesProgressyear_monthbybu'
// import OverallSectionbybu from './bybu/selection/OverallSectionbybu'
// export default function Saledashboard() {
//   return (
//     <>
//       <div className="card">
//         <div className="card-header">
//           <center>
//           <h4 className="mb-0 fw-bold text-dark text-center">OVERALL</h4>
//           </center>
         
//         </div>
//         <div className="card-body  bg-info-gradient">
//           <div className="d-flex justify-content-between align-items-center w-100 mb-3">

//             {/* <button className="btn btn-link p-0 text-decoration-none text-primary">
//               ສະແດງລາຍລະອຽດທັງໝົດ
//             </button> */}
//           </div>
//           <div className="row">
//             <div className="col-sm-4">
//               <SalesComparisonProgressMonth />
//             </div>
//             <div className="col-sm-4">
//               <SalesComparisonProgressAverage />
//             </div>
//             <div className="col-sm-4">
//               <SalesProgressyear />
//             </div>
//           </div>
//           <OverallSection />
//         </div>
//       </div>
//       <hr />
//       <div className="card">
//         <div className="card-header">
//           <center>
//             <h4 className="mb-0 fw-bold text-dark text-center">ແຍກ BU</h4>
//           </center>

//         </div>
//         <div className="card-body ">
//           <div className="card">
//             <div className="card-header">
//               <h5>BU ໄຟຟ້າ</h5></div>
//             <div className="card-boby bg-success p-2">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressMonthbybu bu={11} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressAveragebybu bu={11} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressyearbybu bu={11} />
//                 </div>
//               </div>
//               <OverallSectionbybu bu={11} />
//             </div>
//           </div>
//           <hr />
//           <div className="card">
//             <div className="card-header">
//               <h5 className='mt-3'>BU ແອ</h5>
//             </div>
//             <div className="card-body p-2">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressMonthbybu bu={12} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressAveragebybu bu={12} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressyearbybu bu={12} />
//                 </div>
//               </div>
//               <OverallSectionbybu bu={12} />
//             </div>
//           </div>
//           <hr />
//           <div className="card">
//             <div className="card-header">
//               <h5>BU ປະປາ</h5>
//             </div>
//             <div className="card-body bg-success p-2">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressMonthbybu bu={13} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressAveragebybu bu={13} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressyearbybu bu={13} />
//                 </div>
//               </div>
//               <OverallSectionbybu bu={13} />
//             </div>
//           </div>
//           <hr />
//           <div className="card">
//             <div className="card-header">
//               <h5>BU ອາໄຫຼ່</h5>
//             </div>
//             <div className="card-body bg-success p-2">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressMonthbybu bu={14} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressAveragebybu bu={14} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressyearbybu bu={14} />
//                 </div>
//               </div>
//               <OverallSectionbybu bu={14} />
//             </div>
//           </div>
//           <hr />
//           <div className="card">
//             <div className="card-header">
//               <h5>BU ສູນບໍລິການ</h5>
//             </div>
//             <div className="card-boby bg-success p-2">
//               <div className="row">
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressMonthbybu bu={15} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressAveragebybu bu={15} />
//                 </div>
//                 <div className="col-sm-4">
//                   <SalesComparisonProgressyearbybu bu={15} />
//                 </div>
//               </div>
//               <OverallSectionbybu bu={15} />
//             </div>
//           </div>
//         </div>
//       </div>


//     </>
//   )
// }
