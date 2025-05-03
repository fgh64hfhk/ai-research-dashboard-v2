import { z } from "zod";

// 🔹 表單驗證 schema
export const versionActivateSchema = z.object({
  modelId: z.string().min(1, "模型 ID 為必填"),
  version: z
    .string()
    .min(1, "請輸入版本號")
    .regex(/^v\d+\.\d+$/, "版本號格式錯誤，例如 v1.1"),
  modifiedType: z.literal("激活比較功能"),
  description: z.string().min(1, "描述不可為空"),
});

// 🔹 對應的 TypeScript 型別
export type VersionActivateFormValues = z.infer<typeof versionActivateSchema>;
