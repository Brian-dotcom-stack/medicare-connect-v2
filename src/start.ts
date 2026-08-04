// Force Nitro/Vercel to bundle tslib into the server output. Without this,
// the serverless bundle throws "Cannot find package 'tslib' imported from
// /var/task/_libs/supabase__functions-js.mjs" at runtime because Nitro
// externalises `tslib` (an importHelper) but the deployed runtime does not
// include it as a node_module.
import "@/integrations/supabase/tslib-shim";

import { createStart, createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Distinguish full-document (SSR page) requests from server-fn/API RPCs.
// Server-fn/API errors must be rethrown so the caller receives the real
// status/message (e.g. an AuthError 401 toast) instead of an HTML error page.
function isDocumentRequest(): boolean {
  try {
    const request = getRequest();
    if (!request) return true;
    const accept = request.headers.get("accept") ?? "";
    return accept.includes("text/html");
  } catch {
    return true;
  }
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // Already-HTTP-shaped errors (AuthError, redirects, etc.) pass through so
    // the caller receives the real status code.
    if (
      error != null &&
      typeof error === "object" &&
      ("statusCode" in error || "status" in error)
    ) {
      throw error;
    }
    console.error(error);
    // Only render the HTML fallback for full-document requests; everything
    // else rethrows so the client can surface a precise error message.
    if (isDocumentRequest()) {
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    throw error;
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));

