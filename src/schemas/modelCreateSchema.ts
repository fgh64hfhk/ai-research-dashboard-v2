import { z } from "zod";

export const modelCreateSchema = z.object({
  modelName: z.string().min(1, "請輸入模型名稱"),
  language: z.enum(["Java", "Python", "C++"]),
  description: z.string().max(100, "請勿超過100個字元").optional(),
});

export type ModelFormValues = z.infer<typeof modelCreateSchema>;
