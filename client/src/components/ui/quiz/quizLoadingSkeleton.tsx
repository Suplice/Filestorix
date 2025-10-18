"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function QuizLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-2 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-40 w-full" />
      <div className="flex justify-end">
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
}
