import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useSseAlerts(onMessage?: (data: any) => void) {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    // NOTE: SSE can't set custom headers; pass token as query param (dev only) OR use cookie auth.
    const url = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/alerts/stream?token=${token}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => console.log("[SSE] open");
    es.onerror = (e) => {
      console.warn("[SSE] error", e);
      // Try reconnect manualy? EventSource auto reconnects with some browsers; we can fallback.
    };
    es.onmessage = evt => {
      try {
        const payload = JSON.parse(evt.data);
        console.log("[SSE] got", payload);
        toast.info(`Alert: ${payload?.message || 'new alert'}`, { position: 'top-right' });
        onMessage?.(payload);
      } catch (err) {
        console.error("invalid sse payload", err);
      }
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [onMessage]);
}
