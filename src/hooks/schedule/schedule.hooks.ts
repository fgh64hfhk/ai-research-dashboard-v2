// contexts/schedule/schedule.hooks.ts
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { ScheduleStatus, TrainingSchedule } from "@/types/schedule";

import { getScheduleKey } from "@/lib/utils/schedule.helper";

// ✅ 查詢指定模型版本的所有排程
export function useSchedulesByVersionKey(
  modelId: string,
  version: string
): TrainingSchedule[] | undefined {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  if (!modelId || !version) {
    // console.warn("useSchedulesByVersionKey: modelId/version 缺失");
    return undefined;
  }

  const key = getScheduleKey(modelId, version);
  return scheduleMap[key] ?? [];
}

// ✅ 根據 id 全域搜尋排程資料
// 注意：此 hook 會遍歷所有版本排程列表進行查找（O(n)）
export function useScheduleById(
  scheduleId: string
): TrainingSchedule | undefined {
  const {
    state: { scheduleMap },
  } = useScheduleContext();

  for (const key in scheduleMap) {
    const match = scheduleMap[key].find((s) => s.scheduleId === scheduleId);
    if (match) return match;
  }

  return undefined;
}

export function useScheduleCreate() {
  const { dispatch } = useScheduleContext();
  const addSchedule = (payload: TrainingSchedule) => {
    dispatch({
      type: "ADD_SCHEDULE",
      payload: payload,
    });
  };
  
  return addSchedule;
}

export function useScheduleStatus() {
  const {dispatch} = useScheduleContext();
  const changeStatus = (scheduleId: string, status: ScheduleStatus) => {
    dispatch({
      type: "SET_SCHEDULE_STATUS",
      scheduleId: scheduleId,
      status: status,
    })
  }
  return changeStatus;
}
