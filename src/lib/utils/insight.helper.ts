import { TrainingMetric } from "@/types/training";

interface InsightItem {
  type: string;
  label: string;
  important?: boolean;
}

export interface TrainingInsight {
  betterVersionId: string;
  insights: InsightItem[];
  recommendation?: string;
}

export function generateTrainingInsight(
  baseVersionId: string,
  baseMetrics: TrainingMetric[],
  mode: "single" | "compare",
  targetVersionId?: string,
  targetMetrics?: TrainingMetric[]
): TrainingInsight | null {
  if (!baseMetrics || baseMetrics.length === 0) {
    console.warn("generateTrainingInsight: baseMetrics 為空");
    return null;
  }
  const insights: InsightItem[] = [];

  if (mode === "compare") {
    if (!targetMetrics || targetMetrics.length === 0) {
      console.warn(
        "generateTrainingInsight: compare 模式需要 targetMetrics，但未提供或為空"
      );
      return null;
    }
    if (!targetVersionId) {
      console.warn(
        "generateTrainingInsight: compare 模式需要 targetVersionId，但未提供"
      );
      return null;
    }

    // ===== 雙版本比較模式 compare =====

    // 最新版本（Base）
    const startAcc_base = baseMetrics[0]?.accuracy ?? 0;
    const endAcc_base = baseMetrics.at(-1)?.accuracy ?? 0;
    const startLoss_base = baseMetrics[0]?.loss ?? 1;
    const endLoss_base = baseMetrics.at(-1)?.loss ?? 1;
    const epochs_base = baseMetrics.length;

    // 比較版本（Target）
    const startAcc_target = targetMetrics[0]?.accuracy ?? 0;
    const endAcc_target = targetMetrics.at(-1)?.accuracy ?? 0;
    const startLoss_target = targetMetrics[0]?.loss ?? 1;
    const endLoss_target = targetMetrics.at(-1)?.loss ?? 1;
    const epochs_target = targetMetrics.length;

    // ========== 個別版本自我分析 ==========

    // base（最新版本）Accuracy分析
    if (endAcc_base > startAcc_base) {
      const improve = ((endAcc_base - startAcc_base) / startAcc_base) * 100;
      insights.push({
        type: "base",
        label: `${baseVersionId}：Accuracy 從 ${startAcc_base.toFixed(
          2
        )} 提升至 ${endAcc_base.toFixed(2)}，提升幅度 ${improve.toFixed(1)}%`,
      });
    } else {
      insights.push({
        type: "base",
        label: `${baseVersionId}：Accuracy 無明顯提升（${startAcc_base.toFixed(
          2
        )} → ${endAcc_base.toFixed(2)})`,
      });
    }

    // base（最新版本）Loss分析
    if (endLoss_base < startLoss_base) {
      const improve = ((startLoss_base - endLoss_base) / startLoss_base) * 100;
      insights.push({
        type: "base",
        label: `${baseVersionId}：Loss 從 ${startLoss_base.toFixed(
          2
        )} 降至 ${endLoss_base.toFixed(2)}，改善幅度 ${improve.toFixed(1)}%`,
      });
    } else {
      insights.push({
        type: "base",
        label: `${baseVersionId}：Loss 上升（${startLoss_base.toFixed(
          2
        )} → ${endLoss_base.toFixed(2)}），模型可能過擬合或收斂不佳`,
      });
    }

    // target（比較版本）Accuracy分析
    if (endAcc_target > startAcc_target) {
      const improve =
        ((endAcc_target - startAcc_target) / startAcc_target) * 100;
      insights.push({
        type: "target",
        label: `${targetVersionId}：Accuracy 從 ${startAcc_target.toFixed(
          2
        )} 提升至 ${endAcc_target.toFixed(2)}，提升幅度 ${improve.toFixed(1)}%`,
      });
    } else {
      insights.push({
        type: "target",
        label: `${targetVersionId}：Accuracy 無明顯提升（${startAcc_target.toFixed(
          2
        )} → ${endAcc_target.toFixed(2)})`,
      });
    }

    // target（比較版本）Loss分析
    if (endLoss_target < startLoss_target) {
      const improve =
        ((startLoss_target - endLoss_target) / startLoss_target) * 100;
      insights.push({
        type: "target",
        label: `${targetVersionId}：Loss 從 ${startLoss_target.toFixed(
          2
        )} 降至 ${endLoss_target.toFixed(2)}，改善幅度 ${improve.toFixed(1)}%`,
      });
    } else {
      insights.push({
        type: "target",
        label: `${targetVersionId}：Loss 上升（${startLoss_target.toFixed(
          2
        )} → ${endLoss_target.toFixed(2)}），模型可能過擬合或收斂不佳`,
      });
    }

    // ========== 版本間直接比較分析 ==========

    // Accuracy 提升幅度（新版 - 舊版）
    const accImprove = (endAcc_base - endAcc_target) * 100;

    // Loss 減少幅度（舊版 - 新版）
    const lossReduce = (endLoss_target - endLoss_base) * 100;

    // 訓練輪次變化
    const epochDiff = epochs_base - epochs_target;

    // 🔵 Accuracy 比較
    if (accImprove > 0) {
      insights.push({
        type: "compare",
        label: `與前版本相比，Accuracy 提升了 ${accImprove.toFixed(
          1
        )}%（${endAcc_target.toFixed(2)} → ${endAcc_base.toFixed(2)}）`,
      });
    } else if (accImprove < 0) {
      insights.push({
        type: "compare",
        label: `與前版本相比，Accuracy 下降了 ${Math.abs(accImprove).toFixed(
          1
        )}%（${endAcc_target.toFixed(2)} → ${endAcc_base.toFixed(2)}）`,
      });
    } else {
      insights.push({
        type: "compare",
        label: `與前版本相比，Accuracy 無明顯變化（${endAcc_target.toFixed(
          2
        )} → ${endAcc_base.toFixed(2)}）`,
      });
    }

    // 🔵 Loss 比較
    if (lossReduce > 0) {
      insights.push({
        type: "compare",
        label: `與前版本相比，Loss 減少了 ${lossReduce.toFixed(
          1
        )}%（${endLoss_target.toFixed(2)} → ${endLoss_base.toFixed(2)}）`,
      });
    } else if (lossReduce < 0) {
      insights.push({
        type: "compare",
        label: `與前版本相比，Loss 增加了 ${Math.abs(lossReduce).toFixed(
          1
        )}%（${endLoss_target.toFixed(2)} → ${endLoss_base.toFixed(
          2
        )}），需留意模型過擬合風險`,
      });
    } else {
      insights.push({
        type: "compare",
        label: `與前版本相比，Loss 無明顯變化（${endLoss_target.toFixed(
          2
        )} → ${endLoss_base.toFixed(2)}）`,
      });
    }

    // 🔵 訓練輪次比較
    if (epochDiff > 0) {
      insights.push({
        type: "compare",
        label: `訓練輪次增加了 ${epochDiff} 次（${epochs_target} → ${epochs_base}），可能有助於模型收斂`,
      });
    } else if (epochDiff < 0) {
      insights.push({
        type: "compare",
        label: `訓練輪次減少了 ${Math.abs(
          epochDiff
        )} 次（${epochs_target} → ${epochs_base}），需留意是否影響模型學習`,
      });
    } else {
      insights.push({
        type: "compare",
        label: `訓練輪次與前版本相同（${epochs_target} 次）`,
        // important: true,
      });
    }

    const compositeScore = computeCompositeScore(
      startAcc_base,
      endAcc_base,
      startLoss_base,
      endLoss_base,
      epochs_base,
      startAcc_target,
      endAcc_target,
      startLoss_target,
      endLoss_target,
      epochs_target
    );

    // 綜合分數解讀：如果 compositeScore > 50，代表新版表現優於舊版
    const betterVersionId =
      compositeScore >= 50 ? baseVersionId : targetVersionId;

    return {
      betterVersionId,
      insights,
      recommendation:
        compositeScore >= 70
          ? `綜合評估分數為 ${compositeScore.toFixed(
              1
            )}，新版顯著優於舊版，建議進行推論測試與部署驗證。`
          : compositeScore >= 50
          ? `綜合評估分數為 ${compositeScore.toFixed(
              1
            )}，新版略有優勢，建議持續優化參數與資料集。`
          : compositeScore >= 30
          ? `綜合評估分數為 ${compositeScore.toFixed(
              1
            )}，改善幅度有限，建議小幅調整參數後重新訓練。`
          : `綜合評估分數為 ${compositeScore.toFixed(
              1
            )}，改善幅度不足，建議重新設計參數或資料集策略。`,
    };
  }

  // ===== 單版本模式 single =====
  const startAcc = baseMetrics[0]?.accuracy ?? 0;
  const endAcc = baseMetrics.at(-1)?.accuracy ?? 0;
  const startLoss = baseMetrics[0]?.loss ?? 1;
  const endLoss = baseMetrics.at(-1)?.loss ?? 1;
  const epochs = baseMetrics.length;

  // 如果最後的正確率大於起始的正確率 --> 提升
  if (endAcc > startAcc) {
    const improve = ((endAcc - startAcc) / startAcc) * 100;
    insights.push({
      type: "base",
      label: `Accuracy 從 ${startAcc.toFixed(2)} 提升至 ${endAcc.toFixed(
        2
      )}，提升幅度 ${improve.toFixed(1)}%`,
    });
  } else {
    insights.push({
      type: "base",
      label: `Accuracy 從 ${startAcc.toFixed(2)} 無明顯提升`,
    });
  }

  // 如果最後的損失率小於起始的損失率 --> 提升
  if (endLoss < startLoss) {
    const improve = ((startLoss - endLoss) / startLoss) * 100;
    insights.push({
      type: "base",
      label: `Loss 從 ${startLoss.toFixed(2)} 降至 ${endLoss.toFixed(
        2
      )}，改善幅度 ${improve.toFixed(1)}%`,
    });
  } else {
    insights.push({
      type: "base",
      label: `Loss 從 ${startLoss.toFixed(2)} 升至 ${endLoss.toFixed(
        2
      )}，模型損失增加，可能存在過擬合或學習停滯現象`,
    });
  }

  if (epochs < 5) {
    insights.push({
      type: "base",
      label: `訓練輪次僅 ${epochs} 次，建議增加訓練次數以觀察趨勢穩定性`,
      important: true,
    });
  }

  // 單版本模式沒有比較建議
  return {
    betterVersionId: baseVersionId,
    insights,
    recommendation: "建議根據訓練指標趨勢，調整學習率或增加資料量以提升表現。",
  };
}

export function computeCompositeScore(
  startAcc_base: number,
  endAcc_base: number,
  startLoss_base: number,
  endLoss_base: number,
  epochs_base: number,
  startAcc_target: number,
  endAcc_target: number,
  startLoss_target: number,
  endLoss_target: number,
  epochs_target: number
) {
  // 🔵 Accuracy 提升幅度（新版 vs 舊版）
  const accDiff =
    ((endAcc_base - endAcc_target) / (startAcc_target || 1)) * 100;

  // 🔵 Loss 降低幅度（舊版 vs 新版）
  const lossDiff =
    ((endLoss_target - endLoss_base) / (startLoss_target || 1)) * 100;

  // 🔵 訓練輪數變化（新版 - 舊版）
  const epochDiff = epochs_base - epochs_target;

  // 🔵 綜合評分加權
  const weightedAcc = accDiff * 0.6; // Accuracy 比重高一點
  const weightedLoss = lossDiff * 0.3; // Loss 比重稍微低一點
  const weightedEpoch = epochDiff > 0 ? Math.min(epochDiff * 2, 10) : 0; // 每增加 1 epoch 給 2 分，最多 +10分

  const rawScore = weightedAcc + weightedLoss + weightedEpoch;

  // 🔵 分數正規化（限制在 0 ~ 100）
  const finalScore = Math.min(Math.max(rawScore, 0), 100);

  return finalScore;
}
