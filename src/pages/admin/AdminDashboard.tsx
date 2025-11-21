// src/pages/admin/AdminDashboard.tsx
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GlassCard: React.FC<any> = ({children, className=""}) => (
  <div className={`aqm-glass ${className}`}>{children}</div>
);

export default function AdminDashboard(){
  return (
    <>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
        <div>
          <h2 style={{margin:0}}>Operations Dashboard</h2>
          <div className="small-muted">Dark Ops · Live Console</div>
        </div>
        <div>
          {/* quick controls */}
          <button className="aqm-btn-ghost">Deploy</button>
          <button className="aqm-btn-danger" style={{marginLeft:8}}>Alert</button>
        </div>
      </div>

      <div className="aqm-grid" style={{marginBottom:16}}>
        <div className="aqm-col-4">
          <GlassCard>
            <div className="aqm-stat">
              <div>
                <div className="small-muted">Location</div>
                <div style={{fontSize:22, fontWeight:700}}>Hanoi</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:28, color:"var(--aqm-blood)", fontWeight:800}}>152</div>
                <div className="small-muted">AQI — Critical</div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="aqm-col-8">
          <GlassCard>
            <div style={{display:"flex", gap:12}}>
              <div style={{flex:1}}>
                <h4 style={{margin:0}}>Real-time Map</h4>
                <div className="small-muted">Heatmap & sensor coverage</div>
                <div style={{height:220, marginTop:12, borderRadius:12, overflow:"hidden", background:"#060606"}}> {/* placeholder map */}</div>
              </div>

              <div style={{width:300}}>
                <h4 style={{margin:0}}>Alerts</h4>
                <div className="small-muted">Latest triggered alerts</div>
                <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:10}}>
                  <div className="aqm-stat">
                    <div><strong>Sensor A12</strong><div className="small-muted">pm2.5 spike</div></div>
                    <div className="text-blood">ACTIVE</div>
                  </div>
                  <div className="aqm-stat">
                    <div><strong>Sensor B07</strong><div className="small-muted">offline</div></div>
                    <div className="text-neon">WARN</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="aqm-grid">
        <div className="aqm-col-3">
          <GlassCard>
            <h5>Sensor Health</h5>
            <div className="small-muted">Summary</div>
            <div style={{height:120}}></div>
          </GlassCard>
        </div>
        <div className="aqm-col-6">
          <GlassCard>
            <h5>Radar</h5>
            <div className="aqm-radar" />
          </GlassCard>
        </div>
        <div className="aqm-col-3">
          <GlassCard>
            <h5>Quick Actions</h5>
            <div style={{display:"flex", flexDirection:"column", gap:8, marginTop:12}}>
              <button className="aqm-btn-ghost">Restart Sensor</button>
              <button className="aqm-btn-ghost">Force Sync</button>
              <button className="aqm-btn-danger">Trigger Alert</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
