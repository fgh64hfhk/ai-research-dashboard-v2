"use client";

import { ModelHeader } from "@/components/models/ModelHeader";
import { VersionInfoCard } from "@/components/models/VersionInfoCard";
import { ParameterView } from "@/components/models/ParameterView";
import { TrainingScheduleView } from "@/components/schedule/TrainingScheduleView";
import { BackButton } from "@/components/common/BackButton";

import { useParams } from "next/navigation";
import { mapParametersToItems } from "@/lib/utils/parameter.helper";
import { ListChecks, SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

import { useModelList } from "@/hooks/model/model.hooks";
import { useVersionsByModelId } from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";
import { VersionActionPanel } from "@/components/version/VersionActionPanel";
import { VersionIntroCard } from "@/components/version/VersionIntroCard";

export default function ModelVersionDetailPage() {
  const { modelId, versionId } = useParams<{
    modelId: string;
    versionId: string;
  }>();

  const models = useModelList();

  const versions = useVersionsByModelId(modelId);

  const model = models.find((m) => m.modelId === modelId);

  const modelVersion = versions.find((v) => v.version === versionId);

  const parameters = useParameterByVersionKey(modelId, versionId);

  const schedules = useSchedulesByVersionKey(modelId, versionId);

  const isParamMissing = !parameters || Object.keys(parameters).length === 0;
  const isScheduleMissing = !schedules || schedules.length === 0;

  if (!model || !modelVersion) {
    return (
      <p className="text-muted-foreground text-center py-10">
        請重新載入確認全域狀態有獲取資料。
      </p>
    );
  }

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
      <ModelHeader {...model} />
      <VersionIntroCard />
      <VersionActionPanel
        modelId={modelId}
        versionId={versionId}
        isParamMissing={isParamMissing}
        isScheduleMissing={isScheduleMissing}
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
      {schedules && schedules.length > 0 ? (
        <TrainingScheduleView schedules={schedules} />
      ) : (
        <EmptyState
          icon={<ListChecks className="w-10 h-10" />}
          title="尚未排程"
          description="請為此版本建立一個訓練排程"
        />
      )}

      <div className="flex justify-end">
        <BackButton />
      </div>
    </div>
  );
}
