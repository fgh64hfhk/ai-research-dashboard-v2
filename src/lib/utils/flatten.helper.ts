import { ModelWithAllVersions, ModelVersion } from "@/types/model";

export function flattenMockModelsVersions(models: ModelWithAllVersions[]) {
  return models.reduce((acc, model) => {
    if (model.modelVersion && model.modelVersion.length > 0) {
      acc[model.modelId] = [...model.modelVersion];
    }
    return acc;
  }, {} as Record<string, ModelVersion[]>);
}
