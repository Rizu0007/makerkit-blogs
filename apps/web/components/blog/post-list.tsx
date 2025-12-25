'use client';

import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Card } from '@kit/ui/card';
import { Clock, User, PenSquare } from 'lucide-react';
import { GET_POSTS } from '~/lib/graphql/queries';
import type { GetPostsData, Post } from '~/lib/types/blog';
import { formatDate, getExcerpt, estimateReadingTime } from '~/lib/utils/blog';

const POSTS_PER_PAGE = 5;

export function PostList() {
  const { data, loading, error, fetchMore } = useQuery<GetPostsData>(GET_POSTS, {
    variables: { first: POSTS_PER_PAGE },
  });

  if (loading) {
    return (
      <div className="space-y-10">
        {[1, 2, 3].map((i) => (
          <article key={i} className="group">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded-md w-3/4"></div>
                <div className="h-4 bg-muted animate-pulse rounded-md w-1/3"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 bg-muted animate-pulse rounded-md w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="mt-8 border-b border-border/50"></div>
          </article>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center space-y-4 border-destructive/20">
        <div className="text-destructive font-semibold text-lg">Unable to load posts</div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {error.message || 'Something went wrong. Please try again.'}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Reload Page
        </Button>
      </Card>
    );
  }

  const posts = data?.postsCollection?.edges || [];
  const pageInfo = data?.postsCollection?.pageInfo;

  const loadMore = () => {
    if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
      fetchMore({
        variables: {
          first: POSTS_PER_PAGE,
          after: pageInfo.endCursor,
        },
      });
    }
  };

  return (
    <div className="space-y-6" role="feed" aria-label="Blog posts">
      {posts.length === 0 ? (
        <Card className="p-16 text-center border-dashed">
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Be the first to share your story with the community.
              </p>
              <Link href="/home/posts/new">
                <Button size="lg">Create Your First Post</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Write a Post Button */}
          <div className="flex justify-end mb-6">
            <Link href="/home/posts/new">
              <Button size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all">
                <PenSquare className="w-5 h-5" />
                Write a Post
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(({ node: post }: { node: Post }, index) => (
              <article
                key={post.id}
                className={`group relative ${index === 4 && posts.length === 5 ? 'md:col-span-2 md:max-w-2xl md:mx-auto' : ''}`}
                role="article"
              >
                <Link href={`/posts/${post.id}`} className="block h-full">
                  <div className="relative h-full rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative p-5">
                      {/* Author & Meta */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-foreground">{post.accounts.name}</div>
                            <time dateTime={post.created_at} className="text-[11px] text-muted-foreground">
                              {formatDate(post.created_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </time>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">{estimateReadingTime(post.body)} min</span>
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="space-y-2">
                        <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 leading-tight line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {getExcerpt(post.body, 150)}
                        </p>
                      </div>

                      {/* Read More CTA */}
                      <div className="mt-4 flex items-center text-xs font-medium text-primary">
                        <span>Read article</span>
                        <span className="inline-block transition-transform group-hover:translate-x-1.5 duration-200 ml-1.5">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {pageInfo?.hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={loadMore}
                variant="outline"
                size="default"
                className="min-w-[180px]"
              >
                Load More Articles
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
