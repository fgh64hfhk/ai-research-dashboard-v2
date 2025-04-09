// components/schedule/TrainingResultCard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrainingResult } from "@/types/schedule";
import { format } from "date-fns";
import { BarChart3, CheckCircle2, FileQuestion, XCircle } from "lucide-react";
import { EmptyState } from "../models/EmptyState";

interface Props {
  result: TrainingResult;
}

export function TrainingResultCard({ result }: Props) {
  if (!result) {
    return (
      <EmptyState
        icon={<FileQuestion className="w-8 h-8" />}
        title="尚無訓練結果"
        description="此排程尚未完成或未執行訓練。"
      />
    );
  }

  const isSuccess = result.status === "completed";

  return (
    <Card className="border-muted bg-muted/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="text-green-600 w-5 h-5" />
          ) : (
            <XCircle className="text-red-500 w-5 h-5" />
          )}
          訓練結果：{isSuccess ? "成功" : "失敗"}
        </CardTitle>
        <Badge variant={isSuccess ? "secondary" : "destructive"}>
          {result.status}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">
          完成時間：{format(new Date(result.completedAt), "yyyy-MM-dd HH:mm")}
        </p>
        <p className="text-muted-foreground">
          訓練時間：{result.trainingTime} 秒
        </p>
        {result.metrics && (
          <div className="text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              訓練指標：
            </div>
            <ul className="ml-6 list-disc">
              {Object.entries(result.metrics).map(([key, val]) => (
                <li key={key}>
                  {key}: <span className="font-medium">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.logs && (
          <div className="text-muted-foreground">
            <div className="font-medium">訓練日誌：</div>
            <ul className="ml-6 list-disc text-xs">
              {result.logs.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        )}
        {result.message && !isSuccess && (
          <p className="text-sm text-destructive font-medium">
            {result.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
