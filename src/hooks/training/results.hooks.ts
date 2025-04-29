import { useTrainingResultContext } from "@/contexts/training/TrainingResultContext";
import { TrainingResult } from "@/types/training";
import { useMemo } from "react";

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
