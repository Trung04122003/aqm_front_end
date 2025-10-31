// import React from "react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid } from "recharts";

type DataPoint = { ts: string; value: number };

export default function ChartWrapper({ data, dataKey = "value", height = 220 }: { data: DataPoint[]; dataKey?: string; height?: number }) {
  return (
    <div className="card card-aqm p-3" style={{ minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5b7" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0ea5b7" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="ts" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke="#0ea5b7" fill="url(#colorVal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
