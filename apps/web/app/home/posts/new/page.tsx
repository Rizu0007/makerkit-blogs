'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';
import { useUser } from '@kit/supabase/hooks/use-user';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CreatePostForm } from './_components/create-post-form';

export default function CreatePostPage() {
  const router = useRouter();
  const { data: userClaims, isLoading: isLoadingUser } = useUser();

  const userId = userClaims?.sub;

  // Show loading state while checking authentication
  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">Please log in to create a post</p>
            <Button onClick={() => router.push('/auth/sign-in')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>Draft</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-8 max-w-5xl">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Share Your Story</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Create New Post
            </h1>
            <p className="text-base text-muted-foreground">
              Share your thoughts, ideas, and stories with the community.
            </p>
          </div>

          {/* Form Component */}
          <CreatePostForm userId={userId} userEmail={userClaims?.email} />

        </div>
      </div>
    </div>
  );
}
