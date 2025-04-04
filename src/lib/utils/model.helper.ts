// utils/model.helper.ts
import { ModelWithAllVersions, Model, ModelVersion } from "@/types/model";

export function flattenMockModels(mockData: ModelWithAllVersions[]): {
  models: Model[];
  versionMap: Record<string, ModelVersion[]>;
} {
  const models: Model[] = [];
  const versionMap: Record<string, ModelVersion[]> = {};

  mockData.forEach((model) => {
    const { modelVersion, ...modelInfo } = model;
    models.push(modelInfo); // 拆出 model base info

    if (modelVersion && modelVersion.length > 0) {
      versionMap[model.modelId] = modelVersion;
    }
  });

  return { models, versionMap };
}
