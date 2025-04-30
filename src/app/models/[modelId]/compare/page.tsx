"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { PageLoader } from "@/components/common/PageLoader";
import {
  ComparePageSkeleton,
  ParameterCompareCard,
  TrainingResultInsightCard,
  VersionActionPanel,
} from "@/components/compare";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { Button } from "@/components/ui/button";
import { useModelById } from "@/hooks/model/model.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/results.hooks";
import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import { generateTrainingInsight } from "@/lib/utils/insight.helper";
import { convertParamsToCompareItems } from "@/lib/utils/parameter.helper";
import { extractEpochMetricsFromLogs } from "@/lib/utils/result.helper";
import { getLatestScheduleTask } from "@/lib/utils/schedule.helper";
import {
  compareVersionString,
  generatePreFilledVersion,
} from "@/lib/utils/version.helper";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function VersionComparePage() {
  // 1️⃣ 路由參數
  const { modelId } = useParams<{ modelId: string }>();

  // 2️⃣ 基本資料載入
  const isLoading = useLoadingGuard(300);
  const model = useModelById(modelId);
  const versions = useVersionsByModelId(modelId);

  // 3️⃣ 排序版本，取出預設 base / target
  const sortedVersions = useMemo(() => {
    return versions
      .slice()
      .sort((a, b) => compareVersionString(a.version, b.version));
  }, [versions]);

  const [baseVersionId, setBaseVersionId] = useState<string | undefined>();
  const [targetVersionId, setTargetVersionId] = useState<string | undefined>();

  useEffect(() => {
    if (sortedVersions.length >= 2) {
      setBaseVersionId(sortedVersions.at(-2)?.version);
      setTargetVersionId(sortedVersions.at(-1)?.version);
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
    if (!baseVersion || !targetVersion || !baseMetrics || !targetMetrics)
      return null;
    return generateTrainingInsight(
      baseVersion.version,
      targetVersion.version,
      baseMetrics,
      targetMetrics
    );
  }, [baseVersion, targetVersion, baseMetrics, targetMetrics]);

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
  console.log("[model]", model);
  console.log("[base version]", baseVersionId, baseVersion);
  console.log("[base parameter]", baseVersionId, baseParams);
  console.log("[base schedule]", baseVersionId, baseSchedule);
  console.log("[base result]", baseVersionId, baseResult);
  console.log("[base metrics]", baseVersionId, baseMetrics);
  console.log("[target version]", targetVersionId, targetVersion);
  console.log("[target parameter]", targetVersionId, targetParams);
  console.log("[target schedule]", targetVersionId, targetSchedule);
  console.log("[target result]", targetVersionId, targetResult);
  console.log("[target metrics]", targetVersionId, targetMetrics);

  console.log("[compare params]", paramItems);
  console.log("[metrics summary]", summary);
  console.log("[isLocked]", isLocked);

  // 製作預填表單資料 --> ok
  const prefilledVersion =
    targetVersion &&
    summary &&
    generatePreFilledVersion(targetVersion, summary);

  console.log("[PreFilled Version:", prefilledVersion);

  return (
    <PageLoader isLoading={isLoading} fallback={<ComparePageSkeleton />}>
      {/* 🧭 區塊一：引導說明卡片 */}
      <PageIntroCard
        imageSrc="/guide/Pie chart.gif"
        title={
          versions.length === 0
            ? "尚未建立任何模型版本"
            : `比較模型：${model?.name}`
        }
        descriptionList={
          versions.length === 0
            ? [
                "此模型尚未建立任何版本，無法進行訓練結果比較。",
                "請先建立初始版本以開始訓練與版本優化。",
              ]
            : versions.length === 1
            ? [
                <>
                  目前僅有<b>{baseVersion?.version}</b>{" "}
                  這個初始版本，尚無其他版本可供比較。
                </>,
                "請根據目前的訓練成果進行優化，建立新版本以持續迭代。",
              ]
            : [
                <>
                  您目前正在比較<b>版本（{baseVersion?.version}）</b>與
                  <b>版本（{targetVersion?.version}）</b>的訓練成果。
                </>,
                <>
                  每個版本的成果皆取自其最近一次排程中的
                  <b>最終訓練結果</b>。
                </>,
                "若訓練失敗，該版本將視為「不可部署」。",
                "請根據下方的參數設定與訓練指標差異，決定是否建立新版本以持續優化。",
              ]
        }
      />
      {versions.length === 0 ? (
        <EmptyState
          title="尚未建立任何模型版本"
          description="請先建立初始版本，再進行模型訓練與比較。"
          action={<Button onClick={() => {}}>返回模型詳細頁面</Button>}
        />
      ) : versions.length === 1 ? (
        <EmptyState
          title="尚無其他版本可比較"
          description="目前僅有初始版本，請建立新版本以進行比較與優化。"
          action={<VersionActionPanel />}
        />
      ) : (
        <>
          {/* 🧭 區塊三：操作按鈕區塊 */}
          {/* <CompareActionSection
            baseVersionId={baseVersionId}
            targetVersionId={targetVersionId}
            versionOptions={versions.map((v) => v.version)}
            isLocked={isLocked}
            onBaseChange={setBaseVersionId}
            onTargetChange={setTargetVersionId}
            onCreateNewVersion={handleCreateNewVersion}
            onReschedule={() => console.log("reschedule")}
            onEditNote={() => console.log("edit")}
            defaultNote=""
          /> */}
          {/* 🧭 區塊四：參數比較卡 */}
          <ParameterCompareCard
            baseVersionId={baseVersion?.version || ""}
            targetVersionId={targetVersion?.version || ""}
            parameters={paramItems}
          />

          {/* 🧭 區塊五：訓練結果比較圖表 */}
          {/* <TrainingResultCompareChart
            baseVersionId={baseVersion?.version || ""}
            targetVersionId={targetVersion?.version || ""}
            baseMetrics={baseMetrics}
            targetMetrics={targetMetrics}
          /> */}

          {/* 🧭 區塊六：AI 前瞻分析 */}
          <TrainingResultInsightCard summary={summary} />
        </>
      )}
    </PageLoader>
  );
}
