// schemas/parameterCreateSchema.ts
import { z } from "zod";

// 先定義純粹的參數欄位（對應 ModelParameterValues）
export const parameterValuesSchema = z.object({
  learningRate: z
    .number({ invalid_type_error: "請輸入數值" })
    .min(0.00001, "學習率過低")
    .max(1, "學習率過高"),

  batchSize: z
    .number({ invalid_type_error: "請輸入數值" })
    .min(1, "最小為 1")
    .max(1024, "最大為 1024"),

  epochs: z
    .number({ invalid_type_error: "請輸入數值" })
    .min(1, "最小為 1")
    .max(500, "最大為 500"),

  optimizer: z.enum(["adam", "sgd", "rmsprop"]),
  lossFunction: z.enum(["crossentropy", "mse", "categorical_crossentropy"]),
  datasetVersion: z.string().min(1, "請輸入資料集版本"),

  pretrainedModel: z.boolean(),
  augmentation: z.boolean().optional(), // optional 沒問題
});

// 再擴充 "Meta" 欄位
export const parameterCreateSchema = parameterValuesSchema.extend({
  modelId: z.string(),
  version: z.string(),
});

// 型別
export type ParameterValuesForm = z.infer<typeof parameterValuesSchema>; // 純參數型別
export type ParameterFormValues = z.infer<typeof parameterCreateSchema>; // 含 meta 的表單型別
