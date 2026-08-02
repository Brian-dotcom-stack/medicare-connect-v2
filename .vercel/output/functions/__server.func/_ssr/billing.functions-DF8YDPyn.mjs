import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DrFDNDQy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing.functions-DF8YDPyn.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createCheckoutSession_createServerFn_handler = createServerRpc({
	id: "d71b5449b89c25c7001e42fb4d852ee15759f090bcb4e587bd32fd3fea1c0c48",
	name: "createCheckoutSession",
	filename: "src/lib/billing.functions.ts"
}, (opts) => createCheckoutSession.__executeServer(opts));
var createCheckoutSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createCheckoutSession_createServerFn_handler, async ({ data, context }) => {
	const { createCheckout } = await import("./billing.server-XLLNLYhE.mjs");
	return createCheckout({
		supabase: context.supabase,
		userId: context.userId,
		orgId: data.orgId,
		priceId: data.priceId,
		origin: data.origin
	});
});
var createPortalSession_createServerFn_handler = createServerRpc({
	id: "60a15a641d511ebbde21466f836618d5330370d368a3f31800af38ef9be982cb",
	name: "createPortalSession",
	filename: "src/lib/billing.functions.ts"
}, (opts) => createPortalSession.__executeServer(opts));
var createPortalSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createPortalSession_createServerFn_handler, async ({ data, context }) => {
	const { createPortal } = await import("./billing.server-XLLNLYhE.mjs");
	return createPortal({
		supabase: context.supabase,
		userId: context.userId,
		orgId: data.orgId,
		origin: data.origin
	});
});
var syncSubscription_createServerFn_handler = createServerRpc({
	id: "597b0d94ae22e2e31e7185833b595c6ce0f4ccb96f0f5084d2461f7172886f8c",
	name: "syncSubscription",
	filename: "src/lib/billing.functions.ts"
}, (opts) => syncSubscription.__executeServer(opts));
var syncSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(syncSubscription_createServerFn_handler, async ({ data, context }) => {
	const { syncOrgSubscription } = await import("./billing.server-XLLNLYhE.mjs");
	return syncOrgSubscription({
		supabase: context.supabase,
		userId: context.userId,
		orgId: data.orgId
	});
});
var provisionOrgCustomer_createServerFn_handler = createServerRpc({
	id: "17bbd2a281c4ebd55e0f6228b23b49f4735932d56985ef806fcb32f3a2f71d76",
	name: "provisionOrgCustomer",
	filename: "src/lib/billing.functions.ts"
}, (opts) => provisionOrgCustomer.__executeServer(opts));
var provisionOrgCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(provisionOrgCustomer_createServerFn_handler, async ({ data, context }) => {
	const { ensureCustomer } = await import("./billing.server-XLLNLYhE.mjs");
	const { data: org, error } = await context.supabase.from("organisations").select("id, name, stripe_customer_id").eq("id", data.orgId).maybeSingle();
	if (error) throw new Error(error.message);
	if (!org) throw new Error("Organisation not found");
	const { data: profile } = await context.supabase.from("profiles").select("email").eq("id", context.userId).maybeSingle();
	return { customerId: await ensureCustomer(context.supabase, org, profile?.email ?? "") };
});
//#endregion
export { createCheckoutSession_createServerFn_handler, createPortalSession_createServerFn_handler, provisionOrgCustomer_createServerFn_handler, syncSubscription_createServerFn_handler };
