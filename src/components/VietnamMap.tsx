// src/components/VietnamMap.tsx - COMPLETE VIETNAM MAP 🇻🇳
import { motion } from "framer-motion";
import { useMemo } from "react";

type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

type MapProps = {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  aqiData?: Map<number, number>; // locationId -> AQI value
};

export default function VietnamMap({ locations, selectedId, onSelect, aqiData }: MapProps) {
  
  // ✅ Convert lat/lng to SVG coordinates (Vietnam bounds: lat 8-24, lng 102-110)
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - 102) / 8) * 100; // 0-100%
    const y = ((24 - lat) / 16) * 100; // 0-100% (inverted)
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(140, y)) };
  };

  // ✅ Get AQI color - FIXED to use actual AQI data
  const getAQIColor = (locationId: number) => {
    const aqi = aqiData?.get(locationId);
    if (!aqi) return "#9ca3af"; // Gray for no data
    if (aqi <= 50) return "#10b981";     // Good (Green)
    if (aqi <= 100) return "#fbbf24";    // Moderate (Yellow)
    if (aqi <= 150) return "#f97316";    // Unhealthy (Orange)
    if (aqi <= 200) return "#ef4444";    // Very Unhealthy (Red)
    return "#991b1b";                    // Hazardous (Dark Red)
  };

  // ✅ Calculate map points with dynamic colors
  const mapPoints = useMemo(() => {
    return locations.map(loc => {
      const pos = getPosition(loc.latitude || 0, loc.longitude || 0);
      const color = getAQIColor(loc.id); // ✅ Use actual AQI data
      const isSelected = loc.id === selectedId;
      const aqi = aqiData?.get(loc.id);
      
      return {
        id: loc.id,
        name: loc.name,
        x: pos.x,
        y: pos.y,
        aqi,
        color,
        isSelected
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, selectedId, aqiData]);

  // ✅ Hoàng Sa, Trường Sa, Phú Quốc coordinates
  const islands = [
    { name: "Hoàng Sa", lat: 16.5, lng: 112.0, icon: "🏝️" },
    { name: "Trường Sa", lat: 8.6, lng: 111.9, icon: "🏝️" },
    { name: "Phú Quốc", lat: 10.2, lng: 103.9, icon: "🏖️" }
  ];

  const islandPoints = islands.map(island => ({
    ...island,
    ...getPosition(island.lat, island.lng)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card border-0 shadow-lg"
      style={{ 
        borderRadius: 20, 
        border: "3px solid #FFD700",
        background: "linear-gradient(135deg, #E0F7FA 0%, #FFFAFA 100%)"
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: "#C41E3A" }}>
            🗺️ Vietnam Coverage
          </h5>
          <span className="badge" style={{ 
            background: "linear-gradient(135deg, #165B33, #50C878)", 
            color: "white",
            padding: "6px 12px",
            borderRadius: 8
          }}>
            {locations.length} Provinces
          </span>
        </div>

        {/* Map Container */}
        <div 
          className="position-relative" 
          style={{ 
            width: "100%", 
            paddingBottom: "140%", // Vietnam is tall
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
            border: "2px solid #FFD700"
          }}
        >
          <svg 
            className="position-absolute top-0 start-0 w-100 h-100"
            viewBox="0 0 100 140"
            preserveAspectRatio="xMidYMid meet"
            style={{ background: "#f0f9ff" }}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e0e0e0" strokeWidth="0.3"/>
              </pattern>
              
              {/* Water pattern for sea */}
              <pattern id="water" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.5" fill="#93c5fd" opacity="0.3"/>
              </pattern>
            </defs>
            
            {/* Ocean background */}
            <rect width="100" height="140" fill="url(#water)" />
            <rect width="100" height="140" fill="url(#grid)" />

            {/* 🏝️ HOÀNG SA, TRƯỜNG SA, PHÚ QUỐC */}
            {islandPoints.map((island, idx) => (
              <g key={`island-${idx}`}>
                {/* Island marker with glow */}
                <motion.circle
                  cx={island.x}
                  cy={island.y}
                  r="3"
                  fill="#0ea5e9"
                  opacity="0.2"
                  animate={{ r: [3, 4.5, 3], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <circle
                  cx={island.x}
                  cy={island.y}
                  r="1.5"
                  fill="#0284c7"
                  stroke="white"
                  strokeWidth="0.5"
                />
                
                {/* Island label */}
                <text
                  x={island.x}
                  y={island.y - 3}
                  textAnchor="middle"
                  fontSize="2.5"
                  fontWeight="bold"
                  fill="#0284c7"
                >
                  {island.icon}
                </text>
                
                <text
                  x={island.x}
                  y={island.y + 5}
                  textAnchor="middle"
                  fontSize="1.8"
                  fontWeight="600"
                  fill="#0369a1"
                >
                  {island.name}
                </text>

                {/* Sovereignty indicator */}
                <motion.circle
                  cx={island.x}
                  cy={island.y}
                  r="2"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                  animate={{ r: [2, 3.5, 2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </g>
            ))}

            {/* Province Points */}
            {mapPoints.map(point => (
              <g key={point.id}>
                {/* Pulse animation for selected */}
                {point.isSelected && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={point.color}
                    opacity="0.3"
                    animate={{ r: [2, 5, 2], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Point with dynamic color */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={point.isSelected ? "1.8" : "1.2"}
                  fill={point.color} // ✅ Dynamic color based on AQI
                  stroke="white"
                  strokeWidth={point.isSelected ? "0.6" : "0.4"}
                  style={{ cursor: "pointer" }}
                  whileHover={{ r: 2.2, strokeWidth: 0.8 }}
                  onClick={() => onSelect(point.id)}
                  animate={{
                    fill: point.color // ✅ Animate color changes
                  }}
                  transition={{ duration: 0.5 }}
                />

                {/* Tooltip */}
                <title>
                  {point.name}
                  {point.aqi ? ` (AQI: ${point.aqi})` : ' (No data)'}
                </title>
              </g>
            ))}

            {/* Vietnam label */}
            <text
              x="50"
              y="8"
              textAnchor="middle"
              fontSize="4"
              fontWeight="bold"
              fill="#C41E3A"
              opacity="0.3"
            >
              VIỆT NAM
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3">
          <div className="small text-muted mb-2 fw-bold">AQI Scale:</div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { label: "Good", color: "#10b981", range: "0-50" },
              { label: "Moderate", color: "#fbbf24", range: "51-100" },
              { label: "Unhealthy", color: "#f97316", range: "101-150" },
              { label: "Very Unhealthy", color: "#ef4444", range: "151-200" },
              { label: "Hazardous", color: "#991b1b", range: "200+" },
              { label: "No Data", color: "#9ca3af", range: "" },
            ].map(item => (
              <div key={item.label} className="d-flex align-items-center gap-1" style={{ fontSize: "0.75rem" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: item.color,
                    border: "2px solid white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                  }}
                />
                <span className="text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sovereignty Note */}
        <div className="mt-2 p-2 rounded-3" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
          <div className="small" style={{ color: "#1e40af" }}>
            🏝️ <strong>Lãnh thổ biển/Marine territory:</strong> Hoàng Sa, Trường Sa, Phú Quốc
          </div>
        </div>

        {/* Stats */}
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-3"
            style={{ background: "rgba(196, 30, 58, 0.05)", border: "2px solid #FFD700" }}
          >
            <div className="small text-muted mb-1">Selected Province:</div>
            <div className="fw-bold" style={{ color: "#C41E3A" }}>
              {locations.find(l => l.id === selectedId)?.name}
            </div>
            {aqiData?.get(selectedId) && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <div 
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: getAQIColor(selectedId),
                    border: "2px solid white"
                  }}
                />
                <span className="small" style={{ color: "#165B33" }}>
                  Current AQI: <strong>{aqiData.get(selectedId)}</strong>
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}