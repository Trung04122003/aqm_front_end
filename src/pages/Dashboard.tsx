// src/pages/Dashboard.tsx
import React from "react";
import MainLayout from "../layouts/MainLayout";

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <h2>Dashboard</h2>
      <p>Welcome — this is a placeholder dashboard. Hook real data later.</p>
      <div className="card">
        <div className="card-body">
          <strong>Demo AQI:</strong> 42 (Good)
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
