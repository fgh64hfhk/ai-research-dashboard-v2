// components/models/VersionList.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { getSortedVersions } from "@/lib/utils/getSortedVersions";
import { ModelVersion } from "@/types/model";
import {
  getModelStatusBadgeVariant,
  getModelStatusLabel,
} from "@/lib/utils/status.helper";

interface Props {
  modelId: string;
  versions: ModelVersion[];
  isLoading: boolean;
}

export function VersionList({ modelId, versions, isLoading }: Props) {
  const router = useRouter();
  const [isDescending, setIsDescending] = useState(true);

  const sortedVersions = getSortedVersions(versions || [], isDescending);

  useEffect(() => {
    // 若資料為空，預設關閉排序按鈕
    if (!versions || versions.length <= 1) setIsDescending(true);
  }, [versions]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3 mt-2" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">尚無版本資料</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDescending((prev) => !prev)}
              >
                {isDescending ? (
                  <ArrowDownWideNarrow className="h-4 w-4" />
                ) : (
                  <ArrowUpWideNarrow className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDescending ? "改為升序" : "改為降序"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {sortedVersions.map((version) => {
        const key = `${version.modelId}_${version.version}`;

        return (
          <div key={key} className="space-y-1 border-b pb-3">
            <p className="flex items-center gap-2 justify-between">
              <strong className="text-muted-foreground">
                版本-{version.version}{" "}
                {version.isLatest && <Badge variant="outline">最新版本</Badge>}
              </strong>
              <Badge variant={getModelStatusBadgeVariant(version.status || "")}>
                {getModelStatusLabel(version.status || "")}
              </Badge>
            </p>
            <p className="text-xs text-muted-foreground">
              修改摘要：{version.modifiedType} -{" "}
              {format(new Date(version.modifiedDate), "yyyy-MM-dd")}
            </p>
            <p className="text-xs text-muted-foreground">
              創建日期：
              {format(new Date(version.buildDate), "yyyy-MM-dd HH:mm")}
            </p>
            <p className="text-xs text-muted-foreground">
              訓練時間：{version.trainingTime} s
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="px-0 text-blue-600 mt-1"
              onClick={() =>
                router.push(`/models/${modelId}/version/${version.version}`)
              }
            >
              查看詳情
            </Button>
          </div>
        );
      })}
    </div>
  );
}
