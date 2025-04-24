import { TrainingResult } from "@/types/training";

export function groupTrainingResultsByKey(
  results: TrainingResult[]
): Record<string, TrainingResult[]> {
  const map: Record<string, TrainingResult[]> = {};

  for (const result of results) {
    const key = `${result.modelId}_${result.version}`;
    if (!map[key]) map[key] = [];
    map[key].push(result);
  }

  return map;
}

// 解析每次訓練循環的指標
export function extractEpochMetricsFromLogs(logs: string[]): {
  epoch: number;
  acc: number;
  loss: number;
}[] {
  const result = [];

  for (const log of logs) {
    const match = log.match(
      /Epoch (\d+)\/\d+ - acc: ([0-9.]+) - loss: ([0-9.]+)/
    );
    if (match) {
      result.push({
        epoch: parseInt(match[1]),
        acc: parseFloat(match[2]),
        loss: parseFloat(match[3]),
      });
    }
  }

  return result;
}
