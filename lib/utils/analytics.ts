import axios from 'axios';

export function logServiceView(serviceId: string) {
  const payload = JSON.stringify({
    serviceId,
    metricType: "service_view"
  });

  // Prefer sendBeacon where available
  if (navigator.sendBeacon) {
    console.log(payload)
    navigator.sendBeacon("/api/analytics", payload);
    return;
  }

  // Fallback: axios (kept short)
  axios.post("/api/analytics", { serviceId, metricType: "service_view" })
       .catch(err => console.error("Service-view log failed", err));
}
