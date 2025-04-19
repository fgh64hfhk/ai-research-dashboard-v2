import { TrainingResult } from "@/types/training";
import { mockTrainingResults } from "@/mock/mockTrainingResults";
import { groupTrainingResultsByKey } from "@/lib/utils/result.helper";

/**
 * 模擬 API：取得所有訓練結果（以 modelId_version 作為 key）
 */
export async function fetchMockTrainingResults(): Promise<
  Record<string, TrainingResult[]>
> {
  return groupTrainingResultsByKey(mockTrainingResults);
}
