// ✅ 新增元件：VersionListActionPanel.tsx
"use client";

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  isDescending: boolean;
  onToggleSort: () => void;
  availableTypes: string[];
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export function VersionListActionPanel({
  isDescending,
  onToggleSort,
  availableTypes,
  selectedType,
  onTypeChange,
}: Props) {
  return (
    <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
      {/* 修改摘要篩選 */}
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-40 h-8 text-sm">
          <SelectValue placeholder="篩選修改摘要" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">全部</SelectItem>
          {availableTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onToggleSort}>
              {isDescending ? (
                <ArrowDownWideNarrow className="h-4 w-4" />
              ) : (
                <ArrowUpWideNarrow className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDescending ? "改為升序" : "改為降序"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
