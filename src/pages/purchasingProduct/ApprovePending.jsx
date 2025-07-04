import { Button, Table, Typography, notification } from "antd";
import { CheckCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { columnsPurchasingApprove } from "./component/column";

const { Title } = Typography;

const ApprovePending = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [pendingProducts, setPendingProducts] = useState([]);
    const bu = localStorage.getItem("bu");
    const role = localStorage.getItem("role")
    const navigate = useNavigate();
    const [apiNotification, contextHolder] = notification.useNotification();

    const fetchPendingProducts = async () => {
        setLoadingApprove(true);
        try {
            const res = await api.get(`/pms/productpendingApprove?bu_code=${bu}`);
            setPendingProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoadingApprove(false);
        }
    };

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const handleApprove = async () => {
        setLoadingApprove(true);
        try {
            const data = {
                "approver": role,
                "approve_status": "approved",
                "roworders": selectedRowKeys
            }
            console.log("log data", data)
            await api.post("/pms/productpending/updateapprove", data);
            apiNotification.success({
                message: "Approval Successful",
                description: `Successfully approved ${selectedRowKeys.length} items.`,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                placement: "topRight",
            });
            setSelectedRowKeys([]);
            fetchPendingProducts(); 
        } catch (error) {
            console.error("Approval failed:", error);
            apiNotification.error({
                message: "Approval Failed",
                description: error.response?.data?.message || "An error occurred during approval.",
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                placement: "topRight",
            });
        } finally {
            setLoadingApprove(false);
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    return (
        <div className="font-['Noto_Sans_Lao']">
            {contextHolder}
            <div className="p-4 bg-white rounded-lg shadow-md">
                <Table
                    bordered
                    rowKey="roworder"
                    title={() => (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 border-b pb-4 mb-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Title level={3} className="m-0 text-gray-800">ອະນຸມັດ</Title>
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        type="primary"
                                        loading={loadingApprove}
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleApprove}
                                        className="bg-blue-600 hover:!bg-blue-700 text-white"
                                    >
                                        Approve ({selectedRowKeys.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    rowSelection={rowSelection}
                    columns={columnsPurchasingApprove}
                    dataSource={pendingProducts}
                    loading={loadingApprove}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    );
};

export default ApprovePending;
