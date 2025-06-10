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
    <div  className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-cyan-800">
      <Navbar />
      <div >
        <div className="flex items-center justify-content-center  ">
          <div className="text-center">
            <h1 className="text-5xl text-white md:text-6xl font-bold mb-6 leading-tight">
              ຍິນດີຕ້ອນຮັບເຂົ້າສູ່
            </h1>
            <div className="relative mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wider">
                ODIEN GROUP
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
            </div>
            <p className="lead text-secondary text-white">
              ລະບົບການເຮັດວຽກອັດຕະໂນມັດຂອງພວກເຮົາ
            </p>
            <OnlineUsers user_id={user.user_id} username={user.username} />
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        .slow-spin {
          animation: spin 8s linear infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
