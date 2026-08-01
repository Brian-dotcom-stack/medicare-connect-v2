// Auth is now real (Supabase). The synchronous helpers below read a cached
// user snapshot maintained by the auth listener in __root.tsx. Dashboard data
// is still sourced from the fictional mock store — full DB wiring is next.
import { supabase } from "@/integrations/supabase/client";
import { loadStore, mutate, uid } from "./store";
import type { User } from "./types";

const USER_CACHE = "mc:supabase_user:v1";
const ORG_KEY = "mc:activeOrg:v1";

interface CachedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

function readCachedUser(): CachedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_CACHE);
    return raw ? (JSON.parse(raw) as CachedUser) : null;
  } catch {
    return null;
  }
}

export function writeCachedUser(u: CachedUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_CACHE, JSON.stringify(u));
  else localStorage.removeItem(USER_CACHE);
}

/**
 * Synthesizes a User for the dashboard from the cached Supabase session,
 * giving them membership to the demo seed orgs so dashboards render sample data.
 */
export function getSessionUser(): User | null {
  const cached = readCachedUser();
  if (!cached) return null;
  const orgs = loadStore().orgs;
  return {
    id: cached.id,
    email: cached.email,
    name: cached.name,
    emailVerified: cached.emailVerified,
    memberships: orgs.map((o) => ({ orgId: o.id, role: "admin" as const })),
  };
}

export function getActiveOrgId(): string | null {
  if (typeof window === "undefined") return null;
  const explicit = localStorage.getItem(ORG_KEY);
  if (explicit) return explicit;
  const first = loadStore().orgs[0]?.id ?? null;
  if (first) localStorage.setItem(ORG_KEY, first);
  return first;
}

export function setActiveOrgId(orgId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORG_KEY, orgId);
}

export async function login(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (data.user) {
    writeCachedUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name: (data.user.user_metadata?.name as string) ?? email.split("@")[0],
      emailVerified: !!data.user.email_confirmed_at,
    });
  }
}

export async function register(name: string, email: string, password: string): Promise<void> {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/overview` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: redirectTo },
  });
  if (error) throw new Error(error.message);
  if (data.user && data.session) {
    writeCachedUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name,
      emailVerified: !!data.user.email_confirmed_at,
    });
  }
}

export async function loginWithGoogle(): Promise<void> {
  const { lovable } = await import("@/integrations/lovable/index");
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
  });
  if (result.error) throw new Error(result.error.message ?? "Google sign-in failed");
}

export async function requestPasswordReset(email: string): Promise<void> {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function logout() {
  await supabase.auth.signOut();
  writeCachedUser(null);
  if (typeof window !== "undefined") localStorage.removeItem(ORG_KEY);
}

export function currentRole(): "admin" | "manager" | "staff" | null {
  const user = getSessionUser();
  const orgId = getActiveOrgId();
  if (!user || !orgId) return null;
  return user.memberships.find((m) => m.orgId === orgId)?.role ?? null;
}

// Kept for API compatibility with prior mock (used by onboarding to also
// insert a mock org so demo dashboards keep rendering).
export function addMockOrg(name: string, userId: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
  const orgId = uid("org");
  mutate((s) => {
    s.orgs.push({ id: orgId, name, slug, plan: "starter", createdAt: new Date().toISOString() });
    // Seed a placeholder membership on our synthesized user (dashboards ignore this).
    void userId;
  });
  return orgId;
}
