import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Button } from '@kit/ui/button';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { executeGraphQLQuery } from '~/lib/graphql/server-client';
import type { GetPostByIdData, GetPostIdsData, Post } from '~/lib/types/blog';
import { estimateReadingTime, formatDate, getExcerpt } from '~/lib/utils/blog';
import { GET_POST_BY_ID, GET_POST_IDS } from '~/lib/graphql/queries';

// Convert gql queries to strings for server-side execution
const GET_POST_BY_ID_QUERY = GET_POST_BY_ID.loc?.source.body || '';
const GET_POST_IDS_QUERY = GET_POST_IDS.loc?.source.body || '';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const data = await executeGraphQLQuery<GetPostIdsData>(
      GET_POST_IDS_QUERY,
      {},
      3600
    );

    return (
      data.postsCollection?.edges.map((edge) => ({
        id: edge.node.id,
      })) || []
    );
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const data = await executeGraphQLQuery<GetPostByIdData>(
      GET_POST_BY_ID_QUERY,
      { id },
      60
    );

    const post = data.postsCollection?.edges[0]?.node;

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const excerpt = getExcerpt(post.body, 160);

    return {
      title: `${post.title} | Blogify`,
      description: excerpt,
      openGraph: {
        title: post.title,
        description: excerpt,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.accounts.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: excerpt,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Blogify',
    };
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  let post: Post | undefined;

  try {
    const data = await executeGraphQLQuery<GetPostByIdData>(
      GET_POST_BY_ID_QUERY,
      { id },
      60
    );

    post = data.postsCollection?.edges[0]?.node;
  } catch (error) {
    console.error('Error fetching post:', error);
  }

  if (!post) {
    notFound();
  }

  const readingTime = estimateReadingTime(post.body);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl animate-fade-in-up">
        {/* Header Section */}
        <header className="mb-10">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Meta Info Card */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/40 border border-border/50 hover:border-border transition-colors">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">{post.accounts.name}</div>
                <div className="text-xs text-muted-foreground">{post.accounts.email}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-border/50" />

            {/* Date & Reading Time */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mb-12">
          <div className="prose prose-base md:prose-lg max-w-none dark:prose-invert">
            <div className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {post.body}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            {post.updated_at !== post.created_at && (
              <p className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Last updated on {formatDate(post.updated_at)}
              </p>
            )}
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-muted transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              All Posts
            </Button>
          </Link>
        </footer>
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            author: {
              '@type': 'Person',
              name: post.accounts.name,
            },
            datePublished: post.created_at,
            dateModified: post.updated_at,
            description: getExcerpt(post.body, 160),
          }),
        }}
      />
    </div>
  );
}

export const revalidate = 60;
