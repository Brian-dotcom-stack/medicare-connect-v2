/**
 * Real Supabase authentication helpers used by the auth routes.
 *
 * This replaces the old localStorage-cached mock flow. Sessions are managed
 * entirely by `@supabase/supabase-js` (localStorage persistence + auto refresh),
 * and the dashboard reads the live user through `useOrg()`.
 */
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

function toAuthUser(user: {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): AuthUser {
  const email = user.email ?? "";
  return {
    id: user.id,
    email,
    name: (user.user_metadata?.name as string) ?? email.split("@")[0] ?? "User",
    emailVerified: !!user.email_confirmed_at,
  };
}

/** Sign in with email + password. Throws an Error on failure. */
export async function login(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Sign in succeeded but no user was returned.");
  return toAuthUser(data.user);
}

/**
 * Register a new account.
 *
 * `requiresEmailConfirmation` is true when Supabase is configured to require
 * email verification and the sign-up did not auto-confirm the user — the UI
 * should route to `/verify-email` in that case.
 */
export async function register(name: string, email: string, password: string) {
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/overview` : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name }, emailRedirectTo: redirectTo },
  });
  if (error) throw error;

  return {
    user: data.user ? toAuthUser(data.user) : null,
    session: data.session,
    requiresEmailConfirmation: !!data.user && !data.session && !data.user.email_confirmed_at,
  };
}

/**
 * OAuth sign-in with Google through Supabase.
 *
 * Uses Supabase's native `signInWithOAuth` (rather than Lovable Cloud Auth) so
 * the flow works on standalone Vercel deployments where the Lovable redirect
 * handler is not present. After Google returns, supabase-js detects the token
 * in the URL and persists the session automatically.
 */
export async function loginWithGoogle(): Promise<void> {
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/overview` : undefined;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

/** Send a password reset email. */
export async function requestPasswordReset(email: string): Promise<void> {
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

/** Update the password for the currently authenticated user. */
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/** Sign the current session out and clear any cached org selection. */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
  if (typeof window !== "undefined") localStorage.removeItem("mc:activeOrg:v1");
}

