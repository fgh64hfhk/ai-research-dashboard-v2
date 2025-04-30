"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ActionCard } from "@/components/common/ActionCard";
import {
  ArrowLeft,
  GitCompare,
  ListChecks,
  PlusCircle,
  SlidersHorizontal,
} from "lucide-react";
import { ModelStage } from "@/lib/utils/model.helper";

interface ModelActionPanelProps {
  modelStage: ModelStage;
  isLatestVersion: boolean;
  isVersionList: boolean;
  isParameterIncomplete: boolean;
  isScheduleIncomplete: boolean;
  onLatestVersionPage?: () => void;
  onVersionList?: () => void;
  onVersionComparePage?: () => void;
  onOpenCreateVersionDialog?: () => void;
  onBackToModelList?: () => void;
}

export function ModelActionPanel({
  modelStage,
  isLatestVersion,
  isVersionList,
  isParameterIncomplete,
  isScheduleIncomplete,
  onLatestVersionPage,
  onVersionList,
  onVersionComparePage,
  onOpenCreateVersionDialog,
  onBackToModelList,
}: ModelActionPanelProps) {
  const disabled = modelStage !== "noVersion";
  const tooltipMap: Record<typeof modelStage, string> = {
    noVersion: "請建立模型的第一個版本，以啟動訓練流程",
    hasVersion: "請先設定參數並排程訓練，避免版本混亂",
    scheduled: "已完成設定，請啟動訓練或等待結果",
    trained: "請前往版本比較頁進行參數調整，不建議直接創建新版本",
  };

  const isLatestVersionReady = !isParameterIncomplete && !isScheduleIncomplete;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionCard
                icon={<SlidersHorizontal className="w-5 h-5" />}
                label="查看最新版本"
                onClick={onLatestVersionPage}
                disabled={!isLatestVersion}
                variant={
                  isLatestVersion && !isLatestVersionReady
                    ? "warning"
                    : "default"
                }
              />
            </div>
          </TooltipTrigger>
          {!isLatestVersionReady && (
            <TooltipContent className="text-center p-2 text-sm font-medium">
              {isParameterIncomplete &&
                isScheduleIncomplete &&
                "最新版本尚未完成參數與排程設定"}
              {isParameterIncomplete &&
                !isScheduleIncomplete &&
                "最新版本尚未完成參數設定"}
              {!isParameterIncomplete &&
                isScheduleIncomplete &&
                "最新版本尚未完成排程設定"}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <ActionCard
        icon={<ListChecks className="w-5 h-5" />}
        label="展開版本列表"
        onClick={onVersionList}
        disabled={isVersionList}
      />
      <ActionCard
        icon={<GitCompare className="w-5 h-5" />}
        label="比較版本"
        onClick={onVersionComparePage}
        variant={modelStage === "trained" ? "success" : "default"}
        disabled={modelStage !== "trained"}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ActionCard
              icon={<PlusCircle className="w-5 h-5" />}
              label="建立新版本"
              onClick={!disabled ? onOpenCreateVersionDialog : undefined}
              variant={modelStage === "noVersion" ? "warning" : "default"}
              disabled={disabled}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          {tooltipMap[modelStage]}
        </TooltipContent>
      </Tooltip>
      <ActionCard
        icon={<ArrowLeft className="w-5 h-5" />}
        label="返回模型列表"
        onClick={onBackToModelList}
        disabled={!onBackToModelList}
      />
    </div>
  );
}
