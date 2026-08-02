import { n as PRODUCT_TO_PLAN } from "./plans-DjuebOYH.mjs";
import { t as Stripe } from "../_libs/stripe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.server-XLLNLYhE.js
function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY;
	if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
	return new Stripe(key);
}
async function requireAdminOrg(supabase, userId, orgId) {
	const { data: isAdmin, error: rErr } = await supabase.rpc("has_org_role", {
		_org: orgId,
		_user: userId,
		_role: "admin"
	});
	if (rErr) throw new Error(rErr.message);
	if (!isAdmin) throw new Error("Only organisation admins can manage billing");
	const { data: org, error } = await supabase.from("organisations").select("id, name, stripe_customer_id").eq("id", orgId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!org) throw new Error("Organisation not found");
	return org;
}
/** Ensures the organisation has a Stripe customer, creating one if needed. */
async function ensureCustomer(supabase, org, email) {
	if (org.stripe_customer_id) return org.stripe_customer_id;
	const customer = await getStripe().customers.create({
		name: org.name,
		email,
		metadata: { org_id: org.id }
	});
	const { error } = await supabase.from("organisations").update({ stripe_customer_id: customer.id }).eq("id", org.id);
	if (error) throw new Error(error.message);
	return customer.id;
}
async function createCheckout(args) {
	const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
	const { data: profile } = await args.supabase.from("profiles").select("email").eq("id", args.userId).maybeSingle();
	const customerId = await ensureCustomer(args.supabase, org, profile?.email ?? "");
	const session = await getStripe().checkout.sessions.create({
		customer: customerId,
		mode: "subscription",
		line_items: [{
			price: args.priceId,
			quantity: 1
		}],
		client_reference_id: org.id,
		subscription_data: { metadata: { org_id: org.id } },
		success_url: `${args.origin}/settings/billing?checkout=success`,
		cancel_url: `${args.origin}/settings/billing?checkout=cancelled`
	});
	if (!session.url) throw new Error("Stripe did not return a checkout URL");
	return { url: session.url };
}
async function createPortal(args) {
	const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
	if (!org.stripe_customer_id) throw new Error("No billing account yet — start a subscription first");
	return { url: (await getStripe().billingPortal.sessions.create({
		customer: org.stripe_customer_id,
		return_url: `${args.origin}/settings/billing`
	})).url };
}
function planFromSubscription(sub) {
	const product = sub.items.data[0]?.price?.product;
	const productId = typeof product === "string" ? product : product?.id;
	return productId ? PRODUCT_TO_PLAN[productId] ?? null : null;
}
function subscriptionFields(sub) {
	const periodEnd = sub.items.data[0]?.current_period_end ?? sub.current_period_end ?? null;
	const plan = planFromSubscription(sub);
	return {
		stripe_subscription_id: sub.id,
		subscription_status: sub.status,
		current_period_end: periodEnd ? (/* @__PURE__ */ new Date(periodEnd * 1e3)).toISOString() : null,
		...plan ? { plan } : {}
	};
}
/** Reads the live subscription state from Stripe and mirrors it onto the organisation. */
async function syncOrgSubscription(args) {
	const org = await requireAdminOrg(args.supabase, args.userId, args.orgId);
	if (!org.stripe_customer_id) return { subscribed: false };
	const sub = (await getStripe().subscriptions.list({
		customer: org.stripe_customer_id,
		status: "all",
		limit: 1
	})).data[0];
	if (!sub) {
		await args.supabase.from("organisations").update({
			subscription_status: "canceled",
			stripe_subscription_id: null
		}).eq("id", org.id);
		return { subscribed: false };
	}
	const fields = subscriptionFields(sub);
	const { error } = await args.supabase.from("organisations").update(fields).eq("id", org.id);
	if (error) throw new Error(error.message);
	return {
		subscribed: sub.status === "active" || sub.status === "trialing",
		...fields
	};
}
//#endregion
export { createCheckout, createPortal, ensureCustomer, getStripe, subscriptionFields, syncOrgSubscription };
