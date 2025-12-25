'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from '@apollo/client';
import { getSupabaseBrowserClient } from '@kit/supabase/browser-client';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseGraphQLUrl = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL;

if (!supabaseUrl || !supabaseAnonKey || !supabaseGraphQLUrl) {
  throw new Error(
    'Missing required environment variables. Please check NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_SUPABASE_GRAPHQL_URL'
  );
}

// HTTP Link for GraphQL endpoint
const httpLink = new HttpLink({
  uri: supabaseGraphQLUrl,
});

// Auth Link to add authorization header with proper token handling
const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    (async () => {
      try {
        // Create a fresh Supabase client to get the current session
        const supabase = getSupabaseBrowserClient();

        // Get the current session from the browser
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session for GraphQL:', error);
        }

        const token = session?.access_token;

        // Log for debugging (remove in production)
        if (!token) {
          console.warn('No access token found for GraphQL request');
        }

        // Set headers on the operation context
        operation.setContext({
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            apikey: supabaseAnonKey,
            'X-Client-Info': 'supabase-js-web',
          },
        });

        // Continue the request chain
        const subscriber = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });

        return () => subscriber.unsubscribe();
      } catch (err) {
        console.error('Error in auth link:', err);
        observer.error(err);
      }
    })();
  });
});



// Error Link for comprehensive error handling
const errorLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const subscriber = forward(operation).subscribe({
      next: (result) => {
        if (result.errors) {
          result.errors.forEach((error) => {
            console.error(
              `[GraphQL error]: Message: ${error.message}, Location: ${JSON.stringify(error.locations)}, Path: ${error.path}`,
              {
                operation: operation.operationName,
                extensions: error.extensions,
              }
            );
          });
        }
        observer.next(result);
      },
      error: (networkError: Error) => {
        console.error(`[Network error]: ${networkError.message}`, {
          operation: operation.operationName,
          networkError,
        });
        observer.error(networkError);
      },
      complete: observer.complete.bind(observer),
    });

    return () => subscriber.unsubscribe();
  });
});



// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          postsCollection: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!existing || !args?.after) {
                return incoming;
              }

              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
