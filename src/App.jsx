// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Home from './pages/home';
import PromotionLineoa from './pages/manager/promotion/promotionlineoa';
import GmPm from './pages/manager/cost/pm_gm';
import ProtectedRoute from './components/ProtectedRoute';
import Saloverall from './pages/manager/sale/saleooverall';
import LoginLogs from './pages/LoginLogs';
import LaoCostZero from './pages/manager/cost/laocostzero';
import SaleUnderLaoCost from './pages/manager/cost/saleunderlaocost';
import OverallGm from './pages/manager/cost/overallgm';
import ProductDefection from './pages/manager/cost/ProductDefection';
import Tabbu from './pages/manager/sale/Tabbu';
import AutoLogoutWrapper from './components/AutoLogoutWrapper';
import HomeLastMonth from './pages/lastmonth/homelastmonth';
import PurchasingProductPage from './pages/purchasingProduct/PurchasingProduct';
import CreatePurchasingProduct from './pages/purchasingProduct/component/ListProduct';
import TabPurchasing from './pages/purchasingProduct/TabPurchasing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<AutoLogoutWrapper />}>
        <Route path="/admin/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/log/loginlogs" element={<ProtectedRoute><LoginLogs /></ProtectedRoute>} />
        <Route path="/sale/salloverall" element={<ProtectedRoute><Saloverall /></ProtectedRoute>} />
        <Route path="/sale/homelastmonth" element={<ProtectedRoute><HomeLastMonth /></ProtectedRoute>} />
        <Route path="/sale/testtab/:bu" element={<ProtectedRoute><Tabbu /></ProtectedRoute>} />
        <Route path="/sale/promotionlineoa" element={<ProtectedRoute><PromotionLineoa /></ProtectedRoute>} />
        <Route path="/sale/gmpm" element={<ProtectedRoute><GmPm /></ProtectedRoute>} />
        <Route path="/sale/laocostzero" element={<ProtectedRoute><LaoCostZero /></ProtectedRoute>} />
        <Route path="/sale/laocostunder" element={<ProtectedRoute><SaleUnderLaoCost /></ProtectedRoute>} />
        <Route path="/sale/overallgm" element={<ProtectedRoute><OverallGm /></ProtectedRoute>} />
        <Route path="/sale/productdefection" element={<ProtectedRoute><ProductDefection /></ProtectedRoute>} />
        <Route path="/sale/tabpurchasing" element={<ProtectedRoute><TabPurchasing /></ProtectedRoute>} />
        <Route path="/sale/purchasing" element={<ProtectedRoute><PurchasingProductPage /></ProtectedRoute>} />
        <Route path="/sale/create/purchasing" element={<ProtectedRoute><CreatePurchasingProduct /></ProtectedRoute>} />
      </Route>

    </Routes>
  );
}

export default App;
