import { useEffect, useRef } from 'react';

export function useWakeLock(isActive: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Release wake lock when not active
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {
          // Silent fail
        });
        wakeLockRef.current = null;
      }
      return;
    }

    // Request wake lock when active
    if ('wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((sentinel) => {
          wakeLockRef.current = sentinel;
        })
        .catch(() => {
          // Silent fail if wake lock is not supported or denied
        });
    }

    // Cleanup on unmount
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {
          // Silent fail
        });
        wakeLockRef.current = null;
      }
    };
  }, [isActive]);
}
