import { TrainingSchedule } from "@/types/schedule";

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

// 找最新建立的排程
export function getLatestScheduleTask(
  schedules: TrainingSchedule[] | undefined
): TrainingSchedule | undefined {
  if (!schedules?.length) return undefined;
  return schedules.slice().sort((a, b) => {
    return new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime();
  })[0];
}

// 排序並切割最新與歷史排程
export function splitSchedules(schedules: TrainingSchedule[]) {
  if (!schedules.length) return { latest: undefined, history: [] };

  const sorted = schedules.slice().sort((a, b) => {
    return new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime();
  });

  return {
    latest: sorted[0],
    history: sorted.slice(1),
  };
}
