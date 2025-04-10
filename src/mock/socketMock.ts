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
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      socket.send(JSON.stringify({ progress }));

      if (progress === 100) {
        setTimeout(() => server.close(), 500);
      }
    }, 600);
  });

  return server;
}
