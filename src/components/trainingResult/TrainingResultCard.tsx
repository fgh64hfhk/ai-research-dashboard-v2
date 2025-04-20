"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { TrainingResult } from "@/types/training";
import { format } from "date-fns";

interface Props {
  results?: TrainingResult[];
  className?: string;
}

function getLatestResult(
  results: TrainingResult[] | undefined
): TrainingResult | undefined {
  if (!results || results.length === 0) return undefined;

  return [...results]
    .filter((r) => r.status === "completed" || r.status === "failed")
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0];
}

export default function TrainingResultCard({ results, className }: Props) {
  const [showLogs, setShowLogs] = useState(false);

  const result = getLatestResult(results);

  if (!result) return null;

  const isSuccess = result.status === "completed";

  return (
    <Card className={className}>
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="text-green-500 w-5 h-5" />
          ) : (
            <AlertTriangle className="text-red-500 w-5 h-5" />
          )}
          <p className="text-sm font-medium">
            最近一次訓練 {isSuccess ? "已完成" : "失敗"}
          </p>
          <Badge variant={isSuccess ? "outline" : "destructive"}>
            {isSuccess ? "成功" : "失敗"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          完成時間：{format(new Date(result.completedAt), "yyyy-MM-dd HH:mm")}
        </p>

        {result.metrics && (
          <div className="text-sm text-muted-foreground">
            Accuracy：
            <span className="font-medium text-foreground">
              {result.metrics.accuracy}
            </span>
            <br />
            Loss：
            <span className="font-medium text-foreground">
              {result.metrics.loss}
            </span>
          </div>
        )}

        {result.logs && (
          <div className="text-sm">
            <button
              className="text-blue-500 hover:underline flex items-center gap-1"
              onClick={() => setShowLogs((prev) => !prev)}
            >
              {showLogs ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {showLogs ? "隱藏訓練日誌" : "查看訓練日誌"}
            </button>
            {showLogs && (
              <ul className="mt-2 pl-4 list-disc text-muted-foreground space-y-1">
                {result.logs.map((line, i) => (
                  <li key={i} className="text-xs">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {result.message && !isSuccess && (
          <p className="text-xs text-red-500">{result.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
