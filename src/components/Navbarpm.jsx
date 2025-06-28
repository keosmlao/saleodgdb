import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavbarPM() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("role");
        navigate("/");
    };

    const toggleDropdown = (dropdownName) => { 
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 font-sans sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate("/pm/home")}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                <span className="text-white font-bold text-sm tracking-wider">ODG</span>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                        </div>
                        <div className="text-white font-bold text-xl tracking-wide group-hover:text-blue-300 transition-colors duration-300">
                            ODIEN GROUP
                        </div>
                    </div>
                    {/* Navigation Menu */}
                    <div className="flex items-center space-x-1">
                        <button
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                            onClick={() => navigate("/sale/promotionlineoa")}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">🎯</span>
                            <span className="text-sm font-semibold">PROMOTION LINE O.A</span>
                        </button>
                       {/* PROMOTION */}
                        <button
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                            onClick={() => navigate("/pm/bcg")}
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform duration-200">BCG</span>
                            <span className="text-sm font-semibold">BCG</span>
                        </button>
                        {/* GM Dropdown */}
                        <div className="relative">
                            <button
                                className="group flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                                onClick={() => toggleDropdown('gm')}
                            >
                                <span className="text-lg group-hover:scale-110 transition-transform duration-200">💰</span>
                                <span className="text-sm font-semibold">GM</span>
                                <svg
                                    className={`w-4 h-4 transition-all duration-300 ${openDropdown === 'gm' ? 'rotate-180 text-green-400' : ''}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd" />
                                </svg>
                            </button>

                            {openDropdown === 'gm' && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)}></div>
                                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/20 py-3 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                                        <button
                                            className="block px-5 py-3 w-full text-left text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200"
                                            onClick={() => navigate("/sale/overallgm")}
                                        >
                                            ພາບລວມ GM
                                        </button>

                                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

                                        <button
                                            className="block px-5 py-3 w-full text-left text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200"
                                            onClick={() => navigate("/sale/gmpm")}
                                        >
                                            ຂໍມູນສິນຄ້າທີ່ຂາຍໃນປີ 2025
                                        </button>

                                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

                                        <button
                                            className="block px-5 py-3 w-full text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
                                            onClick={() => navigate("/sale/laocostzero")}
                                        >
                                            ບໍພົບຕົ້ນທຶນ
                                        </button>

                                        <button
                                            className="block px-5 py-3 w-full text-left text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
                                            onClick={() => navigate("/sale/laocostunder")}
                                        >
                                            ຂາຍຕ່ຳກົ່ວທຶນ
                                        </button>

                                        <button
                                            className="block px-5 py-3 w-full text-left text-sm text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200"
                                            onClick={() => navigate("/sale/productdefection")}
                                        >
                                            ສິນຄ້າຜິດປົກກະຕິ
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Logout Button */}
                        <button
                            className="group flex items-center gap-2 px-5 py-2.5 ml-4 text-sm font-semibold bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:via-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                            onClick={handleLogout}
                        >
                            <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🚪</span>
                            <span className="tracking-wide">LOG OUT</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}