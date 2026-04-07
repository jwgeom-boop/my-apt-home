import { useState, useEffect, useCallback, useRef } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRecovered, setShowRecovered] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      if (wasOffline.current) {
        setShowRecovered(true);
        setTimeout(() => setShowRecovered(false), 2000);
      }
      wasOffline.current = false;
    };
    const goOffline = () => {
      setIsOnline(false);
      wasOffline.current = true;
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const retry = useCallback(() => window.location.reload(), []);

  return { isOnline, showRecovered, retry };
};
