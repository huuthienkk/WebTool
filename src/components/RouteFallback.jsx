import { Skeleton } from "./ui/skeleton";

export function RouteFallback() {
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 pt-12" aria-busy="true" aria-live="polite">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="h-80 w-full" />
        ))}
      </div>
    </section>
  );
}
