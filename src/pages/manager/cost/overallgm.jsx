
import React from 'react';
import Navbar from '../../../components/Navbar';
import DashboardCostSummary from '../cost/DashboardCostSummary';
import GmDashboard from './GmDashboard';
import NavbarPM from '../../../components/NavbarPM';
import CostOverall from './costoverall';
export default function OverallGm() {
    const roles = localStorage.getItem('role'); // Get user role from localStorage
    return (
        <div>
      {roles === 'Manager' ? <Navbar /> : <NavbarPM />}
            <div className="container mt-4">
                <CostOverall/>
                <DashboardCostSummary />
                <GmDashboard/>
            </div>
        </div>
    )
}
