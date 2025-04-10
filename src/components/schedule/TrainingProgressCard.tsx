// components/schedule/TrainingProgressCard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface Props {
  progress: number;
  connected?: boolean;
}

export function TrainingProgressCard({ progress, connected }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          模型訓練中...
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground">
          當前進度：{progress}%
          {connected === false && (
            <span className="ml-2 text-destructive">（連線中斷）</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
