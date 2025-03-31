// 前端完整排程資料（可能來自後端）
export interface TrainingSchedule {
  id: string; // 資料唯一識別碼（由後端生成）
  modelId: string; // 模型 ID
  version: string; // 模型版本
  buildDate: string; // 建構日期（YYYY-MM-DD）
  runDate: string; // 執行排程時間（ISO 格式）
  status: ScheduleStatus;
  createdAt?: string; // 可選：建立時間
  updatedAt?: string; // 可選：更新時間
}

// SchedulePayload（送出資料格式）
// 用於表單送出：不含 id、status 預設為 scheduled
export type SchedulePayload = {
  modelId: string;
  version: string;
  buildDate: string; // YYYY-MM-DD
  runDate: string; // ISO 格式
  triggerTraining?: boolean; // 可選：是否立即觸發訓練
};

// ScheduleResponse（後端回應格式）
export type ScheduleResponse = {
  id: string;
  status: "scheduled" | "running" | "completed" | "failed";
  message: string;
  createdAt: string;
};

// 更多任務型別（如：自動排程、週期性任務等）
export type ScheduleStatus = "scheduled" | "running" | "completed" | "failed";
export type ScheduleType = "manual" | "auto" | "recurring";
