// src/components/VietnamHeatmap.tsx - AQI HEATMAP VISUALIZATION 🔥
import { motion } from "framer-motion";
import { useMemo } from "react";

type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

type HeatmapProps = {
  locations: Location[];
  aqiData: Map<number, number>; // locationId -> AQI value
  onLocationClick?: (id: number) => void;
};

export default function VietnamHeatmap({ locations, aqiData, onLocationClick }: HeatmapProps) {
  
  // ✅ Convert lat/lng to SVG coordinates
  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - 102) / 8) * 100;
    const y = ((24 - lat) / 16) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(140, y)) };
  };

  // ✅ Get heatmap color with opacity
  const getHeatColor = (aqi: number | undefined) => {
    if (!aqi) return { color: "#e5e7eb", opacity: 0.3 };
    if (aqi <= 50) return { color: "#10b981", opacity: 0.4 };
    if (aqi <= 100) return { color: "#fbbf24", opacity: 0.6 };
    if (aqi <= 150) return { color: "#f97316", opacity: 0.7 };
    if (aqi <= 200) return { color: "#ef4444", opacity: 0.8 };
    return { color: "#991b1b", opacity: 0.9 };
  };

  // ✅ Calculate statistics
  const stats = useMemo(() => {
    const aqiValues = Array.from(aqiData.values()).filter(v => v > 0);
    if (aqiValues.length === 0) return { avg: 0, max: 0, min: 0, good: 0, bad: 0 };
    
    const avg = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
    const max = Math.max(...aqiValues);
    const min = Math.min(...aqiValues);
    const good = aqiValues.filter(v => v <= 50).length;
    const bad = aqiValues.filter(v => v > 100).length;
    
    return { avg, max, min, good, bad, total: aqiValues.length };
  }, [aqiData]);

  // ✅ Prepare heatmap points
  const heatPoints = useMemo(() => {
    return locations.map(loc => {
      const pos = getPosition(loc.latitude || 0, loc.longitude || 0);
      const aqi = aqiData.get(loc.id);
      const heat = getHeatColor(aqi);
      
      return {
        id: loc.id,
        name: loc.name,
        x: pos.x,
        y: pos.y,
        aqi,
        ...heat
      };
    }).sort((a, b) => (a.aqi || 0) - (b.aqi || 0)); // Sort by AQI for z-index
  }, [locations, aqiData]);

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
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
      }}
    >
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
            🔥 Air Quality Heatmap
          </h5>
          <div className="d-flex gap-2">
            <span className="badge bg-danger">{stats.bad} Critical</span>
            <span className="badge bg-success">{stats.good} Good</span>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3 text-center" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
              <div className="small text-white-50">Average AQI</div>
              <div className="h4 fw-bold text-warning mb-0">{stats.avg}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3 text-center" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
              <div className="small text-white-50">Highest</div>
              <div className="h4 fw-bold text-danger mb-0">{stats.max}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3 text-center" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
              <div className="small text-white-50">Lowest</div>
              <div className="h4 fw-bold text-success mb-0">{stats.min}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2 rounded-3 text-center" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
              <div className="small text-white-50">Monitored</div>
              <div className="h4 fw-bold text-info mb-0">{stats.total}</div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div 
          className="position-relative" 
          style={{ 
            width: "100%", 
            paddingBottom: "140%",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: 12,
            overflow: "hidden",
            border: "2px solid rgba(255, 215, 0, 0.3)"
          }}
        >
          <svg 
            className="position-absolute top-0 start-0 w-100 h-100"
            viewBox="0 0 100 140"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Gradient definitions */}
            <defs>
              <radialGradient id="heatGlow">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

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

            {/* Grid */}
            <g opacity="0.1">
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="140" stroke="white" strokeWidth="0.2" />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="white" strokeWidth="0.2" />
              ))}
            </g>

            {/* Heatmap circles (large blur effect) */}
            {heatPoints.map(point => point.aqi && (
              <g key={`heat-${point.id}`}>
                {/* Large blur circle */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill={point.color}
                  opacity={point.opacity * 0.4}
                  style={{ filter: "blur(4px)" }}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 8, opacity: point.opacity * 0.4 }}
                  transition={{ duration: 1, delay: Math.random() * 0.5 }}
                />
                
                {/* Medium glow */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={point.color}
                  opacity={point.opacity * 0.6}
                  style={{ filter: "blur(2px)" }}
                  initial={{ r: 0 }}
                  animate={{ r: 4 }}
                  transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
                />

                {/* Core point */}
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="1.5"
                  fill={point.color}
                  stroke="white"
                  strokeWidth="0.3"
                  style={{ cursor: "pointer" }}
                  whileHover={{ r: 2, strokeWidth: 0.6 }}
                  onClick={() => onLocationClick?.(point.id)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
                />

                <title>{point.name}: AQI {point.aqi}</title>
              </g>
            ))}

            {/* Vietnam outline (simplified) */}
            <text
              x="50"
              y="70"
              textAnchor="middle"
              fontSize="6"
              fontWeight="bold"
              fill="white"
              opacity="0.05"
            >
              HEATMAP
            </text>
          </svg>
        </div>

        {/* Color Scale */}
        <div className="mt-3">
          <div className="small text-white-50 mb-2 fw-bold">Intensity Scale:</div>
          <div className="d-flex align-items-center gap-1">
            <div className="small text-white-50">Low</div>
            <div className="flex-grow-1" style={{ height: 20, borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #10b981 0%, #fbbf24 25%, #f97316 50%, #ef4444 75%, #991b1b 100%)"
              }} />
            </div>
            <div className="small text-white-50">High</div>
          </div>
        </div>

        {/* Top 5 Worst */}
        <div className="mt-3 p-3 rounded-3" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <div className="small text-white fw-bold mb-2">⚠️ Top 5 Highest AQI:</div>
          <div className="d-flex flex-column gap-1">
            {heatPoints
              .filter(p => p.aqi)
              .sort((a, b) => (b.aqi || 0) - (a.aqi || 0))
              .slice(0, 5)
              .map((point, idx) => (
                <div key={point.id} className="d-flex justify-content-between align-items-center">
                  <span className="small text-white">
                    {idx + 1}. {point.name}
                  </span>
                  <span className="badge" style={{ background: point.color }}>
                    {point.aqi}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}