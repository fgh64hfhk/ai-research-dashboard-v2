import { ModelVersion, ModelWithAllVersions } from "@/types/model";
import { ModelParameters } from "@/types/parameters";
import { TrainingSchedule } from "@/types/schedule";
import {
  mockModels,
  mockModelParameters,
  mockSchedules,
} from "@/mock/modelVersionsData";

export function flattenMockModelVersions(models: ModelWithAllVersions[]) {
  const result: Record<string, ModelVersion[]> = {}; // key: modelId, value: 該模型的版本陣列

  models.forEach((m) => {
    if (!m.modelVersion || m.modelVersion?.length === 0) return;

    result[m.modelId] = m.modelVersion;
  });

  return result;
}

// 模擬抓最新版本
export async function fetchLatestVersion(
  modelId: string
): Promise<ModelVersion> {
  return new Promise((resolve) => {
    const mockModelVersions = flattenMockModelVersions(mockModels);
    setTimeout(() => {
      const versions = mockModelVersions[modelId] || [];
      resolve(versions[versions.length - 1]);
    }, 300);
  });
}

// 模擬抓參數
export async function fetchParameters(key: string): Promise<ModelParameters> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModelParameters[key]);
    }, 300);
  });
}

// 模擬抓所有排程
export async function fetchSchedules(): Promise<TrainingSchedule[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSchedules);
    }, 300);
  });
}
