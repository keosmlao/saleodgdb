import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary px-3 py-2 shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-white" to="/admin/home">
          ODIEN GROUP
        </Link>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-start align-items-md-center gap-2 gap-md-3">
            {/* SALE REPORT Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '12px' }}
              >
                📊 SALE REPORT
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/sale/salloverall" style={{ fontSize: '12px' }}>📊 ພາບລວມບໍລິສັດ</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/sale/homelastmonth" style={{ fontSize: '12px' }}>📊 ສະຫຼຸບຍອດຂາຍເດືອນຜ່ານມາ</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/sale/testtab/11" style={{ fontSize: '12px' }}>📊 BU ໄຟຟ້າ</Link></li>
                <li><Link className="dropdown-item" to="/sale/testtab/12" style={{ fontSize: '12px' }}>📊 BU ແອ</Link></li>
                <li><Link className="dropdown-item" to="/sale/testtab/13" style={{ fontSize: '12px' }}>📊 BU ປະປາ</Link></li>
                <li><Link className="dropdown-item" to="/sale/testtab/14" style={{ fontSize: '12px' }}>📊 BU ອາໄຫ່</Link></li>
                <li><Link className="dropdown-item" to="/sale/testtab/15" style={{ fontSize: '12px' }}>📊 BU ໄຟຟ້ານ້ອຍ</Link></li>
                <li><Link className="dropdown-item" to="/sale/testtab/16" style={{ fontSize: '12px' }}>📊 BU ສູນບໍລິການ</Link></li>
              </ul>
            </li>

            {/* PROMOTION */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/sale/promotionlineoa" style={{ fontSize: '12px' }}>
                🎯 PROMOTION LINE O.A
              </Link>
            </li>

            {/* GM Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '12px' }}
              >
                💰 GM
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/sale/overallgm" style={{ fontSize: '12px' }}>ພາບລວມ GM</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/sale/gmpm" style={{ fontSize: '12px' }}>ຂໍມູນສິນຄ້າທີ່ຂາຍໃນປີ 2025</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item text-danger" to="/sale/laocostzero" style={{ fontSize: '12px' }}>ບໍພົບຕົ້ນທຶນ</Link></li>
                <li><Link className="dropdown-item text-danger" to="/sale/laocostunder" style={{ fontSize: '12px' }}>ຂາຍຕ່ຳກົ່ວທຶນ</Link></li>
                <li><Link className="dropdown-item text-primary" to="/sale/productdefection" style={{ fontSize: '12px' }}>ສິນຄ້າຜິດປົກກະຕິ</Link></li>
              </ul>
            </li>

            {/* Logout Button */}
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm ms-md-2 mt-2 mt-md-0"
                style={{ fontSize: '12px' }}
                onClick={handleLogout}
              >
                🚪 LOG OUT
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
