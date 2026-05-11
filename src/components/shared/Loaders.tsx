// Skeleton shimmer for data loading states
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg bg-muted animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

// Card skeleton — used for stat/member/subscription cards
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonBlock className="h-8 w-20" />
      <SkeletonBlock className="h-3 w-16" />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b border-border/40"
      aria-hidden="true"
    >
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-4 flex-1 ${i === 0 ? "max-w-[40px] rounded-full" : ""}`}
        />
      ))}
    </div>
  );
}

// Full page loader — replaces content during initial load
export function PageLoader() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <>
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
      aria-label="Loading"
      role="status"
    >
      <div className="relative w-10 h-10">
        <span className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <span className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
    </div>
  );
}

// Inline spinner — for buttons, small areas
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
      aria-hidden="true"
    />
  );
}

// Data card skeleton grid (3-col)
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border/60 bg-muted/40">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={cols} />
      ))}
    </div>
  );
}
