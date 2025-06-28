import { useEffect, useState } from "react"
import api from "../services/api"

const PurchasingHook = () => {
    const [getProductPHOne, setGetProductPHOne] = useState([])
    const [getProductPHTwo, setGetProductPHTWO] = useState([])
    const [getProductPHThree, setGetProductPHThree] = useState([])
    const [getProductPHFour, setGetProductPHFour] = useState([])
    const [getProductPHFive, setGetProductPHFive] = useState([])
    const [getProductPHSix, setGetProductPHSix] = useState([])
    const [getProductPHSeven, setGetProductPHSeven] = useState([])
    const [getProductPHEig, setGetProductPHEig] = useState([])
    const [getWareHouse, setGetWareHouse] = useState([])
    const [getLocation, setGetLocation] = useState([]);
    const [getIcUnit, setGetIcUnit] = useState([])
    const [selectedPH1, setSelectedPH1] = useState(null);
    const [selectedPH2, setSelectedPH2] = useState(null);
    const [selectedPH3, setSelectedPH3] = useState(null);
    const [selectedPH4, setSelectedPH4] = useState(null);
    const [selectedPH5, setSelectedPH5] = useState(null);
    const [selectedPH6, setSelectedPH6] = useState(null);
    const [selectedPH7, setSelectedPH7] = useState(null);
    const [selectedPH8, setSelectedPH8] = useState(null);
    const [selectIcUnit, setSelectUnit] = useState()
    const [selectWareHouse, setSelectWareHouse] = useState();
    const [selectSellWareHouse, setSelectSellWareHouse] = useState();
    const [selectGroupProduct, setSelectGroupProduct] = useState();
    const [selectUnitCost, setSelectUnitCost] = useState("ຫົວໜວ່ຍນັບດຽວ")
    const [selectTypeUnitCost, setSelectTypeUnitCost] = useState("ຕົ້ນທຶນສະເລ່ຍ")
    const [getAllProductPending, setGetAllProductpending] = useState([]);
    const [getModel, setModel] = useState("")


    const loadPHOne = async () => {
        try {
            const res = await api.get("/pms/icgroupmain");
            setGetProductPHOne(res.data)
        } catch (error) {
            throw error;
        }
    }

    const loadPHTwo = async (mainCode) => {
        try {
            const res = await api.get(`/pms/icgroupsub?main_group=${mainCode}`);
            setGetProductPHTWO(res.data)
        } catch (error) {
            throw error;
        }
    }

    const loadPHThree = async (mainCode, groupCode) => {
        try {
            const res = await api.get(`/pms/icgroupsub2?main_group=${mainCode}&group_sub=${groupCode}`)
            setGetProductPHThree(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadPHFour = async () => {
        try {
            const res = await api.get(`/pms/iccategory`)
            setGetProductPHFour(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadPHFive = async () => {
        try {
            const res = await api.get(`/pms/icbrand`)
            setGetProductPHFive(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadPHSix = async () => {
        try {
            const res = await api.get(`/pms/icpattern`)
            setGetProductPHSix(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadSeven = async () => {
        try {
            const res = await api.get(`/pms/icsize`);
            setGetProductPHSeven(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadEig = async () => {
        try {
            const res = await api.get(`/pms/icdesign`);
            setGetProductPHEig(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadIcUnit = async () => {
        try {
            const res = await api.get(`/pms/icunit`);
            setGetIcUnit(res.data)
        } catch (error) {
            throw error
        }
    }
    const loadWareHouse = async () => {
        try {
            const res = await api.get(`/pms/icwarehouse`)
            setGetWareHouse(res.data)

        } catch (error) {
            throw error
        }
    }

    const loadGetAllProductPending = async () => {
        try {
            const res = await api.get(`/pms/productpending?user_created=admin`);
            setGetAllProductpending(res.data);
        } catch (error) {
            throw error
        }
    }

    const loadGetAllLocaion = async () => {
        try {
            const res = await api.get(`/pms/icshelf`);
            setGetLocation(res.data);
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        loadPHOne();
        loadPHTwo();
        loadPHThree()
    }, []);

    useEffect(() => {
        loadPHFour();
        loadPHFive();
        loadPHSix();
        loadSeven();
        loadEig();
        loadIcUnit();
        loadWareHouse();
        loadGetAllLocaion()
    }, [])
    useEffect(() => {
        loadGetAllProductPending();
    }, [])

    return {
        getProductPHOne,
        selectedPH1,
        setSelectedPH1,
        getProductPHTwo,
        selectedPH2,
        setSelectedPH2,
        loadPHTwo,
        getProductPHThree,
        selectedPH3,
        setSelectedPH3,
        loadPHThree,
        getProductPHFour,
        selectedPH4, setSelectedPH4, getProductPHFive, selectedPH5, setSelectedPH5, getProductPHSix, selectedPH6, setSelectedPH6,
        getProductPHSeven, selectedPH7, setSelectedPH7, getProductPHEig, selectedPH8, setSelectedPH8,
        selectIcUnit, setSelectUnit, getIcUnit, getWareHouse, selectWareHouse, setSelectWareHouse, selectGroupProduct, setSelectGroupProduct, selectUnitCost, setSelectUnitCost,
        selectTypeUnitCost, setSelectTypeUnitCost, getAllProductPending, getModel, setModel, selectSellWareHouse, setSelectSellWareHouse,
        getLocation
    }

}

export default PurchasingHook;