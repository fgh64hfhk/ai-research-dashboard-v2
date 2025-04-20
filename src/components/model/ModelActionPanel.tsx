"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ActionCard } from "@/components/common/ActionCard";
import {
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
  onCompare?: () => void;
  onOpenCreateVersionDialog?: () => void;
}

export function ModelActionPanel({
  isLatestVersion,
  isVersionList,
  isParameterIncomplete,
  isScheduleIncomplete,
  onLatestVersionPage,
  onVersionList,
  onOpenCreateVersionDialog,
}: ModelActionPanelProps) {
  const isLatestVersionReady = !isParameterIncomplete && !isScheduleIncomplete;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionCard
                icon={<SlidersHorizontal className="w-5 h-5" />}
                label="查看最新版本"
                onClick={onLatestVersionPage}
                disabled={!isLatestVersion}
                variant={!isLatestVersionReady ? "warning" : "default"}
              />
            </div>
          </TooltipTrigger>
          {!isLatestVersionReady && (
            <TooltipContent>
              {isParameterIncomplete && isScheduleIncomplete && (
                <p className="text-sm font-medium">
                  最新版本尚未完成參數與排程設定
                </p>
              )}
              {isParameterIncomplete && !isScheduleIncomplete && (
                <p className="text-sm font-medium">最新版本尚未完成參數設定</p>
              )}
              {!isParameterIncomplete && isScheduleIncomplete && (
                <p className="text-sm font-medium">最新版本尚未完成排程設定</p>
              )}
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
        disabled={true}
      />
      <ActionCard
        icon={<PlusCircle className="w-5 h-5" />}
        label="建立新版本"
        onClick={onOpenCreateVersionDialog}
      />
    </div>
  );
}
