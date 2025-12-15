// src/components/ProvinceComparison.tsx - COMPARE TWO PROVINCES ⚖️
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExchangeAlt, FaTimes, FaChartBar } from "react-icons/fa";
import { Line } from "react-chartjs-2";

type Location = {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
};

type AQIData = {
  id: number;
  locationId: number;
  pm25: number;
  pm10: number;
  aqi: number;
  timestampUtc: string;
};

type ComparisonProps = {
  locations: Location[];
  historyData: Map<number, AQIData[]>; // locationId -> history
  onClose?: () => void;
};

export default function ProvinceComparison({ locations, historyData, onClose }: ComparisonProps) {
  const [province1, setProvince1] = useState<number | null>(null);
  const [province2, setProvince2] = useState<number | null>(null);

  // ✅ Get comparison data
  const comparison = useMemo(() => {
    if (!province1 || !province2) return null;

    const data1 = historyData.get(province1) || [];
    const data2 = historyData.get(province2) || [];

    const latest1 = data1[data1.length - 1];
    const latest2 = data2[data2.length - 1];

    if (!latest1 || !latest2) return null;

    const avg1 = data1.reduce((sum, d) => sum + d.aqi, 0) / data1.length;
    const avg2 = data2.reduce((sum, d) => sum + d.aqi, 0) / data2.length;

    return {
      province1: locations.find(l => l.id === province1),
      province2: locations.find(l => l.id === province2),
      current1: latest1,
      current2: latest2,
      avg1: Math.round(avg1),
      avg2: Math.round(avg2),
      data1,
      data2
    };
  }, [province1, province2, locations, historyData]);

  // ✅ Chart data
  const chartData = useMemo(() => {
    if (!comparison) return null;

    const labels = comparison.data1.slice(-12).map((d) => {
      try {
        return new Date(d.timestampUtc).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "";
      }
    });

    return {
      labels,
      datasets: [
        {
          label: comparison.province1?.name,
          data: comparison.data1.slice(-12).map(d => d.aqi),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: comparison.province2?.name,
          data: comparison.data2.slice(-12).map(d => d.aqi),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [comparison]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card border-0 shadow-lg"
      style={{ 
        borderRadius: 20, 
        border: "3px solid #FFD700",
        background: "white"
      }}
    >
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: "#C41E3A" }}>
            ⚖️ Province Comparison
          </h5>
          {onClose && (
            <button 
              className="btn btn-sm btn-outline-danger rounded-circle"
              onClick={onClose}
              style={{ width: 32, height: 32, padding: 0 }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Selection */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-primary">
              📍 Province 1
            </label>
            <select
              className="form-select"
              value={province1 || ""}
              onChange={(e) => setProvince1(Number(e.target.value))}
              style={{ borderRadius: 12, border: "2px solid #3b82f6" }}
            >
              <option value="">Select province...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id} disabled={loc.id === province2}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-danger">
              📍 Province 2
            </label>
            <select
              className="form-select"
              value={province2 || ""}
              onChange={(e) => setProvince2(Number(e.target.value))}
              style={{ borderRadius: 12, border: "2px solid #ef4444" }}
            >
              <option value="">Select province...</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id} disabled={loc.id === province1}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Results */}
        <AnimatePresence mode="wait">
          {comparison ? (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Current Values */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-3 h-100"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
                      border: "2px solid #3b82f6"
                    }}
                  >
                    <div className="text-center">
                      <div className="h6 fw-bold text-primary mb-2">
                        {comparison.province1?.name}
                      </div>
                      <div className="display-4 fw-bold text-primary mb-2">
                        {comparison.current1.aqi}
                      </div>
                      <div className="small text-muted mb-3">Current AQI</div>
                      
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.5)" }}>
                            <div className="small text-muted">PM2.5</div>
                            <div className="fw-bold">{comparison.current1.pm25.toFixed(1)}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.5)" }}>
                            <div className="small text-muted">PM10</div>
                            <div className="fw-bold">{comparison.current1.pm10.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="small text-muted">24h Average</div>
                        <div className="h5 fw-bold text-primary mb-0">{comparison.avg1}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="col-md-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-3 h-100"
                    style={{ 
                      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                      border: "2px solid #ef4444"
                    }}
                  >
                    <div className="text-center">
                      <div className="h6 fw-bold text-danger mb-2">
                        {comparison.province2?.name}
                      </div>
                      <div className="display-4 fw-bold text-danger mb-2">
                        {comparison.current2.aqi}
                      </div>
                      <div className="small text-muted mb-3">Current AQI</div>
                      
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.5)" }}>
                            <div className="small text-muted">PM2.5</div>
                            <div className="fw-bold">{comparison.current2.pm25.toFixed(1)}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 rounded" style={{ background: "rgba(255,255,255,0.5)" }}>
                            <div className="small text-muted">PM10</div>
                            <div className="fw-bold">{comparison.current2.pm10.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="small text-muted">24h Average</div>
                        <div className="h5 fw-bold text-danger mb-0">{comparison.avg2}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Difference Analysis */}
              <div className="p-3 rounded-3 mb-4" style={{ background: "rgba(255, 215, 0, 0.1)", border: "2px dashed #FFD700" }}>
                <div className="text-center">
                  <FaExchangeAlt size={24} style={{ color: "#FFD700" }} className="mb-2" />
                  <div className="h6 fw-bold mb-1" style={{ color: "#B8860B" }}>
                    Difference Analysis
                  </div>
                  <div className="row g-2">
                    <div className="col-4">
                      <div className="small text-muted">Current AQI</div>
                      <div className="fw-bold" style={{ color: comparison.current1.aqi > comparison.current2.aqi ? "#3b82f6" : "#ef4444" }}>
                        {Math.abs(comparison.current1.aqi - comparison.current2.aqi)} diff
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="small text-muted">Average AQI</div>
                      <div className="fw-bold" style={{ color: "#FFD700" }}>
                        {Math.abs(comparison.avg1 - comparison.avg2)} diff
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="small text-muted">Better Air</div>
                      <div className="fw-bold" style={{ color: "#10b981" }}>
                        {comparison.avg1 < comparison.avg2 ? comparison.province1?.name : comparison.province2?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Chart */}
              {chartData && (
                <div className="p-3 rounded-3" style={{ background: "#f8f9fa" }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FaChartBar style={{ color: "#C41E3A" }} />
                    <div className="fw-bold" style={{ color: "#165B33" }}>
                      12-Hour Trend Comparison
                    </div>
                  </div>
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: "top",
                          labels: { font: { size: 12, weight: "bold" } }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: "AQI Value" }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-5"
            >
              <div style={{ fontSize: "4rem" }} className="mb-3">📊</div>
              <div className="h5 text-muted">Select two provinces to compare</div>
              <p className="text-muted small">
                Choose provinces from the dropdowns above to see detailed comparison
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}