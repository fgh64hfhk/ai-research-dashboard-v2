"use client";

import { ModelHeader } from "@/components/models/ModelHeader";
import { VersionInfoCard } from "@/components/models/VersionInfoCard";
import { ParameterView } from "@/components/models/ParameterView";
import { BackButton } from "@/components/common/BackButton";

import { useParams, useRouter } from "next/navigation";
import { mapParametersToItems } from "@/lib/utils/parameter.helper";
import { AlertCircle, ListChecks, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

import { useModelList } from "@/hooks/model/model.hooks";
import {
  useCheckVersionComplete,
  useVersionsByModelId,
} from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useScheduleCreate, useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { useTrainingResultsByVersionKey } from "@/hooks/training/useTrainingResult";

import { VersionActionPanel } from "@/components/version/VersionActionPanel";
import { getNextScheduledTask } from "@/lib/utils/schedule.helper";
import { NextTrainingScheduleCard } from "@/components/schedule/NextTrainingScheduleCard";
import { TrainingResultCard } from "@/components/schedule/TrainingResultCard";
import { useEffect, useState } from "react";
import { ParameterCreateDialog } from "@/components/parameter/ParameterCreateDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IntroCard } from "@/components/common/PageIntroCard";
import { ScheduleCreateDialog } from "@/components/version_page/ScheduleCreateDialog";
import { ScheduleFormValues } from "@/schemas/scheduleCreateSchema";
import { SchedulePayload, TrainingSchedule } from "@/types/schedule";
import { toast } from "sonner";
import { createSchedule } from "@/lib/api/schedule/create.api";

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
  const schedule = getNextScheduledTask(schedules);
  const results = useTrainingResultsByVersionKey(schedule?.id || "");

  // 確定版本完成設定模組
  const { isParamMissing, isScheduleMissing } = useCheckVersionComplete(
    modelId,
    versionId
  );

  // 新增參數模組
  const [openParamDialog, setOpenParamDialog] = useState(false);

  // 新增排程模組
  const addSchedule = useScheduleCreate();
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  // 新增排程提交函式
  const handleSubmit = async (formData: ScheduleFormValues) => {
    try {
      const payload: SchedulePayload = {
        scheduleId: "s001",
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

        triggerTraining: formData.triggerTraining
      }

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
    } catch (err) {
      toast.error("排程建立失敗，請稍後再試");
      console.error(err);
    }
  };

  // 載入緩衝模組
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!model || !modelVersion) {
    return (
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
    );
  }

  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      <IntroCard
        imageSrc="/guide/In progress.gif"
        title="這是該模型版本的詳細頁，您可以："
        descriptionList={[
          "查看版本基本資訊與訓練狀態",
          "檢視或設定模型訓練參數",
          "新增或管理訓練排程",
          "若尚未設定參數與排程，請盡快完成！",
        ]}
      />
      <ModelHeader {...model} />
      <VersionActionPanel
        isParamMissing={isParamMissing}
        isScheduleMissing={isScheduleMissing}
        onSetParams={() => setOpenParamDialog(true)}
        onSetSchedule={() => setOpenScheduleDialog(true)}
      />
      <VersionInfoCard {...modelVersion} />

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
      {schedule ? (
        <NextTrainingScheduleCard schedule={schedule} />
      ) : (
        <EmptyState
          icon={<ListChecks className="w-10 h-10" />}
          title="尚未排程"
          description="請為此版本建立一個訓練排程"
        />
      )}

      {/* 結果區塊 */}
      {results ? (
        <TrainingResultCard results={results} />
      ) : (
        <EmptyState
          icon={<ListChecks className="w-10 h-10" />}
          title="沒有結果"
          description="請為此版本建立一個訓練排程"
        />
      )}

      <div className="flex justify-end">
        <BackButton />
      </div>

      {/* 新增參數表的對話匡 */}
      <ParameterCreateDialog
        open={openParamDialog}
        onOpenChange={setOpenParamDialog}
        modelId={modelId}
        version={versionId}
      />

      {/* 新增排程的對話匡 */}
      <ScheduleCreateDialog
        open={openScheduleDialog}
        onOpenChange={setOpenScheduleDialog}
        onSubmit={handleSubmit}
        modelId={modelId}
        versionId={versionId}
      />
    </div>
  );
}
