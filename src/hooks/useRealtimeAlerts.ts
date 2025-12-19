// src/hooks/useRealtimeAlerts.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export interface Alert {
  id: number;
  pollutant: string;
  value: number;
  locationName: string;
  locationId: number;
  triggeredAt: string;
  isRead: boolean;
  status?: string;
  aqi?: number;
  pm25?: number;
  pm10?: number;
}

export interface AlertStats {
  total: number;
  unread: number;
  read: number;
  byPollutant: {
    'PM2.5': number;
    'PM10': number;
    'AQI': number;
  };
}

/**
 * 🔔 Real-Time Alerts Hook
 * Automatically fetches and monitors alerts
 */
export function useRealtimeAlerts(autoRefresh = true, refreshInterval = 30000) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📊 Fetch all alerts
   */
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/alerts');
      const alertData = Array.isArray(res.data) ? res.data : [];
      setAlerts(alertData);

      // Calculate unread
      const unread = alertData.filter((a: Alert) => !a.isRead);
      setUnreadAlerts(unread);
      setUnreadCount(unread.length);

      console.log(`✅ Fetched ${alertData.length} alerts (${unread.length} unread)`);

    } catch (err) {
      console.error('❌ Failed to fetch alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔔 Fetch unread alerts only
   */
  const fetchUnreadAlerts = useCallback(async () => {
    try {
      const res = await api.get('/alerts/unread');
      const unread = Array.isArray(res.data) ? res.data : [];
      setUnreadAlerts(unread);
      setUnreadCount(unread.length);

      console.log(`🔔 Fetched ${unread.length} unread alerts`);

    } catch (err) {
      console.error('❌ Failed to fetch unread alerts:', err);
    }
  }, []);

  /**
   * 📈 Fetch alert statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/alerts/stats');
      setStats(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch stats:', err);
    }
  }, []);

  /**
   * ✅ Mark alert as read
   */
  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.put(`/alerts/${id}/read`);

      // Update local state
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
      setUnreadAlerts(prev => prev.filter(a => a.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));

      toast.success('🎅 Alert marked as read!');

    } catch (err) {
      console.error('❌ Failed to mark as read:', err);
      toast.error('Failed to mark as read');
    }
  }, []);

  /**
   * 🔄 Manual trigger alert check
   */
  const triggerCheck = useCallback(async () => {
    try {
      toast.info('🔍 Checking for new alerts...');

      await api.post('/alerts/check');

      // Wait a bit then refresh
      setTimeout(() => {
        fetchAlerts();
        fetchUnreadAlerts();
        toast.success('✅ Alert check completed!');
      }, 2000);

    } catch (err) {
      console.error('❌ Failed to trigger check:', err);
      toast.error('Failed to check alerts');
    }
  }, [fetchAlerts, fetchUnreadAlerts]);

  /**
   * 🎯 Mark all as read
   */
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      const unreadAlerts = alerts.filter(a => !a.isRead);

      for (const alert of unreadAlerts) {
        await markAsRead(alert.id);
      }

      toast.success(`✅ Đã đánh dấu ${unreadAlerts.length} cảnh báo là đã đọc`);

    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("❌ Không thể đánh dấu tất cả");
    }
  };

  // Initial load
  useEffect(() => {
    fetchAlerts();
    fetchUnreadAlerts();
    fetchStats();
  }, [fetchAlerts, fetchUnreadAlerts, fetchStats]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchUnreadAlerts(); // Only fetch unread for efficiency
      fetchStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUnreadAlerts, fetchStats]);

  return {
    alerts,
    unreadAlerts,
    unreadCount,
    stats,
    loading,
    error,
    fetchAlerts,
    fetchUnreadAlerts,
    fetchStats,
    markAsRead,
    handleMarkAllAsRead,
    triggerCheck,
  };
}