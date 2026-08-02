# Medicare Connect

Multi-tenant care management platform for domiciliary and residential care providers.

## Features

- Marketing site: home, features, pricing, how it works, contact, demo
- Authentication: sign up, login, email verification, password reset
- Multi-tenant dashboard with organisation switcher and role-based access (Admin, Manager, Staff)
- Modules: staff, clients, rotas/shifts, incidents, medications (MAR), notifications, audit log
- Settings: profile, organisation, team, billing (Stripe subscriptions)

## Tech stack

- TanStack Start (React 19, TanStack Router)
- Vite 8
- Tailwind CSS v4 + shadcn/ui
- Postgres (Supabase) with row-level security for tenant isolation
- Stripe for subscription billing
- Deployed on Vercel via Nitro

## Getting started

### 1. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```sh
cp .env.example .env
```

Required variables:

| Variable | Where | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Client + Server | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Client (browser) | Anonymous/public key |
| `SUPABASE_URL` | Server only | Same as above (server-side access) |
| `SUPABASE_ANON_KEY` | Server only | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (secret) | Bypasses RLS — for webhooks and admin ops |
| `STRIPE_SECRET_KEY` | Server only | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Server only | Stripe webhook signing secret |

> **Never expose `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, or `STRIPE_WEBHOOK_SECRET` to the browser.**
> Variables prefixed with `VITE_` are inlined into the client bundle.

### 2. Install & run

```sh
npm install
npm run dev
```

The app runs at `http://localhost:8080`.

### 3. Run database migrations

Connect to your Supabase project and run the SQL files in `supabase/migrations/` in order.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (outputs to `.output/`)
- `npm run preview` — preview the production build

## Deploying to Vercel

The project includes a `vercel.json` with the Nitro preset set to `vercel` (configured in `vite.config.ts`).

1. Push your repository to GitHub.
2. Connect the repo in Vercel.
3. Set all environment variables (both `VITE_*` client and server-only vars) in Vercel → Project Settings → Environment Variables.
4. Deploy — the build command is `npm run build`.

## Notes

- Demo environments display a demo-mode banner (controlled by `VITE_DEMO_MODE=true`); all records shown there are fictional.
- Supabase sessions are persisted in localStorage and auto-refreshed by supabase-js.
- For the `Settings → Team` page to work, run the `20260801000000_profiles_org_members_read.sql` migration which allows org members to read each other's profiles.
