import { filterOptionUtil } from "../../../utils/filter_funciton_util";
import LabeledSelect from "../../../components/LabelSelect";
import { useState } from "react";
import { Save, Package, Tag, Palette, Ruler, Layers, Building2, Users, Calculator, DollarSign } from "lucide-react";
import TextInput from "../../../components/InputText";
import { OPTION_COST, OPTION_MERCHANT, OPTION_PRODUCT_GROUP, OPTION_TYPE_COST } from "../../../constant/constant";
import { Button, Divider, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PurchasingHook from "../../../hooks/purchasingHook";
import api from "../../../services/api";
import { useForm } from "antd/es/form/Form";

const CreatePurchasingProduct = () => {
    const [selected, setSelected] = useState(null);
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [unitCode, setUnitCode] = useState("");
    const [whCode, setWhCode] = useState("");
    const [shCode, setShCode] = useState("");
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { getProductPHOne, selectedPH1, setSelectedPH1, getProductPHTwo, selectedPH2, setSelectedPH2, loadPHTwo, getProductPHThree, loadPHThree, selectedPH3, setSelectedPH3, selectedPH4, setSelectedPH4, getProductPHFour, getProductPHFive, selectedPH5, setSelectedPH5, getProductPHSix, selectedPH6, setSelectedPH6, getProductPHSeven, selectedPH7, setSelectedPH7,
        getProductPHEig, selectedPH8, setSelectedPH8, selectIcUnit, setSelectUnit, getIcUnit, getWareHouse, selectWareHouse, setSelectWareHouse, selectGroupProduct, setSelectGroupProduct,
        selectUnitCost, setSelectUnitCost, selectTypeUnitCost, setSelectTypeUnitCost

    } = PurchasingHook();

    const handleFormSubmit = async () => {
        try {
            const data = {
                ph1: selectedPH1,
                ph2: selectedPH2,
                ph3: selectedPH3,
                ph4: selectedPH4,
                ph5: selectedPH5,
                ph6: selectedPH6,
                ph7: selectedPH7,
                ph8: selectedPH8,
                name_1: name1,
                name_2: name2,
                unit_code: selectIcUnit,
                wh_code: whCode,
                sh_code: shCode,
                user_created: "admin"
            };

            const res = await api.post("/pms/product-draft", data);
            console.log("Product draft created:", res.data);
        } catch (error) {
            console.error("Error creating product draft:", error);
        }
    };

    const options = [
        { value: '1', label: 'Jack' },
        { value: '2', label: 'Lucy' },
        { value: '3', label: 'Tom' },
    ];

    return <div className="font-['Noto_Sans_Lao'] min-h-screen border p-4 ">
        <div className="flex gap-4">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} variant="solid" color="primary" children={"ຍອ້ນກັບ"} />
            <h3>ເພີ່ມສີນຄ້າການຈັດຊື້</h3>
        </div>
        <Divider />
        <Form
            form={form}
            onFinish={handleFormSubmit}
            layout="vertical"
            initialValues={{
                ph1: selectedPH1,
                ph2: selectedPH2,
                ph3: selectedPH3,
                ph4: selectedPH4,
                ph5: selectedPH5,
                ph6: selectedPH6,
                ph7: selectedPH7,
                ph8: selectedPH8,
            }}
        >
            <div className=" grid grid-cols-3 w-full gap-4 p-2">
                <LabeledSelect
                    icon={<Package size={16} />}
                    label="ໝວດສີນຄ້າຫລັກ (PH1)"
                    placeholder="Select a person"
                    options={getProductPHOne.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH1}
                    onChange={(code) => {
                        setSelectedPH1(code);
                        loadPHTwo(code);
                    }}
                />
                <LabeledSelect
                    icon={<Package size={16} />}
                    label="ໝວດສີນຄ້າຍອ່ຍ1 (PH2)"
                    placeholder="Select a person"
                    options={getProductPHTwo.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH2}
                    onChange={(code) => {
                        setSelectedPH2(code);
                        loadPHThree(selectedPH1, code);
                    }}
                />
                <LabeledSelect
                    icon={<Package size={16} />}
                    label="ໝວດສີນຄ້າຍອ່ຍ2 (PH3)"
                    placeholder="Select a person"
                    options={getProductPHThree.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH3}
                    onChange={setSelectedPH3}
                />
                <LabeledSelect
                    icon={<Tag size={16} />}
                    label="ປະເພດສີນຄ່າ (PH4)"
                    placeholder="Select a person"
                    options={getProductPHFour.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH4}
                    onChange={setSelectedPH4}
                />
                <LabeledSelect
                    icon={<Tag size={16} />}
                    label="ຊື່ສີນຄ້າ"
                    placeholder="Select a person"
                    options={options}
                    filterOption={filterOptionUtil}
                    value={selected}
                    onChange={setSelected}
                />
                <LabeledSelect
                    icon={<Tag size={16} />}
                    label="ຍີ່ຫໍ້(PH5)"
                    placeholder="Select a person"
                    options={getProductPHFive.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH5}
                    onChange={setSelectedPH5}
                />
                <LabeledSelect
                    icon={<Palette size={16} />}
                    label="ຮູບແບບ(PH6)"
                    placeholder="Select a person"
                    options={getProductPHSix.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    onChange={setSelectedPH6}
                    filterOption={filterOptionUtil}
                    value={selectedPH6}
                />
                <LabeledSelect
                    icon={<Ruler size={16} />}
                    label="ຂະໜາດ(PH7)"
                    placeholder="Select a person"
                    options={getProductPHSeven.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH7}
                    onChange={setSelectedPH7}
                />
                <LabeledSelect
                    icon={<Layers size={16} />}
                    label="ອອກແບບ(PH8)"
                    placeholder="Select a person"
                    options={getProductPHEig.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectedPH8}
                    onChange={setSelectedPH8}
                />
                <LabeledSelect
                    icon={<Building2 size={16} />}
                    label="ສົ່ງຈາກສາຂາ"
                    placeholder="Select a person"
                    options={OPTION_MERCHANT}
                    filterOption={filterOptionUtil}
                    value={selectWareHouse}
                    onChange={setSelectWareHouse}
                />
                <LabeledSelect
                    icon={<Users size={16} />}
                    label="ກຸ່ມສີນຄ້າ"
                    placeholder="Select a person"
                    options={OPTION_PRODUCT_GROUP}
                    filterOption={filterOptionUtil}
                    value={selectGroupProduct}
                    onChange={setSelectGroupProduct}
                />
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ປະເພດໜວ່ຍນັບ"
                    placeholder="Select a person"
                    options={getIcUnit.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selectIcUnit}
                    onChange={setSelectUnit}
                />
                <LabeledSelect
                    icon={<DollarSign size={16} />}
                    label="ປະເພດຕົ້ນທືນ"
                    placeholder="Select a person"
                    options={OPTION_TYPE_COST}
                    filterOption={filterOptionUtil}
                    value={selectTypeUnitCost}
                    onChange={setSelectTypeUnitCost}
                />
                {/* <LabeledSelect
                icon={<DollarSign size={16} />}
                label="models"
                placeholder="Select a person"
                options={options}
                filterOption={filterOptionUtil}
                value={selected}
                onChange={setSelected}
            /> */}
                <LabeledSelect
                    icon={<DollarSign size={16} />}
                    label="ຫົວໜວ່ຍຕົ້ນທືນ"
                    placeholder="Select a person"
                    options={OPTION_COST}
                    filterOption={filterOptionUtil}
                    value={selectUnitCost}
                    onChange={setSelectUnitCost}
                />
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ຫົວໜວ່ຍຍອດຄົງເຫຼືອ"
                    placeholder="Select a person"
                    options={options}
                    filterOption={filterOptionUtil}
                    value={selectUnitCost}
                    onChange={setSelectUnitCost}
                    disabled
                />
            </div>
            <div className="flex gap-4 px-2">
                <TextInput
                    icon={<Tag size={16} />}
                    label="ຊື່ສິນຄ້າໃນລະບົບ(ພາສາລາວ)"
                    placeholder="Select a person"
                />
                <TextInput
                    icon={<Tag size={16} />}
                    label=" ຊື່ສິນຄ້າໃນລະບົບ(ພາສາໄທ)"
                    placeholder="Select a person"
                />
            </div>
            <div className="grid grid-cols-3 px-2 gap-4">
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ສາງສັ່ງຊື້ເລີ້ມຕົ້ນ"
                    placeholder="Select a person"
                    options={getWareHouse.map(item => ({
                        label: item.name_1,
                        value: item.code
                    }))}
                    filterOption={filterOptionUtil}
                    value={selected}
                    onChange={setSelected}
                />
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ບອ່ນເກັບສາງສັ່ງຊື້ເລີ່ມຕົ້ນ"
                    placeholder="Select a person"
                    options={options}
                    filterOption={filterOptionUtil}
                    value={selected}
                    onChange={setSelected}
                />
                <TextInput
                    icon={<Tag size={16} />}
                    label="ຫົວໜວ່ຍສັ່ງຊື້ເລີ່ມຕົ້ນ"
                    placeholder="Select a person"
                />
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ສາງສັ່ງຊື້ເລີ້ມຕົ້ນ"
                    placeholder="Select a person"
                    options={options}
                    filterOption={filterOptionUtil}
                    value={selected}
                    onChange={setSelected}
                />
                <LabeledSelect
                    icon={<Calculator size={16} />}
                    label="ບອ່ນເກັບສາງສັ່ງຊື້ເລີ່ມຕົ້ນ"
                    placeholder="Select a person"
                    options={options}
                    filterOption={filterOptionUtil}
                    value={selected}
                    onChange={setSelected}
                />
                <TextInput
                    icon={<Tag size={16} />}
                    label="ຫົວໜວ່ຍສັ່ງຊື້ເລີ່ມຕົ້ນ"
                    placeholder="Select a person"
                />

            </div>
            <div className="flex justify-end px-2">
                <button className="flex items-center gap-2 px-8 py-2 text-white bg-green-600 rounded-md">
                    <Save className="w-5 h-5" />
                    ບັນທຶກ
                </button>
            </div>
        </Form>

    </div>
}

export default CreatePurchasingProduct;