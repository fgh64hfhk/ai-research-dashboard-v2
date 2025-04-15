// hooks/useIncompleteParams.ts

import { useEffect, useState } from "react";

const STORAGE_KEY = "incompleteParams";

export function useIncompleteParams() {
  const [map, setMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          setMap(parsed);
        }
      } catch (err) {
        console.warn("無法解析 incompleteParams localStorage", err);
      }
    }
  }, []);

  const markIncomplete = (key: string) => {
    const updated = { ...map, [key]: true };
    setMap(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const markComplete = (key: string) => {
    const updated = { ...map };
    delete updated[key];
    setMap(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isIncomplete = (key: string) => {
    return map[key] === true;
  };

  return {
    incompleteMap: map,
    markIncomplete,
    markComplete,
    isIncomplete,
  };
}
