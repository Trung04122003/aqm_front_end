// src/routes/LazyRoutes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// 🎯 Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Forecast = lazy(() => import('../pages/Forecast'));
const Alerts = lazy(() => import('../pages/Alerts'));
const Reports = lazy(() => import('../pages/Reports'));
const Support = lazy(() => import('../pages/Support'));
const Profile = lazy(() => import('../pages/Profile'));
const ThresholdSettings = lazy(() => import('../pages/ThresholdSettings'));

// Loading component
const LoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #E0F7FA 0%, #B3E5FC 100%)'
  }}>
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
      <div style={{ color: '#C41E3A', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Loading...
      </div>
    </div>
  </div>
);

export default function LazyRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/thresholds" element={<ThresholdSettings />} />
      </Routes>
    </Suspense>
  );
}