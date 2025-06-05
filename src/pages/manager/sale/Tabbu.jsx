import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../../components/Navbar';
import SaleByBu from './salebybu';
import { useParams } from 'react-router-dom';
import TabCharnel from './bychannel/tabchanel';
import CustomerTopProducts from './customer/CustomerTopProducts';
export default function Tabbu() {
    const { bu } = useParams();
    const [activeTab, setActiveTab] = useState('overall');

    const tabs = [
        { key: 'overall', label: '🧑 ພາບລວມ BU' },
        { key: 'channel', label: '⚙️ ຕາມຊ່ອງທາງ' },
        { key: 'notifications', label: '🔔 ລູກຄ້າ' },
    ];

    return (
        <>
            <Navbar />
            <div className="">
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
                        {activeTab === 'overall' && (
                            <div>
                                <SaleByBu bu={bu} />
                            </div>
                        )}
                        {activeTab === 'channel' && (
                            <div>
                                <TabCharnel bu={bu} />
                            </div>
                        )}
                        {activeTab === 'notifications' && (
                            <div>
                                <CustomerTopProducts bu={bu} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
