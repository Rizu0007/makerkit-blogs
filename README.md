# Blog Application - Built with Next.js, Makerkit, and Supabase

A full-featured blog application built with Next.js 15, Makerkit (authentication template), and Supabase (backend + GraphQL API). Users can view blog posts, read individual entries, and create new posts after authentication.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Makerkit** - Open-source SaaS starter kit for auth ([GitHub](https://github.com/makerkit/nextjs-saas-starter-kit-lite))
- **Supabase** - Backend (PostgreSQL database, Auth, GraphQL API)
- **Apollo Client** - GraphQL client for data fetching
- **TypeScript** - Type safety throughout
- **Tailwind CSS** + **shadcn/ui** - Styling and components
- **Zod** + **React Hook Form** - Form validation

## Features

### Core Features
- **Homepage**: Paginated list of blog posts (5 per page) with title, excerpt (200 chars), author, and published date
- **Post Details Page**: Full blog post with title, body, author info, and timestamps
- **Create Post Page**: Form for authenticated users to submit new posts (title + body)
- **GraphQL Integration**: Apollo Client with queries and mutations
- **Row Level Security**: Supabase RLS policies for secure data access

### Authentication Features
- Email/Password authentication (Makerkit default)
- Google OAuth (via Supabase)
- **BONUS**: Email OTP (passwordless) login
- Profile dropdown with logout
- Session management with auto-refresh

### Bonus Features Implemented
- **ISR**: Incremental Static Regeneration for homepage and post pages
- **Form Validation**: Zod schema validation with React Hook Form
- **Optimistic UI**: Instant feedback when creating posts
- **Error Handling**: Comprehensive error states and user feedback
- Dark mode support
- Toast notifications
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Docker Desktop (for local Supabase)
- pnpm package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd makerkit-blog
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Copy the example file and create your local environment file:
```bash
cp .env.example .env.local
```

4. **Start Docker Desktop**

Make sure Docker Desktop is running on your machine.

5. **Start Supabase**
```bash
pnpm run supabase:web:start
```

This will:
- Start local Supabase services (PostgreSQL, Auth, Storage, etc.)
- Apply all database migrations automatically
- Create the `accounts` and `posts` tables with RLS policies
- Print your local Supabase credentials in the terminal

**Important**: Copy the credentials from the terminal output and paste them into your `.env.local` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Access Supabase Studio at http://localhost:54323

6. **Start the development server**
```bash
pnpm run dev
```

The application will be available at http://localhost:3000

### Environment Variables

The project includes:
- `.env.example` - Template file with all required variables
- `.env` and `.env.development` - Default configuration for the app
- `.env.local` - Your personal local environment (create from `.env.example`, never committed)

For production, create `.env.production` with your remote Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=https://your-project.supabase.co/graphql/v1
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Authentication Configuration

### Email/Password Authentication

Already configured via Makerkit. Users can sign up and sign in with email/password out of the box.

### Google OAuth Setup

**For Local Development:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Set Application type: Web application
4. Add Authorized redirect URI: `http://localhost:54321/auth/v1/callback`
5. Copy Client ID and Client Secret
6. Update `apps/web/supabase/.env`:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```
7. Restart Supabase:
   ```bash
   pnpm run supabase:web:stop
   pnpm run supabase:web:start
   ```

**For Production:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials
5. Add production redirect URL: `https://yourdomain.com/auth/callback`

### Email OTP (Passwordless) Setup

Already enabled in Makerkit configuration. Users can sign in using magic link/OTP:

1. Go to sign-in page
2. Click "Sign in with Magic Link"
3. Enter email
4. Check email for OTP code or magic link
5. Click link or enter code to authenticate

## Database Schema

### Accounts Table
```sql
create table public.accounts (
    id          uuid primary key,
    name        varchar(255) not null,
    email       varchar(320) unique,
    picture_url varchar(1000),
    created_at  timestamp with time zone,
    updated_at  timestamp with time zone
);
```

### Posts Table
```sql
create table public.posts (
    id         uuid primary key,
    title      text not null,
    body       text not null,
    author_id  uuid references public.accounts(id),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
```

### Row Level Security Policies

**Posts Table:**
- Anyone can read posts (public access)
- Only authenticated users can create posts
- Only the author can update/delete their own posts

**Accounts Table:**
- Users can read their own account information
- Users can update their own account only

## Usage

### Viewing Blog Posts

1. Navigate to http://localhost:3000 (homepage shows blog list)
2. Posts are displayed in a 2-column grid (5 posts per page)
3. Each post shows: title, excerpt (200 characters), author name, and publish date
4. Click "Load More" to load additional posts
5. Click any post to view full content

### Creating a Blog Post

1. Sign in or create an account
2. Click "Write a Post" button in the navigation or homepage
3. Fill in the form:
   - **Title**: Post title (required, 3-200 characters)
   - **Body**: Post content (required, minimum 10 characters)
4. Click "Publish Post"
5. You'll be redirected to the new post's detail page

### Reading a Blog Post

1. Click on any post from the homepage
2. View full post with:
   - Complete title and body
   - Author name and email
   - Published date
   - Last updated date (if modified)
   - Reading time estimate

## GraphQL API

### Queries

**Get Paginated Posts**
```graphql
query GetPosts($first: Int!, $after: Cursor) {
  postsCollection(
    first: $first
    after: $after
    orderBy: { created_at: DescNullsLast }
  ) {
    edges {
      cursor
      node {
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
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

**Get Post by ID**
```graphql
query GetPostById($id: UUID!) {
  postsCollection(filter: { id: { eq: $id } }) {
    edges {
      node {
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
    }
  }
}
```

### Mutations

**Create Post**
```graphql
mutation CreatePost(
  $title: String!
  $body: String!
  $author_id: UUID!
) {
  insertIntopostsCollection(
    objects: [{
      title: $title
      body: $body
      author_id: $author_id
    }]
  ) {
    records {
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
  }
}
```

## Project Structure

```
apps/web/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Blog list page (homepage)
│   ├── auth/
│   │   ├── sign-in/              # Sign in page
│   │   ├── sign-up/              # Sign up page
│   │   └── error.tsx             # Auth error boundary
│   ├── home/
│   │   ├── posts/new/            # Create post page (protected)
│   │   └── error.tsx             # Home error boundary
│   └── posts/
│       └── [id]/                 # Post detail page (public)
│           ├── page.tsx          # Post content
│           ├── loading.tsx       # Loading skeleton
│           └── not-found.tsx     # 404 page
├── components/
│   └── blog/
│       └── post-list.tsx         # Blog post list component
├── lib/
│   ├── apollo-client.ts          # Apollo Client setup
│   ├── graphql/
│   │   ├── queries.ts            # GraphQL queries
│   │   ├── mutations.ts          # GraphQL mutations
│   │   └── server-client.ts     # Server-side GraphQL client
│   ├── types/
│   │   └── blog.ts               # TypeScript types
│   └── utils/
│       └── blog.ts               # Helper functions
└── supabase/
    └── migrations/
        ├── 20241219010757_schema.sql         # Accounts table
        ├── 20251224114430_blog_schema.sql    # Posts table
        └── 20251224120000_fix_permissions.sql # RLS policies
```

## Deployment

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### 2. Push Migrations

```bash
# Link to your Supabase project
pnpm --filter web supabase link

# Push all migrations
pnpm --filter web supabase db push
```

### 3. Configure Environment Variables

Set these in your hosting platform (Vercel, etc.):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=https://your-project.supabase.co/graphql/v1
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Configure Callback URLs

In Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`

### 5. Deploy

```bash
# Build the project
pnpm run build

# Deploy to your platform
vercel --prod
```

## Development Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm run dev              # Start dev server

# Building
pnpm run build            # Build for production
pnpm run start            # Start production server

# Code Quality
pnpm run lint             # Run ESLint
pnpm run format:fix       # Format code with Prettier
pnpm run typecheck        # TypeScript type checking

# Supabase
pnpm run supabase:web:start    # Start local Supabase
pnpm run supabase:web:stop     # Stop local Supabase
pnpm run supabase:web:reset    # Reset database and reapply migrations
```

## Troubleshooting

### Docker not running
**Error**: `failed to inspect container health`

**Solution**: Start Docker Desktop and wait for it to fully initialize, then run `pnpm run supabase:web:start` again.

### GraphQL endpoint not responding
**Error**: Network error or 404 on GraphQL requests

**Solution**:
1. Ensure Supabase is running: `pnpm run supabase:web:start`
2. Verify `NEXT_PUBLIC_SUPABASE_GRAPHQL_URL` is correct
3. Check Supabase logs for errors

### Authentication errors
**Error**: Session not persisting or login failing

**Solution**:
1. Clear browser cookies and localStorage
2. Restart development server
3. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
4. Check Supabase auth settings

### Empty blog list
**Error**: No posts appearing

**Solution**:
1. Reset migrations: `pnpm run supabase:web:reset`
2. Check browser console for GraphQL errors
3. Test query in Supabase Studio GraphQL editor (http://localhost:54323)
4. Verify RLS policies are correct

## Assignment Requirements Checklist

### Core Requirements
- Next.js frontend framework
- Supabase backend (database, auth, GraphQL)
- Makerkit for authentication
- TypeScript for type safety
- Apollo Client for GraphQL

### Authentication
- Email/password (Makerkit default)
- Google OAuth via Supabase
- **BONUS**: Email OTP login (passwordless)

### Core Features
- Homepage with paginated posts (5 per page)
- Each post shows: title, excerpt (200 chars), author, published date
- Post details page with full content
- Create post page (auth required)

### Functional Requirements
- Pagination via GraphQL (cursor-based)
- Fetch paginated posts query
- Fetch post by ID query
- Create post mutation (auth required)
- Access control on create page

### Bonus Features
- **ISR**: Static generation with revalidation for performance
- **Form Validation**: Zod + React Hook Form for type-safe validation
- **Email OTP**: Passwordless authentication
- **Optimistic UI**: Instant feedback on post creation
- **Profile Dropdown**: User menu with logout in header
- **Error Handling**: Comprehensive error states and boundaries
- **Clean UI**: Professional design with good UX

## License

MIT

## Support

For issues or questions, please open an issue in the GitHub repository.
