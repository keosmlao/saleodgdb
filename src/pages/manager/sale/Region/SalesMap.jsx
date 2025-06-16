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
    <div className="bg-white shadow-sm border-0 p-3 rounded-lg h-full min-h-screen">
      <h5 className="mb-3 font-bold text-[15px] font-[Noto_Sans_Lao]">
        🗺️ ຂໍ້ມູນຍອດຂາຍປະຈຳແຂວງ
      </h5>

        <div className="mb-3 flex flex-col sm:flex-row gap-2 items-center text-[12px] font-[Noto_Sans_Lao] py-2">
          <label className="font-bold  ">🔍 BU:</label>
          <select
            className="text-sm border rounded px-2 py-1 w-[130px]"
            onChange={handleSelectBU}
            value={selectedBU}
          >
            <option value="">📦 ເລືອກ BU...</option>
            {buList.map((bu, i) => (
              <option key={i} value={bu.code}>{bu.name_1}</option>
            ))}
          </select>

          <label className="font-bold  ">🔍 ເລືອກແຂວງ:</label>
          <select
            className="text-sm border rounded px-2 py-1 w-[130px]"
            onChange={handleSelectProvince}
            value={selected?.name || ''}
          >
            <option value="">🔍 ເລືອກແຂວງ...</option>
            {provinceSales.map((prov, i) => (
              <option key={i} value={prov.name}>{prov.name}</option>
            ))}
          </select>
        </div>


      <div className="flex-1 h-[calc(100vh-250px)]">
        <MapContainer center={[18.5, 104]} zoom={6.5} className="h-full w-full">
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
                <div className="font-sans text-[12px] leading-snug">
                  <strong>{prov.name}</strong><br />
                  💰 <strong className="text-[10px]">ມູນຄ່າຂາຍປີ 2025:</strong> {format(prov.total)}<br />
                  📅 <strong className="text-[10px]">ມູນຄ່າຂາຍປີ 2024:</strong> {format(prov.lastYear)}<br />
                  📦 <strong className="text-[10px]">ສິນຄ້າຂາຍດີ:</strong>
                  <ul className="ml-4 list-disc text-[9px] mt-1">
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
    </div>

  );
}
