import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { TrainingMetric } from "@/types/training";

interface TrainingResultCompareChartProps {
  baseVersionId: string;
  targetVersionId: string;
  baseMetrics: TrainingMetric[];
  targetMetrics: TrainingMetric[];
}

export default function TrainingResultCompareChart({
  baseVersionId,
  targetVersionId,
  baseMetrics,
  targetMetrics,
}: TrainingResultCompareChartProps) {
  // 合併兩筆資料的 epoch 作為 x 軸
  const allEpochs = Array.from(
    new Set([
      ...baseMetrics.map((m) => m.epoch),
      ...targetMetrics.map((m) => m.epoch),
    ])
  ).sort((a, b) => a - b);

  const mergedData = allEpochs.map((epoch) => {
    const base = baseMetrics.find((m) => m.epoch === epoch);
    const target = targetMetrics.find((m) => m.epoch === epoch);
    return {
      epoch,
      base_loss: base?.loss,
      base_acc: base?.accuracy,
      target_loss: target?.loss,
      target_acc: target?.accuracy,
    };
  });

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            訓練結果比較圖 {targetVersionId} ↔ {baseVersionId}
          </h3>
          <p className="text-sm text-muted-foreground">
            顯示兩版本的 Accuracy 與 Loss 隨 Epoch 變化
          </p>
        </div>

        {mergedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={mergedData}
              margin={{
                bottom: 10,
              }}
            >
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
              <Legend verticalAlign="top" height={36} />

              {/* Target version (比較版) */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="target_acc"
                name={`Accuracy (${targetVersionId})`}
                stroke="#60A5FA" // 藍色
                strokeDasharray="5 5"
                strokeWidth={2}
                dot
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="target_loss"
                name={`Loss (${targetVersionId})`}
                stroke="#F87171" // 紅色
                strokeDasharray="5 5"
                strokeWidth={2}
                dot
              />

              {/* Base version (最新版) */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="base_acc"
                name={`Accuracy (${baseVersionId})`}
                stroke="#2563EB" // 深藍色
                strokeWidth={2}
                dot
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="base_loss"
                name={`Loss (${baseVersionId})`}
                stroke="#DC2626" // 深紅色
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            尚無訓練結果資料，請先執行訓練排程。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
