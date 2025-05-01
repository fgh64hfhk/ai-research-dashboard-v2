export interface TrainingResult {
  scheduleId: string; // 關聯的排程 ID（必填）
  modelId: string; // 關聯模型 ID（必填）
  version: string; // 關聯模型版本（必填）

  status: "completed" | "failed"; // 訓練是否成功（必填）
  trainingTime: number; // 訓練耗時（單位秒）

  metrics?: Record<string, number>; // 例如 { accuracy: 0.92, loss: 0.18 }（可選）
  logs?: string[]; // 日誌（可選）
  message?: string; // 錯誤摘要或自訂訊息（可選）

  completedAt: string; // 訓練完成時間（ISO 格式字串）
}

export interface TrainingMetric {
  epoch: number;
  loss: number;
  accuracy: number;
}
