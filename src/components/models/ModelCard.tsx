"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Model } from "@/types/model";

import { format } from "date-fns";

import {
  getModelStatusLabel,
  getModelStatusBadgeVariant,
} from "@/lib/utils/status.helper";

import { ModelVersionAccordion } from "./ModelVersionAccordion";

import { useModelStore } from "@/contexts/ModelContext";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const { versionMap } = useModelStore();

  const latestVersion = versionMap[model.modelId]?.at(-1);

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {model.name}
          {latestVersion && (
            <Badge
              variant={getModelStatusBadgeVariant(latestVersion.status ?? "")}
              className="text-xs"
            >
              {getModelStatusLabel(latestVersion.status ?? "")}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground line-clamp-2">
          {model.description}
        </p>

        <Separator className="my-2" />

        {latestVersion ? (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              最新版本：
              <span className="text-foreground font-medium">
                {latestVersion.version}
              </span>
            </p>

            <p className="text-xs text-muted-foreground">
              修改摘要：{latestVersion.modifiedType} -{" "}
              {format(new Date(latestVersion.modifiedDate), "yyyy-MM-dd HH:mm")}
            </p>

            <p className="text-xs text-muted-foreground">
              創建日期：
              {format(new Date(latestVersion.buildDate), "yyyy-MM-dd HH:mm")}
            </p>

            <p className="text-xs text-muted-foreground">
              訓練時間：
              {latestVersion.trainingTime} s
            </p>
          </div>
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
