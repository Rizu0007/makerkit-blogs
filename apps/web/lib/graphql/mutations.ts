import { gql } from '@apollo/client';
import { POST_FRAGMENT } from './queries';

// Mutation to create a new post
export const CREATE_POST = gql`
  ${POST_FRAGMENT}
  mutation CreatePost($title: String!, $body: String!, $author_id: UUID!) {
    insertIntopostsCollection(objects: [{ title: $title, body: $body, author_id: $author_id }]) {
      records {
        ...PostFragment
      }
    }
  }
`;
