import { Skeleton } from "@/components/ui/skeleton";

export function ModelVersionPreviewSkeleton() {
  return (
    <div className="text-xs space-y-1">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
