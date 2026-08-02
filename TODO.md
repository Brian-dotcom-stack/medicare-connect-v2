# Medicare Connect — Full Audit & Fix Plan

## Phase 1 — Supabase infrastructure
- [x] Create `src/integrations/supabase/config.ts` (shared env resolver)
- [x] Rewrite `src/integrations/supabase/client.ts`
- [x] Rewrite `src/integrations/supabase/client.server.ts`
- [x] Rewrite `src/integrations/supabase/auth-middleware.ts`

## Phase 2 — Auth core
- [x] Create `src/lib/auth.ts` (real Supabase auth)
- [x] Rewrite `src/lib/mock/auth.ts` (deprecated shim)
- [x] Patch `src/start.ts` error middleware
- [x] Patch `src/routes/__root.tsx` (remove localStorage cache)

## Phase 3 — Auth routes
- [x] Fix `login.tsx`
- [x] Fix `register.tsx`
- [x] Fix `forgot-password.tsx`
- [x] Fix `reset-password.tsx`

## Phase 4 — Dashboard guard & data
- [x] Fix `_app/route.tsx`
- [x] Add `isLoading` to `src/lib/data/context.tsx`
- [x] Patch `DemoBanner.tsx`

## Phase 5 — DB & deploy
- [x] Add profiles read migration
- [x] Create `.env.example`
- [x] Create `vercel.json`
- [x] Set Nitro `vercel` preset in `vite.config.ts`
- [x] Update README

## Phase 6 — Verification
- [x] Install dependencies
- [x] `tsc --noEmit`
- [x] `npm run build` — ✅ built in 1.10s, `.vercel/output` generated

