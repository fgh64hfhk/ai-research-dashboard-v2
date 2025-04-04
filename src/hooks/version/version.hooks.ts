// contexts/version/version.hooks.ts
import { useVersionContext } from "@/contexts/version/VersionContext";
import { ModelVersion } from "@/types/model";

// ✅ 取得指定模型的所有版本清單
export function useVersionsByModelId(modelId: string): ModelVersion[] {
  const {
    state: { versionMap },
  } = useVersionContext();
  return versionMap[modelId] ?? [];
}

// ✅ 取得指定模型的版本載入狀態
export function useVersionLoading(modelId: string): boolean {
  const {
    state: { loadingMap },
  } = useVersionContext();
  return loadingMap[modelId] ?? false;
}
