import { useState, useEffect } from "react";

export interface NetworkStatus {
  isOnline: boolean;
  isReconnecting: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    isReconnecting: false,
    lastOnline: null,
    lastOffline: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: true,
        isReconnecting: false,
        lastOnline: new Date(),
      }));
    };

    const handleOffline = () => {
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: false,
        lastOffline: new Date(),
      }));
    };

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return networkStatus;
}

// Utility function to check if we should retry based on network status
export function shouldRetryOnNetworkError(error: unknown): boolean {
  if (typeof window === "undefined") return true;

  // Don't retry if we're offline
  if (!navigator.onLine) return false;

  // Don't retry on client errors (4xx)
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status && response.status >= 400 && response.status < 500) {
      return false;
    }
  }

  return true;
}
