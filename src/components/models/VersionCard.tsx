import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { ModelVersion } from "@/types/model";
import { ModelVersionStatusBadge } from "@/components/models/ModelVersionStatusBadge";
import { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCheckVersionComplete } from "@/hooks/version/version.hooks";

interface VersionCardProps {
  version: ModelVersion & { isLatest?: boolean };
  highlight?: boolean;
  modelId: string;
}

export function VersionCard({
  version,
  highlight = false,
  modelId,
}: VersionCardProps) {
  const router = useRouter();
  const [isHighlight, setIsHighlight] = useState(highlight);
  const { isParamMissing } = useCheckVersionComplete(modelId, version.version);

  useEffect(() => {
    if (isHighlight) {
      const timer = setTimeout(() => {
        setIsHighlight(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  });

  const {
    version: versionId,
    modifiedDate,
    modifiedType,
    buildDate,
    trainingTime,
    status,
    isLatest,
  } = version;

  return (
    <Card
      className={cn(
        "transition-all border hover:border-primary/50 hover:shadow-md",
        isHighlight && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <CardContent className="py-4 space-y-2">
        <div className="flex items-center gap-2 justify-between">
          <div className="text-sm font-semibold flex items-center gap-1">
            版本-<span className="text-primary">{versionId}</span>
            {isLatest && <Badge variant="outline">最新版本</Badge>}
            {isParamMissing && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-300 rounded-full"></span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  尚未完成參數設定，點擊查看詳情進入編輯。
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <ModelVersionStatusBadge status={status} />
        </div>

        <p className="text-xs text-muted-foreground">
          修改摘要：{modifiedType}
        </p>

        <p className="text-xs text-muted-foreground">
          修改時間：{format(new Date(modifiedDate), "yyyy-MM-dd HH:mm")}
        </p>

        <p className="text-xs text-muted-foreground">
          建立時間：{format(new Date(buildDate), "yyyy-MM-dd HH:mm")}
        </p>

        <p className="text-xs text-muted-foreground">
          訓練時間：{trainingTime}s
        </p>

        <div className="pt-2">
          <Button
            variant="link"
            className="h-6 px-0 text-sm"
            onClick={() =>
              router.push(`/models/${modelId}/version/${versionId}`)
            }
          >
            查看詳情 →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
