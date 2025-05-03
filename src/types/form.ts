export interface ModelFormData {
  modelName: string;
  language: string;
  description?: string;

  // 以下為自動帶入欄位
  modelId: string;
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

import { ModelParameterValues } from "@/types/parameters";

// UI 表單型別（內含 meta，跟 react-hook-form 綁定用）
export type ParameterFormValues = ModelParameterValues & {
  modelId: string;
  version: string;
};

// 提交 API 的 payload
export type ParameterFormData = ParameterFormValues;
