// import React, { useState } from 'react';
// import Navbar from '../../components/Navbar';
// import { Tab, Tabs, Container } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Saledashboard from './saledashboard'

// export default function HomeSale() {
//   const [key, setKey] = useState('tab1');

//   return (
//     <>
//       <Navbar />
//       <div className="bg-light py-4 px-2">
//           {/* <h3 className="mb-4 text-success fw-bold">📈 Sale Dashboard</h3> */}

//           <Tabs
//             id="custom-tabs"
//             activeKey={key}
//             onSelect={(k) => setKey(k)}
//             className="mb-3"
//             variant="pills"
//             justify // ทำให้ปุ่มเต็มความกว้างแบบ responsive
//           >
//             <Tab eventKey="tab1" title="📊 SALE">
//               <div className="p-3 border rounded bg-white">
//                 {/* 🔽 กราฟแสดงข้อมูล */}
//                 <Saledashboard/>

//               </div>
//             </Tab>

//             <Tab eventKey="tab2" title="📋 SALE ESTIMAT">
//               <div className="p-3 border rounded bg-white">
//                 {/* 🔽 ตารางแสดงข้อมูล */}
//                 <p>📋 รายงานรายการขายแบบตาราง...</p>
//               </div>
//             </Tab>

//           </Tabs>

//       </div>
//     </>
//   );
// }
