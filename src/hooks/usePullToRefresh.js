import { useEffect, useRef, useState } from "react";

/**
 * Simple pull-to-refresh for mobile.
 * onRefresh must return a Promise.
 */
export default function usePullToRefresh(onRefresh, { enabled = true } = {}) {
  const startY = useRef(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const threshold = 70;

    const onTouchStart = (e) => {
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (refreshing || window.scrollY > 0) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 20) setPulling(true);
    };

    const onTouchEnd = async (e) => {
      if (refreshing) return;
      const diff = e.changedTouches[0].clientY - startY.current;
      setPulling(false);

      if (diff > threshold && window.scrollY <= 0) {
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, enabled, refreshing]);

  return { pulling, refreshing };
}