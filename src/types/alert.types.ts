// src/types/alert.types.ts (NEW FILE)
export type Alert = {
  id: number;
  pollutant: string;
  value: number;
  locationName: string; // ✅ Changed from location.name to locationName
  triggeredAt: string;
  isRead: boolean;
  status?: string;
};

export type AlertThreshold = {
  id?: number;
  userId?: number;
  pm25Threshold?: number;
  pm10Threshold?: number;
  aqiThreshold?: number;
};