import { ArrowLeft } from 'lucide-react';

export default function PostDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center max-w-4xl">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </div>
        </div>
      </div>

      {/* Loading Article */}
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        {/* Header Skeleton */}
        <header className="mb-10">
          {/* Title Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-10 bg-muted animate-pulse rounded-md w-3/4" />
            <div className="h-10 bg-muted animate-pulse rounded-md w-1/2" />
          </div>

          {/* Meta Info Skeleton */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border/50">
            {/* Author Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                <div className="h-3 bg-muted animate-pulse rounded w-32" />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-border/50" />

            {/* Date & Reading Time Skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-3 bg-muted animate-pulse rounded w-28" />
              <span>·</span>
              <div className="h-3 bg-muted animate-pulse rounded w-16" />
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Footer Skeleton */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="h-3 bg-muted animate-pulse rounded w-40" />
          <div className="h-9 bg-muted animate-pulse rounded w-28" />
        </footer>
      </article>
    </div>
  );
}
