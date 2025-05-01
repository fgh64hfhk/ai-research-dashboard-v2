"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { PageLoader } from "@/components/common/PageLoader";
import {
  CompareActionSection,
  ComparePageSkeleton,
  ParameterCompareCard,
  ParameterCompareCardPlaceholder,
  ReturnToModelCard,
  TrainingResultChartSingle,
  TrainingResultCompareChart,
  TrainingResultInsightCard,
  VersionActionPanel,
} from "@/components/compare";

import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { useModelById } from "@/hooks/model/model.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/results.hooks";
import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import {
  renderIntroDescriptionList,
  renderIntroTitle,
} from "@/lib/utils/compare.helper";
import { generateTrainingInsight } from "@/lib/utils/insight.helper";
import { convertParamsToCompareItems } from "@/lib/utils/parameter.helper";
import { extractEpochMetricsFromLogs } from "@/lib/utils/result.helper";
import { getLatestScheduleTask } from "@/lib/utils/schedule.helper";
import { compareVersionString, generatePreFilledVersion } from "@/lib/utils/version.helper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function VersionComparePage() {
  // 1️⃣ 路由參數 --> ok
  const { modelId } = useParams<{ modelId: string }>();

  // 2️⃣ 基本資料載入 --> ok
  const isLoading = useLoadingGuard(300);
  const model = useModelById(modelId);
  const versions = useVersionsByModelId(modelId);

  // 3️⃣ 排序版本，取出預設 base(最新) / target(次新) --> ok
  const sortedVersions = useMemo(() => {
    return versions
      .slice()
      .sort((a, b) => compareVersionString(a.version, b.version));
  }, [versions]);

  // 設定推薦的比較版本 --> ok
  const recommendedTargetVersion = useMemo(() => {
    // 取倒數第二個版本（次新版本）
    return sortedVersions.length >= 2
      ? sortedVersions[sortedVersions.length - 2].version
      : "";
  }, [sortedVersions]);

  // 設定狀態 --> ok
  const [baseVersionId, setBaseVersionId] = useState<string | undefined>();
  const [targetVersionId, setTargetVersionId] = useState<string | undefined>();

  // base 最新版 target 次新版
  useEffect(() => {
    if (sortedVersions.length >= 2) {
      setBaseVersionId(sortedVersions.at(-1)?.version);
      setTargetVersionId(sortedVersions.at(-2)?.version);
    } else if (sortedVersions.length === 1) {
      setBaseVersionId(sortedVersions[0].version);
      setTargetVersionId(undefined);
    }
  }, [sortedVersions]);

  // 4️⃣ 當版本 ID 尚未就緒時中斷流程

  // 5️⃣ 對應版本資料 -> ok
  const baseVersion = versions.find((v) => v.version === baseVersionId) || null;
  const targetVersion =
    versions.find((v) => v.version === targetVersionId) || null;

  // 查詢參數表 -> ok
  const baseParams = useParameterByVersionKey(modelId, baseVersionId || "");
  const targetParams = useParameterByVersionKey(modelId, targetVersionId || "");

  // 查詢排程表 -> ok
  const baseSchedules = useSchedulesByVersionKey(modelId, baseVersionId || "");
  const targetSchedules = useSchedulesByVersionKey(
    modelId,
    targetVersionId || ""
  );

  const baseSchedule = getLatestScheduleTask(baseSchedules);
  const targetSchedule = getLatestScheduleTask(targetSchedules);

  // 查詢結果表 -> ok
  const baseResults = useTrainingResultsByVersionKey(
    `${modelId}_${baseVersionId}_${baseSchedule?.scheduleId}`
  );
  const targetResults = useTrainingResultsByVersionKey(
    `${modelId}_${targetVersionId}_${targetSchedule?.scheduleId}`
  );

  const baseResult = baseResults.find((r) => r.status === "completed") || null;
  const targetResult =
    targetResults.find((r) => r.status === "completed") || null;

  // 查詢指標表 -> ok
  const baseMetrics = useMemo(() => {
    return baseResult
      ? extractEpochMetricsFromLogs(baseResult.logs || [])
      : null;
  }, [baseResult]);

  const targetMetrics = useMemo(() => {
    return targetResult
      ? extractEpochMetricsFromLogs(targetResult.logs || [])
      : null;
  }, [targetResult]);

  // 整理參數比較表 --> ok
  const paramItems = convertParamsToCompareItems(baseParams, targetParams);

  // 整理指標比較指引 --> ok
  const summary = useMemo(() => {
    if (!baseVersion || !baseMetrics) return null;

    if (!targetVersion || !targetMetrics) {
      // 只有 base，走單一分析
      return generateTrainingInsight(
        baseVersion.version,
        baseMetrics,
        "single"
      );
    }

    // 有 base + target，走比較分析
    return generateTrainingInsight(
      baseVersion.version,
      baseMetrics,
      "compare",
      targetVersion.version,
      targetMetrics
    );
  }, [baseMetrics, baseVersion, targetMetrics, targetVersion]);

  // 檢查排程是否都完全訓練 --> ok
  const isLocked = useMemo(() => {
    const hasRunning1 =
      baseSchedules?.some(
        (s) => s.status === "running" || s.status === "scheduled"
      ) ?? false;
    const hasRunning2 =
      targetSchedules?.some(
        (s) => s.status === "running" || s.status === "scheduled"
      ) ?? false;
    return hasRunning1 || hasRunning2;
  }, [baseSchedules, targetSchedules]);

  // ✅ 開發除錯（建議開發階段可保留）
  // console.log("[model]", model);
  // console.log("[base version]", baseVersionId, baseVersion);
  // console.log("[base parameter]", baseVersionId, baseParams);
  // console.log("[base schedule]", baseVersionId, baseSchedule);
  // console.log("[base result]", baseVersionId, baseResult);
  // console.log("[base metrics]", baseVersionId, baseMetrics);
  // console.log("[target version]", targetVersionId, targetVersion);
  // console.log("[target parameter]", targetVersionId, targetParams);
  // console.log("[target schedule]", targetVersionId, targetSchedule);
  // console.log("[target result]", targetVersionId, targetResult);
  // console.log("[target metrics]", targetVersionId, targetMetrics);

  // console.log("[compare params]", paramItems);
  // console.log("[metrics summary]", summary);
  // console.log("[isLocked]", isLocked);

  // 製作預填表單資料 --> ＴＯＤＯ
  const prefilledVersion =
    targetVersion &&
    summary &&
    generatePreFilledVersion(targetVersion, summary);

  console.log("[PreFilled Version:", prefilledVersion);

  function handleOpenCreateDialog() {}

  function handleReschedule(): void {
    throw new Error("Function not implemented.");
  }

  function handleInference(): void {
    throw new Error("Function not implemented.");
  }

  function handleEditNote(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <PageLoader isLoading={isLoading} fallback={<ComparePageSkeleton />}>
      {/* 區塊一：導引卡片 */}
      <PageIntroCard
        imageSrc="/guide/Pie chart.gif"
        title={renderIntroTitle(versions.length, model?.name)}
        descriptionList={renderIntroDescriptionList(
          versions.length,
          targetVersion?.version,
          baseVersion?.version
        )}
      />
      {/* 區塊二：操作區塊 */}
      {versions.length === 0 && <ReturnToModelCard modelId={modelId} />}

      {versions.length === 1 && (
        <VersionActionPanel
          onCreateNewVersion={handleOpenCreateDialog}
          onReschedule={handleReschedule}
          onEditNote={handleEditNote}
          isLocked={isLocked}
          isInitialVersion={true}
        />
      )}

      {versions.length > 1 && (
        <CompareActionSection
          baseVersionId={baseVersionId || ""}
          targetVersionId={targetVersionId || ""}
          recommendedTargetVersion={recommendedTargetVersion || ""}
          versionOptions={versions.map((v) => v.version)}
          isLocked={isLocked}
          onBaseChange={setBaseVersionId}
          onTargetChange={setTargetVersionId}
          onCreateNewVersion={handleOpenCreateDialog}
          onReschedule={handleReschedule} // 預留
          onInferenceTest={handleInference} // 預留
        />
      )}

      {/* 區塊三：顯示區塊 */}
      {versions.length === 0 && (
        <EmptyState
          title="尚未建立任何版本"
          description="請先返回模型頁面建立初始版本。"
        />
      )}
      {versions.length === 1 && (
        <div className="space-y-8">
          {/* 參數對照區塊（左有資料，右為占位提示） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParameterCompareCard
              baseVersionId={baseVersionId || ""}
              parameters={paramItems}
              isSingleView
            />
            <ParameterCompareCardPlaceholder
              message="尚無其他版本可比較"
              actionLabel="建立新版本"
              onClick={() => {}}
            />
          </div>
          <TrainingResultChartSingle
            version={baseVersionId || ""}
            metrics={baseMetrics || []}
          />
          <TrainingResultInsightCard summary={summary} />
        </div>
      )}

      {versions.length > 1 && (
        <>
          <ParameterCompareCard
            baseVersionId={baseVersionId || ""}
            targetVersionId={targetVersionId || ""}
            parameters={paramItems}
          />
          <TrainingResultCompareChart
            baseVersionId={baseVersionId || ""}
            targetVersionId={targetVersionId || ""}
            baseMetrics={baseMetrics || []}
            targetMetrics={targetMetrics || []}
          />
          <TrainingResultInsightCard summary={summary} />
        </>
      )}
    </PageLoader>
  );
}
