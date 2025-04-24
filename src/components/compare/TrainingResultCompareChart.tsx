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

interface TrainingMetric {
  epoch: number;
  loss: number;
  acc: number;
}

interface TrainingResultCompareChartProps {
  baseVersionId: string;
  targetVersionId: string;
  baseMetrics?: TrainingMetric[];
  targetMetrics?: TrainingMetric[];
}

const TrainingResultCompareChart: React.FC<TrainingResultCompareChartProps> = ({
  baseVersionId,
  targetVersionId,
  baseMetrics = [],
  targetMetrics = [],
}) => {
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
      base_acc: base?.acc,
      target_loss: target?.loss,
      target_acc: target?.acc,
    };
  });

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="text-lg font-semibold">訓練結果比較圖</div>
        {mergedData.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            目前尚無訓練結果可比較。
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="epoch"
                label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "Loss / Accuracy",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="base_loss"
                name={`Loss (${baseVersionId})`}
                stroke="#8884d8"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="base_acc"
                name={`Accuracy (${baseVersionId})`}
                stroke="#82ca9d"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target_loss"
                name={`Loss (${targetVersionId})`}
                stroke="#ff7300"
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target_acc"
                name={`Accuracy (${targetVersionId})`}
                stroke="#ffc658"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingResultCompareChart;
