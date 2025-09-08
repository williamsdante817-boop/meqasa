"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/performance";

export function WebVitals() {
  useEffect(() => {
    // Initialize Web Vitals tracking when component mounts
    initWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
