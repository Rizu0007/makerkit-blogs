import { gql } from '@apollo/client';

// Fragment for Post fields
export const POST_FRAGMENT = gql`
  fragment PostFragment on posts {
    id
    title
    body
    created_at
    updated_at
    author_id
    accounts {
      id
      name
      email
      picture_url
    }
  }
`;

// Query to get paginated posts (5 per page)
export const GET_POSTS = gql`
  ${POST_FRAGMENT}
  query GetPosts($first: Int!, $after: Cursor) {
    postsCollection(first: $first, after: $after, orderBy: { created_at: DescNullsLast }) {
      edges {
        cursor
        node {
          ...PostFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Query to get a single post by ID
export const GET_POST_BY_ID = gql`
  ${POST_FRAGMENT}
  query GetPostById($id: UUID!) {
    postsCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          ...PostFragment
        }
      }
    }
  }
`;

// Query to get all post IDs (for static generation )
export const GET_POST_IDS = gql`
  query GetPostIds {
    postsCollection {
      edges {
        node {
          id
        }
      }
    }
  }
`;
