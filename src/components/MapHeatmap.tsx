import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat"; // adds L.heatLayer
import type { LatLngExpression } from "leaflet";
import './MapHeatmap.css'; // small CSS for height

type SensorPoint = { id: number; lat: number; lng: number; value: number; name?: string };

export default function MapHeatmap({ points = [] as SensorPoint[] }: { points: SensorPoint[] }) {
  // center fallback
  const center: LatLngExpression = points.length ? [points[0].lat, points[0].lng] : [21.0278, 105.8342];

  useEffect(() => {
    // add heat layer programmatically because react-leaflet has no built-in heat wrapper
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = (document.querySelector('.aqm-map') as any)?._leaflet_map;
    // note: (document... ) hack used when you need raw map instance. Alternatively use useMap() inside children.
    // Simpler approach: create layer every render via setTimeout to wait map init (this is pragmatic).
    if (!map) return;

    // convert points: [lat, lng, intensity] intensity normalized 0..1
    const heatData = points.map(p => [p.lat, p.lng, Math.min(1, p.value / 200)]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = (map as any).__aqmHeat;
    if (existing) {
      existing.setLatLngs(heatData);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heat = (L as any).heatLayer(heatData, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).__aqmHeat = heat;
    }
  }, [points]);

  return (
    <div className="card card-aqm p-0">
      <MapContainer className="aqm-map" center={center} zoom={12} style={{ height: 420 }}>
        <TileLayer
          attribution='&copy; OSM contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png
          // https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png
        />
        {points.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div>
                <strong>{p.name || `Sensor ${p.id}`}</strong>
                <div>Value: {p.value}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
