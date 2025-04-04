// contexts/schedule/schedule.hooks.ts
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { TrainingSchedule } from "@/types/schedule";

// ✅ 工具函數：取得排程資料的 map key
export function getScheduleKey(modelId: string, version: string): string {
  return `${modelId}_${version}`;
}

// ✅ 查詢指定模型版本的所有排程
export function useSchedulesByVersionKey(
  modelId: string,
  version: string
): TrainingSchedule[] {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  const key = getScheduleKey(modelId, version);
  return scheduleMap[key] ?? [];
}
