import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { ModelVersion } from "@/types/model";
import { ModelVersionStatusBadge } from "@/components/models/ModelVersionStatusBadge";
import { useEffect, useState } from "react";

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
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">
            版本 <span className="text-primary">{versionId}</span>
            {isLatest && (
              <Badge variant="outline" className="ml-2">
                最新
              </Badge>
            )}
          </div>
          <ModelVersionStatusBadge status={status} />
        </div>

        <p className="text-xs text-muted-foreground">
          修改摘要：{modifiedType}
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
