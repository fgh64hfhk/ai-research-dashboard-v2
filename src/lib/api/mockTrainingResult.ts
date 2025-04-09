// lib/api/mockTrainingResult.ts

import { TrainingResult } from "@/types/schedule";
import { v4 as uuidv4 } from "uuid";

// 模擬結果資料（隨機成功或失敗）
export function mockTrainingResult(params: {
  scheduleId: string;
  modelId: string;
  version: string;
}): TrainingResult {
  const isSuccess = Math.random() > 0.3;

  const now = new Date().toISOString();

  return {
    scheduleId: params.scheduleId,
    modelId: params.modelId,
    version: params.version,
    status: isSuccess ? "completed" : "failed",
    trainingTime: Math.floor(Math.random() * 200 + 100),
    metrics: isSuccess
      ? {
          accuracy: Number((Math.random() * 0.1 + 0.85).toFixed(2)),
          loss: Number((Math.random() * 0.1 + 0.15).toFixed(2)),
        }
      : undefined,
    logs: isSuccess
      ? [
          "Epoch 1/5 - acc: 0.83 - loss: 0.29",
          "Epoch 2/5 - acc: 0.89 - loss: 0.21",
          "Epoch 5/5 - acc: 0.92 - loss: 0.18",
        ]
      : ["訓練中斷，發生記憶體不足錯誤"],
    message: isSuccess ? undefined : "系統錯誤，請稍後再試或調整參數。",
    completedAt: now,
  };
}
