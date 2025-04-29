import { WebSocket } from "mock-socket";
import { useEffect, useRef, useState } from "react";

/**
 * 訓練任務的 WebSocket 監聽 Hook
 * @param scheduleId 指定的訓練排程 ID
 * @param isRunning 是否啟動 socket
 */
export function useTrainingSocket(scheduleId: string | null, isRunning: boolean) {
  const socketRef = useRef<WebSocket | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!scheduleId || !isRunning) return;

    // Reset state
    setProgress(0);
    setConnected(false);
    setIsCompleted(false);

    const socket = new WebSocket(`ws://localhost:4000/train/${scheduleId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.progress === "number") {
          setProgress((prev) => {
            if (prev !== data.progress) return data.progress;
            return prev;
          });
          if (data.progress >= 100) {
            setIsCompleted(true);
          }
        }
      } catch (err) {
        console.error("解析 WebSocket 訊息失敗", err);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket 發生錯誤：", event);
    };

    socket.onclose = () => {
      console.log("client close")
      setConnected(false);
      setProgress((prev) => (prev < 100 ? 0 : prev));
    };

    // 清除邏輯（避免殘留連線）
    return () => {
      if (
        socketRef.current &&
        socketRef.current.readyState !== WebSocket.CLOSED
      ) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [scheduleId, isRunning]);

  // 用 useEffect 監控 progress 變化 (for debug)
  useEffect(() => {
    console.log("progress in client:", progress);
  }, [progress]);

  return {
    progress,
    connected,
    isCompleted,
    setIsCompleted,
  };
}
