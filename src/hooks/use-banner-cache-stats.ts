import { useState, useEffect } from "react";
import { bannerCache } from "@/lib/banner-cache";

export function useBannerCacheStats() {
  const [stats, setStats] = useState(bannerCache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(bannerCache.getStats());
    }, 5000); // Update stats every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getCacheHitRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.valid / stats.total) * 100);
  };

  const getCacheEfficiency = () => {
    const hitRate = getCacheHitRate();
    if (hitRate >= 80) return "Excellent";
    if (hitRate >= 60) return "Good";
    if (hitRate >= 40) return "Fair";
    return "Poor";
  };

  return {
    stats,
    hitRate: getCacheHitRate(),
    efficiency: getCacheEfficiency(),
    isHealthy: stats.expired === 0,
  };
}
