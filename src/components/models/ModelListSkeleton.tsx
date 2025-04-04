import { Skeleton } from "@/components/ui/skeleton";

export function ModelListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4 p-4 border rounded-lg animate-pulse">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      ))}
    </div>
  );
}
