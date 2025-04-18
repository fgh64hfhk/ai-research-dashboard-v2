// lib/api/model.ts
import { mockModels } from "@/mock/modelVersionsData";
import { flattenModels } from "@/lib/utils/model.helper";
import { Model, ModelVersion } from "@/types/model";

export async function fetchMockModels(): Promise<Model[]> {
  const { models } = flattenModels(mockModels);
  return models;
}

export async function fetchMockModelVersions(): Promise<Record<string, ModelVersion[]>> {
  const { versionMap } = flattenModels(mockModels);
  return versionMap;
}