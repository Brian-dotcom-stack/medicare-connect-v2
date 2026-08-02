import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseEnv } from "./config";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/** Throws a 401-style error that server-fn/API callers can surface as JSON. */
export class AuthError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}

function getBearerToken(): string {
  const request = getRequest();

  if (!request?.headers) {
    throw new AuthError("Unauthorized: No request headers available");
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new AuthError("Unauthorized: No authorization header provided");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AuthError("Unauthorized: Only Bearer tokens are supported");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new AuthError("Unauthorized: No token provided");
  }

  if (token.split(".").length !== 3) {
    throw new AuthError("Unauthorized: Invalid token");
  }

  return token;
}

/**
 * Server middleware that authenticates a bearer token against Supabase and
 * attaches an RLS-scoped client plus the resolved user context.
 *
 * Uses `supabase.auth.getUser(token)` (not `getClaims`) so it works with BOTH
 * legacy anon (`eyJ*`) keys and the new opaque `sb_publishable_*` API keys.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { url, publishableKey } = getSupabaseEnv();
    const token = getBearerToken();

    const supabase = createClient<Database>(url, publishableKey, {
      global: {
        fetch: createSupabaseFetch(publishableKey),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new AuthError(error?.message ?? "Unauthorized: Invalid token");
    }

    const user = data.user;
    if (!user.id) {
      throw new AuthError("Unauthorized: No user ID found in token");
    }

    return next({
      context: {
        supabase,
        userId: user.id,
        claims: user.role ? { sub: user.id, role: user.role } : { sub: user.id },
        user,
      },
    });
  },
);

