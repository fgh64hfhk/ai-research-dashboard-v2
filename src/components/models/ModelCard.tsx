"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Model } from "@/types/model";

import { ModelVersionStatusBadge } from "./ModelVersionStatusBadge";
import { VersionPreview } from "./VersionPreview";

import { ModelVersionAccordion } from "./ModelVersionAccordion";

import { useModelStore } from "@/contexts/ModelContext";
import { getNextScheduledTask } from "@/lib/utils/schedule.helper";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const { latestVersion, parameterMap, scheduleMap } = useModelStore();

  const version = latestVersion[model.modelId];

  const key = `${model.modelId}_${version.version}`;
  const parameters = parameterMap[key];
  const schedules = scheduleMap[key] || [];

  // 找出最近的「未來任務」
  const nextSchedule = getNextScheduledTask(schedules);

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {model.name}
          {version && <ModelVersionStatusBadge status={version.status || ""} />}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground line-clamp-2">
          {model.description}
        </p>

        <Separator className="my-2" />

        {version ? (
          <VersionPreview
            version={version}
            parameters={parameters}
            schedule={nextSchedule}
          />
        ) : (
          <div className="text-muted-foreground text-center py-10">
            尚未建立任何版本
          </div>
        )}

        {/* 懶加載顯示區塊 */}
        <ModelVersionAccordion modelId={model.modelId} />
      </CardContent>
    </Card>
  );
}
