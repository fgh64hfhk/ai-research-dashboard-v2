// types/form.ts

import { ScheduleType } from "@/types/schedule";

export interface ScheduleFormData {
  modelId: string;
  version: string;
  runDate: Date; // 日期選擇元件回傳為 JS Date 物件
  type: ScheduleType;
}
