
import LabeledSelect from "../../../components/LabelSelect";
import { useEffect, useState } from "react";
import { Save, Package, Tag, Palette, Ruler, Layers, Building2, Users, Calculator, DollarSign } from "lucide-react";
import TextInput from "../../../components/InputText";
import { OPTION_COST, OPTION_MERCHANT, OPTION_PRODUCT_GROUP, OPTION_PRODUCT_NAME, OPTION_TYPE_COST, OPTION_UNIT } from "../../../constant/constant";
import { Button, Divider, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PurchasingHook from "../../../hooks/purchasingHook";
import api from "../../../services/api";
import { filterOptionUtil } from "../../../utils/filter";

const CreatePurchasingProduct = () => {
    const [selected, setSelected] = useState(null);
    const [unitCount, setUnitCount] = useState("ສີນຄ້າໜວ່ຍນັບດຽວ")
    const [storageStart, setStorageStart] = useState();
    const [storageEnd, setStorageEnd] = useState();
    const [wareHouseStart, setWareHouseStart] = useState("ສາຂາOdein Thai")
    const [isUpdate, setIsUpdate] = useState(false);
    const role = localStorage.getItem("role");
    const [name2, setName2] = useState("");
    const [name1, setname1] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const param = useParams();
    const id = param.id;

    const { getProductPHOne, selectedPH1, setSelectedPH1, getProductPHTwo, selectedPH2, setSelectedPH2, loadPHTwo, getProductPHThree, loadPHThree, selectedPH3, setSelectedPH3, selectedPH4, setSelectedPH4, getProductPHFour, getProductPHFive, selectedPH5, setSelectedPH5, getProductPHSix, selectedPH6, setSelectedPH6, getProductPHSeven, selectedPH7, setSelectedPH7,
        getProductPHEig, selectedPH8, setSelectedPH8, selectIcUnit, setSelectUnit, getIcUnit, getWareHouse, selectWareHouse, setSelectWareHouse, selectGroupProduct, setSelectGroupProduct,
        selectUnitCost, setSelectUnitCost, selectTypeUnitCost, setSelectTypeUnitCost, getModel, setModel, selectSellWareHouse, setSelectSellWareHouse, getLocation, getProduct,
        selectProduct, setSelectProduct
    } = PurchasingHook();

    useEffect(() => {
        const ph5Text = selectedPH5
            ? getProductPHFive.find(item => item.code === selectedPH5)?.name_1 || ''
            : '';

        const ph6Text = selectedPH6
            ? getProductPHSix.find(item => item.code === selectedPH6)?.name_1 || ''
            : '';

        const ph7Text = selectedPH7
            ? getProductPHSeven.find(item => item.code === selectedPH7)?.name_1 || ''
            : '';

        const ph8Text = selectedPH8
            ? getProductPHEig.find(item => item.code === selectedPH8)?.name_1 || ''
            : '';

        const parts = [];
        if (ph5Text) parts.push(ph5Text);
        if (ph6Text) parts.push(ph6Text);
        if (ph7Text) parts.push(ph7Text);
        if (ph8Text) parts.push(ph8Text);
        if (getModel.trim()) {
            parts.push(getModel.trim());
        }

        setname1(parts.join(' - '));

    }, [
        selectedPH5, getProductPHFive,
        selectedPH6, getProductPHSix,
        selectedPH7, getProductPHSeven,
        selectedPH8, getProductPHEig,
        getModel
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get(`/pms/productpending/${id}`);
            const data = res.data;
            setSelectedPH1(data.ph1_code);
            await loadPHTwo(data.ph1_code);
            setSelectedPH2(data.ph2_code);
            await loadPHThree(data.ph1_code, data.ph2_code);
            setSelectedPH3(data.ph3_code);
            setSelectedPH4(data.ph4_code);
            setSelectProduct(data.product_code);
            setSelectedPH5(data.ph5_code);
            setSelectedPH6(data.ph6_code);
            setSelectedPH7(data.ph7_code);
            setSelectedPH8(data.ph8_code);
            setSelectUnit(data.unit_code)
            setSelectWareHouse(data.wh)
            setStorageStart(data.sh)
            setWareHouseStart(data.warehouse_code);
            setSelectGroupProduct(data.group_code);
            setUnitCount(data.unit_type_code);
            const modelFromName = data.name_1?.split(" - ").pop()?.trim() || '';
            setModel(modelFromName);
        };

        fetchData();
    }, [id]);


    const handleFormSubmit = async () => {
        try {
            if (id && isUpdate) {
                const data = {
                    ph1: selectedPH1,
                    ph2: selectedPH2,
                    ph3: selectedPH3,
                    ph4: selectedPH4,
                    product_name: selectProduct,
                    ph5: selectedPH5,
                    ph6: selectedPH6,
                    ph7: selectedPH7,
                    ph8: selectedPH8,
                    name_1: name1,
                    name_2: name2,
                    unit_code: selectIcUnit,
                    wh_code: selectWareHouse?.value,
                    sh_code: storageStart?.value,
                    user_created: 'admin'
                };
                const res = api.put(`/pms/product-draft/${id}`, data)
                navigate("/sale/tabpurchasing")
                return res;
            } else {
                const data = {
                    ph1: selectedPH1,
                    ph2: selectedPH2,
                    ph3: selectedPH3,
                    ph4: selectedPH4,
                    product_name: selectProduct,
                    ph5: selectedPH5,
                    ph6: selectedPH6,
                    ph7: selectedPH7,
                    ph8: selectedPH8,
                    name_1: name1,
                    name_2: name2,
                    unit_code: selectIcUnit,
                    wh_code: selectWareHouse?.value,
                    sh_code: storageStart?.value,
                    user_created: 'admin'
                };

                const res = await api.post("/pms/product-draft", data);
                form.resetFields();
                navigate("/sale/tabpurchasing")
                return res;
            }
        } catch (error) {
            throw error
        }
    };

    useEffect(() => {
        if (id) {
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, [id]);


    return <div className="font-['Noto_Sans_Lao'] min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        variant="solid"
                        color="primary"
                        className="shadow-sm hover:shadow-md transition-shadow duration-200"
                        children={"ຍອ້ນກັບ"}
                    />
                    <div>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-1">
                            {isUpdate ? 'ອັບເດດສີນຄ້າການຈັດຊື້' : 'ເພີ່ມສີນຄ້າການຈັດຊື້'}
                        </h3>
                        <p className="text-slate-500 text-sm">ຈັດການຂໍ້ມູນສີນຄ້າແລະການຈັດຊື້</p>
                    </div>
                </div>
            </div>

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
                {/* Product Classification Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800">ການຈັດປະເພດສີນຄ້າ</h4>
                            <p className="text-slate-500 text-sm">ເລືອກໝວດໝູ່ແລະປະເພດຂອງສີນຄ້າ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
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
                                className="hover:shadow-sm transition-shadow duration-200"
                            />
                        </div>
                        <div className="space-y-1">
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
                                className="hover:shadow-sm transition-shadow duration-200"
                            />
                        </div>
                        <div className="space-y-1">
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
                                className="hover:shadow-sm transition-shadow duration-200"
                            />
                        </div>
                        <div className="space-y-1">
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
                                className="hover:shadow-sm transition-shadow duration-200"
                            />
                        </div>
                        <div className="space-y-1">
                            <LabeledSelect
                                icon={<Tag size={16} />}
                                label="ຊື່ສີນຄ້າ"
                                placeholder="Select a person"
                                options={getProduct.map(item => ({
                                    label: item.name_1,
                                    value: item.code
                                }))}
                                filterOption={filterOptionUtil}
                                value={selectProduct}
                                onChange={setSelectProduct}
                                className="hover:shadow-sm transition-shadow duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800">ລາຍລະອຽດສີນຄ້າ</h4>
                            <p className="text-slate-500 text-sm">ຂໍ້ມູນລະອຽດແລະຄຸນລະກະນະຂອງສີນຄ້າ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                            onChange={(value) => {
                                setSelectedPH5(value);
                            }}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <LabeledSelect
                            icon={<Palette size={16} />}
                            label="ຮູບແບບ(PH6)"
                            placeholder="Select a person"
                            options={getProductPHSix.map(item => ({
                                label: item.name_1,
                                value: item.code
                            }))}
                            filterOption={filterOptionUtil}
                            value={selectedPH6}
                            onChange={(value) => {
                                setSelectedPH6(value);
                            }}
                            className="hover:shadow-sm transition-shadow duration-200"
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
                            onChange={(val) => {
                                setSelectedPH7(val);
                            }}
                            className="hover:shadow-sm transition-shadow duration-200"
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
                            onChange={(val) => {
                                setSelectedPH8(val);
                            }}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                    </div>
                </div>

                {/* System Configuration Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800">ການຕັ້ງຄ່າລະບົບ</h4>
                            <p className="text-slate-500 text-sm">ການຈັດການສາງ, ກຸ່ມສີນຄ້າ ແລະ ໜ່ວຍນັບ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <LabeledSelect
                            icon={<Building2 size={16} />}
                            label="ສົ່ງຈາກສາຂາ"
                            placeholder="Select a person"
                            options={OPTION_MERCHANT}
                            filterOption={filterOptionUtil}
                            value={wareHouseStart}
                            onChange={setWareHouseStart}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <LabeledSelect
                            icon={<Users size={16} />}
                            label="ກຸ່ມສີນຄ້າ"
                            placeholder="Select a person"
                            options={OPTION_PRODUCT_GROUP}
                            filterOption={filterOptionUtil}
                            value={selectGroupProduct}
                            onChange={setSelectGroupProduct}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <LabeledSelect
                            icon={<Calculator size={16} />}
                            label="ປະເພດໜວ່ຍນັບ"
                            placeholder="Select a person"
                            options={OPTION_UNIT}
                            filterOption={filterOptionUtil}
                            value={unitCount}
                            onChange={setUnitCount}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <LabeledSelect
                            icon={<DollarSign size={16} />}
                            label="ປະເພດຕົ້ນທືນ"
                            placeholder="Select a person"
                            options={OPTION_TYPE_COST}
                            filterOption={filterOptionUtil}
                            value={selectTypeUnitCost}
                            onChange={setSelectTypeUnitCost}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <TextInput
                            icon={<DollarSign size={16} />}
                            label="models"
                            placeholder="Enter model"
                            value={getModel}
                            onChange={(e) => {
                                setModel(e.target.value || '');
                            }}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />

                        <LabeledSelect
                            icon={<DollarSign size={16} />}
                            label="ຫົວໜວ່ຍຕົ້ນທືນ"
                            placeholder="Select a person"
                            options={OPTION_COST}
                            filterOption={filterOptionUtil}
                            value={selectUnitCost}
                            onChange={setSelectUnitCost}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <LabeledSelect
                            icon={<Calculator size={16} />}
                            label="ຫົວໜວ່ຍຍອດຄົງເຫຼືອ"
                            placeholder="Select a person"
                            options={getIcUnit.map(item => ({
                                label: item.name_1,
                                value: item.code
                            }))}
                            filterOption={filterOptionUtil}
                            value={selectIcUnit}
                            onChange={setSelectUnit}
                            className="opacity-60"
                        />
                    </div>
                </div>

                {/* Product Names Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800">ຊື່ສີນຄ້າໃນລະບົບ</h4>
                            <p className="text-slate-500 text-sm">ກຳນົດຊື່ສີນຄ້າເປັນພາສາລາວ ແລະ ພາສາໄທ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TextInput
                            icon={<Tag size={16} />}
                            label="ຊື່ສິນຄ້າໃນລະບົບ(ພາສາລາວ)"
                            value={name1}
                            onChange={(e) => setname1(e.target.value)}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                        <TextInput
                            name={"name_2"}
                            icon={<Tag size={16} />}
                            label="ຊື່ສິນຄ້າໃນລະບົບ(ພາສາໄທ)"
                            placeholder="Select a person"
                            value={name2}
                            onChange={(e) => setName2(e.target.value)}
                            className="hover:shadow-sm transition-shadow duration-200"
                        />
                    </div>
                </div>

                {/* Purchase & Sales Configuration Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-800">ການຕັ້ງຄ່າການຊື້-ຂາຍ</h4>
                            <p className="text-slate-500 text-sm">ກຳນົດສາງ ແລະ ໜ່ວຍສຳລັບການຊື້ຂາຍ</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Purchase Section */}
                        <div>
                            <h5 className="text-md font-medium text-slate-700 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                ການຕັ້ງຄ່າການສັ່ງຊື້
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <LabeledSelect
                                    icon={<Calculator size={16} />}
                                    label="ສາງສັ່ງຊື້ເລີ້ມຕົ້ນ"
                                    placeholder="Select a person"
                                    options={getWareHouse.map(item => ({
                                        label: item.name_1,
                                        value: item.code
                                    }))}
                                    filterOption={filterOptionUtil}
                                    value={selectWareHouse}
                                    onChange={(value) => {
                                        const selectedOption = getWareHouse.find(item => item.code === value);
                                        if (selectedOption) {
                                            setSelectWareHouse({ value, label: selectedOption.name_1 });
                                        }
                                    }}
                                    className="hover:shadow-sm transition-shadow duration-200"
                                />
                                <LabeledSelect
                                    icon={<Calculator size={16} />}
                                    label="ບອ່ນເກັບສາງສັ່ງຊື້ເລີ່ມຕົ້ນ"
                                    placeholder="Select a person"
                                    options={getLocation.map(item => ({
                                        label: item.name_1,
                                        value: item.code
                                    }))}
                                    filterOption={filterOptionUtil}
                                    value={storageStart}
                                    onChange={(value) => {
                                        const selectedOption = getLocation.find(item => item.code === value);
                                        if (selectedOption) {
                                            setStorageStart({ value, label: selectedOption.name_1 });
                                        }
                                    }}
                                    className="hover:shadow-sm transition-shadow duration-200"
                                />
                                <TextInput
                                    icon={<Tag size={16} />}
                                    value={selectIcUnit}
                                    onChange={setSelectUnit}
                                    label="ຫົວໜວ່ຍສັ່ງຊື້ເລີ່ມຕົ້ນ"
                                    placeholder="Select a person"
                                    className="hover:shadow-sm transition-shadow duration-200"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Sales Section */}
                        <div>
                            <h5 className="text-md font-medium text-slate-700 mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                ການຕັ້ງຄ່າການຂາຍ
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <LabeledSelect
                                    icon={<Calculator size={16} />}
                                    label="ສາງຂາຍເລີ້ມຕົ້ນ"
                                    placeholder="Select a person"
                                    options={getWareHouse.map(item => ({
                                        label: item.name_1,
                                        value: item.code
                                    }))}
                                    filterOption={filterOptionUtil}
                                    value={selectSellWareHouse}
                                    onChange={setSelectSellWareHouse}
                                    className="hover:shadow-sm transition-shadow duration-200"
                                />
                                <LabeledSelect
                                    icon={<Calculator size={16} />}
                                    label="ບອ່ນເກັບສາງຂາຍເລີ່ມຕົ້ນ"
                                    placeholder="Select a person"
                                    options={getLocation.map(item => ({
                                        label: item.name_1,
                                        value: item.code
                                    }))}
                                    filterOption={filterOptionUtil}
                                    value={storageEnd}
                                    onChange={setStorageEnd}
                                    className="hover:shadow-sm transition-shadow duration-200"
                                />
                                <TextInput
                                    icon={<Tag size={16} />}
                                    value={selectIcUnit}
                                    disabled
                                    onChange={setSelectUnit}
                                    label="ຫົວໜວ່ຍຂາຍເລີ່ມຕົ້ນ"
                                    placeholder="Select a person"
                                    className="hover:shadow-sm transition-shadow duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button className="group flex items-center gap-3 px-8 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5">
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">{isUpdate ? "ອັບເດດ" : "ບັນທຶກ"}</span>
                    </button>
                </div>
            </Form>
        </div>
    </div>
}

export default CreatePurchasingProduct;