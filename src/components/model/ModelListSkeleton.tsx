import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // 你可能使用的是 shadcn/ui 的 Skeleton

const ModelListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
};

export default ModelListSkeleton;
