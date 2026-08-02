/**
 * Shared Supabase environment resolver.
 *
 * Works on the client (Vite statically replaces `import.meta.env`) and on the
 * server (`process.env`), and accepts both the legacy `SUPABASE_ANON_KEY`
 * naming and the new-style `SUPABASE_PUBLISHABLE_KEY` naming. Centralising this
 * here prevents the "missing env var" / `process is not defined` crashes that
 * happened when each Supabase module read `process.env` unguarded in the
 * browser bundle.
 */

type EnvKey =
  | "VITE_SUPABASE_URL"
  | "VITE_SUPABASE_ANON_KEY"
  | "VITE_SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_URL"
  | "SUPABASE_ANON_KEY"
  | "SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY";

function getClientEnv(key: string): string | undefined {
  try {
    if (typeof import.meta.env === "object" && import.meta.env !== null) {
      const value = (import.meta.env as Record<string, unknown>)[key];
      if (typeof value === "string" && value.length > 0) return value;
    }
  } catch {
    // import.meta.env is not available in all server runtimes — ignore.
  }
  return undefined;
}

function getServerEnv(key: string): string | undefined {
  try {
    // Guarded: `process` is undefined in browser bundles; referencing it
    // unguarded throws "ReferenceError: process is not defined".
    if (typeof process !== "undefined" && typeof process.env === "object") {
      const value = process.env[key];
      if (typeof value === "string" && value.length > 0) return value;
    }
  } catch {
    // process access can throw in sandboxed runtimes — ignore.
  }
  return undefined;
}

function getEnv(key: EnvKey): string | undefined {
  return getClientEnv(key) ?? getServerEnv(key);
}

export interface SupabaseEnv {
  url: string;
  /** Anon/publishable key safe to send to the browser. */
  publishableKey: string;
  /** Server-only service-role key (bypasses RLS). */
  serviceRoleKey?: string;
}

export function getSupabaseEnv(options?: { requireServiceRole?: boolean }): SupabaseEnv {
  const requireServiceRole = options?.requireServiceRole ?? false;

  const url = getEnv("VITE_SUPABASE_URL") ?? getEnv("SUPABASE_URL");
  const publishableKey =
    getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ??
    getEnv("SUPABASE_PUBLISHABLE_KEY") ??
    getEnv("VITE_SUPABASE_ANON_KEY") ??
    getEnv("SUPABASE_ANON_KEY");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  const missing: string[] = [];
  if (!url) missing.push("SUPABASE_URL");
  if (!publishableKey) missing.push("SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY)");
  if (requireServiceRole && !serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  if (missing.length > 0) {
    const message = `Missing Supabase environment variable(s): ${missing.join(
      ", ",
    )}. Add them to your environment or connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return {
    url: url as string,
    publishableKey: publishableKey as string,
    serviceRoleKey: serviceRoleKey ?? undefined,
  };
}

