# Vercel Deployment Guide

This guide will walk you through deploying your blog application to Vercel.

## Prerequisites

1. A Supabase account and project
2. A Vercel account
3. Your code pushed to a GitHub repository

## Step 1: Set Up Supabase Production Project

### 1.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name (e.g., "blogify-prod")
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait 2-3 minutes for provisioning

### 1.2 Get Your Supabase Credentials

Once created, go to Project Settings > API:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon/public key**: `eyJhbG...` (starts with eyJ)
- **service_role key**: `eyJhbG...` (keep this secret!)

### 1.3 Push Database Migrations

From your project root:

```bash
# Link to your Supabase project
cd apps/web
pnpm supabase link --project-ref xxxxxxxxxxxxx

# Enter your database password when prompted

# Push all migrations
pnpm supabase db push
```

This will create the `accounts` and `posts` tables with all RLS policies.

### 1.4 Configure Google OAuth (Optional)

If you want Google login in production:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Update your OAuth 2.0 Client ID:
   - Add authorized redirect URI: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
3. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google
   - Add your Google Client ID and Secret
   - Save

### 1.5 Update Supabase Auth Settings

In Supabase Dashboard > Authentication > URL Configuration:

- **Site URL**: `https://your-app.vercel.app` (you'll get this after deploying)
- **Redirect URLs**: Add `https://your-app.vercel.app/**` (allows all paths)

You can update this after getting your Vercel URL.

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Select the repository

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as is for monorepo)
- **Build Command**: `pnpm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `pnpm install` (auto-detected)

### 2.3 Add Environment Variables

Click "Environment Variables" and add the following:

#### Required Variables

```
NEXT_PUBLIC_SUPABASE_URL
```
Value: `https://xxxxxxxxxxxxx.supabase.co`
(Your Supabase project URL)

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
(Your Supabase anon/public key)

```
NEXT_PUBLIC_SUPABASE_GRAPHQL_URL
```
Value: `https://xxxxxxxxxxxxx.supabase.co/graphql/v1`
(Your Supabase GraphQL endpoint)

```
SUPABASE_SERVICE_ROLE_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
(Your Supabase service role key - KEEP SECRET!)

```
NEXT_PUBLIC_SITE_URL
```
Value: `https://your-app.vercel.app`
(Your Vercel app URL - add after first deploy)

```
NEXT_PUBLIC_PRODUCT_NAME
```
Value: `Blogify`

```
NEXT_PUBLIC_SITE_TITLE
```
Value: `Blogify - Share Your Stories and Ideas`

```
NEXT_PUBLIC_SITE_DESCRIPTION
```
Value: `A modern blogging platform where writers share stories, ideas, and insights with the world.`

```
NEXT_PUBLIC_DEFAULT_THEME_MODE
```
Value: `light`

```
NEXT_PUBLIC_THEME_COLOR
```
Value: `#2563eb`

```
NEXT_PUBLIC_THEME_COLOR_DARK
```
Value: `#1e3a8a`

```
NEXT_PUBLIC_AUTH_PASSWORD
```
Value: `true`

```
NEXT_PUBLIC_AUTH_MAGIC_LINK
```
Value: `true`

```
NEXT_PUBLIC_DEFAULT_LOCALE
```
Value: `en`

```
NEXT_PUBLIC_LOCALES_PATH
```
Value: `apps/web/public/locales`

```
NEXT_PUBLIC_ENABLE_THEME_TOGGLE
```
Value: `true`

```
NEXT_PUBLIC_LANGUAGE_PRIORITY
```
Value: `application`

```
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION
```
Value: `true`

**Important**:
- Set all variables for "Production", "Preview", and "Development" environments
- Click "Add" after each variable

### 2.4 Deploy

1. Click "Deploy"
2. Wait 2-5 minutes for build to complete
3. Once deployed, you'll get a URL like: `https://your-app.vercel.app`

## Step 3: Post-Deployment Configuration

### 3.1 Update Supabase Site URL

1. Copy your Vercel deployment URL
2. Go to Supabase Dashboard > Authentication > URL Configuration
3. Update:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`
4. Save changes

### 3.2 Update NEXT_PUBLIC_SITE_URL in Vercel

1. Go to Vercel > Your Project > Settings > Environment Variables
2. Find `NEXT_PUBLIC_SITE_URL`
3. Update value to: `https://your-app.vercel.app`
4. Click "Save"
5. Go to Deployments tab
6. Click "..." on latest deployment > "Redeploy"

### 3.3 Test Your Deployment

Visit your app at `https://your-app.vercel.app` and test:

1. Homepage loads with blog posts
2. Click on a post to view details
3. Sign up with email/password
4. Try Google OAuth (if configured)
5. Create a new blog post
6. Logout and login again

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Vercel > Your Project > Settings > Domains
2. Add your custom domain (e.g., `blog.yourdomain.com`)
3. Follow Vercel's DNS configuration instructions

### 4.2 Update Supabase URLs

1. In Supabase Dashboard > Authentication > URL Configuration
2. Update Site URL to: `https://blog.yourdomain.com`
3. Add to Redirect URLs: `https://blog.yourdomain.com/**`

### 4.3 Update Environment Variable

1. In Vercel > Settings > Environment Variables
2. Update `NEXT_PUBLIC_SITE_URL` to: `https://blog.yourdomain.com`
3. Redeploy

## Environment Variables Checklist

### Public Variables (Safe to Commit)
These are in `.env` and `.env.production` files:

- `NEXT_PUBLIC_PRODUCT_NAME`
- `NEXT_PUBLIC_SITE_TITLE`
- `NEXT_PUBLIC_SITE_DESCRIPTION`
- `NEXT_PUBLIC_DEFAULT_THEME_MODE`
- `NEXT_PUBLIC_THEME_COLOR`
- `NEXT_PUBLIC_THEME_COLOR_DARK`
- `NEXT_PUBLIC_AUTH_PASSWORD`
- `NEXT_PUBLIC_AUTH_MAGIC_LINK`
- `NEXT_PUBLIC_DEFAULT_LOCALE`
- `NEXT_PUBLIC_LOCALES_PATH`
- `NEXT_PUBLIC_ENABLE_THEME_TOGGLE`
- `NEXT_PUBLIC_LANGUAGE_PRIORITY`
- `NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION`

### Secret Variables (NEVER Commit)
These should ONLY be in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` (production URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (production key)
- `NEXT_PUBLIC_SUPABASE_GRAPHQL_URL` (production endpoint)
- `SUPABASE_SERVICE_ROLE_KEY` (VERY SECRET!)
- `NEXT_PUBLIC_SITE_URL` (production domain)

### Local Development Only
These are in `.env.local` (gitignored):

- Local Supabase credentials
- Any testing API keys

## Troubleshooting

### Build Fails with "NEXT_PUBLIC_SITE_URL must be HTTPS"

**Solution**: Make sure `NEXT_PUBLIC_SITE_URL` in Vercel environment variables is set to `https://your-app.vercel.app` (not http)

### Authentication Not Working

**Solution**:
1. Check Supabase Site URL matches your Vercel URL
2. Check Redirect URLs include your Vercel URL with `/**`
3. Verify all Supabase env vars are correct in Vercel

### Posts Not Appearing

**Solution**:
1. Verify migrations were pushed to production Supabase
2. Check Supabase logs for errors
3. Test GraphQL query in Supabase Studio

### Google OAuth Not Working

**Solution**:
1. Update Google OAuth redirect URI to production Supabase URL
2. Enable Google provider in Supabase Dashboard
3. Add Google credentials to Supabase

## Security Best Practices

1. **Never commit** `.env.local` files
2. **Never commit** production API keys or secrets
3. Keep `.env` and `.env.production` with **placeholder values only**
4. Use Vercel environment variables for all production secrets
5. Rotate your `SUPABASE_SERVICE_ROLE_KEY` periodically
6. Enable RLS (Row Level Security) on all tables
7. Use HTTPS everywhere (Vercel does this automatically)

## Continuous Deployment

After initial setup, any push to your main branch will:

1. Trigger automatic deployment on Vercel
2. Build and deploy in 2-5 minutes
3. Update your production site

Preview deployments are created for Pull Requests automatically.

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs in Dashboard
3. Review browser console for errors
4. Verify all environment variables are set correctly
