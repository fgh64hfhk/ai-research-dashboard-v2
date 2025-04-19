// 訓練排程的狀態
export type ScheduleStatus = "scheduled" | "running" | "completed" | "failed";
// 訓練排程的任務類別
export type ScheduleType = "manual" | "auto" | "recurring";

// 資料庫中的訓練排程實體
export interface TrainingSchedule {
  scheduleId: string; // 唯一識別碼（系統生成）
  modelId: string; // 關聯模型 ID（系統綁定）
  version: string; // 關聯模型版本（系統綁定）

  buildDate: string; // 排程建立時間（ISO 字串）（系統生成）
  runDate: string; // 執行排程時間（ISO 格式）

  type: ScheduleType; // 排程類別
  status: ScheduleStatus; // 排程狀態（系統生成）

  createdAt?: string; // 建立時間（後端生成）
  updatedAt?: string; // 更新時間（後端生成）

  triggerTraining?: boolean; // 可選：偵測是否直接開始訓練
}

// 前端建立排程時送出的資料：用於前端建立新排程的表單提交格式
export interface SchedulePayload {
  scheduleId: string; // 唯一識別碼（由前端生成）
  modelId: string;
  version: string;

  runDate: string; // 使用者選擇的排程時間

  type: ScheduleType;

  buildDate: string; // 可選，由前端補上 new Date().toISOString()
  status: ScheduleStatus; // 可選，預設為 "scheduled"
}

// 後端訓練完成後的回應：後端訓練結束後給前端的簡要狀態回傳（非儲存格式）
export interface ScheduleResponse {
  scheduleId: string;
  modelId: string;
  version: string;
  status: ScheduleStatus;
  trainingTime?: number;
  message?: string; // 若失敗可回傳錯誤說明
  completedAt?: string;
}