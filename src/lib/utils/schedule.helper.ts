import { TrainingSchedule } from "@/types/schedule";

// 把陣列轉成 map：modelId_version -> schedule[]
export function groupSchedulesByKey(
  schedules: TrainingSchedule[]
): Record<string, TrainingSchedule[]> {
  const result: Record<string, TrainingSchedule[]> = {};

  for (const schedule of schedules) {
    const key = `${schedule.modelId}_${schedule.version}`;
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
  return schedules
    .filter((s) => s.status === "scheduled" && new Date(s.runDate) > new Date("2025-04-01T00:00:00"))
    .sort(
      (a, b) => new Date(a.runDate).getTime() - new Date(b.runDate).getTime()
    )[0];
}
