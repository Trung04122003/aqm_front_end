import React from "react";

export default function StatCard({ label, value, help }: { label: string; value: React.ReactNode; help?: string }) {
  return (
    <div className="card card-aqm p-3">
      <div className="small text-muted">{label}</div>
      <div className="h4 mt-2">{value}</div>
      {help && <div className="text-muted small mt-2">{help}</div>}
    </div>
  );
}
