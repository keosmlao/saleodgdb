import { Tabs } from "antd";
import PurchasingProductPage from "./PurchasingProduct";
import Navbar from "../../components/Navbar";
import ProductPending from "./ProductPending";

const TabPurchasing = () => {
    const onChange = key => {
        console.log("Selected Tab Key:", key);
    };

    const items = [
        {
            key: "1",
            label: "ສີນຄ້າລໍຖ້າ",
            children: <PurchasingProductPage />,
        },
        {
            key: "2",
            label: "ສີນຄ້າລໍຖ້າ",
            children: <ProductPending />,
        },
        {
            key: "3",
            label: "ອະນຸມັດ",
            children: <div>Content of Tab 2</div>,
        },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <Tabs size="large" onChange={onChange} type="card" items={items} />
        </div>
    );
};

export default TabPurchasing;
