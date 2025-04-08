// contexts/parameter/parameter.hooks.ts
import { useParameterContext } from "@/contexts/parameter/ParameterContext";
import { ModelParameters } from "@/types/parameters";

// ✅ 工具函數：取得參數的 map key
export function getParameterKey(modelId: string, version: string): string {
  return `${modelId}_${version}`;
}

// ✅ 查詢指定模型版本的參數資料
export function useParameterByVersionKey(
  modelId: string,
  version: string
): ModelParameters | undefined {
  const {
    state: { parameterMap },
  } = useParameterContext();

  if (!modelId || !version) return undefined;

  const key = getParameterKey(modelId, version);
  return parameterMap[key];
}
