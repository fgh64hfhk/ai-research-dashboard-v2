// components/models/NeedsSetupHint.tsx

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface NeedsSetupHintProps {
  message?: string;
  iconClassName?: string;
}

export function NeedsSetupHint({
  message = "尚未設定參數或排程，建議完成設定。",
  iconClassName = "w-4 h-4 text-yellow-500 animate-pulse",
}: NeedsSetupHintProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={iconClassName} />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="max-w-[200px] text-sm text-yellow-700">{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
