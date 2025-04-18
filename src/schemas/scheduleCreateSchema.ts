import { z } from "zod";

// 用來驗證排程表單送出資料（對應 SchedulePayload）
export const scheduleSchema = z.object({
  runDate: z.date({ required_error: "請選擇執行日期" }),
  type: z.enum(["manual", "auto", "recurring"], {
    required_error: "請選擇排程類型",
  }),
  triggerTraining: z.boolean().optional(),
});

// 若需要推導 TypeScript 型別（跟 zod schema 對應）
export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
