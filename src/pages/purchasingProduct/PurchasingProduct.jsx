import { Button, Table, Typography, notification } from "antd"; // Import Typography and notification
import { CheckCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'; // Import Ant Design icons
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PurchasingHook from "../../hooks/purchasingHook";
import api from "../../services/api";
import { columnsPurchasing } from "./component/column";

const { Title } = Typography; 

const PurchasingProductPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const navigate = useNavigate();
    const { getAllProductPending, fetchAllProductPending } = PurchasingHook();
    const role = localStorage.getItem("role");
    const [apiNotification, contextHolder] = notification.useNotification();

    const hanldeApprover = async () => {
        setLoadingApprove(true);
        try {
            const data = {
                "approver": role,
                "approve_status": "approved",
                "roworders": selectedRowKeys
            };
            const res = await api.put("/productpending/updateapprove", data);
            apiNotification.success({
                message: "Approval Successful",
                description: `Successfully approved ${selectedRowKeys.length} items.`,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                placement: "topRight",
            });
            setSelectedRowKeys([]);
            fetchAllProductPending();
            return res;

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
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    return (
        <div className="font-['Noto_Sans_Lao']">
            {contextHolder}
            <div className="p-4 bg-white rounded-lg shadow-md">
                <Table
                    bordered
                    rowKey="roworder"
                    title={() => (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 border-b pb-4 mb-4"> {/* Added border-b, pb-4, mb-4 for separation */}
                            <div className="flex flex-wrap items-center gap-4">
                                <Title level={3} className="m-0 text-gray-800">ສີນຄ້າການຈັດຊື້</Title> {/* Used AntD Typography for consistent heading */}
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        type="primary"
                                        danger={false}
                                        loading={loadingApprove}
                                        icon={<CheckCircleOutlined />}
                                        onClick={hanldeApprover}
                                        className="bg-blue-600 hover:!bg-blue-700 text-white"
                                    >
                                        Approve ({selectedRowKeys.length})
                                    </Button>
                                )}
                            </div>
                            <div>
                                <Button
                                    size="large"
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/sale/create/purchasing")}
                                    className="bg-green-600 hover:!bg-green-700 text-white"
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                    )}
                    rowSelection={rowSelection}
                    columns={columnsPurchasing}
                    dataSource={getAllProductPending}
                    loading={!getAllProductPending}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    );
};

export default PurchasingProductPage;