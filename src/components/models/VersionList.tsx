// components/models/VersionList.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getSortedVersions } from "@/lib/utils/version.helper";
import { ModelVersion } from "@/types/model";
import { ModelVersionStatusBadge } from "@/components/models/ModelVersionStatusBadge";
import { Badge } from "@/components/ui/badge";

import { VersionListActionPanel } from "./VersionListActionPanel";

interface Props {
  modelId: string;
  versions: ModelVersion[];
  isLoading: boolean;
}

export function VersionList({ modelId, versions, isLoading }: Props) {
  const router = useRouter();
  const [isDescending, setIsDescending] = useState(true);
  const [selectedType, setSelectedType] = useState("__all__");

  const availableTypes = Array.from(
    new Set(versions.map((v) => v.modifiedType))
  );

  const filteredSortedVersions = useMemo(() => {
    // ✅ 過濾
    const filtered =
      selectedType === "__all__"
        ? versions
        : versions.filter((v) => v.modifiedType === selectedType);

    // ✅ 排序（沿用既有邏輯）
    const sortedVersions = getSortedVersions(filtered, isDescending);

    return sortedVersions;
  }, [versions, isDescending, selectedType]);

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
      <VersionListActionPanel
        isDescending={isDescending}
        onToggleSort={() => setIsDescending((prev) => !prev)}
        availableTypes={availableTypes}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {filteredSortedVersions.map((version) => {
        const key = `${version.modelId}_${version.version}`;

        return (
          <div key={key} className="space-y-1 border-b pb-3">
            <p className="flex items-center gap-2 justify-between">
              <strong className="text-muted-foreground">
                版本-{version.version}{" "}
                {version.isLatest && <Badge variant="outline">最新版本</Badge>}
              </strong>
              <ModelVersionStatusBadge status={version.status} />
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
