// contexts/model/model.hooks.ts
import { useModelContext } from "@/contexts/model/ModelContext";
import { Model } from "@/types/model";

// ✅ 取得模型清單
export function useModelList(): Model[] {
  const {
    state: { models },
  } = useModelContext();
  return models;
}

// ✅ 根據 modelId 查詢單一模型
export function useModelById(modelId: string): Model | undefined {
  const {
    state: { models },
  } = useModelContext();
  return models.find((m) => m.modelId === modelId);
}

// ✅ 查詢指定模型是否正在讀取中
export function useModelLoading(modelId: string): boolean {
  const {
    state: { loadingMap },
  } = useModelContext();
  return loadingMap[modelId] ?? false;
}

// ✅ 查詢整體模型列表是否正在讀取（例如 key = "all"）
export function useModelListLoading(): boolean {
  const {
    state: { loadingMap },
  } = useModelContext();
  return loadingMap["all"] ?? true; // 預設視為正在載入
}
