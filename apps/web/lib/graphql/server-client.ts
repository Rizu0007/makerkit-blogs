/**
 * Server-side GraphQL client for Supabase
 * Used for Server Components and ISR with revalidation
 */

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL!;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, unknown>;
  }>;
}



/**
 * Execute a GraphQL query on the server with optional revalidation
 * @param query - GraphQL query string
 * @param variables - Query variables
 * @param revalidate - Revalidation time in seconds (for ISR)
 */
export async function executeGraphQLQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate?: number | false
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),

    // ISR configuration: revalidate after specified time
    next: {
      revalidate: revalidate ?? 600, // : revalidate every 10 minutes
    },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    const errorMessage = result.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL errors: ${errorMessage}`);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data;
}
