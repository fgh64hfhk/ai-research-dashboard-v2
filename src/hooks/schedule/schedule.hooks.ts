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
): TrainingSchedule[] | undefined {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  if (!modelId || !version) return undefined;

  const key = getScheduleKey(modelId, version);
  return scheduleMap[key] ?? [];
}

// ✅ 根據 id 全域搜尋排程資料
export function useScheduleById(id: string): TrainingSchedule | undefined {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  for (const key in scheduleMap) {
    const match = scheduleMap[key].find((s) => s.id === id);
    if (match) return match;
  }

  return undefined;
}
