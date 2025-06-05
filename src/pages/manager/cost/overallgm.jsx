
import React from 'react';
import Navbar from '../../../components/Navbar';
import DashboardCostSummary from '../cost/DashboardCostSummary';
import GmDashboard from './GmDashboard';
export default function OverallGm() {
    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <DashboardCostSummary />
                <GmDashboard/>
            </div>
        </div>
    )
}
