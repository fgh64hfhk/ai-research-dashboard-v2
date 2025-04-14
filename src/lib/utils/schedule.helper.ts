import { TrainingSchedule } from "@/types/schedule";
import { ScheduleFormData } from "@/types/form";
import { SchedulePayload } from "@/types/schedule";

// ✅ 工具函數：取得排程資料的 map key
export function getScheduleKey(modelId: string, version: string): string {
  return `${modelId}_${version}`;
}

// 把陣列轉成 map：modelId_version -> schedule[]
export function groupSchedulesByKey(
  schedules: TrainingSchedule[] = []
): Record<string, TrainingSchedule[]> {
  const result: Record<string, TrainingSchedule[]> = {};

  for (const schedule of schedules) {
    const key = getScheduleKey(schedule.modelId, schedule.version);
    if (!result[key]) result[key] = [];
    result[key].push(schedule);
  }

  return result;
}

// 找出最近要執行的排程（僅限 status = scheduled）
export function getNextScheduledTask(
  schedules: TrainingSchedule[] | undefined
): TrainingSchedule | undefined {
  if (!schedules || schedules.length === 0) return undefined;
  const now = new Date();
  return schedules
    .filter((s) => s.status === "scheduled" && new Date(s.runDate) > now)
    .sort(
      (a, b) => new Date(a.runDate).getTime() - new Date(b.runDate).getTime()
    )[0];
}

// 用於表單資料轉換、封裝預設欄位（如 buildDate、status）
export function transformToSchedulePayload(
  form: ScheduleFormData
): SchedulePayload {
  return {
    modelId: form.modelId,
    version: form.version,
    runDate: form.runDate.toISOString(),
    type: form.type,
    buildDate: new Date().toISOString(),
    status: "scheduled",
  };
}
