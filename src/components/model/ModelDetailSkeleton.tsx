import { Skeleton } from "@/components/ui/skeleton";

export const ModelDetailSkeleton = () => {
  return (
    <div className="container max-w-3xl py-8 px-4 md:px-8 space-y-6">
      {/* Intro skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Model header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Action panel skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      {/* Version list skeleton */}
      <div className="space-y-4 pt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
};
