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

export default function SalesMapbyBU({bu}) {
  const [provinceSales, setProvinceSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get(`/bu/salemapbybu/${bu}`, { timeout: 30000 })
      .then((res) => {
        const transformed = res.data.map(item => ({
          name: item.name_1 || 'ບໍ່ລະບຸ',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng),
          total: parseFloat(item.total),
          topProducts: (item.top10product || []).map(p => ({
            name: p.item_name,
            value: parseFloat(p.total_amount),
          })),
          topCustomers: (item.top10customer || []).map(c => ({
            name: c.customername,
            value: parseFloat(c.total_amount),
          })),
        }));
        setProvinceSales(transformed);
      })
      .catch((err) => {
        console.error('❌ Error loading province sales map data:', err.message);
      })
      .finally(() => setLoading(false));
  }, [bu]);

  const handleSelect = (e) => {
    const name = e.target.value;
    const found = provinceSales.find(p => p.name === name);
    setSelected(found);
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
      <h5 className="font-bold mb-3 font-[Noto_Sans_Lao]" style={{fontSize:'12px'}}>🗺️ ຂໍ້ມູນຍອດຂາຍປະຈຳແຂວງ</h5>

      <div className="mb-3">
        <select className="form-select" onChange={handleSelect} value={selected?.name || ''}>
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
                💰 <strong style={{fontSize:'10px'}}>ມູນຄ່າຂາຍລວມ:</strong> {format(prov.total)}<br />
                📦 <strong style={{fontSize:'10px'}}>ສິນຄ້າຂາຍດີ:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2em',fontSize:'9px' }}>
                  {prov.topProducts.slice(0, 3).map((item, i) => (
                    <li key={i}>{item.name} — {format(item.value)}</li>
                  ))}
                </ul>
                🧍‍♂️ <strong style={{fontSize:'10px'}}>ຮ້ານຊື້ສູງສຸດ:</strong>
                <ul style={{ margin: 0, paddingLeft: '1.2em',fontSize:'9px' }} >
                  {prov.topCustomers.slice(0, 3).map((cust, i) => (
                    <li key={i}>{cust.name} — {format(cust.value)}</li>
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
