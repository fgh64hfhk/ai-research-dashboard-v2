import { VersionFormData } from "@/types/form";
import { ModelVersion, ModelStatus } from "@/types/model";

export async function createVersion(
  payload: VersionFormData
): Promise<ModelVersion> {
  console.log("[Mock API] 建立版本 payload：", payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelId: payload.modelId,
        version: payload.version,
        modifiedDate: new Date().toISOString(),
        modifiedType: payload.modifiedType,
        trainingTime: 0,
        buildDate: payload.buildDate,
        status: ModelStatus.INACTIVE,
      });
    }, 800);
  });
}
