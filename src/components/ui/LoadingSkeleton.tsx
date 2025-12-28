/**
 * LoadingSkeleton Component
 * =========================
 * Reusable skeleton loading states for various UI elements.
 * Uses the 3-color design system (soft gray for skeletons).
 */

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Base skeleton element
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse-subtle rounded-md bg-secondary', className)}
      aria-hidden="true"
    />
  );
}

// Text line skeleton
export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4 w-full', className)} />;
}

// Heading skeleton
export function SkeletonHeading({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-8 w-3/4', className)} />;
}

// Button skeleton
export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-24 rounded-md', className)} />;
}

// Card skeleton
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      <SkeletonHeading className="mb-4" />
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
      </div>
    </div>
  );
}

// Table row skeleton
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Table skeleton
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-secondary">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Avatar skeleton
export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-10 rounded-full', className)} />;
}

// Input skeleton
export function SkeletonInput({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-10 w-full rounded-md', className)} />;
}

// Chart skeleton
export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      <div className="flex items-end justify-between gap-2 h-48">
        {[40, 65, 45, 80, 55, 70, 50].map((height, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-sm" 
            style={{ height: `${height}%` }} 
          />
        ))}
      </div>
    </div>
  );
}

// Full page loading skeleton
export function SkeletonPage() {
  return (
    <div className="container-wide py-8 animate-fade-in">
      <SkeletonHeading className="mb-8" />
      <div className="grid gap-6 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mt-8">
        <SkeletonTable />
      </div>
    </div>
  );
}

export default Skeleton;