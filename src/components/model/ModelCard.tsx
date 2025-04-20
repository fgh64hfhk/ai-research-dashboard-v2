"use client";

import { Model } from "@/types/model";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: Model;
  versionCount?: number;
  latestVersion?: string;
  className?: string;
}

export function ModelCard({
  model,
  versionCount,
  latestVersion,
  className,
}: ModelCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/models/${model.modelId}`)}
      className={cn(
        "cursor-pointer transition hover:shadow-md hover:border-primary p-4 space-y-2 rounded-xl",
        className
      )}
    >
      {/* 標題與描述 */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {model.description}
        </p>
      </div>

      {/* 標籤與版本 */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Badge variant="secondary">{model.language}</Badge>

        {versionCount !== undefined && (
          <Badge variant="outline">
            {latestVersion ? `v${latestVersion}` : "尚無版本"} / 共{" "}
            {versionCount} 版
          </Badge>
        )}
      </div>
    </Card>
  );
}
