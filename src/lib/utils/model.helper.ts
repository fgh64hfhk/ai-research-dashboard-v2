// utils/model.helper.ts
import { ModelWithAllVersions, Model, ModelVersion } from "@/types/model";

/**
 * 將含版本的模型資料扁平化
 * @returns 模型清單 + 版本對照表（key: modelId）
 */
export function flattenModels(data: ModelWithAllVersions[]): {
  models: Model[];
  versionMap: Record<string, ModelVersion[]>;
} {
  const models: Model[] = [];
  const versionMap: Record<string, ModelVersion[]> = {};

  data.forEach(({ modelVersion, ...info }) => {
    models.push(info);

    if (modelVersion?.length) {
      versionMap[info.modelId] = modelVersion;
    }
  });

  return { models, versionMap };
}

/**
 * 僅取版本對照表（若不需要模型清單）
 */
export function flattenModelVersions(
  data: ModelWithAllVersions[]
): Record<string, ModelVersion[]> {
  return flattenModels(data).versionMap;
}
