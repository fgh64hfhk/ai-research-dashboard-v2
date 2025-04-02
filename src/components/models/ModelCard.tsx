"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { RefreshCw } from "lucide-react";

import { Model } from "@/types/model";

import { ModelVersionStatusBadge } from "./ModelVersionStatusBadge";
import { ModelVersionPreview } from "./ModelVersionPreview";
import { ModelVersionAccordion } from "./ModelVersionAccordion";

import { useModelStore } from "@/contexts/ModelContext";
import { Skeleton } from "../ui/skeleton";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const { latestVersion, latestVersionLoadingMap, reloadLatestVersion } = useModelStore();

  const data = latestVersion[model.modelId];
  const isLoading = latestVersionLoadingMap[model.modelId] ?? false;

  const version = data.version;
  const parameters = data.parameters;
  const schedules = data.nextSchedule;

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
              onClick={() => reloadLatestVersion(model.modelId)}
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
          <>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3 mt-2" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </>
        ) : version ? (
          <ModelVersionPreview
            version={version}
            parameters={parameters}
            schedule={schedules}
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
