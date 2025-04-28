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

interface ModelActionPanelProps {
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
        disabled={!onVersionComparePage}
      />
      <ActionCard
        icon={<PlusCircle className="w-5 h-5" />}
        label="建立新版本"
        onClick={onOpenCreateVersionDialog}
      />
      <ActionCard
        icon={<ArrowLeft className="w-5 h-5" />}
        label="返回模型列表"
        onClick={onBackToModelList}
        disabled={!onBackToModelList}
      />
    </div>
  );
}
