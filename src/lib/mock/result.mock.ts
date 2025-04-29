// lib/mock/mockTrainingResult.ts

import { TrainingResult } from "@/types/training";

// 模擬結果資料（隨機成功或失敗）
export function generateMockTrainingResult(params: {
  scheduleId: string;
  modelId: string;
  version: string;
}): TrainingResult {
  const isSuccess = Math.random() > 0.5;

  const now = new Date().toISOString();

  return {
    scheduleId: params.scheduleId,
    modelId: params.modelId,
    version: params.version,
    status: isSuccess ? "completed" : "failed",
    trainingTime: isSuccess
      ? Math.floor(Math.random() * 200 + 100)
      : Math.floor(Math.random() * 60 + 10),
    metrics: isSuccess
      ? {
          accuracy: Number((Math.random() * 0.1 + 0.85).toFixed(2)),
          loss: Number((Math.random() * 0.1 + 0.15).toFixed(2)),
        }
      : undefined,
    logs: isSuccess
      ? Array.from(
          { length: 5 },
          (_, i) =>
            `Epoch ${i + 1}/5 - acc: ${(0.85 + Math.random() * 0.1).toFixed(
              2
            )} - loss: ${(0.15 + Math.random() * 0.1).toFixed(2)}`
        )
      : ["訓練中斷：記憶體不足"],
    message: isSuccess ? undefined : "系統錯誤，請稍後再試或調整參數。",
    completedAt: now,
  };
}
