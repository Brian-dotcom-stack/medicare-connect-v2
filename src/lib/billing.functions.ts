import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orgId: string; priceId: string; origin: string }) => input)
  .handler(async ({ data, context }) => {
    const { createCheckout } = await import("./billing.server");
    return createCheckout({
      supabase: context.supabase,
      userId: context.userId,
      orgId: data.orgId,
      priceId: data.priceId,
      origin: data.origin,
    });
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orgId: string; origin: string }) => input)
  .handler(async ({ data, context }) => {
    const { createPortal } = await import("./billing.server");
    return createPortal({
      supabase: context.supabase,
      userId: context.userId,
      orgId: data.orgId,
      origin: data.origin,
    });
  });

export const syncSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orgId: string }) => input)
  .handler(async ({ data, context }) => {
    const { syncOrgSubscription } = await import("./billing.server");
    return syncOrgSubscription({
      supabase: context.supabase,
      userId: context.userId,
      orgId: data.orgId,
    });
  });

/** Creates the Stripe customer for a newly created organisation. */
export const provisionOrgCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orgId: string }) => input)
  .handler(async ({ data, context }) => {
    const { ensureCustomer } = await import("./billing.server");
    const { data: org, error } = await context.supabase
      .from("organisations")
      .select("id, name, stripe_customer_id")
      .eq("id", data.orgId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!org) throw new Error("Organisation not found");
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("email")
      .eq("id", context.userId)
      .maybeSingle();
    const customerId = await ensureCustomer(context.supabase, org, profile?.email ?? "");
    return { customerId };
  });
