import { useEffect, useState } from "react";
import api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import { CheckCircle, Package, Shield, User } from "lucide-react";

const HistoryApproved = () => {
    const [history, setHistory] = useState([]);
    const bu = localStorage.getItem("bu");

    const loadHistory = async () => {
        try {
            const res = await api.get(`/pms/historyApprove?bu_code=${bu}`);
            setHistory(res.data);
        } catch (error) {
            console.error("Error loading history:", error);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Navbar />
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Approval History</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {history.length} {history.length === 1 ? "record" : "records"} found
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">All Approved</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {history.map((item, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                                    APPROVED
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">{item.date}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600 font-bold">Product:</span>
                                                <span className="text-sm font-medium text-gray-900">{item.name_1}</span>
                                                <span className="text-sm text-gray-600 font-bold">RowOrder:</span>
                                                <span className="text-sm font-medium text-gray-900">{item.roworder}</span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">Approved by:</span>
                                                <span className="text-sm font-medium text-gray-900">{item.approver_name}</span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Shield className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">Role:</span>
                                                <span className="text-sm font-medium text-gray-900">{item.approver}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-4">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {item.code}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {history.length === 0 && (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No approval records found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryApproved;
