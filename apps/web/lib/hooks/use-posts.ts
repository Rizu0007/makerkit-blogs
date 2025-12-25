import { useQuery, useMutation } from '@apollo/client/react';
import { GET_POSTS, GET_POST_BY_ID } from '~/lib/graphql/queries';
import { CREATE_POST } from '~/lib/graphql/mutations';
import type {
  GetPostsData,
  GetPostByIdData,
  CreatePostData,
} from '~/lib/types/blog';

const POSTS_PER_PAGE = 5;

/**
 * Hook to fetch paginated posts
 */
export function usePosts() {
  return useQuery<GetPostsData>(GET_POSTS, {
    variables: { first: POSTS_PER_PAGE },
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to fetch a single post by ID
 */
export function usePost(id: string) {
  return useQuery<GetPostByIdData>(GET_POST_BY_ID, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
  return useMutation<CreatePostData>(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { first: POSTS_PER_PAGE } }],
  });
}
