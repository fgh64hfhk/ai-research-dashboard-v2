// types/form.ts

import { ScheduleType } from "@/types/schedule";

// 用於訓練排程表單（/schedule/create）
// 此型別配合 hook-form / UI 組件（如日期選擇器）
// 與 SchedulePayload 類型不同，需經轉換再送出 API
export interface ScheduleFormData {
  modelId: string;
  version: string;
  runDate: Date; // 日期選擇元件回傳為 JS Date 物件
  type: ScheduleType;
}

export interface VersionFormData {
  version: string; // 使用者輸入版本號，例如 "v1.0"
  modifiedType: string; // 使用者填寫修改摘要（新增初始版本）
  modelFile: File | null; // 使用者上傳的 .h5 檔案

  // ✅ 以下為自動帶入欄位
  modelId: string;
  buildDate: string; // 系統自動補上 new Date().toISOString()
  trainingTime?: number; // 可留空，由系統訓練結果填入
  status?: "inactive" | "scheduled"; // 初始為 inactive（尚未訓練）
}

// 建立參數表所需資料結構（含 UI 輸入與系統欄位）
export interface ParameterFormData {
  // 使用者輸入欄位
  learningRate: number;
  batchSize: number;
  epochs: number;
  optimizer: "adam" | "sgd" | "rmsprop";
  lossFunction: "crossentropy" | "mse" | "categorical_crossentropy";
  datasetVersion: string;
  pretrainedModel: boolean;
  augmentation?: boolean;

  // 自動填入欄位
  modelId: string;
  version: string;
}
