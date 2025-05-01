"use client";

import { Card } from "@/components/ui/card";
import { TrainingMetric } from "@/types/training";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrainingResultChartSingleProps {
  version: string;
  metrics: TrainingMetric[];
}

export default function TrainingResultChartSingle({
  version,
  metrics,
}: TrainingResultChartSingleProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">訓練結果（{version}）</h3>
        <p className="text-sm text-muted-foreground">
          顯示初始版本的訓練指標變化（Accuracy 與 Loss）
        </p>
      </div>

      {metrics.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epoch"
                label={{
                  value: "Epoch",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                label={{
                  value: "Accuracy",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Loss", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#4F46E5"
                strokeWidth={2}
                dot
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="loss"
                stroke="#EF4444"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">尚無訓練結果資料</div>
      )}
    </Card>
  );
}
