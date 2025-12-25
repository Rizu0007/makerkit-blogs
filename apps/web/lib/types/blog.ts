// Types for blog posts and related entities

export interface Account {
  id: string;
  name: string;
  email: string | null;
  picture_url: string | null;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  accounts: Account;
}

export interface PostEdge {
  cursor: string;
  node: Post;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface PostsConnection {
  edges: PostEdge[];
  pageInfo: PageInfo;
}

// GraphQL Query/Mutation Response Types
export interface GetPostsData {
  postsCollection: PostsConnection;
}

export interface GetPostByIdData {
  postsCollection: {
    edges: PostEdge[];
  };
}

export interface GetPostIdsData {
  postsCollection: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
}

export interface CreatePostData {
  insertIntopostsCollection: {
    records: Post[];
  };
}

// Input types for mutations
export interface CreatePostInput {
  title: string;
  body: string;
  author_id: string;
}
