import { Button, Table } from "antd";
import Navbar from "../../components/Navbar";
import { columnsPurchasing } from "./component/column";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchasingProductPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const navigate = useNavigate();
    const onSelectChange = (newSelectedRowKeys) => {
        if (newSelectedRowKeys.length === items.length) {
            setSelectedRowKeys(newSelectedRowKeys);
            return;
        }
        if (newSelectedRowKeys.length <= 1) {
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const items = [
        {
            key: '1',
            "ph1": null,
            "ph2": null,
            "ph3": null,
            "ph4": null,
            "ph5": null,
            "ph6": null,
            "ph7": null,
            "ph8": null,
            "name_1": "ສິນຄ້າ A",
            "name_2": "Product A",
            "unit_code": "pcs",
            "wh": null,
            "sh": null
        },
        {
            key: '2',
            "ph1": null,
            "ph2": null,
            "ph3": null,
            "ph4": null,
            "ph5": null,
            "ph6": null,
            "ph7": null,
            "ph8": null,
            "name_1": "ສິນຄ້າ A",
            "name_2": "Product A",
            "unit_code": "pcs",
            "wh": null,
            "sh": null
        }
    ]

    return <div className="font-['Noto_Sans_Lao'] ">
        <Navbar />
        <div className="p-4">
            <Table
                title={() => (
                    <div className="flex justify-between items-center">
                        <span>ສີນຄ້າການຈັດ</span>
                        <Button type="primary" onClick={() => navigate("/sale/create/purchasing")}>
                            Create
                        </Button>
                    </div>
                )}
                rowSelection={rowSelection} columns={columnsPurchasing} dataSource={items} />
        </div>
    </div>
}

export default PurchasingProductPage;