"use client";
import { useEffect } from "react";

export function useHashScroll() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 5000); // 延遲確保 DOM 已完成渲染
        }
      }
    }
  }, []);
}
