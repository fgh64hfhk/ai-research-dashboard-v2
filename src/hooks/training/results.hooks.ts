import { useTrainingResultContext } from "@/contexts/training/TrainingResultContext";
import { TrainingResult } from "@/types/training";
import { useMemo } from "react";
import { useSchedulesByVersionKey } from "../schedule/schedule.hooks";
import { getLatestScheduleTask } from "@/lib/utils/schedule.helper";

export function useTrainingResultCreate() {
  const { dispatch } = useTrainingResultContext();
  const addResult = (key: string, result: TrainingResult) => {
    dispatch({
      type: "ADD_RESULT",
      key,
      result,
    });
  };
  return addResult;
}

export function useTrainingResultsByVersionKey(key: string): TrainingResult[] {
  const {
    state: { resultMap },
  } = useTrainingResultContext();

  return useMemo(() => {
    return resultMap[key] ?? [];
  }, [resultMap, key]);
}

// 回傳 { hasCompletedTraining: boolean }
export function useLatestTrainingStatus(modelId: string, versionId: string) {
  const schedules = useSchedulesByVersionKey(modelId, versionId);

  const latestSchedule = getLatestScheduleTask(schedules);

  // 沒有排程時直接回傳 false，避免 key 為 undefined
  const key = `${modelId}_${versionId}_${latestSchedule?.scheduleId}`;
  const results = useTrainingResultsByVersionKey(key);

  const hasCompletedTraining = results.some((r) => r.status === "completed");

  return { hasCompletedTraining };
}
