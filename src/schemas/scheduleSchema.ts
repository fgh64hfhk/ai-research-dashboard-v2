import { z } from "zod";

// 用來驗證排程表單送出資料（對應 SchedulePayload）
export const scheduleSchema = z.object({
  modelId: z.string().min(1, "請選擇模型"),
  version: z.string().min(1, "請輸入版本"),
  buildDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "建構日期格式錯誤 (YYYY-MM-DD)"),
  runDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "請選擇有效的訓練日期時間",
  }),
  triggerTraining: z.boolean().optional(),
});

// 若需要推導 TypeScript 型別（跟 zod schema 對應）
export type ScheduleFormValues = z.infer<typeof scheduleSchema>;