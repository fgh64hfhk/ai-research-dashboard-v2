"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  VersionDetailSkeleton,
  VersionInfoCard,
  VersionActionPanel,
} from "@/components/version";
import { ParameterView, ParameterCreateDialog } from "@/components/parameter";
import { ScheduleCreateDialog } from "@/components/schedule";

import { ModelHeader } from "@/components/model/ModelHeader";

import { PageIntroCard } from "@/components/guidance/PageIntroCard";
import { PageLoader } from "@/components/common/PageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

import { useLoadingGuard } from "@/hooks/useLoadingGuard";
import { useModelList } from "@/hooks/model/model.hooks";
import {
  useCheckVersionComplete,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import {
  useScheduleCreate,
  useSchedulesByVersionKey,
} from "@/hooks/schedule/schedule.hooks";

import { mapParametersToItems } from "@/lib/utils/parameter.helper";
import { scrollToAnchor } from "@/lib/utils/common.helper";

import { ScheduleFormValues } from "@/schemas/scheduleCreateSchema";
import { SchedulePayload, TrainingSchedule } from "@/types/schedule";

import { createSchedule } from "@/lib/api/schedule/create.api";

import { AlertCircle, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ScheduleListPanel } from "@/components/schedule/ScheduleListPanel";

import { v4 as uuidv4 } from "uuid";
import {
  loadVersionPrefillData,
  VersionPrefillData,
} from "@/lib/utils/versionPrefill.helper";
import YourPrefillGuideCard from "@/components/version/YourPrefillGuideCard";
import { ModelParameters } from "@/types/parameters";

export default function ModelVersionDetailPage() {
  // 路由模組
  const { modelId, versionId } = useParams<{
    modelId: string;
    versionId: string;
  }>();
  const router = useRouter();

  // 資料初始化
  const models = useModelList();
  const versions = useVersionsByModelId(modelId);
  const model = models.find((m) => m.modelId === modelId);
  const modelVersion = versions.find((v) => v.version === versionId);
  const parameters = useParameterByVersionKey(modelId, versionId);

  const schedules = useSchedulesByVersionKey(modelId, versionId);

  const isLoading = useLoadingGuard(800);

  // 確定版本完成設定模組
  const { isParamMissing, isScheduleMissing } = useCheckVersionComplete(
    modelId,
    versionId
  );

  // 狀態：是否來自比較頁？（控制導引卡片顯示）
  const [isFromCompare, setIsFromCompare] = useState(false);

  // 狀態：prefill 資料
  const [prefillData, setPrefillData] = useState<VersionPrefillData | null>(
    null
  );

  useEffect(() => {
    if (!modelId || !versionId) return;

    // 嘗試讀取 prefill 資料
    const data = loadVersionPrefillData(modelId, versionId);

    if (data && data.fromComparePage) {
      console.log("[版本詳細頁] 偵測到從比較頁導入", data);
      setIsFromCompare(true);
      setPrefillData(data);

    } else {
      console.log("[版本詳細頁] 無 prefill 資料或來源非比較頁");
    }
  }, [modelId, versionId]);

  // 新增參數模組
  const [openParamDialog, setOpenParamDialog] = useState(false);

  // 新增排程模組
  const addSchedule = useScheduleCreate();
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  // 新增排程提交函式
  const handleSubmit = async (formData: ScheduleFormValues) => {
    try {
      const payload: SchedulePayload = {
        scheduleId: uuidv4(),
        modelId,
        version: versionId,
        runDate: formData.runDate.toISOString(),
        type: formData.type,
        buildDate: new Date().toISOString(),
        status: "scheduled",
      };
      const result = await createSchedule(payload);

      const schedule: TrainingSchedule = {
        scheduleId: result.scheduleId,
        modelId: result.modelId,
        version: result.version,

        buildDate: payload.buildDate,
        runDate: payload.runDate,

        type: payload.type,
        status: result.status,

        triggerTraining: formData.triggerTraining,
      };

      // 加入新排程到全域狀態
      addSchedule(schedule);

      // 顯示通知與路由
      toast.success(`排程 ${schedule.scheduleId} 建立成功！`, {
        action: {
          label: "前往排程詳細頁面",
          onClick: () => router.push(`/schedule/${schedule.scheduleId}`),
        },
      });

      // 關閉對話匡
      setOpenScheduleDialog(false);

      // 自動滾動到排程摘要區跨
      scrollToAnchor("schedule_view", 200);
    } catch (err) {
      toast.error("排程建立失敗，請稍後再試");
      console.error(err);
    }
  };

  // 跳轉比較頁面的函式
  const handleComparePage = () => {
    if (!modelId || !versionId) return;

    // 跳轉到 /models/[modelId]/compare?from=[versionId]
    router.push(`/models/${modelId}/compare?from=${versionId}`);
  };

  const handleBackPage = () => {
    if (!modelId) return;
    // 跳轉到 /models/[modelId]/
    router.push(`/models/${modelId}/`);
  };

  function applyPrefillParams(params: ModelParameters) {
    if (!params) return;
    console.log("[版本詳細頁] 套用建議參數表到表單組件", params);
    toast.success("已套用推薦參數", {
      description: "請檢查參數表並進行微調。",
    });
  }

  return (
    <PageLoader isLoading={isLoading} fallback={<VersionDetailSkeleton />}>
      <PageIntroCard
        imageSrc="/guide/In progress.gif"
        title="這是模型版本的詳細頁，你可以："
        descriptionList={[
          "查看版本基本資訊與訓練狀態",
          "檢視或設定模型訓練參數",
          "新增或管理訓練排程",
          "若尚未設定參數與排程，請盡快完成！",
        ]}
      />
      {model && modelVersion ? (
        <>
          <ModelHeader {...model} />
          <VersionInfoCard {...modelVersion} />
        </>
      ) : (
        <EmptyState
          icon={<AlertCircle className="w-10 h-10" />}
          title="找不到模型版本資料"
          description="請確認模型版本是否正確，或返回模型選單重新選擇。"
          action={
            <Button onClick={() => router.push(`/models/${modelId}`)}>
              返回模型選單
            </Button>
          }
        />
      )}

      <VersionActionPanel
        isParamMissing={isParamMissing}
        isScheduleMissing={isScheduleMissing}
        onSetParams={() => setOpenParamDialog(true)}
        onSetSchedule={() => setOpenScheduleDialog(true)}
        onCompare={handleComparePage}
        onBack={handleBackPage}
      />

      {isFromCompare && prefillData && (
        <YourPrefillGuideCard
          prefillData={prefillData}
          onApplyPrefill={(params) => {
            // 這裡呼叫你的參數設定方法
            applyPrefillParams(params);

            // 順便隱藏卡片
            setIsFromCompare(false);
          }}
        />
      )}

      {/* 參數區塊 */}
      {parameters && Object.keys(parameters).length > 0 ? (
        <ParameterView parameters={mapParametersToItems(parameters)} />
      ) : (
        <EmptyState
          icon={<SlidersHorizontal className="w-10 h-10" />}
          title="尚未設定參數"
          description="請前往設定模型訓練所需參數"
        />
      )}

      {/* 排程區塊 */}
      <ScheduleListPanel schedules={schedules || []} />

      {/* 新增參數表的對話匡 */}
      <ParameterCreateDialog
        open={openParamDialog}
        onOpenChange={setOpenParamDialog}
        modelId={modelId}
        version={versionId}
        prefillParams={prefillData?.prefillParams || null}
      />

      {/* 新增排程的對話匡 */}
      <ScheduleCreateDialog
        open={openScheduleDialog}
        onOpenChange={setOpenScheduleDialog}
        onSubmit={handleSubmit}
        modelId={modelId}
        versionId={versionId}
      />
    </PageLoader>
  );
}
