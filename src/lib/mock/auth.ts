/**
 * DEPRECATED — kept only as a compatibility shim for anything still importing
 * from `@/lib/mock/auth`. All auth now lives in `@/lib/auth` and is backed by
 * Supabase. The old localStorage user cache has been removed — session state is
 * managed by supabase-js and read via `useOrg()`.
 */
import {
  login as realLogin,
  register as realRegister,
  loginWithGoogle as realLoginWithGoogle,
  requestPasswordReset as realRequestPasswordReset,
  updatePassword as realUpdatePassword,
  logout as realLogout,
} from "@/lib/auth";

// The synchronous helpers below previously read a cached user snapshot. They
// now return null / no-op to avoid synthesising fake org membership for the
// mock dashboard store.
export function getSessionUser(): null {
  return null;
}

export function getActiveOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mc:activeOrg:v1");
}

export function setActiveOrgId(orgId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("mc:activeOrg:v1", orgId);
}

/** Kept for API compatibility — writes the org id only, no fake store data. */
export function addMockOrg(name: string): string {
  const orgId = `org_${Math.random().toString(36).slice(2, 10)}`;
  if (typeof window !== "undefined") {
    localStorage.setItem("mc:activeOrg:v1", orgId);
  }
  return orgId;
}

export async function login(email: string, password: string): Promise<void> {
  await realLogin(email, password);
}

export async function register(name: string, email: string, password: string): Promise<void> {
  await realRegister(name, email, password);
}

export async function loginWithGoogle(): Promise<void> {
  await realLoginWithGoogle();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await realRequestPasswordReset(email);
}

export async function updatePassword(newPassword: string): Promise<void> {
  await realUpdatePassword(newPassword);
}

export async function logout(): Promise<void> {
  await realLogout();
}

export function currentRole(): null {
  return null;
}

export function writeCachedUser(): void {
  // no-op — the local user cache has been removed.
}

