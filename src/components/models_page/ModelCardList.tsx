"use client";

import { Model } from "@/types/model";
import { ModelCard } from "./ModelCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Layers } from "lucide-react";

interface ModelCardListProps {
  models: Model[];
  versionMap?: Record<string, string[]>; // modelId -> versions[]
}

export function ModelCardList({ models, versionMap }: ModelCardListProps) {
  if (!models || models.length === 0) {
    return (
      <EmptyState
        icon={<Layers className="w-10 h-10" />}
        title="尚無模型"
        description="目前沒有任何模型資料，請點擊右上角的按鈕新增。"
      />
    );
  }

  return (
    <div id="models" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => {
        const versions = versionMap?.[model.modelId] ?? [];
        return (
          <ModelCard
            key={model.modelId}
            model={model}
            latestVersion={versions.at(-1)}
            versionCount={versions.length}
          />
        );
      })}
    </div>
  );
}
