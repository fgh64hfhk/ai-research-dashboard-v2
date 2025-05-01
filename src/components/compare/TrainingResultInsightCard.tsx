"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Lightbulb, ShieldCheck, Target, Star } from "lucide-react";
import { TrainingInsight } from "@/lib/utils/insight.helper";

interface TrainingResultInsightCardProps {
  summary: TrainingInsight | null;
}

export default function TrainingResultInsightCard({
  summary,
}: TrainingResultInsightCardProps) {
  if (!summary) {
    return (
      <EmptyState
        title="查無系統初步分析"
        description="目前尚無足夠訓練資料，請進行初步訓練。"
      />
    );
  }

  // 🔵 進行分析分類
  const baseInsights = summary.insights
    .filter((i) => i.type === "base")
    .sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0)); // ⭐️ 重要的排前面

  const targetInsights = summary.insights
    .filter((i) => i.type === "target")
    .sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));

  const compareInsights = summary.insights
    .filter((i) => i.type === "compare")
    .sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));

  return (
    <Card className="p-6 space-y-6">
      {/* 標題區 */}
      <div className="flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-400" />
        <h2 className="text-lg font-semibold">訓練結果前瞻分析</h2>
        {summary.betterVersionId && (
          <Badge variant="outline">
            建議使用版本：{summary.betterVersionId}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-8">
        {/* ➡️ 渲染分組 Insights */}
        {[
          {
            title: "基礎版本分析",
            icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
            items: baseInsights,
            dotColor: "bg-blue-400",
          },
          {
            title: "目標版本分析",
            icon: <Target className="w-5 h-5 text-orange-500" />,
            items: targetInsights,
            dotColor: "bg-orange-400",
          },
          {
            title: "版本間比較分析",
            icon: <GitCompare className="w-5 h-5 text-purple-500" />,
            items: compareInsights,
            dotColor: "bg-purple-400",
          },
        ].map(
          (section, idx) =>
            section.items.length > 0 && (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h4 className="text-base font-semibold">{section.title}</h4>
                </div>
                <ul className="space-y-1 pl-6">
                  {section.items.map((item, iidx) => (
                    <li
                      key={iidx}
                      className={`flex items-start gap-2 ${
                        item.important
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {/* 🟡 如果 important，前面加星星 icon */}
                      {item.important ? (
                        <Star className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      ) : (
                        <span
                          className={`w-2 h-2 mt-2 rounded-full ${section.dotColor} flex-shrink-0`}
                        />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
        )}

        {/* ➡️ 建議方向 */}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">建議方向</h4>
          <p className="text-sm text-foreground">{summary.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
