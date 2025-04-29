// lib/mock/socketMock.ts
import { Server } from "mock-socket";

// 全域暫存 mock server 實例（避免多次創建）
const mockServers: Record<string, Server> = {};

/**
 * 模擬 WebSocket 訓練進度
 * @param scheduleId 對應訓練排程 ID
 */
export function startMockTrainingSocket(scheduleId: string) {
  const url = `ws://localhost:4000/train/${scheduleId}`;

  // 若已存在相同 mock server，不重複創建
  if (mockServers[scheduleId]) return;

  const server = new Server(url);
  mockServers[scheduleId] = server;

  server.on("connection", (socket) => {
    let progress = 0;
    let lastProgress = -1;

    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          try {
            server.close();
          } catch (error) {
            console.error("Server close error:", error);
          }
        }, 100);
        return;
      }

      const increment = Math.floor(Math.random() * 10) + 5;
      progress = Math.min(progress + increment, 100);

      if (progress !== lastProgress) {
        console.log("progress in server:", progress);
        try {
          socket.send(JSON.stringify({ progress }));
          lastProgress = progress;
        } catch (error) {
          console.error("Socket send error:", error);
          clearInterval(interval);
          try {
            server.close();
          } catch (error) {
            console.error("Server close error:", error);
          }
        }
      }
    }, 500);
  });

  server.on("close", () => {
    console.log("server close")
    delete mockServers[scheduleId];
  });

  return server;
}
