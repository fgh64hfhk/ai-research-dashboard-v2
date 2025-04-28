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
