// components/schedule/TrainingProgressCard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface Props {
  progress: number;
  initialized?: boolean;
  connected?: boolean;
}

export function TrainingProgressCard({
  progress,
  initialized,
  connected,
}: Props) {
  const showLoading = initialized || !connected;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {showLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
          {initialized
            ? "正在初始化連線..."
            : connected
            ? "模型訓練中..."
            : "等待連線中..."}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground">
          當前進度：{progress}%
          {!connected && (
            <span className="ml-2 text-destructive">（連線中斷）</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
