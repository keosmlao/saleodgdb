import React, { useState, useEffect } from 'react';  // ✅ เพิ่ม useState และ useEffect
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OnlineUsers from '../hooks/OnlineUsers';

export default function Home() {
  const [user, setUser] = useState({
    user_id: localStorage.getItem('user_id'),
    username: localStorage.getItem('username')
  });

  useEffect(() => {
    if (!user.user_id || !user.username) {
      console.warn('⚠️ Home.jsx: user_id or username missing, please login first');
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container-fluid d-flex align-items-center justify-content-center flex-grow-1 bg-light">
          <div className="text-center">
            <h1 className="display-4 text-primary fw-bold">
              ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ ODIEN GROUP
            </h1>
            <p className="lead text-secondary">
              ລະບົບການເຮັດວຽກອັດຕະໂນມັດຂອງພວກເຮົາ
            </p>
            <OnlineUsers user_id={user.user_id} username={user.username} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
