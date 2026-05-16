"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" && !navigator.onLine,
  );

  useEffect(() => {
    function handleOnline() {
      setOffline(false);
    }
    function handleOffline() {
      setOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up rounded-full px-4 py-1.5 text-xs font-medium text-white shadow-lg"
      style={{ backgroundColor: "#bf360c" }}
      role="status"
      aria-live="polite"
    >
      Sin conexión
    </div>
  );
}
