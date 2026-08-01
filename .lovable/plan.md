
# Medicare Connect — Full Rebuild Plan

A complete TanStack Start rebuild with marketing, auth, and a role-based dashboard. All data is fictional placeholders. No backend yet — everything runs on a mock in-memory/localStorage store so the whole surface is navigable and demoable. Lovable Cloud (real auth + DB) can be layered on later without changing route structure.

## Scope Note

This is a very large surface. To keep it shippable in one pass, I'll build:
- Every route file (fully navigable, real UI)
- A shared design system in `styles.css`
- A mock auth + tenant store (localStorage) with seed data
- Rich UI for the "hero" dashboard pages (Staff, Clients, Rotas, Incidents, Medications)
- Functional-but-lean UI for secondary pages (Settings, Notifications, Audit logs)
- Stripe billing left as a stubbed Settings → Billing page (real Stripe deferred until you confirm)

## Folder Structure

```text
src/
  routes/
    __root.tsx                    global html shell only
    _marketing/route.tsx          marketing layout (nav + footer)
    _marketing/index.tsx          /
    _marketing/pricing.tsx
    _marketing/features.tsx
    _marketing/how-it-works.tsx
    _marketing/contact.tsx
    _marketing/demo.tsx
    _auth/route.tsx               centered auth card layout
    _auth/login.tsx
    _auth/register.tsx
    _auth/forgot-password.tsx
    _auth/verify-email.tsx
    _app/route.tsx                dashboard shell (sidebar + topbar + org switcher, gated)
    _app/index.tsx                dashboard home (redirects to /overview)
    _app/overview.tsx             KPIs
    _app/onboarding.tsx           org onboarding wizard
    _app/staff.tsx                staff CRUD
    _app/clients.tsx              client records
    _app/rotas.tsx                weekly schedule grid
    _app/incidents.tsx            incident reports
    _app/medications.tsx          MAR-style workflow
    _app/notifications.tsx
    _app/audit.tsx                audit log
    _app/settings.route.tsx       settings layout w/ tabs
    _app/settings.index.tsx       redirect to profile
    _app/settings.profile.tsx
    _app/settings.organisation.tsx
    _app/settings.billing.tsx     Stripe stub
    _app/settings.team.tsx        roles/permissions
  lib/
    mock/
      store.ts                    localStorage-backed store
      seed.ts                     fictional seed data
      auth.ts                     mock auth (login/register/session)
      types.ts                    Organisation, User, Client, Shift, Incident, Medication, AuditEvent
    rbac.ts                       role helpers (Admin/Manager/Staff)
  components/
    marketing/{Navbar,Footer,Hero,FeatureGrid,PricingTable,CTA}.tsx
    dashboard/{Sidebar,Topbar,OrgSwitcher,PageHeader,DataTable,EmptyState,RoleBadge}.tsx
    ui/{Button,Input,Textarea,Select,Card,Badge,Dialog,Tabs,Table}.tsx  minimal in-house
  styles.css                      design tokens (medical/trust palette)
```

## Design System

- Palette: calm medical — deep teal primary, soft slate neutrals, mint accent, amber for warnings, coral for destructive. All oklch tokens in `styles.css`.
- Typography: Inter via `<link>` in `__root.tsx` head.
- All colors go through semantic tokens — no ad-hoc hex in components.

## Auth & Tenancy (mock)

- `lib/mock/auth.ts` stores current user + activeOrgId in localStorage. `login/register/logout` are async no-ops that resolve after ~200ms.
- `_app/route.tsx` `beforeLoad` checks the mock session; redirects to `/login` if missing, or `/onboarding` if the user has no organisations.
- `_app/route.tsx` context exposes `{ user, org, role, permissions }` to children.
- Seed provides 2 fictional orgs ("Willowbrook Care Group", "Northlake Domiciliary") each with staff/clients/rotas/incidents/meds and one demo admin user (`demo@medicareconnect.test` / `password`).

## RBAC

- Roles: `admin`, `manager`, `staff`.
- `rbac.ts` exports `can(role, action)`; UI hides forbidden actions; server-side enforcement is deferred until Lovable Cloud is wired.

## Page Highlights

- **Marketing home**: hero, value props, feature grid, testimonial strip (fictional), CTA to `/demo`.
- **Demo**: form (name, org, size, message) → validated with zod → thank-you state.
- **Rotas**: 7-day grid, staff rows, add/edit shift dialog.
- **Incidents**: severity-tagged list with filter + new-incident dialog.
- **Medications**: MAR grid (client × time slots) with Given/Missed/Refused toggle.
- **Audit logs**: append-only list of mock actions (login, shift edit, incident create).

## Privacy

All names/orgs/emails are invented (e.g. "Willowbrook Care Group", "Ada Fernsby", "Marcus Whitgrove"). No real people, no real UK/US care providers referenced.

## Out of Scope (this pass)

- Real Lovable Cloud/Supabase integration — mock store only.
- Real Stripe — Billing tab is a stub with plan cards.
- Email sending for verify/forgot — flows just display success states.

I'll enable Lovable Cloud and wire real auth + Stripe in a follow-up turn once you confirm this scaffold looks right.
