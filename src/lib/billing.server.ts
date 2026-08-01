import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PRODUCT_TO_PLAN } from "./billing/plans";

type Db = SupabaseClient<any, "public", any>;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

async function requireAdminOrg(supabase: Db, userId: string, orgId: string) {
  const { data: isAdmin, error: rErr } = await supabase.rpc("has_org_role", {
    _org: orgId,
    _user: userId,
    _role: "admin",
  });
  if (rErr) throw new Error(rErr.message);
  if (!isAdmin) throw new Error("Only organisation admins can manage billing");

  const { data: org, error } = await supabase
    .from("organisations")
    .select("id, name, stripe_customer_id")
    .eq("id", orgId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!org) throw new Error("Organisation not found");
  return org as { id: string; name: string; stripe_customer_id: string | null };
}

/** Ensures the organisation has a Stripe customer, creating one if needed. */
export async function ensureCustomer(
  supabase: Db,
  org: { id: string; name: string; stripe_customer_id: string | null },
  email: string,
): Promise<string> {
  if (org.stripe_customer_id) return org.stripe_customer_id;
  const stripe = getStripe();
  const customer = await stripe.customers.create({
    name: org.name,
    email,
    metadata: { org_id: org.id },
  });
  const { error } = await supabase
    .from("organisations")
    .update({ stripe_customer_id: customer.id })
    .eq("id", org.id);
  if (error) throw new Error(error.message);
  return customer.id;
}

export async function createCheckout(args: {
  supabase: Db;
  userId: string;
  orgId: string;
  priceId: string;
  origin: string;
}): Promise<{ url: string }> {
  const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
  const { data: profile } = await args.supabase
    .from("profiles")
    .select("email")
    .eq("id", args.userId)
    .maybeSingle();
  const customerId = await ensureCustomer(args.supabase, org, profile?.email ?? "");

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: args.priceId, quantity: 1 }],
    client_reference_id: org.id,
    subscription_data: { metadata: { org_id: org.id } },
    success_url: `${args.origin}/settings/billing?checkout=success`,
    cancel_url: `${args.origin}/settings/billing?checkout=cancelled`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url };
}

export async function createPortal(args: {
  supabase: Db;
  userId: string;
  orgId: string;
  origin: string;
}): Promise<{ url: string }> {
  const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
  if (!org.stripe_customer_id) throw new Error("No billing account yet — start a subscription first");
  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: `${args.origin}/settings/billing`,
  });
  return { url: portal.url };
}

function planFromSubscription(sub: Stripe.Subscription): string | null {
  const product = sub.items.data[0]?.price?.product;
  const productId = typeof product === "string" ? product : product?.id;
  return productId ? (PRODUCT_TO_PLAN[productId] ?? null) : null;
}

export function subscriptionFields(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  const periodEnd =
    (item as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null;
  const plan = planFromSubscription(sub);
  return {
    stripe_subscription_id: sub.id,
    subscription_status: sub.status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    ...(plan ? { plan } : {}),
  };
}

/** Reads the live subscription state from Stripe and mirrors it onto the organisation. */
export async function syncOrgSubscription(args: {
  supabase: Db;
  userId: string;
  orgId: string;
}) {
  const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
  if (!org.stripe_customer_id) return { subscribed: false as const };

  const stripe = getStripe();
  const subs = await stripe.subscriptions.list({
    customer: org.stripe_customer_id,
    status: "all",
    limit: 1,
  });
  const sub = subs.data[0];
  if (!sub) {
    await args.supabase
      .from("organisations")
      .update({ subscription_status: "canceled", stripe_subscription_id: null })
      .eq("id", org.id);
    return { subscribed: false as const };
  }

  const fields = subscriptionFields(sub);
  const { error } = await args.supabase.from("organisations").update(fields).eq("id", org.id);
  if (error) throw new Error(error.message);
  return { subscribed: sub.status === "active" || sub.status === "trialing", ...fields };
}
