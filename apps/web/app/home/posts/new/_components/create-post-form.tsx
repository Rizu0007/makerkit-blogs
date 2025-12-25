'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@kit/ui/button';
import { Card, CardContent, CardFooter } from '@kit/ui/card';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Textarea } from '@kit/ui/textarea';
import { CREATE_POST } from '~/lib/graphql/mutations';
import { GET_POSTS } from '~/lib/graphql/queries';
import type { CreatePostData, GetPostsData } from '~/lib/types/blog';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { createPostSchema, type CreatePostFormData } from '../_lib/validation';

interface CreatePostFormProps {
  userId: string;
  userEmail?: string | null;
}

export function CreatePostForm({ userId, userEmail }: CreatePostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  const [createPost] = useMutation<CreatePostData>(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: 5 } }],
    optimisticResponse: (vars) => ({
      insertIntopostsCollection: {
        records: [
          {
            id: `temp-${Date.now()}`,
            title: vars.title,
            body: vars.body,
            author_id: vars.author_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            accounts: {
              id: vars.author_id,
              name: userEmail?.split('@')[0] || 'You',
              email: userEmail || '',
              picture_url: null,
              __typename: 'accounts',
            },
            __typename: 'posts',
          },
        ],
        __typename: 'postsInsertResponse',
      },
    }),
    update: (cache, { data: mutationData }) => {
      if (!mutationData?.insertIntopostsCollection?.records[0]) return;

      const newPost = mutationData.insertIntopostsCollection.records[0];

      try {
        const existingData = cache.readQuery<GetPostsData>({
          query: GET_POSTS,
          variables: { first: 5 },
        });

        if (existingData?.postsCollection) {
          cache.writeQuery<GetPostsData>({
            query: GET_POSTS,
            variables: { first: 5 },
            data: {
              postsCollection: {
                ...existingData.postsCollection,
                edges: [
                  {
                    cursor: newPost.id,
                    node: newPost,
                  },
                  ...existingData.postsCollection.edges,
                ],
              },
            },
          });
        }
      } catch (error) {
        console.log('Cache update skipped:', error);
      }
    },
    onCompleted: (data) => {
      const postId = data.insertIntopostsCollection?.records[0]?.id;
      toast.success('Post created successfully!');

      if (postId) {
        router.push(`/posts/${postId}`);
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CreatePostFormData) => {
    setIsSubmitting(true);

    try {
      await createPost({
        variables: {
          title: data.title,
          body: data.body,
          author_id: userId,
        },
      });
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-border/60 shadow-lg shadow-black/5">
        <CardContent className="p-4 md:p-4 space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Give your post a compelling title..."
              className="h-10"
              {...register('title')}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Body Field */}
          <div className="space-y-2">
            <Label htmlFor="body" className="text-sm font-medium">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              placeholder="Write your story here..."
              className="min-h-[220px] resize-y"
              {...register('body')}
              disabled={isSubmitting}
            />
            {errors.body && (
              <p className="text-sm text-destructive">
                {errors.body.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 md:p-6 pt-0 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Publishing...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Post
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
