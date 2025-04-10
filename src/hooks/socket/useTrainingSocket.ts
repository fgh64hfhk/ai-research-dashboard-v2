// hooks/socket/useTrainingSocket.ts

import { useEffect, useRef, useState } from "react";

export function useTrainingSocket(scheduleId: string | undefined) {
  const socketRef = useRef<WebSocket | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!scheduleId) return;

    const socket = new WebSocket(`ws://localhost:4000/train/${scheduleId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
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
        console.error("解析訊息失敗", err);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket 錯誤：", event);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [scheduleId]);

  return { progress, connected, isCompleted };
}
