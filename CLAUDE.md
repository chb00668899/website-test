# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 + TypeScript personal blog website with Supabase backend and Alibaba Cloud OSS video storage. Architecture follows "static/dynamic separation + cloud hosting" strategy for low-spec server deployment.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run test         # Vitest unit tests
npm run test:ui      # Vitest with UI
npm run test:e2e     # Playwright E2E tests
npm run test:e2e:ui  # Playwright with UI
```

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Supabase service role key (admin operations)
- `NEXT_PUBLIC_OSS_REGION` - Alibaba OSS region
- `OSS_ACCESS_KEY_ID` - OSS access key
- `OSS_ACCESS_KEY_SECRET` - OSS secret key
- `NEXT_PUBLIC_OSS_BUCKET` - OSS bucket name
- `NEXT_PUBLIC_OSS_ENDPOINT` - OSS endpoint

## Architecture

### Core Structure
- **Framework**: Next.js 16 App Router with React 19
- **Styling**: Tailwind CSS 4 with custom UI components (shadcn-like pattern)
- **State**: TanStack React Query for server state management
- **Auth**: Supabase Auth with cookie-based session management
- **Database**: Supabase PostgreSQL (cloud-hosted)
- **Video Storage**: Alibaba Cloud OSS + CDN distribution

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/lib/` - Core utilities and clients (supabase, oss, auth, types)
- `src/components/` - React components (ui, layout, blog, video, performance)
- `src/services/` - Business logic services (adminPostService, postService, videoService, likeService, commentService)
- `src/hooks/` - Custom React hooks (useUser)

### Data Flow Pattern
1. **Pages** → **Services** → **Supabase/OSS**
2. Services use either `supabase` (client) or `supabaseAdmin` (server)
3. API routes (`src/app/api/**/route.ts`) handle server-side operations
4. Authentication via `authClient` with cookie fallback for development

### Database Schema (Supabase)
- `posts` - Blog articles with Markdown content
- `videos` - Video metadata (OSS URL, thumbnail, duration)
- `categories` - Article categories
- `tags` - Article tags
- `comments` - User comments
- `auth.users` - Supabase authentication

### Authentication Flow
1. Login via `/api/auth/login` (email/password) or OAuth (`/api/auth/oauth`)
2. Session stored in cookies via `@supabase/ssr`
3. Development mode supports mock-session cookie for testing
4. Admin check via `permissions.ts` (`PermissionChecker.isAdmin()`)

### OSS Integration
- Frontend uploads via presigned URLs (`ossClient.generatePresignedUrl()`)
- Video playback directly from OSS CDN endpoints
- Images and thumbnails also stored in OSS

## Common Development Tasks

### Adding a new API endpoint
Create file at `src/app/api/[resource]/route.ts` with GET/POST handlers using `supabaseAdmin` for database operations.

### Creating a new page
Add `page.tsx` to `src/app/[route]/` with React Query for data fetching.

### Adding admin functionality
Use `AdminPostService` or create new service in `src/services/`, protect with `PermissionChecker.isAdmin()`.

### Running specific tests
```bash
npm run test -- src/components/blog/__tests__/LikeButton.test.tsx
```

## Security Notes
- Supabase RLS policies control data access
- Admin operations require service key authentication
- OSS files should have proper CORS and防盗链 (hotlink protection) configured
