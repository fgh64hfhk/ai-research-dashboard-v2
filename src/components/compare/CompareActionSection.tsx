"use client";

import { ActionCard } from "@/components/common/ActionCard";
import {
  RefreshCcw,
  PlusCircle,
  PlayCircle,
  GitCompare,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompareActionSectionProps {
  baseVersionId: string;
  targetVersionId: string;
  recommendedTargetVersion?: string;
  versionOptions: string[];
  isLocked?: boolean;
  onBaseChange?: (value: string) => void;
  onTargetChange?: (value: string) => void;
  onCreateNewVersion?: () => void;
  onReschedule?: () => void;
  onInferenceTest?: () => void;
}

export default function CompareActionSection({
  baseVersionId,
  targetVersionId,
  recommendedTargetVersion,
  versionOptions,
  isLocked = false,
  onTargetChange,
  onCreateNewVersion,
  onReschedule,
  onInferenceTest,
}: CompareActionSectionProps) {
  // 目標版本選項，過濾掉基礎版本本身與比基礎版本更新的版本
  const targetOptions = versionOptions.filter((v) => v !== baseVersionId);

  return (
    <div className="space-y-8">
      {/* 🧭 選擇版本區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🎯 目標版本（可選） */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-muted-foreground" />
            <h4 className="text-base font-medium">目標版本（選擇比較對象）</h4>
          </div>
          <Select
            disabled={isLocked}
            value={targetVersionId}
            onValueChange={(value) => onTargetChange?.(value)}
          >
            <SelectTrigger className="px-2 py-5 font-medium">
              <SelectValue placeholder="選擇版本" />
            </SelectTrigger>
            <SelectContent>
              {targetOptions.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            建議優先比較最新版本與上一版本，評估優化成效。
          </p>
        </div>
        {/* 🔒 基礎版本（固定最新） */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h4 className="text-base font-medium">基礎版本（固定最新）</h4>
          </div>
          <div className="h-10 flex items-center">
            <Badge
              variant="outline"
              className="h-10 px-4 text-sm flex items-center"
            >
              {baseVersionId}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            基礎版本鎖定為最新版本，以確認優化成果。
          </p>
        </div>
      </div>

      {/* 🧭 建議提示區塊 */}
      <div className="border rounded-lg p-4 bg-muted space-y-2">
        <h4 className="text-base font-medium flex items-center gap-2">
          <GitCompare className="w-5 h-5" /> 系統推薦比較
        </h4>
        <p className="text-sm">
          建議比較 <b>{recommendedTargetVersion}</b> 與 <b>{baseVersionId}</b>
          ，確認優化是否有效。
        </p>
      </div>

      {/* 🧭 操作功能按鈕 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ActionCard
                  icon={<PlusCircle className="w-5 h-5" />}
                  label="建立新版本"
                  onClick={onCreateNewVersion}
                  variant="success"
                  disabled={isLocked}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              建議根據訓練結果持續優化，建立新版本以改善模型表現。
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ActionCard
          icon={<RefreshCcw className="w-5 h-5" />}
          label="重新排程（預留）"
          onClick={onReschedule}
          variant="default"
          disabled
        />
        <ActionCard
          icon={<PlayCircle className="w-5 h-5" />}
          label="推論測試（預留）"
          onClick={onInferenceTest}
          variant="default"
          disabled
        />
      </div>
    </div>
  );
}
