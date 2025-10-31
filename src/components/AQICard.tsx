// import React from "react";

type Props = {
  aqi: number;
  pm25?: number;
  status?: string;
  locationName?: string;
};

function aqiColor(aqi: number) {
  if (aqi <= 50) return "var(--aqi-good)";
  if (aqi <= 100) return "var(--aqi-moderate)";
  return "var(--aqi-unhealthy)";
}

export default function AQICard({ aqi, pm25, status, locationName }: Props) {
  const color = aqiColor(aqi);
  return (
    <div className="card card-aqm p-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="text-muted small">Location</div>
          <div className="h5 mb-0">{locationName || "Unknown"}</div>
        </div>
        <div className="text-end">
          <div className="aqi-head" style={{ color }}>{aqi}</div>
          <div className="text-muted">{status || "Good"}</div>
        </div>
      </div>

      <hr />

      <div className="d-flex gap-4">
        <div>
          <div className="stat-value">{pm25 ?? "-"}</div>
          <div className="stat-label">PM2.5 (µg/m³)</div>
        </div>
        <div>
          <div className="stat-value">—</div>
          <div className="stat-label">PM10</div>
        </div>
        <div>
          <div className="stat-value">—</div>
          <div className="stat-label">NO₂</div>
        </div>
      </div>
    </div>
  );
}
