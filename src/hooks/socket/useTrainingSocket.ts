// hooks/socket/useTrainingSocket.ts

import { WebSocket } from "mock-socket";
import { useEffect, useRef, useState } from "react";

/**
 * 訓練任務的 WebSocket 監聽 Hook
 * @param scheduleId 指定的訓練排程 ID
 * @returns progress: 目前訓練進度 (0–100)
 *          connected: 是否已連接 WebSocket
 *          isCompleted: 是否訓練完成（可供外部回寫結果）
 *          setIsCompleted: 外部清除狀態控制
 */
export function useTrainingSocket(scheduleId: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduleId) return;

    const socket = new WebSocket(`ws://localhost:4000/train/${scheduleId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null); // 清除前次錯誤
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.progress === "number") {
          setProgress(data.progress);
          if (data.progress >= 100) {
            setIsCompleted(true);
          }
        }
      } catch (err) {
        console.error("解析 WebSocket 訊息失敗", err);
        setError("接收資料格式錯誤");
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket 發生錯誤：", event);
      setError("WebSocket 錯誤，請稍後重試");
    };

    socket.onclose = () => {
      setConnected(false);

      // 若還沒完成，就重置進度，否則維持完成狀態
      setProgress((prev) => (prev < 100 ? 0 : prev));
    };

    // 清除邏輯（避免殘留連線）
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [scheduleId]);

  return {
    progress,
    connected,
    isCompleted,
    setIsCompleted,
    error,
  };
}
