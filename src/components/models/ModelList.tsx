"use client";

import { useModelList, useModelListLoading } from "@/hooks/model/model.hooks";

import { ModelCard } from "./ModelCard";
import { ModelListSkeleton } from "./ModelListSkeleton";
import { EmptyState } from "./EmptyState";

import { FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModelList() {
  const models = useModelList();
  const loading = useModelListLoading();

  if (loading) {
    return <ModelListSkeleton />;
  }

  if (!models || models.length === 0) {
    return (
      <EmptyState
        icon={<FileWarning className="w-10 h-10" />}
        title="尚未建立模型"
        description="系統中尚無任何模型，請點選按鈕新增。"
        action={<Button>新增模型</Button>} // 可選
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
      {models.map((model) => (
        <div key={model.modelId}>{JSON.stringify(model)}</div>
        // <ModelCard key={model.modelId} model={model} />
      ))}
    </div>
  );
}
