"use client";

import { useEffect, useRef, useState } from "react";

export function CountingStat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const duration = 900;
      const animate = (now: number) => {
        const progress = Math.min((now - started) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <strong ref={ref}>{display}{suffix}</strong>;
}
