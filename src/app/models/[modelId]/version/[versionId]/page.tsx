"use client";

import { ModelHeader } from "@/components/models/ModelHeader";
import { VersionInfoCard } from "@/components/models/VersionInfoCard";
import { ParameterView } from "@/components/models/ParameterView";
import { TrainingScheduleView } from "@/components/models/TrainingScheduleView";
import { BackButton } from "@/components/models/BackButton";

import { useModelStore } from "@/contexts/ModelContext";

import { useParams } from "next/navigation";
import { mapParametersToItems } from "@/lib/utils/mapParametersToItems";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/models/EmptyState";

export default function ModelVersionDetailPage() {
  const { modelId, versionId } = useParams<{
    modelId: string;
    versionId: string;
  }>();
  const { models, versionMap, parameterMap, scheduleMap } = useModelStore();

  const model = models.find((m) => m.modelId === modelId);

  const modelVersion = versionMap[modelId]?.find(
    (v) => v.version === versionId
  );

  if (!model || !modelVersion) {
    return (
      <p className="text-muted-foreground text-center py-10">
        請重新載入確認全域狀態有獲取資料。
      </p>
    );
  }

  const key = `${model?.modelId}_${modelVersion?.version}`;

  const parameters = parameterMap[key];

  const schedules = scheduleMap[key];

  return (
    <div className="container max-w-4xl py-8 px-8 space-y-8">
      <ModelHeader {...model} />
      <VersionInfoCard {...modelVersion} />
      {parameters && Object.keys(parameters).length > 0 ? (
        <ParameterView parameters={mapParametersToItems(parameters)} />
      ) : (
        <EmptyState
          icon={<SlidersHorizontal className="w-10 h-10" />}
          title="無參數設定"
          description="該版本尚未設定任何模型參數"
        />
      )}
      <TrainingScheduleView schedules={schedules} />
      <div className="pt-4 flex justify-end">
        <BackButton />
      </div>
    </div>
  );
}
