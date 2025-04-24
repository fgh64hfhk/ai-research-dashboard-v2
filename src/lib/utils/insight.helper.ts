export interface TrainingMetric {
  epoch: number;
  loss: number;
  acc: number;
}

interface TrendAnalysis {
  improved: boolean;
  improvementRate: number;
  label: string;
}

export interface TrainingInsight {
  betterVersionId: string | null;
  recommendation: string;
  insights: { label: string; important?: boolean }[];
}

function analyzeLossTrend(metrics: TrainingMetric[]): TrendAnalysis {
  if (metrics.length < 2)
    return {
      improved: false,
      improvementRate: 0,
      label: "資料不足以分析 loss",
    };

  const first = metrics[0].loss;
  const last = metrics[metrics.length - 1].loss;
  const improved = last < first;
  const rate = first > 0 ? (first - last) / first : 0;

  return {
    improved,
    improvementRate: rate,
    label: improved
      ? `loss 從 ${first} 降至 ${last}，改善幅度 ${(rate * 100).toFixed(0)}%`
      : `loss 從 ${first} 升至 ${last}，模型未有效學習`,
  };
}

function analyzeAccuracyTrend(metrics: TrainingMetric[]): TrendAnalysis {
  if (metrics.length < 2)
    return {
      improved: false,
      improvementRate: 0,
      label: "資料不足以分析 accuracy",
    };

  const first = metrics[0].acc;
  const last = metrics[metrics.length - 1].acc;
  const improved = last > first;
  const rate = first >= 0 ? (last - first) / (1 - first) : 0;

  return {
    improved,
    improvementRate: rate,
    label: improved
      ? `accuracy 從 ${first} 提升至 ${last}，提升幅度 ${(rate * 100).toFixed(
          0
        )}%`
      : `accuracy 從 ${first} 無明顯進步`,
  };
}

export function generateTrainingInsight(
  baseVersionId: string,
  targetVersionId: string,
  baseMetrics: TrainingMetric[],
  targetMetrics: TrainingMetric[]
): TrainingInsight {
  const baseLoss = analyzeLossTrend(baseMetrics);
  const baseAcc = analyzeAccuracyTrend(baseMetrics);
  const targetLoss = analyzeLossTrend(targetMetrics);
  const targetAcc = analyzeAccuracyTrend(targetMetrics);

  const insights = [
    { label: `🔵 ${baseVersionId}：${baseLoss.label}` },
    { label: `🔵 ${baseVersionId}：${baseAcc.label}` },
    { label: `🟠 ${targetVersionId}：${targetLoss.label}` },
    { label: `🟠 ${targetVersionId}：${targetAcc.label}`, important: true },
  ];

  let betterVersionId: string | null = null;
  let recommendation = "目前無明顯優勢版本，建議調整參數重新訓練後再觀察。";

  if (targetLoss.improved && targetAcc.improved) {
    betterVersionId = targetVersionId;
    recommendation = `建議使用 ${targetVersionId} 並進一步驗證穩定性。`;
  } else if (baseLoss.improved && baseAcc.improved && !targetLoss.improved) {
    betterVersionId = baseVersionId;
    recommendation = `建議延續 ${baseVersionId} 並優化參數繼續訓練。`;
  } else if (targetAcc.improved && !targetLoss.improved) {
    betterVersionId = targetVersionId;
    recommendation = `雖然 ${targetVersionId} 的 accuracy 較高，但 loss 無明顯收斂，建議微調參數後再訓練。`;
  }

  return { betterVersionId, recommendation, insights };
}
