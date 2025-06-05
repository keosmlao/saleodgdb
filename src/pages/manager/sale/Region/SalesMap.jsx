import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../../../services/api';

const getColor = (value) => {
  if (value >= 3000000) return 'green';
  if (value >= 1500000) return 'orange';
  return 'red';
};

const format = (value) => parseFloat(value).toLocaleString() + ' ฿';

function MapFocus({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.5 }); // 👈 Zoom level 15
    }
  }, [lat, lng]);
  return null;
}

export default function ProvinceSalesMap() {
  const [provinceSales, setProvinceSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [buList, setBuList] = useState([]);
  const [selectedBU, setSelectedBU] = useState(''); // 👈 BU ที่เลือก

  useEffect(() => {
    // โหลด BU list (สมมติ API /bu-list)
    api.get('/all/bu-list')
      .then(res => setBuList(res.data))
      .catch(err => console.error('❌ Error loading BU list:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/all/salemap${selectedBU ? `?bu=${selectedBU}` : ''}`, { timeout: 30000 })
      .then((res) => {
        const transformed = res.data.map(item => ({
          name: item.name_1 || 'ບໍ່ລະບຸ',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          total: parseFloat(item.total),
          lastYear: parseFloat(item.total_last_year) || 0,
          topProducts: (item.top5product || []).map(p => ({
            name: p.item_name,
            value: parseFloat(p.total),
          })),
        }));
        setProvinceSales(transformed);
      })
      .catch((err) => {
        console.error('❌ Error loading province sales map data:', err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedBU]);

  const handleSelectProvince = (e) => {
    const name = e.target.value;
    const found = provinceSales.find(p => p.name === name);
    setSelected(found);
  };

  const handleSelectBU = (e) => {
    setSelectedBU(e.target.value);
    setSelected(null); // reset province selection
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2" role="status"></div>
        <div>⏳ ກຳລັງໂຫຼດແຜນທີ່ຂໍ້ມູນ...</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white">
      <h5 className="fw-bold text-primary mb-3" style={{ fontSize: '15px', fontWeight: 'bold' }}>🗺️ ຂໍ້ມູນຍອດຂາຍປະຈຳແຂວງ</h5>

      <div className="mb-3 d-flex gap-2">
        {/* BU Dropdown */}
        <select className="form-select w-auto" onChange={handleSelectBU} value={selectedBU}>
          <option value="">📦 ເລືອກ BU...</option>
          {buList.map((bu, i) => (
            <option key={i} value={bu.code}>{bu.name_1}</option>
          ))}
        </select>

        {/* Province Dropdown */}
        <select className="form-select" onChange={handleSelectProvince} value={selected?.name || ''}>
          <option value="">🔍 ເລືອກແຂວງ...</option>
          {provinceSales.map((prov, i) => (
            <option key={i} value={prov.name}>{prov.name}</option>
          ))}
        </select>
      </div>

      <MapContainer center={[18.5, 104]} zoom={6.5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selected && <MapFocus lat={selected.lat} lng={selected.lng} />}

        {provinceSales.map((prov, idx) => (
          <CircleMarker
            key={idx}
            center={[prov.lat, prov.lng]}
            radius={16}
            pathOptions={{
              color: getColor(prov.total),
              fillColor: getColor(prov.total),
              fillOpacity: 0.6,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
              <div style={{ fontFamily: 'Noto Sans Lao', fontSize: '12px', lineHeight: '1.5' }}>
                <strong>{prov.name}</strong><br />
                💰 <strong style={{ fontSize: '10px' }}>ມູນຄ່າຂາຍປີ 2025:</strong> {format(prov.total)}<br />
                📅 <strong style={{ fontSize: '10px' }}>ມູນຄ່າຂາຍປີ 2024:</strong> {format(prov.lastYear)}<br />
                📦 <strong style={{ fontSize: '10px' }}>ສິນຄ້າຂາຍດີ:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2em', fontSize: '9px' }}>
                  {prov.topProducts.slice(0, 5).map((item, i) => (
                    <li key={i}>{item.name} — {format(item.value)}</li>
                  ))}
                </ul>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
