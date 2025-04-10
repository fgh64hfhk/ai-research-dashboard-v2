// components/compare/ResultComparisonCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingResult } from "@/types/schedule";
import { EmptyState } from "@/components/common/EmptyState";
import { BarChart3 } from "lucide-react";

interface Props {
  resultA?: TrainingResult;
  resultB?: TrainingResult;
}

export function ResultComparisonCard({ resultA, resultB }: Props) {
  if (!resultA || !resultB) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-10 h-10" />}
        title="無法顯示訓練結果對比"
        description="請確認兩個版本皆有產生訓練結果。"
      />
    );
  }

  const metricsKeys = Object.keys({ ...resultA.metrics, ...resultB.metrics});

  const basicRows = [
    { label: "訓練狀態", valA: resultA.status, valB: resultB.status },
    { label: "訓練耗時 (秒)", valA: resultA.trainingTime, valB: resultB.trainingTime },
    { label: "完成時間", valA: resultA.completedAt, valB: resultB.completedAt },
  ];

  const metricRows = metricsKeys.map((key) => ({
    label: key,
    valA: resultA.metrics?.[key],
    valB: resultB.metrics?.[key],
  }));

  const rows = [
    { label: "訓練狀態", key: "status" },
    { label: "準確率 (Accuracy)", key: "accuracy" },
    { label: "損失值 (Loss)", key: "loss" },
    { label: "訓練耗時 (秒)", key: "duration" },
  ];

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">訓練結果對比</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">結果摘要</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[...basicRows, ...metricRows].map(({ label, valA, valB }) => {
            // const valA = resultA[key as keyof TrainingResult];
            // const valB = resultB[key as keyof TrainingResult];
            const isDiff = valA !== valB;
            return (
              <div
                key={label}
                className={`grid grid-cols-3 gap-4 items-center p-2 rounded-md ${
                  isDiff ? "bg-yellow-50" : ""
                }`}
              >
                <span className="text-muted-foreground font-medium">
                  {label}
                </span>
                <span>{renderValue(valA)}</span>
                <span>{renderValue(valB)}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function renderValue(val: unknown) {
  if (typeof val === "boolean") return val ? "是" : "否";
  if (val === null || val === undefined) return "-";
  if (typeof val === "number") return val.toFixed(3);
  if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/)) return val.replace("T", " ").slice(0, 19);
  return String(val);
}
