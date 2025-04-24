import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrainingInsight } from "@/lib/utils/insight.helper";
import { EmptyState } from "@/components/common/EmptyState";

interface TrainingResultInsightCardProps {
  summary: TrainingInsight | null;
}

const TrainingResultInsightCard: React.FC<TrainingResultInsightCardProps> = ({
  summary,
}) => {
  if (!summary) return <EmptyState title={"查無系統初步分析"} />;
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">系統初步分析</h2>
          {summary.betterVersionId && (
            <Badge variant="outline">
              建議使用版本：{summary.betterVersionId}
            </Badge>
          )}
        </div>

        <ul className="list-disc list-inside space-y-1 text-sm">
          {summary.insights.map((insight, index) => (
            <li
              key={index}
              className={cn(insight.important && "font-medium text-foreground")}
            >
              {insight.label}
            </li>
          ))}
        </ul>

        <div className="text-muted-foreground text-sm">
          {summary.recommendation}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingResultInsightCard;
