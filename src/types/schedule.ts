// types/schedule.ts

// 訓練排程的狀態
export type ScheduleStatus = "scheduled" | "running" | "completed" | "failed";
// 訓練排程的任務類別
export type ScheduleType = "manual" | "auto" | "recurring";

// 資料庫中的訓練排程實體
export interface TrainingSchedule {
  id: string; // 唯一識別碼（由前端生成）
  modelId: string; // 關聯模型 ID
  version: string; // 關聯模型版本

  buildDate: string; // 排程建立時間（ISO 字串）
  runDate: string; // 執行排程時間（ISO 格式）

  type: ScheduleType; // 排程類別
  status: ScheduleStatus; // 排程狀態

  createdAt?: string; // 可選：建立時間
  updatedAt?: string; // 可選：更新時間
}

// 前端建立排程時送出的資料
export interface SchedulePayload {
  modelId: string;
  version: string;
  runDate: string; // 使用者選擇的排程時間
  type: ScheduleType;

  buildDate?: string; // 可選，由前端補上 new Date().toISOString()
  status?: ScheduleStatus; // 可選，預設為 "scheduled"
}

// 後端訓練完成後的回應（可搭配 TrainingResult 模型）
export interface ScheduleResponse {
  scheduleId: string;
  modelId: string;
  version: string;
  status: ScheduleStatus;
  trainingTime?: number;
  message?: string; // 若失敗可回傳錯誤說明
  completedAt?: string;
}
