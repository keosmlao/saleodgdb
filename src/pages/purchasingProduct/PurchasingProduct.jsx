import { Button, Modal, Table, Typography, notification } from "antd";
import { CheckCircleOutlined, PlusOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PurchasingHook from "../../hooks/purchasingHook";
import api from "../../services/api";
import { columnsPurchasing } from "./component/column";

const { Title } = Typography;

const PurchasingProductPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();
    const { getAllProductPending, loadGetAllProductPending } = PurchasingHook();
    const role = localStorage.getItem("role");
    const [apiNotification, contextHolder] = notification.useNotification();

    const hanldeApprover = async () => {
        setLoadingApprove(true);
        try {
            const data = {
                "status": "1",
                "roworders": selectedRowKeys
            };
            const res = await api.put("/pms/productpending/request", data);
            apiNotification.success({
                message: "Approval Successful",
                description: `Successfully approved ${selectedRowKeys.length} items.`,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                placement: "topRight",
            });
            setSelectedRowKeys([]);
            loadGetAllProductPending();
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

    const handleUpdate = async (record) => {
        navigate(`/sale/update/purchasing/${record.roworder}`);
    }

    const handleDeleteClick = (record) => {
        setItemToDelete(record);
        setIsDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/pms/productpending/${itemToDelete.roworder}`);
            apiNotification.success({
                message: "Delete Successful",
                description: `Successfully deleted item: ${itemToDelete.productname || itemToDelete.roworder}`,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                placement: "topRight",
            });

            loadGetAllProductPending();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete failed:", error);
            apiNotification.error({
                message: "Delete Failed",
                description: error.response?.data?.message || "An error occurred while deleting the item.",
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                placement: "topRight",
            });
        } finally {
            setLoadingDelete(false);
        }
    }

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    }

    const column = columnsPurchasing({
        onUpdate: handleUpdate,
        onDelete: handleDeleteClick // Pass the click handler instead of delete handler
    })

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
                                <Title level={3} className="m-0 text-gray-800">ສີນຄ້າການຈັດຊື້</Title>
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        type="primary"
                                        danger={false}
                                        loading={loadingApprove}
                                        icon={<CheckCircleOutlined />}
                                        onClick={hanldeApprover}
                                        className="bg-blue-600 hover:!bg-blue-700 text-white"
                                    >
                                        Request ({selectedRowKeys.length})
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
                    columns={column}
                    dataSource={getAllProductPending}
                    loading={!getAllProductPending}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </div>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <DeleteOutlined className="text-red-500" />
                        <span>ຢຶນຢັນການລົບ</span>
                    </div>
                }
                open={isDeleteModalOpen}
                onOk={handleDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                    danger: true,
                    loading: loadingDelete,
                    icon: <DeleteOutlined />
                }}
                cancelButtonProps={{
                    disabled: loadingDelete
                }}
                width={500}
            >
                <div className="py-4 flex items-center">
                    <div className="flex items-start gap-3">
                        <ExclamationCircleOutlined className="text-orange-500 text-xl" />
                        <p className="text-gray-800 mb-2 flex items-center">
                            ທ່ານຕອ້ງການທີ່ຈະລົບບໍ່
                        </p>
                    </div>
                </div>

            </Modal>
        </div>
    );
};

export default PurchasingProductPage;