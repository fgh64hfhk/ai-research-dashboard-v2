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
  const { prefillParams } = prefillData;

  return (
    <Card className="p-6 border-2 border-dashed border-primary bg-primary/5 space-y-6">
      <CardContent className="space-y-6">
        {/* 標題 */}
        <div className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">推薦設定導引</h2>
        </div>

        {/* 推薦參數預覽 */}
        {prefillParams && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {Object.entries(prefillParams)
                .filter(([key]) => key !== "modelVersionId")
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-medium">{key}</span>
                    <span className="text-base font-semibold">
                      {String(value)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 一鍵套用 */}
        {prefillParams && (
          <Button
            variant="default"
            className="w-full mt-2"
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
