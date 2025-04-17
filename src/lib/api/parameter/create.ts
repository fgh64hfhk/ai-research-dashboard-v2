import { ParameterFormData } from "@/types/form";
import { ModelParameters } from "@/types/parameters";

/**
 * 模擬建立模型參數設定的 API
 */
export async function createParameters(
  payload: ParameterFormData
): Promise<ModelParameters> {
  console.log("[Mock API] 建立參數 payload：", payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelVersionId: `${payload.modelId}_${payload.version}`,
        learningRate: payload.learningRate,
        batchSize: payload.batchSize,
        epochs: payload.epochs,
        optimizer: payload.optimizer,
        lossFunction: payload.lossFunction,
        datasetVersion: payload.datasetVersion,
        pretrainedModel: payload.pretrainedModel,
        augmentation: payload.augmentation ?? false,
      });
    }, 800);
  });
}