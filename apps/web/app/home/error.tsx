'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Home route error:', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg border-destructive/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
            <svg
              className="w-7 h-7 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Something Went Wrong
            </h2>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1 gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {error.digest && (
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
