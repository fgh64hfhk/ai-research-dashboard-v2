"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { FileClock, RefreshCw } from "lucide-react";

import { Model } from "@/types/model";

import { ModelVersionStatusBadge } from "@/components/models/ModelVersionStatusBadge";
import { ModelVersionPreview } from "@/components/models/ModelVersionPreview";
import { ModelVersionAccordion } from "@/components/models/ModelVersionAccordion";
import { ModelVersionPreviewSkeleton } from "@/components/models/ModelVersionPreviewSkeleton";
import { EmptyState } from "@/components/common/EmptyState";

import {
  useLatestVersionByModelId,
  useVersionLoading,
  fetchModelVersions,
} from "@/hooks/version/version.hooks";
import { useParameterByVersionKey } from "@/hooks/parameter/parameter.hooks";
import { useSchedulesByVersionKey } from "@/hooks/schedule/schedule.hooks";

import { useVersionContext } from "@/contexts/version/VersionContext";

import { getNextScheduledTask } from "@/lib/utils/schedule.helper";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const version = useLatestVersionByModelId(model.modelId);
  const parameters = useParameterByVersionKey(
    model.modelId,
    version?.version || ""
  );
  const schedules = useSchedulesByVersionKey(
    model.modelId,
    version?.version || ""
  );
  const schedule = getNextScheduledTask(schedules);

  const isLoading = useVersionLoading(model.modelId);

  const { dispatch } = useVersionContext();

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="truncate">{model.name}</span>

          <div className="flex items-center gap-2">
            {version && (
              <ModelVersionStatusBadge status={version.status || ""} />
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => fetchModelVersions(model.modelId, dispatch)}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground line-clamp-2">
          {model.description}
        </p>

        <Separator className="my-2" />

        {isLoading ? (
          <ModelVersionPreviewSkeleton />
        ) : version ? (
          <ModelVersionPreview
            version={version}
            parameters={parameters}
            schedule={schedule}
          />
        ) : (
          <EmptyState
            icon={<FileClock className="w-10 h-10" />}
            title="尚未建立任何版本"
            description="建立版本後即可開始設定參數與排程訓練流程。"
            action={<Button>立即新增版本</Button>}
          />
        )}

        {/* 懶加載顯示區塊 */}
        {version && <ModelVersionAccordion modelId={model.modelId} />}
      </CardContent>
    </Card>
  );
}
