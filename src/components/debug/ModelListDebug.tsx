// components/debug/ModelListDebug.tsx
"use client";

import { useModelList } from "@/hooks/model/model.hooks";
import Link from "next/link";

export function ModelListDebug() {
  const models = useModelList();

  if (models.length === 0) {
    return <p className="text-muted-foreground">尚無模型資料</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-min">
      {models.map((model) => (
        <Link
          key={model.modelId}
          href={`/debug/model/${model.modelId}`}
          className="p-4 border rounded-lg hover:shadow transition-all bg-white dark:bg-muted"
        >
          <h2 className="text-lg font-semibold mb-1">{model.name}</h2>
          <p className="text-sm text-muted-foreground">{model.description}</p>
        </Link>
      ))}
    </div>
  );
}
