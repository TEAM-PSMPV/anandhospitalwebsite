"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: "rating" in metric ? metric.rating : undefined,
      navigationType: "navigationType" in metric ? metric.navigationType : undefined,
      path: window.location.pathname,
    });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/web-vitals", new Blob([body], { type: "application/json" }));
    else void fetch("/api/web-vitals", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
  });
  return null;
}
