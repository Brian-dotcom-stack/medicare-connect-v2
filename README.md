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
- Vite 7
- Tailwind CSS v4 + shadcn/ui
- Postgres with row-level security for tenant isolation
- Stripe for subscription billing

## Getting started

```sh
bun install
bun run dev
```

The app runs at `http://localhost:8080`.

## Scripts

- `bun run dev` — start the dev server
- `bun run build` — production build

## Notes

Demo environments display a demo-mode banner; all records shown there are fictional.
