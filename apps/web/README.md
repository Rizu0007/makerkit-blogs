# Blog Application - Next.js + Makerkit + Supabase

A fully functional blog application built with **Next.js 15**, **Makerkit** (open-source SaaS template), and **Supabase** featuring authentication, GraphQL API, and incremental static regeneration (ISR).

## 🚀 Features

### Core Features
- ✅ **Homepage**: Paginated blog post listing (5 posts per page)
- ✅ **Post Details**: Full blog post view with author information
- ✅ **Create Post**: Authenticated users can create new blog posts
- ✅ **GraphQL API**: Supabase GraphQL for all data operations
- ✅ **Access Control**: Route protection for authenticated-only pages

### Authentication (Makerkit + Supabase)
- ✅ **Email/Password**: Traditional authentication flow
- ✅ **Google OAuth**: Social login integration  
- ✅ **Magic Link (Email OTP)**: Passwordless authentication
- ✅ **Profile Dropdown**: User profile with logout functionality

### Bonus Features Implemented
- ✅ **ISR (Incremental Static Regeneration)**
  - Post detail pages: Pre-rendered with \`generateStaticParams\`
  - Blog listing: Revalidates every 30 seconds
  - Post details: Revalidates every 60 seconds
- ✅ **Form Validation**: Comprehensive Zod validation with React Hook Form
- ✅ **Optimistic UI**: Instant feedback when creating posts
- ✅ **Apollo Client Cache**: Smart cache updates and management
- ✅ **SEO Optimization**: Metadata, Open Graph, and structured data

---

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher (\`npm install -g pnpm\`)
- **Supabase Account**: [supabase.com](https://supabase.com)
- **Google OAuth Credentials** (optional, for Google login)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd makerkit-blog/apps/web
\`\`\`

### 2. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Environment Configuration

Copy the environment template:

\`\`\`bash
cp .env .env.local
\`\`\`

Update \`.env.local\` with your Supabase credentials:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL=https://your-project.supabase.co/graphql/v1
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCT_NAME=My Blog
NEXT_PUBLIC_SITE_TITLE=My Blog - The easiest way to build and manage your blog
NEXT_PUBLIC_SITE_DESCRIPTION=My Blog is the easiest way to build and manage your blog.
NEXT_PUBLIC_DEFAULT_THEME_MODE=light
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_THEME_COLOR=#ffffff
NEXT_PUBLIC_THEME_COLOR_DARK=#0a0a0a

# Authentication
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=true
\`\`\`

### 4. Database Setup

#### Link to Your Supabase Project

\`\`\`bash
pnpm supabase link --project-ref your-project-ref
\`\`\`

#### Run Migrations

\`\`\`bash
pnpm supabase db push
\`\`\`

This creates:
- \`posts\` table with RLS policies
- Proper permissions for GraphQL access
- Database indexes for performance

### 5. Configure Authentication

#### Disable Email Confirmations (Development)

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/providers
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Toggle OFF: **"Enable email confirmations"**

#### Enable Google OAuth (Optional)

1. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
2. In Supabase Dashboard: **Authentication** → **Providers** → **Google**
3. Add Client ID and Secret
4. Add redirect URI: \`https://YOUR_PROJECT.supabase.co/auth/v1/callback\`

#### Enable Magic Link

Already enabled in \`.env\`. Configure in Supabase:
1. **Authentication** → **Providers** → **Email**
2. Enable: **"Magic Link"**

### 6. Run the Application

\`\`\`bash
pnpm dev
\`\`\`

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture Highlights

### ISR Implementation

**Post Detail Page**:
\`\`\`typescript
export async function generateStaticParams() {
  // Pre-render top posts at build time
}
export const revalidate = 60; // Revalidate every 60s
\`\`\`

**Blog Listing**:
\`\`\`typescript
export const revalidate = 30; // Revalidate every 30s
\`\`\`

### Form Validation (Zod + React Hook Form)

\`\`\`typescript
const schema = z.object({
  title: z.string().min(3).max(200).trim(),
  body: z.string().min(10).max(50000),
});
\`\`\`

### Optimistic Updates

\`\`\`typescript
useMutation(CREATE_POST, {
  optimisticResponse: { /* immediate UI */ },
  update: (cache) => { /* cache management */ }
});
\`\`\`

---

## 🧪 Testing Checklist

- [ ] Sign up/in with email/password
- [ ] Magic Link authentication  
- [ ] Google OAuth login
- [ ] Create blog post
- [ ] View posts and pagination
- [ ] Form validation
- [ ] Profile dropdown & logout
- [ ] ISR (wait 60s, refresh)

---

## 🚢 Deployment

Deploy to Vercel:
\`\`\`bash
vercel
\`\`\`

Update environment variables and Supabase redirect URLs for production.

---

## 📚 Tech Stack

- Next.js 15 (App Router, Server Components, ISR)
- Makerkit (Auth templates)
- Supabase (Database, Auth, GraphQL)
- Apollo Client (GraphQL client)
- TypeScript, Zod, React Hook Form
- Tailwind CSS, Shadcn/UI

---

## 🐛 Troubleshooting

**GraphQL permission error**: Run \`pnpm supabase db push\`

**Email confirmation error**: Disable in Supabase Dashboard

**ISR not working**: Build for production (\`pnpm build && pnpm start\`)

---

## 📞 Support

For issues, contact the team or open a GitHub issue.

