"use client";

import React from "react";
import { PageLoader } from "@/components/common/PageLoader";
import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { ComparePageSkeleton } from "@/components/compare";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";

import { useModelById } from "@/hooks/model/model.hooks";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/results.hooks";

import { extractEpochMetricsFromLogs } from "@/lib/utils/result.helper";

const VersionComparePage = () => {
  // 初始化資料狀態
  const isLoading = useLoadingGuard(500);
  const model = useModelById("m001");
  const versions = useVersionsByModelId("m001");
  const parameter1 = useParameterByVersionKey("m001", "v1.0");
  const parameter2 = useParameterByVersionKey("m001", "v1.1");
  const schedule1 = useSchedulesByVersionKey("m001", "v1.0");
  const schedule2 = useSchedulesByVersionKey("m001", "v1.1");
  const result1 = useTrainingResultsByVersionKey("m001_v1.0");
  const result2 = useTrainingResultsByVersionKey("m001_v1.1");

  const metricsForChart1 = extractEpochMetricsFromLogs(result1.find((r) => r.status === "completed")?.logs || []);
  const metricsForChart2 = extractEpochMetricsFromLogs(result2.find((r) => r.status === "completed")?.logs || []);

  return (
    <PageLoader isLoading={isLoading} fallback={<ComparePageSkeleton />}>
      <PageIntroCard
        title="比較頁面測試"
        descriptionList={[
          <>
            測試訊息一 <b>最後完成的訓練結果</b> 提供。
          </>,
          "測試訊息二",
          "測試訊息三",
        ]}
      />
      <div>
        <h3>模型資料確認區塊</h3>
        <div>{JSON.stringify(model)}</div>
      </div>
      <div>
        <h3>模型版本資料確認區塊</h3>
        <div>{JSON.stringify(versions)}</div>
      </div>
      <div>
        <h3>模型版本參數資料確認區塊</h3>
        <div>
          {JSON.stringify(parameter1)}
          <hr />
          {JSON.stringify(parameter2)}
        </div>
      </div>
      <div>
        <h3>模型版本排程資料確認區塊</h3>
        <div>
          {JSON.stringify(schedule1)}
          <hr />
          {JSON.stringify(schedule2)}
        </div>
      </div>
      <div>
        <h3>模型版本訓練結果資料確認區塊</h3>
        <div>
          {JSON.stringify(result1)}
          <hr />
          {JSON.stringify(result2)}
        </div>
      </div>
      <div>
        <h3>模型版本結果指標資料確認區塊</h3>
        <div>
          {JSON.stringify(metricsForChart1)}
          <hr />
          {JSON.stringify(metricsForChart2)}
        </div>
      </div>
    </PageLoader>
  );
};

export default VersionComparePage;
