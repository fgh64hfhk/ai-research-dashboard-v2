// contexts/parameter/parameter.hooks.ts
import { useParameterContext } from "@/contexts/parameter/ParameterContext";
import { ModelParameters } from "@/types/parameters";

import { getParameterKey } from "@/lib/utils/parameter.helper";

// ✅ 查詢指定模型版本的參數資料
export function useParameterByVersionKey(
  modelId: string,
  version: string
): ModelParameters | undefined {
  const {
    state: { parameterMap },
  } = useParameterContext();

  if (!modelId || !version) {
    // console.warn("useParameterByVersionKey: modelId 或 version 為空");
    return undefined;
  }

  const key = getParameterKey(modelId, version);
  return parameterMap[key];
}

/**
 * 使用 context 提供的 dispatch 將指定模型版本的參數加入 parameterMap
 * @returns {addParameter} 傳入 modelId, version 與資料
 */
export function useAddParameter() {
  const { dispatch } = useParameterContext();

  const addParameter = (
    modelId: string,
    version: string,
    parameters: ModelParameters
  ) => {
    const key = `${modelId}_${version}`;
    dispatch({
      type: "ADD_PARAMETERS",
      key,
      parameters,
    });
  };

  return addParameter;
}
