// src/hooks/useRealTimeAQI.ts
import { useState, useEffect } from 'react';
import api from '../api/axios';

interface AQIData {
  id: number;
  locationId: number;
  pm25: number;
  pm10: number;
  aqi: number;
  timestampUtc: string;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}

interface UseRealTimeAQIResult {
  data: AQIData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  triggerFetch: () => Promise<void>;
}

/**
 * 🔥 React Hook for Real-Time AQI Data
 * 
 * Usage:
 * const { data, loading, error, refresh, triggerFetch } = useRealTimeAQI(locationId);
 */
export function useRealTimeAQI(locationId: number, autoRefresh = true): UseRealTimeAQIResult {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📊 Fetch latest AQI data
  const fetchLatest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/admin/aqi/latest/${locationId}`);
      setData(response.data);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to fetch AQI data:', err);
      setError(err.response?.data?.message || 'Failed to load AQI data');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Trigger manual fetch from external API
  const triggerFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post(`/admin/aqi/fetch/${locationId}`);
      
      // Wait a bit then fetch latest
      setTimeout(() => fetchLatest(), 2000);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to trigger AQI fetch:', err);
      setError(err.response?.data?.error || 'Failed to fetch new AQI data');
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLatest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLatest();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId, autoRefresh]);

  return {
    data,
    loading,
    error,
    refresh: fetchLatest,
    triggerFetch,
  };
}

// ===================================================================
// 📊 Hook for Dashboard Overview (Multiple Locations)
// ===================================================================

interface LocationAQI {
  locationId: number;
  locationName: string;
  aqi: number;
  pm25: number;
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  lastUpdated: string;
}

export function useAllLocationsAQI() {
  const [locations, setLocations] = useState<LocationAQI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all locations
      const locationsRes = await api.get('/locations');
      const allLocations = locationsRes.data;

      // Fetch latest AQI for each location
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aqiPromises = allLocations.map(async (loc: any) => {
        try {
          const aqiRes = await api.get(`/admin/aqi/latest/${loc.id}`);
          const aqiData = aqiRes.data;

          return {
            locationId: loc.id,
            locationName: loc.name,
            aqi: aqiData.aqi || 0,
            pm25: aqiData.pm25 || 0,
            status: getAQIStatus(aqiData.aqi || 0),
            lastUpdated: aqiData.timestampUtc,
          };
        } catch {
          return {
            locationId: loc.id,
            locationName: loc.name,
            aqi: 0,
            pm25: 0,
            status: 'good' as const,
            lastUpdated: new Date().toISOString(),
          };
        }
      });

      const results = await Promise.all(aqiPromises);
      setLocations(results);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to fetch all locations AQI:', err);
      setError('Failed to load AQI data');
    } finally {
      setLoading(false);
    }
  };

  const triggerFetchAll = async () => {
    try {
      setLoading(true);
      await api.post('/admin/aqi/fetch-all');
      
      // Wait for data to be fetched, then reload
      setTimeout(() => fetchAllLocations(), 3000);
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Failed to trigger fetch all:', err);
      setError('Failed to fetch new data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    refresh: fetchAllLocations,
    triggerFetchAll,
  };
}

// Helper: Determine AQI status
function getAQIStatus(aqi: number): 'good' | 'moderate' | 'unhealthy' | 'hazardous' {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 200) return 'unhealthy';
  return 'hazardous';
}
