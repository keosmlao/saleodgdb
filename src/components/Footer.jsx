import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-danger text-white py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center">
        <div className="mb-2 mb-md-0">
          &copy; {new Date().getFullYear()} ODG Lao | Powered by IT TEAM
        </div>
        <button
          className="btn btn-light btn-sm text-danger fw-bold"
          onClick={() => navigate('/log/loginlogs')}
        >
          ປະຫວັດຜູ້ເຂົ້າລະບົບ
        </button>
      </div>
    </footer>
  );
}

