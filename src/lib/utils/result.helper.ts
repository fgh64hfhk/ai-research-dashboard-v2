import { TrainingResult } from "@/types/schedule";

export function groupTrainingResultsByKey(
  results: TrainingResult[]
): Record<string, TrainingResult[]> {
  const map: Record<string, TrainingResult[]> = {};

  for (const result of results) {
    const key = result.scheduleId;
    if (!map[key]) map[key] = [];
    map[key].push(result);
  }

  return map;
}
