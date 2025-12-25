import { PostList } from '~/components/blog/post-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Read Latest Articles',
  description: 'Read the latest articles and insights from our community. Discover new ideas, tips, and stories shared by our members.',
  openGraph: {
    title: 'Blog | Read Latest Articles',
    description: 'Read the latest articles and insights from our community',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative border-b border-border overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs with animation */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl relative">
          <div className="text-center max-w-2xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-3 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary absolute" />
              <span className="text-xs font-medium text-primary ml-2">Welcome to Blogify</span>
            </div>

            {/* Heading with gradient */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 animate-fade-in-up">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Discover Stories
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent">
                Worth Reading
              </span>
            </h1>

            {/* Description with animation */}
            <p className="text-sm md:text-base text-muted-foreground animate-fade-in-up animation-delay-200 max-w-xl mx-auto">
              Read insightful articles from writers around the world and join our community of storytellers
            </p>

            {/* Decorative element */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <PostList />
      </div>
    </div>
  );
}

export const revalidate = 30;
