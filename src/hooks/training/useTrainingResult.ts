import { useTrainingResultContext } from "@/contexts/training/TrainingResultContext";
import { TrainingResult } from "@/types/training";

export function useTrainingResultCreate() {
  const { dispatch } = useTrainingResultContext();
  const addResult = (result: Record<string, TrainingResult[]>) => {
    dispatch({
      type: "SET_RESULTS",
      payload: result,
    });
  };
  return addResult;
}

/**
 * 取得指定版本的所有訓練結果清單
 */
export function useTrainingResultsByVersionKey(key: string): TrainingResult[] {
  const {
    state: { resultMap },
  } = useTrainingResultContext();

  return resultMap[key] ?? [];
}

/**
 * 取得指定版本的最新訓練結果（按照 completedAt 遞減排序）
 */
export function useLatestResult(
  key: string
): TrainingResult | undefined {
  const list = useTrainingResultsByVersionKey(key);
  if (!list || list.length === 0) return undefined;

  return [...list].sort((a, b) => {
    const dateA = new Date(a.completedAt).getTime();
    const dateB = new Date(b.completedAt).getTime();
    return dateB - dateA;
  })[0];
}

/**
 * 取得指定版本中最近成功或失敗的一筆結果
 */
export function useRecentResult(
  key: string
): TrainingResult | undefined {
  const list = useTrainingResultsByVersionKey(key);
  if (!list) return undefined;

  const filtered = list.filter(
    (r) => r.status === "completed" || r.status === "failed"
  );
  return filtered.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];
}
