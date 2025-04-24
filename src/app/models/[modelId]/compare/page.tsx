"use client";

import React, { useState } from "react";
import { PageLoader } from "@/components/common/PageLoader";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";

import {
  ComparePageSkeleton,
  ParameterCompareCard,
  TrainingResultCompareChart,
  TrainingResultInsightCard,
  CompareActionSection,
} from "@/components/compare";

import { useVersionCompare } from "@/hooks/version/useVersionCompare";
import { convertParamsToCompareItems } from "@/lib/utils/parameter.helper";

const VersionComparePage = () => {
  // 初始化資料狀態
  const [baseVersionId, setBaseVersionId] = useState("v1.0");
  const [targetVersionId, setTargetVersionId] = useState("v1.1");
  const {
    isLoading,
    model,
    versions,
    baseVersion,
    targetVersion,
    baseParams,
    targetParams,
    baseMetrics,
    targetMetrics,
    summary,
    isLocked,
  } = useVersionCompare("m001", baseVersionId, targetVersionId);

  // 分隔線
  const paramItems = convertParamsToCompareItems(baseParams, targetParams);

  return (
    <PageLoader isLoading={isLoading} fallback={<ComparePageSkeleton />}>
      {/* 🧭 區塊一：引導說明卡片 */}
      <PageIntroCard
        title={`比較模型：${model?.name}`}
        descriptionList={[
          <>
            您目前正在比較<b>版本（{baseVersion?.version}）</b>與
            <b>
              版本（
              {targetVersion?.version}）
            </b>
            的成果：
          </>,
          <>
            每個版本的訓練成果由最近一筆排程中 <b>最後完成的訓練結果</b> 提供。
          </>,
          "若訓練失敗，該版本將視為「不可部署」。",
          "請根據下方的檔案差異、參數設定與訓練指標進行比較，決定是否建立新版本進行優化。",
        ]}
      />
      
      {/* 🧭 區塊五：操作區塊 */}
      <CompareActionSection
        baseVersionId={baseVersionId}
        targetVersionId={targetVersionId}
        versionOptions={versions.map((v) => v.version)}
        isLocked={isLocked}
        onBaseChange={setBaseVersionId}
        onTargetChange={setTargetVersionId}
        onCreateNewVersion={() => console.log("create")}
        onReschedule={() => console.log("reschedule")}
        onEditNote={() => console.log("edit")}
        defaultNote=""
      />

      {/* 🧭 區塊二：參數差異卡 */}
      <ParameterCompareCard
        baseVersionId={baseVersion?.version || ""}
        targetVersionId={targetVersion?.version || ""}
        parameters={paramItems}
      />

      {/* 🧭 區塊三：訓練結果比較 */}
      <TrainingResultCompareChart
        baseVersionId={baseVersion?.version || ""}
        targetVersionId={targetVersion?.version || ""}
        baseMetrics={baseMetrics}
        targetMetrics={targetMetrics}
      />

      {/* 🧭 區塊四：訓練結果前瞻建議 */}
      <TrainingResultInsightCard summary={summary} />
    </PageLoader>
  );
};

export default VersionComparePage;
