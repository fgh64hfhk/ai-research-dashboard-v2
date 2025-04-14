// schemas/versionCreateSchema.ts

import { z } from "zod";

// 允許的版本格式（v1.0、v2.3 這類形式）
const versionPattern = /^v\d+\.\d+$/;

export const versionCreateSchema = z.object({
  version: z
    .string()
    .min(2, "請輸入版本號")
    .regex(versionPattern, "請輸入正確的版本格式，例如 v1.0"),

  modifiedType: z.string().min(1, "請輸入版本修改摘要"),

  modelFile: z
    .custom<File>()
    .refine((file) => !!file, "請上傳模型檔案")
    .refine((file) => file instanceof File && file.name.endsWith(".h5"), {
      message: "請上傳 .h5 模型檔案",
    })
    .refine((file) => file instanceof File && file.size < 100 * 1024 * 1024, {
      message: "檔案大小需小於 100MB",
    }),

  modelId: z.string().min(1, "模型 ID 不可為空"),
});

//  推導 TypeScript 型別
export type VersionFormValues = z.infer<typeof versionCreateSchema>;
