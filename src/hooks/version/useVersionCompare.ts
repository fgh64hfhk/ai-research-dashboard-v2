import { useMemo } from "react";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";

import { useModelById } from "@/hooks/model/model.hooks";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/useTrainingResult";

import { extractEpochMetricsFromLogs } from "@/lib/utils/result.helper";
import { generateTrainingInsight } from "@/lib/utils/insight.helper";

export function useVersionCompare(
  modelId: string,
  baseVersionId: string,
  targetVersionId: string
) {
  const isLoading = useLoadingGuard(500);
  const model = useModelById(modelId);
  const versions = useVersionsByModelId(modelId);

  const baseVersion = versions.find((v) => v.version === baseVersionId);
  const targetVersion = versions.find((v) => v.version === targetVersionId);

  const baseParams = useParameterByVersionKey(modelId, baseVersionId);
  const targetParams = useParameterByVersionKey(modelId, targetVersionId);

  const schedule1 = useSchedulesByVersionKey(modelId, baseVersionId);
  const schedule2 = useSchedulesByVersionKey(modelId, targetVersionId);
  
  const result1 = useTrainingResultsByVersionKey(`${modelId}_${baseVersionId}`);
  const result2 = useTrainingResultsByVersionKey(`${modelId}_${targetVersionId}`);

  const baseResult = result1.find((r) => r.status === "completed");
  const targetResult = result2.find((r) => r.status === "completed");

  const baseMetrics = useMemo(
    () => extractEpochMetricsFromLogs(baseResult?.logs || []),
    [baseResult]
  );
  const targetMetrics = useMemo(
    () => extractEpochMetricsFromLogs(targetResult?.logs || []),
    [targetResult]
  );

  const summary = useMemo(() => {
    if (!baseVersion || !targetVersion) return null;
    return generateTrainingInsight(
      baseVersion.version,
      targetVersion.version,
      baseMetrics,
      targetMetrics
    );
  }, [baseVersion, targetVersion, baseMetrics, targetMetrics]);

  const isLocked = useMemo(() => {
    const hasRunning1 = schedule1?.some((s) => s.status === "running") ?? false;
    const hasRunning2 = schedule2?.some((s) => s.status === "running" || s.status === "scheduled") ?? false;
    return hasRunning1 || hasRunning2;
  }, [schedule1, schedule2]);

  return {
    isLoading,
    model,
    versions,
    baseVersion,
    targetVersion,
    baseParams,
    targetParams,
    baseResult,
    targetResult,
    baseMetrics,
    targetMetrics,
    summary,
    isLocked,
  };
}
