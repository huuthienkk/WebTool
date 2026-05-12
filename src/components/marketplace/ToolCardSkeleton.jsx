import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ToolCardSkeleton() {
  return (
    <Card className="h-full">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}
