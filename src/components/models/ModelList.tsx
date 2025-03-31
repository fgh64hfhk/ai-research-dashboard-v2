"use client";

import { useModelStore } from "@/contexts/ModelContext";
import { ModelCard } from "./ModelCard";
import { ModelListSkeleton } from "./ModelListSkeleton";

import { useEffect, useState } from "react";

export function ModelList() {
  const { models } = useModelStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <ModelListSkeleton />;
  }

  if (!models || models.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-10">
        尚未建立任何模型
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
      {models.map((model) => (
        <ModelCard key={model.modelId} model={model} />
      ))}
    </div>
  );
}
