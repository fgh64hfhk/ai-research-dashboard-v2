"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  getModelStatusBadgeVariant,
  getModelStatusLabel,
} from "@/lib/utils/status.helper";

import { getSortedVersions } from "@/lib/utils/getSortedVersions";

import { useModelStore } from "@/contexts/ModelContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  modelId: string;
}

export function ModelVersionAccordion({ modelId }: Props) {
  const router = useRouter();

  const { versionMap, loadingMap, fetchModelVersions } = useModelStore();

  const versions = versionMap[modelId];
  const isLoading = loadingMap[modelId];

  const [toFetch, setFetchState] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [isDescending, setIsDescending] = useState(true);

  const sortedVersions = getSortedVersions(versions || [], isDescending);

  return (
    <Accordion type="single" collapsible className="w-full mt-2">
      <AccordionItem value="versions">
        <div className="flex justify-between items-center">
          <AccordionTrigger
            className="flex-1"
            onClick={() => {
              if (toFetch) {
                fetchModelVersions(modelId);
                setFetchState(false);
              }
              setDisabled((prev) => !prev);
            }}
          >
            查看所有版本
          </AccordionTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // 防止同時觸發展開
                    setIsDescending((prev) => !prev);
                  }}
                  disabled={disabled}
                >
                  {isDescending ? (
                    <ArrowDownWideNarrow className="h-4 w-4" />
                  ) : (
                    <ArrowUpWideNarrow className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>切換排序方向</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <AccordionContent className="space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3 mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </>
          )}
          {!isLoading &&
            sortedVersions.map((version) => {
              const key = `${version.modelId}_${version.version}`;
              return (
                <div key={key} className="space-y-1 border-b pb-3">
                  <p className="flex items-center gap-2 justify-between">
                    <strong className="text-muted-foreground">
                      版本-{version.version}{" "}
                      {version.isLatest && (
                        <Badge variant="outline">最新版本</Badge>
                      )}
                    </strong>

                    <Badge
                      variant={getModelStatusBadgeVariant(version.status || "")}
                    >
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
                    訓練時間：
                    {version.trainingTime} s
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 text-blue-600 mt-1"
                    onClick={() =>
                      router.push(
                        `/models/${modelId}/version/${version.version}`
                      )
                    }
                  >
                    查看詳情
                  </Button>
                </div>
              );
            })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
