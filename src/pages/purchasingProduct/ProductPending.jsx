import { Button, Table, Typography, notification } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { createColumnsPurchasing } from "./component/column";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProductPending = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [getAllProductPending, setGetAllProductpending] = useState([]);
    const [getAllApprover, setGetAllApprover] = useState([]);
    const [accountCodeSelections, setAccountCodeSelections] = useState({});
    const [apiNotification, contextHolder] = notification.useNotification();

    const fectGetAllProductPending = async () => {
        try {
            const res = await api.get("/pms/productpendingaccount");
            setGetAllProductpending(res.data);
        } catch (error) {
            throw error;
        }
    };

    const fectGetAllApprover = async () => {
        try {
            const res = await api.get("/pms/accountApprover");
            setGetAllApprover(res.data);
        } catch (error) {
            throw error;
        }
    };

    const approverOptions = useMemo(() => {
        if (!getAllApprover || !Array.isArray(getAllApprover)) return [];
        return getAllApprover.map(item => ({
            value: item.code || item.id || item.value,
            label: item.name_1 || item.name || item.label || `${item.code} - ${item.name_1}`,
        }));
    }, [getAllApprover]);

    useEffect(() => {
        fectGetAllProductPending();
    }, []);

    useEffect(() => {
        fectGetAllApprover();
    }, []);

    const handleUpdateAccount = async () => {
        try {
            const roworder = selectedRowKeys[0];
            if (!roworder) return;
            const selectedCodes = accountCodeSelections[roworder] || {};
            const missingFields = [];
            if (!selectedCodes.account_code1) missingFields.push("Account Code 1");
            if (!selectedCodes.account_code2) missingFields.push("Account Code 2");
            if (!selectedCodes.account_code3) missingFields.push("Account Code 3");
            if (!selectedCodes.account_code4) missingFields.push("Account Code 4");

            if (missingFields.length > 0) {
                apiNotification.error({
                    message: "Missing Required Fields",
                    description: `Please select: ${missingFields.join(", ")}`,
                });
                return;
            }
            const body = {
                roworder,
                account_code1: selectedCodes.account_code1,
                account_code2: selectedCodes.account_code2,
                account_code3: selectedCodes.account_code3,
                account_code4: selectedCodes.account_code4,
            };
            const res = await api.put("/pms/productpending/updateaccount", body);
            return res;
        } catch (error) {
            console.error("Update account failed:", error);
            throw error;
        }
    };

    const handleUpdateAccountStatus = async () => {
        try {
            const updated = await handleUpdateAccount();

            if (!updated) {
                apiNotification.error({
                    message: "Missing Required Fields",
                    description: `Please select: ${missingFields.join(", ")}`,
                });
                return;
            }
            const data = {
                status: "1",
                roworders: selectedRowKeys
            };
            const res = await api.put("/pms/productpending/accountstatus", data);
            apiNotification.success({
                message: "Approval Successful",
                description: `Successfully Request approved items.`,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                placement: "topRight",
            });
            fectGetAllProductPending();
            return res;
        } catch (error) {
            console.error("Update account status failed:", error);
            throw error;
        }
    };

    const handleAccountCodeChange = (index, codeField, newValue) => {
        const row = getAllProductPending[index];
        if (!row) return;
        setAccountCodeSelections(prev => ({
            ...prev,
            [row.roworder]: {
                ...prev[row.roworder],
                [codeField]: newValue
            }
        }));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    const columns = createColumnsPurchasing({
        accountCodeOptions: approverOptions,
        accountCodeSelections,
        onAccountCodeChange: handleAccountCodeChange,
    });

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
                                <Title level={3} className="m-0 text-gray-800">ສີນຄ້າລໍຖ້າ</Title>
                                {selectedRowKeys.length > 0 && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleUpdateAccountStatus}
                                        className="bg-blue-600 hover:!bg-blue-700 text-white"
                                    >
                                        Request ({selectedRowKeys.length})
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={getAllProductPending}
                    loading={!getAllProductPending}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    );
};

export default ProductPending;
