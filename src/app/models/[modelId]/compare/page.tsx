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
import { VersionActivateDialog } from "@/components/version/VersionActivateDialog";
import { useModelById } from "@/hooks/model/model.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/results.hooks";
import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import {
  useAddVersion,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";
import {
  renderIntroDescriptionList,
  renderIntroTitle,
} from "@/lib/utils/compare.helper";
import { generateTrainingInsight } from "@/lib/utils/insight.helper";
import {
  autoTuneParameters,
  convertParamsToCompareItems,
} from "@/lib/utils/parameter.helper";
import { extractEpochMetricsFromLogs } from "@/lib/utils/result.helper";
import { getLatestScheduleTask } from "@/lib/utils/schedule.helper";
import {
  compareVersionString,
  generatePreFilledVersion,
} from "@/lib/utils/version.helper";
import { VersionActivateFormValues } from "@/schemas/versionActivateSchema";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import { ModelStatus, ModelVersion } from "@/types/model";
import { toast } from "sonner";
import { wait } from "@/lib/utils/async.helper";
import { saveVersionPrefillData } from "@/lib/utils/versionPrefill.helper";

export default function VersionComparePage() {
  // 1️⃣ 路由參數 --> ok
  const { modelId } = useParams<{ modelId: string }>();
  const router = useRouter();

  // 2️⃣ 基本資料載入 --> ok
  const isLoading = useLoadingGuard(300);
  const model = useModelById(modelId);
  const versions = useVersionsByModelId(modelId);

  const addVersion = useAddVersion();

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

  // 設定對話匡狀態 --> ok
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);

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

  // 新增版本函數 --> 開啟對話匡
  const handleOpenActivateDialog = () => {
    setActivateDialogOpen(true);
  };

  // 新增版本函數 --> 提交邏輯
  const handleSubmitNewVersion = async (
    formData: VersionActivateFormValues
  ) => {
    if (!modelId || !baseVersionId || !summary || !baseParams) {
      toast.error("缺少必要資訊，無法建立新版本");
      return;
    }

    try {
      // Step 1. 建立完整的 payload
      const now = dayjs().format();

      const payload: ModelVersion = {
        ...formData,
        modifiedDate: now,
        trainingTime: 0,
        buildDate: now,
        status: ModelStatus.INACTIVE,
      };

      console.log("[建立新版本] 提交的資料 payload：", payload);

      // Step 2. 模擬後端回傳（通常是回傳版本資訊）
      const simulatedResponse: ModelVersion = {
        ...payload,
        id: `ver_${Date.now()}`, // 模擬後端產生的版本 ID
      };

      console.log(
        "[建立新版本] 後端模擬回應 simulatedResponse：",
        simulatedResponse
      );

      // Step 3. TODO: 之後串接 createVersion API
      // await createVersion(payload);

      // Step 4. TODO: 更新全域的版本列表狀態（dispatch action or invalidate cache）
      addVersion(simulatedResponse.modelId, simulatedResponse);
      console.log("[建立新版本] 已更新全域 context");

      // ✅ 成功提示
      toast.success(
        `新版本 ${simulatedResponse.version} _ ${simulatedResponse.id} 建立成功`,
        {
          description: "請繼續設定參數並建立訓練排程。",
        }
      );

      await wait(300);

      // Step 5-1. 暫存 prefill 資料
      const autoTunedParams = autoTuneParameters(baseParams, summary);
      saveVersionPrefillData({
        fromComparePage: true,
        modelId: simulatedResponse.modelId,
        version: simulatedResponse.version,
        prefillParams: autoTunedParams, // <-- 這是你剛剛分析微調出的建議參數
        insightSummary: summary, // <-- 這是你訓練指標分析出來的摘要
        createdAt: Date.now(),
      });
      console.log("[建立新版本] 已儲存 prefill data");

      // Step 5-2. 成功後跳轉到新版本的詳細設定頁
      router.push(
        `/models/${simulatedResponse.modelId}/version/${simulatedResponse.version}`
      );
    } catch (error) {
      console.error("[建立新版本] 發生錯誤：", error);
      // ❌ 失敗提示
      toast.error("建立新版本失敗，請稍後再試！");
    }
  };

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
          onCreateNewVersion={handleOpenActivateDialog}
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
          // onCreateNewVersion={}
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

      {/* VersionActivateDialog 對話匡 */}
      {baseVersionId && (
        <VersionActivateDialog
          open={activateDialogOpen}
          onOpenChange={setActivateDialogOpen}
          modelId={modelId}
          defaultValues={generatePreFilledVersion({
            modelId,
            baseVersion: baseVersionId,
          })}
          onSubmit={handleSubmitNewVersion}
        />
      )}
    </PageLoader>
  );
}
