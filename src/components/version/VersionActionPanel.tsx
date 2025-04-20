"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ListChecks,
  SlidersHorizontal,
  GitCompare,
  PlusCircle,
} from "lucide-react";
import { ActionCard } from "@/components/common/ActionCard";
import { scrollToAnchor } from "@/lib/utils/common.helper";

interface VersionActionPanelProps {
  isParamMissing: boolean;
  isScheduleMissing: boolean;
  onSetParams?: () => void;
  onSetSchedule?: () => void;
  onCompare?: () => void;
}

export default function VersionActionPanel({
  isParamMissing,
  isScheduleMissing,
  onSetParams,
  onSetSchedule,
}: VersionActionPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 查看/設定參數表 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionCard
                icon={<SlidersHorizontal className="w-5 h-5" />}
                label={isParamMissing ? "設定參數" : "查看參數表"}
                onClick={
                  isParamMissing
                    ? onSetParams
                    : () => scrollToAnchor("param_view")
                }
                variant={isParamMissing ? "warning" : "default"}
              />
            </div>
          </TooltipTrigger>
          {isParamMissing && (
            <TooltipContent>
              <p className="text-sm font-medium">尚未設定參數</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* 查看/設定訓練排程 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ActionCard
                icon={<ListChecks className="w-5 h-5" />}
                label={isScheduleMissing ? "設定排程" : "查看排程表"}
                onClick={
                  isScheduleMissing
                    ? onSetSchedule
                    : () => scrollToAnchor("schedule_view")
                }
                variant={isScheduleMissing ? "error" : "default"}
              />
            </div>
          </TooltipTrigger>
          {isScheduleMissing && (
            <TooltipContent>
              <p className="text-sm font-medium">尚未排程</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* 版本比較 */}
      <ActionCard
        icon={<GitCompare className="w-5 h-5" />}
        label="版本比較"
        onClick={() => {}}
      />

      {/* 查看訓練進度 */}
      <ActionCard
        icon={<PlusCircle className="w-5 h-5" />}
        label="查看訓練進度"
        onClick={() => {}}
      />
    </div>
  );
}
