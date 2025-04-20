"use client";

import { PlusCircle, Search, Clock, GitCompare } from "lucide-react";
import { ActionCard } from "@/components/common/ActionCard";

interface ModelsActionPanelProps {
  onOpenCreateDialog?: () => void;
}

export default function ModelsActionPanel({
  onOpenCreateDialog,
}: ModelsActionPanelProps) {

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActionCard icon={<PlusCircle className="w-5 h-5" />} label={"建立新模型"} onClick={onOpenCreateDialog}/>
        <ActionCard icon={<Search className="w-5 h-5" />} label={"探索所有模型"} disabled={true}/>
        <ActionCard icon={<Clock className="w-5 h-5" />} label={"查看最近更新"} disabled={true}/>
        <ActionCard icon={<GitCompare className="w-5 h-5" />} label={"比較模型版本"} disabled={true}/>
      </div>
    </div>
  );
}
