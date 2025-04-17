// hooks/result/useTrainingResult.ts

import { TrainingResult } from "@/types/schedule";
import { useTrainingResultContext } from "@/contexts/training/TrainingResultContext";

/**
 * 取得指定版本的所有訓練結果清單
 */
export function useTrainingResultsByVersionKey(
  scheduleId: string
): TrainingResult[] | undefined {
  const {
    state: { resultMap },
  } = useTrainingResultContext();

  if (!scheduleId) {
    console.warn("useResultsByVersionKey: scheduleId 缺失");
    return undefined;
  }

  return resultMap[scheduleId] ?? [];
}

/**
 * 取得指定版本的最新訓練結果（按照 completedAt 遞減排序）
 */
// export function useLatestResult(
//   scheduleId: string
// ): TrainingResult | undefined {
//   const list = useTrainingResultsByVersionKey(modelId, version);
//   if (!list || list.length === 0) return undefined;

//   return [...list].sort((a, b) => {
//     const dateA = new Date(a.completedAt).getTime();
//     const dateB = new Date(b.completedAt).getTime();
//     return dateB - dateA;
//   })[0];
// }

/**
 * 取得指定版本中最近成功或失敗的一筆結果
 */
// export function useRecentResult(
//   scheduleId: string
// ): TrainingResult | undefined {
//   const list = useTrainingResultsByVersionKey(modelId, version);
//   if (!list) return undefined;

//   const filtered = list.filter(
//     (r) => r.status === "completed" || r.status === "failed"
//   );
//   return filtered.sort(
//     (a, b) =>
//       new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
//   )[0];
// }
