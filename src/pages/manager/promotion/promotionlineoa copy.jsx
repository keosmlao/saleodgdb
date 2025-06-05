import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Navbar from '../../components/Navbar';
import CustomerinterestQTY from './customerinterestQTY';
import CustomerPointRedeem from './customerPointRedeem';
import CustomerRedeem from './customerRedeem'
import DonutGroup from './DonutGroup'
import PromotionDashboard from './PromotionDashboard';
export default function PromotionLineoa() {
    const [buOptions, setBuOptions] = useState([]);
    const [channelOptions, setChannelOptions] = useState([]);
    const [promotionOptions, setPromotionOptions] = useState([]);

    const [selectedBU, setSelectedBU] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    // ✅ Load BU list
    useEffect(() => {
        axios.get('https://www.odienmall.com/pmt_fetch_product_group') // <-- เปลี่ยนเป็น URL จริง
            .then((res) => {
                const options = res.data.data_list.map(bu => ({
                    value: bu.code,
                    label: bu.name_1,
                }));
                setBuOptions(options);
            })
            .catch(err => console.error('❌ BU API error:', err));
    }, []);

    // ✅ Load Channels when BU selected
    const handleBUChange = (value) => {
        setSelectedBU(value);
        setSelectedChannel(null);
        setSelectedPromotion(null);
        setPromotionOptions([]);
        if (value) {
            axios.get(`https://www.odienmall.com/pmt_fetch_channel_group/${value.value}`)
                .then((res) => {
                    const options = res.data.data_list.map(channel => ({
                        value: channel.channel_group,
                        label: channel.channel_name,
                    }));
                    setChannelOptions(options);
                })
                .catch(err => console.error('❌ Channel API error:', err));
        } else {
            setChannelOptions([]);
        }
    };

    // ✅ Load Promotions when Channel selected
    const handleChannelChange = (value) => {
        setSelectedChannel(value);
        setSelectedPromotion(null);
        const payload = {
            product_group: selectedBU.value,
            channel_group: value.value,
        };
        console.log(payload)
        if (selectedBU && value) {
            axios.post(`https://www.odienmall.com/pmt_fetch_pmt_list`, payload)
                .then((res) => {

                    const options = res.data.data_list.map(p => ({
                        value: p.pro_code,
                        label: p.pro_name,
                    }));
                    setPromotionOptions(options);
                })
                .catch(err => console.error('❌ Promotion API error:', err));
        } else {
            setPromotionOptions([]);
        }
    };

    return (
        <>
            <Navbar />
            <div className="m-3">
                <PromotionDashboard />
                <h2 className="mb-4 text-success">🎯 Promotion</h2>
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3">
                            {/* BU */}
                            <div className="col-md-4">
                                <label className="form-label">1. ເລືອກ BU</label>
                                <Select
                                    options={buOptions}
                                    value={selectedBU}
                                    onChange={handleBUChange}
                                    placeholder="ເລືອກ BU..."
                                    isClearable
                                    isSearchable
                                    styles={selectStyle}
                                />
                            </div>

                            {/* Channel */}
                            <div className="col-md-4">
                                <label className="form-label">2. ເລືອກ Channel</label>
                                <Select
                                    options={channelOptions}
                                    value={selectedChannel}
                                    onChange={handleChannelChange}
                                    placeholder="ເລືອກ Channel..."
                                    isClearable
                                    isDisabled={!selectedBU}
                                    styles={selectStyle}
                                />
                            </div>

                            {/* Promotion */}
                            <div className="col-md-4">
                                <label className="form-label">3. ເລືອກ Promotion</label>
                                <Select
                                    options={promotionOptions}
                                    value={selectedPromotion}
                                    onChange={setSelectedPromotion}
                                    placeholder="ເລືອກ Promotion..."
                                    isClearable
                                    isSearchable
                                    isDisabled={!selectedChannel}
                                    styles={selectStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center position-relative my-4">
                    <hr />
                    <span
                        style={{
                            position: 'absolute',
                            top: '-14px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#fff',
                            padding: '0 10px',
                            color: '#0d6efd',
                            fontWeight: 'bold'
                        }}
                    >
                        ✨ Promotion Summary ✨
                    </span>
                </div>

                <div className="card">
                    <div className="card-body">
                        <CustomerinterestQTY
                            value1={selectedBU?.value || ''}
                            value2={selectedChannel?.value || ''}
                            value3={selectedPromotion?.value || ''}
                        />
                        <CustomerPointRedeem
                            value1={selectedBU?.value || ''}
                            value2={selectedChannel?.value || ''}
                            value3={selectedPromotion?.value || ''}
                        />
                        <div className="row">

                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <DonutGroup />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <DonutGroup />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <DonutGroup />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CustomerRedeem/>
                    </div>
                </div>
            </div>
        </>
    );
}

// ✅ Reusable custom style
const selectStyle = {
    control: (base) => ({
        ...base,
        fontFamily: 'Noto Sans Lao, sans-serif',
        fontSize: '14px',
        minHeight: '38px',
    }),
    menu: (base) => ({
        ...base,
        fontFamily: 'Noto Sans Lao, sans-serif',
        fontSize: '14px',
    }),
    option: (base, state) => ({
        ...base,
        fontFamily: 'Noto Sans Lao, sans-serif',
        fontSize: '14px',
        backgroundColor: state.isFocused ? '#f1f1f1' : 'white',
        color: '#212529',
    }),
    placeholder: (base) => ({
        ...base,
        fontFamily: 'Noto Sans Lao, sans-serif',
        fontSize: '14px',
    }),
    singleValue: (base) => ({
        ...base,
        fontFamily: 'Noto Sans Lao, sans-serif',
        fontSize: '14px',
    }),
};
