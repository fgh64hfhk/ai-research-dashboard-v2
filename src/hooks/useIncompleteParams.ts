// hooks/useIncompleteParams.ts

import { useEffect, useState } from "react";

const STORAGE_KEY = "incompleteParams";

// ✅ 工具函數：取得儲存在 localStorage 中的未完成版本記錄
function getStoredIncomplete(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

// ✅ 工具函數：寫入未完成狀態
function saveIncompleteMap(map: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

// ✅ Hook：提供標記、檢查、刪除 未完成版本的工具
export function useIncompleteParams() {
  const [map, setMap] = useState<Record<string, boolean>>({});

  // ✅ 初次掛載時，讀取 localStorage 的記錄
  useEffect(() => {
    const stored = getStoredIncomplete();
    setMap(stored);
  }, []);

  const markIncomplete = (key: string) => {
    const updated = { ...map, [key]: true };
    setMap(updated);
    saveIncompleteMap(updated);
  };

  const clearIncomplete = (key: string) => {
    const updated = { ...map };
    delete updated[key];
    setMap(updated);
    saveIncompleteMap(updated);
  };

  const isIncomplete = (key: string) => {
    return !!map[key];
  };

  return { map, markIncomplete, clearIncomplete, isIncomplete };
}
