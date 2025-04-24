import { Skeleton } from "@/components/ui/skeleton";

const ComparePageSkeleton = () => {
  return (
    <div className="container max-w-5xl py-8 px-4 md:px-8 space-y-6">
      {/* 引導卡片 Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* 版本選擇器 Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* 參數差異卡 Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>

      {/* 訓練結果圖表 Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-64 rounded-md" />
      </div>

      {/* 版本建議卡 Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-20 rounded-xl" />
      </div>

      {/* 備註編輯器 Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-24 rounded-md" />
      </div>
    </div>
  );
};

export default ComparePageSkeleton;
