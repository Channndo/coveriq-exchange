# CoverIQ Exchange

The intelligent insurance lead exchange for licensed producers — Next.js 15, Supabase, Stripe, and Tailwind CSS 4.

## Local preview

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase configured, middleware allows open access and the app uses `MOCK_LEADS` from `src/lib/data/mock-leads.ts` for the leads dashboard.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | For auth | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For auth | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role (webhooks, admin scripts) |
| `NEXT_PUBLIC_LEGACY_APPS_SCRIPT_URL` | Optional | Legacy agent API fallback on login |
| `STRIPE_SECRET_KEY` | Optional | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Optional | Stripe webhook signing secret |
| `STRIPE_PRICE_STARTER` | Optional | Stripe Price ID for Starter plan |
| `STRIPE_PRICE_PROFESSIONAL` | Optional | Stripe Price ID for Professional plan |
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical app URL (callbacks) |

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Enable Email auth in Authentication → Providers.
4. Add your site URL and redirect URLs (`/api/auth/callback`).

### Registration flow

- `POST` sign-up creates an `auth.users` row.
- App inserts `agent_profiles` with `account_status = pending_verification`.
- Middleware redirects non-active users to `/pending` when accessing dashboard routes.

## Deployment (Vercel)

Production portal: **https://agents.cover-iq.com**

1. Import the repo in [Vercel](https://vercel.com).
2. Set environment variables from `.env.example`.
3. Add custom domain `agents.cover-iq.com`.
4. Configure Supabase redirect URL: `https://agents.cover-iq.com/api/auth/callback`
5. (Optional) Point Stripe webhook to `https://agents.cover-iq.com/api/stripe/webhook`

```bash
npm run build
```

## Project structure

- `src/app/` — App Router pages (landing, auth, dashboard, admin, API)
- `src/components/` — UI, landing, auth, dashboard, leads, admin
- `src/lib/` — Supabase, Stripe, legacy API, mock data, utilities
- `supabase/schema.sql` — Database schema and RLS policies

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
