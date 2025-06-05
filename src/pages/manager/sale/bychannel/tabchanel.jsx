import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaleByBuByChannel from './salebybubychannel';
export default function TabCharnel({ bu }) {
    const [activeTab, setActiveTab] = useState('wholesale');

    // Define department based on bu and activeTab
    let department = '';
    if (bu === '11') {
        if (activeTab === 'wholesale') department = '2011';
        else if (activeTab === 'retail') department = '2012';
        else if (activeTab === 'project') department = '2013';
        else if (activeTab === 'installer') department = '2014';

    } else if (bu === '12') {
        if (activeTab === 'wholesale') department = '2021';
        else if (activeTab === 'retail') department = '2022';
        else if (activeTab === 'project') department = '2023';
        else if (activeTab === 'installer') department = '2014';

    } else if (bu === '13') {
        if (activeTab === 'wholesale') department = '2031';
        else if (activeTab === 'retail') department = '2032';
        else if (activeTab === 'project') department = '2033';
        else if (activeTab === 'installer') department = '2014';

    

    } else if (bu === '14') {
        if (activeTab === 'wholesale') department = '2041';
        else if (activeTab === 'retail') department = '2042';
        else if (activeTab === 'project') department = '2043';
        else if (activeTab === 'installer') department = '2044';

    } else if (bu === '15') {
        if (activeTab === 'wholesale') department = '2051';
        else if (activeTab === 'retail') department = '2052';
        else if (activeTab === 'project') department = '2053';
        else if (activeTab === 'installer') department = '2054';

    
    }
    const tabs = [
        { key: 'wholesale', label: '🧑 ຂາຍສົ່ງ' },
        { key: 'retail', label: '🧑 ໜ້າຮ້ານ' },
        { key: 'project', label: '🧑 ໂຄງການ' },
        { key: 'installer', label: '🧑 ຊ່າງ' }

    ];

    return (
        <div>
            {/* Top Tabs */}
            <ul className="nav nav-tabs">
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab.key}>
                        <button
                            className={`nav-link ${activeTab === tab.key ? 'active text-white bg-danger' : ''}`}
                            style={{
                                fontSize: '13px',
                                fontFamily: 'Noto Sans Lao',
                                borderRadius: '0',
                            }}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Tab Content */}
            <div className="card shadow-sm" style={{ borderRadius: 0 }}>
                <div className="card-body">
                    <SaleByBuByChannel bu={bu} department={department} />
                </div>
            </div>
        </div>
    );
}
