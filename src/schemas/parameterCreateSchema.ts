// schemas/parameterCreateSchema.ts

import { z } from "zod";

export const parameterCreateSchema = z.object({
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

  augmentation: z.boolean().optional(),

  // ✅ meta 欄位：用於綁定模型版本
  modelId: z.string(),
  version: z.string(),
});

export type ParameterFormValues = z.infer<typeof parameterCreateSchema>;
