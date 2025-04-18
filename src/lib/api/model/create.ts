import { ModelFormData } from "@/types/form";
import { Model } from "@/types/model";

export async function createModel(payload: ModelFormData): Promise<Model> {
  console.log("[Mock API] 建立參數 payload：", payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        modelId: payload.modelId,
        name: payload.modelName,
        language: payload.language,
        description: payload.description ?? "",
      });
    }, 800);
  });
}
