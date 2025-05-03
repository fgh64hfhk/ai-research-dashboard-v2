"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, SlidersHorizontal } from "lucide-react";
import { VersionPrefillData } from "@/lib/utils/versionPrefill.helper";
import { ModelParameters } from "@/types/parameters";

interface YourPrefillGuideCardProps {
  prefillData: VersionPrefillData;
  onApplyPrefill: (params: ModelParameters) => void;
}

export default function YourPrefillGuideCard({
  prefillData,
  onApplyPrefill,
}: YourPrefillGuideCardProps) {
  const { prefillParams, insightSummary } = prefillData;

  return (
    <Card className="p-6 border-2 border-dashed border-primary bg-primary/5 space-y-6">
      <CardContent className="space-y-6">
        {/* 標題 */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">推薦設定導引</h2>
        </div>

        {/* 訓練指標摘要 */}
        {insightSummary && (
          <div className="space-y-2">
            <h4 className="text-base font-semibold">訓練成果摘要</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {insightSummary.insights.map((item, idx) => (
                <li
                  key={idx}
                  className={item.important ? "text-primary font-semibold" : ""}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 推薦參數預覽 */}
        {prefillParams && (
          <div className="space-y-2">
            <h4 className="text-base font-semibold">推薦參數表</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {Object.entries(prefillParams).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 一鍵套用 */}
        {prefillParams && (
          <Button
            variant="default"
            className="w-full"
            onClick={() => onApplyPrefill(prefillParams)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            套用推薦參數
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
